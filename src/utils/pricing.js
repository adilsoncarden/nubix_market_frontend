/**
 * Cálculo de precios alineado con VentaService (backend).
 * precioVenta en BD = base sin IGV; el total final suma IGV 13%.
 */

export const IGV_RATE = 0.13;
export const ENVIO_GRATIS_DESDE = 100;
export const COSTO_ENVIO_DEFAULT = 8;

export const round2 = (value) =>
    Math.round((Number(value) + Number.EPSILON) * 100) / 100;

export const priceWithIgv = (basePrice) =>
    round2((Number(basePrice) || 0) * (1 + IGV_RATE));

export const igvFromBase = (baseSubtotal) =>
    round2((Number(baseSubtotal) || 0) * IGV_RATE);

export const calcShippingCost = (subtotalBase, tipoEntrega) => {
    if (tipoEntrega !== "DELIVERY") return 0;
    const base = Number(subtotalBase) || 0;
    if (base >= ENVIO_GRATIS_DESDE) return 0;
    return COSTO_ENVIO_DEFAULT;
};

/**
 * @param {Array<{ priceBase?: number, price?: number, qty: number }>} items
 * @param {string} [tipoEntrega] PRESENCIAL | FAST_LANE | DELIVERY
 */
export const calcOrderTotals = (items, tipoEntrega = "PRESENCIAL") => {
    const subtotalBase = round2(
        (items || []).reduce((sum, item) => {
            const base =
                item.priceBase != null
                    ? Number(item.priceBase)
                    : Number(item.price) / (1 + IGV_RATE);
            return sum + base * (item.qty || 0);
        }, 0),
    );
    const igv = igvFromBase(subtotalBase);
    const subtotalConIgv = round2(subtotalBase + igv);
    const delivery = calcShippingCost(subtotalBase, tipoEntrega);
    const total = round2(subtotalBase + igv + delivery);

    return {
        subtotalBase,
        igv,
        subtotalConIgv,
        delivery,
        total,
    };
};

export const lineTotalWithIgv = (priceBase, qty) =>
    round2(priceWithIgv(priceBase) * (qty || 0));

/** Normaliza un producto para el carrito (siempre con priceBase y price con IGV). */
export const normalizeCartItem = (product, qty = 1) => {
    const priceBase =
        product.priceBase != null
            ? Number(product.priceBase)
            : round2(Number(product.price || 0) / (1 + IGV_RATE));
    const price =
        product.price != null
            ? Number(product.price)
            : priceWithIgv(priceBase);
    return {
        ...product,
        priceBase,
        price,
        qty: product.qty ?? qty,
    };
};

export const formatSoles = (value) => `S/ ${round2(value).toFixed(2)}`;
