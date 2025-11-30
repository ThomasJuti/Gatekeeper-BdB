package com.PruebaTecnica.Backend.service;

import java.util.List;

import com.PruebaTecnica.Backend.model.dto.CreateSolicitudRequest;
import com.PruebaTecnica.Backend.model.entity.Solicitud;

public interface SolicitudService {
    Solicitud createSolicitud(CreateSolicitudRequest request);
    
    // Obtener solicitudes donde el usuario es solicitante
    List<Solicitud> getSolicitudesBySolicitante(Long usuarioId);
    
    // Obtener solicitudes donde el usuario es responsable
    List<Solicitud> getSolicitudesByResponsable(Long usuarioId);
    
    // Obtener todas las solicitudes de el usuario
    List<Solicitud> getSolicitudesByUsuario(Long usuarioId);
    
    // Aprobar solicitud
    Solicitud aprobarSolicitud(Long solicitudId, String comentario);
    
    // Rechazar solicitud
    Solicitud rechazarSolicitud(Long solicitudId, String comentario);
    
    // Obtener solicitudes pendientes
    List<Solicitud> getSolicitudesPendientesByUsuario(Long usuarioId);

    // Obtener historial de solicitudes (Aprobadas/Rechazadas)
    List<Solicitud> getHistorialSolicitudesByUsuario(Long usuarioId);

    Solicitud getSolicitudById(Long solicitudId);
}
