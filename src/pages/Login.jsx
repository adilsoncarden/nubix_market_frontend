import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                    {/* El carrito de vuelta */}
                    <div className="mb-3">
                        <span style={{ fontSize: '45px' }}>🛒</span>
                    </div>
                    {/* Título limpio sin el texto de abajo */}
                    <h2 className="fw-bold">Iniciar Sesion</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">Correo Electronico</label>
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
                                Recuerdame
                            </label>
                        </div>
                        <a href="#" className="login-link small">Recuerdas tu contraseña?</a>
                    </div>

                    <button type="submit" className="btn-login w-100 mb-3">
                        Sign in
                    </button>

                    <div className="text-center mt-3">
                        <p className="text-muted small">
                            ¿No tienes una cuenta?{' '}
                            <Link to="/register" className="login-link fw-bold">
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