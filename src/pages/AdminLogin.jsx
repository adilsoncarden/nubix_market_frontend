import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../features/auth/hooks/useAdminAuth";
import { Tooltip } from "bootstrap";

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const { handleAdminLogin, loading, error } = useAdminAuth();

    // Inicializar tooltips de Bootstrap
    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll(
            '[data-bs-toggle="tooltip"]',
        );
        tooltipTriggerList.forEach((el) => new Tooltip(el));
    }, []);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAdminLogin(credentials);
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
            <div
                className="card shadow-lg border-0"
                style={{ width: "400px", borderRadius: "15px" }}
            >
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <h3 className="fw-bold text-primary">Nubix Market</h3>
                        <p className="text-muted">Panel Administrativo</p>
                    </div>

                    {error && (
                        <div
                            className="alert alert-danger py-2 small"
                            role="alert"
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label small fw-bold">
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                className="form-control form-control-lg"
                                // placeholder="admin@nubix.com"
                                value={credentials.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                name="password"
                                className="form-control form-control-lg"
                                // placeholder="••••••••"
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 fw-bold"
                            disabled={loading}
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            title="Haz clic para ingresar al sistema"
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : (
                                "Iniciar Sesión"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
