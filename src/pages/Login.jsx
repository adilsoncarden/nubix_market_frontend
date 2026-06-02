import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { getRedirectUrl, clearRedirectUrl } from "../utils/authUtils";
import { authService } from "../features/auth/services/authService";
import logo from "../assets/logo.png.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const { loginWeb } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertMessage("");
        setAlertType("");

        try {
            const data = await authService.login({
                email: email.trim(),
                password,
            });

            if (!data.success) {
                setAlertType("danger");
                setAlertMessage(data.message || "Credenciales incorrectas");
                return;
            }

            // ✅ Usar el contexto para guardar el token
            loginWeb(
                {
                    username: data.username,
                    rol: data.rol,
                    id: data.id,
                },
                data.token,
            );

            setAlertType("success");
            setAlertMessage(
                "Inicio de sesión exitoso. Bienvenido " + data.username + "!",
            );

            setTimeout(() => {
                // ✅ Obtener URL de redirección guardada, o "/" por defecto
                const redirectUrl = getRedirectUrl();
                clearRedirectUrl();
                navigate(redirectUrl);
            }, 1200);
        } catch (error) {
            setAlertType("danger");
            if (error.response?.data?.message) {
                setAlertMessage(error.response.data.message);
            } else if (!error.response) {
                setAlertMessage(
                    "No se pudo conectar con el servidor. Intenta de nuevo.",
                );
            } else {
                setAlertMessage("Credenciales incorrectas");
            }
            console.error("Login error:", error);
        }
    };

    return (
        <div
            className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5"
            style={{
                background:
                    "linear-gradient(180deg, #BEECD2 0%, #FFFFFF 45%, #F7E8C1 100%)",
                color: "#104E35",
            }}
        >
            <div className="row justify-content-center w-100">
                <div
                    className="col-12 col-sm-9 col-md-6 col-lg-4"
                    style={{ maxWidth: "395px" }}
                >
                    <div className="text-center mb-4 p-0">
                        <img
                            src={logo}
                            alt="Logo"
                            className="m-0 p-0"
                            style={{
                                width: "130px",
                                height: "auto",
                                objectFit: "contain",
                            }}
                        />
                        <h4
                            className="fw-bold m-0 pt-2"
                            style={{ fontSize: "1.55rem", color: "#1A1A1A" }}
                        >
                            Bienvenido a Nubix
                        </h4>
                        <p
                            className="text-muted m-0 pt-1"
                            style={{ fontSize: "0.92rem" }}
                        >
                            Accede a lo mejor de la tecnología fresca.
                        </p>
                    </div>

                    <div
                        className="card"
                        style={{
                            borderRadius: "32px",
                            backgroundColor: "#ffffff",
                            border: "1px solid #EAECEF",
                            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.05)",
                        }}
                    >
                        <div className="card-body pt-3 px-4 pb-4">
                            {/* Ajuste de minHeight para reducir el espacio arriba del input */}
                            <div style={{ minHeight: "35px" }}>
                                {alertMessage && (
                                    <div
                                        className={`alert alert-${alertType === "danger" ? "danger" : "success"} text-center border-0 small p-2`}
                                        role="alert"
                                        style={{
                                            borderRadius: "12px",
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        <i
                                            className={`bi ${alertType === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-1`}
                                        ></i>
                                        {alertMessage}
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label
                                        className="form-label fw-semibold text-secondary ms-1 mb-1"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        Correo Electrónico
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <i className="bi bi-envelope-fill"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className="form-control bg-light border-start-0 py-2"
                                            placeholder="ejemplo@nubix.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-1 px-1">
                                        <label
                                            className="form-label fw-semibold text-secondary m-0"
                                            style={{ fontSize: "0.85rem" }}
                                        >
                                            Contraseña
                                        </label>
                                        <Link
                                            to="/forgot-password"
                                            className="text-decoration-none fw-semibold"
                                            style={{
                                                color: "#006634",
                                                fontSize: "0.82rem",
                                            }}
                                        >
                                            ¿Olvidaste tu clave?
                                        </Link>
                                    </div>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light border-end-0">
                                            <i className="bi bi-lock-fill"></i>
                                        </span>
                                        <input
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            className="form-control bg-light border-start-0 border-end-0 py-2"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                        />
                                        <span
                                            className="input-group-text bg-light border-start-0"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            style={{ cursor: "pointer" }}
                                        >
                                            <i
                                                className={`bi ${showPassword ? "bi-eye-slash-fill" : "bi-eye-fill"}`}
                                            ></i>
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn w-100 fw-bold text-white"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    style={{
                                        backgroundColor: "#006634",
                                        borderRadius: "25px",
                                        padding: "12px",
                                        transition: "0.2s",
                                    }}
                                >
                                    {isHovered
                                        ? "¡Vamos allá! 🚀"
                                        : "Iniciar Sesión"}
                                </button>

                                <div className="d-flex align-items-center my-3">
                                    <hr className="flex-grow-1" />
                                    <span
                                        className="mx-2 text-muted"
                                        style={{ fontSize: "0.75rem" }}
                                    >
                                        O continuar con
                                    </span>
                                    <hr className="flex-grow-1" />
                                </div>

                                <div className="d-flex gap-2">
                                    <button
                                        type="button"
                                        className="btn btn-light w-50 border py-2"
                                        style={{
                                            borderRadius: "20px",
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        <i className="bi bi-google me-2 text-danger"></i>{" "}
                                        Google
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-light w-50 border py-2"
                                        style={{
                                            borderRadius: "20px",
                                            fontSize: "0.85rem",
                                        }}
                                    >
                                        <i className="bi bi-apple me-2"></i>{" "}
                                        Apple
                                    </button>
                                </div>

                                <div className="text-center mt-3">
                                    <p
                                        className="text-secondary"
                                        style={{ fontSize: "0.85rem" }}
                                    >
                                        ¿No tienes cuenta?{" "}
                                        <Link
                                            to="/register"
                                            className="fw-bold text-decoration-none"
                                            style={{ color: "#006634" }}
                                        >
                                            Regístrate
                                        </Link>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
