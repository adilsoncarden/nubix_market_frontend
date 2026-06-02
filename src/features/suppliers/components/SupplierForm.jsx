import React, { useState, useEffect } from "react";

const SupplierForm = ({ supplier, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        ruc: "",
        nombre: "",
        telefono: "",
        email: "",
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (supplier) setFormData(supplier);
        else setFormData({ ruc: "", nombre: "", telefono: "", email: "" });
        setErrors({});
    }, [supplier]);

    const validate = () => {
        const next = {};
        if (!/^\d{11}$/.test(formData.ruc?.trim() || "")) {
            next.ruc = "RUC debe tener 11 dígitos";
        }
        if (!/^\d{9}$/.test(formData.telefono?.trim() || "")) {
            next.telefono = "Teléfono debe tener 9 dígitos";
        }
        if (!formData.nombre?.trim()) {
            next.nombre = "Nombre obligatorio";
        }
        if (!formData.email?.includes("@")) {
            next.email = "Email inválido";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onSave({
            ruc: formData.ruc.trim(),
            nombre: formData.nombre.trim(),
            telefono: formData.telefono.trim(),
            email: formData.email.trim(),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label small fw-bold">RUC</label>
                <input
                    type="text"
                    className={`form-control ${errors.ruc ? "is-invalid" : ""}`}
                    value={formData.ruc}
                    maxLength={11}
                    onChange={(e) =>
                        setFormData({ ...formData, ruc: e.target.value.replace(/\D/g, "") })
                    }
                    required
                />
                {errors.ruc && <div className="invalid-feedback">{errors.ruc}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold">Razón Social</label>
                <input
                    type="text"
                    className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                    value={formData.nombre}
                    onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                />
                {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold">Teléfono</label>
                <input
                    type="text"
                    className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                    value={formData.telefono}
                    maxLength={9}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            telefono: e.target.value.replace(/\D/g, ""),
                        })
                    }
                    required
                />
                {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold">Email</label>
                <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                    required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-light" onClick={onClose}>
                    Cancelar
                </button>
                <button type="submit" className="btn btn-primary px-4">
                    Guardar
                </button>
            </div>
        </form>
    );
};

export default SupplierForm;
