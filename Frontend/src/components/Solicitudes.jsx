import React, { useState } from 'react';
import './Solicitudes.css';

const Solicitudes = () => {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        titulo: '',
        descripcion: '',
        solicitante: '',
        responsable: '',
        tipoSolicitud: 'despliegue'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Nueva solicitud:', formData);
        //Solicitud al backend
        setShowModal(false);
        setFormData({
            titulo: '',
            descripcion: '',
            solicitante: '',
            responsable: '',
            tipoSolicitud: 'despliegue'
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="content-wrapper">
            <div className="page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 className="page-title">Solicitudes</h1>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Nueva Solicitud
                    </button>
                </div>
            </div>

            <div className="card">
                <h3>Nuevas Solicitudes</h3>
                <p>Aquí aparecerán las solicitudes recientes que requieren tu atención.</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}></div>
                    <div style={{ flex: 1, height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}></div>
                    <div style={{ flex: 1, height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}></div>
                </div>
            </div>

            <div className="card">
                <h3>Estado del Sistema</h3>
                <p>Resumen de actividad de las últimas 24 horas.</p>
            </div>

            {/* Formulario de solicitud */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Nueva Solicitud</h2>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label htmlFor="titulo">Título *</label>
                                <input
                                    type="text"
                                    id="titulo"
                                    name="titulo"
                                    value={formData.titulo}
                                    onChange={handleChange}
                                    required
                                    placeholder="Ingrese el título de la solicitud"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="descripcion">Descripción *</label>
                                <textarea
                                    id="descripcion"
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    placeholder="Describa los detalles de la solicitud"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="solicitante">Solicitante (Usuario de Red) *</label>
                                    <input
                                        type="text"
                                        id="solicitante"
                                        name="solicitante"
                                        value={formData.solicitante}
                                        onChange={handleChange}
                                        required
                                        placeholder="usuario@dominio"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="responsable">Responsable (Usuario de Red) *</label>
                                    <input
                                        type="text"
                                        id="responsable"
                                        name="responsable"
                                        value={formData.responsable}
                                        onChange={handleChange}
                                        required
                                        placeholder="responsable@dominio"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="tipoSolicitud">Tipo de Solicitud *</label>
                                <select
                                    id="tipoSolicitud"
                                    name="tipoSolicitud"
                                    value={formData.tipoSolicitud}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="despliegue">Despliegue</option>
                                    <option value="acceso">Acceso</option>
                                    <option value="cambio_tecnico">Cambio Técnico</option>
                                    <option value="soporte">Soporte</option>
                                    <option value="mantenimiento">Mantenimiento</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-primary">
                                    Crear Solicitud
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Solicitudes;
