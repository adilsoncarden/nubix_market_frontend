import React, { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "../features/auth/hooks/useAdminAuth";
import { Tooltip } from "bootstrap";
import logo from "../assets/logo.png.png";
import "../styles/auth-pages.css";

/**
 * Componente Atom: AuthInput
 * Ahora incluye soporte para mostrar/ocultar contraseña dinámicamente.
 */
const AuthInput = ({ icon, label, isPassword, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="mb-3">
            <label className="form-label admin-auth-label ms-1">
                {label}
            </label>
            <div className="input-group admin-auth-input-group">
                <span className="input-group-text border-end-0 py-2 ps-3">
                    <i className={`bi bi-${icon}`}></i>
                </span>
                <input
                    {...props}
                    type={
                        isPassword
                            ? showPassword
                                ? "text"
                                : "password"
                            : props.type
                    }
                    className="form-control border-start-0 border-end-0 py-2 shadow-none"
                />
                {isPassword && (
                    <button
                        type="button"
                        className="input-group-text bg-white border-start-0 pe-3 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            cursor: "pointer",
                            borderRadius: "0 10px 10px 0",
                        }}
                    >
                        <i
                            className={`bi bi-eye${showPassword ? "-slash" : ""}`}
                        ></i>
                    </button>
                )}
            </div>
        </div>
    );
};

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const { handleAdminLogin, loading, error } = useAdminAuth();
    const tooltipRef = useRef([]);

    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll(
            '[data-bs-toggle="tooltip"]',
        );
        tooltipRef.current = Array.from(tooltipTriggerList).map(
            (el) => new Tooltip(el),
        );
        return () => tooltipRef.current.forEach((t) => t.dispose());
    }, []);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAdminLogin(credentials);
    };

    return (
        <div className="admin-login-page">
            <div className="card admin-login-card border-0">
                <div className="card-body p-4 p-sm-5">
                    <div className="text-center admin-login-header mb-4">
                        <img
                            src={logo}
                            alt="Nubix Market"
                            className="admin-login-logo mb-4"
                        />
                        <p className="admin-login-subtitle text-muted mb-0">
                            Panel de Administración
                        </p>
                    </div>

                    {error && (
                        <div
                            className="alert alert-danger admin-login-alert d-flex align-items-center border-0 py-2 px-3 mb-4"
                        >
                            <i className="bi bi-exclamation-circle-fill me-2"></i>
                            <div>{error}</div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <AuthInput
                            label="Email Corporativo"
                            icon="envelope-at"
                            type="email"
                            name="email"
                            placeholder=""
                            value={credentials.email}
                            onChange={handleChange}
                            required
                        />

                        <AuthInput
                            label="Contraseña"
                            icon="key"
                            isPassword={true}
                            name="password"
                            placeholder=""
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            style={{ borderRadius: "0" }}
                        />

                        <div className="d-flex justify-content-between align-items-center admin-login-actions">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="remember"
                                />
                                <label
                                    className="form-check-label"
                                    htmlFor="remember"
                                >
                                    Recordar sesión
                                </label>
                            </div>
                            <button
                                type="button"
                                className="btn btn-link p-0 admin-help-link"
                                data-bs-toggle="tooltip"
                                title="Contacta a TI para recuperar acceso"
                            >
                                ¿Ayuda?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 admin-btn-access py-2 fw-bold"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                    <span className="spinner-border spinner-border-sm"></span>
                                    <span>Autenticando...</span>
                                </div>
                            ) : (
                                "Acceder al Panel"
                            )}
                        </button>
                    </form>
                </div>

                <div className="card-footer bg-transparent border-0 text-center pb-4 pt-0">
                    <p className="admin-login-footer mb-0">
                        © 2026 Nubix Market • Sistemas e Información
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
