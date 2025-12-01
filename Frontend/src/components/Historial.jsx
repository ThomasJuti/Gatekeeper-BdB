import React, { useState, useEffect } from 'react';
import './Historial.css';

const Historial = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            setCurrentUser(user);
            fetchHistorial(user.id);
        } else {
            setLoading(false);
            setError('No se encontró sesión activa');
        }
    }, []);

    const fetchHistorial = async (userId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/solicitudes/usuario/${userId}/historial`);
            if (!response.ok) {
                throw new Error('Error al obtener el historial');
            }
            const data = await response.json();
            setSolicitudes(data);
        } catch (err) {
            console.error('Error fetching historial:', err);
            setError('Error al cargar el historial de solicitudes');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getStatusColor = (estado) => {
        switch (estado) {
            case 'APROBADA': return '#10b981';
            case 'RECHAZADA': return '#ef4444';
            case 'PENDIENTE': return '#f59e0b';
            case 'CANCELADA': return '#6b7280';
            default: return '#6366f1';
        }
    };

    if (loading) return <div className="content-wrapper">Cargando historial...</div>;
    if (error) return <div className="content-wrapper">Error: {error}</div>;

    return (
        <div className="content-wrapper">
            <div className="page-header">
                <h1 className="page-title">Historial de Solicitudes</h1>
            </div>

            <div className="card">
                <h3>Registro de Actividad</h3>
                <p>Historial de solicitudes donde eres solicitante o responsable.</p>

                <div className="history-list">
                    {solicitudes.length === 0 ? (
                        <p className="history-empty">No hay solicitudes registradas.</p>
                    ) : (
                        solicitudes.map((solicitud) => (
                            <div key={solicitud.id} className="history-item">
                                <div className="history-icon">
                                    {solicitud.tipoSolicitud?.nombre?.charAt(0) || 'S'}
                                </div>
                                <div className="history-content">
                                    <div className="history-title">
                                        {solicitud.titulo} <span className="history-code">({solicitud.codigoSolicitud})</span>
                                    </div>
                                    <div className="history-meta">
                                        {formatDate(solicitud.fechaCreacion)} •
                                        <span className="history-role">
                                            {currentUser && currentUser.id === solicitud.solicitante?.id ? 'Eres Solicitante' : 'Eres Responsable'}
                                        </span>
                                    </div>
                                </div>
                                <div className="history-status" style={{
                                    color: getStatusColor(solicitud.estado),
                                    backgroundColor: `${getStatusColor(solicitud.estado)}20`
                                }}>
                                    {solicitud.estado}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Historial;
