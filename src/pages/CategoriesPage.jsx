import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal } from "bootstrap";
import { useCategories } from "../features/categories/hooks/useCategories";
import { categoryService } from "../features/categories/services/categoryService";
import CategoryForm from "../features/categories/components/CategoryForm";
import Swal from "sweetalert2";

const CategoriesPage = () => {
    const { categories, loading, handleDelete, setCategories } =
        useCategories();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    // --- CONFIGURACIÓN DE SWEETALERT (TOAST) ---
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
        }
    }, []);

    const openModal = (category = null) => {
        setSelectedCategory(category ? { ...category } : null);
        bsModal.current.show();
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
        <div
            className="container-fluid animate__animated animate__fadeIn p-4"
            style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}
        >
            {/* HEADER */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2
                        className="fw-bold mb-1"
                        style={{ letterSpacing: "-0.03em", color: "#111827" }}
                    >
                        Nubix Market <span style={{ color: "#10b981" }}>/</span>{" "}
                        Categorías
                    </h2>
                    <p className="text-muted small mb-0">
                        Gestión de taxonomía y organización de productos
                    </p>
                </div>
                <button
                    className="btn btn-success shadow-sm px-4 py-2 fw-bold d-flex align-items-center"
                    onClick={() => openModal()}
                    style={{
                        backgroundColor: "#10b981",
                        border: "none",
                        borderRadius: "10px",
                    }}
                >
                    <i className="bi bi-plus-lg me-2"></i> Nueva Categoría
                </button>
            </div>

            {/* MÉTRICAS Y BUSCADOR MEJORADO */}
            <div className="row g-4 mb-4">
                <div className="col-md-3">
                    <div
                        className="card border-0 shadow-sm p-3"
                        style={{ borderRadius: "15px" }}
                    >
                        <div className="d-flex align-items-center">
                            <div
                                className="flex-shrink-0 bg-emerald-100 text-emerald-600 rounded-3 d-flex align-items-center justify-content-center"
                                style={{ width: "48px", height: "48px" }}
                            >
                                <i className="bi bi-grid-fill fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <h6 className="text-muted mb-0 small fw-bold text-uppercase">
                                    Resultados
                                </h6>
                                <h3 className="fw-bold mb-0">
                                    {totalCategorias}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-9">
                    <div
                        className="card border-0 shadow-sm p-2 d-flex flex-row align-items-center px-3"
                        style={{ borderRadius: "15px", height: "100%" }}
                    >
                        <i className="bi bi-search text-emerald-600 me-3 fs-5"></i>
                        <input
                            type="text"
                            className="form-control border-0 shadow-none bg-transparent"
                            placeholder="Buscar por nombre o descripción de la categoría..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* TABLA CON ID SECUENCIAL */}
            <div
                className="card shadow-sm border-0 overflow-hidden"
                style={{ borderRadius: "15px" }}
            >
                <div className="table-responsive">
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
                                <th className="py-3 text-secondary small fw-bold text-center">
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
                                        colSpan="4"
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
                                        <td className="text-center">
                                            <span className="text-muted small">
                                                {cat.descripcion || (
                                                    <i className="opacity-50 text-xs">
                                                        Sin descripción
                                                        detallada
                                                    </i>
                                                )}
                                            </span>
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
                                        colSpan="4"
                                        className="text-center py-5 text-muted"
                                    >
                                        No se encontraron coincidencias para "
                                        {searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN VERDE */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-white">
                        <div className="text-muted small">
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
                                    >
                                        <i className="bi bi-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* MODAL VERDE */}
            <div
                className="modal fade"
                ref={modalRef}
                tabIndex="-1"
                data-bs-backdrop="static"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div
                        className="modal-content border-0 shadow-lg"
                        style={{ borderRadius: "15px" }}
                    >
                        <div className="modal-header border-0 pt-4 px-4 pb-0">
                            <h5 className="modal-title fw-bold text-dark d-flex align-items-center">
                                <span
                                    className="bg-emerald-600 rounded-circle d-inline-block me-2"
                                    style={{ width: "10px", height: "10px" }}
                                ></span>
                                {selectedCategory
                                    ? "Editar Información"
                                    : "Nueva Categoría"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close shadow-none"
                                onClick={() => bsModal.current.hide()}
                            ></button>
                        </div>
                        <div className="modal-body p-4">
                            <CategoryForm
                                category={selectedCategory}
                                onSave={handleSave}
                                loading={saving}
                            />

                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button
                                    type="button"
                                    className="btn btn-light fw-bold text-secondary px-4 border"
                                    onClick={() => bsModal.current.hide()}
                                    style={{ borderRadius: "10px" }}
                                >
                                    Cerrar
                                </button>
                                <button
                                    type="submit"
                                    form="categoryForm"
                                    className="btn btn-success px-4 fw-bold shadow-sm"
                                    disabled={saving}
                                    style={{
                                        borderRadius: "10px",
                                        backgroundColor: "#10b981",
                                        border: "none",
                                    }}
                                >
                                    {saving ? (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    ) : (
                                        <i className="bi bi-save2-fill me-2"></i>
                                    )}
                                    {saving
                                        ? "Procesando..."
                                        : "Confirmar Datos"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                /* Estilos de Marca */
                .text-emerald-600 { color: #10b981 !important; }
                .bg-emerald-100 { background-color: #d1fae5 !important; }
                .bg-emerald-600 { background-color: #10b981 !important; }

                /* Reset de Modal (Sin Blur) */
                .modal.show { backdrop-filter: none !important; background-color: rgba(17, 24, 39, 0.6) !important; }

                /* Botones de Accion Verdes */
                .btn-action {
                    border: none; background: transparent; padding: 6px 10px;
                    border-radius: 8px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    font-size: 1.15rem;
                }
                .btn-edit { color: #10b981; }
                .btn-edit:hover { background-color: #ecfdf5; transform: scale(1.15); }
                .btn-delete { color: #ef4444; }
                .btn-delete:hover { background-color: #fef2f2; transform: scale(1.15); }

                /* Paginación Activa */
                .active-pagination { background-color: #10b981 !important; color: white !important; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.4); }
                .page-link:hover:not(.active-pagination) { background-color: #ecfdf5 !important; color: #10b981 !important; }
                
                /* Input de Búsqueda */
                .form-control:focus { border-color: #10b981; box-shadow: none; }

                /* Animación suave para filas */
                tr { transition: background-color 0.15s; }
            `}</style>
        </div>
    );
};

export default CategoriesPage;
