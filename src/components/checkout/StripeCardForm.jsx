import { useEffect, useState } from "react";
import {
    CardElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { Toast } from "../../utils/swalConfig";
import { formatSoles } from "../../utils/pricing";
import { saleService } from "../../features/sales/services/saleService";
import {
    mapStripeApiError,
    mapStripeJsError,
} from "../../utils/stripeCheckout";

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#0f172a",
            fontFamily:
                'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
            fontSize: "16px",
            lineHeight: "24px",
            fontSmoothing: "antialiased",
            "::placeholder": {
                color: "#94a3b8",
            },
        },
        invalid: {
            color: "#dc2626",
            iconColor: "#dc2626",
        },
    },
    hidePostalCode: true,
};

function StripeCardFields({ onReady, onLoadError }) {
    const stripe = useStripe();
    const elements = useElements();

    if (!stripe || !elements) {
        return (
            <div
                className="checkout-stripe-element checkout-stripe-element--loading"
                aria-live="polite"
            >
                <span
                    className="spinner-border spinner-border-sm text-success"
                    role="status"
                    aria-hidden="true"
                />
                <span className="ms-2 small text-muted">
                    Cargando campos seguros de tarjeta...
                </span>
            </div>
        );
    }

    return (
        <CardElement
            id="stripe-card-element"
            className="checkout-stripe-element"
            options={CARD_ELEMENT_OPTIONS}
            onReady={onReady}
            onLoadError={onLoadError}
        />
    );
}

export default function StripeCardForm({
    total,
    customerEmail,
    checkoutPayload,
    paymentVerified,
    onPaymentVerified,
    onResetVerification,
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [cardError, setCardError] = useState("");
    const [cardProcessing, setCardProcessing] = useState(false);
    const [cardFieldsReady, setCardFieldsReady] = useState(false);

    useEffect(() => {
        setCardFieldsReady(false);
    }, [customerEmail]);

    const handleCardReady = () => {
        setCardFieldsReady(true);
        setCardError("");
    };

    const handleCardLoadError = (event) => {
        console.error("[Stripe] CardElement load error:", event.error);
        setCardFieldsReady(false);
        setCardError(
            event.error?.message ||
                "No se pudieron cargar los campos de tarjeta. Recarga la página.",
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setCardError("");
        onResetVerification();

        if (!stripe || !elements) {
            setCardError(
                "Stripe aún no está listo. Espera un momento e intenta de nuevo.",
            );
            return;
        }

        if (!cardFieldsReady) {
            setCardError(
                "Los campos de tarjeta aún se están cargando. Espera un momento.",
            );
            return;
        }

        if (!customerEmail?.trim()) {
            setCardError(
                "Ingresa tu correo electrónico en el paso 1 antes de pagar con tarjeta.",
            );
            return;
        }

        if (!checkoutPayload) {
            setCardError("Faltan datos del pedido. Vuelve al paso anterior.");
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setCardError("No se pudo cargar el formulario de tarjeta.");
            return;
        }

        setCardProcessing(true);

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: {
                    email: customerEmail.trim(),
                },
            });

            if (error) {
                setCardError(mapStripeJsError(error));
                return;
            }

            const response = await saleService.stripeCargo({
                paymentMethodId: paymentMethod.id,
                email: customerEmail.trim(),
                monto: total,
                checkout: checkoutPayload,
            });

            const cardLast4 = paymentMethod.card?.last4 ?? null;

            onPaymentVerified({
                method: "TARJETA",
                stripePaymentIntentId: response.stripePaymentIntentId,
                cardLast4,
                venta: response.venta,
            });

            Toast.fire({
                icon: "success",
                title: "Pago con tarjeta aprobado",
            });
        } catch (error) {
            console.error(
                "[Stripe] Error cargo:",
                error.response?.data ?? error.message,
            );
            setCardError(mapStripeApiError(error));
        } finally {
            setCardProcessing(false);
        }
    };

    return (
        <form className="checkout-card-form" onSubmit={handleSubmit} noValidate>
            <div className="checkout-stripe-card-visual mb-3">
                <div className="checkout-stripe-card-chip" aria-hidden="true" />
                <div className="checkout-stripe-card-number-placeholder">
                    •••• •••• •••• ••••
                </div>
                <div className="checkout-stripe-card-meta">
                    <span>TITULAR</span>
                    <span>MM/AA</span>
                </div>
            </div>

            <div className="checkout-stripe-info text-center mb-3">
                <div className="checkout-stripe-icon mx-auto mb-2">
                    <i className="bi bi-shield-lock-fill" />
                </div>
                <p className="checkout-payment-hint mb-1">
                    Pago seguro procesado por <strong>Stripe</strong>.
                    Los datos de tu tarjeta no pasan por nuestros servidores.
                </p>
                {customerEmail?.trim() ? (
                    <p className="small text-muted mb-0">
                        Comprobante y cargo a:{" "}
                        <strong>{customerEmail}</strong>
                    </p>
                ) : (
                    <p className="small text-danger mb-0">
                        Completa tu correo en el paso 1 para continuar.
                    </p>
                )}
            </div>

            <label
                className="form-label small fw-semibold d-flex align-items-center gap-1 mb-2"
                htmlFor="stripe-card-element"
            >
                Datos de la tarjeta
                <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-muted checkout-stripe-tooltip"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Aceptamos Visa, Mastercard y Amex. En modo prueba usa 4242 4242 4242 4242, fecha futura y CVV de 3 dígitos."
                    aria-label="Información sobre tarjetas de prueba"
                >
                    <i className="bi bi-info-circle" />
                </button>
            </label>

            <StripeCardFields
                onReady={handleCardReady}
                onLoadError={handleCardLoadError}
            />

            <ul className="checkout-stripe-test-hints small text-muted mb-3">
                <li>Modo Sandbox (tarjetas de prueba Stripe).</li>
                <li>
                    Total a cobrar: <strong>{formatSoles(total)}</strong>
                </li>
                <li>El cobro se confirma al instante si la tarjeta es válida.</li>
            </ul>

            {cardError && (
                <div
                    className="alert alert-danger py-2 small mb-3"
                    role="alert"
                >
                    <i className="bi bi-exclamation-triangle me-1" />
                    {cardError}
                </div>
            )}

            <button
                type="submit"
                className="btn checkout-btn-primary checkout-payment-action-btn"
                disabled={
                    cardProcessing ||
                    paymentVerified ||
                    !customerEmail?.trim() ||
                    !stripe ||
                    !cardFieldsReady
                }
            >
                {cardProcessing ? (
                    <>
                        <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                        />
                        Procesando pago...
                    </>
                ) : paymentVerified ? (
                    <>
                        <i className="bi bi-check-circle me-2" />
                        Pago aprobado
                    </>
                ) : (
                    <>
                        <i className="bi bi-credit-card me-2" />
                        Procesar pago
                    </>
                )}
            </button>
        </form>
    );
}
