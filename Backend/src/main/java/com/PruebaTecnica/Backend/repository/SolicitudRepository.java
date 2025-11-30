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
    
    // Solicitudes donde el usuario es solicitante o responsable
    List<Solicitud> findBySolicitanteOrResponsable(Usuario solicitante, Usuario responsable);
}
