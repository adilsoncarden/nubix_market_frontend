import React, { useState, useEffect } from "react";


const ProductForm = ({ product, categories, onSave, loading, imageFile }) => {

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
                precioCompra: product.precioCompra || "",
                precioVenta: product.precioVenta || "",
                stock: product.stock || "",
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

    // 2) Nueva función handleSubmit para subir primero la imagen
    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = product?.imagenUrl || "";
        
        if (imageFile) {
            const uploadData = new FormData();
            uploadData.append("file", imageFile);

            try {
                const response = await fetch("http://localhost:8080/api/media/upload", {
                    method: "POST",
                    body: uploadData,
                });

                if (response.ok) {
                    const data = await response.json();
                    imageUrl = data.url; // aqui obtenemos las ruta que nos da el backend
                } else {
                    alert("Error al subir la imagen al servidor");
                    return;
                }
            } catch (error) {
                console.error("Error subiendo:", error);
                return;
            }
        }

        // guardamos el producto completo junto con la ruta de la imagen
        onSave({ ...formData, imagenUrl });
    };


   return (
        <form onSubmit={handleSubmit} id="productForm">
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label fw-bold">Código</label>
                    <input type="text" name="codigo" className="form-control" value={formData.codigo} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                    <label className="form-label fw-bold">Categoría</label>
                    <select name="categoriaId" className="form-select" value={formData.categoriaId} onChange={handleChange} required>
                        <option value="">Seleccionar...</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12">
                    <label className="form-label fw-bold">Nombre del Producto</label>
                    <input type="text" name="nombre" className="form-control" value={formData.nombre} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-bold">P. Compra</label>
                    <input type="number" step="0.01" name="precioCompra" className="form-control" value={formData.precioCompra} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-bold">P. Venta</label>
                    <input type="number" step="0.01" name="precioVenta" className="form-control" value={formData.precioVenta} onChange={handleChange} required />
                </div>
                <div className="col-md-4">
                    <label className="form-label fw-bold">Stock</label>
                    <input type="number" name="stock" className="form-control" value={formData.stock} onChange={handleChange} required />
                </div>
            </div>
        </form>
    );
};

export default ProductForm;
