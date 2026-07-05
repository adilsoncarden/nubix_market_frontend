/**
 * Configuración de billeteras digitales (Yape / Plin).
 * Valores por defecto simulados; pueden sobreescribirse con variables VITE_* o,
 * en el futuro, datos del backend vía props en el checkout.
 */

const MERCHANT_NAME =
    import.meta.env.VITE_WALLET_MERCHANT_NAME?.trim() || "Nubix Market SAC";

export const WALLET_KEYS = {
    YAPE: "YAPE",
    PLIN: "PLIN",
};

export const WALLET_PAYMENT_CONFIG = {
    [WALLET_KEYS.YAPE]: {
        uiKey: WALLET_KEYS.YAPE,
        metodoPago: "YAPE",
        label: "Yape",
        phone: import.meta.env.VITE_YAPE_PHONE?.replace(/\D/g, "") || "999999999",
        phoneDisplay:
            import.meta.env.VITE_YAPE_PHONE_DISPLAY?.trim() || "999 999 999",
        merchantName: MERCHANT_NAME,
        /** URL de imagen QR estática (fallback si no se usa generación dinámica) */
        qrImageUrl: import.meta.env.VITE_YAPE_QR_IMAGE_URL?.trim() || "",
        /** Logo centrado dentro del QR (qrcode.react imageSettings) */
        qrLogoUrl: import.meta.env.VITE_YAPE_QR_LOGO_URL?.trim() || "",
        brandColor: "#742284",
        scanHint: "Escanea con la app Yape",
    },
    [WALLET_KEYS.PLIN]: {
        uiKey: WALLET_KEYS.PLIN,
        metodoPago: "YAPE",
        label: "Plin",
        phone: import.meta.env.VITE_PLIN_PHONE?.replace(/\D/g, "") || "988888888",
        phoneDisplay:
            import.meta.env.VITE_PLIN_PHONE_DISPLAY?.trim() || "988 888 888",
        merchantName: MERCHANT_NAME,
        qrImageUrl: import.meta.env.VITE_PLIN_QR_IMAGE_URL?.trim() || "",
        qrLogoUrl: import.meta.env.VITE_PLIN_QR_LOGO_URL?.trim() || "",
        brandColor: "#00A19A",
        scanHint: "Escanea con la app Plin",
    },
};

/**
 * Cadena codificada en el QR. Formato legible y extensible para integración futura.
 * @param {string} walletKey - YAPE | PLIN
 * @param {{ amount: number, orderRef?: string }} params
 */
export function buildWalletQrPayload(walletKey, { amount, orderRef } = {}) {
    const config = WALLET_PAYMENT_CONFIG[walletKey];
    if (!config) return "";

    const safeAmount = Number.isFinite(amount) ? Number(amount.toFixed(2)) : 0;
    const ref = orderRef || `NUBIX-${Date.now()}`;

    return [
        `NUBIX-MARKET`,
        `WALLET:${walletKey}`,
        `PHONE:51${config.phone}`,
        `MERCHANT:${config.merchantName}`,
        `AMOUNT:PEN ${safeAmount.toFixed(2)}`,
        `REF:${ref}`,
    ].join("|");
}

/** Opciones de pago del checkout (Yape, Plin, tarjeta). */
export function getCheckoutPaymentOptions() {
    const yape = WALLET_PAYMENT_CONFIG[WALLET_KEYS.YAPE];
    const plin = WALLET_PAYMENT_CONFIG[WALLET_KEYS.PLIN];

    return [
        {
            uiKey: yape.uiKey,
            metodoPago: yape.metodoPago,
            label: yape.label,
            detailTitle: yape.label,
            detailLines: [`Número: ${yape.phoneDisplay}`, yape.merchantName],
        },
        {
            uiKey: plin.uiKey,
            metodoPago: plin.metodoPago,
            label: plin.label,
            detailTitle: plin.label,
            detailLines: [`Número: ${plin.phoneDisplay}`, plin.merchantName],
        },
        {
            uiKey: "TARJETA",
            metodoPago: "TARJETA",
            label: "Pago con tarjeta",
            detailTitle: "Pago con tarjeta",
            detailLines: ["Completa el formulario para procesar tu pago."],
        },
    ];
}
