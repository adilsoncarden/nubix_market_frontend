import React, { useEffect, useState, useRef, useMemo } from "react";
import { Modal } from "bootstrap";
import { useSuppliers } from "../features/suppliers/hooks/useSuppliers";
import SupplierForm from "../features/suppliers/components/SupplierForm";
import { reportService } from "../features/reports/services/reportService";
import { Toast } from "../utils/swalConfig";

const SuppliersPage = () => {
    const {
        suppliers,
        loading,
        refreshSuppliers,
        saveSupplier,
        removeSupplier,
    } = useSuppliers();

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [formkey, setFormKey] = useState(Date.now());
    const itemsPerPage = 10;

    useEffect(() => {
        refreshSuppliers();
    }, []);

    // --- FILTRADO ---
    const filteredSuppliers = useMemo(() => {
        const filtered = suppliers.filter(
            (s) =>
                s.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.ruc?.includes(searchTerm) ||
                s.telefono?.includes(searchTerm),
        );
        setCurrentPage(1); // Resetear a pag 1 al buscar
        return filtered;
    }, [suppliers, searchTerm]);

    // --- LÓGICA DE PAGINACIÓN ---
    const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSuppliers = filteredSuppliers.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const modalRef = useRef();
    const bsModal = useRef();

    useEffect(() => {
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
            modalRef.current.addEventListener("hidden.bs.modal", () => {
                setSelectedSupplier(null);
            });
        }
    }, []);

    const handleOpenModal = (supplier = null) => {
        setSelectedSupplier(supplier ? { ...supplier } : null);

        // REINICIAR FORMULARIO
        setFormKey(Date.now());

        bsModal.current.show();
    };

    const handleSave = async (data) => {
        const success = await saveSupplier(data, selectedSupplier?.id);
        if (success) {
            bsModal.current.hide();
        }
    };

    const handleDelete = (id) => {
        removeSupplier(id);
    };

    return (
        <div
            className="container-fluid p-4"
            style={{
                backgroundColor: "#f9fafb",
                minHeight: "100vh",
                fontSize: "0.9rem",
            }}
        >
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-4 gap-2">
                <div>
                    <h2
                        className="fw-bold mb-0"
                        style={{ letterSpacing: "-0.03em", color: "#111827" }}
                    >
                        Nubix Market <span style={{ color: "#10b981" }}>/</span>{" "}
                        Proveedores
                    </h2>
                    <p className="text-muted small mb-0">
                        Gestión de contactos comerciales y RUC
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-success shadow-sm px-3 fw-bold"
                        onClick={() =>
                            reportService.exportSuppliers().catch(() =>
                                Toast.fire({ icon: "error", title: "Error al exportar" }),
                            )
                        }
                    >
                        <i className="bi bi-file-earmark-excel me-2"></i> Excel
                    </button>
                    <button
                        className="btn btn-success shadow-sm px-4 fw-bold"
                        onClick={() => handleOpenModal()}
                    style={{
                        backgroundColor: "#10b981",
                        border: "none",
                        borderRadius: "8px",
                        fontSize: "0.85rem",
                    }}
                >
                    <i className="bi bi-person-plus-fill me-2"></i> Nuevo
                    Proveedor
                    </button>
                </div>
            </div>

            {/* BUSCADOR Y MÉTRICA */}
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
                                <i className="bi bi-people-fill fs-5"></i>
                            </div>
                            <div className="ms-3">
                                <small
                                    className="text-muted d-block fw-bold"
                                    style={{ fontSize: "10px" }}
                                >
                                    TOTAL
                                </small>
                                <h4 className="fw-bold mb-0">
                                    {suppliers.length}
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div
                        className="card border-0 shadow-sm p-2 d-flex flex-row align-items-center px-3"
                        style={{ borderRadius: "12px", height: "100%" }}
                    >
                        <i className="bi bi-search text-muted me-3"></i>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none bg-transparent"
                            placeholder="Buscar por RUC, razón social o teléfono..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ fontSize: "0.9rem" }}
                        />
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div
                className="card shadow-sm border-0 overflow-hidden"
                style={{ borderRadius: "12px" }}
            >
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr style={{ fontSize: "0.75rem" }}>
                                <th
                                    className="px-4 py-3 text-secondary fw-bold"
                                    style={{ width: "50px" }}
                                >
                                    #
                                </th>
                                <th
                                    className="py-3 text-secondary fw-bold"
                                    style={{ width: "130px" }}
                                >
                                    RUC / ID
                                </th>
                                <th className="py-3 text-secondary fw-bold">
                                    RAZÓN SOCIAL
                                </th>
                                <th
                                    className="py-3 text-secondary fw-bold text-end"
                                    style={{ width: "140px" }}
                                >
                                    TELÉFONO
                                </th>
                                <th
                                    className="py-3 text-secondary fw-bold text-center"
                                    style={{ width: "220px" }}
                                >
                                    CORREO
                                </th>
                                <th
                                    className="text-end px-4 py-3 text-secondary fw-bold"
                                    style={{ width: "110px" }}
                                >
                                    ACCIONES
                                </th>
                            </tr>
                        </thead>
                        <tbody style={{ fontSize: "0.85rem" }}>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-5"
                                    >
                                        <div className="spinner-border spinner-border-sm text-emerald-600"></div>
                                    </td>
                                </tr>
                            ) : currentSuppliers.length > 0 ? (
                                currentSuppliers.map((s, index) => (
                                    <tr key={s.id}>
                                        <td className="px-4 text-muted">
                                            {indexOfFirstItem + index + 1}
                                        </td>
                                        <td>
                                            <span
                                                className="badge bg-light text-muted border fw-normal px-2 py-1"
                                                style={{ borderRadius: "6px" }}
                                            >
                                                {s.ruc || s.id}
                                            </span>
                                        </td>
                                        <td className="fw-bold text-dark">
                                            {s.nombre}
                                        </td>
                                        <td className="text-end text-muted">
                                            {s.telefono || "---"}
                                        </td>
                                        <td className="text-center">
                                            {s.email ? (
                                                <span
                                                    className="badge border text-muted fw-normal bg-white px-2 py-1"
                                                    style={{
                                                        borderRadius: "4px",
                                                        fontSize: "0.75rem",
                                                    }}
                                                >
                                                    {s.email}
                                                </span>
                                            ) : (
                                                "---"
                                            )}
                                        </td>
                                        <td className="text-end px-4">
                                            <div className="d-flex justify-content-end gap-1">
                                                <button
                                                    className="btn-table-action edit"
                                                    onClick={() =>
                                                        handleOpenModal(s)
                                                    }
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button
                                                    className="btn-table-action delete"
                                                    onClick={() =>
                                                        handleDelete(s.id)
                                                    }
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-5 text-muted"
                                    >
                                        No hay resultados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN ESTILO image_2adcbc.png */}
                {!loading && totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-white">
                        <div className="text-muted small">
                            Mostrando <b>{indexOfFirstItem + 1}</b> a{" "}
                            <b>
                                {Math.min(
                                    indexOfLastItem,
                                    filteredSuppliers.length,
                                )}
                            </b>{" "}
                            de {filteredSuppliers.length}
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
                                    >
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                {[...Array(totalPages).keys()].map((num) => (
                                    <li key={num + 1}>
                                        <button
                                            className={`page-link border-0 rounded-2 fw-bold ${currentPage === num + 1 ? "active-page" : "text-dark bg-light"}`}
                                            onClick={() => paginate(num + 1)}
                                            style={{
                                                width: "32px",
                                                height: "32px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
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
                                    >
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* MODAL */}
            <div
                className="modal fade"
                ref={modalRef}
                tabIndex="-1"
                data-bs-backdrop="static"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div
                        className="modal-content border-0 shadow-lg modal-custom-identity"
                        style={{ borderRadius: "15px" }}
                    >
                        <div className="modal-header border-0 pt-4 px-4 pb-0">
                            <h5 className="fw-bold text-dark mb-0">
                                {selectedSupplier
                                    ? "Editar Proveedor"
                                    : "Nuevo Proveedor"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close shadow-none"
                                onClick={() => bsModal.current.hide()}
                            ></button>
                        </div>
                        <div className="modal-body p-4">
                            <SupplierForm
                                key={formkey}
                                supplier={selectedSupplier}
                                onSave={handleSave}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .text-emerald-600 { color: #10b981 !important; }
                .bg-emerald-100 { background-color: #d1fae5 !important; }
                .table td { padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }

                .btn-table-action { border: none; background: none; padding: 4px 8px; font-size: 1.1rem; border-radius: 6px; transition: 0.2s; }
                .btn-table-action.edit { color: #10b981; }
                .btn-table-action.edit:hover { background-color: #ecfdf5; }
                .btn-table-action.delete { color: #ef4444; }
                .btn-table-action.delete:hover { background-color: #fef2f2; }

                /* Paginación Activa */
                .active-page { background-color: #10b981 !important; color: white !important; }
                .page-link:focus { box-shadow: none; }
                .page-link { font-size: 0.8rem; }

                /* Estilos Modal Identidad */
                .modal-custom-identity input:focus, .modal-custom-identity select:focus {
                    border-color: #10b981 !important;
                    box-shadow: 0 0 0 0.2rem rgba(16, 185, 129, 0.15) !important;
                }
                .modal-custom-identity button[type="submit"] {
                    background-color: #10b981 !important;
                    border: none !important;
                    border-radius: 8px !important;
                }
                .modal.show { background-color: rgba(0,0,0,0.5) !important; }
            `}</style>
        </div>
    );
};

export default SuppliersPage;
