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
import api from "../../config/axios";
import "../../styles/checkout-modal.css";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function isValidEmail(email) {
    const value = email.trim();
    return value.length > 0 && EMAIL_REGEX.test(value);
}

function sanitizePhoneDigits(value) {
    return value.replace(/\D/g, "").slice(0, 9);
}

const PAYMENT_OPTIONS = [
    {
        uiKey: "TRANSFERENCIA",
        metodoPago: "TRANSFERENCIA",
        label: "Transferencia bancaria directa - BCP",
        detailTitle: "Banco de Crédito del Perú - BCP",
        detailLines: [
            "Soles: 194 9949 1810 76",
            "a nombre de Nubix Market SAC",
        ],
    },
    {
        uiKey: "YAPE",
        metodoPago: "YAPE",
        label: "Yape",
        detailTitle: "Yape",
        detailLines: ["Número: 994 949 181", "a nombre de Nubix Market SAC"],
    },
    {
        uiKey: "PLIN",
        metodoPago: "YAPE",
        label: "Plin",
        detailTitle: "Plin",
        detailLines: ["Número: 994 949 181", "a nombre de Nubix Market SAC"],
    },
    {
        uiKey: "TARJETA",
        metodoPago: "TARJETA",
        label: "Pago con tarjeta",
        detailTitle: "Pago con tarjeta",
        detailLines: [
            "Coordinaremos el cobro con tarjeta al confirmar tu pedido.",
        ],
    },
];

const generarPDF = async (orden) => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    const {
        tipo,
        numero,
        fecha,
        cliente,
        items,
        subtotalBase,
        igv,
        delivery,
        total,
        codigoRecojo,
    } = orden;

    const VERDE_NUBIX = [34, 153, 84];
    const NEGRO_TEXTO = [40, 40, 40];
    const GRIS_FONDO = [245, 245, 245];
    const AMARILLO_TOTAL = [255, 235, 59];

    doc.setFillColor(...VERDE_NUBIX);
    doc.rect(0, 0, 210, 55, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("NUBIX", 15, 22);
    doc.text("MARKET", 15, 32);

    doc.setFontSize(18);
    doc.text(
        tipo === "boleta" ? "BOLETA ELECTRÓNICA" : "FACTURA ELECTRÓNICA",
        195,
        35,
        { align: "right" },
    );

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("(55) 1234-5678", 15, 45);
    doc.text("Calle San Pedro, Comas", 15, 50);

    doc.setTextColor(...NEGRO_TEXTO);
    doc.setFontSize(10);

    doc.text("FECHA:", 15, 75);
    doc.text(fecha, 195, 75, { align: "right" });

    doc.text("CLIENTE:", 15, 83);
    const nombreCliente =
        tipo === "boleta" ? cliente.nombre : cliente.razonSocial;
    doc.setFont("helvetica", "bold");
    doc.text(nombreCliente.toUpperCase(), 195, 83, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.text(tipo === "boleta" ? "DNI:" : "RUC:", 15, 91);
    doc.text(tipo === "boleta" ? cliente.dni : cliente.ruc, 195, 91, {
        align: "right",
    });

    doc.text("CÓDIGO PEDIDO:", 15, 99);
    doc.setTextColor(...VERDE_NUBIX);
    doc.setFont("helvetica", "bold");
    doc.text(numero, 195, 99, { align: "right" });

    if (codigoRecojo) {
        doc.setTextColor(...NEGRO_TEXTO);
        doc.setFont("helvetica", "normal");
        doc.text("CÓDIGO DE RECOJO:", 15, 107);
        doc.setTextColor(...VERDE_NUBIX);
        doc.setFont("helvetica", "bold");
        doc.text(String(codigoRecojo), 195, 107, { align: "right" });
    }

    const tableY = codigoRecojo ? 123 : 115;
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(15, tableY, 195, tableY);

    doc.setTextColor(...NEGRO_TEXTO);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Articulo", 17, tableY + 7);
    doc.text("Cantidad", 110, tableY + 7);
    doc.text("Precio", 145, tableY + 7);
    doc.text("SubTotal", 193, tableY + 7, { align: "right" });

    doc.line(15, tableY + 11, 195, tableY + 11);

    let currentY = tableY + 19;
    doc.setFont("helvetica", "normal");

    items.forEach((item, index) => {
        if (index % 2 === 0) {
            doc.setFillColor(...GRIS_FONDO);
            doc.rect(15, currentY - 6, 180, 8, "F");
        }
        doc.text(item.name.substring(0, 45), 17, currentY);
        doc.text(String(item.qty), 118, currentY, { align: "center" });
        doc.text(`S/ ${item.price.toFixed(2)}`, 145, currentY);
        doc.text(`S/ ${(item.price * item.qty).toFixed(2)}`, 193, currentY, {
            align: "right",
        });
        currentY += 8;
    });

    currentY += 10;
    doc.setFontSize(10);
    doc.text("Subtotal (sin IGV):", 155, currentY, { align: "right" });
    doc.text(`S/ ${(subtotalBase ?? 0).toFixed(2)}`, 193, currentY, {
        align: "right",
    });

    currentY += 7;
    doc.text("IGV (13%):", 155, currentY, { align: "right" });
    doc.text(`S/ ${(igv ?? 0).toFixed(2)}`, 193, currentY, { align: "right" });

    if ((delivery ?? 0) > 0) {
        currentY += 7;
        doc.text("Envío:", 155, currentY, { align: "right" });
        doc.text(`S/ ${delivery.toFixed(2)}`, 193, currentY, {
            align: "right",
        });
    }

    currentY += 5;
    doc.setFillColor(...AMARILLO_TOTAL);
    doc.rect(130, currentY, 65, 10, "F");
    doc.setDrawColor(0);
    doc.rect(130, currentY, 65, 10, "D");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Total:", 155, currentY + 7, { align: "right" });
    doc.text(`S/ ${total.toFixed(2)}`, 190, currentY + 7, { align: "right" });

    currentY += 30;
    doc.setFontSize(16);
    doc.setTextColor(...NEGRO_TEXTO);
    doc.text("¡Gracias por su compra!", 15, currentY);
    doc.setLineWidth(1);
    doc.line(15, currentY + 2, 35, currentY + 2);

    const footerY = 245;
    doc.setFillColor(...VERDE_NUBIX);
    doc.rect(0, footerY, 210, 52, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Información de pago", 15, footerY + 15);
    doc.setFont("helvetica", "normal");
    doc.text("Nubix Market SAC", 15, footerY + 23);
    doc.text("BCP - Cuenta Corriente", 15, footerY + 28);
    doc.text("191-01234567-0-89", 15, footerY + 33);

    doc.setFont("helvetica", "bold");
    doc.text("Contacto", 130, footerY + 15);
    doc.setFont("helvetica", "normal");
    doc.text("(55) 1234-5678", 130, footerY + 23);
    doc.text("soporte@nubixmarket.com", 130, footerY + 28);
    doc.text("www.nubixmarket.com", 130, footerY + 33);

    doc.save(`${tipo}-${numero}.pdf`);
};

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
        { n: 2, label: "Pago" },
        { n: 3, label: "Confirmar" },
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
    const [tipoEntrega, setTipoEntrega] = useState("FAST_LANE");
    const totals = useMemo(
        () => calcOrderTotals(items, tipoEntrega),
        [items, tipoEntrega],
    );
    const { subtotalBase, igv, subtotalConIgv, delivery, total } = totals;
    const [metodoPagoUi, setMetodoPagoUi] = useState("TRANSFERENCIA");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [emailOk, setEmailOk] = useState(null);
    const [ventaCreada, setVentaCreada] = useState(null);
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

    const handleConfirmar = async () => {
        setLoading(true);
        setErrorCheckout(null);
        const fecha = new Date().toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
        const metodoPago = selectedPayment?.metodoPago ?? "TRANSFERENCIA";

        try {
            const isFactura = documentoDigits.length === 11;
            const venta = await saleService.checkout({
                tipoComprobante: isFactura ? "FACTURA" : "BOLETA",
                metodoPago,
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
            });

            setVentaCreada(venta);
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
                items,
                subtotalBase: venta.subtotal,
                igv: venta.igv,
                delivery: venta.costoEnvio ?? 0,
                total: venta.total,
            };

            const ok = await enviarEmailConfirmacion(orden);
            setEmailOk(ok);
            await generarPDF(orden);
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
                                <select
                                    className="form-select checkout-input checkout-select"
                                    value={tipoEntrega}
                                    onChange={(e) =>
                                        setTipoEntrega(e.target.value)
                                    }
                                >
                                    <option value="FAST_LANE">
                                        Fast Lane (recojo en tienda)
                                    </option>
                                    <option value="DELIVERY">Delivery</option>
                                </select>
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
                    <div className="modal-pago-body">
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
                                            setMetodoPagoUi(opt.uiKey)
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

                        {selectedPayment && (
                            <div className="checkout-payment-details">
                                <p>
                                    <strong>{selectedPayment.detailTitle}</strong>
                                </p>
                                {selectedPayment.detailLines.map((line) => (
                                    <p key={line}>{line}</p>
                                ))}
                            </div>
                        )}

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
                                onClick={() => setStep(3)}
                            >
                                Revisar pedido →
                            </button>
                        </div>
                    </div>
                )}

                {/* Paso 3: Confirmar pedido */}
                {step === 3 && (
                    <div className="modal-pago-body">
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
                            {items.map((item) => (
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
                                <span>{formatSoles(subtotalBase)}</span>
                            </div>
                            <div className="confirm-row">
                                <span>IGV (13%)</span>
                                <span>{formatSoles(igv)}</span>
                            </div>
                            {tipoEntrega === "DELIVERY" && (
                                <div className="confirm-row">
                                    <span>Delivery</span>
                                    <span>
                                        {delivery === 0
                                            ? "Gratis"
                                            : formatSoles(delivery)}
                                    </span>
                                </div>
                            )}
                            <div className="confirm-row total checkout-total-highlight">
                                <span>TOTAL</span>
                                <span>{formatSoles(total)}</span>
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
                                onClick={() => setStep(2)}
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
