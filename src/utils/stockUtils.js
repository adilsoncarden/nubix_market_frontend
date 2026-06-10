export function getProductStock(product) {
    return Math.max(0, Number(product?.stock ?? 0));
}

export function isOutOfStock(product) {
    return getProductStock(product) <= 0;
}

export function clampQtyToStock(qty, stock) {
    const safeStock = Math.max(0, Number(stock) || 0);
    const safeQty = Math.max(0, Math.floor(Number(qty) || 0));
    if (safeStock <= 0) return 0;
    return Math.min(safeQty, safeStock);
}

export function canIncreaseQty(currentQty, stock) {
    const safeStock = Math.max(0, Number(stock) || 0);
    if (safeStock <= 0) return false;
    return Math.max(0, Number(currentQty) || 0) < safeStock;
}

export function resolveAddQty(currentQty, requestedQty, stock) {
    const safeStock = Math.max(0, Number(stock) || 0);
    const prevQty = Math.max(0, Number(currentQty) || 0);
    const amount = Math.max(1, Math.floor(Number(requestedQty) || 1));

    if (safeStock <= 0) {
        return { ok: false, reason: "out", qtyToAdd: 0 };
    }
    if (prevQty >= safeStock) {
        return { ok: false, reason: "max", qtyToAdd: 0 };
    }
    if (prevQty + amount > safeStock) {
        return {
            ok: false,
            reason: "partial",
            qtyToAdd: safeStock - prevQty,
            available: safeStock,
        };
    }
    return { ok: true, reason: null, qtyToAdd: amount, available: safeStock };
}
