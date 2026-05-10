import React, { useState, useEffect } from "react";

const SupplierForm = ({ supplier, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        ruc: "",
        nombre: "",
        telefono: "",
        email: "",
    });

    useEffect(() => {
        if (supplier) setFormData(supplier);
    }, [supplier]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label className="form-label small fw-bold">RUC</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.ruc}
                    onChange={(e) =>
                        setFormData({ ...formData, ruc: e.target.value })
                    }
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold">Razón Social</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.nombre}
                    onChange={(e) =>
                        setFormData({ ...formData, nombre: e.target.value })
                    }
                    required
                />
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold">Teléfono</label>
                <input
                    type="text"
                    className="form-control"
                    value={formData.telefono}
                    onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                    }
                />
            </div>
            <div className="mb-3">
                <label className="form-label small fw-bold">Email</label>
                <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                />
            </div>
            <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                    type="button"
                    className="btn btn-light"
                    onClick={onClose}
                >
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
