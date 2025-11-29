import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = ({ onRegister }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
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

        // Validación básica
        if (!formData.fullName || !formData.email || !formData.username || !formData.password || !formData.confirmPassword) {
            setError('Por favor, complete todos los campos');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        try {
            const response = await fetch('http://localhost:8081/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    nombreCompleto: formData.fullName,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al registrarse');
            }

            console.log('Register successful:', data);

            //redirigir login
            if (onRegister) {
                onRegister(data);
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
                    <h1 className="login-title">Crear Cuenta</h1>
                    <p className="login-subtitle">Completa el formulario para registrarte</p>
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
                        <label htmlFor="fullName">Nombre Completo</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Ingrese su nombre completo"
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="email">Correo Electrónico</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                                <polyline points="22,6 12,13 2,6"></polyline>
                            </svg>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="username">Usuario</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <polyline points="17 11 19 13 23 9"></polyline>
                            </svg>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Elija un nombre de usuario"
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
                                placeholder="Mínimo 6 caracteres"
                            />
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                            </svg>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repita su contraseña"
                            />
                        </div>
                    </div>

                    <button type="submit" className="login-button">
                        Crear Cuenta
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="8.5" cy="7" r="4"></circle>
                            <line x1="20" y1="8" x2="20" y2="14"></line>
                            <line x1="23" y1="11" x2="17" y2="11"></line>
                        </svg>
                    </button>
                </form>

                <div className="divider">
                    <span>O regístrate con</span>
                </div>

                <div className="social-buttons">
                    <button className="social-btn google-btn" onClick={() => handleSocialRegister('Google')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google
                    </button>

                    <button className="social-btn outlook-btn" onClick={() => handleSocialRegister('Outlook')}>
                        <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.86t.1-.87q.1-.43.34-.76.22-.34.59-.54.36-.2.87-.20t.86.2q.35.21.57.55.22.34.31.77.1.43.1.88zM24 12v9.38q0 .46-.33.8-.33.32-.8.32H7.13q-.46 0-.8-.33-.32-.33-.32-.8V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h6.5V2.59q0-.48.33-.8.33-.34.8-.34H23.2q.45 0 .8.33.32.33.32.8V12zM7.13 14.84V18H6q-.41 0-.7-.3-.3-.29-.3-.7v-2.15q.48.06.96.06.5 0 1.17-.07zm5.12-2.96q.48 0 .84.33.37.33.37.8v5.53H11.7v-5.16q0-.17-.1-.3-.1-.14-.28-.14H9.66v5.6H8.13v-5.6h-.91v-1.06h.91v-.58q0-.41.3-.7.3-.3.71-.3h1.52v1.07H9.35v.51h2.9zm-6.95 4.7q.7 0 1.21-.18.5-.18.85-.5.35-.31.53-.74.18-.43.18-.95 0-.53-.19-.95-.18-.43-.52-.75-.35-.32-.85-.5-.5-.17-1.21-.17H3.07v5.74h2.23zm8.48-6.5h-3.3v1.06h3.3V10.08z" fill="#0078D4" />
                        </svg>
                        Outlook
                    </button>
                </div>

                <div className="login-footer">
                    <p>¿Ya tienes una cuenta? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Inicia sesión aquí</a></p>
                </div>
            </div>
        </div>
    );
};

export default Register;
