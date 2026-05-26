import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
} from "react";
import { useProductCatalog } from "./ProductCatalogContext";
import { useAuth } from "./AuthContext";
import api from "../config/axios";
import { productService } from "../features/products/services/productService";
import { getProductImageUrl } from "../features/products/services/productService";
import { mapProductosToShopItems } from "../features/products/utils/mapProducto";

const CartContext = createContext(null);
const KEY = "nubix_cart";

const PLACEHOLDER_IMAGE =
    "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80";

function mapCarritoToItems(carrito) {
    const items = Array.isArray(carrito?.items) ? carrito.items : [];
    return items.map((it) => {
        const p = it.producto || {};
        return {
            id: p.id,
            name: p.nombre ?? "",
            category: p.categoria?.nombre ?? "",
            price: Number(p.precioVenta) || 0,
            unit: "und",
            stock: p.stock ?? 0,
            codigo: p.codigo ?? "",
            img: getProductImageUrl(p.imagen) || PLACEHOLDER_IMAGE,
            qty: it.cantidad ?? 1,
        };
    });
}

function reducer(state, { type, product, id, qty, synced, items }) {
    switch (type) {
        case "ADD": {
            const found = state.find((i) => i.id === product.id);
            return found
                ? state.map((i) =>
                      i.id === product.id ? { ...i, qty: i.qty + 1 } : i,
                  )
                : [...state, { ...product, qty: 1 }];
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
    const [items, dispatch] = useReducer(reducer, [], () => {
        try {
            return JSON.parse(localStorage.getItem(KEY)) || [];
        } catch {
            return [];
        }
    });

    const syncCartWithCatalog = useCallback(async () => {
        if (items.length === 0) return;
        try {
            const data = await productService.getCatalog({ bustCache: true });
            const synced = mapProductosToShopItems(data);
            dispatch({ type: "SYNC_PRODUCTS", synced });
        } catch (err) {
            console.error("Error sincronizando carrito con catálogo", err);
        }
    }, [items.length]);

    const loadServerCart = useCallback(async () => {
        const res = await api.get("/carrito");
        dispatch({ type: "SET_ALL", items: mapCarritoToItems(res.data) });
    }, []);

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        if (version > 0) {
            syncCartWithCatalog();
        }
    }, [version, syncCartWithCatalog]);

    useEffect(() => {
        const migrateIfNeeded = async () => {
            if (!token) return;
            try {
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

    const totalItems = items.reduce((s, i) => s + i.qty, 0);
    const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                totalPrice,
                addToCart: async (p) => {
                    if (!token) return dispatch({ type: "ADD", product: p });
                    const res = await api.post("/carrito/items", {
                        productoId: p.id,
                        cantidad: 1,
                    });
                    dispatch({ type: "SET_ALL", items: mapCarritoToItems(res.data) });
                },
                removeFromCart: async (id) => {
                    if (!token) return dispatch({ type: "REMOVE", id });
                    const res = await api.delete(`/carrito/items/${id}`);
                    dispatch({ type: "SET_ALL", items: mapCarritoToItems(res.data) });
                },
                setQty: async (id, qty) => {
                    if (!token) return dispatch({ type: "SET_QTY", id, qty });
                    const res = await api.put(`/carrito/items/${id}`, null, {
                        params: { cantidad: qty },
                    });
                    dispatch({ type: "SET_ALL", items: mapCarritoToItems(res.data) });
                },
                clearCart: async () => {
                    if (!token) return dispatch({ type: "CLEAR" });
                    await api.delete("/carrito");
                    dispatch({ type: "CLEAR" });
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
