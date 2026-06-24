import { useEffect, useMemo, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { Tooltip } from "bootstrap";
import Swal from "sweetalert2";
import { Toast } from "../../utils/swalConfig";
import { formatSoles } from "../../utils/pricing";
import { getStripePromise } from "../../config/stripeClient";
import { WALLET_KEYS } from "../../config/walletPaymentConfig";
import WalletQrCode from "./WalletQrCode";
import StripeCardForm from "./StripeCardForm";

const WALLET_UI_KEYS = new Set([WALLET_KEYS.YAPE, WALLET_KEYS.PLIN]);

export default function CheckoutPaymentSimulation({
    selectedPayment,
    metodoPagoUi,
    total,
    paymentVerified,
    onPaymentVerified,
    onResetVerification,
    walletQrPayload,
    walletQrImageUrl,
    orderRef,
    customerEmail,
    checkoutPayload,
}) {
    const [stripeLoadError, setStripeLoadError] = useState("");

    const stripePublishableKey =
        import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY?.trim() || "";

    const stripePromise = useMemo(
        () => getStripePromise(),
        [stripePublishableKey],
    );

    useEffect(() => {
        console.log(
            "Stripe Key activa:",
            import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
        );

        if (!stripePublishableKey) {
            setStripeLoadError(
                "La pasarela de pagos no está configurada (VITE_STRIPE_PUBLISHABLE_KEY).",
            );
            return;
        }

        setStripeLoadError("");
    }, [stripePublishableKey]);

    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll(
            '[data-bs-toggle="tooltip"]',
        );
        const tooltips = Array.from(tooltipTriggerList).map(
            (el) => new Tooltip(el),
        );
        return () => tooltips.forEach((t) => t.dispose());
    }, [metodoPagoUi, paymentVerified]);

    if (!selectedPayment) return null;

    const isWallet = WALLET_UI_KEYS.has(metodoPagoUi);
    const isCard = metodoPagoUi === "TARJETA";

    const openWalletValidationModal = async () => {
        const result = await Swal.fire({
            title: "Validación de pago",
            html: `
                <div class="text-start checkout-swal-form">
                    <p class="small text-muted mb-3">
                        Ingresa los datos de tu operación en ${selectedPayment.label}.
                    </p>
                    <label class="form-label small fw-semibold" for="payment-codigo">
                        Código de operación <span class="text-danger">*</span>
                    </label>
                    <input
                        id="payment-codigo"
                        type="text"
                        class="form-control mb-3"
                        placeholder="Ej: 20240607123456"
                        maxlength="30"
                    />
                    <label class="form-label small fw-semibold" for="payment-monto">
                        Monto pagado (opcional)
                    </label>
                    <input
                        id="payment-monto"
                        type="number"
                        step="0.01"
                        min="0"
                        class="form-control"
                        placeholder="${total.toFixed(2)}"
                    />
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Validar pago",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#134d27",
            cancelButtonColor: "#64748b",
            reverseButtons: true,
            focusConfirm: false,
            customClass: {
                popup: "checkout-swal-popup",
                confirmButton: "checkout-swal-confirm",
            },
            preConfirm: () => {
                const codigo = document
                    .getElementById("payment-codigo")
                    ?.value.trim();
                if (!codigo) {
                    Swal.showValidationMessage(
                        "El código de operación es obligatorio.",
                    );
                    return false;
                }
                const montoRaw = document
                    .getElementById("payment-monto")
                    ?.value.trim();

                return {
                    method: metodoPagoUi,
                    codigoOperacion: codigo,
                    montoPagado: montoRaw ? Number(montoRaw) : null,
                };
            },
        });

        if (result.isConfirmed && result.value) {
            onPaymentVerified(result.value);
            Toast.fire({
                icon: "success",
                title: "Pago validado correctamente",
            });
        }
    };

    return (
        <div className="checkout-payment-simulation">
            <div className="checkout-validation-card">
                <div className="checkout-validation-header">
                    <span className="checkout-validation-method-badge">
                        {selectedPayment.label}
                    </span>
                    <p className="checkout-validation-total mb-0">
                        Total a pagar:{" "}
                        <strong>{formatSoles(total)}</strong>
                    </p>
                </div>

                {isWallet && (
                    <div className="checkout-wallet-panel">
                        <div className="checkout-wallet-info">
                            {selectedPayment.detailLines.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                        </div>
                        <WalletQrCode
                            walletKey={metodoPagoUi}
                            amount={total}
                            orderRef={orderRef}
                            qrPayload={walletQrPayload}
                            qrImageUrl={walletQrImageUrl}
                        />
                        <p className="checkout-payment-hint text-center mb-0">
                            Realiza el pago escaneando el QR y luego valida
                            aquí
                        </p>
                        <button
                            type="button"
                            className="btn checkout-btn-primary checkout-payment-action-btn"
                            onClick={openWalletValidationModal}
                            disabled={paymentVerified}
                        >
                            <i className="bi bi-phone me-2" />
                            {paymentVerified
                                ? "Pago confirmado"
                                : "Ya realicé el pago"}
                        </button>
                    </div>
                )}

                {isCard && (
                    <>
                        {stripeLoadError && (
                            <div
                                className="alert alert-warning py-2 small mb-3"
                                role="alert"
                            >
                                <i className="bi bi-exclamation-triangle me-1" />
                                {stripeLoadError}
                            </div>
                        )}
                        {stripePromise ? (
                            <Elements stripe={stripePromise}>
                                <StripeCardForm
                                    total={total}
                                    customerEmail={customerEmail}
                                    checkoutPayload={checkoutPayload}
                                    paymentVerified={paymentVerified}
                                    onPaymentVerified={onPaymentVerified}
                                    onResetVerification={onResetVerification}
                                />
                            </Elements>
                        ) : (
                            !stripeLoadError && (
                                <div className="text-center py-3">
                                    <span
                                        className="spinner-border spinner-border-sm text-success"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                    <p className="small text-muted mt-2 mb-0">
                                        Cargando pasarela segura...
                                    </p>
                                </div>
                            )
                        )}
                    </>
                )}

                {paymentVerified && (
                    <div
                        className="checkout-payment-verified"
                        role="status"
                        aria-live="polite"
                    >
                        <i className="bi bi-shield-check" aria-hidden="true" />
                        <span>
                            Pago validado — puedes continuar al siguiente paso
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
