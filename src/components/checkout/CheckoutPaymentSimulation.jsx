import { useState } from "react";
import Swal from "sweetalert2";
import { Toast } from "../../utils/swalConfig";
import { formatSoles } from "../../utils/pricing";
import { WALLET_KEYS } from "../../config/walletPaymentConfig";
import WalletQrCode from "./WalletQrCode";
import {
    delay,
    formatCardNumberDisplay,
    sanitizeCardNumber,
    sanitizeCvv,
    sanitizeExpiry,
    validateCardForm,
} from "./checkoutPaymentUtils";

const WALLET_UI_KEYS = new Set([WALLET_KEYS.YAPE, WALLET_KEYS.PLIN]);

export default function CheckoutPaymentSimulation({
    selectedPayment,
    metodoPagoUi,
    total,
    paymentVerified,
    onPaymentVerified,
    onResetVerification,
    /** Override futuro: payload o imagen QR desde backend */
    walletQrPayload,
    walletQrImageUrl,
    orderRef,
}) {
    const [cardForm, setCardForm] = useState({
        cardNumber: "",
        cardHolder: "",
        expiry: "",
        cvv: "",
    });
    const [cardError, setCardError] = useState("");
    const [cardProcessing, setCardProcessing] = useState(false);

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

    const handleProcessCard = async () => {
        const error = validateCardForm(cardForm);
        if (error) {
            setCardError(error);
            return;
        }

        setCardError("");
        setCardProcessing(true);
        onResetVerification();

        try {
            await delay(1500);
            const digits = sanitizeCardNumber(cardForm.cardNumber);
            onPaymentVerified({
                method: "TARJETA",
                cardLast4: digits.slice(-4),
                cardHolder: cardForm.cardHolder.trim(),
            });
            Toast.fire({
                icon: "success",
                title: "Pago aprobado",
            });
        } finally {
            setCardProcessing(false);
        }
    };

    const updateCard = (field) => (e) => {
        let value = e.target.value;
        if (field === "cardNumber") {
            value = formatCardNumberDisplay(value);
        } else if (field === "expiry") {
            value = sanitizeExpiry(value);
        } else if (field === "cvv") {
            value = sanitizeCvv(value);
        }
        setCardForm((prev) => ({ ...prev, [field]: value }));
        setCardError("");
        onResetVerification();
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
                    <div className="checkout-card-form">
                        <p className="checkout-payment-hint text-center mb-3">
                            Simulación de pago con tarjeta. No se realizará un
                            cobro real.
                        </p>
                        <div className="row g-3">
                            <div className="col-12">
                                <label
                                    className="checkout-form-label"
                                    htmlFor="checkout-card-number"
                                >
                                    Número de tarjeta
                                </label>
                                <input
                                    id="checkout-card-number"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="cc-number"
                                    className="form-control checkout-input w-100"
                                    placeholder="1234 5678 9012 3456"
                                    value={cardForm.cardNumber}
                                    onChange={updateCard("cardNumber")}
                                    disabled={cardProcessing || paymentVerified}
                                />
                            </div>
                            <div className="col-12">
                                <label
                                    className="checkout-form-label"
                                    htmlFor="checkout-card-holder"
                                >
                                    Nombre del titular
                                </label>
                                <input
                                    id="checkout-card-holder"
                                    type="text"
                                    autoComplete="cc-name"
                                    className="form-control checkout-input w-100"
                                    placeholder="Como aparece en la tarjeta"
                                    value={cardForm.cardHolder}
                                    onChange={updateCard("cardHolder")}
                                    disabled={cardProcessing || paymentVerified}
                                />
                            </div>
                            <div className="col-6">
                                <label
                                    className="checkout-form-label"
                                    htmlFor="checkout-card-expiry"
                                >
                                    Fecha de expiración
                                </label>
                                <input
                                    id="checkout-card-expiry"
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="cc-exp"
                                    className="form-control checkout-input w-100"
                                    placeholder="MM/AA"
                                    value={cardForm.expiry}
                                    onChange={updateCard("expiry")}
                                    disabled={cardProcessing || paymentVerified}
                                />
                            </div>
                            <div className="col-6">
                                <label
                                    className="checkout-form-label"
                                    htmlFor="checkout-card-cvv"
                                >
                                    CVV
                                </label>
                                <input
                                    id="checkout-card-cvv"
                                    type="password"
                                    inputMode="numeric"
                                    autoComplete="cc-csc"
                                    className="form-control checkout-input w-100"
                                    placeholder="123"
                                    value={cardForm.cvv}
                                    onChange={updateCard("cvv")}
                                    disabled={cardProcessing || paymentVerified}
                                />
                            </div>
                        </div>
                        {cardError && (
                            <span className="checkout-field-error d-block mt-2">
                                {cardError}
                            </span>
                        )}
                        <button
                            type="button"
                            className="btn checkout-btn-primary checkout-payment-action-btn mt-3"
                            onClick={handleProcessCard}
                            disabled={cardProcessing || paymentVerified}
                        >
                            {cardProcessing ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
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
                    </div>
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
