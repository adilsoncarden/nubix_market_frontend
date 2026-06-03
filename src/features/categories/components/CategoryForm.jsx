import React, { useState, useEffect } from "react";

const CategoryForm = ({ category, onSave, loading }) => {
    const [formData, setFormData] = useState({ nombre: "", descripcion: "" });

    useEffect(() => {
        if (category) {
            setFormData({
                nombre: category.nombre || "",
                descripcion: category.descripcion || "",
            });
        } else {
            setFormData({ nombre: "", descripcion: "" });
        }
    }, [category]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} id="categoryForm">
            <div className="mb-3">
                <label className="form-label fw-bold">Nombre de la Categoría</label>
                <input
                    type="text"
                    name="nombre"
                    className="form-control"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label fw-bold">Descripción</label>
                <textarea
                    name="descripcion"
                    className="form-control"
                    rows={3}
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder=""
                />
            </div>
        </form>
    );
};

export default CategoryForm;
