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
        fetchCategories,
        handleDelete,
        setCategories,
    } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [saving, setSaving] = useState(false);

    const modalRef = useRef();
    const bsModal = useRef();

    useEffect(() => {
        bsModal.current = new Modal(modalRef.current);
    }, []);

    const openModal = (category = null) => {
        // Forzamos el reset del estado antes de abrir
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
                // Actualización instantánea en la lista
                setCategories(
                    categories.map((c) =>
                        c.id === selectedCategory.id ? updated : c,
                    ),
                );
                Swal.fire({
                    icon: "success",
                    title: "Actualizado",
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                const created = await categoryService.create(formData);
                setCategories([...categories, created]);
                Swal.fire({
                    icon: "success",
                    title: "Creado",
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
            bsModal.current.hide();
        } catch (error) {
            Swal.fire("Error", "Ocurrió un problema al guardar.", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container-fluid animate__animated animate__fadeIn">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-0">Gestión de Categorías</h2>
                    <p className="text-muted small">
                        Administra los grupos de productos de Nubix Market
                    </p>
                </div>
                <button
                    className="btn btn-primary btn-lg shadow-sm"
                    onClick={() => openModal()}
                >
                    <i className="bi bi-plus-circle me-2"></i> Nueva Categoría
                </button>
            </div>

            <div className="card shadow-sm border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 text-secondary small">
                                    ID
                                </th>
                                <th className="py-3 text-secondary small">
                                    NOMBRE
                                </th>
                                <th className="py-3 text-secondary small">
                                    DESCRIPCIÓN
                                </th>
                                <th className="text-end px-4 py-3 text-secondary small">
                                    ACCIONES
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 && !loading ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="text-center py-5 text-muted"
                                    >
                                        No hay categorías registradas.
                                    </td>
                                </tr>
                            ) : (
                                categories.map((cat) => (
                                    <tr key={cat.id} className="border-bottom">
                                        <td className="px-4 text-muted small">
                                            #{cat.id}
                                        </td>
                                        <td>
                                            <span className="fw-bold text-dark">
                                                {cat.nombre}
                                            </span>
                                        </td>
                                        <td>
                                            <span
                                                className="text-muted d-inline-block text-truncate"
                                                style={{ maxWidth: "300px" }}
                                            >
                                                {cat.descripcion}
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <button
                                                className="btn btn-light btn-sm border me-2"
                                                onClick={() => openModal(cat)}
                                            >
                                                <i className="bi bi-pencil-square text-primary"></i>
                                            </button>
                                            <button
                                                className="btn btn-light btn-sm border"
                                                onClick={() =>
                                                    handleDelete(cat.id)
                                                }
                                            >
                                                <i className="bi bi-trash3 text-danger"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL */}
            <div
                className="modal fade"
                ref={modalRef}
                tabIndex="-1"
                data-bs-backdrop="static"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header bg-white border-0 pb-0">
                            <h5 className="modal-title fw-bold">
                                {selectedCategory
                                    ? "✏️ Editar Categoría"
                                    : "✨ Nueva Categoría"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => bsModal.current.hide()}
                            ></button>
                        </div>
                        <div className="modal-body py-4">
                            <CategoryForm
                                category={selectedCategory}
                                onSave={handleSave}
                                loading={saving}
                            />
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button
                                type="button"
                                className="btn btn-link text-muted text-decoration-none"
                                onClick={() => bsModal.current.hide()}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="categoryForm"
                                className="btn btn-primary px-4 shadow-sm"
                                disabled={saving}
                            >
                                {saving ? "Procesando..." : "Guardar Categoría"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;
