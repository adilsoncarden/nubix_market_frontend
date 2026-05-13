import { useState } from "react";
import { useCart } from "../store/CartContext";
import { useNavigate } from "react-router-dom";

// ─── Utilidad PDF ─────────────────────────────────────────────────────────────
// Genera e imprime la boleta/factura usando jsPDF (instalado via npm)
const generarPDF = async (orden) => {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  const { tipo, numero, fecha, cliente, items, subtotal, delivery, total } = orden;

  const VERDE = [34, 139, 87];
  const GRIS  = [100, 100, 100];

  // Encabezado
  doc.setFillColor(...VERDE);
  doc.rect(0, 0, 210, 32, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("NUBIX MARKET", 14, 14);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Tu mercado online de confianza", 14, 22);
  doc.text(`RUC: 20123456789`, 140, 14);
  doc.text(`${tipo.toUpperCase()} ELECTRONICA`, 140, 20);
  doc.text(`N° ${numero}`, 140, 26);

  // Fecha y cliente
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Fecha de emision: ${fecha}`, 14, 42);

  doc.setFont("helvetica", "bold");
  doc.text("DATOS DEL CLIENTE", 14, 52);
  doc.setFont("helvetica", "normal");

  if (tipo === "boleta") {
    doc.text(`Nombre: ${cliente.nombre}`, 14, 60);
    doc.text(`DNI: ${cliente.dni}`, 14, 67);
  } else {
    doc.text(`Razon Social: ${cliente.razonSocial}`, 14, 60);
    doc.text(`RUC: ${cliente.ruc}`, 14, 67);
    doc.text(`Direccion: ${cliente.direccion}`, 14, 74);
  }

  // Tabla de productos
  const tableY = tipo === "factura" ? 84 : 77;
  doc.setFillColor(...VERDE);
  doc.rect(14, tableY, 182, 8, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("PRODUCTO",          16, tableY + 5.5);
  doc.text("CANT.",            110, tableY + 5.5);
  doc.text("P. UNIT.",         135, tableY + 5.5);
  doc.text("SUBTOTAL",         163, tableY + 5.5, { align: "right" });

  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  let y = tableY + 14;
  items.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(245, 250, 247);
      doc.rect(14, y - 5, 182, 8, "F");
    }
    doc.text(item.name.substring(0, 38),      16, y);
    doc.text(String(item.qty),               114, y);
    doc.text(`S/ ${item.price.toFixed(2)}`,   140, y);
    doc.text(`S/ ${(item.price * item.qty).toFixed(2)}`, 194, y, { align: "right" });
    y += 9;
  });

  // Totales
  y += 4;
  doc.setDrawColor(...GRIS);
  doc.line(120, y, 196, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal:",                      140, y);
  doc.text(`S/ ${subtotal.toFixed(2)}`,      194, y, { align: "right" });
  y += 7;
  doc.text("Envio:",                         140, y);
  doc.text(delivery === 0 ? "Gratis" : `S/ ${delivery.toFixed(2)}`, 194, y, { align: "right" });
  y += 7;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOTAL:",                         140, y);
  doc.text(`S/ ${total.toFixed(2)}`,         194, y, { align: "right" });

  // IGV (solo factura)
  if (tipo === "factura") {
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...GRIS);
    doc.text(`IGV (18%) incluido: S/ ${(total * 0.18 / 1.18).toFixed(2)}`, 140, y);
  }

  // Pie
  doc.setTextColor(...GRIS);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Gracias por tu compra en Nubix Market", 105, 285, { align: "center" });
  doc.text("www.nubixmarket.com | soporte@nubixmarket.com", 105, 290, { align: "center" });

  doc.save(`${tipo}-${numero}.pdf`);
};

// ─── Envío de email al backend ────────────────────────────────────────────────
// Ajusta la URL a tu endpoint real de Spring Boot
const API_EMAIL = "http://localhost:8080/api/email/confirmacion";

const enviarEmailConfirmacion = async (orden) => {
  try {
    const res = await fetch(API_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orden),
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
  const [tipo,     setTipo]     = useState("boleta");
  const [step,     setStep]     = useState("form");   // "form" | "confirm" | "success"
  const [loading,  setLoading]  = useState(false);
  const [emailOk,  setEmailOk]  = useState(null);

  const [form, setForm] = useState({
    nombre: "", dni: "", email: "",
    razonSocial: "", ruc: "", direccion: "",
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const valido = tipo === "boleta"
    ? form.nombre.trim() && form.dni.trim().length === 8 && form.email.trim()
    : form.razonSocial.trim() && form.ruc.trim().length === 11 && form.email.trim();

  const handleConfirmar = async () => {
    setLoading(true);
    const numero = generarNumero(tipo);
    const fecha  = new Date().toLocaleDateString("es-PE", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });

    const orden = {
      tipo, numero, fecha,
      cliente: tipo === "boleta"
        ? { nombre: form.nombre, dni: form.dni, email: form.email }
        : { razonSocial: form.razonSocial, ruc: form.ruc, direccion: form.direccion, email: form.email },
      items, subtotal, delivery, total,
    };

    const ok = await enviarEmailConfirmacion(orden);
    setEmailOk(ok);
    await generarPDF(orden);
    setLoading(false);
    setStep("success");
    onSuccess();
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

            <button
              className="btn-modal-confirmar"
              onClick={() => setStep("confirm")}
              disabled={!valido}
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
              Tu {tipo} se ha generado y descargado automaticamente.
            </p>
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

// ─── CartPage ─────────────────────────────────────────────────────────────────
export default function CartPage() {
  const { items, removeFromCart, setQty, clearCart, totalItems, totalPrice } = useCart();
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