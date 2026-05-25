import {
    createContext,
    useContext,
    useReducer,
    useEffect,
    useCallback,
} from "react";
import { useProductCatalog } from "./ProductCatalogContext";
import { productService } from "../features/products/services/productService";
import { mapProductosToShopItems } from "../features/products/utils/mapProducto";

const CartContext = createContext(null);
const KEY = "nubix_cart";

function reducer(state, { type, product, id, qty, synced }) {
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

    useEffect(() => {
        localStorage.setItem(KEY, JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        if (version > 0) {
            syncCartWithCatalog();
        }
    }, [version, syncCartWithCatalog]);

    const totalItems = items.reduce((s, i) => s + i.qty, 0);
    const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                totalItems,
                totalPrice,
                addToCart: (p) => dispatch({ type: "ADD", product: p }),
                removeFromCart: (id) => dispatch({ type: "REMOVE", id }),
                setQty: (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
                clearCart: () => dispatch({ type: "CLEAR" }),
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
