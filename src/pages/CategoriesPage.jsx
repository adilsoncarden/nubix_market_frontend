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

    // --- LÓGICA DE PAGINACIÓN MODIFICADA ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Cambiado a 8 para consistencia
    const totalCategorias = categories.length;
    const totalPages = Math.ceil(totalCategorias / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Reajuste automático de página al eliminar
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [categories.length, totalPages, currentPage]);
    // ----------------------------

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

            {/* MÉTRICAS */}
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
                            {currentItems.map((cat) => (
                                <tr key={cat.id}>
                                    <td className="px-4 text-muted small">#{cat.id}</td>
                                    <td><span className="fw-bold text-dark">{cat.nombre}</span></td>
                                    <td><span className="text-muted text-truncate d-inline-block" style={{ maxWidth: '300px' }}>{cat.descripcion || "—"}</span></td>
                                    <td className="text-end px-4">
                                        <button 
                                            className="btn btn-sm me-2 border-0 shadow-none p-1 btn-animate-edit" 
                                            onClick={() => openModal(cat)}
                                            style={{ color: '#0d9488' }}
                                        >
                                            <i className="bi bi-pencil fs-5"></i>
                                        </button>
                                        <button 
                                            className="btn btn-sm text-danger border-0 shadow-none p-1 btn-animate-delete" 
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            <i className="bi bi-trash3 fs-5"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* CONTROLES DE PAGINACIÓN (Modificados para consistencia visual) */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-white">
                        <div className="text-muted small">
                            Mostrando <span className="fw-bold text-dark">{indexOfFirstItem + 1}</span> a <span className="fw-bold text-dark">{Math.min(indexOfLastItem, totalCategorias)}</span> de <span className="fw-bold text-dark">{totalCategorias}</span> categorías
                        </div>
                        <nav>
                            <ul className="pagination pagination-sm mb-0 align-items-center">
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link border-0 bg-transparent text-success shadow-none p-2" onClick={() => paginate(currentPage - 1)}>
                                        <i className="bi bi-chevron-left"></i>
                                    </button>
                                </li>
                                
                                {[...Array(totalPages).keys()].map(num => (
                                    <li key={num + 1} className={`page-item ${currentPage === num + 1 ? 'active' : ''}`}>
                                        <button 
                                            className="page-link border-0 mx-1 d-flex align-items-center justify-content-center shadow-none" 
                                            onClick={() => paginate(num + 1)}
                                            style={{
                                                width: '32px', height: '32px', borderRadius: '8px', fontWeight: '600',
                                                backgroundColor: currentPage === num + 1 ? '#198754' : '#f8f9fa',
                                                color: currentPage === num + 1 ? '#fff' : '#1a1d23'
                                            }}
                                        >
                                            {num + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link border-0 bg-transparent text-success shadow-none p-2" onClick={() => paginate(currentPage + 1)}>
                                        <i className="bi bi-chevron-right"></i>
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
                        <div className="modal-header border-0 pt-4 px-4 pb-0">
                            <h5 className="modal-title fw-bold">
                                {selectedCategory ? "Modificar Categoría" : "Crear Nueva Categoría"}
                            </h5>
                            <button type="button" className="btn-close shadow-none" onClick={() => bsModal.current.hide()}></button>
                        </div>
                        <div className="modal-body p-4">
                            <CategoryForm category={selectedCategory} onSave={handleSave} loading={saving} />
                            
                            <div className="d-flex justify-content-end gap-2 mt-4">
                                <button type="button" className="btn btn-light fw-semibold text-muted px-4" onClick={() => bsModal.current.hide()} style={{ borderRadius: '8px' }}>
                                    Cancelar
                                </button>
                                <button type="submit" form="categoryForm" className="btn btn-success px-4 fw-bold shadow-sm" disabled={saving} style={{ borderRadius: '8px', backgroundColor: '#198754' }}>
                                    {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check2-circle me-2"></i>}
                                    {saving ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .modal.show { backdrop-filter: blur(4px); background-color: rgba(0,0,0,0.4); }
                .btn-animate-edit, .btn-animate-delete { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
                .btn-animate-edit:hover { transform: scale(1.25); filter: drop-shadow(0 0 8px rgba(13, 148, 136, 0.5)); color: #0f766e !important; }
                .btn-animate-delete:hover { transform: scale(1.25); filter: drop-shadow(0 0 8px rgba(220, 53, 69, 0.5)); color: #a51d2a !important; }
                
                /* Estilos de paginación mejorados */
                .page-link:hover:not(.active) {
                    background-color: #e9ecef !important;
                    color: #198754 !important;
                }
            `}</style>
        </div>
    );
};

export default CategoriesPage;