import { loadStripe } from "@stripe/stripe-js";

let stripePromise = null;
let cachedPublishableKey = null;

/**
 * Promesa singleton de Stripe.js (recomendado por Stripe para evitar recargas).
 * Se recrea solo si cambia la clave pública en el entorno.
 * @returns {Promise<import('@stripe/stripe-js').Stripe | null> | null}
 */
export function getStripePromise() {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() || "";
    if (!key) {
        return null;
    }
    if (!stripePromise || cachedPublishableKey !== key) {
        cachedPublishableKey = key;
        stripePromise = loadStripe(key);
    }
    return stripePromise;
}
