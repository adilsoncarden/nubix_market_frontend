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
        <div className="login-page-container">
            <div className="login-card shadow">
                <div className="text-center mb-4">
                    <div className="mb-3">
                        <span style={{ fontSize: "45px", color: "#1a733c" }}>
                            <i className="bi bi-shield-lock-fill"></i>
                        </span>
                    </div>
                    <h2 className="fw-bold">Iniciar Sesión</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ minHeight: "3.5rem" }}>
                        {alertMessage && (
                            <div
                                className={`alert alert-${alertType} text-center m-0`}
                                role="alert"
                            >
                                {alertMessage}
                            </div>
                        )}
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder=""
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder=""
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="remember"
                            />
                            <label
                                className="form-check-label small text-muted"
                                htmlFor="remember"
                            >
                                Recuérdame
                            </label>
                        </div>
                        <a
                            href="#"
                            className="small text-decoration-none fw-bold"
                            style={{ color: "#1a733c" }}
                        >
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    <button
                        type="submit"
                        className="btn w-100 mb-3 fw-bold"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{
                            backgroundColor: "#1a733c",
                            color: "white",
                            border: "none",
                            padding: "12px",
                            borderRadius: "8px",
                            transition: "all 0.2s ease",
                            opacity: isHovered ? "0.85" : "1",
                            transform: isHovered ? "scale(1.02)" : "scale(1)",
                            cursor: "pointer",
                        }}
                    >
                        Iniciar Sesión
                    </button>

                    <div className="text-center mt-3">
                        <p className="text-muted small">
                            ¿No tienes una cuenta?{" "}
                            <Link
                                to="/register"
                                className="fw-bold text-decoration-none"
                                style={{ color: "#1a733c" }}
                            >
                                Registrate
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
