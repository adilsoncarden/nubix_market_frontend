import { useCallback, useMemo } from "react";
import { useCart } from "../../../store/CartContext";
import {
    stockToastLimited,
    stockToastMaxReached,
    stockToastOutOfStock,
} from "../../../utils/swalConfig";
import { canIncreaseQty, resolveAddQty } from "../../../utils/stockUtils";

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

    const handleStockLimit = useCallback(() => {
        if (stock <= 0) {
            stockToastOutOfStock();
            return;
        }
        stockToastMaxReached();
    }, [stock]);

    const handleAdd = useCallback(
        async (e, qty = 1) => {
            e?.preventDefault?.();
            e?.stopPropagation?.();
            if (!productPayload) return false;

            const result = resolveAddQty(cartQty, qty, stock);
            if (!result.ok) {
                if (result.reason === "out") {
                    stockToastOutOfStock();
                } else if (result.reason === "max") {
                    stockToastMaxReached();
                } else if (result.reason === "partial") {
                    stockToastLimited(result.available);
                }
                return false;
            }

            return addToCart(productPayload, result.qtyToAdd);
        },
        [addToCart, cartQty, productPayload, stock],
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
            if (!canIncreaseQty(cartQty, stock)) {
                handleStockLimit();
                return false;
            }
            return setQty(productId, cartQty + 1);
        },
        [cartQty, handleStockLimit, productId, setQty, stock],
    );

    return {
        cartQty,
        inCart,
        stock,
        handleAdd,
        handleDecrease,
        handleIncrease,
        handleStockLimit,
        setQty,
        removeFromCart,
    };
}
