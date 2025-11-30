package com.PruebaTecnica.Backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.PruebaTecnica.Backend.model.dto.AprobarSolicitudRequest;
import com.PruebaTecnica.Backend.model.dto.CreateSolicitudRequest;
import com.PruebaTecnica.Backend.model.entity.Solicitud;
import com.PruebaTecnica.Backend.service.SolicitudService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/solicitudes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SolicitudController {

    private final SolicitudService solicitudService;

    @PostMapping
    public ResponseEntity<?> createSolicitud(@Valid @RequestBody CreateSolicitudRequest request) {
        try {
            Solicitud created = solicitudService.createSolicitud(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    // Obtener solicitud por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getSolicitudById(@PathVariable Long id) {
        try {
            Solicitud solicitud = solicitudService.getSolicitudById(id);
            return ResponseEntity.ok(solicitud);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    // Obtener solicitudes donde el usuario es el solicitante
    @GetMapping("/solicitante/{usuarioId}")
    public ResponseEntity<List<Solicitud>> getSolicitudesBySolicitante(@PathVariable Long usuarioId) {
        List<Solicitud> solicitudes = solicitudService.getSolicitudesBySolicitante(usuarioId);
        return ResponseEntity.ok(solicitudes);
    }

    // Obtener solicitudes donde el usuario es el responsable
    @GetMapping("/responsable/{usuarioId}")
    public ResponseEntity<List<Solicitud>> getSolicitudesByResponsable(@PathVariable Long usuarioId) {
        List<Solicitud> solicitudes = solicitudService.getSolicitudesByResponsable(usuarioId);
        return ResponseEntity.ok(solicitudes);
    }

    // Obtener todas las solicitudes relacionadas con el usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Solicitud>> getSolicitudesByUsuario(@PathVariable Long usuarioId) {
        List<Solicitud> solicitudes = solicitudService.getSolicitudesByUsuario(usuarioId);
        return ResponseEntity.ok(solicitudes);
    }

    // Obtener solicitudes pendientes
    @GetMapping("/usuario/{usuarioId}/pendientes")
    public ResponseEntity<List<Solicitud>> getSolicitudesPendientesByUsuario(@PathVariable Long usuarioId) {
        List<Solicitud> solicitudes = solicitudService.getSolicitudesPendientesByUsuario(usuarioId);
        return ResponseEntity.ok(solicitudes);
    }

    // Obtener historial de solicitudes
    @GetMapping("/usuario/{usuarioId}/historial")
    public ResponseEntity<List<Solicitud>> getHistorialSolicitudesByUsuario(@PathVariable Long usuarioId) {
        List<Solicitud> solicitudes = solicitudService.getHistorialSolicitudesByUsuario(usuarioId);
        return ResponseEntity.ok(solicitudes);
    }

    // Aprobar solicitud
    @PutMapping("/{id}/aprobar")
    public ResponseEntity<?> aprobarSolicitud(
            @PathVariable Long id,
            @Valid @RequestBody AprobarSolicitudRequest request) {
        try {
            Solicitud solicitud = solicitudService.aprobarSolicitud(id, request.getComentario());
            return ResponseEntity.ok(solicitud);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }

    // Rechazar solicitud
    @PutMapping("/{id}/rechazar")
    public ResponseEntity<?> rechazarSolicitud(
            @PathVariable Long id,
            @Valid @RequestBody AprobarSolicitudRequest request) {
        try {
            Solicitud solicitud = solicitudService.rechazarSolicitud(id, request.getComentario());
            return ResponseEntity.ok(solicitud);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
        }
    }
}
