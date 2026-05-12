import React, { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";
import { useProducts } from "../features/products/hooks/useProducts";
import { useCategories } from "../features/categories/hooks/useCategories"; 
import { productService } from "../features/products/services/productService";
import ProductForm from "../features/products/components/ProductForm";
import Swal from "sweetalert2";

const ProductsPage = () => {
    const { products, setProducts, handleDelete, fetchProducts } = useProducts();
    const { categories } = useCategories();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [saving, setSaving] = useState(false);

    // --- ESTADOS PARA PAGINACIÓN ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const modalRef = useRef();
    const bsModal = useRef();

    // Cálculos de métricas
    const totalProductos = products.length;
    const valorInversion = products.reduce((acc, curr) => acc + (curr.precioVenta * curr.stock), 0);

    // --- LÓGICA DE PAGINACIÓN ---
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(totalProductos / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
        }
    }, []);

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [products.length, totalPages, currentPage]);

    const openModal = (product = null) => {
        setSelectedProduct(product ? { ...product } : null);
        bsModal.current.show();
    };

    const handleSave = async (formData) => {
        setSaving(true);
        try {
            if (selectedProduct) {
                const updated = await productService.update(selectedProduct.id, formData);
                setProducts(products.map((p) => p.id === selectedProduct.id ? updated : p));
                Swal.fire({ icon: "success", title: "Producto actualizado", timer: 1500, showConfirmButton: false });
            } else {
                const created = await productService.create(formData);
                setProducts([...products, created]);
                Swal.fire({ icon: "success", title: "Producto creado", timer: 1500, showConfirmButton: false });
            }
            bsModal.current.hide();
        } catch (err) {
            Swal.fire("Error", "No se pudo procesar la solicitud.", "error");
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
                        Gestión de Productos
                    </h2>
                    <p className="text-muted small mb-0">
                        Administra el inventario y precios de <span className="fw-semibold text-primary">Nubix Market</span>
                    </p>
                </div>
                <button
                    className="btn btn-success shadow-sm px-4 d-flex align-items-center btn-nuevo-producto"
                    onClick={() => openModal()}
                    style={{ 
                        height: '40px', 
                        backgroundColor: "#198754", 
                        border: "none",
                        fontWeight: "600",
                        borderRadius: '10px'
                    }}
                >
                    <i className="bi bi-box-seam me-2"></i> Nuevo Producto
                </button>
            </div>

            {/* MÉTRICAS (Recuperadas y Estilizadas) */}
            <div className="row g-4 mb-4">
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center px-2">
                            <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <i className="bi bi-box-fill fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '11px' }}>Total Productos</small>
                                <h3 className="fw-bold mb-0">{totalProductos}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '15px' }}>
                        <div className="d-flex align-items-center px-2">
                            <div className="bg-success-subtle text-success rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
                                <i className="bi bi-currency-dollar fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <small className="text-muted d-block fw-bold text-uppercase" style={{ fontSize: '11px' }}>Valor en Stock</small>
                                <h3 className="fw-bold mb-0">S/ {valorInversion.toLocaleString()}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLA */}
            <div className="card shadow-sm border-0 overflow-hidden" style={{ borderRadius: '12px' }}>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0 text-nowrap">
                        <thead className="bg-light">
                            <tr>
                                <th className="px-4 py-3 text-secondary small fw-bold">CÓDIGO</th>
                                <th className="py-3 text-secondary small fw-bold">NOMBRE</th>
                                <th className="py-3 text-secondary small fw-bold">CATEGORÍA</th>
                                <th className="py-3 text-secondary small fw-bold">P. VENTA</th>
                                <th className="py-3 text-secondary small fw-bold">STOCK</th>
                                <th className="text-end px-4 py-3 text-secondary small fw-bold">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-5 text-muted">No hay productos registrados.</td>
                                </tr>
                            ) : (
                                currentItems.map((prod) => (
                                    <tr key={prod.id} className="row-hover">
                                        <td className="px-4 text-muted small fw-bold">{prod.codigo}</td>
                                        <td><span className="fw-bold text-dark">{prod.nombre}</span></td>
                                        <td>
                                            <span className="badge border text-dark fw-normal bg-light" style={{ borderRadius: '6px' }}>
                                                {prod.categoriaNombre}
                                            </span>
                                        </td>
                                        <td><span className="fw-bold text-dark">S/ {prod.precioVenta.toFixed(2)}</span></td>
                                        <td>
                                            <span className={`badge border fw-normal ${prod.stock < 5 ? 'bg-danger-subtle text-danger border-danger' : 'bg-light text-dark'}`} style={{ borderRadius: '6px' }}>
                                                {prod.stock} un.
                                            </span>
                                        </td>
                                        <td className="text-end px-4">
                                            <button className="btn-icon-highlight edit me-3" onClick={() => openModal(prod)}>
                                                <i className="bi bi-pencil-fill"></i>
                                            </button>
                                            <button className="btn-icon-highlight delete" onClick={() => handleDelete(prod.id)}>
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINACIÓN UNIFICADA */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-white">
                        <div className="text-muted small">
                            Mostrando <span className="fw-bold text-dark">{indexOfFirstItem + 1}</span> a <span className="fw-bold text-dark">{Math.min(indexOfLastItem, totalProductos)}</span> de <span className="fw-bold text-dark">{totalProductos}</span> productos
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
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                        <div className="modal-header border-0 pb-0 pt-4 px-4">
                            <h5 className="modal-title fw-bold">
                                {selectedProduct ? "Editar Producto" : "Nuevo Producto"}
                            </h5>
                            <button type="button" className="btn-close shadow-none" onClick={() => bsModal.current.hide()}></button>
                        </div>
                        <div className="modal-body p-4">
                            <ProductForm product={selectedProduct} categories={categories} onSave={handleSave} loading={saving} />
                        </div>
                        <div className="modal-footer border-0 pt-0 px-4 pb-4">
                            <button type="button" className="btn border-0 px-4 fw-bold" onClick={() => bsModal.current.hide()} style={{ backgroundColor: '#f8f9fa', color: '#6c757d', borderRadius: '10px' }}>Cancelar</button>
                            <button 
                                type="submit" 
                                form="productForm" 
                                className="btn btn-success px-4 d-flex align-items-center fw-bold shadow-sm" 
                                disabled={saving}
                                style={{ backgroundColor: '#198754', border: 'none', borderRadius: '10px', height: '45px' }}
                            >
                                {saving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-check2-circle me-2 fs-5"></i>}
                                Guardar Producto
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .row-hover:hover { background-color: #fcfcfc !important; }
                .modal.fade { backdrop-filter: blur(4px); }
                
                .btn-icon-highlight {
                    background: none; border: none; padding: 8px;
                    font-size: 1.1rem; cursor: pointer;
                    transition: all 0.3s ease; display: inline-flex;
                    align-items: center; justify-content: center;
                }

                .btn-icon-highlight.edit { color: #198754; }
                .btn-icon-highlight.edit:hover {
                    transform: scale(1.25); color: #157347;
                    filter: drop-shadow(0 0 8px rgba(25, 135, 84, 0.6));
                }

                .btn-icon-highlight.delete { color: #dc3545; }
                .btn-icon-highlight.delete:hover {
                    transform: scale(1.25); color: #bb2d3b;
                    filter: drop-shadow(0 0 8px rgba(220, 53, 69, 0.6));
                }

                .btn-nuevo-producto:hover {
                    background-color: #157347 !important;
                    box-shadow: 0 0 15px rgba(25, 135, 84, 0.5) !important;
                    transform: translateY(-1px);
                }

                .modal-body input:focus, .modal-body select:focus, .modal-body textarea:focus {
                    border-color: #198754 !important;
                    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25) !important;
                }
            `}</style>
        </div>
    );
};

export default ProductsPage;