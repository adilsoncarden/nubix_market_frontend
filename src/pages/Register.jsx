import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
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
        <div className="login-page-container">
            <div className="login-card shadow">
                <div className="text-center mb-4">
                    <div className="mb-3">
                        <span style={{ fontSize: "45px", color: "#1a733c" }}>
                            <i className="bi bi-person-plus-fill"></i>
                        </span>
                    </div>
                    <h2 className="fw-bold">Registrarse</h2>
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
                            Usuario
                        </label>
                        <input
                            type="text"
                            name="username"
                            className="form-control"
                            placeholder=""
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">
                            Correo Electrónico
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder=""
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder=""
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
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
                            padding: "10px",
                            borderRadius: "8px",
                            transition: "all 0.2s ease",
                            opacity: isHovered ? "0.8" : "1",
                            transform: isHovered ? "scale(1.02)" : "scale(1)",
                        }}
                    >
                        Registrarse
                    </button>

                    <div className="text-center mt-3">
                        <p className="text-muted small">
                            ¿Ya tienes una cuenta?{"  "}
                            <Link
                                to="/login"
                                className="fw-bold text-decoration-none"
                                style={{ color: "#1a733c" }}
                            >
                                Iniciar Sesión
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
