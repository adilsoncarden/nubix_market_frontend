import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../features/auth/services/authService";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate(); // inicializar

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            await authService.forgotPassword(email);
            setMessage(
                "Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña.",
            );

            // No redirigir automáticamente, solo mostrar mensaje
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Error al enviar el correo de recuperación.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div
                        className="card shadow-lg border-0"
                        style={{
                            borderRadius: "20px",
                            overflow: "hidden",
                        }}
                    >
                        <div className="card-body p-4 p-sm-5">
                            <div className="text-center mb-4">
                                <div
                                    className="mb-3 d-inline-block p-3 rounded-circle"
                                    style={{ backgroundColor: "#e8f5e9" }}
                                >
                                    <span
                                        style={{
                                            fontSize: "38px",
                                            color: "#1a733c",
                                        }}
                                    >
                                        <i className="bi bi-key-fill"></i>
                                    </span>
                                </div>

                                <h4 className="fw-bold mb-2">
                                    Recuperar contraseña
                                </h4>

                                <p className="text-muted small mb-0">
                                    Ingresa tu correo para recibir las
                                    instrucciones de recuperación
                                </p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted ms-1">
                                        Correo electrónico
                                    </label>

                                    <div className="input-group">
                                        <span
                                            className="input-group-text bg-light border-end-0"
                                            style={{
                                                borderRadius: "10px 0 0 10px",
                                            }}
                                        >
                                            <i className="bi bi-envelope text-muted"></i>
                                        </span>

                                        <input
                                            type="email"
                                            className="form-control bg-light border-start-0 py-2"
                                            style={{
                                                borderRadius: "0 10px 10px 0",
                                                fontSize: "0.95rem",
                                            }}
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {message && (
                                    <div
                                        className="alert alert-success border-0 shadow-sm small"
                                        style={{ borderRadius: "12px" }}
                                    >
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        {message}
                                    </div>
                                )}

                                {error && (
                                    <div
                                        className="alert alert-danger border-0 shadow-sm small"
                                        style={{ borderRadius: "12px" }}
                                    >
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn w-100 fw-bold shadow-sm mt-2"
                                    disabled={loading}
                                    style={{
                                        backgroundColor: "#1a733c",
                                        color: "white",
                                        border: "none",
                                        padding: "12px",
                                        borderRadius: "12px",
                                        transition: "0.3s",
                                    }}
                                >
                                    {loading
                                        ? "Enviando..."
                                        : "Enviar instrucciones"}
                                </button>
                            </form>

                            {/* Links Mejorados */}
                            <div className="mt-4 text-center">
                                <div
                                    className="d-flex flex-column gap-3"
                                    style={{
                                        borderTop: "1px solid #f1f1f1",
                                        paddingTop: "20px",
                                    }}
                                >
                                    <Link
                                        to="/login"
                                        className="text-decoration-none fw-bold"
                                        style={{
                                            color: "#1a733c",
                                            transition: "0.3s",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.target.style.opacity = "0.8")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.target.style.opacity = "1")
                                        }
                                    >
                                        <i className="bi bi-arrow-left-circle me-2"></i>
                                        Volver al inicio de sesión
                                    </Link>

                                    <Link
                                        to="/reset-password/manual"
                                        className="text-decoration-none fw-bold d-inline-flex justify-content-center align-items-center gap-2"
                                        style={{
                                            backgroundColor: "#e8f5e9",
                                            color: "#1a733c",
                                            padding: "12px",
                                            borderRadius: "12px",
                                            transition: "0.3s",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.backgroundColor =
                                                "#d7eedb";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.backgroundColor =
                                                "#e8f5e9";
                                        }}
                                    >
                                        <i className="bi bi-shield-lock-fill"></i>
                                        Ya tengo mi código, restablecer
                                        contraseña
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
