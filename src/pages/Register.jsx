import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    
    // Estado para controlar el efecto de parpadeo/hover
    const [isHovered, setIsHovered] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos de registro:', formData);
        navigate('/login');
    };

    return (
        <div className="login-page-container">
            <div className="login-card shadow">
                <div className="text-center mb-4">
                    <div className="mb-3">
                        <span style={{ fontSize: '45px', color: '#1a733c' }}>
                            <i className="bi bi-person-plus-fill"></i>
                        </span>
                    </div>
                    <h2 className="fw-bold">Crear Cuenta</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">Nombre Completo</label>
                        <input type="text" className="form-control" placeholder="Tu nombre" required />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">Correo Electrónico</label>
                        <input type="email" className="form-control" placeholder="Email address" required />
                    </div>
                    
                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">Contraseña</label>
                        <input type="password" className="form-control" placeholder="Password" required />
                    </div>

                    {/* BOTÓN CON EFECTO DE PARPADEO AL PASAR EL CURSOR */}
                    <button 
                        type="submit" 
                        className="btn w-100 mb-3 fw-bold"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{ 
                            backgroundColor: '#1a733c', 
                            color: 'white', 
                            border: 'none',
                            padding: '10px',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease', // Suaviza el parpadeo
                            opacity: isHovered ? '0.8' : '1', // Aquí ocurre el "parpadeo"
                            transform: isHovered ? 'scale(1.02)' : 'scale(1)' // Un pequeño pulso
                        }}
                    >
                        Registrarse
                    </button>

                    <div className="text-center mt-3">
                        <p className="text-muted small">
                            ¿Ya tienes una cuenta?{' '}
                            <Link 
                                to="/login" 
                                className="fw-bold text-decoration-none"
                                style={{ color: '#1a733c' }}
                            >
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;