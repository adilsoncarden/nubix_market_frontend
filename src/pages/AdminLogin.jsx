import React, { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "../features/auth/hooks/useAdminAuth";
import { Tooltip } from "bootstrap";

/**
 * Componente Atom: AuthInput
 * Ahora incluye soporte para mostrar/ocultar contraseña dinámicamente.
 */
const AuthInput = ({ icon, label, isPassword, ...props }) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="mb-3">
            <label className="form-label small fw-bold text-secondary ms-1">
                {label}
            </label>
            <div className="input-group custom-input-group shadow-sm">
                <span className="input-group-text bg-white border-end-0 py-2 ps-3">
                    <i className={`bi bi-${icon} text-muted`}></i>
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
                        className="input-group-text bg-white border-start-0 pr-3 text-muted"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                            cursor: "pointer",
                            borderRadius: "0 10px 10px 0",
                        }}
                    >
                        <i
                            className={`bi bi-eye${showPassword ? "-slash" : ""}-fill`}
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
        <div className="login-page-wrapper d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div
                className="card border-0 shadow-lg"
                style={{
                    maxWidth: "420px",
                    width: "90%",
                    borderRadius: "24px",
                }}
            >
                <div className="card-body p-4 p-sm-5">
                    <div className="text-center mb-5">
                        <div className="brand-icon-container mb-3 shadow-sm d-inline-flex align-items-center justify-content-center">
                            <i className="bi bi-shield-lock-fill text-success fs-2"></i>
                        </div>
                        <h3 className="fw-extrabold text-dark mb-1 tracking-tight">
                            NUBIX MARKET
                        </h3>
                        <p className="text-muted small">
                            Panel de Administración
                        </p>
                    </div>

                    {error && (
                        <div
                            className="alert alert-danger d-flex align-items-center border-0 py-2 px-3 mb-4 animate__animated animate__shakeX"
                            style={{
                                borderRadius: "12px",
                                fontSize: "0.85rem",
                            }}
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
                            placeholder="admin@nubix.com"
                            value={credentials.email}
                            onChange={handleChange}
                            required
                        />

                        <AuthInput
                            label="Contraseña"
                            icon="key"
                            isPassword={true} // Activamos la funcionalidad del ojo
                            name="password"
                            placeholder="••••••••"
                            value={credentials.password}
                            onChange={handleChange}
                            required
                            style={{ borderRadius: "0" }} // El borde redondeado lo maneja el botón del ojo
                        />

                        <div className="d-flex justify-content-between align-items-center mb-4 mt-2">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="remember"
                                />
                                <label
                                    className="form-check-label small text-secondary"
                                    htmlFor="remember"
                                >
                                    Recordar sesión
                                </label>
                            </div>
                            <button
                                type="button"
                                className="btn btn-link p-0 text-decoration-none small text-success fw-bold"
                                data-bs-toggle="tooltip"
                                title="Contacta a TI para recuperar acceso"
                            >
                                ¿Ayuda?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success w-100 py-2 fw-bold shadow-sm"
                            disabled={loading}
                            style={{
                                borderRadius: "12px",
                                transition: "all 0.3s",
                            }}
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

                <div className="card-footer bg-transparent border-0 text-center pb-4">
                    <p className="text-muted" style={{ fontSize: "0.75rem" }}>
                        © 2026 Nubix Market • Sistemas e Información
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
