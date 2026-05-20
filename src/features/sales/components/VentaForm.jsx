import React, { useState, useEffect } from "react";
import { clientService } from "../../users/services/clientService";
import { employeeService } from "../../users/services/employeeService";
import { productService } from "../../products/services/productService";
import Swal from "sweetalert2";

const VentaForm = ({ onSave, loading }) => {
    const [formData, setFormData] = useState({
        clienteId: "",
        vendedorId: "",
        metodoPago: "EFECTIVO",
        tipoEntrega: "RECOJO",
        direccionEntrega: "",
        detalles: [],
    });

    const [clients, setClients] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoadingData(true);
            try {
                const [clientsData, employeesData, productsData] =
                    await Promise.all([
                        clientService.getAll(),
                        employeeService.getAll(),
                        productService.getAll(),
                    ]);
                setClients(clientsData);
                setEmployees(employeesData);
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

        const product = products.find(
            (p) => p.id === parseInt(selectedProduct),
        );
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
            (d) => d.productoId === parseInt(selectedProduct),
        );

        if (existingDetail) {
            Swal.fire("Validación", "Este producto ya fue agregado", "warning");
            return;
        }

        const newDetail = {
            productoId: parseInt(selectedProduct),
            productName: product.nombre,
            precio: product.precioVenta,
            cantidad: parseInt(selectedQuantity),
            subtotal: product.precioVenta * parseInt(selectedQuantity),
        };

        setFormData((prev) => ({
            ...prev,
            detalles: [...prev.detalles, newDetail],
        }));

        setSelectedProduct("");
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

        if (!formData.clienteId || !formData.vendedorId) {
            Swal.fire("Validación", "Selecciona cliente y vendedor", "warning");
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
            clienteId: parseInt(formData.clienteId),
            vendedorId: parseInt(formData.vendedorId),
            metodoPago: formData.metodoPago,
            tipoEntrega: formData.tipoEntrega,
            direccionEntrega:
                formData.tipoEntrega === "DELIVERY"
                    ? formData.direccionEntrega
                    : null,
            detalles: formData.detalles.map((d) => ({
                productoId: d.productoId,
                cantidad: d.cantidad,
            })),
        };

        onSave(dataToSend);
    };

    const total = calculateTotal();
    const selectedProductData = products.find(
        (p) => p.id === parseInt(selectedProduct),
    );

    return (
        <form onSubmit={handleSubmit} id="ventaForm">
            <div className="row g-3">
                {/* Cliente */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Cliente</label>
                    <select
                        name="clienteId"
                        className="form-select"
                        value={formData.clienteId}
                        onChange={handleChange}
                        required
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
                    <select
                        name="vendedorId"
                        className="form-select"
                        value={formData.vendedorId}
                        onChange={handleChange}
                        required
                        disabled={loadingData}
                    >
                        <option value="">Seleccionar...</option>
                        {employees.map((employee) => (
                            <option key={employee.id} value={employee.id}>
                                {employee.username}
                            </option>
                        ))}
                    </select>
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
                        <option value="TRANSFERENCIA">Transferencia</option>
                        <option value="CREDITO">Crédito</option>
                    </select>
                </div>

                {/* Tipo de Entrega */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">
                        Tipo de Entrega
                    </label>
                    <select
                        name="tipoEntrega"
                        className="form-select"
                        value={formData.tipoEntrega}
                        onChange={handleChange}
                        required
                    >
                        <option value="RECOJO">Recojo en tienda</option>
                        <option value="DELIVERY">Delivery</option>
                    </select>
                </div>

                {/* Dirección de Entrega (condicional) */}
                {formData.tipoEntrega === "DELIVERY" && (
                    <div className="col-12">
                        <label className="form-label fw-bold">
                            Dirección de Entrega
                        </label>
                        <input
                            type="text"
                            name="direccionEntrega"
                            className="form-control"
                            value={formData.direccionEntrega}
                            onChange={handleChange}
                            placeholder="Ingresa la dirección de entrega"
                            required={formData.tipoEntrega === "DELIVERY"}
                        />
                    </div>
                )}

                {/* Separador */}
                <div className="col-12">
                    <hr />
                </div>

                {/* Agregar Productos */}
                <div className="col-md-6">
                    <label className="form-label fw-bold">Producto</label>
                    <select
                        className="form-select"
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        disabled={loadingData}
                    >
                        <option value="">Seleccionar...</option>
                        {products.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.nombre} (Stock: {product.stock})
                            </option>
                        ))}
                    </select>
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
