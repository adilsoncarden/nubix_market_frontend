/** Mensajes amigables para códigos de error frecuentes de Stripe. */
const STRIPE_ERROR_MESSAGES = {
    card_declined: "Tu tarjeta fue rechazada. Verifica los datos o usa otro medio de pago.",
    expired_card: "La tarjeta está vencida. Usa una tarjeta vigente.",
    incorrect_cvc: "El código de seguridad (CVV) es incorrecto.",
    processing_error: "Error al procesar la tarjeta. Intenta de nuevo en unos segundos.",
    insufficient_funds: "Fondos insuficientes en la tarjeta.",
};

/**
 * @returns {string} Llave pública Stripe (pk_test_...) desde variables de entorno.
 */
export function getStripePublishableKey() {
    return import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() || "";
}

/**
 * Convierte soles (PEN) a céntimos enteros para Stripe.
 * @param {number} soles
 * @returns {number}
 */
export function solesToStripeAmount(soles) {
    return Math.round(Number(soles) * 100);
}

/**
 * Traduce un error de Stripe.js a mensaje legible.
 * @param {import('@stripe/stripe-js').StripeError | null | undefined} error
 * @returns {string}
 */
export function mapStripeJsError(error) {
    if (!error) {
        return "No se pudo procesar el pago. Intenta de nuevo.";
    }
    if (error.code && STRIPE_ERROR_MESSAGES[error.code]) {
        return STRIPE_ERROR_MESSAGES[error.code];
    }
    return error.message || "No se pudo procesar el pago con tarjeta.";
}

/**
 * Extrae mensaje de error desde la respuesta Axios del backend (/ventas/cargo).
 * @param {import('axios').AxiosError} error
 * @returns {string}
 */
export function mapStripeApiError(error) {
    const data = error?.response?.data;
    if (typeof data === "string" && data.trim()) {
        return data;
    }
    if (data?.message) {
        return data.message;
    }
    if (error?.message) {
        return error.message;
    }
    return "El pago no pudo completarse. Revisa los datos e intenta de nuevo.";
}
