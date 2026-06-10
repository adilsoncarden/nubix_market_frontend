import React, { useState, useEffect, useMemo, useRef } from "react";
import { calcOrderTotals } from "../../../utils/pricing";
import { clientService } from "../../users/services/clientService";
import { productService } from "../../products/services/productService";
import { useAuth } from "../../../store/AuthContext";
import Swal from "sweetalert2";
import { fetchOptionalResource } from "../../../utils/apiErrorUtils";

const VentaForm = ({ onSave, loading, active = false }) => {
    const { adminSessionUser } = useAuth();
    const user = adminSessionUser;

    const [formData, setFormData] = useState({
        clienteId: "",
        tipoComprobante: "TICKET",
        metodoPago: "EFECTIVO",
        tipoEntrega: "PRESENCIAL",
        direccionEntrega: "",
        distrito: "",
        referencia: "",
        nombreComprobante: "",
        dni: "",
        ruc: "",
        razonSocial: "",
        emailComprobante: "",
        direccionFiscal: "",
        detalles: [],
    });

    const [clients, setClients] = useState([]);
    const [products, setProducts] = useState([]);
    const [productQuery, setProductQuery] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [loadingData, setLoadingData] = useState(false);
    const productSearchRef = useRef(null);

    useEffect(() => {
        if (!active) return;

        const loadData = async () => {
            setLoadingData(true);
            let clientsData = [];
            let productsData = [];
            let criticalError = null;

            try {
                clientsData = await fetchOptionalResource(() =>
                    clientService.getAll({ silent403: true }),
                );
            } catch (err) {
                console.error("Error al cargar clientes para venta", err);
                criticalError = err;
            }

            try {
                productsData = await fetchOptionalResource(() =>
                    productService.getAll({ silent403: true }),
                );
            } catch (err) {
                console.error("Error al cargar productos para venta", err);
                criticalError = criticalError ?? err;
            }

            setClients(Array.isArray(clientsData) ? clientsData : []);
            setProducts(Array.isArray(productsData) ? productsData : []);

            if (criticalError) {
                Swal.fire(
                    "Error",
                    "No se pudieron cargar algunos datos del formulario. Verifique su conexión o permisos.",
                    "error",
                );
            }
            setLoadingData(false);
        };

        loadData();
    }, [active]);

    useEffect(() => {
        if (active) {
            requestAnimationFrame(() => productSearchRef.current?.focus());
        }
    }, [active]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const resolveProductFromQuery = (query) => {
        const trimmed = String(query ?? "").trim();
        if (!trimmed) return selectedProduct;

        const lower = trimmed.toLowerCase();
        const byExactCode = products.find(
            (p) => String(p.codigo ?? "").toLowerCase() === lower,
        );
        if (byExactCode) return byExactCode;

        const byExactId = products.find((p) => String(p.id) === trimmed);
        if (byExactId) return byExactId;

        const matches = products.filter((p) => {
            const nombre = String(p.nombre ?? "").toLowerCase();
            const codigo = String(p.codigo ?? "").toLowerCase();
            return nombre.includes(lower) || codigo.includes(lower);
        });

        if (matches.length === 1) return matches[0];
        return selectedProduct;
    };

    const clearProductSearch = () => {
        setSelectedProduct(null);
        setProductQuery("");
        setSelectedQuantity(1);
    };

    const addProductToDetails = (product, quantity = 1) => {
        if (!product) {
            Swal.fire("Validación", "Producto no encontrado", "warning");
            return false;
        }

        const qty = Math.max(1, parseInt(quantity, 10) || 1);
        const existingDetail = formData.detalles.find(
            (d) => d.productoId === product.id,
        );
        const nextQty = existingDetail ? existingDetail.cantidad + qty : qty;

        if (product.stock < nextQty) {
            Swal.fire(
                "Error",
                `Stock insuficiente. Disponible: ${product.stock}`,
                "error",
            );
            return false;
        }

        if (existingDetail) {
            setFormData((prev) => ({
                ...prev,
                detalles: prev.detalles.map((d) =>
                    d.productoId === product.id
                        ? {
                              ...d,
                              cantidad: nextQty,
                              subtotal: d.precio * nextQty,
                          }
                        : d,
                ),
            }));
        } else {
            const newDetail = {
                productoId: product.id,
                productName: product.nombre,
                precio: product.precioVenta,
                cantidad: qty,
                subtotal: product.precioVenta * qty,
            };
            setFormData((prev) => ({
                ...prev,
                detalles: [...prev.detalles, newDetail],
            }));
        }

        clearProductSearch();
        requestAnimationFrame(() => productSearchRef.current?.focus());
        return true;
    };

    const handleAddDetail = () => {
        if (!selectedProduct || selectedQuantity < 1) {
            Swal.fire(
                "Validación",
                "Selecciona un producto y cantidad válida",
                "warning",
            );
            return;
        }
        addProductToDetails(selectedProduct, selectedQuantity);
    };

    const handleProductSearchKeyDown = (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        e.stopPropagation();

        const product = resolveProductFromQuery(productQuery);
        if (!product) {
            Swal.fire(
                "No encontrado",
                "No se encontró un producto con ese código o nombre",
                "warning",
            );
            return;
        }

        addProductToDetails(product, selectedQuantity);
    };

    const handleFormKeyDown = (e) => {
        if (e.key !== "Enter") return;
        if (e.target.id === "venta-product-search") return;
        if (e.target.type === "submit") return;
        if (e.target.tagName === "TEXTAREA") return;
        e.preventDefault();
    };

    const handleRemoveDetail = (productoId) => {
        setFormData((prev) => ({
            ...prev,
            detalles: prev.detalles.filter((d) => d.productoId !== productoId),
        }));
    };

    const orderTotals = useMemo(() => {
        const lineItems = formData.detalles.map((d) => ({
            priceBase: d.precio,
            qty: d.cantidad,
        }));
        return calcOrderTotals(lineItems, formData.tipoEntrega || "PRESENCIAL");
    }, [formData.detalles, formData.tipoEntrega]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            formData.tipoComprobante === "BOLETA" &&
            !formData.clienteId &&
            (!formData.dni || formData.dni.length !== 8)
        ) {
            Swal.fire("Validación", "La boleta requiere DNI de 8 dígitos o cliente registrado", "warning");
            return;
        }

        if (
            formData.tipoComprobante === "BOLETA" &&
            !formData.clienteId &&
            !formData.nombreComprobante?.trim()
        ) {
            Swal.fire("Validación", "La boleta requiere el nombre del cliente", "warning");
            return;
        }

        if (
            formData.tipoComprobante === "FACTURA" &&
            (!formData.ruc || formData.ruc.length !== 11)
        ) {
            Swal.fire("Validación", "La factura requiere RUC de 11 dígitos", "warning");
            return;
        }

        if (
            formData.tipoComprobante === "FACTURA" &&
            !formData.razonSocial?.trim()
        ) {
            Swal.fire("Validación", "La factura requiere razón social", "warning");
            return;
        }

        if (formData.detalles.length === 0) {
            Swal.fire("Validación", "Agrega al menos un producto", "warning");
            return;
        }

        if (formData.tipoEntrega === "DELIVERY" && !formData.direccionEntrega) {
            Swal.fire(
                "Validación",
                "Completa la dirección de entrega",
                "warning",
            );
            return;
        }

        const dataToSend = {
            canal: "PRESENCIAL",
            clienteId: formData.clienteId
                ? parseInt(formData.clienteId)
                : null,
            tipoComprobante: formData.tipoComprobante,
            metodoPago: formData.metodoPago,
            nombreComprobante: formData.nombreComprobante || null,
            dni: formData.dni || null,
            ruc: formData.ruc || null,
            razonSocial: formData.razonSocial || null,
            emailComprobante: formData.emailComprobante || null,
            direccionFiscal: formData.direccionFiscal || null,
            detalles: formData.detalles.map((d) => ({
                productoId: d.productoId,
                cantidad: d.cantidad,
            })),
        };

        onSave(dataToSend);
    };

    const { subtotalBase, igv, delivery, total } = orderTotals;
    const selectedProductData = selectedProduct;

    const normalizedQuery = productQuery.trim().toLowerCase();
    const filteredProducts =
        normalizedQuery.length < 2
            ? []
            : products
                  .filter((p) => {
                      const nombre = String(p.nombre ?? "").toLowerCase();
                      const codigo = String(p.codigo ?? "").toLowerCase();
                      return (
                          nombre.includes(normalizedQuery) ||
                          codigo.includes(normalizedQuery)
                      );
                  })
                  .slice(0, 8);

    return (
        <form
            onSubmit={handleSubmit}
            onKeyDown={handleFormKeyDown}
            id="ventaForm"
        >
            <div className="row g-3">
                {/* Tipo comprobante */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Comprobante</label>
                    <select
                        name="tipoComprobante"
                        className="form-select"
                        value={formData.tipoComprobante}
                        onChange={handleChange}
                        required
                    >
                        <option value="TICKET">Ticket</option>
                        <option value="BOLETA">Boleta</option>
                        <option value="FACTURA">Factura</option>
                    </select>
                </div>

                {/* Cliente */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">
                        Cliente{" "}
                        <small className="text-muted">(opcional)</small>
                    </label>
                    <select
                        name="clienteId"
                        className="form-select"
                        value={formData.clienteId}
                        onChange={handleChange}
                        disabled={loadingData}
                    >
                        <option value="">Seleccionar...</option>
                        {clients.map((client) => (
                            <option key={client.id} value={client.id}>
                                {client.username} - {client.email}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Vendedor */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Vendedor</label>
                    <input
                        type="text"
                        className="form-control"
                        value={user?.username || "Cajero actual"}
                        disabled
                    />
                </div>

                {/* Método de Pago */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Método de Pago</label>
                    <select
                        name="metodoPago"
                        className="form-select"
                        value={formData.metodoPago}
                        onChange={handleChange}
                        required
                    >
                        <option value="EFECTIVO">Efectivo</option>
                        <option value="YAPE">Yape</option>
                        <option value="TRANSFERENCIA">Transferencia</option>
                        <option value="TARJETA">Tarjeta</option>
                        <option value="CREDITO">Crédito</option>
                    </select>
                </div>

                {/* Tipo de Entrega (fijo presencial para cajero) */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">
                        Tipo de Entrega
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value="Presencial"
                        disabled
                    />
                </div>

                {formData.tipoComprobante === "BOLETA" && (
                    <div className="col-12">
                        <div className="border rounded-3 p-3 bg-light-subtle">
                            <p className="small fw-bold text-muted text-uppercase mb-3">
                                Datos de boleta
                            </p>
                            <div className="row g-3">
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">
                                        Nombre
                                    </label>
                                    <input
                                        type="text"
                                        name="nombreComprobante"
                                        className="form-control"
                                        value={formData.nombreComprobante}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">
                                        DNI
                                    </label>
                                    <input
                                        type="text"
                                        name="dni"
                                        maxLength={8}
                                        className="form-control"
                                        value={formData.dni}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <label className="form-label fw-bold">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="emailComprobante"
                                        className="form-control"
                                        value={formData.emailComprobante}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {formData.tipoComprobante === "FACTURA" && (
                    <div className="col-12">
                        <div className="border rounded-3 p-3 bg-light-subtle">
                            <p className="small fw-bold text-muted text-uppercase mb-3">
                                Datos de factura
                            </p>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold">
                                        Razón social
                                    </label>
                                    <input
                                        type="text"
                                        name="razonSocial"
                                        className="form-control"
                                        value={formData.razonSocial}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-bold">
                                        RUC
                                    </label>
                                    <input
                                        type="text"
                                        name="ruc"
                                        maxLength={11}
                                        className="form-control"
                                        value={formData.ruc}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-bold">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="emailComprobante"
                                        className="form-control"
                                        value={formData.emailComprobante}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="form-label fw-bold">
                                        Dirección fiscal
                                    </label>
                                    <input
                                        type="text"
                                        name="direccionFiscal"
                                        className="form-control"
                                        value={formData.direccionFiscal}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Dirección de Entrega: no aplica para cajero presencial */}

                {/* Separador */}
                <div className="col-12">
                    <hr />
                </div>

                {/* Agregar Productos */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">
                        Código de barras / Producto
                    </label>
                    <div className="position-relative">
                        <input
                            ref={productSearchRef}
                            id="venta-product-search"
                            type="text"
                            className="form-control"
                            value={productQuery}
                            onChange={(e) => {
                                setProductQuery(e.target.value);
                                setSelectedProduct(null);
                            }}
                            onKeyDown={handleProductSearchKeyDown}
                            placeholder=""
                            disabled={loadingData}
                            autoComplete="off"
                        />

                        {filteredProducts.length > 0 && !selectedProduct && (
                            <div
                                className="list-group position-absolute w-100"
                                style={{ zIndex: 20, maxHeight: 240, overflowY: "auto" }}
                            >
                                {filteredProducts.map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                        onClick={() => {
                                            setSelectedProduct(p);
                                            setProductQuery(
                                                `${p.codigo ? `${p.codigo} - ` : ""}${p.nombre}`,
                                            );
                                        }}
                                    >
                                        <span className="me-2">
                                            {p.codigo ? (
                                                <span className="badge bg-secondary me-2">
                                                    {p.codigo}
                                                </span>
                                            ) : null}
                                            {p.nombre}
                                        </span>
                                        <span className="text-muted">
                                            Stock: {p.stock}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-md-3">
                    <label className="form-label fw-bold">Cantidad</label>
                    <input
                        type="number"
                        className="form-control"
                        value={selectedQuantity}
                        onChange={(e) =>
                            setSelectedQuantity(
                                Math.max(1, parseInt(e.target.value) || 1),
                            )
                        }
                        min="1"
                        max={selectedProductData?.stock || 1}
                        disabled={!selectedProductData}
                    />
                </div>

                <div className="col-md-3 d-flex align-items-end">
                    <button
                        type="button"
                        className="btn btn-success w-100"
                        onClick={handleAddDetail}
                        disabled={loadingData}
                    >
                        <i className="bi bi-plus-circle me-2"></i>Agregar
                    </button>
                </div>

                {/* Tabla de Detalles */}
                <div className="col-12">
                    {formData.detalles.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover table-sm">
                                <thead className="table-light">
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.detalles.map((detail) => (
                                        <tr key={detail.productoId}>
                                            <td>{detail.productName}</td>
                                            <td>
                                                S/ {detail.precio.toFixed(2)}
                                            </td>
                                            <td>{detail.cantidad}</td>
                                            <td className="fw-bold">
                                                S/ {detail.subtotal.toFixed(2)}
                                            </td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() =>
                                                        handleRemoveDetail(
                                                            detail.productoId,
                                                        )
                                                    }
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="table-light">
                                        <td colSpan="3" className="text-end">
                                            Subtotal (sin IGV)
                                        </td>
                                        <td>S/ {subtotalBase.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                    <tr className="table-light">
                                        <td colSpan="3" className="text-end">
                                            IGV (13%)
                                        </td>
                                        <td>S/ {igv.toFixed(2)}</td>
                                        <td></td>
                                    </tr>
                                    {delivery > 0 && (
                                        <tr className="table-light">
                                            <td colSpan="3" className="text-end">
                                                Envío
                                            </td>
                                            <td>S/ {delivery.toFixed(2)}</td>
                                            <td></td>
                                        </tr>
                                    )}
                                    <tr className="table-light fw-bold">
                                        <td colSpan="3" className="text-end">
                                            TOTAL
                                        </td>
                                        <td className="text-success">
                                            S/ {total.toFixed(2)}
                                        </td>
                                        <td></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-info">
                            <i className="bi bi-info-circle me-2"></i>
                            Aún no hay productos agregados
                        </div>
                    )}
                </div>

                <div className="col-12">
                    <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top admin-modal-footer">
                        <button
                            type="button"
                            className="btn btn-light fw-bold text-secondary px-4 border admin-modal-btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success px-5 fw-bold shadow-sm admin-btn-primary admin-modal-btn-primary"
                            disabled={
                                loading ||
                                loadingData ||
                                formData.detalles.length === 0
                            }
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Creando venta...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-circle me-2"></i>
                                    Crear Venta
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default VentaForm;
