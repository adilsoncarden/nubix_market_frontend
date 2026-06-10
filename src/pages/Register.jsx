import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../features/auth/services/authService";
import logo from "../assets/logo.png.png";
import "../styles/auth-pages.css";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
    });

    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    // Lógica de validación de contraseña
    const passwordRequirements = useMemo(() => {
        const pwd = formData.password;
        return {
            minLength: pwd.length >= 8,
            hasUpperCase: /[A-Z]/.test(pwd),
            hasLowerCase: /[a-z]/.test(pwd),
            hasNumber: /\d/.test(pwd),
            hasSpecialChar: /[@$!%*?&._#-]/.test(pwd),
        };
    }, [formData.password]);

    const isPasswordValid = Object.values(passwordRequirements).every((req) => req);
    const showPasswordChecklist = formData.password.length > 0;

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
            const data = await authService.register({
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password,
            });

            if (!data.success) {
                setAlertType("danger");
                setAlertMessage(data.message || "Error al registrar el usuario");
                return;
            }

            setAlertType("success");
            setAlertMessage("Registro exitoso. Redirigiendo al login...");

            setTimeout(() => {
                navigate("/login");
            }, 1400);
        } catch (error) {
            setAlertType("danger");
            setAlertMessage("No se pudo conectar con el servidor. Intenta de nuevo.");
            console.error("Register error:", error);
        }
    };

    return (
        <div className="auth-page-shell">
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-12 auth-page-col auth-page-col--register">
                        <div className="text-center mb-4">
                            <img
                                src={logo}
                                alt="Nubix Market Logo"
                                className="auth-page-logo mb-2"
                            />
                            <h2 className="auth-page-heading">
                                Crea tu cuenta
                            </h2>
                            <p className="auth-page-subheading px-2">
                                Únete a Nubix y disfruta de la frescura en tu hogar
                            </p>
                        </div>

                        <div className="card auth-card border-0">
                            <div className="card-body p-4 p-md-5">
                                {alertMessage && (
                                    <div
                                        className={`alert alert-${alertType} auth-alert text-center border-0 small p-2 mb-3`}
                                        role="alert"
                                    >
                                        {alertMessage}
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label auth-field-label ms-1">
                                            Nombre completo
                                        </label>
                                        <div className="input-group auth-input-group">
                                            <span className="input-group-text border-end-0">
                                                <i className="bi bi-person"></i>
                                            </span>
                                            <input
                                                type="text"
                                                name="username"
                                                className="form-control border-start-0"
                                                placeholder=""
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label auth-field-label ms-1">
                                            Correo electrónico
                                        </label>
                                        <div className="input-group auth-input-group">
                                            <span className="input-group-text border-end-0">
                                                <i className="bi bi-envelope"></i>
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control border-start-0"
                                                placeholder=""
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label auth-field-label ms-1">
                                            Contraseña
                                        </label>
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
                                                name="password"
                                                className="form-control border-start-0 border-end-0"
                                                placeholder=""
                                                value={formData.password}
                                                onChange={handleChange}
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

                                        {showPasswordChecklist && (
                                            <div className="mt-3 p-3 auth-password-checklist">
                                                <small className="text-muted d-block mb-2 fw-bold">
                                                    Requisitos de contraseña:
                                                </small>
                                                <div className="d-flex flex-column gap-2">
                                                    {[
                                                        {
                                                            check: passwordRequirements.minLength,
                                                            text: "Al menos 8 caracteres",
                                                        },
                                                        {
                                                            check: passwordRequirements.hasUpperCase,
                                                            text: "Una letra mayúscula (A-Z)",
                                                        },
                                                        {
                                                            check: passwordRequirements.hasLowerCase,
                                                            text: "Una letra minúscula (a-z)",
                                                        },
                                                        {
                                                            check: passwordRequirements.hasNumber,
                                                            text: "Un número (0-9)",
                                                        },
                                                        {
                                                            check: passwordRequirements.hasSpecialChar,
                                                            text: "Un carácter especial (@$!%*?&._#-)",
                                                        },
                                                    ].map((req, idx) => (
                                                        <div
                                                            className="d-flex align-items-center"
                                                            key={idx}
                                                        >
                                                            <i
                                                                className={`bi ${req.check ? "bi-check-circle-fill" : "bi-circle"} me-2`}
                                                                style={{
                                                                    color: req.check
                                                                        ? "#28a745"
                                                                        : "#ccc",
                                                                    fontSize: "0.9rem",
                                                                }}
                                                            ></i>
                                                            <small
                                                                style={{
                                                                    color: req.check
                                                                        ? "#28a745"
                                                                        : "#6c757d",
                                                                }}
                                                            >
                                                                {req.text}
                                                            </small>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn w-100 auth-btn-primary mt-2"
                                        disabled={!isPasswordValid}
                                    >
                                        Registrarse
                                    </button>

                                    <div className="text-center mt-3">
                                        <p className="auth-footer-text mb-0">
                                            ¿Ya tienes cuenta?{" "}
                                            <Link
                                                to="/login"
                                                className="auth-link-brand text-decoration-none"
                                            >
                                                Inicia sesión
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

export default Register;
