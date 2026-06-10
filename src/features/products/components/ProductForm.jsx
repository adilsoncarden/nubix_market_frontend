import React, { useState, useEffect } from "react";

const ProductForm = ({
    product,
    categories,
    onSave,
    loading,
    readOnly = false,
}) => {
    const [formData, setFormData] = useState({
        codigo: "",
        nombre: "",
        descripcion: "",
        precioCompra: "",
        precioVenta: "",
        stock: "",
        categoriaId: "",
    });

    useEffect(() => {
        if (product) {
            const categoriaEncontrada = categories.find(
                (cat) => cat.nombre === product.categoriaNombre,
            );
            setFormData({
                codigo: product.codigo || "",
                nombre: product.nombre || "",
                descripcion: product.descripcion || "",
                precioCompra: product.precioCompra ?? "",
                precioVenta: product.precioVenta ?? "",
                stock: product.stock ?? "",
                categoriaId: categoriaEncontrada ? categoriaEncontrada.id : "",
            });
        } else {
            setFormData({
                codigo: "",
                nombre: "",
                descripcion: "",
                precioCompra: "",
                precioVenta: "",
                stock: "",
                categoriaId: "",
            });
        }
    }, [product, categories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!readOnly) onSave(formData);
    };

    const isDisabled = readOnly || loading;

    return (
        <form
            onSubmit={handleSubmit}
            id={readOnly ? undefined : "productForm"}
        >
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label fw-bold">Código</label>
                    <input
                        type="text"
                        name="codigo"
                        className="form-control"
                        value={formData.codigo}
                        onChange={handleChange}
                        disabled={isDisabled}
                        readOnly={readOnly}
                        required={!readOnly}
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-bold">Categoría</label>
                    <select
                        name="categoriaId"
                        className="form-select"
                        value={formData.categoriaId}
                        onChange={handleChange}
                        disabled={isDisabled}
                        required={!readOnly}
                    >
                        <option value="">Seleccionar...</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col-12">
                    <label className="form-label fw-bold">Nombre del Producto</label>
                    <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        value={formData.nombre}
                        onChange={handleChange}
                        disabled={isDisabled}
                        readOnly={readOnly}
                        required={!readOnly}
                    />
                </div>
                <div className="col-12">
                    <label className="form-label fw-bold">Descripción</label>
                    <textarea
                        name="descripcion"
                        className="form-control"
                        rows={3}
                        value={formData.descripcion}
                        onChange={handleChange}
                        disabled={isDisabled}
                        readOnly={readOnly}
                        placeholder=""
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-bold">P. Compra</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="precioCompra"
                        className="form-control"
                        value={formData.precioCompra}
                        onChange={handleChange}
                        disabled={isDisabled}
                        readOnly={readOnly}
                        required={!readOnly}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-bold">P. Venta</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        name="precioVenta"
                        className="form-control"
                        value={formData.precioVenta}
                        onChange={handleChange}
                        disabled={isDisabled}
                        readOnly={readOnly}
                        required={!readOnly}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-bold">Stock</label>
                    <input
                        type="number"
                        min="0"
                        name="stock"
                        className="form-control"
                        value={formData.stock}
                        onChange={handleChange}
                        disabled={isDisabled}
                        readOnly={readOnly}
                        required={!readOnly}
                    />
                </div>
            </div>
        </form>
    );
};

export default ProductForm;
