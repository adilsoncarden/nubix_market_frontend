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
                    <div className="card shadow-sm p-4">
                        <h4 className="mb-4 fw-bold text-center">
                            Recuperar contraseña
                        </h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">
                                    Correo electrónico
                                </label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
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
                                    ? "Enviando..."
                                    : "Enviar instrucciones"}
                            </button>
                        </form>
                        <div className="mt-3 text-center">
                            <Link to="/login">Volver al inicio de sesión</Link>
                            <br />
                            <Link
                                to="/reset-password/manual"
                                className="text-decoration-underline"
                            >
                                Ya tengo mi código, restablecer contraseña
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
