import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { authService } from "../features/auth/services/authService";

const ResetPassword = () => {
    const { token } = useParams(); // Si vienes de un link, el token se captura aquí

    // 1. Agregamos el estado para el código
    const [code, setCode] = useState(token || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            // Agrega el campo de email si tu backend lo requiere (parece que sí según el Controller)
            await authService.resetPassword(email, code, password);
            setMessage("Contraseña actualizada exitosamente");
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    "Error al restablecer la contraseña.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-sm p-4">
                        <h4 className="mb-4 fw-bold text-center">
                            Restablecer contraseña
                        </h4>
                        <form onSubmit={handleSubmit}>
                            {/* --- AQUÍ AGREGAS EL BLOQUE DEL CÓDIGO --- */}
                            <div className="mb-3">
                                <label className="form-label">
                                    Código de recuperación
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Introduce el código de 6 dígitos"
                                    required
                                />
                            </div>
                            {/* ---------------------------------------- */}

                            <div className="mb-3">
                                <label className="form-label">
                                    Nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">
                                    Confirmar contraseña
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            {message && (
                                <div className="alert alert-success">
                                    {message}
                                </div>
                            )}
                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="btn btn-success w-100"
                                disabled={loading}
                            >
                                {loading
                                    ? "Restableciendo..."
                                    : "Restablecer contraseña"}
                            </button>
                        </form>
                        <div className="mt-3 text-center">
                            <Link to="/login">Volver al inicio de sesión</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
