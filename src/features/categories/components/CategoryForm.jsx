import React, { useState, useEffect } from "react";

const CategoryForm = ({ category, onSave, loading }) => {
    const [formData, setFormData] = useState({ nombre: "" });

    useEffect(() => {
        if (category) {
            setFormData({
                nombre: category.nombre,
            });
        } else {
            setFormData({ nombre: ""});
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
                <label className="form-label fw-bold">
                    Nombre de la Categoría
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
        </form>
    );
};

export default CategoryForm;
