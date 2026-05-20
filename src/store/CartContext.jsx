import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);
const KEY = "nubix_cart";

function reducer(state, { type, product, id, qty }) {
  switch (type) {
    case "ADD": {
      const found = state.find((i) => i.id === product.id);
      return found
        ? state.map((i) => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state, { ...product, qty: 1 }];
    }
    case "REMOVE":  return state.filter((i) => i.id !== id);
    case "SET_QTY": return qty < 1
      ? state.filter((i) => i.id !== id)
      : state.map((i) => i.id === id ? { ...i, qty } : i);
    case "CLEAR":   return [];
    default:        return state;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [], () => {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const totalItems = items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalPrice,
      addToCart:      (p)       => dispatch({ type: "ADD",     product: p }),
      removeFromCart: (id)      => dispatch({ type: "REMOVE",  id }),
      setQty:         (id, qty) => dispatch({ type: "SET_QTY", id, qty }),
      clearCart:      ()        => dispatch({ type: "CLEAR" }),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
};