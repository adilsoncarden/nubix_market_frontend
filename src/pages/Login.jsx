import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Estado para el efecto de parpadeo del botón
    const [isHovered, setIsHovered] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Iniciando sesión con:', { email, password });
        navigate('/');
    };

    return (
        <div className="login-page-container">
            <div className="login-card shadow">
                <div className="text-center mb-4">
                    <div className="mb-3">
                        {/* Icono de candado con el color verde oficial */}
                        <span style={{ fontSize: '45px', color: '#1a733c' }}>
                            <i className="bi bi-shield-lock-fill"></i>
                        </span>
                    </div>
                    <h2 className="fw-bold">Iniciar Sesión</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">Correo Electrónico</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div className="form-check">
                            <input className="form-check-input" type="checkbox" id="remember" />
                            <label className="form-check-label small text-muted" htmlFor="remember">
                                Recuérdame
                            </label>
                        </div>
                        {/* Color verde para el link de olvidar contraseña */}
                        <a href="#" className="small text-decoration-none fw-bold" style={{ color: '#1a733c' }}>
                            ¿Olvidaste tu contraseña?
                        </a>
                    </div>

                    {/* BOTÓN CON EFECTO DE PARPADEO (HOVER) */}
                    <button 
                        type="submit" 
                        className="btn w-100 mb-3 fw-bold"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        style={{ 
                            backgroundColor: '#1a733c', 
                            color: 'white', 
                            border: 'none',
                            padding: '12px',
                            borderRadius: '8px',
                            transition: 'all 0.2s ease', 
                            opacity: isHovered ? '0.85' : '1', 
                            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                            cursor: 'pointer'
                        }}
                    >
                        Ingresar
                    </button>

                    <div className="text-center mt-3">
                        <p className="text-muted small">
                            ¿No tienes una cuenta?{' '}
                            {/* Color verde para el link de registro */}
                            <Link 
                                to="/register" 
                                className="fw-bold text-decoration-none"
                                style={{ color: '#1a733c' }}
                            >
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;