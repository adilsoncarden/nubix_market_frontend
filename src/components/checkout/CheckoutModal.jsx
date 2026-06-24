import { useEffect, useMemo, useState } from "react";
import { saleService } from "../../features/sales/services/saleService";
import { profileService } from "../../features/profile/services/profileService";
import { identityService } from "../../features/identity/services/identityService";
import {
    getDocumentoError,
    isValidDocumentoLength,
    sanitizeDocumento,
} from "../../features/identity/utils/documentUtils";
import { mergeWebUserProfile } from "../../utils/authUtils";
import { calcOrderTotals, formatSoles } from "../../utils/pricing";
import { Toast } from "../../utils/swalConfig";
import api from "../../config/axios";
import { useCart } from "../../store/CartContext";
import { useProductCatalog } from "../../store/ProductCatalogContext";
import CheckoutPaymentSimulation from "./CheckoutPaymentSimulation";
import CustomSelect from "../ui/CustomSelect";
import { generateOrderReceiptPdf } from "../../utils/generateOrderReceiptPdf";
import { getCheckoutPaymentOptions } from "../../config/walletPaymentConfig";
import "../../styles/checkout-modal.css";

const PAYMENT_OPTIONS = getCheckoutPaymentOptions();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidEmail(email) {
    const value = email.trim();
    return value.length > 0 && EMAIL_REGEX.test(value);
}

function sanitizePhoneDigits(value) {
    return value.replace(/\D/g, "").slice(0, 9);
}

const enviarEmailConfirmacion = async (orden) => {
    try {
        const res = await api.post("/email/confirmacion", {
            email: orden?.cliente?.email,
            ventaId: orden?.ventaId,
            numero: orden?.numero,
            tipo: orden?.tipo,
            codigoRecojo: orden?.codigoRecojo,
            subtotal: orden?.subtotalBase,
            igv: orden?.igv,
            costoEnvio: orden?.delivery,
            total: orden?.total,
        });
        return res.status === 200;
    } catch {
        return false;
    }
};

function CheckoutStepIndicator({ step }) {
    const steps = [
        { n: 1, label: "Datos" },
        { n: 2, label: "Método" },
        { n: 3, label: "Validar" },
        { n: 4, label: "Confirmar" },
    ];
    return (
        <div className="checkout-steps">
            {steps.map((s, i) => (
                <span key={s.n} className="d-flex align-items-center">
                    <span
                        className={`checkout-step-pill${step === s.n ? " active" : ""}${step > s.n ? " done" : ""}`}
                    >
                        <span>{s.n}</span>
                        {s.label}
                    </span>
                    {i < steps.length - 1 && (
                        <span className="checkout-step-divider" aria-hidden="true" />
                    )}
                </span>
            ))}
        </div>
    );
}

export default function CheckoutModal({ items, onClose, onSuccess }) {
    const { clearCart, reloadCart } = useCart();
    const { invalidate: invalidateCatalog } = useProductCatalog();
    const [tipoEntrega, setTipoEntrega] = useState("FAST_LANE");
    const totals = useMemo(
        () => calcOrderTotals(items, tipoEntrega),
        [items, tipoEntrega],
    );
    const { subtotalBase, igv, subtotalConIgv, delivery, total } = totals;
    const [metodoPagoUi, setMetodoPagoUi] = useState("YAPE");
    const [paymentVerified, setPaymentVerified] = useState(false);
    const [paymentData, setPaymentData] = useState(null);
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [emailOk, setEmailOk] = useState(null);
    const [ventaCreada, setVentaCreada] = useState(null);
    const [orderSummary, setOrderSummary] = useState(null);
    const [errorCheckout, setErrorCheckout] = useState(null);
    const [emailTouched, setEmailTouched] = useState(false);
    const [documentoTouched, setDocumentoTouched] = useState(false);
    const [documentoLookupLoading, setDocumentoLookupLoading] = useState(false);
    const [documentoLookupError, setDocumentoLookupError] = useState("");

    const [form, setForm] = useState({
        documento: "",
        nombreRazonSocial: "",
        email: "",
        telefono: "",
        direccion: "",
        departamento: "",
        provincia: "",
        direccionEntrega: "",
        distrito: "",
        referencia: "",
    });

    const documentoDigits = sanitizeDocumento(form.documento);
    const tipo = documentoDigits.length === 11 ? "factura" : "boleta";

    useEffect(() => {
        let cancelled = false;
        const autofillFromProfile = async () => {
            try {
                const profile = await profileService.getPerfil();
                if (cancelled) return;
                mergeWebUserProfile(profile);
                setForm((prev) => ({
                    ...prev,
                    documento: prev.documento || profile.dniRuc || "",
                    nombreRazonSocial:
                        prev.nombreRazonSocial ||
                        profile.nombreRazonSocial ||
                        profile.username ||
                        "",
                    email: prev.email || profile.email || "",
                    telefono: prev.telefono || profile.telefono || "",
                    direccion:
                        prev.direccion || profile.direccion || "",
                    departamento:
                        prev.departamento || profile.departamento || "",
                    provincia: prev.provincia || profile.provincia || "",
                    direccionEntrega:
                        prev.direccionEntrega || profile.direccion || "",
                    distrito: prev.distrito || profile.distrito || "",
                    referencia:
                        prev.referencia || profile.referencia || "",
                }));
            } catch {
                /* checkout puede continuar sin perfil */
            }
        };
        autofillFromProfile();
        return () => {
            cancelled = true;
        };
    }, []);

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const deliveryDisabled = tipoEntrega !== "DELIVERY";
    const selectedPayment = PAYMENT_OPTIONS.find((p) => p.uiKey === metodoPagoUi);

    const buildOrderSummary = (ventaFromPayment = null) => {
        const snapshotItems = items.map((item) => ({ ...item }));
        const computed = calcOrderTotals(snapshotItems, tipoEntrega);
        return {
            items: snapshotItems,
            subtotalBase:
                ventaFromPayment?.subtotal ?? computed.subtotalBase,
            igv: ventaFromPayment?.igv ?? computed.igv,
            subtotalConIgv:
                ventaFromPayment?.subtotal != null &&
                ventaFromPayment?.igv != null
                    ? ventaFromPayment.subtotal + ventaFromPayment.igv
                    : computed.subtotalConIgv,
            delivery: ventaFromPayment?.costoEnvio ?? computed.delivery,
            total: ventaFromPayment?.total ?? computed.total,
            tipoEntrega,
        };
    };

    const confirmSummary =
        orderSummary ??
        buildOrderSummary(ventaCreada);

    useEffect(() => {
        setPaymentVerified(false);
        setPaymentData(null);
    }, [metodoPagoUi]);

    const handlePaymentVerified = async (data) => {
        setOrderSummary(buildOrderSummary(data?.venta ?? null));
        setPaymentData(data);
        setPaymentVerified(true);
        if (data?.venta) {
            setVentaCreada(data.venta);
            try {
                await clearCart();
                await reloadCart();
                invalidateCatalog();
            } catch (err) {
                console.error("[Checkout] Error sincronizando carrito tras Stripe:", err);
            }
        }
    };

    const handleResetPaymentVerification = () => {
        setPaymentVerified(false);
        setPaymentData(null);
    };

    const handlePaymentMethodChange = (uiKey) => {
        setMetodoPagoUi(uiKey);
    };

    const handleContinueToValidation = () => {
        setStep(3);
    };

    const handleContinueToConfirm = () => {
        if (!paymentVerified) {
            Toast.fire({
                icon: "warning",
                title: "Debes completar el pago",
            });
            return;
        }
        setOrderSummary((prev) => prev ?? buildOrderSummary(ventaCreada));
        setStep(4);
    };

    const emailError = (() => {
        const value = form.email.trim();
        if (!value) return "El correo electrónico es obligatorio.";
        if (!isValidEmail(value)) {
            return "Ingresa un correo electrónico válido (ej: nombre@ejemplo.com).";
        }
        return null;
    })();

    const documentoError = documentoTouched
        ? getDocumentoError(form.documento)
        : null;

    const valido =
        isValidDocumentoLength(form.documento) &&
        form.nombreRazonSocial.trim() &&
        (documentoDigits.length !== 11 || form.direccion.trim());

    const emailValido = !emailError;

    const entregaValida =
        tipoEntrega !== "DELIVERY" ||
        (form.direccionEntrega.trim() && form.distrito.trim());

    const canContinueStep1 = valido && emailValido && entregaValida;

    const handleTelefonoChange = (e) => {
        setForm((f) => ({
            ...f,
            telefono: sanitizePhoneDigits(e.target.value),
        }));
    };

    const handleDocumentoChange = (e) => {
        setDocumentoLookupError("");
        setForm((f) => ({
            ...f,
            documento: sanitizeDocumento(e.target.value),
        }));
    };

    const handleDocumentoBlur = async () => {
        setDocumentoTouched(true);
        const digits = sanitizeDocumento(form.documento);
        if (!isValidDocumentoLength(digits)) return;

        setDocumentoLookupLoading(true);
        setDocumentoLookupError("");
        try {
            const data = await identityService.consultar(digits);
            setForm((f) => ({
                ...f,
                nombreRazonSocial:
                    data.nombreRazonSocial || f.nombreRazonSocial,
                ...(digits.length === 11
                    ? {
                          direccion: data.direccion || f.direccion,
                          departamento: data.departamento || f.departamento,
                          provincia: data.provincia || f.provincia,
                          distrito: data.distrito || f.distrito,
                      }
                    : {}),
            }));
        } catch (err) {
            setDocumentoLookupError(
                err.response?.data?.message ||
                    "No se pudo validar el documento. Verifica el número.",
            );
        } finally {
            setDocumentoLookupLoading(false);
        }
    };

    const handleContinueToPayment = () => {
        setEmailTouched(true);
        if (canContinueStep1) {
            setStep(2);
        }
    };

    const displayName = form.nombreRazonSocial;
    const displayDoc = form.documento;

    const buildCheckoutPayload = () => {
        const isFactura = documentoDigits.length === 11;
        return {
            tipoComprobante: isFactura ? "FACTURA" : "BOLETA",
            metodoPago: "TARJETA",
            tipoEntrega,
            nombreComprobante: isFactura ? null : form.nombreRazonSocial,
            dni: isFactura ? null : documentoDigits,
            ruc: isFactura ? documentoDigits : null,
            razonSocial: isFactura ? form.nombreRazonSocial : null,
            emailComprobante: form.email,
            direccionFiscal: isFactura ? form.direccion : null,
            direccionEntrega:
                tipoEntrega === "DELIVERY" ? form.direccionEntrega : null,
            distrito: tipoEntrega === "DELIVERY" ? form.distrito : null,
            referencia: tipoEntrega === "DELIVERY" ? form.referencia : null,
            detalles: items.map((item) => ({
                productoId: item.id,
                cantidad: item.qty,
            })),
        };
    };

    const stripeOrderRef = useMemo(
        () => `nubix_checkout_${Date.now()}`,
        // eslint-disable-next-line react-hooks/exhaustive-deps -- referencia estable por apertura del modal
        [],
    );

    const handleConfirmar = async () => {
        setLoading(true);
        setErrorCheckout(null);
        const fecha = new Date().toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const metodoPago = selectedPayment?.metodoPago ?? "YAPE";

        try {
            const venta =
                ventaCreada ??
                (await saleService.checkout({
                    tipoComprobante:
                        documentoDigits.length === 11 ? "FACTURA" : "BOLETA",
                    metodoPago,
                    tipoEntrega,
                    nombreComprobante:
                        documentoDigits.length === 11
                            ? null
                            : form.nombreRazonSocial,
                    dni:
                        documentoDigits.length === 11 ? null : documentoDigits,
                    ruc:
                        documentoDigits.length === 11 ? documentoDigits : null,
                    razonSocial:
                        documentoDigits.length === 11
                            ? form.nombreRazonSocial
                            : null,
                    emailComprobante: form.email,
                    direccionFiscal:
                        documentoDigits.length === 11 ? form.direccion : null,
                    direccionEntrega:
                        tipoEntrega === "DELIVERY"
                            ? form.direccionEntrega
                            : null,
                    distrito:
                        tipoEntrega === "DELIVERY" ? form.distrito : null,
                    referencia:
                        tipoEntrega === "DELIVERY" ? form.referencia : null,
                    detalles: confirmSummary.items.map((item) => ({
                        productoId: item.id,
                        cantidad: item.qty,
                    })),
                }));

            if (!ventaCreada) {
                setVentaCreada(venta);
            }
            const numero = `V-${String(venta.id).padStart(5, "0")}`;
            const orden = {
                ventaId: venta.id,
                tipo,
                numero,
                fecha,
                codigoRecojo: venta.codigoRecojo,
                cliente:
                    documentoDigits.length === 8
                        ? {
                              nombre: form.nombreRazonSocial,
                              dni: documentoDigits,
                              email: form.email,
                          }
                        : {
                              razonSocial: form.nombreRazonSocial,
                              ruc: documentoDigits,
                              direccion: form.direccion,
                              email: form.email,
                          },
                items: confirmSummary.items,
                subtotalBase: venta.subtotal ?? confirmSummary.subtotalBase,
                igv: venta.igv ?? confirmSummary.igv,
                delivery: venta.costoEnvio ?? confirmSummary.delivery,
                total: venta.total ?? confirmSummary.total,
            };

            const ok = await enviarEmailConfirmacion(orden);
            setEmailOk(ok);
            await generateOrderReceiptPdf(orden);
            setStep("success");
            onSuccess(venta);
        } catch (err) {
            console.error(
                "[Checkout] Error:",
                err.response?.data ?? err.message,
            );
            setErrorCheckout(
                typeof err.response?.data === "string"
                    ? err.response.data
                    : "No se pudo registrar la venta. Verifica stock e intenta de nuevo.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay checkout-modal" onClick={onClose}>
            <div
                className="modal-pago modal-pago-xl checkout-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-pago-header">
                    <h5 className="modal-pago-title">
                        <i className="bi bi-lock me-2"></i>Finalizar compra
                    </h5>
                    <button
                        type="button"
                        className="modal-pago-close"
                        onClick={onClose}
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {step !== "success" && <CheckoutStepIndicator step={step} />}

                {/* Paso 1: Facturación y envío */}
                {step === 1 && (
                    <div className="modal-pago-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="checkout-form-label">
                                    DNI / RUC
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className={`form-control checkout-input w-100${documentoError || documentoLookupError ? " checkout-input-invalid" : ""}`}
                                    maxLength={11}
                                    value={form.documento}
                                    onChange={handleDocumentoChange}
                                    onBlur={handleDocumentoBlur}
                                />
                                {documentoLookupLoading && (
                                    <span className="field-hint">
                                        Validando documento...
                                    </span>
                                )}
                                {(documentoError || documentoLookupError) && (
                                    <span className="checkout-field-error">
                                        {documentoError || documentoLookupError}
                                    </span>
                                )}
                                {!documentoError &&
                                    !documentoLookupError &&
                                    documentoDigits && (
                                        <span className="field-hint">
                                            {tipo === "factura"
                                                ? "Factura (RUC — 11 dígitos)"
                                                : "Boleta (DNI — 8 dígitos)"}
                                        </span>
                                    )}
                            </div>

                            <div className="col-md-6">
                                <label className="checkout-form-label">
                                    Nombre y Apellidos / Razón Social
                                </label>
                                <input
                                    type="text"
                                    className="form-control checkout-input w-100"
                                    value={form.nombreRazonSocial}
                                    onChange={(e) =>
                                        setForm((f) => ({
                                            ...f,
                                            nombreRazonSocial: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="checkout-form-label">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={9}
                                    className="form-control checkout-input w-100"
                                    placeholder=""
                                    value={form.telefono}
                                    onChange={handleTelefonoChange}
                                    onPaste={(e) => {
                                        e.preventDefault();
                                        const pasted = (
                                            e.clipboardData || window.clipboardData
                                        ).getData("text");
                                        setForm((f) => ({
                                            ...f,
                                            telefono: sanitizePhoneDigits(pasted),
                                        }));
                                    }}
                                    onKeyDown={(e) => {
                                        if (
                                            [
                                                "Backspace",
                                                "Delete",
                                                "Tab",
                                                "ArrowLeft",
                                                "ArrowRight",
                                                "Home",
                                                "End",
                                            ].includes(e.key)
                                        ) {
                                            return;
                                        }
                                        if (!/^\d$/.test(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="checkout-form-label">
                                    Dirección de correo electrónico
                                </label>
                                <input
                                    type="email"
                                    className={`form-control checkout-input w-100${emailTouched && emailError ? " checkout-input-invalid" : ""}`}
                                    value={form.email}
                                    onChange={(e) => {
                                        set("email")(e);
                                        if (emailTouched) setEmailTouched(true);
                                    }}
                                    onBlur={() => setEmailTouched(true)}
                                    autoComplete="email"
                                />
                                {emailTouched && emailError ? (
                                    <span className="checkout-field-error">
                                        {emailError}
                                    </span>
                                ) : (
                                    <span className="field-hint">
                                        Se enviará la confirmación a este correo
                                    </span>
                                )}
                            </div>

                            {documentoDigits.length === 11 && (
                                <div className="col-12">
                                    <label className="checkout-form-label">
                                        Dirección fiscal
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control checkout-input w-100"
                                        value={form.direccion}
                                        onChange={set("direccion")}
                                    />
                                </div>
                            )}

                            <div className="col-12">
                                <label className="checkout-form-label">
                                    Tipo de entrega
                                </label>
                                <CustomSelect
                                    className="checkout-input checkout-select"
                                    value={tipoEntrega}
                                    onChange={(e) =>
                                        setTipoEntrega(e.target.value)
                                    }
                                    options={[
                                        {
                                            value: "FAST_LANE",
                                            label: "Fast Lane (recojo en tienda)",
                                        },
                                        {
                                            value: "DELIVERY",
                                            label: "Delivery",
                                        },
                                    ]}
                                />
                            </div>

                            <div
                                className={`col-12 checkout-delivery-disabled-wrap${deliveryDisabled ? " is-disabled" : ""}`}
                            >
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="checkout-form-label">
                                            Distrito de Lima
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control checkout-input w-100"
                                            value={form.distrito}
                                            onChange={set("distrito")}
                                            disabled={deliveryDisabled}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="checkout-form-label">
                                            Dirección completa
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control checkout-input w-100"
                                            value={form.direccionEntrega}
                                            onChange={set("direccionEntrega")}
                                            disabled={deliveryDisabled}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label className="checkout-form-label">
                                            Información adicional / Notas
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control checkout-input w-100"
                                            value={form.referencia}
                                            onChange={set("referencia")}
                                            disabled={deliveryDisabled}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-mini-resumen">
                            <span>{items.length} productos</span>
                            <span className="modal-total-amount">
                                {formatSoles(total)}
                            </span>
                        </div>

                        {errorCheckout && (
                            <div className="alert alert-danger py-2 small mt-3">
                                {errorCheckout}
                            </div>
                        )}

                        <div className="checkout-modal-actions">
                            <button
                                type="button"
                                className="btn-modal-confirmar checkout-btn-primary"
                                onClick={handleContinueToPayment}
                                disabled={!canContinueStep1}
                            >
                                Continuar al método de pago →
                            </button>
                        </div>
                    </div>
                )}

                {/* Paso 2: Método de pago */}
                {step === 2 && (
                    <div className="modal-pago-body checkout-step-panel">
                        <p className="text-muted small mb-3">
                            Selecciona cómo deseas pagar tu pedido.
                        </p>

                        <div className="checkout-payment-options">
                            {PAYMENT_OPTIONS.map((opt) => (
                                <label
                                    key={opt.uiKey}
                                    className={`checkout-payment-option${metodoPagoUi === opt.uiKey ? " selected" : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name="metodoPagoUi"
                                        value={opt.uiKey}
                                        checked={metodoPagoUi === opt.uiKey}
                                        onChange={() =>
                                            handlePaymentMethodChange(opt.uiKey)
                                        }
                                    />
                                    <span>
                                        <span className="checkout-payment-option-title">
                                            {opt.label}
                                        </span>
                                    </span>
                                </label>
                            ))}
                        </div>

                        <div className="checkout-modal-actions">
                            <button
                                type="button"
                                className="btn-modal-back checkout-btn-secondary"
                                onClick={() => setStep(1)}
                            >
                                ← Regresar
                            </button>
                            <button
                                type="button"
                                className="btn-modal-confirmar checkout-btn-primary"
                                onClick={handleContinueToValidation}
                            >
                                Continuar a validar pago →
                            </button>
                        </div>
                    </div>
                )}

                {/* Paso 3: Validación de pago */}
                {step === 3 && (
                    <div className="modal-pago-body checkout-step-panel checkout-step-panel--stripe">
                        <p className="text-muted small mb-3 text-center">
                            Valida tu pago con{" "}
                            <strong>{selectedPayment?.label}</strong> para
                            continuar.
                        </p>

                        <CheckoutPaymentSimulation
                            selectedPayment={selectedPayment}
                            metodoPagoUi={metodoPagoUi}
                            total={total}
                            paymentVerified={paymentVerified}
                            onPaymentVerified={handlePaymentVerified}
                            onResetVerification={handleResetPaymentVerification}
                            customerEmail={form.email}
                            checkoutPayload={buildCheckoutPayload()}
                            orderRef={stripeOrderRef}
                        />

                        <div className="checkout-modal-actions">
                            <button
                                type="button"
                                className="btn-modal-back checkout-btn-secondary"
                                onClick={() => setStep(2)}
                            >
                                ← Cambiar método
                            </button>
                            <button
                                type="button"
                                className="btn-modal-confirmar checkout-btn-primary"
                                onClick={handleContinueToConfirm}
                                disabled={!paymentVerified}
                            >
                                Revisar pedido →
                            </button>
                        </div>
                    </div>
                )}

                {/* Paso 4: Confirmar pedido */}
                {step === 4 && (
                    <div className="modal-pago-body checkout-step-panel">
                        <div className="checkout-review-summary">
                            <div className="confirm-header mb-0">
                                <i className="bi bi-clipboard-check confirm-icon"></i>
                                <h6 className="mb-0">Confirma tu pedido</h6>
                            </div>
                            <div className="checkout-review-grid">
                                <div className="confirm-row">
                                    <span>Comprobante</span>
                                    <strong>
                                        {tipo === "boleta"
                                            ? "Boleta electrónica"
                                            : "Factura electrónica"}
                                    </strong>
                                </div>
                                <div className="confirm-row">
                                    <span>Nombre</span>
                                    <strong>{displayName}</strong>
                                </div>
                                <div className="confirm-row">
                                    <span>
                                        {documentoDigits.length === 8
                                            ? "DNI"
                                            : "RUC"}
                                    </span>
                                    <strong>{displayDoc}</strong>
                                </div>
                                <div className="confirm-row">
                                    <span>Email</span>
                                    <strong>{form.email}</strong>
                                </div>
                                {form.telefono.trim() && (
                                    <div className="confirm-row">
                                        <span>Teléfono</span>
                                        <strong>{form.telefono}</strong>
                                    </div>
                                )}
                                <div className="confirm-row">
                                    <span>Pago</span>
                                    <strong>{selectedPayment?.label}</strong>
                                </div>
                                {paymentData?.codigoOperacion && (
                                    <div className="confirm-row">
                                        <span>Cód. operación</span>
                                        <strong>
                                            {paymentData.codigoOperacion}
                                        </strong>
                                    </div>
                                )}
                                {paymentData?.stripePaymentIntentId && (
                                    <div className="confirm-row">
                                        <span>Ref. Stripe</span>
                                        <strong className="small">
                                            {paymentData.stripePaymentIntentId}
                                        </strong>
                                    </div>
                                )}
                                {paymentData?.cardLast4 && (
                                    <div className="confirm-row">
                                        <span>Tarjeta</span>
                                        <strong>
                                            **** {paymentData.cardLast4}
                                        </strong>
                                    </div>
                                )}
                                {paymentVerified && (
                                    <div className="confirm-row">
                                        <span>Estado pago</span>
                                        <strong className="text-success">
                                            Validado
                                        </strong>
                                    </div>
                                )}
                                <div className="confirm-row">
                                    <span>Entrega</span>
                                    <strong>
                                        {tipoEntrega === "DELIVERY"
                                            ? "Delivery"
                                            : "Fast Lane"}
                                    </strong>
                                </div>
                            </div>
                        </div>

                        <div className="confirm-items">
                            {confirmSummary.items.map((item) => (
                                <div key={item.id} className="confirm-item">
                                    <span>
                                        {item.name} × {item.qty}
                                    </span>
                                    <span>
                                        S/ {(item.price * item.qty).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="confirm-totales">
                            <div className="confirm-row">
                                <span>Subtotal (sin IGV)</span>
                                <span>
                                    {formatSoles(confirmSummary.subtotalBase)}
                                </span>
                            </div>
                            <div className="confirm-row">
                                <span>IGV (13%)</span>
                                <span>{formatSoles(confirmSummary.igv)}</span>
                            </div>
                            {confirmSummary.tipoEntrega === "DELIVERY" && (
                                <div className="confirm-row">
                                    <span>Delivery</span>
                                    <span>
                                        {confirmSummary.delivery === 0
                                            ? "Gratis"
                                            : formatSoles(confirmSummary.delivery)}
                                    </span>
                                </div>
                            )}
                            <div className="confirm-row total checkout-total-highlight">
                                <span>TOTAL</span>
                                <span>{formatSoles(confirmSummary.total)}</span>
                            </div>
                        </div>

                        <p className="confirm-aviso">
                            <i className="bi bi-info-circle me-1"></i>
                            Se generará el PDF y se enviará la confirmación a{" "}
                            <strong>{form.email}</strong>
                        </p>

                        {errorCheckout && (
                            <div className="alert alert-danger py-2 small">
                                {errorCheckout}
                            </div>
                        )}

                        <div className="checkout-modal-actions">
                            <button
                                type="button"
                                className="btn-modal-back checkout-btn-secondary"
                                onClick={() => setStep(3)}
                            >
                                ← Editar
                            </button>
                            <button
                                type="button"
                                className="btn-modal-confirmar checkout-btn-primary"
                                onClick={handleConfirmar}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="bi bi-hourglass-split me-2"></i>
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-lg me-2"></i>
                                        Confirmar y pagar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {step === "success" && (
                    <div className="modal-pago-body success-body">
                        <div className="success-icon-wrap">
                            <i className="bi bi-check-circle-fill success-icon"></i>
                        </div>
                        <h5 className="success-title">Compra realizada</h5>
                        <p className="success-msg">
                            Pedido registrado correctamente. Tu comprobante se
                            ha descargado.
                        </p>
                        {ventaCreada?.codigoRecojo && (
                            <p className="success-msg fw-bold">
                                Código de recojo: {ventaCreada.codigoRecojo}
                            </p>
                        )}
                        {emailOk === true && (
                            <p className="success-email ok">
                                <i className="bi bi-envelope-check me-1"></i>
                                Confirmación enviada a {form.email}
                            </p>
                        )}
                        {emailOk === false && (
                            <p className="success-email fail">
                                <i className="bi bi-envelope-x me-1"></i>
                                No se pudo enviar el email. Revisa tu backend.
                            </p>
                        )}
                        <button
                            type="button"
                            className="btn-modal-confirmar checkout-btn-primary"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
