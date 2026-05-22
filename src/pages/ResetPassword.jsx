import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { authService } from "../features/auth/services/authService";

const ResetPassword = () => {
    const { token } = useParams();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState(token || "");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [codeVerified, setCodeVerified] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validaciones de contraseña
    const passwordRequirements = useMemo(() => {
        const pwd = password || ""; // Aseguramos que siempre lea un texto
        return {
            minLength: pwd.length >= 8,
            hasUpperCase: /[A-Z]/.test(pwd),
            hasLowerCase: /[a-z]/.test(pwd),
            hasNumber: /\d/.test(pwd),
            // Regex exacto y seguro para los símbolos: @ $ ! % ? & . _ # -
            hasSpecialChar: /[@$!%?&._#-]/ .test(pwd),
        };
    }, [password]);

    const isPasswordValid = Object.values(passwordRequirements).every(
        (req) => req,
    );
    const showPasswordChecklist = password.length > 0;

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!email || !code) {
            setError("Por favor ingresa tu email y código de recuperación");
            return;
        }

        setLoading(true);
        try {
            await authService.verifyCode(email, code);
            setCodeVerified(true);
            setMessage(
                "Código verificado. Ahora puedes cambiar tu contraseña.",
            );
        } catch (err) {
            setCodeVerified(false);
            setError(
                err?.response?.data?.message ||
                    "Código de recuperación inválido o expirado.",
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!codeVerified) {
            setError("Debes verificar el código primero");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!isPasswordValid) {
            setError("La contraseña no cumple con los requisitos de seguridad");
            return;
        }

        setLoading(true);
        try {
            await authService.resetPassword(email, code, password);
            setMessage(
                "Contraseña actualizada exitosamente. Redirigiendo al login...",
            );
            setTimeout(() => {
                window.location.href = "/login";
            }, 2000);
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

                        {!codeVerified ? (
                            <form onSubmit={handleVerifyCode}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        Correo electrónico
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="tu@email.com"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        Código de recuperación
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={code}
                                        onChange={(e) =>
                                            setCode(e.target.value)
                                        }
                                        placeholder="Introduce el código de 6 dígitos"
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                {message && (
                                    <div className="alert alert-info">
                                        <i className="bi bi-info-circle me-2"></i>
                                        {message}
                                    </div>
                                )}
                                {error && (
                                    <div className="alert alert-danger">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Verificando..."
                                        : "Verificar código"}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-bold">
                                        Nueva contraseña
                                    </label>
                                    <div className="input-group">
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="form-control"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            placeholder="Crea una contraseña segura"
                                            required
                                        />
                                        <span
                                            className="input-group-text bg-light"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            style={{
                                                cursor: "pointer",
                                            }}
                                        >
                                            <i
                                                className={`bi ${
                                                    showPassword
                                                        ? "bi-eye-slash"
                                                        : "bi-eye"
                                                } text-muted`}
                                            ></i>
                                        </span>
                                    </div>
                                </div>

                                {/* Checklist de requisitos de contraseña */}
                                {showPasswordChecklist && (
                                    <div
                                        className="mt-3 p-3 rounded"
                                        style={{
                                            backgroundColor: "#f8f9fa",
                                            border: "1px solid #dee2e6",
                                        }}
                                    >
                                        <small className="text-muted d-block mb-2 fw-bold">
                                            Requisitos de contraseña:
                                        </small>
                                        <div className="d-flex flex-column gap-2">
                                            <div className="d-flex align-items-center">
                                                <i
                                                    className={`bi ${
                                                        passwordRequirements.minLength
                                                            ? "bi-check-circle-fill"
                                                            : "bi-circle"
                                                    } me-2`}
                                                    style={{
                                                        color: passwordRequirements.minLength
                                                            ? "#28a745"
                                                            : "#ccc",
                                                        fontSize: "0.9rem",
                                                    }}
                                                ></i>
                                                <small
                                                    style={{
                                                        color: passwordRequirements.minLength
                                                            ? "#28a745"
                                                            : "#6c757d",
                                                    }}
                                                >
                                                    Al menos 8 caracteres (
                                                    {password.length}/8)
                                                </small>
                                            </div>

                                            <div className="d-flex align-items-center">
                                                <i
                                                    className={`bi ${
                                                        passwordRequirements.hasUpperCase
                                                            ? "bi-check-circle-fill"
                                                            : "bi-circle"
                                                    } me-2`}
                                                    style={{
                                                        color: passwordRequirements.hasUpperCase
                                                            ? "#28a745"
                                                            : "#ccc",
                                                        fontSize: "0.9rem",
                                                    }}
                                                ></i>
                                                <small
                                                    style={{
                                                        color: passwordRequirements.hasUpperCase
                                                            ? "#28a745"
                                                            : "#6c757d",
                                                    }}
                                                >
                                                    Una letra mayúscula (A-Z)
                                                </small>
                                            </div>

                                            <div className="d-flex align-items-center">
                                                <i
                                                    className={`bi ${
                                                        passwordRequirements.hasLowerCase
                                                            ? "bi-check-circle-fill"
                                                            : "bi-circle"
                                                    } me-2`}
                                                    style={{
                                                        color: passwordRequirements.hasLowerCase
                                                            ? "#28a745"
                                                            : "#ccc",
                                                        fontSize: "0.9rem",
                                                    }}
                                                ></i>
                                                <small
                                                    style={{
                                                        color: passwordRequirements.hasLowerCase
                                                            ? "#28a745"
                                                            : "#6c757d",
                                                    }}
                                                >
                                                    Una letra minúscula (a-z)
                                                </small>
                                            </div>

                                            <div className="d-flex align-items-center">
                                                <i
                                                    className={`bi ${
                                                        passwordRequirements.hasNumber
                                                            ? "bi-check-circle-fill"
                                                            : "bi-circle"
                                                    } me-2`}
                                                    style={{
                                                        color: passwordRequirements.hasNumber
                                                            ? "#28a745"
                                                            : "#ccc",
                                                        fontSize: "0.9rem",
                                                    }}
                                                ></i>
                                                <small
                                                    style={{
                                                        color: passwordRequirements.hasNumber
                                                            ? "#28a745"
                                                            : "#6c757d",
                                                    }}
                                                >
                                                    Un número (0-9)
                                                </small>
                                            </div>

                                            <div className="d-flex align-items-center">
                                                <i
                                                    className={`bi ${
                                                        passwordRequirements.hasSpecialChar
                                                            ? "bi-check-circle-fill"
                                                            : "bi-circle"
                                                    } me-2`}
                                                    style={{
                                                        color: passwordRequirements.hasSpecialChar
                                                            ? "#28a745"
                                                            : "#ccc",
                                                        fontSize: "0.9rem",
                                                    }}
                                                ></i>
                                                <small
                                                    style={{
                                                        color: passwordRequirements.hasSpecialChar
                                                            ? "#28a745"
                                                            : "#6c757d",
                                                    }}
                                                >
                                                    Un carácter especial
                                                    (@$!%?&._#-)

                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-3 mt-3">
                                    <label className="form-label fw-bold">
                                        Confirmar contraseña
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        placeholder="Confirma tu contraseña"
                                        required
                                    />
                                </div>

                                {message && (
                                    <div className="alert alert-success">
                                        <i className="bi bi-check-circle-fill me-2"></i>
                                        {message}
                                    </div>
                                )}
                                {error && (
                                    <div className="alert alert-danger">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-success w-100"
                                    disabled={loading || !isPasswordValid}
                                >
                                    {loading
                                        ? "Restableciendo..."
                                        : "Restablecer contraseña"}
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-link w-100 mt-2"
                                    onClick={() => setCodeVerified(false)}
                                >
                                    Cambiar código
                                </button>
                            </form>
                        )}
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
