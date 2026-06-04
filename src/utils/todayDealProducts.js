const MAX_TODAY_DEALS = 4;

function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i += 1) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

/**
 * Hasta 4 productos con etiqueta "Solo por hoy" (estable por día e ids).
 */
export function getTodayDealIdSet(productIds = []) {
    const ids = productIds.filter((id) => id != null && id !== "");
    if (!ids.length) return new Set();

    const dayKey = new Date().toISOString().slice(0, 10);
    const ranked = ids
        .map((id) => ({
            id,
            score: hashString(`${dayKey}-${id}`),
        }))
        .sort((a, b) => a.score - b.score);

    return new Set(ranked.slice(0, MAX_TODAY_DEALS).map((r) => r.id));
}

export function isTodayDealProduct(productId, productIds = []) {
    return getTodayDealIdSet(productIds).has(productId);
}
