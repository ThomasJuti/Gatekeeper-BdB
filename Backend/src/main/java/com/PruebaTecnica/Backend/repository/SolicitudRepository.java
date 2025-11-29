package com.PruebaTecnica.Backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.PruebaTecnica.Backend.model.entity.Solicitud;

@Repository
public interface SolicitudRepository extends JpaRepository<Solicitud, Long> {
}
