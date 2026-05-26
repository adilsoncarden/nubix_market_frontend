import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal } from "bootstrap";
import { useSales } from "../features/sales/hooks/useSales";
import { saleService } from "../features/sales/services/saleService";
import VentaForm from "../features/sales/components/VentaForm";
import Swal from "sweetalert2";
import { useProductCatalog } from "../store/ProductCatalogContext";

const SalesPage = () => {
    const {
        sales,
        setSales,
        handleStatusUpdate,
        handleRegisterCredit,
        loading,
    } = useSales();
    const { invalidate: invalidateCatalog } = useProductCatalog();
    const [selectedSale, setSelectedSale] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [formkey, setFormKey] = useState(Date.now());

    const Toast = Swal.mixin({
        toast: true,
        position: "bottom-end",
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    });

    // Filtrado de ventas
    const filteredSales = useMemo(() => {
        return sales.filter(
            (sale) =>
                sale.cliente?.username
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                sale.id?.toString().includes(searchTerm) ||
                sale.estadoPedido
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()),
        );
    }, [sales, searchTerm]);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalResultados = filteredSales.length;
    const totalPages = Math.ceil(totalResultados / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Métricas
    const totalVentas = useMemo(
        () => sales.reduce((sum, sale) => sum + sale.total, 0),
        [sales],
    );

    // Modal
    const modalRef = useRef();
    const bsModal = useRef();

    useEffect(() => {
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
            modalRef.current.addEventListener("hidden.bs.modal", () => {
                setSelectedSale(null);
            });
        }
    }, []);

    const openModal = () => {
        setSelectedSale(null);
        setFormKey(Date.now());
        setTimeout(() => {
            bsModal.current.show();
        }, 10);
    };

    const handleSave = async (formData) => {
        setSaving(true);
        try {
            const newSale = await saleService.create(formData);
            setSales((prev) => [newSale, ...prev]);
            invalidateCatalog();
            bsModal.current.hide();

            Toast.fire({
                icon: "success",
                title: "¡Venta creada exitosamente!",
            });
        } catch (err) {
            console.error("Error al crear venta:", err);
            Toast.fire({
                icon: "error",
                title: err.response?.data || "Error al crear la venta",
            });
        } finally {
            setSaving(false);
        }
    };

    const getEstadoPedidoColor = (estado) => {
        const colors = {
            PENDIENTE: "badge bg-warning text-dark",
            EN_PROCESO: "badge bg-info",
            LISTO_PARA_RECOJO: "badge bg-primary",
            EN_CAMINO: "badge bg-primary",
            ENTREGADO: "badge bg-success",
        };
        return colors[estado] || "badge bg-secondary";
    };

    const getEstadoPagoColor = (estado) => {
        const colors = {
            PAGADO: "badge bg-success",
            APROBADO: "badge bg-success",
            PENDIENTE: "badge bg-warning text-dark",
            RECHAZADO: "badge bg-danger",
        };
        return colors[estado] || "badge bg-secondary";
    };

    return (
        <div className="container-fluid p-4">
            {/* Header */}
            <div className="row mb-4">
                <div className="col-md-8">
                    <h2 className="fw-bold text-dark">
                        <i className="bi bi-cart-check me-2"></i>Gestión de
                        Ventas
                    </h2>
                </div>
                <div className="col-md-4 d-flex gap-2 justify-content-end">
                    <button
                        onClick={openModal}
                        className="btn btn-success fw-bold"
                        disabled={loading}
                    >
                        <i className="bi bi-plus-circle me-2"></i>Nueva Venta
                    </button>
                </div>
            </div>

            {/* Tarjetas de Métricas */}
            <div className="row mb-4">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-light">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted small fw-bold mb-1">
                                        TOTAL VENTAS
                                    </p>
                                    <h4 className="fw-bold text-success">
                                        {sales.length}
                                    </h4>
                                </div>
                                <i
                                    className="bi bi-graph-up text-success"
                                    style={{ fontSize: "2rem" }}
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-light">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted small fw-bold mb-1">
                                        INGRESOS
                                    </p>
                                    <h4 className="fw-bold text-success">
                                        S/ {totalVentas.toFixed(2)}
                                    </h4>
                                </div>
                                <i
                                    className="bi bi-cash-coin text-success"
                                    style={{ fontSize: "2rem" }}
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-light">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted small fw-bold mb-1">
                                        PENDIENTES
                                    </p>
                                    <h4 className="fw-bold text-warning">
                                        {
                                            sales.filter(
                                                (s) =>
                                                    s.estadoPedido ===
                                                    "PENDIENTE",
                                            ).length
                                        }
                                    </h4>
                                </div>
                                <i
                                    className="bi bi-clock-history text-warning"
                                    style={{ fontSize: "2rem" }}
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm bg-light">
                        <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-muted small fw-bold mb-1">
                                        ENTREGADAS
                                    </p>
                                    <h4 className="fw-bold text-success">
                                        {
                                            sales.filter(
                                                (s) =>
                                                    s.estadoPedido ===
                                                    "ENTREGADO",
                                            ).length
                                        }
                                    </h4>
                                </div>
                                <i
                                    className="bi bi-check-circle text-success"
                                    style={{ fontSize: "2rem" }}
                                ></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Búsqueda */}
            <div className="row mb-3">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Buscar por cliente, ID o estado..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            {/* Tabla */}
            <div className="card border-0 shadow-sm">
                <div className="card-body">
                    {loading ? (
                        <div className="text-center p-5">
                            <div
                                className="spinner-border text-success"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Cargando...
                                </span>
                            </div>
                        </div>
                    ) : currentItems.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>ID</th>
                                        <th>Cliente</th>
                                        <th>Vendedor</th>
                                        <th>Fecha</th>
                                        <th>Total</th>
                                        <th>Método Pago</th>
                                        <th>Estado Pago</th>
                                        <th>Estado Pedido</th>
                                        <th>Entrega</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((sale) => (
                                        <tr key={sale.id}>
                                            <td className="fw-bold">
                                                #{sale.id}
                                            </td>
                                            <td>
                                                {sale.cliente?.username ||
                                                    sale.nombreComprobante ||
                                                    "Consumidor final"}
                                            </td>
                                            <td>{sale.vendedor?.username}</td>
                                            <td>
                                                {new Date(
                                                    sale.fecha,
                                                ).toLocaleDateString("es-PE")}
                                            </td>
                                            <td className="fw-bold text-success">
                                                S/ {sale.total.toFixed(2)}
                                            </td>
                                            <td>
                                                <span className="badge bg-info">
                                                    {sale.metodoPago}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={getEstadoPagoColor(
                                                        sale.estadoPago,
                                                    )}
                                                >
                                                    {sale.estadoPago}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={getEstadoPedidoColor(
                                                        sale.estadoPedido,
                                                    )}
                                                >
                                                    {sale.estadoPedido}
                                                </span>
                                            </td>
                                            <td>
                                                <small>
                                                    {sale.tipoEntrega}
                                                </small>
                                                {(sale.tipoEntrega ===
                                                    "FAST_LANE" ||
                                                    sale.tipoEntrega ===
                                                        "PRESENCIAL") &&
                                                    sale.codigoRecojo && (
                                                    <div className="text-muted small">
                                                        Código:{" "}
                                                        {sale.codigoRecojo}
                                                    </div>
                                                )}
                                                {sale.tipoEntrega ===
                                                    "DELIVERY" && (
                                                    <div className="text-muted small">
                                                        {sale.direccionEntrega}
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <div
                                                    className="btn-group btn-group-sm"
                                                    role="group"    
                                                >
                                                    <button
                                                        className="btn btn-outline-info"
                                                        title="Ver detalles"
                                                        onClick={() => {
                                                            Swal.fire({
                                                                title: `Venta #${sale.id}`,
                                                                html: `
                                                                    <div class="text-start">
                                                                        <p><strong>Cliente:</strong> ${sale.cliente?.username}</p>
                                                                        <p><strong>Vendedor:</strong> ${sale.vendedor?.username}</p>
                                                                        <p><strong>Total:</strong> S/ ${sale.total.toFixed(2)}</p>
                                                                        <p><strong>Estado:</strong> ${sale.estadoPedido}</p>
                                                                        <hr>
                                                                        <strong>Detalles:</strong>
                                                                        <ul>
                                                                            ${sale.detalles
                                                                                .map(
                                                                                    (
                                                                                        d,
                                                                                    ) =>
                                                                                        `<li>${d.producto?.nombre} x${d.cantidad} = S/ ${d.subtotal.toFixed(2)}</li>`,
                                                                                )
                                                                                .join(
                                                                                    "",
                                                                                )}
                                                                        </ul>
                                                                    </div>
                                                                `,
                                                                icon: "info",
                                                            });
                                                        }}
                                                    >
                                                        <i className="bi bi-eye"></i>
                                                    </button>

                                                    {(sale.estadoPago ===
                                                        "PENDIENTE" ||
                                                        sale.estadoPago ===
                                                            "RECHAZADO") &&
                                                        sale.metodoPago ===
                                                            "CREDITO" && (
                                                            <button
                                                                className="btn btn-outline-success"
                                                                title="Registrar crédito como pagado"
                                                                onClick={() => {
                                                                    Swal.fire({
                                                                        title: "Registrar Pago",
                                                                        text: "¿Marcar este crédito como pagado?",
                                                                        icon: "question",
                                                                        showCancelButton: true,
                                                                        confirmButtonText:
                                                                            "Sí, registrar",
                                                                        cancelButtonText:
                                                                            "Cancelar",
                                                                    }).then(
                                                                        (
                                                                            result,
                                                                        ) => {
                                                                            if (
                                                                                result.isConfirmed
                                                                            ) {
                                                                                handleRegisterCredit(
                                                                                    sale.id,
                                                                                );
                                                                            }
                                                                        },
                                                                    );
                                                                }}
                                                            >
                                                                <i className="bi bi-check-lg"></i>
                                                            </button>
                                                        )}

                                                    <select
                                                        className="btn btn-outline-warning"
                                                        value={
                                                            sale.estadoPedido
                                                        }
                                                        onChange={(e) => {
                                                            if (
                                                                e.target
                                                                    .value !==
                                                                sale.estadoPedido
                                                            ) {
                                                                handleStatusUpdate(
                                                                    sale.id,
                                                                    e.target
                                                                        .value,
                                                                );
                                                            }
                                                        }}
                                                        style={{
                                                            cursor: "pointer",
                                                        }}
                                                    >
                                                        <option value="PENDIENTE">
                                                            PENDIENTE
                                                        </option>
                                                        <option value="EN_PROCESO">
                                                            EN PROCESO
                                                        </option>
                                                        <option value="LISTO_PARA_RECOJO">
                                                            LISTO PARA RECOJO
                                                        </option>
                                                        <option value="EN_CAMINO">
                                                            EN CAMINO
                                                        </option>
                                                        <option value="ENTREGADO">
                                                            ENTREGADO
                                                        </option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center p-5">
                            <i
                                className="bi bi-inbox"
                                style={{ fontSize: "3rem" }}
                                className="text-muted"
                            ></i>
                            <p className="text-muted mt-3">
                                No hay ventas para mostrar
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <nav className="mt-4">
                    <ul className="pagination justify-content-center">
                        <li
                            className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => paginate(1)}
                                disabled={currentPage === 1}
                            >
                                Primera
                            </button>
                        </li>
                        {Array.from(
                            { length: totalPages },
                            (_, i) => i + 1,
                        ).map((page) => (
                            <li
                                key={page}
                                className={`page-item ${currentPage === page ? "active" : ""}`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() => paginate(page)}
                                >
                                    {page}
                                </button>
                            </li>
                        ))}
                        <li
                            className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => paginate(totalPages)}
                                disabled={currentPage === totalPages}
                            >
                                Última
                            </button>
                        </li>
                    </ul>
                </nav>
            )}

            {/* Modal */}
            <div
                className="modal fade"
                id="ventaModal"
                ref={modalRef}
                tabIndex="-1"
                aria-labelledby="ventaModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header bg-success text-white">
                            <h5 className="modal-title" id="ventaModalLabel">
                                <i className="bi bi-plus-circle me-2"></i>Nueva
                                Venta
                            </h5>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <VentaForm
                                key={formkey}
                                onSave={handleSave}
                                loading={saving}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SalesPage;
