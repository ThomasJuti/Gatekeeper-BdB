import React from 'react';
import './Historial.css';

const Historial = () => {
    return (
        <div className="content-wrapper">
            <div className="page-header">
                <h1 className="page-title">Historial</h1>
            </div>

            <div className="card">
                <h3>Registro de Actividad</h3>
                <p>Consulta el historial completo de transacciones y eventos.</p>

                <div style={{ marginTop: '1.5rem' }}>
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '1rem',
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            marginBottom: '0.5rem'
                        }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.2)', marginRight: '1rem' }}></div>
                            <div>
                                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>Evento #{item}023</div>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Hace {item} horas</div>
                            </div>
                            <div style={{ marginLeft: 'auto', color: '#10b981' }}>Completado</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Historial;
