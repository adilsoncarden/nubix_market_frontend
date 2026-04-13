import React from "react";
import logoImage from "../assets/logo.png"; // Asegúrate de que el nombre sea exacto


const Login = () => {
    return (
        <div className="container-fluid p-0" style={{ backgroundColor: "#f0fdf4", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            
            {/* NAVBAR (Tal cual la imagen que enviaste) */}
            <nav style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "15px 40px",
                backgroundColor: "#1a733c", 
                color: "white"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ 
                        backgroundColor: "white", 
                        borderRadius: "50%", 
                        width: "35px", 
                        height: "35px", 
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: "center",
                        overflow: "hidden"
                    }}>
                    <img 
                        src={logoImage} 
                        alt="Logo" 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                    />
                    </div>
                    <span style={{ fontWeight: "600", fontSize: "1.3rem" }}>Nubix Market</span>
                </div>

                <div style={{ flex: 1, maxWidth: "600px", margin: "0 40px" }}>
                    <input 
                        type="text" 
                        placeholder="Buscar productos..." 
                        style={{
                            width: "100%",
                            padding: "10px 20px",
                            borderRadius: "25px",
                            border: "none",
                            outline: "none"
                        }} 
                    />
                </div>

                <div style={{ display: "flex", gap: "25px" }}>
                    <span>Inicio</span>
                    <span>Tienda</span>
                    <span>Login</span>
                </div>
            </nav>

            {/* CONTENIDO CENTRADO (Sin imagen lateral) */}
            <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 20px" }}>
                <div style={{ 
                    backgroundColor: "white", 
                    padding: "40px", 
                    borderRadius: "16px", 
                    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                    width: "100%",
                    maxWidth: "450px"
                }}>
                    {/* Icono del Market arriba */}
                    <div style={{ fontSize: "2.5rem", textAlign: "center", marginBottom: "10px" }}>🛒</div>
                    
                    <h2 className="text-center fw-bold mb-1">Iniciar Sesión</h2>
                    <p className="text-muted text-center mb-4">¡Bienvenido a Nubix Market!</p>
                    
                    <form>
                        <div className="mb-3 text-start">
                            <label className="form-label fw-bold">Correo Electrónico :</label>
                            <input type="email" className="form-control" placeholder="Escribe tu correo" style={{ borderRadius: "8px", padding: "12px" }} />
                        </div>
                        
                        <div className="mb-3 text-start">
                            <label className="form-label fw-bold">Contraseña :</label>
                            <input type="password" className="form-control" placeholder="********" style={{ borderRadius: "8px", padding: "12px" }} />
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="remember" />
                                <label className="form-check-label small" htmlFor="remember">Recordarme</label>
                            </div>
                            <a href="#" className="small text-decoration-none" style={{ color: "#1a733c", fontWeight: "500" }}>¿Olvidaste tu contraseña?</a>
                        </div>

                        <button type="submit" className="btn w-100 fw-bold" style={{ backgroundColor: "#1a733c", color: "white", padding: "12px", borderRadius: "8px" }}>
                            Entrar
                        </button>
                    </form>
                    
                    <div className="text-center mt-4">
                        <p className="small text-muted">o entrar con</p>
                        <div className="d-flex gap-2 mb-4">
                            <button className="btn btn-outline-secondary w-50">Google</button>
                            <button className="btn btn-outline-secondary w-50">Apple</button>
                        </div>
                        <p className="small">
                            ¿No tienes una cuenta? <a href="/register" className="fw-bold text-decoration-none" style={{ color: "#1a733c" }}>Regístrate aquí</a>
                        </p>
                    </div>
                </div>
            </main>

            {/* FOOTER ORIGINAL AL FINAL */}
            <footer style={{ textAlign: "center", padding: "20px", color: "#666", fontSize: "0.85rem", backgroundColor: "white", borderTop: "1px solid #eee" }}>
                © 2026 NUBIX MARKET - Todos los derechos reservados
            </footer>
        </div>
    );
};

export default Login;