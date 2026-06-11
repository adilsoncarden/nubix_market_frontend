import React, { useEffect, useState, useRef, useMemo } from "react";
import { Modal } from "bootstrap";
import { useSuppliers } from "../features/suppliers/hooks/useSuppliers";
import SupplierForm from "../features/suppliers/components/SupplierForm";
import { reportService } from "../features/reports/services/reportService";
import { exportSuppliersPdf } from "../features/suppliers/utils/exportSuppliersPdf";
import { Toast } from "../utils/swalConfig";
import SearchInput from "../components/admin/SearchInput";
import AdminToolbarPanel from "../components/admin/AdminToolbarPanel";
import AdminModal, { AdminModalActions } from "../components/admin/AdminModal";
import AdminResponsiveTable from "../components/admin/AdminResponsiveTable";

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
    const [saving, setSaving] = useState(false);
    const [exportingPdf, setExportingPdf] = useState(false);
    const [formkey, setFormKey] = useState(() => Date.now());
    const itemsPerPage = 10;

    useEffect(() => {
        refreshSuppliers();
    }, []);

    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(
            (s) =>
                s.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                s.ruc?.includes(searchTerm) ||
                s.telefono?.includes(searchTerm),
        );
    }, [suppliers, searchTerm]);

    const totalResultados = filteredSuppliers.length;
    const totalPages = Math.ceil(totalResultados / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentSuppliers = filteredSuppliers.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [filteredSuppliers.length, totalPages, currentPage]);

    const modalRef = useRef();
    const bsModal = useRef();

    useEffect(() => {
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
            modalRef.current.addEventListener("hidden.bs.modal", () => {
                setSelectedSupplier(null);
                setFormKey(Date.now());
            });
        }
    }, []);

    const handleOpenModal = (supplier = null) => {
        setSelectedSupplier(null);
        setFormKey(Date.now());
        setTimeout(() => {
            setSelectedSupplier(supplier ? { ...supplier } : null);
            bsModal.current.show();
        }, 10);
    };

    const exportarPDF = async () => {
        setExportingPdf(true);
        try {
            await exportSuppliersPdf(filteredSuppliers);
            Toast.fire({
                icon: "success",
                title: "PDF generado correctamente",
            });
        } catch (error) {
            console.error(error);
            Toast.fire({
                icon: "error",
                title: "No se pudo exportar el PDF",
            });
        } finally {
            setExportingPdf(false);
        }
    };

    const handleSave = async (data) => {
        setSaving(true);
        try {
            const success = await saveSupplier(data, selectedSupplier?.id);
            if (success) {
                bsModal.current.hide();
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (id) => {
        removeSupplier(id);
    };

    return (
        <div className="admin-page animate__animated animate__fadeIn">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="admin-page-title fw-bold mb-1">
                        Nubix Market <span className="admin-accent-slash">/</span>{" "}
                        Proveedores
                    </h2>
                    <p className="text-muted small mb-0">
                        Gestión de contactos comerciales y RUC
                    </p>
                </div>
                <div className="d-flex flex-wrap gap-2 admin-page-header-actions">
                    <button
                        type="button"
                        className="btn btn-outline-success shadow-sm px-3 py-2 fw-bold d-flex align-items-center"
                        onClick={() =>
                            reportService.exportSuppliers().catch(() =>
                                Toast.fire({
                                    icon: "error",
                                    title: "No se pudo exportar proveedores",
                                }),
                            )
                        }
                    >
                        <i className="bi bi-file-earmark-excel me-2"></i> Excel
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-success shadow-sm px-3 py-2 fw-bold d-flex align-items-center"
                        onClick={exportarPDF}
                        disabled={
                            exportingPdf || filteredSuppliers.length === 0
                        }
                    >
                        {exportingPdf ? (
                            <span className="spinner-border spinner-border-sm me-2" />
                        ) : (
                            <i className="bi bi-file-earmark-pdf me-2" />
                        )}
                        PDF
                    </button>
                    <button
                        type="button"
                        className="btn btn-success shadow-sm px-4 py-2 fw-bold d-flex align-items-center admin-btn-primary"
                        onClick={() => handleOpenModal()}
                    >
                        <i className="bi bi-plus-lg me-2"></i> Nuevo Proveedor
                    </button>
                </div>
            </div>

            <AdminToolbarPanel
                stats={[
                    {
                        icon: "bi bi-people-fill fs-4",
                        label: "Resultados",
                        value: totalResultados,
                    },
                ]}
            >
                <SearchInput
                    placeholder="Buscar por RUC, razón social o teléfono..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </AdminToolbarPanel>

            <div
                className="card shadow-sm border-0 overflow-hidden"
                style={{ borderRadius: "15px" }}
            >
                <AdminResponsiveTable>
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th
                                    className="px-4 py-3 text-secondary small fw-bold text-center"
                                    style={{ width: "80px" }}
                                >
                                    #
                                </th>
                                <th
                                    className="py-3 text-secondary small fw-bold text-center"
                                    style={{ width: "130px" }}
                                >
                                    RUC / ID
                                </th>
                                <th className="py-3 text-secondary small fw-bold">
                                    RAZÓN SOCIAL
                                </th>
                                <th
                                    className="py-3 text-secondary small fw-bold text-end"
                                    style={{ width: "140px" }}
                                >
                                    TELÉFONO
                                </th>
                                <th
                                    className="py-3 text-secondary small fw-bold text-center"
                                    style={{ width: "220px" }}
                                >
                                    CORREO
                                </th>
                                <th className="text-end px-4 py-3 text-secondary small fw-bold">
                                    ACCIONES
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-5"
                                    >
                                        <div
                                            className="spinner-border text-emerald-600"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Cargando...
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : currentSuppliers.length > 0 ? (
                                currentSuppliers.map((s, index) => (
                                    <tr key={s.id}>
                                        <td className="px-4 text-center">
                                            <span
                                                className="badge bg-emerald-100 text-emerald-600 fw-bold"
                                                style={{
                                                    borderRadius: "6px",
                                                    fontSize: "0.85rem",
                                                }}
                                            >
                                                {indexOfFirstItem + index + 1}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            <span className="fw-bold text-dark">
                                                {s.ruc || s.id}
                                            </span>
                                        </td>
                                        <td className="fw-bold text-dark">
                                            {s.nombre}
                                        </td>
                                        <td className="text-end text-muted">
                                            {s.telefono || "—"}
                                        </td>
                                        <td className="text-center text-muted small">
                                            {s.email || "—"}
                                        </td>
                                        <td className="text-end px-4">
                                            <button
                                                type="button"
                                                className="btn-action btn-edit me-2"
                                                onClick={() =>
                                                    handleOpenModal(s)
                                                }
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-action btn-delete"
                                                onClick={() =>
                                                    handleDelete(s.id)
                                                }
                                                title="Eliminar"
                                            >
                                                <i className="bi bi-trash3-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="text-center py-5 text-muted"
                                    >
                                        {searchTerm
                                            ? `No se encontraron coincidencias para "${searchTerm}"`
                                            : "No hay proveedores registrados."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </AdminResponsiveTable>

                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-body admin-pagination-bar">
                        <div className="text-muted small admin-pagination-info">
                            Mostrando{" "}
                            <span className="fw-bold">
                                {indexOfFirstItem + 1}
                            </span>{" "}
                            -{" "}
                            <span className="fw-bold">
                                {Math.min(indexOfLastItem, totalResultados)}
                            </span>{" "}
                            de {totalResultados}
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0 gap-1">
                                <li
                                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                                >
                                    <button
                                        type="button"
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
                                            type="button"
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
                                        type="button"
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

            <AdminModal
                modalRef={modalRef}
                scrollable
                title={
                    selectedSupplier
                        ? "Editar Proveedor"
                        : "Nuevo Proveedor"
                }
                onClose={() => bsModal.current.hide()}
                closeDisabled={saving}
            >
                <SupplierForm
                    key={formkey}
                    supplier={selectedSupplier}
                    onSave={handleSave}
                    loading={saving}
                />
                <AdminModalActions
                    onClose={() => bsModal.current.hide()}
                    submitForm="supplierForm"
                    saving={saving}
                    confirmLabel="Confirmar Datos"
                />
            </AdminModal>
        </div>
    );
};

export default SuppliersPage;
