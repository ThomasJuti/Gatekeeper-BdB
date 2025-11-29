import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); 

        if (!formData.username || !formData.password) {
            setError('Por favor, complete todos los campos');
            return;
        }
        //try login backend
        try {
            const response = await fetch('http://localhost:8081/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            console.log('Login successful:', data);

            if (onLogin) {
                onLogin(data);
            }
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <div className="login-container">
            <div className="login-background">
                <div className="login-shape shape-1"></div>
                <div className="login-shape shape-2"></div>
                <div className="login-shape shape-3"></div>
            </div>

            <div className="login-card">
                <div className="login-header">
                    <div className="login-logo">
                        <div className="logo-icon-large">W</div>
                    </div>
                    <h1 className="login-title">Bienvenido</h1>
                    <p className="login-subtitle">Ingresa tus credenciales para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="login-error">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            {error}
                        </div>
                    )}

                    <div className="form-field">
                        <label htmlFor="username">Usuario</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Ingrese su usuario"
                                autoComplete="username"
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="password">Contraseña</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Ingrese su contraseña"
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="checkbox-label">
                            <input type="checkbox" />
                            <span>Recordarme</span>
                        </label>
                        <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
                    </div>

                    <button type="submit" className="login-button">
                        Iniciar Sesión
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </form>
                <div className="login-footer">
                    <p>¿No tienes una cuenta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>Regístrate aquí</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
