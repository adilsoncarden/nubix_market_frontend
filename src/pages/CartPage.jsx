import { useState } from "react";
import { useCart } from "../store/CartContext";
import { useNavigate } from "react-router-dom";
import { saleService } from "../features/sales/services/saleService";
import { useProductCatalog } from "../store/ProductCatalogContext";

// ─── Utilidad PDF (DISEÑO RENOVADO SEGÚN TU IMAGEN) ───────────────────────────
const generarPDF = async (orden) => {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  const { tipo, numero, fecha, cliente, items, subtotal, delivery, total, codigoRecojo } = orden;

  // COLORES DEL DISEÑO
  const VERDE_NUBIX = [34, 153, 84]; 
  const NEGRO_TEXTO = [40, 40, 40];
  const GRIS_FONDO = [245, 245, 245];
  const AMARILLO_TOTAL = [255, 235, 59];

  // --- CABECERA (Bloque Verde Superior) ---
  doc.setFillColor(...VERDE_NUBIX);
  doc.rect(0, 0, 210, 55, "F");

  // Logo y Nombre
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("NUBIX", 15, 22);
  doc.text("MARKET", 15, 32);

  // Tipo de Comprobante (Derecha)
  doc.setFontSize(18);
  doc.text(tipo === "boleta" ? "BOLETA ELECTRÓNICA" : "FACTURA ELECTRÓNICA", 195, 35, { align: "right" });

  // Contacto cabecera
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("(55) 1234-5678", 15, 45);
  doc.text("Calle San Pedro, Comas", 15, 50);

  // --- DATOS DEL CLIENTE Y PEDIDO ---
  doc.setTextColor(...NEGRO_TEXTO);
  doc.setFontSize(10);
  
  doc.text("FECHA:", 15, 75);
  doc.text(fecha, 195, 75, { align: "right" });

  doc.text("CLIENTE:", 15, 83);
  const nombreCliente = tipo === "boleta" ? cliente.nombre : cliente.razonSocial;
  doc.setFont("helvetica", "bold");
  doc.text(nombreCliente.toUpperCase(), 195, 83, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.text(tipo === "boleta" ? "DNI:" : "RUC:", 15, 91);
  doc.text(tipo === "boleta" ? cliente.dni : cliente.ruc, 195, 91, { align: "right" });

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

  // --- TABLA DE ARTÍCULOS ---
  const tableY = codigoRecojo ? 123 : 115;
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(15, tableY, 195, tableY); // Línea superior

  doc.setTextColor(...NEGRO_TEXTO);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Articulo", 17, tableY + 7);
  doc.text("Cantidad", 110, tableY + 7);
  doc.text("Precio", 145, tableY + 7);
  doc.text("SubTotal", 193, tableY + 7, { align: "right" });
  
  doc.line(15, tableY + 11, 195, tableY + 11); // Línea divisoria

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
    doc.text(`S/ ${(item.price * item.qty).toFixed(2)}`, 193, currentY, { align: "right" });
    currentY += 8;
  });

  // --- TOTALES ---
  currentY += 10;
  doc.setFontSize(10);
  doc.text("Subtotal:", 155, currentY, { align: "right" });
  doc.text(`S/ ${subtotal.toFixed(2)}`, 193, currentY, { align: "right" });
  
  currentY += 7;
  doc.text("Envío:", 155, currentY, { align: "right" });
  doc.text(delivery === 0 ? "Gratis" : `S/ ${delivery.toFixed(2)}`, 193, currentY, { align: "right" });

  // Bloque de Total Amarillo (Estilo imagen)
  currentY += 5;
  doc.setFillColor(...AMARILLO_TOTAL);
  doc.rect(130, currentY, 65, 10, "F");
  doc.setDrawColor(0);
  doc.rect(130, currentY, 65, 10, "D"); 
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Total:", 155, currentY + 7, { align: "right" });
  doc.text(`S/ ${total.toFixed(2)}`, 190, currentY + 7, { align: "right" });

  // --- MENSAJE FINAL ---
  currentY += 30;
  doc.setFontSize(16);
  doc.setTextColor(...NEGRO_TEXTO);
  doc.text("¡Gracias por su compra!", 15, currentY);
  doc.setLineWidth(1);
  doc.line(15, currentY + 2, 35, currentY + 2);

  // --- PIE DE PÁGINA VERDE ---
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

// ─── Envío de email al backend ────────────────────────────────────────────────
const API_EMAIL = "http://localhost:8080/api/email/confirmacion";

const enviarEmailConfirmacion = async (orden) => {
  try {
    const res = await fetch(API_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: orden?.cliente?.email,
        numero: orden?.numero,
        tipo: orden?.tipo,
        codigoRecojo: orden?.codigoRecojo,
        total: orden?.total,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
};

// ─── Generar número de orden ──────────────────────────────────────────────────
const generarNumero = (tipo) => {
  const prefix = tipo === "boleta" ? "B001" : "F001";
  const num    = String(Math.floor(Math.random() * 99999) + 1).padStart(5, "0");
  return `${prefix}-${num}`;
};

// ─── Modal de Pago ────────────────────────────────────────────────────────────
function ModalPago({ total, delivery, subtotal, items, onClose, onSuccess }) {
  const [tipo, setTipo] = useState("boleta");
  const [tipoEntrega, setTipoEntrega] = useState("FAST_LANE");
  const [metodoPago, setMetodoPago] = useState("YAPE");
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);
  const [emailOk, setEmailOk] = useState(null);
  const [ventaCreada, setVentaCreada] = useState(null);
  const [errorCheckout, setErrorCheckout] = useState(null);

  const [form, setForm] = useState({
    nombre: "", dni: "", email: "",
    razonSocial: "", ruc: "", direccion: "",
    direccionEntrega: "", distrito: "", referencia: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const valido = tipo === "boleta"
    ? form.nombre.trim() && form.dni.trim().length === 8 && form.email.trim()
    : form.razonSocial.trim() && form.ruc.trim().length === 11 && form.email.trim();

  const entregaValida = tipoEntrega !== "DELIVERY" || form.direccionEntrega.trim();

  const handleConfirmar = async () => {
    setLoading(true);
    setErrorCheckout(null);
    const fecha = new Date().toLocaleDateString("es-PE", {
      day: "2-digit", month: "2-digit", year: "numeric",
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
        direccionEntrega: tipoEntrega === "DELIVERY" ? form.direccionEntrega : null,
        distrito: tipoEntrega === "DELIVERY" ? form.distrito : null,
        referencia: tipoEntrega === "DELIVERY" ? form.referencia : null,
        costoEnvio: tipoEntrega === "DELIVERY" ? delivery : 0,
        detalles: items.map((item) => ({
          productoId: item.id,
          cantidad: item.qty,
        })),
      });

      setVentaCreada(venta);
      const numero = `V-${String(venta.id).padStart(5, "0")}`;
      const orden = {
        tipo, numero, fecha,
        codigoRecojo: venta.codigoRecojo,
        cliente: tipo === "boleta"
          ? { nombre: form.nombre, dni: form.dni, email: form.email }
          : { razonSocial: form.razonSocial, ruc: form.ruc, direccion: form.direccion, email: form.email },
        items, subtotal, delivery, total,
      };

      const ok = await enviarEmailConfirmacion(orden);
      setEmailOk(ok);
      await generarPDF(orden);
      setStep("success");
      onSuccess();
    } catch (err) {
      console.error("[Checkout] Error:", err.response?.data ?? err.message);
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
              <label className="fw-bold d-block mb-2">Tipo de entrega</label>
              <select
                className="form-select"
                value={tipoEntrega}
                onChange={(e) => setTipoEntrega(e.target.value)}
              >
                <option value="FAST_LANE">Fast Lane (recojo en tienda)</option>
                <option value="DELIVERY">Delivery</option>
              </select>
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
                  <input type="text" value={form.distrito} onChange={set("distrito")} />
                </div>
                <div className="pago-field">
                  <label>Referencia</label>
                  <input type="text" value={form.referencia} onChange={set("referencia")} />
                </div>
              </div>
            )}

            <div className="pago-fields mb-3">
              <label className="fw-bold d-block mb-2">Método de pago</label>
              <select
                className="form-select"
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
              >
                <option value="YAPE">Yape</option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="TARJETA">Tarjeta</option>
              </select>
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
                <i className="bi bi-file-earmark-text me-2"></i>Factura
              </button>
            </div>

            {/* Campos boleta */}
            {tipo === "boleta" && (
              <div className="pago-fields">
                <div className="pago-field">
                  <label>Nombre completo</label>
                  <input
                    type="text"
                    placeholder="Ej: Juan Perez Garcia"
                    value={form.nombre}
                    onChange={set("nombre")}
                  />
                </div>
                <div className="pago-field">
                  <label>DNI <span className="field-hint">(8 digitos)</span></label>
                  <input
                    type="text"
                    placeholder="12345678"
                    maxLength={8}
                    value={form.dni}
                    onChange={set("dni")}
                  />
                </div>
                <div className="pago-field">
                  <label>Correo electronico</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={form.email}
                    onChange={set("email")}
                  />
                  <span className="field-hint">Se enviara la confirmacion a este correo</span>
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
                    placeholder="Ej: Mi Empresa S.A.C."
                    value={form.razonSocial}
                    onChange={set("razonSocial")}
                  />
                </div>
                <div className="pago-field">
                  <label>RUC <span className="field-hint">(11 digitos)</span></label>
                  <input
                    type="text"
                    placeholder="20123456789"
                    maxLength={11}
                    value={form.ruc}
                    onChange={set("ruc")}
                  />
                </div>
                <div className="pago-field">
                  <label>Direccion fiscal</label>
                  <input
                    type="text"
                    placeholder="Av. Ejemplo 123, Lima"
                    value={form.direccion}
                    onChange={set("direccion")}
                  />
                </div>
                <div className="pago-field">
                  <label>Correo electronico</label>
                  <input
                    type="email"
                    placeholder="correo@empresa.com"
                    value={form.email}
                    onChange={set("email")}
                  />
                  <span className="field-hint">Se enviara la confirmacion a este correo</span>
                </div>
              </div>
            )}

            {/* Resumen mini */}
            <div className="modal-mini-resumen">
              <span>{items.length} productos</span>
              <span className="modal-total-amount">S/ {total.toFixed(2)}</span>
            </div>

            {errorCheckout && (
              <div className="alert alert-danger py-2 small">{errorCheckout}</div>
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
                <strong>{tipo === "boleta" ? "Boleta electronica" : "Factura electronica"}</strong>
              </div>
              {tipo === "boleta" ? (
                <>
                  <div className="confirm-row"><span>Nombre</span><strong>{form.nombre}</strong></div>
                  <div className="confirm-row"><span>DNI</span><strong>{form.dni}</strong></div>
                </>
              ) : (
                <>
                  <div className="confirm-row"><span>Razon Social</span><strong>{form.razonSocial}</strong></div>
                  <div className="confirm-row"><span>RUC</span><strong>{form.ruc}</strong></div>
                </>
              )}
              <div className="confirm-row"><span>Email</span><strong>{form.email}</strong></div>
            </div>

            <div className="confirm-items">
              {items.map((item) => (
                <div key={item.id} className="confirm-item">
                  <span>{item.name} x{item.qty}</span>
                  <span>S/ {(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="confirm-totales">
              <div className="confirm-row"><span>Subtotal</span><span>S/ {subtotal.toFixed(2)}</span></div>
              <div className="confirm-row">
                <span>Envio</span>
                <span>{delivery === 0 ? "Gratis" : `S/ ${delivery.toFixed(2)}`}</span>
              </div>
              <div className="confirm-row total">
                <span>TOTAL</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
            </div>

            <p className="confirm-aviso">
              <i className="bi bi-info-circle me-1"></i>
              Se generara el PDF y se enviara la confirmacion a <strong>{form.email}</strong>
            </p>

            <div className="confirm-actions">
              <button className="btn-modal-back" onClick={() => setStep("form")}>
                <i className="bi bi-arrow-left me-1"></i>Editar
              </button>
              <button
                className="btn-modal-confirmar"
                onClick={handleConfirmar}
                disabled={loading}
              >
                {loading
                  ? <><i className="bi bi-hourglass-split me-2"></i>Procesando...</>
                  : <><i className="bi bi-check-lg me-2"></i>Confirmar y pagar</>
                }
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
              Pedido registrado correctamente. Tu comprobante se ha descargado.
            </p>
            {ventaCreada?.codigoRecojo && (
              <p className="success-msg fw-bold">
                Código de recojo: {ventaCreada.codigoRecojo}
              </p>
            )}
            {emailOk === true  && <p className="success-email ok"><i className="bi bi-envelope-check me-1"></i>Confirmacion enviada a {form.email}</p>}
            {emailOk === false && <p className="success-email fail"><i className="bi bi-envelope-x me-1"></i>No se pudo enviar el email. Revisa tu backend.</p>}
            <button className="btn-modal-confirmar" onClick={onClose}>
              Cerrar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

// ─── CartPage (ORIGINAL INTACTO) ─────────────────────────────────────────────
export default function CartPage() {
  const { items, removeFromCart, setQty, clearCart, totalItems, totalPrice } = useCart();
  const { invalidate: invalidateCatalog } = useProductCatalog();
  const navigate = useNavigate();

  const [zoom,       setZoom]       = useState(null);
  const [modalPago,  setModalPago]  = useState(false);

  if (items.length === 0) {
    return (
      <div className="cart-empty">
        <i className="bi bi-cart-x cart-empty-icon"></i>
        <h3>Tu carrito esta vacio</h3>
        <p className="text-muted">Agrega productos desde la tienda.</p>
        <button className="btn-cart-cta" onClick={() => navigate("/shop")}>
          Ir a la tienda
        </button>
      </div>
    );
  }

  const delivery = totalPrice >= 80 ? 0 : 8.90;
  const total    = totalPrice + delivery;

  const handlePagoSuccess = () => {
    clearCart();
    invalidateCatalog();
  };

  return (
    <>
      {/* Zoom overlay */}
      {zoom && (
        <div className="img-zoom-overlay" onClick={() => setZoom(null)}>
          <div className="img-zoom-box" onClick={(e) => e.stopPropagation()}>
            <img src={zoom.img} alt={zoom.name} />
            <p className="img-zoom-name">{zoom.name}</p>
            <button className="img-zoom-close" onClick={() => setZoom(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
      )}

      {/* Modal de pago */}
      {modalPago && (
        <ModalPago
          total={total}
          delivery={delivery}
          subtotal={totalPrice}
          items={items}
          onClose={() => setModalPago(false)}
          onSuccess={handlePagoSuccess}
        />
      )}

      <div className="container cart-page">
        {/* Header */}
        <div className="cart-header">
          <h2 className="cart-title">
            <i className="bi bi-cart3 me-2"></i>Mi Carrito
            <span className="cart-title-count">
              {totalItems} {totalItems === 1 ? "producto" : "productos"}
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
                  <img src={item.img} alt={item.name} />
                  <div className="cart-img-zoom-hint">
                    <i className="bi bi-zoom-in"></i>
                  </div>
                </div>

                <div className="cart-item-info">
                  <p className="cart-item-cat">{item.category}</p>
                  <p className="cart-item-name">{item.name}</p>
                  <p className="cart-item-unit">S/ {item.price.toFixed(2)} / {item.unit}</p>
                </div>

                <div className="cart-item-controls">
                  <button className="qty-btn" onClick={() => setQty(item.id, item.qty - 1)} aria-label="Reducir">
                    <i className="bi bi-dash"></i>
                  </button>
                  <span className="qty-value">{item.qty}</span>
                  <button className="qty-btn" onClick={() => setQty(item.id, item.qty + 1)} aria-label="Aumentar">
                    <i className="bi bi-plus"></i>
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  S/ {(item.price * item.qty).toFixed(2)}
                </div>

                <button
                  className="cart-item-remove"
                  onClick={() => removeFromCart(item.id)}
                  aria-label="Eliminar"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            ))}
          </div>

          {/* Resumen */}
          <aside className="cart-summary">
            <h4 className="summary-title">Resumen del pedido</h4>

            <div className="summary-row">
              <span>Subtotal ({totalItems} items)</span>
              <span>S/ {totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Envio</span>
              <span className={delivery === 0 ? "text-success fw-bold" : ""}>
                {delivery === 0 ? "Gratis" : `S/ ${delivery.toFixed(2)}`}
              </span>
            </div>
            {delivery > 0 && (
              <p className="summary-delivery-hint">
                Agrega S/ {(80 - totalPrice).toFixed(2)} mas para envio gratis.
              </p>
            )}

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>

            <button className="btn-checkout" onClick={() => setModalPago(true)}>
              <i className="bi bi-lock me-2"></i>Proceder al pago
            </button>
            <button className="btn-continue-shopping" onClick={() => navigate("/shop")}>
              Continuar comprando
            </button>
          </aside>
        </div>
      </div>
    </>
  );
}