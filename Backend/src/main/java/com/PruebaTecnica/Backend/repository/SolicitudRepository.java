package com.PruebaTecnica.Backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.PruebaTecnica.Backend.model.entity.Solicitud;
import com.PruebaTecnica.Backend.model.entity.Usuario;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
    
    // Solicitudes donde el usuario es el solicitante
    List<Solicitud> findBySolicitante(Usuario solicitante);
    
    // Solicitudes donde el usuario es el responsable
    List<Solicitud> findByResponsable(Usuario responsable);
    
    // Solicitudes donde el usuario es solicitante o responsable, ordenadas por fecha
    List<Solicitud> findBySolicitanteOrResponsableOrderByFechaCreacionDesc(Usuario solicitante, Usuario responsable);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM Solicitud s WHERE (s.solicitante = :usuario OR s.responsable = :usuario) AND s.estado = :estado ORDER BY s.fechaCreacion DESC")
    List<Solicitud> findPendingRequests(@org.springframework.data.repository.query.Param("usuario") Usuario usuario, @org.springframework.data.repository.query.Param("estado") Solicitud.Estado estado);

    @org.springframework.data.jpa.repository.Query("SELECT s FROM Solicitud s WHERE (s.solicitante = :usuario OR s.responsable = :usuario) AND s.estado IN :estados ORDER BY s.fechaCreacion DESC")
    List<Solicitud> findHistoryRequests(@org.springframework.data.repository.query.Param("usuario") Usuario usuario, @org.springframework.data.repository.query.Param("estados") List<Solicitud.Estado> estados);
}
