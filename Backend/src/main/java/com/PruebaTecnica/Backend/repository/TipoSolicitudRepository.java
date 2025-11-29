package com.PruebaTecnica.Backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.PruebaTecnica.Backend.model.entity.TipoSolicitud;

@Repository
public interface TipoSolicitudRepository extends JpaRepository<TipoSolicitud, Long> {
    Optional<TipoSolicitud> findByNombreIgnoreCase(String nombre);
}
