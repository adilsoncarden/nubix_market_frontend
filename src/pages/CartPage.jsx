import { useMemo, useState } from "react";
import { useCart } from "../store/CartContext";
import { useNavigate } from "react-router-dom";
import { useProductCatalog } from "../store/ProductCatalogContext";
import { calcOrderTotals, formatSoles } from "../utils/pricing";
import "../styles/cart.css";
import ProductQtyControl from "../components/shared/ProductQtyControl";
import CheckoutModal from "../components/checkout/CheckoutModal";
import { generateOrderReceiptPdf } from "../utils/generateOrderReceiptPdf";
import {
    stockToastMaxReached,
    stockToastOutOfStock,
} from "../utils/swalConfig";
import { canIncreaseQty } from "../utils/stockUtils";
import CustomSelect from "../components/ui/CustomSelect";

// ─── Envío de email al backend ────────────────────────────────────────────────
const enviarEmailConfirmacion = async (orden) => {
    try {
        const res = await api.post("/email/confirmacion", {
            email: orden?.cliente?.email,
            numero: orden?.numero,
            tipo: orden?.tipo,
            codigoRecojo: orden?.codigoRecojo,
            total: orden?.total,
        });
        return res.status === 200;
    } catch {
        return false;
    }
};

// ─── Generar número de orden ──────────────────────────────────────────────────
const generarNumero = (tipo) => {
    const prefix = tipo === "boleta" ? "B001" : "F001";
    const num = String(Math.floor(Math.random() * 99999) + 1).padStart(5, "0");
    return `${prefix}-${num}`;
};

// ─── Modal de Pago ────────────────────────────────────────────────────────────
function ModalPago({ items, onClose, onSuccess }) {
    const [tipo, setTipo] = useState("boleta");
    const [tipoEntrega, setTipoEntrega] = useState("FAST_LANE");
    const totals = useMemo(
        () => calcOrderTotals(items, tipoEntrega),
        [items, tipoEntrega],
    );
    const { subtotalBase, igv, subtotalConIgv, delivery, total } = totals;
    const [metodoPago, setMetodoPago] = useState("EFECTIVO");
    const [step, setStep] = useState("form");
    const [loading, setLoading] = useState(false);
    const [emailOk, setEmailOk] = useState(null);
    const [ventaCreada, setVentaCreada] = useState(null);
    const [errorCheckout, setErrorCheckout] = useState(null);

    const [form, setForm] = useState({
        nombre: "",
        dni: "",
        email: "",
        razonSocial: "",
        ruc: "",
        direccion: "",
        direccionEntrega: "",
        distrito: "",
        referencia: "",
    });

    const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

    const valido =
        tipo === "boleta"
            ? form.nombre.trim() &&
              form.dni.trim().length === 8 &&
              form.email.trim()
            : form.razonSocial.trim() &&
              form.ruc.trim().length === 11 &&
              form.email.trim();

    const entregaValida =
        tipoEntrega !== "DELIVERY" || form.direccionEntrega.trim();

    const handleConfirmar = async () => {
        setLoading(true);
        setErrorCheckout(null);
        const fecha = new Date().toLocaleDateString("es-PE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        try {
            const venta = await saleService.checkout({
                tipoComprobante: tipo === "boleta" ? "BOLETA" : "FACTURA",
                metodoPago,
                tipoEntrega,
                nombreComprobante: form.nombre,
                dni: form.dni,
                ruc: form.ruc,
                razonSocial: form.razonSocial,
                emailComprobante: form.email,
                direccionFiscal: form.direccion,
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
                tipo,
                numero,
                fecha,
                codigoRecojo: venta.codigoRecojo,
                cliente:
                    tipo === "boleta"
                        ? {
                              nombre: form.nombre,
                              dni: form.dni,
                              email: form.email,
                          }
                        : {
                              razonSocial: form.razonSocial,
                              ruc: form.ruc,
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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-pago" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-pago-header">
                    <h5 className="modal-pago-title">
                        <i className="bi bi-lock me-2"></i>Finalizar compra
                    </h5>
                    <button className="modal-pago-close" onClick={onClose}>
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                {/* STEP: formulario */}
                {step === "form" && (
                    <div className="modal-pago-body">
                        <div className="pago-fields mb-3">
                            <label className="fw-bold d-block mb-2">
                                Tipo de entrega
                            </label>
                            <CustomSelect
                                className="pago-select"
                                value={tipoEntrega}
                                onChange={(e) => setTipoEntrega(e.target.value)}
                                options={[
                                    {
                                        value: "FAST_LANE",
                                        label: "Fast Lane (recojo en tienda)",
                                    },
                                    { value: "DELIVERY", label: "Delivery" },
                                ]}
                            />
                        </div>

                        {tipoEntrega === "DELIVERY" && (
                            <div className="pago-fields mb-3">
                                <div className="pago-field">
                                    <label>Dirección de entrega</label>
                                    <input
                                        type="text"
                                        value={form.direccionEntrega}
                                        onChange={set("direccionEntrega")}
                                    />
                                </div>
                                <div className="pago-field">
                                    <label>Distrito</label>
                                    <input
                                        type="text"
                                        value={form.distrito}
                                        onChange={set("distrito")}
                                    />
                                </div>
                                <div className="pago-field">
                                    <label>Referencia</label>
                                    <input
                                        type="text"
                                        value={form.referencia}
                                        onChange={set("referencia")}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="pago-fields mb-3">
                            <label className="fw-bold d-block mb-2">
                                Método de pago
                            </label>
                            <CustomSelect
                                className="pago-select"
                                value={metodoPago}
                                onChange={(e) => setMetodoPago(e.target.value)}
                                options={[
                                    { value: "EFECTIVO", label: "Efectivo" },
                                    { value: "YAPE", label: "Yape" },
                                    {
                                        value: "TRANSFERENCIA",
                                        label: "Transferencia",
                                    },
                                    { value: "TARJETA", label: "Tarjeta" },
                                ]}
                            />
                        </div>

                        {/* Selector boleta / factura */}
                        <div className="tipo-selector mb-4">
                            <button
                                className={`tipo-btn${tipo === "boleta" ? " active" : ""}`}
                                onClick={() => setTipo("boleta")}
                            >
                                <i className="bi bi-receipt me-2"></i>Boleta
                            </button>
                            <button
                                className={`tipo-btn${tipo === "factura" ? " active" : ""}`}
                                onClick={() => setTipo("factura")}
                            >
                                <i className="bi bi-file-earmark-text me-2"></i>
                                Factura
                            </button>
                        </div>

                        {/* Campos boleta */}
                        {tipo === "boleta" && (
                            <div className="pago-fields">
                                <div className="pago-field">
                                    <label>Nombre y Apellido / Razón Social</label>
                                    <input
                                        type="text"
                                        placeholder=""
                                        value={form.nombre}
                                        onChange={set("nombre")}
                                    />
                                </div>
                                <div className="pago-field">
                                    <label>DNI / RUC</label>
                                    <input
                                        type="text"
                                        placeholder=""
                                        maxLength={8}
                                        value={form.dni}
                                        onChange={set("dni")}
                                    />
                                </div>
                                <div className="pago-field">
                                    <label>Correo electrónico</label>
                                    <input
                                        type="email"
                                        placeholder=""
                                        value={form.email}
                                        onChange={set("email")}
                                    />
                                    <span className="field-hint">
                                        Se enviara la confirmacion a este correo
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Campos factura */}
                        {tipo === "factura" && (
                            <div className="pago-fields">
                                <div className="pago-field">
                                    <label>Razon Social</label>
                                    <input
                                        type="text"
                                        placeholder=""
                                        value={form.razonSocial}
                                        onChange={set("razonSocial")}
                                    />
                                </div>
                                <div className="pago-field">
                                    <label>
                                        RUC{" "}
                                        <span className="field-hint">
                                            (11 digitos)
                                        </span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder=""
                                        maxLength={11}
                                        value={form.ruc}
                                        onChange={set("ruc")}
                                    />
                                </div>
                                <div className="pago-field">
                                    <label>Direccion fiscal</label>
                                    <input
                                        type="text"
                                        placeholder=""
                                        value={form.direccion}
                                        onChange={set("direccion")}
                                    />
                                </div>
                                <div className="pago-field">
                                    <label>Correo electronico</label>
                                    <input
                                        type="email"
                                        placeholder=""
                                        value={form.email}
                                        onChange={set("email")}
                                    />
                                    <span className="field-hint">
                                        Se enviara la confirmacion a este correo
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Resumen mini */}
                        <div className="modal-mini-resumen">
                            <span>{items.length} productos</span>
                            <span className="modal-total-amount">
                                {formatSoles(total)}
                            </span>
                        </div>

                        {errorCheckout && (
                            <div className="alert alert-danger py-2 small">
                                {errorCheckout}
                            </div>
                        )}

                        <button
                            className="btn-modal-confirmar"
                            onClick={() => setStep("confirm")}
                            disabled={!valido || !entregaValida}
                        >
                            Revisar pedido
                        </button>
                    </div>
                )}

                {/* STEP: confirmación */}
                {step === "confirm" && (
                    <div className="modal-pago-body">
                        <div className="confirm-header">
                            <i className="bi bi-clipboard-check confirm-icon"></i>
                            <h6>Confirma tu pedido</h6>
                        </div>

                        <div className="confirm-data">
                            <div className="confirm-row">
                                <span>Tipo</span>
                                <strong>
                                    {tipo === "boleta"
                                        ? "Boleta electronica"
                                        : "Factura electronica"}
                                </strong>
                            </div>
                            {tipo === "boleta" ? (
                                <>
                                    <div className="confirm-row">
                                        <span>Nombre</span>
                                        <strong>{form.nombre}</strong>
                                    </div>
                                    <div className="confirm-row">
                                        <span>DNI</span>
                                        <strong>{form.dni}</strong>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="confirm-row">
                                        <span>Razon Social</span>
                                        <strong>{form.razonSocial}</strong>
                                    </div>
                                    <div className="confirm-row">
                                        <span>RUC</span>
                                        <strong>{form.ruc}</strong>
                                    </div>
                                </>
                            )}
                            <div className="confirm-row">
                                <span>Email</span>
                                <strong>{form.email}</strong>
                            </div>
                        </div>

                        <div className="confirm-items">
                            {items.map((item) => (
                                <div key={item.id} className="confirm-item">
                                    <span>
                                        {item.name} x{item.qty}
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
                            <div className="confirm-row">
                                <span>Subtotal con IGV</span>
                                <span>{formatSoles(subtotalConIgv)}</span>
                            </div>
                            {tipoEntrega === "DELIVERY" && (
                                <div className="confirm-row">
                                    <span>Envio</span>
                                    <span>
                                        {delivery === 0
                                            ? "Gratis"
                                            : `S/ ${delivery.toFixed(2)}`}
                                    </span>
                                </div>
                            )}
                            <div className="confirm-row total">
                                <span>TOTAL</span>
                                <span>{formatSoles(total)}</span>
                            </div>
                        </div>

                        <p className="confirm-aviso">
                            <i className="bi bi-info-circle me-1"></i>
                            Se generara el PDF y se enviara la confirmacion a{" "}
                            <strong>{form.email}</strong>
                        </p>

                        <div className="confirm-actions">
                            <button
                                className="btn-modal-back"
                                onClick={() => setStep("form")}
                            >
                                <i className="bi bi-arrow-left me-1"></i>Editar
                            </button>
                            <button
                                className="btn-modal-confirmar"
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

                {/* STEP: éxito */}
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
                                Confirmacion enviada a {form.email}
                            </p>
                        )}
                        {emailOk === false && (
                            <p className="success-email fail">
                                <i className="bi bi-envelope-x me-1"></i>No se
                                pudo enviar el email. Revisa tu backend.
                            </p>
                        )}
                        <button
                            className="btn-modal-confirmar"
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

function OrderSuccessView({ venta, onContinue }) {
    return (
        <div className="container cart-page py-5">
            <div className="cart-order-success text-center mx-auto">
                <i className="bi bi-check-circle-fill text-success display-4"></i>
                <h3 className="mt-3 fw-bold">¡Compra confirmada!</h3>
                <p className="text-muted mb-1">
                    Pedido <strong>#V-{String(venta.id).padStart(5, "0")}</strong>
                </p>
                {venta.codigoRecojo && (
                    <p className="fw-bold text-success">
                        Código de recojo: {venta.codigoRecojo}
                    </p>
                )}
                <div className="cart-order-success-totals mt-4 text-start">
                    <div className="d-flex justify-content-between">
                        <span>Subtotal (sin IGV)</span>
                        <span>{formatSoles(venta.subtotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <span>IGV (13%)</span>
                        <span>{formatSoles(venta.igv)}</span>
                    </div>
                    {(venta.costoEnvio ?? 0) > 0 && (
                        <div className="d-flex justify-content-between">
                            <span>Envío</span>
                            <span>{formatSoles(venta.costoEnvio)}</span>
                        </div>
                    )}
                    <div className="d-flex justify-content-between fw-bold fs-5 mt-2 pt-2 border-top">
                        <span>Total pagado</span>
                        <span className="text-success">
                            {formatSoles(venta.total)}
                        </span>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn-checkout mt-4 w-100"
                    onClick={onContinue}
                >
                    Seguir comprando
                </button>
            </div>
        </div>
    );
}

// ─── CartPage ────────────────────────────────────────────────────────────────
export default function CartPage() {
    const { items, removeFromCart, setQty, clearCart, reloadCart, totalItems, totalUnits } =
        useCart();
    const { invalidate: invalidateCatalog } = useProductCatalog();
    const navigate = useNavigate();

    const [zoom, setZoom] = useState(null);
    const [modalPago, setModalPago] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);

    const cartTotals = useMemo(
        () => calcOrderTotals(items, "PRESENCIAL"),
        [items],
    );

    const handlePagoSuccess = async (venta) => {
        setOrderSuccess(venta);
        setModalPago(false);
        await clearCart();
        await reloadCart();
        invalidateCatalog();
    };

    const handleCloseModal = () => {
        setModalPago(false);
    };

    if (orderSuccess) {
        return (
            <OrderSuccessView
                venta={orderSuccess}
                onContinue={() => {
                    setOrderSuccess(null);
                    navigate("/shop");
                }}
            />
        );
    }

    if (items.length === 0 && !modalPago) {
        return (
            <div className="cart-empty">
                <i className="bi bi-cart-x cart-empty-icon"></i>
                <h3>Tu carrito esta vacio</h3>
                <p className="text-muted">Agrega productos desde la tienda.</p>
                <button
                    className="btn-cart-cta"
                    onClick={() => navigate("/shop")}
                >
                    Ir a la tienda
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Zoom overlay */}
            {zoom && (
                <div className="img-zoom-overlay" onClick={() => setZoom(null)}>
                    <div
                        className="img-zoom-box"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img src={zoom.img} alt={zoom.name} loading="lazy" />
                        <p className="img-zoom-name">{zoom.name}</p>
                        <button
                            className="img-zoom-close"
                            onClick={() => setZoom(null)}
                        >
                            <i className="bi bi-x-lg"></i>
                        </button>
                    </div>
                </div>
            )}

            {/* Modal de pago */}
            {modalPago && (
                <CheckoutModal
                    items={items}
                    onClose={handleCloseModal}
                    onSuccess={handlePagoSuccess}
                />
            )}

            <div className="container cart-page cart-page-premium has-checkout-bar">
                {/* Header */}
                <div className="cart-header">
                    <h2 className="cart-title">
                        <i className="bi bi-cart3 me-2"></i>Mi Carrito
                        <span className="cart-title-count">
                            {totalItems}{" "}
                            {totalItems === 1 ? "producto" : "productos"}
                        </span>
                    </h2>
                    <button className="btn-clear-cart" onClick={clearCart}>
                        <i className="bi bi-trash me-1"></i>Vaciar carrito
                    </button>
                </div>

                <div className="cart-layout">
                    {/* Lista de items */}
                    <div className="cart-items">
                        {items.map((item) => (
                            <div key={item.id} className="cart-item">
                                <div
                                    className="cart-item-img-wrap"
                                    title="Clic para ampliar"
                                    onClick={() => setZoom(item)}
                                >
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        loading="lazy"
                                    />
                                    <div className="cart-img-zoom-hint">
                                        <i className="bi bi-zoom-in"></i>
                                    </div>
                                </div>

                                <div className="cart-item-info">
                                    <p className="cart-item-cat">
                                        {item.category}
                                    </p>
                                    <p className="cart-item-name">
                                        {item.name}
                                    </p>
                                    <p className="cart-item-unit">
                                        S/ {item.price.toFixed(2)} / {item.unit}
                                    </p>
                                </div>

                                <ProductQtyControl
                                    qty={item.qty}
                                    stock={item.stock}
                                    pillClassName="cart-item-controls"
                                    btnClassName="qty-btn"
                                    valueClassName="qty-value"
                                    onStockLimit={() => {
                                        if (item.stock <= 0) {
                                            stockToastOutOfStock();
                                        } else {
                                            stockToastMaxReached();
                                        }
                                    }}
                                    onDecrease={async (e) => {
                                        e?.preventDefault?.();
                                        if (item.qty === 1) {
                                            await removeFromCart(item.id);
                                        } else {
                                            await setQty(item.id, item.qty - 1);
                                        }
                                    }}
                                    onIncrease={async (e) => {
                                        e?.preventDefault?.();
                                        if (!canIncreaseQty(item.qty, item.stock)) {
                                            if (item.stock <= 0) {
                                                stockToastOutOfStock();
                                            } else {
                                                stockToastMaxReached();
                                            }
                                            return;
                                        }
                                        await setQty(item.id, item.qty + 1);
                                    }}
                                />

                                <div className="cart-item-subtotal">
                                    S/ {(item.price * item.qty).toFixed(2)}
                                </div>

                                <button
                                    type="button"
                                    className="cart-item-remove"
                                    onClick={async (e) => {
                                        e?.preventDefault?.();
                                        await removeFromCart(item.id);
                                    }}
                                    aria-label="Eliminar producto del carrito"
                                    title="Eliminar del carrito"
                                >
                                    <i className="bi bi-x-lg" aria-hidden="true" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Resumen */}
                    <aside className="cart-summary">
                        <h4 className="summary-title">Resumen del pedido</h4>

                        <div className="summary-row">
                            <span>Subtotal sin IGV ({totalUnits} items)</span>
                            <span>{formatSoles(cartTotals.subtotalBase)}</span>
                        </div>
                        <div className="summary-row">
                            <span>IGV (13%)</span>
                            <span>{formatSoles(cartTotals.igv)}</span>
                        </div>
                        <p className="summary-delivery-hint text-muted small mb-0">
                            El envío se calcula en el checkout (solo delivery).
                        </p>

                        <div className="summary-divider"></div>

                        <div className="summary-total">
                            <span>Total</span>
                            <span>{formatSoles(cartTotals.total)}</span>
                        </div>

                        <button
                            className="btn-checkout"
                            onClick={() => setModalPago(true)}
                        >
                            <i className="bi bi-lock me-2"></i>Proceder al pago
                        </button>
                        <button
                            className="btn-continue-shopping"
                            onClick={() => navigate("/shop")}
                        >
                            Continuar comprando
                        </button>
                    </aside>
                </div>

                <div className="cart-mobile-checkout-bar" role="region" aria-label="Resumen y pago rápido">
                    <div className="cart-mobile-checkout-total">
                        <span>Total</span>
                        <strong>{formatSoles(cartTotals.total)}</strong>
                    </div>
                    <button
                        type="button"
                        className="btn-checkout"
                        onClick={() => setModalPago(true)}
                    >
                        <i className="bi bi-lock me-1" aria-hidden="true" />
                        Proceder al pago
                    </button>
                </div>
            </div>
        </>
    );
}
