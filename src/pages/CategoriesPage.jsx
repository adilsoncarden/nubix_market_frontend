import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useCategories } from "../features/categories/hooks/useCategories";
import { categoryService } from "../features/categories/services/categoryService";
import CategoryForm from "../features/categories/components/CategoryForm";
import Swal from "sweetalert2";

const CategoriesPage = () => {
    const {
        categories,
        loading,
        handleDelete,
        setCategories,
    } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [saving, setSaving] = useState(false);

    // --- CONFIGURACIÓN DE PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Cambiado a 10 por página

    const modalRef = useRef();
    const bsModal = useRef();

    const totalCategorias = categories.length;

    // --- LÓGICA DE SEGMENTACIÓN ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(totalCategorias / itemsPerPage);

    useEffect(() => {
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
        }
    }, []);

    // Ajuste automático si se eliminan elementos y la página actual queda vacía
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [categories, totalPages, currentPage]);

    const openModal = (category = null) => {
        setSelectedCategory(category ? { ...category } : null);
        bsModal.current.show();
    };

    const handleSave = async (formData) => {
        setSaving(true);
        try {
            if (selectedCategory) {
                const updated = await categoryService.update(selectedCategory.id, formData);
                setCategories(categories.map((c) => c.id === selectedCategory.id ? updated : c));
                Swal.fire({ icon: "success", title: "Actualizado", showConfirmButton: false, timer: 1500 });
            } else {
                const created = await categoryService.create(formData);
                setCategories([...categories, created]);
                Swal.fire({ icon: "success", title: "Creado", showConfirmButton: false, timer: 1500 });
            }
            bsModal.current.hide();
        } catch (error) {
            Swal.fire("Error", "Ocurrió un problema.", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container-fluid animate__animated animate__fadeIn p-4">
            
            {/* CABECERA */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1" style={{ letterSpacing: '-0.02em', color: '#1a1d23' }}>
                        Catálogo de Categorías
                    </h2>
                    <p className="text-muted small mb-0">
                        Gestiona la jerarquía de productos de <span className="fw-semibold text-primary">Nubix Market</span>
                    </p>
                </div>
                <button
                    className="btn btn-success shadow-sm px-4 fw-bold"
                    onClick={() => openModal()}
                    style={{ backgroundColor: "#198754", border: "none", borderRadius: '10px' }}
                >
                    <i className="bi bi-plus-lg me-2"></i> Nueva Categoría
                </button>
            </div>

            {/* MÉTRICAS RÁPIDAS */}
            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <i className="bi bi-tag-fill fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <h6 className="text-muted mb-0 small fw-bold text-uppercase">Total Categorías</h6>
                                <h3 className="fw-bold mb-0">{totalCategorias}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center">
                            <div className="flex-shrink-0 bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <i className="bi bi-check-circle-fill fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <h6 className="text-muted mb-0 small fw-bold text-uppercase">Estado del Sistema</h6>
                                <h3 className="fw-bold mb-0 text-primary">Activo</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLA PRINCIPAL */}
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '12px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 text-secondary small fw-bold" style={{ width: '80px' }}>ID</th>
                                <th className="py-3 text-secondary small fw-bold">NOMBRE</th>
                                <th className="py-3 text-secondary small fw-bold">DESCRIPCIÓN</th>
                                <th className="text-end px-4 py-3 text-secondary small fw-bold">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {totalCategorias === 0 && !loading ? (
                                <tr>
                                    <td colSpan="4" className="text-center py-5 text-muted">No se encontraron categorías.</td>
                                </tr>
                            ) : (
                                currentItems.map((cat) => (
                                    <tr key={cat.id}>
                                        <td className="px-4 text-muted small">#{cat.id}</td>
                                        <td><span className="fw-bold text-dark">{cat.nombre}</span></td>
                                        <td><span className="text-muted text-truncate d-inline-block" style={{ maxWidth: '300px' }}>{cat.descripcion || "—"}</span></td>
                                        <td className="text-end px-4">
                                            <button 
                                                className="btn btn-sm btn-outline-primary me-2 border-0 shadow-none" 
                                                onClick={() => openModal(cat)}
                                                title="Editar"
                                            >
                                                <i className="bi bi-pencil-square fs-6"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-outline-danger border-0 shadow-none" 
                                                onClick={() => handleDelete(cat.id)}
                                                title="Eliminar"
                                            >
                                                <i className="bi bi-trash3 fs-6"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER DE LA TABLA CON PAGINACIÓN */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-white">
                        <div className="text-muted small">
                            Mostrando <span className="fw-semibold text-dark">{indexOfFirstItem + 1}</span> a <span className="fw-semibold text-dark">{Math.min(indexOfLastItem, totalCategorias)}</span> de <span className="fw-semibold text-dark">{totalCategorias}</span> categorías
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link border-0 shadow-none bg-transparent" onClick={() => setCurrentPage(currentPage - 1)}>
                                        <i className="bi bi-chevron-left text-dark"></i>
                                    </button>
                                </li>
                                
                                {[...Array(totalPages)].map((_, index) => (
                                    <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                                        <button 
                                            className="page-link border-0 shadow-none mx-1 rounded-3" 
                                            style={currentPage === index + 1 ? 
                                                { backgroundColor: '#198754', color: 'white' } : 
                                                { backgroundColor: '#f8f9fa', color: '#1a1d23' }}
                                            onClick={() => setCurrentPage(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link border-0 shadow-none bg-transparent" onClick={() => setCurrentPage(currentPage + 1)}>
                                        <i className="bi bi-chevron-right text-dark"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>

            {/* MODAL */}
            <div className="modal fade" ref={modalRef} tabIndex="-1" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                        <div className="modal-header border-0 pb-0 pt-4 px-4">
                            <h5 className="modal-title fw-bold">
                                {selectedCategory ? "Modificar Categoría" : "Crear Nueva Categoría"}
                            </h5>
                            <button type="button" className="btn-close shadow-none" onClick={() => bsModal.current.hide()}></button>
                        </div>
                        <div className="modal-body py-4 px-4">
                            <CategoryForm category={selectedCategory} onSave={handleSave} loading={saving} />
                        </div>
                        <div className="modal-footer border-0 pt-0 px-4 pb-4">
                            <button type="button" className="btn btn-light fw-semibold text-muted" onClick={() => bsModal.current.hide()} style={{ borderRadius: '8px' }}>
                                Cancelar
                            </button>
                            <button type="submit" form="categoryForm" className="btn btn-success px-4 fw-bold shadow-sm" disabled={saving} style={{ borderRadius: '8px' }}>
                                {saving ? (
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                ) : (
                                    <i className="bi bi-check2-circle me-2"></i>
                                )}
                                {saving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;