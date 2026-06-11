import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal } from "bootstrap";
import { useProducts } from "../features/products/hooks/useProducts";
import { useCategories } from "../features/categories/hooks/useCategories";
import {
    productService,
    resolveProductImageUrl,
    handleProductImageError,
    PRODUCT_PLACEHOLDER_IMAGE,
} from "../features/products/services/productService";
import ProductForm from "../features/products/components/ProductForm";
import ProductImageField from "../features/products/components/ProductImageField";
import { useProductCatalog } from "../store/ProductCatalogContext";
import { reportService } from "../features/reports/services/reportService";
import { exportProductsPdf } from "../features/products/utils/exportProductsPdf";
import { Toast, confirmDelete } from "../utils/swalConfig";
import SearchInput from "../components/admin/SearchInput";
import AdminToolbarPanel from "../components/admin/AdminToolbarPanel";
import AdminModal, { AdminModalActions } from "../components/admin/AdminModal";
import CustomSelect from "../components/ui/CustomSelect";
import AdminResponsiveTable from "../components/admin/AdminResponsiveTable";

const ProductsPage = () => {
    const { products, setProducts, handleDelete, loading } = useProducts();
    const { invalidate: invalidateCatalog } = useProductCatalog();
    const { categories } = useCategories();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [viewProduct, setViewProduct] = useState(null);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [exportFilters, setExportFilters] = useState({
        categoriaId: "",
        stockBajo: false,
        precioMin: "",
        precioMax: "",
    });
    const [formUrlImagen, setFormUrlImagen] = useState(null);
    const [formkey, setFormKey] = useState(Date.now());
    const [exportingPdf, setExportingPdf] = useState(false);

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
    const viewModalRef = useRef();
    const viewBsModal = useRef();
    const exportModalRef = useRef();
    const exportBsModal = useRef();

    useEffect(() => {
        if (modalRef.current) {
            bsModal.current = new Modal(modalRef.current);
            modalRef.current.addEventListener("hidden.bs.modal", () => {
                setSelectedProduct(null);
                setFormUrlImagen(null);
            });
        }
        if (viewModalRef.current) {
            viewBsModal.current = new Modal(viewModalRef.current);
            viewModalRef.current.addEventListener("hidden.bs.modal", () => {
                setViewProduct(null);
            });
        }
        if (exportModalRef.current) {
            exportBsModal.current = new Modal(exportModalRef.current);
        }
    }, []);

    const openExportModal = () => {
        setExportFilters({
            categoriaId: "",
            stockBajo: false,
            precioMin: "",
            precioMax: "",
        });
        exportBsModal.current?.show();
    };

    const handleExportProducts = () => {
        const payload = {
            categoriaId: exportFilters.categoriaId || undefined,
            stockBajo: exportFilters.stockBajo,
            precioMin: exportFilters.precioMin,
            precioMax: exportFilters.precioMax,
        };
        reportService.exportProducts(payload).catch(() =>
            Toast.fire({ icon: "error", title: "Error al exportar" }),
        );
        exportBsModal.current?.hide();
    };

    const openViewModal = (product) => {
        setViewProduct({ ...product });
        viewBsModal.current?.show();
    };

    const openModal = (product = null) => {
        setSelectedProduct(null);
        setFormUrlImagen(product?.urlImagen ?? null);
        setFormKey(Date.now());

        setTimeout(() => {
            setSelectedProduct(product ? { ...product } : null);
            bsModal.current.show();
        }, 10);
    };

    const handleSave = async (formData) => {
        setSaving(true);

        try {
            if (selectedProduct) {
                const updated = await productService.update(
                    selectedProduct.id,
                    { ...formData, urlImagen: formUrlImagen },
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
                const created = await productService.create({
                    ...formData,
                    urlImagen: formUrlImagen,
                });

                setProducts((prev) => [...prev, created]);
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

    const exportarPDF = async () => {
        setExportingPdf(true);
        try {
            await exportProductsPdf(filteredProducts);
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
                        onClick={openExportModal}
                    >
                        <i className="bi bi-file-earmark-excel me-2"></i> Excel
                    </button>
                    <button
                        type="button"
                        className="btn btn-outline-success shadow-sm px-3 py-2 fw-bold d-flex align-items-center"
                        onClick={exportarPDF}
                        disabled={exportingPdf || filteredProducts.length === 0}
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
                    <i className="bi bi-box-seam-fill me-2"></i> Nuevo Producto
                    </button>
                </div>
            </div>

            <AdminToolbarPanel
                stats={[
                    {
                        icon: "bi bi-layers-fill fs-4",
                        label: "Items",
                        value: totalResultados,
                    },
                    {
                        icon: "bi bi-currency-exchange fs-4",
                        label: "Inversión",
                        value: `S/ ${valorInversion.toLocaleString()}`,
                        valueClassName: "text-emerald-600",
                    },
                ]}
            >
                <SearchInput
                    id="product_global_search"
                    name="product_search_unique"
                    placeholder="Buscar por nombre o código..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <CustomSelect
                    className="admin-filter-select admin-toolbar-select"
                    value={filterCategory}
                    onChange={(e) => {
                        setFilterCategory(e.target.value);
                        setCurrentPage(1);
                    }}
                    aria-label="Filtrar por categoría"
                    placeholder="Todas las categorías"
                    options={[
                        { value: "", label: "Todas las categorías" },
                        ...categories.map((c) => ({
                            value: c.nombre,
                            label: c.nombre,
                        })),
                    ]}
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
                                    const imageUrl =
                                        resolveProductImageUrl(prod) ||
                                        PRODUCT_PLACEHOLDER_IMAGE;
                                    return (
                                        <tr key={prod.id}>
                                            <td className="px-4 text-center">
                                                <span
                                                    className="badge bg-emerald-100 text-emerald-600 fw-bold"
                                                    style={{
                                                        borderRadius: "6px",
                                                        fontSize: "0.85rem",
                                                    }}
                                                >
                                                    {indexOfFirstItem +
                                                        index +
                                                        1}
                                                </span>
                                            </td>
                                            <td>
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
                                                    onError={handleProductImageError}
                                                />
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
                                                    className="btn-action btn-view me-2"
                                                    onClick={() =>
                                                        openViewModal(prod)
                                                    }
                                                    title="Ver producto"
                                                >
                                                    <i className="bi bi-eye"></i>
                                                </button>
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
                </AdminResponsiveTable>

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

            <AdminModal
                modalRef={modalRef}
                size="lg"
                title={
                    selectedProduct
                        ? "Actualizar Producto"
                        : "Registrar Producto"
                }
                onClose={() => bsModal.current.hide()}
            >
                <ProductImageField
                    key={`img-${formkey}-${selectedProduct?.id ?? "new"}`}
                    urlImagen={formUrlImagen}
                    onUrlImagenChange={setFormUrlImagen}
                    disabled={saving}
                />
                <ProductForm
                    key={formkey}
                    product={selectedProduct}
                    categories={categories}
                    onSave={handleSave}
                    loading={saving}
                />
                <AdminModalActions
                    onClose={() => bsModal.current.hide()}
                    submitForm="productForm"
                    saving={saving}
                    savingLabel="Guardando..."
                    confirmLabel="Confirmar Registro"
                    confirmIcon="bi-cloud-upload-fill"
                />
            </AdminModal>

            <AdminModal
                modalRef={exportModalRef}
                title="Exportar productos"
                onClose={() => exportBsModal.current?.hide()}
            >
                <div className="mb-3">
                    <label className="form-label small">Categoría</label>
                    <CustomSelect
                        className="mb-2"
                        value={exportFilters.categoriaId}
                        onChange={(e) =>
                            setExportFilters((f) => ({
                                ...f,
                                categoriaId: e.target.value,
                            }))
                        }
                        placeholder="Todas"
                        options={[
                            { value: "", label: "Todas" },
                            ...categories.map((c) => ({
                                value: String(c.id),
                                label: c.nombre,
                            })),
                        ]}
                    />
                    <div className="form-check mb-2">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="exp-stock"
                            checked={exportFilters.stockBajo}
                            onChange={(e) =>
                                setExportFilters((f) => ({
                                    ...f,
                                    stockBajo: e.target.checked,
                                }))
                            }
                        />
                        <label className="form-check-label" htmlFor="exp-stock">
                            Solo stock bajo (&lt;10)
                        </label>
                    </div>
                    <label className="form-label small">Precio mín.</label>
                    <input
                        type="number"
                        className="form-control mb-2"
                        step="0.01"
                        value={exportFilters.precioMin}
                        onChange={(e) =>
                            setExportFilters((f) => ({
                                ...f,
                                precioMin: e.target.value,
                            }))
                        }
                    />
                    <label className="form-label small">Precio máx.</label>
                    <input
                        type="number"
                        className="form-control"
                        step="0.01"
                        value={exportFilters.precioMax}
                        onChange={(e) =>
                            setExportFilters((f) => ({
                                ...f,
                                precioMax: e.target.value,
                            }))
                        }
                    />
                </div>
                <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top admin-modal-footer">
                    <button
                        type="button"
                        className="btn btn-light fw-bold text-secondary px-4 border admin-modal-btn-secondary"
                        onClick={() => exportBsModal.current?.hide()}
                    >
                        Cerrar
                    </button>
                    <button
                        type="button"
                        className="btn btn-success px-5 fw-bold shadow-sm admin-btn-primary admin-modal-btn-primary"
                        onClick={handleExportProducts}
                    >
                        <i className="bi bi-download me-2" />
                        Descargar
                    </button>
                </div>
            </AdminModal>

            <AdminModal
                modalRef={viewModalRef}
                size="lg"
                title="Ver Producto"
                onClose={() => viewBsModal.current?.hide()}
            >
                {viewProduct && (
                    <>
                        <ProductImageField
                            urlImagen={viewProduct.urlImagen}
                            disabled
                        />
                        <ProductForm
                            product={viewProduct}
                            categories={categories}
                            readOnly
                        />
                        <AdminModalActions
                            onClose={() => viewBsModal.current?.hide()}
                            showConfirm={false}
                        />
                    </>
                )}
            </AdminModal>

        </div>
    );
};

export default ProductsPage;
