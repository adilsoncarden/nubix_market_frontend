const PROMO_SHARE = 0.3;

function normalizeId(id) {
    if (id == null || id === "") return null;
    return String(id);
}

function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i += 1) {
        h = (h << 5) - h + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

/**
 * ~30% de productos con etiqueta "Solo por hoy" (estable por día e id).
 */
export function isTodayDealProduct(productId) {
    const normalized = normalizeId(productId);
    if (!normalized) return false;

    const dayKey = new Date().toISOString().slice(0, 10);
    const bucket = hashString(`${dayKey}-${normalized}`) % 100;
    return bucket < PROMO_SHARE * 100;
}
