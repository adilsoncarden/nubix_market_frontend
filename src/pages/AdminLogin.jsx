import React, { useState, useEffect } from "react";
import { useAdminAuth } from "../features/auth/hooks/useAdminAuth";
import { Tooltip } from "bootstrap";

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [isHovered, setIsHovered] = useState(false);
    
    // --- Lógica de Modo Oscuro Comentada para el futuro ---
    // const [darkMode, setDarkMode] = useState(true); 
    const darkMode = false; // Forzado a modo claro por ahora

    const { handleAdminLogin, loading, error } = useAdminAuth();

    useEffect(() => {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach((el) => new Tooltip(el));
    }, []);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAdminLogin(credentials);
    };

    const colors = {
        green: "#1a733c",
        lightGreen: darkMode ? "#1a3b25" : "#e8f5e9",
        cardBg: darkMode ? "#1e1e1e" : "#ffffff",
        bodyBg: darkMode ? "#121212" : "#f8f9fa",
        mainText: darkMode ? "#ffffff" : "#212529",
        subText: darkMode ? "#b0b0b0" : "#6c757d", 
        inputBg: darkMode ? "#2b3035" : "#f8f9fa",
        inputBorder: darkMode ? "#444" : "#dee2e6",
        inputText: darkMode ? "#ffffff" : "#212529" 
    };

    return (
        <div className="container-fluid vh-100 d-flex align-items-center justify-content-center" 
             style={{ backgroundColor: colors.bodyBg, transition: "0.3s" }}>
            
            {/* --- Botón de Switch de modo oscuro comentado --- */}
            {/* <button 
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                className="btn btn-sm position-absolute top-0 end-0 m-3 rounded-circle shadow-sm"
                style={{ 
                    width: "40px", height: "40px", 
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.inputBorder}`,
                    color: colors.mainText,
                    zIndex: 10
                }}
            >
                <i className={`bi bi-${darkMode ? "sun-fill" : "moon-fill"}`}></i>
            </button> 
            */}

            <div style={{ width: "100%", maxWidth: "360px" }}>
                <div className="card shadow-lg border-0" 
                     style={{ borderRadius: "20px", backgroundColor: colors.cardBg, color: colors.mainText, transition: "0.3s" }}>
                    <div className="card-body p-4 p-sm-5">
                        
                        <div className="text-center mb-4">
                            <div className="mb-3 d-inline-block p-3 rounded-circle" style={{ backgroundColor: colors.lightGreen }}>
                                <span style={{ fontSize: "35px", color: colors.green }}>
                                    <i className="bi bi-shield-lock-fill"></i>
                                </span>
                            </div>
                            <h3 className="fw-bold mb-0">NUBIX MARKET</h3>
                            <p style={{ color: colors.subText, fontSize: "0.85rem" }} className="mb-0">Panel de Administración</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger py-2 small border-0 mb-3 text-center" 
                                 style={{ borderRadius: "10px", backgroundColor: "#dc3545", color: "white" }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <div className="input-group">
                                    <span className="input-group-text border-end-0" 
                                          style={{ borderRadius: "12px 0 0 12px", backgroundColor: colors.inputBg, borderColor: colors.inputBorder }}>
                                        <i className="bi bi-envelope" style={{ color: colors.subText }}></i>
                                    </span>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control border-start-0 ps-0 shadow-none custom-placeholder"
                                        placeholder="Correo Electrónico"
                                        style={{ 
                                            borderRadius: "0 12px 12px 0", height: "48px", 
                                            backgroundColor: colors.inputBg, 
                                            color: colors.inputText, 
                                            borderColor: colors.inputBorder 
                                        }}
                                        value={credentials.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="input-group">
                                    <span className="input-group-text border-end-0" 
                                          style={{ borderRadius: "12px 0 0 12px", backgroundColor: colors.inputBg, borderColor: colors.inputBorder }}>
                                        <i className="bi bi-lock" style={{ color: colors.subText }}></i>
                                    </span>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control border-start-0 ps-0 shadow-none custom-placeholder"
                                        placeholder="Contraseña"
                                        style={{ 
                                            borderRadius: "0 12px 12px 0", height: "48px", 
                                            backgroundColor: colors.inputBg, 
                                            color: colors.inputText, 
                                            borderColor: colors.inputBorder 
                                        }}
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn w-100 fw-bold shadow-sm text-white"
                                disabled={loading}
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                style={{
                                    height: "48px",
                                    borderRadius: "12px",
                                    backgroundColor: colors.green,
                                    border: "none",
                                    transition: "0.2s",
                                    transform: isHovered && !loading ? "translateY(-2px)" : "translateY(0)"
                                }}
                            >
                                {loading ? <span className="spinner-border spinner-border-sm"></span> : "Iniciar Sesión"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <style>{`
                .custom-placeholder::placeholder {
                    color: ${darkMode ? "#888" : "#adb5bd"} !important;
                    opacity: 1;
                }

                input:-webkit-autofill,
                input:-webkit-autofill:hover, 
                input:-webkit-autofill:focus {
                    -webkit-text-fill-color: ${colors.inputText} !important;
                    -webkit-box-shadow: 0 0 0px 1000px ${colors.inputBg} inset !important;
                    transition: background-color 5000s ease-in-out 0s;
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;