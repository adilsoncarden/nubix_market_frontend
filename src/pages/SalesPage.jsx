import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Modal } from "bootstrap";
import { useSales } from "../features/sales/hooks/useSales";
import { saleService, formatSaleDateTime, getSaleClientLabel } from "../features/sales/services/saleService";
import VentaForm from "../features/sales/components/VentaForm";
import Swal from "sweetalert2";
import { useProductCatalog } from "../store/ProductCatalogContext";
import { reportService } from "../features/reports/services/reportService";
import { clientService } from "../features/users/services/clientService";
import { Toast } from "../utils/swalConfig";
import {
    filterSales,
    TIPO_ENTREGA_OPTIONS,
    TIPO_ENTREGA_LABELS,
} from "../features/sales/utils/saleFilters";

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
    const [filterTipoEntrega, setFilterTipoEntrega] = useState("");
    const [filterClienteId, setFilterClienteId] = useState("");
    const [filterDesde, setFilterDesde] = useState("");
    const [filterHasta, setFilterHasta] = useState("");
    const [clients, setClients] = useState([]);

    const [formkey, setFormKey] = useState(Date.now());

    useEffect(() => {
        clientService
            .getAll()
            .then((data) => setClients(Array.isArray(data) ? data : []))
            .catch(() => setClients([]));
    }, []);

    const filteredSales = useMemo(
        () =>
            filterSales(sales, {
                searchTerm,
                tipoEntrega: filterTipoEntrega,
                clienteId: filterClienteId,
                desde: filterDesde,
                hasta: filterHasta,
            }),
        [
            sales,
            searchTerm,
            filterTipoEntrega,
            filterClienteId,
            filterDesde,
            filterHasta,
        ],
    );

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalResultados = filteredSales.length;
    const totalPages = Math.ceil(totalResultados / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredSales.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setCurrentPage(1);
    }, [
        searchTerm,
        filterTipoEntrega,
        filterClienteId,
        filterDesde,
        filterHasta,
    ]);

    const clearFilters = () => {
        setFilterTipoEntrega("");
        setFilterClienteId("");
        setFilterDesde("");
        setFilterHasta("");
        setSearchTerm("");
    };

    const hasActiveFilters =
        filterTipoEntrega ||
        filterClienteId ||
        filterDesde ||
        filterHasta ||
        searchTerm;

    const openExportModal = useCallback(() => {
        const hastaDefault =
            filterHasta || new Date().toISOString().slice(0, 10);
        const desdeDefault =
            filterDesde ||
            new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);

        const clienteOptions = clients
            .map(
                (c) =>
                    `<option value="${c.id}" ${String(c.id) === String(filterClienteId) ? "selected" : ""}>${c.username || c.email || `Cliente #${c.id}`}</option>`,
            )
            .join("");

        Swal.fire({
            title: "Exportar ventas",
            html: `
              <div class="text-start">
                <label class="form-label small">Desde</label>
                <input type="date" id="exp-desde" class="form-control mb-2" value="${desdeDefault}">
                <label class="form-label small">Hasta</label>
                <input type="date" id="exp-hasta" class="form-control mb-2" value="${hastaDefault}">
                <label class="form-label small">Tipo de entrega</label>
                <select id="exp-entrega" class="form-select mb-2">
                  <option value="">Todos</option>
                  <option value="PRESENCIAL" ${filterTipoEntrega === "PRESENCIAL" ? "selected" : ""}>Presencial</option>
                  <option value="FAST_LANE" ${filterTipoEntrega === "FAST_LANE" ? "selected" : ""}>Fast Lane</option>
                  <option value="DELIVERY" ${filterTipoEntrega === "DELIVERY" ? "selected" : ""}>Delivery</option>
                </select>
                <label class="form-label small">Cliente</label>
                <select id="exp-cliente" class="form-select mb-2">
                  <option value="">Todos</option>
                  ${clienteOptions}
                </select>
                <label class="form-label small">Estado pedido</label>
                <select id="exp-estado-pedido" class="form-select mb-2">
                  <option value="">Todos</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="EN_PROCESO">En proceso</option>
                  <option value="LISTO_PARA_RECOJO">Listo para recojo</option>
                  <option value="EN_CAMINO">En camino</option>
                  <option value="ENTREGADO">Entregado</option>
                </select>
                <label class="form-label small">Estado pago</label>
                <select id="exp-estado-pago" class="form-select">
                  <option value="">Todos</option>
                  <option value="PAGADO">Pagado</option>
                  <option value="APROBADO">Aprobado</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="RECHAZADO">Rechazado</option>
                </select>
              </div>`,
            showCancelButton: true,
            confirmButtonText: "Descargar",
            confirmButtonColor: "#10b981",
            preConfirm: () => {
                const desde = document.getElementById("exp-desde").value;
                const hasta = document.getElementById("exp-hasta").value;
                if (!desde || !hasta) {
                    Swal.showValidationMessage("Indique el rango de fechas");
                    return false;
                }
                if (hasta < desde) {
                    Swal.showValidationMessage(
                        "La fecha hasta debe ser posterior o igual a desde",
                    );
                    return false;
                }
                return {
                    desde,
                    hasta,
                    tipoEntrega:
                        document.getElementById("exp-entrega").value ||
                        undefined,
                    clienteId:
                        document.getElementById("exp-cliente").value ||
                        undefined,
                    estadoPedido:
                        document.getElementById("exp-estado-pedido").value ||
                        undefined,
                    estadoPago:
                        document.getElementById("exp-estado-pago").value ||
                        undefined,
                };
            },
        }).then((r) => {
            if (r.isConfirmed) {
                reportService.exportSales(r.value).catch(() =>
                    Toast.fire({ icon: "error", title: "Error al exportar" }),
                );
            }
        });
    }, [clients, filterClienteId, filterDesde, filterHasta, filterTipoEntrega]);

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
        <div className="admin-page">
            <div className="row mb-4 g-3">
                <div className="col-12 col-md-8">
                    <h2 className="admin-page-title fw-bold mb-0">
                        <i className="bi bi-cart-check me-2 text-emerald-600"></i>
                        Gestión de Ventas
                    </h2>
                </div>
                <div className="col-12 col-md-4 d-flex flex-wrap gap-2 justify-content-md-end admin-page-header-actions">
                    <button
                        type="button"
                        onClick={openExportModal}
                        className="btn btn-outline-success fw-bold"
                        disabled={loading}
                    >
                        <i className="bi bi-file-earmark-excel me-2"></i>Excel
                    </button>
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

            {/* Buscador y filtros */}
            <div className="row g-3 mb-4">
                <div className="col-md-3">
                    <div
                        className="card border-0 shadow-sm p-3"
                        style={{ borderRadius: "12px" }}
                    >
                        <div className="d-flex align-items-center">
                            <div
                                className="bg-emerald-100 text-emerald-600 rounded-3 d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px" }}
                            >
                                <i className="bi bi-receipt fs-5"></i>
                            </div>
                            <div className="ms-3">
                                <small
                                    className="text-muted d-block fw-bold"
                                    style={{ fontSize: "10px" }}
                                >
                                    RESULTADOS
                                </small>
                                <h4 className="fw-bold mb-0">
                                    {filteredSales.length}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div
                        className="card border-0 shadow-sm p-2 d-flex flex-row align-items-center px-3 admin-search-card"
                        style={{ borderRadius: "12px", height: "100%" }}
                    >
                        <i className="bi bi-search text-muted me-3"></i>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none bg-transparent"
                            placeholder="Buscar por cliente, orden, tipo de entrega, estado o código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ fontSize: "0.9rem" }}
                        />
                    </div>
                </div>
            </div>

            <div
                className="card border-0 shadow-sm p-3 mb-4"
                style={{ borderRadius: "12px" }}
            >
                <div className="row g-2 align-items-end">
                    <div className="col-md-3">
                        <label className="form-label small text-muted fw-bold mb-1">
                            Tipo de entrega
                        </label>
                        <select
                            className="form-select form-select-sm"
                            value={filterTipoEntrega}
                            onChange={(e) =>
                                setFilterTipoEntrega(e.target.value)
                            }
                        >
                            {TIPO_ENTREGA_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small text-muted fw-bold mb-1">
                            Cliente
                        </label>
                        <select
                            className="form-select form-select-sm"
                            value={filterClienteId}
                            onChange={(e) =>
                                setFilterClienteId(e.target.value)
                            }
                        >
                            <option value="">Todos los clientes</option>
                            {clients.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.username || c.email || `Cliente #${c.id}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small text-muted fw-bold mb-1">
                            Desde
                        </label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={filterDesde}
                            onChange={(e) => setFilterDesde(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <label className="form-label small text-muted fw-bold mb-1">
                            Hasta
                        </label>
                        <input
                            type="date"
                            className="form-control form-control-sm"
                            value={filterHasta}
                            onChange={(e) => setFilterHasta(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2">
                        <button
                            type="button"
                            className="btn btn-outline-secondary btn-sm w-100"
                            onClick={clearFilters}
                            disabled={!hasActiveFilters}
                        >
                            <i className="bi bi-x-circle me-1"></i>
                            Limpiar
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div
                className="card border-0 shadow-sm overflow-hidden"
                style={{ borderRadius: "12px" }}
            >
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
                                            <td>{getSaleClientLabel(sale)}</td>
                                            <td>{sale.vendedor?.username || "-"}</td>
                                            <td>{formatSaleDateTime(sale)}</td>
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
                                                    {TIPO_ENTREGA_LABELS[
                                                        sale.tipoEntrega
                                                    ] || sale.tipoEntrega}
                                                </small>
                                                {sale.tipoEntrega === "FAST_LANE" &&
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
                                                            const clienteLabel =
                                                                getSaleClientLabel(
                                                                    sale,
                                                                );
                                                            const fechaLabel =
                                                                formatSaleDateTime(
                                                                    sale,
                                                                );
                                                            Swal.fire({
                                                                title: `Venta #${sale.id}`,
                                                                html: `
                                                                    <div class="text-start">
                                                                        <p><strong>Cliente:</strong> ${clienteLabel}</p>
                                                                        <p><strong>Vendedor:</strong> ${sale.vendedor?.username || "-"}</p>
                                                                        <p><strong>Fecha:</strong> ${fechaLabel}</p>
                                                                        <p><strong>Total:</strong> S/ ${sale.total.toFixed(2)}</p>
                                                                        <p><strong>Estado:</strong> ${sale.estadoPedido}</p>
                                                                        <hr>
                                                                        <strong>Detalles:</strong>
                                                                        <ul>
                                                                            ${(sale.detalles || [])
                                                                                .map(
                                                                                    (
                                                                                        d,
                                                                                    ) =>
                                                                                        `<li>${d.producto?.nombre || "Producto"} x${d.cantidad} = S/ ${Number(d.subtotal || 0).toFixed(2)}</li>`,
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
                                className="bi bi-inbox text-muted"
                                style={{ fontSize: "3rem" }}
                            ></i>
                            <p className="text-muted mt-3">
                                No hay ventas para mostrar
                            </p>
                        </div>
                    )}
                </div>

                {!loading && totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-body admin-pagination-bar">
                        <div className="text-muted small admin-pagination-info">
                            Mostrando <b>{indexOfFirstItem + 1}</b> a{" "}
                            <b>
                                {Math.min(indexOfLastItem, totalResultados)}
                            </b>{" "}
                            de {totalResultados}
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0 gap-1">
                                <li
                                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                                >
                                    <button
                                        className="page-link border-0 rounded-2"
                                        onClick={() =>
                                            paginate(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                {[...Array(totalPages).keys()].map((num) => (
                                    <li key={num + 1}>
                                        <button
                                            className={`page-link border-0 rounded-2 fw-bold ${currentPage === num + 1 ? "active-pagination" : "text-dark bg-light"}`}
                                            onClick={() => paginate(num + 1)}
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                            }}
                                        >
                                            {num + 1}
                                        </button>
                                    </li>
                                ))}
                                <li
                                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                                >
                                    <button
                                        className="page-link border-0 rounded-2"
                                        onClick={() =>
                                            paginate(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                    >
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

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
