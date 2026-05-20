import React, { useState, useEffect } from "react";

const ProductForm = ({ product, categories, onSave, loading }) => {
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


            //  BUSCAR LA CATEGORIA POR NOMBRE
            const categoriaEncontrada = categories.find(
                (cat) => cat.nombre === product.categoriaNombre,
            );

            setFormData({
                codigo: product.codigo || "",
                nombre: product.nombre || "",
                descripcion: product.descripcion || "",
                precioCompra: product.precioCompra || "",
                precioVenta: product.precioVenta || "",
                stock: product.stock || "",


                // Usar el ID encontrado
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

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSave(formData);
            }}
            id="productForm"
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
                        required
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-bold">Categoría</label>
                    <select
                        name="categoriaId"
                        className="form-select"
                        value={formData.categoriaId}
                        onChange={handleChange}
                        required
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
                    <label className="form-label fw-bold">
                        Nombre del Producto
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-12">
                    <label className="form-label fw-bold">Descripción</label>
                    <textarea
                        name="descripcion"
                        className="form-control"
                        rows="2"
                        value={formData.descripcion}
                        onChange={handleChange}
                        required
                    ></textarea>
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-bold">P. Compra</label>
                    <input
                        type="number"
                        step="0.01"
                        name="precioCompra"
                        className="form-control"
                        value={formData.precioCompra}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-bold">P. Venta</label>
                    <input
                        type="number"
                        step="0.01"
                        name="precioVenta"
                        className="form-control"
                        value={formData.precioVenta}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-bold">Stock</label>
                    <input
                        type="number"
                        name="stock"
                        className="form-control"
                        value={formData.stock}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
        </form>
    );
};

export default ProductForm;
