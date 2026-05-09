import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useProducts } from "../features/products/hooks/useProducts";
import { useCategories } from "../features/categories/hooks/useCategories"; // Reutilizamos el hook de categorías
import { productService } from "../features/products/services/productService";
import ProductForm from "../features/products/components/ProductForm";
import Swal from "sweetalert2";

const ProductsPage = () => {
    const { products, setProducts, handleDelete, fetchProducts } =
        useProducts();
    const { categories } = useCategories();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [saving, setSaving] = useState(false);

    const modalRef = useRef();
    const bsModal = useRef();

    useEffect(() => {
        bsModal.current = new Modal(modalRef.current);
    }, []);

    const openModal = (product = null) => {
        setSelectedProduct(product ? { ...product } : null);
        bsModal.current.show();
    };

    const handleSave = async (formData) => {
        setSaving(true);
        try {
            if (selectedProduct) {
                const updated = await productService.update(
                    selectedProduct.id,
                    formData,
                );
                setProducts(
                    products.map((p) =>
                        p.id === selectedProduct.id ? updated : p,
                    ),
                );
                Swal.fire({
                    icon: "success",
                    title: "Producto actualizado",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                const created = await productService.create(formData);
                setProducts([...products, created]);
                Swal.fire({
                    icon: "success",
                    title: "Producto creado",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }
            bsModal.current.hide();
        } catch (err) {
            Swal.fire("Error", "No se pudo procesar la solicitud.", "error");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">Gestión de Productos</h2>
                <button
                    className="btn btn-primary shadow-sm"
                    onClick={() => openModal()}
                >
                    <i className="bi bi-box-seam me-2"></i> Nuevo Producto
                </button>
            </div>

            <div className="card shadow-sm border-0 overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 text-nowrap">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4">Código</th>
                                <th>Nombre</th>
                                <th>Categoría</th>
                                <th>P. Venta</th>
                                <th>Stock</th>
                                <th className="text-end px-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((prod) => (
                                <tr key={prod.id}>
                                    <td className="px-4 text-muted small">
                                        {prod.codigo}
                                    </td>
                                    <td>
                                        <span className="fw-bold">
                                            {prod.nombre}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge bg-info text-dark">
                                            {prod.categoriaNombre}
                                        </span>
                                    </td>
                                    <td className="fw-bold text-success">
                                        S/ {prod.precioVenta.toFixed(2)}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${prod.stock < 10 ? "bg-danger" : "bg-success"}`}
                                        >
                                            {prod.stock} un.
                                        </span>
                                    </td>
                                    <td className="text-end px-4">
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => openModal(prod)}
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() =>
                                                handleDelete(prod.id)
                                            }
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold">
                                {selectedProduct
                                    ? "Editar Producto"
                                    : "Nuevo Producto"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => bsModal.current.hide()}
                            ></button>
                        </div>
                        <div className="modal-body py-4">
                            <ProductForm
                                product={selectedProduct}
                                categories={categories}
                                onSave={handleSave}
                                loading={saving}
                            />
                        </div>
                        <div className="modal-footer border-0 pt-0">
                            <button
                                type="button"
                                className="btn btn-light"
                                onClick={() => bsModal.current.hide()}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                form="productForm"
                                className="btn btn-primary px-4"
                                disabled={saving}
                            >
                                {saving ? "Guardando..." : "Guardar Producto"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
