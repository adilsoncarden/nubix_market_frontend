// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlertMessage("");
        setAlertType("");

        try {
            const response = await fetch(
                "http://localhost:8080/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: formData.username.trim(),
                        email: formData.email.trim(),
                        password: formData.password,
                    }),
                },
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setAlertType("danger");
                setAlertMessage(
                    data.message || "Error al registrar el usuario",
                );
                return;
            }

            setAlertType("success");
            setAlertMessage("Registro exitoso. Redirigiendo al login...");

            setTimeout(() => {
                navigate("/login");
            }, 1400);
        } catch (error) {
            setAlertType("danger");
            setAlertMessage(
                "No se pudo conectar con el servidor. Intenta de nuevo.",
            );
            console.error("Register error:", error);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                {/* Ajustamos a col-xl-4 para que coincida exactamente con el Login */}
                <div className="col-12 col-md-8 col-lg-5 col-xl-4">
                    <div
                        className="card shadow-lg border-0"
                        style={{ borderRadius: "20px", overflow: "hidden" }}
                    >
                        <div className="card-body p-4 p-sm-5">
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
                                        <i className="bi bi-person-plus-fill"></i>
                                    </span>
                                </div>
                                <h2 className="fw-bold mb-1">Crea tu cuenta</h2>
                                <p className="text-muted small">
                                    Únete a la comunidad de Nubix Market
                                </p>
                            </div>

                            <div style={{ minHeight: "60px" }} className="mb-3">
                                {alertMessage && (
                                    <div
                                        className={`alert alert-${alertType} text-center border-0 small shadow-sm`}
                                        role="alert"
                                        style={{ borderRadius: "10px" }}
                                    >
                                        <i
                                            className={`bi ${
                                                alertType === "success"
                                                    ? "bi-check-circle-fill"
                                                    : "bi-exclamation-triangle-fill"
                                            } me-2`}
                                        ></i>
                                        {alertMessage}
                                    </div>
                                )}
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted ms-1">
                                        Nombre de Usuario
                                    </label>
                                    <div className="input-group">
                                        <span
                                            className="input-group-text bg-light border-end-0"
                                            style={{
                                                borderRadius: "10px 0 0 10px",
                                            }}
                                        >
                                            <i className="bi bi-person text-muted"></i>
                                        </span>
                                        <input
                                            type="text"
                                            name="username"
                                            className="form-control bg-light border-start-0 py-2"
                                            placeholder="Tu nombre de usuario"
                                            style={{
                                                borderRadius: "0 10px 10px 0",
                                                fontSize: "0.95rem",
                                            }}
                                            value={formData.username}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

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
                                            name="email"
                                            className="form-control bg-light border-start-0 py-2"
                                            placeholder="ejemplo@nubix.com"
                                            style={{
                                                borderRadius: "0 10px 10px 0",
                                                fontSize: "0.95rem",
                                            }}
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
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
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            name="password"
                                            className="form-control bg-light border-start-0 border-end-0 py-2"
                                            placeholder="Crea una clave segura"
                                            style={{
                                                fontSize: "0.95rem",
                                            }}
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />

                                        <span
                                            className="input-group-text bg-light border-start-0"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            style={{
                                                borderRadius: "0 10px 10px 0",
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

                                <button
                                    type="submit"
                                    className="btn w-100 shadow-sm fw-bold mb-3"
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
                                        ? "¡Empezar ahora! ✨"
                                        : "Registrarse"}
                                </button>

                                <div className="text-center mt-3">
                                    <p className="text-muted small">
                                        ¿Ya tienes una cuenta?{" "}
                                        <Link
                                            to="/login"
                                            className="fw-bold text-decoration-none"
                                            style={{ color: "#1a733c" }}
                                        >
                                            Inicia Sesión
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

export default Register;
