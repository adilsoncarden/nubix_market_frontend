import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Datos de registro:', formData);
        // Aquí podrías enviar los datos a tu backend
        navigate('/login'); // Una vez registrado, lo mandamos al login
    };

    return (
        <div className="login-page-container">
            <div className="login-card shadow">
                <div className="text-center mb-4">
                    <div className="mb-3">
                        <span style={{ fontSize: '45px' }}>🛒</span>
                    </div>
                    <h2 className="fw-bold">Crear Cuenta</h2>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">Nombre Completo</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="Tu nombre"
                            required
                        />
                    </div>

                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">Correo Electrónico</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            placeholder="Email address"
                            required
                        />
                    </div>
                    
                    <div className="mb-3 text-start">
                        <label className="form-label small fw-bold text-muted">Contraseña</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            placeholder="Password"
                            required
                        />
                    </div>

                    <button type="submit" className="btn-login w-100 mb-3">
                        Registrarse
                    </button>

                    <div className="text-center mt-3">
                        <p className="text-muted small">
                            ¿Ya tienes una cuenta?{' '}
                            <Link to="/login" className="login-link fw-bold">
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