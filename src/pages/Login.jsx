import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { getRedirectUrl, clearRedirectUrl } from "../utils/authUtils";
import { authService } from "../features/auth/services/authService";
import logo from "../assets/logo.png.png";
import "../styles/auth-pages.css";

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
                setAlertMessage(
                    data.message ||
                        "Correo electrónico o contraseña incorrectos. Por favor, inténtelo de nuevo.",
                );
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
            const apiMessage = error.response?.data?.message;
            if (apiMessage) {
                setAlertMessage(apiMessage);
            } else if (!error.response) {
                setAlertMessage(
                    "No se pudo conectar con el servidor. Intenta de nuevo.",
                );
            } else {
                setAlertMessage(
                    "Correo electrónico o contraseña incorrectos. Por favor, inténtelo de nuevo.",
                );
            }
            console.error("Login error:", error);
        }
    };

    return (
        <div className="auth-page-shell">
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-12 auth-page-col">
                        <div className="text-center mb-4">
                            <img
                                src={logo}
                                alt="Logo Nubix Market"
                                className="auth-page-logo"
                            />
                            <h4 className="auth-page-heading">
                                Bienvenido a Nubix
                            </h4>
                            <p className="auth-page-subheading">
                                Accede a lo mejor de la tecnología fresca.
                            </p>
                        </div>

                        <div className="card auth-card border-0">
                            <div className="card-body p-4 p-md-5">
                                <div className="auth-alert-slot">
                                    {alertMessage && (
                                        <div
                                            className={`alert alert-${alertType === "danger" ? "danger" : "success"} auth-alert text-center border-0 small p-2 mb-3`}
                                            role="alert"
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
                            <label className="form-label auth-field-label ms-1">
                                Correo Electrónico
                            </label>
                            <div className="input-group auth-input-group">
                                <span className="input-group-text border-end-0">
                                    <i className="bi bi-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    className="form-control border-start-0"
                                    placeholder=""
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
                                <label className="form-label auth-field-label m-0">
                                    Contraseña
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="auth-link-brand text-decoration-none"
                                >
                                    ¿Olvidaste tu clave?
                                </Link>
                            </div>
                            <div className="input-group auth-input-group">
                                <span className="input-group-text border-end-0">
                                    <i className="bi bi-lock"></i>
                                </span>
                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="form-control border-start-0 border-end-0"
                                    placeholder=""
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                                <span
                                    className="input-group-text border-start-0"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    <i
                                        className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                                    ></i>
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn w-100 auth-btn-primary"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {isHovered
                                ? "¡Vamos allá! 🚀"
                                : "Iniciar Sesión"}
                        </button>

                        <div className="d-flex align-items-center my-3">
                            <hr className="flex-grow-1" />
                            <span className="mx-2 auth-divider">
                                O continuar con
                            </span>
                            <hr className="flex-grow-1" />
                        </div>

                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="auth-btn-social"
                            >
                                <i className="bi bi-google me-2 text-danger"></i>
                                Google
                            </button>
                            <button
                                type="button"
                                className="auth-btn-social"
                            >
                                <i className="bi bi-apple me-2"></i>
                                Apple
                            </button>
                        </div>

                        <div className="text-center mt-3">
                            <p className="auth-footer-text mb-0">
                                ¿No tienes cuenta?{" "}
                                <Link
                                    to="/register"
                                    className="auth-link-brand text-decoration-none"
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
        </div>
    );
};

export default Login;
