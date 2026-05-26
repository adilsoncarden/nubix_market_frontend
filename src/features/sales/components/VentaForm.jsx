import React, { useState, useEffect } from "react";
import { clientService } from "../../users/services/clientService";
import { productService } from "../../products/services/productService";
import { useAuth } from "../../../store/AuthContext";
import Swal from "sweetalert2";

const VentaForm = ({ onSave, loading }) => {
    const { user } = useAuth();

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

    useEffect(() => {
        const loadData = async () => {
            setLoadingData(true);
            try {
                const [clientsData, productsData] = await Promise.all([
                    clientService.getAll(),
                    productService.getAll(),
                ]);
                setClients(clientsData);
                setProducts(productsData);
            } catch (err) {
                console.error("Error al cargar datos", err);
                Swal.fire("Error", "No se pudieron cargar los datos", "error");
            } finally {
                setLoadingData(false);
            }
        };
        loadData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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

        const product = selectedProduct;
        if (!product) {
            Swal.fire("Error", "Producto no encontrado", "error");
            return;
        }

        if (product.stock < selectedQuantity) {
            Swal.fire(
                "Error",
                `Stock insuficiente. Disponible: ${product.stock}`,
                "error",
            );
            return;
        }

        // Verificar si el producto ya existe en detalles
        const existingDetail = formData.detalles.find(
            (d) => d.productoId === product.id,
        );

        if (existingDetail) {
            Swal.fire("Validación", "Este producto ya fue agregado", "warning");
            return;
        }

        const newDetail = {
            productoId: product.id,
            productName: product.nombre,
            precio: product.precioVenta,
            cantidad: parseInt(selectedQuantity),
            subtotal: product.precioVenta * parseInt(selectedQuantity),
        };

        setFormData((prev) => ({
            ...prev,
            detalles: [...prev.detalles, newDetail],
        }));

        setSelectedProduct(null);
        setProductQuery("");
        setSelectedQuantity(1);
    };

    const handleRemoveDetail = (productoId) => {
        setFormData((prev) => ({
            ...prev,
            detalles: prev.detalles.filter((d) => d.productoId !== productoId),
        }));
    };

    const calculateTotal = () => {
        return formData.detalles.reduce(
            (sum, detail) => sum + detail.subtotal,
            0,
        );
    };

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

    const total = calculateTotal();
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
        <form onSubmit={handleSubmit} id="ventaForm">
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
                    <>
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Nombre</label>
                            <input
                                type="text"
                                name="nombreComprobante"
                                className="form-control"
                                value={formData.nombreComprobante}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label fw-bold">DNI</label>
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
                            <label className="form-label fw-bold">Email</label>
                            <input
                                type="email"
                                name="emailComprobante"
                                className="form-control"
                                value={formData.emailComprobante}
                                onChange={handleChange}
                            />
                        </div>
                    </>
                )}

                {formData.tipoComprobante === "FACTURA" && (
                    <>
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
                            <label className="form-label fw-bold">RUC</label>
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
                            <label className="form-label fw-bold">Email</label>
                            <input
                                type="email"
                                name="emailComprobante"
                                className="form-control"
                                value={formData.emailComprobante}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-12">
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
                    </>
                )}

                {/* Dirección de Entrega: no aplica para cajero presencial */}

                {/* Separador */}
                <div className="col-12">
                    <hr />
                </div>

                {/* Agregar Productos */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Producto</label>
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control"
                            value={productQuery}
                            onChange={(e) => {
                                setProductQuery(e.target.value);
                                setSelectedProduct(null);
                            }}
                            placeholder="Buscar por nombre o código (mín. 2 caracteres)"
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
                                    <tr className="table-light fw-bold">
                                        <td colSpan="3" className="text-end">
                                            TOTAL:
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

                {/* Botón Submit */}
                <div className="col-12">
                    <button
                        type="submit"
                        className="btn btn-lg btn-success w-100 fw-bold"
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
        </form>
    );
};

export default VentaForm;
