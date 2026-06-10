import { useCallback, useMemo } from "react";
import { useCart } from "../../../store/CartContext";

export function findCartItem(items, productId) {
    if (productId == null) return undefined;
    return items.find(
        (item) =>
            item.id === productId ||
            String(item.id) === String(productId),
    );
}

/**
 * Cantidad y acciones de carrito para un producto (fuente única: CartContext).
 */
export function useCartProductQty(productId, productPayload = null) {
    const { items, addToCart, setQty, removeFromCart } = useCart();

    const cartItem = useMemo(
        () => findCartItem(items, productId),
        [items, productId],
    );
    const cartQty = cartItem?.qty || 0;
    const inCart = cartQty > 0;
    const stock = productPayload?.stock ?? cartItem?.stock ?? 0;

    const handleAdd = useCallback(
        async (e, qty = 1) => {
            e?.preventDefault?.();
            e?.stopPropagation?.();
            if (!productPayload) return false;
            const amount = Math.max(1, Math.floor(Number(qty) || 1));
            return addToCart(productPayload, amount);
        },
        [addToCart, productPayload],
    );

    const handleDecrease = useCallback(
        async (e) => {
            e?.preventDefault?.();
            e?.stopPropagation?.();
            if (cartQty <= 0 || productId == null) return false;
            if (cartQty === 1) {
                return removeFromCart(productId);
            }
            return setQty(productId, cartQty - 1);
        },
        [cartQty, productId, removeFromCart, setQty],
    );

    const handleIncrease = useCallback(
        async (e) => {
            e?.preventDefault?.();
            e?.stopPropagation?.();
            if (cartQty <= 0 || productId == null) return false;
            if (stock > 0 && cartQty >= stock) return false;
            return setQty(productId, cartQty + 1);
        },
        [cartQty, productId, setQty, stock],
    );

    return {
        cartQty,
        inCart,
        stock,
        handleAdd,
        handleDecrease,
        handleIncrease,
        setQty,
        removeFromCart,
    };
}
