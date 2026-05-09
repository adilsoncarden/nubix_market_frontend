// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertMessage("");
        setAlertType("");

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setAlertType("danger");
                setAlertMessage(data.message || "Credenciales incorrectas");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("username", data.username);
            window.dispatchEvent(new Event("localStorageChanged"));
            setAlertType("success");
            setAlertMessage(
                "Inicio de sesión exitoso. Bienvenido " + data.username + "!",
            );

            setTimeout(() => {
                navigate("/");
            }, 1200);
        } catch (error) {
            setAlertType("danger");
            setAlertMessage(
                "No se pudo conectar con el servidor. Intenta de nuevo.",
            );
            console.error("Login error:", error);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-5 col-xl-4">
                    {/* Card Principal */}
                    <div
                        className="card shadow-lg border-0"
                        style={{ borderRadius: "20px", overflow: "hidden" }}
                    >
                        <div className="card-body p-4 p-sm-5">
                            {/* Cabecera del Login */}
                            <div className="text-center mb-4">
                                <div
                                    className="mb-3 d-inline-block p-3 rounded-circle"
                                    style={{ backgroundColor: "#e8f5e9" }}
                                >
                                    <span
                                        style={{
                                            fontSize: "40px",
                                            color: "#1a733c",
                                        }}
                                    >
                                        <i className="bi bi-shield-lock-fill"></i>
                                    </span>
                                </div>
                                <h2 className="fw-bold mb-1">Bienvenido</h2>
                                <p className="text-muted small">
                                    Ingresa tus credenciales para continuar
                                </p>
                            </div>

                            {/* Área de Alertas con altura fija para evitar saltos de diseño */}
                            <div style={{ minHeight: "60px" }} className="mb-3">
                                {alertMessage && (
                                    <div
                                        className={`alert alert-${alertType} text-center border-0 small shadow-sm`}
                                        role="alert"
                                        style={{ borderRadius: "10px" }}
                                    >
                                        <i
                                            className={`bi ${alertType === "success" ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"} me-2`}
                                        ></i>
                                        {alertMessage}
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit}>
                                {/* Input Email */}
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted ms-1">
                                        Correo Electrónico
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
                                            placeholder="ejemplo@nubix.com"
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

                                {/* Input Password */}
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted ms-1">
                                        Contraseña
                                    </label>
                                    <div className="input-group">
                                        <span
                                            className="input-group-text bg-light border-end-0"
                                            style={{
                                                borderRadius: "10px 0 0 10px",
                                            }}
                                        >
                                            <i className="bi bi-lock text-muted"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className="form-control bg-light border-start-0 py-2"
                                            placeholder="••••••••"
                                            style={{
                                                borderRadius: "0 10px 10px 0",
                                                fontSize: "0.95rem",
                                            }}
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Opciones adicionales */}
                                <div className="d-flex justify-content-between align-items-center mb-4 px-1">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="remember"
                                            style={{ cursor: "pointer" }}
                                        />
                                        <label
                                            className="form-check-label small text-muted"
                                            htmlFor="remember"
                                            style={{ cursor: "pointer" }}
                                        >
                                            Recuérdame
                                        </label>
                                    </div>
                                    <a
                                        href="#"
                                        className="small text-decoration-none fw-bold"
                                        style={{ color: "#1a733c" }}
                                    >
                                        ¿Olvidaste tu clave?
                                    </a>
                                </div>

                                {/* Botón Ingresar */}
                                <button
                                    type="submit"
                                    className="btn w-100 shadow-sm fw-bold"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    style={{
                                        backgroundColor: "#1a733c",
                                        color: "white",
                                        border: "none",
                                        padding: "12px",
                                        borderRadius: "12px",
                                        transition: "all 0.3s ease",
                                        transform: isHovered
                                            ? "translateY(-2px)"
                                            : "translateY(0)",
                                        boxShadow: isHovered
                                            ? "0 5px 15px rgba(26, 115, 60, 0.3)"
                                            : "none",
                                    }}
                                >
                                    {isHovered
                                        ? "¡Vamos allá! 🚀"
                                        : "Iniciar Sesión"}
                                </button>

                                {/* Link de Registro */}
                                <div className="text-center mt-4">
                                    <p className="text-muted small">
                                        ¿Eres nuevo aquí?{" "}
                                        <Link
                                            to="/register"
                                            className="fw-bold text-decoration-none"
                                            style={{
                                                color: "#1a733c",
                                                borderBottom:
                                                    "2px solid transparent",
                                                transition: "0.3s",
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.target.style.borderBottom =
                                                    "2px solid #1a733c")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.target.style.borderBottom =
                                                    "2px solid transparent")
                                            }
                                        >
                                            Crea una cuenta
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
