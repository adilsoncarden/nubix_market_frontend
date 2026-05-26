// src/pages/Register.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png.png"; 

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
    });

    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("");
    const [isHovered, setIsHovered] = useState(false);
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
            hasSpecialChar: /[@$!%?&._#-]/.test(pwd),
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
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: formData.username.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
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
        <div 
            className="container-fluid min-vh-100 d-flex align-items-center justify-content-center py-5"
            style={{
                background: "linear-gradient(180deg, #BEECD2 0%, #FFFFFF 45%, #F7E8C1 100%)",
                fontFamily: "'Poppins', sans-serif"
            }}
        >
            <div className="row justify-content-center w-100">
                <div className="col-12 col-sm-9 col-md-6 col-lg-4" style={{ maxWidth: "395px" }}>
                    
                    <div className="text-center mb-4">
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                            <img src={logo} alt="Nubix Market Logo" style={{ width: "140px", height: "auto", objectFit: "contain" }} />
                        </div>
                        <h2 className="fw-bold m-0" style={{ fontSize: "1.8rem", color: "#111111", letterSpacing: "-0.5px" }}>
                            Crea tu cuenta
                        </h2>
                        <p className="text-muted m-0 pt-2 px-3" style={{ fontSize: "0.95rem", color: "#666666", lineHeight: "1.4" }}>
                            Únete a Nubix y disfruta de la frescura en tu hogar
                        </p>
                    </div>

                    <div className="card border-0" style={{ borderRadius: "32px", backgroundColor: "#ffffff", boxShadow: "0 15px 35px rgba(0, 0, 0, 0.04)" }}>
                        <div className="card-body p-4">
                            {alertMessage && (
                                <div className={`alert alert-${alertType} text-center border-0 small p-2`} role="alert" style={{ borderRadius: "12px", fontSize: "0.85rem" }}>
                                    {alertMessage}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-medium text-dark ms-1 mb-1" style={{ fontSize: "0.9rem" }}>Nombre completo</label>
                                    <div className="position-relative d-flex align-items-center">
                                        <i className="bi bi-person position-absolute ms-3" style={{ color: "#7E8B9A", fontSize: "1.1rem" }}></i>
                                        <input type="text" name="username" className="form-control border-0 py-2.5" placeholder="Ej: Juan Pérez" style={{ borderRadius: "16px", backgroundColor: "#F1F3F5", paddingLeft: "45px", height: "50px" }} value={formData.username} onChange={handleChange} required />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label fw-medium text-dark ms-1 mb-1" style={{ fontSize: "0.9rem" }}>Correo electrónico</label>
                                    <div className="position-relative d-flex align-items-center">
                                        <i className="bi bi-envelope position-absolute ms-3" style={{ color: "#7E8B9A", fontSize: "1.05rem" }}></i>
                                        <input type="email" name="email" className="form-control border-0 py-2.5" placeholder="nombre@ejemplo.com" style={{ borderRadius: "16px", backgroundColor: "#F1F3F5", paddingLeft: "45px", height: "50px" }} value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium text-dark ms-1 mb-1" style={{ fontSize: "0.9rem" }}>Contraseña</label>
                                    <div className="position-relative d-flex align-items-center">
                                        <i className="bi bi-lock position-absolute ms-3" style={{ color: "#7E8B9A", fontSize: "1.1rem" }}></i>
                                        <input type={showPassword ? "text" : "password"} name="password" className="form-control border-0 py-2.5 pe-5" placeholder="Mínimo 8 caracteres" style={{ borderRadius: "16px", backgroundColor: "#F1F3F5", paddingLeft: "45px", height: "50px" }} value={formData.password} onChange={handleChange} required />
                                        <span className="position-absolute end-0 pe-3" style={{ cursor: "pointer", color: "#7E8B9A" }} onClick={() => setShowPassword(!showPassword)}>
                                            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                                        </span>
                                    </div>

                                    {showPasswordChecklist && (
                                        <div className="mt-3 p-3 rounded" style={{ backgroundColor: "#f8f9fa", border: "1px solid #dee2e6" }}>
                                            <small className="text-muted d-block mb-2 fw-bold">Requisitos de contraseña:</small>
                                            <div className="d-flex flex-column gap-2">
                                                {[{check: passwordRequirements.minLength, text: "Al menos 8 caracteres"}, {check: passwordRequirements.hasUpperCase, text: "Una letra mayúscula (A-Z)"}, {check: passwordRequirements.hasLowerCase, text: "Una letra minúscula (a-z)"}, {check: passwordRequirements.hasNumber, text: "Un número (0-9)"}, {check: passwordRequirements.hasSpecialChar, text: "Un carácter especial (@$!%?&._#-)"}].map((req, idx) => (
                                                    <div className="d-flex align-items-center" key={idx}>
                                                        <i className={`bi ${req.check ? "bi-check-circle-fill" : "bi-circle"} me-2`} style={{ color: req.check ? "#28a745" : "#ccc", fontSize: "0.9rem" }}></i>
                                                        <small style={{ color: req.check ? "#28a745" : "#6c757d" }}>{req.text}</small>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    className="btn w-100 shadow-sm fw-bold text-white mb-3 mt-3"
                                    onMouseEnter={() => isPasswordValid && setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    disabled={!isPasswordValid}
                                    style={{
                                        backgroundColor: isPasswordValid ? "#1a733c" : "#cccccc",
                                        border: "none",
                                        borderRadius: "25px",
                                        height: "50px",
                                        transition: "all 0.3s ease",
                                        transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                                        boxShadow: isHovered ? "0 5px 15px rgba(26, 115, 60, 0.3)" : "none",
                                        cursor: isPasswordValid ? "pointer" : "not-allowed",
                                    }}
                                >
                                    {isHovered ? "¡Empezar ahora! ✨" : "Registrarse"}
                                </button>
                            </form>
                            
                            <div className="text-center mt-3">
                                <p className="text-muted small">¿Ya tienes cuenta? <Link to="/login" className="text-decoration-none fw-bold" style={{ color: "#006634" }}>Inicia sesión</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;