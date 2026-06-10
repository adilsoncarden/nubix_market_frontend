import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
    useState,
} from "react";
import { useProductCatalog } from "./ProductCatalogContext";
import { useAuth } from "./AuthContext";
import api from "../config/axios";
import { productService } from "../features/products/services/productService";
import {
    resolveProductImageUrl,
    PRODUCT_PLACEHOLDER_IMAGE,
} from "../features/products/services/productService";
import { mapProductosToShopItems } from "../features/products/utils/mapProducto";
import { priceWithIgv, normalizeCartItem } from "../utils/pricing";
import {
    cartToastFirstAdded,
    cartToastRemovedComplete,
    promptLoginRequired,
} from "../utils/swalConfig";
import {
    hasWebSessionToken,
    loadCartFromLocalStorage,
} from "../utils/cartStorage";

const CartContext = createContext(null);
const KEY = "nubix_cart";

function readInitialCartItems() {
    if (!hasWebSessionToken()) return [];
    return loadCartFromLocalStorage();
}

/** Conserva el orden visual del cliente al sincronizar respuesta del servidor. */
function mergeCartPreservingOrder(prevItems, carritoResponse) {
    const serverItems = mapCarritoToItems(carritoResponse);
    if (!prevItems?.length) return serverItems;
    const byId = Object.fromEntries(serverItems.map((it) => [it.id, it]));
    const ordered = prevItems
        .map((prev) => byId[prev.id])
        .filter(Boolean);
    const prevIds = new Set(prevItems.map((i) => i.id));
    const appended = serverItems.filter((it) => !prevIds.has(it.id));
    return [...ordered, ...appended];
}

function mapCarritoToItems(carrito) {
    const items = Array.isArray(carrito?.items) ? carrito.items : [];
    const byProductId = new Map();

    for (const it of items) {
        const p = it.producto || {};
        const productId = p.id;
        if (productId == null) continue;

        const priceBase = Number(p.precioVenta) || 0;
        const qty = Number(it.cantidad) || 1;
        const mapped = {
            id: productId,
            name: p.nombre ?? "",
            category: p.categoria?.nombre ?? "",
            priceBase,
            price: priceWithIgv(priceBase),
            unit: "und",
            stock: p.stock ?? 0,
            codigo: p.codigo ?? "",
            img: resolveProductImageUrl(p) || PRODUCT_PLACEHOLDER_IMAGE,
            qty,
        };

        const existing = byProductId.get(productId);
        if (existing) {
            existing.qty += qty;
        } else {
            byProductId.set(productId, mapped);
        }
    }

    return Array.from(byProductId.values());
}

function reducer(state, { type, product, id, qty, synced, items }) {
    switch (type) {
        case "ADD": {
            const qtyToAdd = Math.max(1, Number(product?.qtyToAdd) || 1);
            const normalized = normalizeCartItem(product, qtyToAdd);
            const found = state.find((i) => i.id === normalized.id);
            return found
                ? state.map((i) =>
                      i.id === normalized.id
                          ? { ...i, qty: i.qty + qtyToAdd }
                          : i,
                  )
                : [...state, normalized];
        }
        case "REMOVE":
            return state.filter((i) => i.id !== id);
        case "SET_QTY":
            return qty < 1
                ? state.filter((i) => i.id !== id)
                : state.map((i) => (i.id === id ? { ...i, qty } : i));
        case "CLEAR":
            return [];
        case "SET_ALL":
            return Array.isArray(items) ? items : [];
        case "SYNC_PRODUCTS": {
            if (!synced?.length) return state;
            const byId = Object.fromEntries(synced.map((p) => [p.id, p]));
            return state.map((item) => {
                const fresh = byId[item.id];
                if (!fresh) return item;
                return {
                    ...item,
                    name: fresh.name,
                    img: fresh.img,
                    priceBase: fresh.priceBase,
                    price: fresh.price,
                    category: fresh.category,
                    stock: fresh.stock,
                };
            });
        }
        default:
            return state;
    }
}

export function CartProvider({ children }) {
    const { version } = useProductCatalog();
    const { token } = useAuth();
    const [items, dispatch] = useReducer(reducer, [], readInitialCartItems);
    const [cartAnimationTick, setCartAnimationTick] = useState(0);

    const bumpCartIcon = () => setCartAnimationTick((t) => t + 1);

    const syncCartWithCatalog = useCallback(async () => {
        if (!token || items.length === 0) return;
        try {
            const data = await productService.getCatalog({ bustCache: true });
            const synced = mapProductosToShopItems(data);
            dispatch({ type: "SYNC_PRODUCTS", synced });
        } catch (err) {
            console.error("Error sincronizando carrito con catálogo", err);
        }
    }, [items.length, token]);

    const loadServerCart = useCallback(async () => {
        const res = await api.get("/carrito");
        dispatch({ type: "SET_ALL", items: mapCarritoToItems(res.data) });
    }, []);

    useEffect(() => {
        if (token) {
            localStorage.setItem(KEY, JSON.stringify(items));
        }
    }, [items, token]);

    useEffect(() => {
        if (!token) {
            dispatch({ type: "CLEAR" });
            localStorage.removeItem(KEY);
        }
    }, [token]);

    useEffect(() => {
        if (version > 0) {
            syncCartWithCatalog();
        }
    }, [version, syncCartWithCatalog]);

    useEffect(() => {
        const migrateIfNeeded = async () => {
            if (!token) return;
            try {
                const serverRes = await api.get("/carrito");
                const serverItems = mapCarritoToItems(serverRes.data);
                if (serverItems.length > 0) {
                    dispatch({ type: "SET_ALL", items: serverItems });
                    localStorage.removeItem(KEY);
                    return;
                }

                const local = (() => {
                    try {
                        return JSON.parse(localStorage.getItem(KEY)) || [];
                    } catch {
                        return [];
                    }
                })();

                if (Array.isArray(local) && local.length > 0) {
                    for (const it of local) {
                        if (!it?.id || !it?.qty) continue;
                        await api.post("/carrito/items", {
                            productoId: it.id,
                            cantidad: it.qty,
                        });
                    }
                    localStorage.removeItem(KEY);
                }
            } catch (err) {
                console.error("Error migrando carrito local a servidor", err);
            } finally {
                try {
                    await loadServerCart();
                } catch (err) {
                    console.error("Error cargando carrito de servidor", err);
                }
            }
        };

        migrateIfNeeded();
    }, [token, loadServerCart]);

    const totalItems = token ? items.length : 0;
    const totalUnits = token
        ? items.reduce((s, i) => s + i.qty, 0)
        : 0;
    const totalPrice = token
        ? items.reduce((s, i) => s + i.price * i.qty, 0)
        : 0;
    const totalPriceBase = token
        ? items.reduce((s, i) => s + (i.priceBase ?? 0) * i.qty, 0)
        : 0;

    const requireLoginForCart = async () => {
        await promptLoginRequired();
        return false;
    };

    return (
        <CartContext.Provider
            value={{
                items: token ? items : [],
                totalItems,
                totalUnits,
                cartAnimationTick,
                totalPrice,
                totalPriceBase,
                addToCart: async (p, qty = 1) => {
                    if (!token) return requireLoginForCart();
                    const amount = Math.max(1, Math.floor(Number(qty) || 1));
                    const isFirstAdd = !items.some((i) => i.id === p.id);
                    const res = await api.post("/carrito/items", {
                        productoId: p.id,
                        cantidad: amount,
                    });
                    dispatch({
                        type: "SET_ALL",
                        items: mergeCartPreservingOrder(items, res.data),
                    });
                    bumpCartIcon();
                    if (isFirstAdd) {
                        cartToastFirstAdded();
                    }
                    return true;
                },
                removeFromCart: async (id) => {
                    if (!token) return requireLoginForCart();
                    const hadItem = items.some((i) => i.id === id);
                    const res = await api.delete(`/carrito/items/${id}`);
                    dispatch({
                        type: "SET_ALL",
                        items: mergeCartPreservingOrder(items, res.data),
                    });
                    bumpCartIcon();
                    if (hadItem) {
                        cartToastRemovedComplete();
                    }
                    return true;
                },
                setQty: async (id, qty) => {
                    if (!token) return requireLoginForCart();
                    const prevQty =
                        items.find((i) => i.id === id)?.qty ?? 0;
                    const res = await api.put(`/carrito/items/${id}`, null, {
                        params: { cantidad: qty },
                    });
                    dispatch({
                        type: "SET_ALL",
                        items: mergeCartPreservingOrder(items, res.data),
                    });
                    bumpCartIcon();
                    if (prevQty === 1 && qty < 1) {
                        cartToastRemovedComplete();
                    }
                    return true;
                },
                reloadCart: async () => {
                    if (!token) return;
                    try {
                        await loadServerCart();
                    } catch (err) {
                        console.error("Error recargando carrito", err);
                    }
                },
                clearCart: async () => {
                    if (!token) return false;
                    try {
                        await api.delete("/carrito");
                    } catch (err) {
                        console.error("Error vaciando carrito en servidor", err);
                    }
                    dispatch({ type: "CLEAR" });
                    localStorage.removeItem(KEY);
                    return true;
                },
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
    return ctx;
};
