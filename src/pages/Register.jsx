import React from "react";

// Usamos { alHacerClickVolver } para recibir la función de App.jsx
const Register = ({ alHacerClickVolver }) => {
    return (
        <div className="registro-page-container">
            {/* Lado Izquierdo: Formulario */}
            <div className="registro-form-section">
                <div className="registro-box">
                    {/* Este botón usa la función para regresar al Home */}
                    <button className="btn-volver" onClick={alHacerClickVolver}>
                        ← Volver a la tienda
                    </button>
                    
                    <h2 className="fw-bold mt-3 text-dark">Registrarse</h2>
                    <p className="text-muted">Ingresa tus datos para continuar.</p>
                    
                    <form>
                        <div className="mb-3 text-start">
                            <label className="form-label fw-bold text-dark">Nombre:</label>
                            <input type="text" className="form-control" placeholder="Escribe tu nombre" />
                        </div>
                        <div className="mb-3 text-start">
                            <label className="form-label fw-bold text-dark">Correo:</label>
                            <input type="email" className="form-control" placeholder="Escribe tu correo" />
                        </div>
                        <div className="mb-3 text-start">
                            <label className="form-label fw-bold text-dark">Contraseña:</label>
                            <input type="password" className="form-control" placeholder="Escribe tu contraseña" />
                        </div>
                        <button type="button" className="btn-enviar-registro">
                            Regístrate
                        </button>
                    </form>
                </div>
            </div>

            {/* Lado Derecho: Imagen (Se controla desde App.css) */}
            <div className="registro-image-section">
                {/* El fondo se carga por CSS */}
            </div>
        </div>
    );
};

export default Register;