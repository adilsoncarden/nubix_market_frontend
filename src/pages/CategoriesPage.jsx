import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal } from "bootstrap";
import { useCategories } from "../features/categories/hooks/useCategories";
import { categoryService } from "../features/categories/services/categoryService";
import CategoryForm from "../features/categories/components/CategoryForm";
import { Toast } from "../utils/swalConfig";
import { reportService } from "../features/reports/services/reportService";
import { exportCategoriesPdf } from "../features/categories/utils/exportCategoriesPdf";
import SearchInput from "../components/admin/SearchInput";
import AdminToolbarPanel from "../components/admin/AdminToolbarPanel";
import AdminModal, { AdminModalActions } from "../components/admin/AdminModal";
import AdminResponsiveTable from "../components/admin/AdminResponsiveTable";

const CategoriesPage = () => {
    const { categories, loading, handleDelete, setCategories } =
        useCategories();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [formKey, setFormKey] = useState(() => Date.now());
    const [exportingPdf, setExportingPdf] = useState(false);

    // --- FILTRADO POR NOMBRE Y DESCRIPCIÓN ---
    const filteredCategories = useMemo(() => {
        return categories.filter(
            (cat) =>
                cat.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                cat.descripcion
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()),
        );
    }, [categories, searchTerm]);

    // --- LÓGICA DE PAGINACIÓN (10 items) ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalCategorias = filteredCategories.length;
    const totalPages = Math.ceil(totalCategorias / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    // Obtenemos los items actuales
    const currentItems = filteredCategories.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [filteredCategories.length, totalPages, currentPage]);

    // --- MODAL CONFIG (Sin desenfoque) ---
    const modalRef = useRef();
    const bsModal = useRef();

    useEffect(() => {
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
            modalRef.current.addEventListener("hidden.bs.modal", () => {
                setSelectedCategory(null);
                setFormKey(Date.now());
            });
        }
    }, []);

    const openModal = (category = null) => {
        setSelectedCategory(null);
        setFormKey(Date.now());
        setTimeout(() => {
            setSelectedCategory(category ? { ...category } : null);
            bsModal.current.show();
        }, 10);
    };

    const exportarPDF = async () => {
        setExportingPdf(true);
        try {
            await exportCategoriesPdf(filteredCategories);
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

    const handleSave = async (formData) => {
        setSaving(true);
        try {
            if (selectedCategory) {
                const updated = await categoryService.update(
                    selectedCategory.id,
                    formData,
                );
                // Actualización inmediata del estado local
                setCategories((prev) =>
                    prev.map((c) =>
                        c.id === selectedCategory.id ? updated : c,
                    ),
                );
                Toast.fire({
                    icon: "success",
                    title: "Categoría actualizada con éxito",
                });
            } else {
                const created = await categoryService.create(formData);
                setCategories((prev) => [...prev, created]);
                Toast.fire({
                    icon: "success",
                    title: "Nueva categoría registrada",
                });
            }
            bsModal.current.hide();
        } catch (error) {
            Toast.fire({
                icon: "error",
                title: "Error al procesar la solicitud",
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="admin-page animate__animated animate__fadeIn">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="admin-page-title fw-bold mb-1">
                        Nubix Market <span className="admin-accent-slash">/</span>{" "}
                        Categorías
                    </h2>
                    <p className="text-muted small mb-0">
                        Gestión de taxonomía y organización de productos
                    </p>
                </div>
                <div className="d-flex flex-wrap gap-2 admin-page-header-actions">
                    <button
                        type="button"
                        className="btn btn-outline-success shadow-sm px-3 py-2 fw-bold d-flex align-items-center"
                        onClick={() =>
                            reportService.exportCategories().catch(() =>
                                Toast.fire({
                                    icon: "error",
                                    title: "No se pudo exportar categorías",
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
                        disabled={exportingPdf || filteredCategories.length === 0}
                    >
                        {exportingPdf ? (
                            <span className="spinner-border spinner-border-sm me-2" />
                        ) : (
                            <i className="bi bi-file-earmark-pdf me-2" />
                        )}
                        PDF
                    </button>
                    <button
                        className="btn btn-success shadow-sm px-4 py-2 fw-bold d-flex align-items-center admin-btn-primary"
                        onClick={() => openModal()}
                >
                    <i className="bi bi-plus-lg me-2"></i> Nueva Categoría
                    </button>
                </div>
            </div>

            <AdminToolbarPanel
                stats={[
                    {
                        icon: "bi bi-grid-fill fs-4",
                        label: "Resultados",
                        value: totalCategorias,
                    },
                ]}
            >
                <SearchInput
                    placeholder="Buscar por nombre o descripción de la categoría..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </AdminToolbarPanel>

            {/* TABLA CON ID SECUENCIAL */}
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
                                <th className="py-3 text-secondary small fw-bold text-center">
                                    CATEGORÍA
                                </th>
                                <th className="py-3 text-secondary small fw-bold">
                                    DESCRIPCIÓN
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
                                        colSpan="5"
                                        className="text-center py-5"
                                    >
                                        <div
                                            className="spinner-border text-emerald-600"
                                            role="status"
                                        ></div>
                                    </td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((cat, index) => (
                                    <tr key={cat.id}>
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
                                                {cat.nombre}
                                            </span>
                                        </td>
                                        <td className="text-muted small">
                                            {cat.descripcion || "—"}
                                        </td>
                                        <td className="text-end px-4">
                                            <button
                                                className="btn-action btn-edit me-2"
                                                onClick={() => openModal(cat)}
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                            <button
                                                className="btn-action btn-delete"
                                                onClick={() =>
                                                    handleDelete(cat.id)
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
                                        colSpan="5"
                                        className="text-center py-5 text-muted"
                                    >
                                        No se encontraron coincidencias para "
                                        {searchTerm}"
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
                                {Math.min(indexOfLastItem, totalCategorias)}
                            </span>{" "}
                            de {totalCategorias}
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
                title={
                    selectedCategory
                        ? "Editar Información"
                        : "Nueva Categoría"
                }
                onClose={() => bsModal.current.hide()}
            >
                <CategoryForm
                    key={formKey}
                    category={selectedCategory}
                    onSave={handleSave}
                    loading={saving}
                />
                <AdminModalActions
                    onClose={() => bsModal.current.hide()}
                    submitForm="categoryForm"
                    saving={saving}
                    savingLabel="Procesando..."
                    confirmLabel="Confirmar Datos"
                />
            </AdminModal>

        </div>
    );
};

export default CategoriesPage;
