import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal } from "bootstrap";
import { useProducts } from "../features/products/hooks/useProducts";
import { useCategories } from "../features/categories/hooks/useCategories";
import {
    productService,
    getProductImageUrl,
} from "../features/products/services/productService";
import ProductForm from "../features/products/components/ProductForm";
import ProductImageField from "../features/products/components/ProductImageField";
import { useProductCatalog } from "../store/ProductCatalogContext";
import { reportService } from "../features/reports/services/reportService";
import { Toast, confirmDelete } from "../utils/swalConfig";
import Swal from "sweetalert2";

const ProductsPage = () => {
    const { products, setProducts, handleDelete, loading } = useProducts();
    const { invalidate: invalidateCatalog } = useProductCatalog();
    const { categories } = useCategories();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [exportFilters, setExportFilters] = useState({
        categoriaId: "",
        stockBajo: false,
        precioMin: "",
        precioMax: "",
    });
    const [pendingImageFile, setPendingImageFile] = useState(null);
    const [formkey, setFormKey] = useState(Date.now());

    const filteredProducts = useMemo(() => {
        return products.filter((prod) => {
            const matchSearch =
                prod.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                prod.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
            const matchCat =
                !filterCategory ||
                prod.categoriaNombre === filterCategory ||
                String(prod.categoriaId) === filterCategory;
            return matchSearch && matchCat;
        });
    }, [products, searchTerm, filterCategory]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalResultados = filteredProducts.length;
    const totalPages = Math.ceil(totalResultados / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(
        indexOfFirstItem,
        indexOfLastItem,
    );

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const valorInversion = useMemo(
        () =>
            products.reduce(
                (acc, curr) => acc + curr.precioVenta * curr.stock,
                0,
            ),
        [products],
    );

    const modalRef = useRef();
    const bsModal = useRef();

    useEffect(() => {
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
            modalRef.current.addEventListener("hidden.bs.modal", () => {
                setSelectedProduct(null);
                setPendingImageFile(null);
            });
        }
    }, []);

    const openModal = (product = null) => {
        setSelectedProduct(null);
        setPendingImageFile(null);
        setFormKey(Date.now());

        setTimeout(() => {
            setSelectedProduct(product ? { ...product } : null);
            bsModal.current.show();
        }, 10);
    };

    const updateProductInList = (updated) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p)),
        );
        setSelectedProduct((prev) =>
            prev?.id === updated.id ? { ...prev, ...updated } : prev,
        );
        invalidateCatalog();
    };

    const handleSave = async (formData) => {
        setSaving(true);

        try {
            if (selectedProduct) {
                const updated = await productService.update(
                    selectedProduct.id,
                    formData,
                );
                setProducts((prev) =>
                    prev.map((p) =>
                        p.id === selectedProduct.id ? updated : p,
                    ),
                );
                invalidateCatalog();
                Toast.fire({
                    icon: "success",
                    title: "Producto actualizado",
                });
            } else {
                const created = await productService.create(formData);

                let finalProduct = created;
                if (pendingImageFile) {
                    finalProduct = await productService.uploadProductImage(
                        created.id,
                        pendingImageFile,
                    );
                }

                setProducts((prev) => [...prev, finalProduct]);
                invalidateCatalog();
                Toast.fire({
                    icon: "success",
                    title: "Producto registrado con éxito",
                });
            }

            bsModal.current.hide();
        } catch (err) {
            console.error(err);
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Error al guardar el producto";
            Toast.fire({ icon: "error", title: msg });
        } finally {
            setSaving(false);
        }
    };

    const confirmDeleteProduct = (id) => {
        confirmDelete("¿Eliminar producto?").then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await handleDelete(id);
                    Toast.fire({
                        icon: "success",
                        title: "Producto eliminado correctamente",
                    });
                } catch (error) {
                    Toast.fire({ icon: "error", title: "Error al eliminar" });
                }
            }
        });
    };

    return (
        <div className="admin-page animate__animated animate__fadeIn">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="admin-page-title fw-bold mb-1">
                        Nubix Market <span className="admin-accent-slash">/</span>{" "}
                        Productos
                    </h2>
                    <p className="text-muted small mb-0">
                        Control de inventario y activos del sistema
                    </p>
                </div>
                <div className="d-flex flex-wrap gap-2 admin-page-header-actions">
                    <button
                        type="button"
                        className="btn btn-outline-success shadow-sm px-3 py-2 fw-bold d-flex align-items-center"
                        onClick={() =>
                            Swal.fire({
                                title: "Exportar productos",
                                html: `
                                  <div class="text-start">
                                    <label class="form-label small">Categoría</label>
                                    <select id="exp-cat" class="form-select mb-2">
                                      <option value="">Todas</option>
                                      ${categories.map((c) => `<option value="${c.id}">${c.nombre}</option>`).join("")}
                                    </select>
                                    <div class="form-check mb-2">
                                      <input class="form-check-input" type="checkbox" id="exp-stock">
                                      <label class="form-check-label">Solo stock bajo (&lt;10)</label>
                                    </div>
                                    <label class="form-label small">Precio mín.</label>
                                    <input type="number" id="exp-min" class="form-control mb-2" step="0.01">
                                    <label class="form-label small">Precio máx.</label>
                                    <input type="number" id="exp-max" class="form-control" step="0.01">
                                  </div>`,
                                showCancelButton: true,
                                confirmButtonText: "Descargar",
                                confirmButtonColor: "#10b981",
                                preConfirm: () => ({
                                    categoriaId: document.getElementById("exp-cat").value || undefined,
                                    stockBajo: document.getElementById("exp-stock").checked,
                                    precioMin: document.getElementById("exp-min").value,
                                    precioMax: document.getElementById("exp-max").value,
                                }),
                            }).then((r) => {
                                if (r.isConfirmed) {
                                    reportService.exportProducts(r.value).catch(() =>
                                        Toast.fire({ icon: "error", title: "Error al exportar" }),
                                    );
                                }
                            })
                        }
                    >
                        <i className="bi bi-file-earmark-excel me-2"></i> Excel
                    </button>
                    <button
                        className="btn btn-success shadow-sm px-4 py-2 fw-bold d-flex align-items-center admin-btn-primary"
                        onClick={() => openModal()}
                >
                    <i className="bi bi-box-seam-fill me-2"></i> Nuevo Producto
                    </button>
                </div>
            </div>

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
                                <i className="bi bi-layers-fill fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <h6 className="text-muted mb-0 small fw-bold text-uppercase">
                                    Items
                                </h6>
                                <h3 className="fw-bold mb-0">
                                    {totalResultados}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
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
                                <i className="bi bi-currency-exchange fs-4"></i>
                            </div>
                            <div className="ms-3">
                                <h6 className="text-muted mb-0 small fw-bold text-uppercase">
                                    Inversión
                                </h6>
                                <h3 className="fw-bold mb-0 text-emerald-600">
                                    S/ {valorInversion.toLocaleString()}
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div
                        className="card border-0 shadow-sm p-2 d-flex flex-row align-items-center px-3 admin-search-card"
                        style={{ borderRadius: "15px", height: "100%" }}
                    >
                        <i className="bi bi-search text-emerald-600 me-3 fs-5"></i>
                        <input
                            type="search"
                            id="product_global_search"
                            name="product_search_unique"
                            autoComplete="off"
                            className="form-control border-0 shadow-none bg-transparent"
                            placeholder="Buscar por nombre o código..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                        <select
                            className="form-select border-0 bg-transparent ms-2"
                            style={{ maxWidth: "200px" }}
                            value={filterCategory}
                            onChange={(e) => {
                                setFilterCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.nombre}>
                                    {c.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div
                className="card shadow-sm border-0 overflow-hidden"
                style={{ borderRadius: "15px" }}
            >
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th
                                    className="px-4 py-3 text-secondary small fw-bold"
                                    style={{ width: "60px" }}
                                >
                                    #
                                </th>
                                <th
                                    className="py-3 text-secondary small fw-bold"
                                    style={{ width: "70px" }}
                                >
                                    IMG
                                </th>
                                <th className="py-3 text-secondary small fw-bold">
                                    CÓDIGO
                                </th>
                                <th className="py-3 text-secondary small fw-bold">
                                    PRODUCTO
                                </th>
                                <th className="py-3 text-secondary small fw-bold">
                                    CATEGORÍA
                                </th>
                                <th className="py-3 text-secondary small fw-bold text-center">
                                    STOCK
                                </th>
                                <th className="py-3 text-secondary small fw-bold">
                                    P. VENTA
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
                                        colSpan="8"
                                        className="text-center py-5"
                                    >
                                        <div
                                            className="spinner-border text-emerald-600"
                                            role="status"
                                        ></div>
                                    </td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((prod, index) => {
                                    const imageUrl = getProductImageUrl(
                                        prod.imagen,
                                    );
                                    return (
                                        <tr key={prod.id}>
                                            <td className="px-4">
                                                <span className="text-muted small fw-bold">
                                                    {indexOfFirstItem +
                                                        index +
                                                        1}
                                                </span>
                                            </td>
                                            <td>
                                                {imageUrl ? (
                                                    <img
                                                        src={imageUrl}
                                                        alt={prod.nombre}
                                                        loading="lazy"
                                                        className="rounded border"
                                                        style={{
                                                            width: "44px",
                                                            height: "44px",
                                                            objectFit: "cover",
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="rounded border bg-light d-flex align-items-center justify-content-center text-muted"
                                                        style={{
                                                            width: "44px",
                                                            height: "44px",
                                                        }}
                                                    >
                                                        <i className="bi bi-image"></i>
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border fw-medium">
                                                    {prod.codigo}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="fw-bold text-dark">
                                                    {prod.nombre}
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className="text-emerald-600 fw-medium bg-emerald-100 px-2 py-1 rounded"
                                                    style={{ fontSize: "0.8rem" }}
                                                >
                                                    {prod.categoriaNombre}
                                                </span>
                                            </td>
                                            <td className="text-center">
                                                <span
                                                    className={`fw-bold ${prod.stock < 10 ? "text-danger" : "text-dark"}`}
                                                >
                                                    {prod.stock}{" "}
                                                    <small className="fw-normal">
                                                        un.
                                                    </small>
                                                </span>
                                            </td>
                                            <td>
                                                <span className="fw-black">
                                                    S/{" "}
                                                    {prod.precioVenta.toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="text-end px-4">
                                                <button
                                                    className="btn-action btn-edit me-2"
                                                    onClick={() =>
                                                        openModal(prod)
                                                    }
                                                    title="Editar"
                                                >
                                                    <i className="bi bi-pencil-square"></i>
                                                </button>
                                                <button
                                                    className="btn-action btn-delete"
                                                    onClick={() =>
                                                        confirmDeleteProduct(prod.id)
                                                    }
                                                    title="Eliminar"
                                                >
                                                    <i className="bi bi-trash3-fill"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-5 text-muted"
                                    >
                                        No se encontraron productos
                                        coincidentes.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top bg-body admin-pagination-bar">
                        <div className="text-muted small admin-pagination-info">
                            Página{" "}
                            <span className="fw-bold">{currentPage}</span> de{" "}
                            {totalPages}
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

            <div
                className="modal fade"
                ref={modalRef}
                tabIndex="-1"
                data-bs-backdrop="static"
            >
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div
                        className="modal-content border-0 shadow-lg"
                        style={{ borderRadius: "15px" }}
                    >
                        <div className="modal-header border-0 pt-4 px-4 pb-0">
                            <h5 className="modal-title fw-bold text-dark d-flex align-items-center">
                                <i
                                    className={`bi ${selectedProduct ? "bi-pencil-square" : "bi-box-seam"} text-emerald-600 me-2`}
                                ></i>
                                {selectedProduct
                                    ? "Actualizar Producto"
                                    : "Registrar Producto"}
                            </h5>
                            <button
                                type="button"
                                className="btn-close shadow-none"
                                onClick={() => bsModal.current.hide()}
                            ></button>
                        </div>
                        <div className="modal-body p-4">
                            <ProductImageField
                                key={`img-${formkey}-${selectedProduct?.id ?? "new"}`}
                                productId={selectedProduct?.id}
                                imagen={selectedProduct?.imagen}
                                onImageUpdated={updateProductInList}
                                onPendingFile={setPendingImageFile}
                                disabled={saving}
                            />
                            <ProductForm
                                key={formkey}
                                product={selectedProduct}
                                categories={categories}
                                onSave={handleSave}
                                loading={saving}
                            />

                            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
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
                                    form="productForm"
                                    className="btn btn-success px-5 fw-bold shadow-sm admin-btn-primary"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                    ) : (
                                        <i className="bi bi-cloud-upload-fill me-2"></i>
                                    )}
                                    {saving
                                        ? "Guardando..."
                                        : "Confirmar Registro"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ProductsPage;
