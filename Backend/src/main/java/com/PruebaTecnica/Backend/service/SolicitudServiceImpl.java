package com.PruebaTecnica.Backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.PruebaTecnica.Backend.model.dto.CreateSolicitudRequest;
import com.PruebaTecnica.Backend.model.entity.Solicitud;
import com.PruebaTecnica.Backend.model.entity.TipoSolicitud;
import com.PruebaTecnica.Backend.model.entity.Usuario;
import com.PruebaTecnica.Backend.repository.SolicitudRepository;
import com.PruebaTecnica.Backend.repository.TipoSolicitudRepository;
import com.PruebaTecnica.Backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SolicitudServiceImpl implements SolicitudService {

    private final SolicitudRepository solicitudRepository;
    private final UsuarioRepository usuarioRepository;
    private final TipoSolicitudRepository tipoSolicitudRepository;

    @Override
    @Transactional
    public Solicitud createSolicitud(CreateSolicitudRequest request) {
        // Buscar usuarios
        Usuario solicitante = usuarioRepository.findByUsername(request.getSolicitante())
                .orElseThrow(() -> new RuntimeException("Solicitante no encontrado"));

        Usuario responsable = usuarioRepository.findByUsername(request.getResponsable())
                .orElseThrow(() -> new RuntimeException("Responsable no encontrado"));

        // Buscar tipo de solicitud 
        String tipoNombre = request.getTipoSolicitud() != null ? request.getTipoSolicitud().toUpperCase(Locale.ROOT) : "OTRO";
        
        // Mapeo nombre de solicitud
        String mappedTipo = switch (tipoNombre) {
            case "DESPLIEGUE" -> "DESPLIEGUE";
            case "ACCESO" -> "ACCESO";
            case "CAMBIO_TECNICO", "CAMBIO_PIPELINE" -> "CAMBIO_PIPELINE";
            case "INCORPORACION_TECNICA" -> "INCORPORACION_TECNICA";
            case "CAMBIO_CONFIGURACION" -> "CAMBIO_CONFIGURACION";
            default -> "OTRO";
        };

        TipoSolicitud tipo = tipoSolicitudRepository.findByNombreIgnoreCase(mappedTipo)
                .orElseThrow(() -> new RuntimeException("Tipo de solicitud no encontrado: " + mappedTipo));

        Solicitud s = new Solicitud();
        s.setTitulo(request.getTitulo());
        s.setDescripcion(request.getDescripcion());
        s.setSolicitante(solicitante);
        s.setResponsable(responsable);
        s.setTipoSolicitud(tipo);

        // Generar codigo 
        String codigo = String.format("SOL-%d-%d", LocalDate.now().getYear(), System.currentTimeMillis() % 1000000);
        s.setCodigoSolicitud(codigo);

        // prioridades y estado por defecto ya vienen en la entidad

        Solicitud saved = solicitudRepository.save(s);

        return saved;
    }

    @Override
    public List<Solicitud> getSolicitudesBySolicitante(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return solicitudRepository.findBySolicitante(usuario);
    }

    @Override
    public List<Solicitud> getSolicitudesByResponsable(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return solicitudRepository.findByResponsable(usuario);
    }

    @Override
    public List<Solicitud> getSolicitudesByUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return solicitudRepository.findBySolicitanteOrResponsable(usuario, usuario);
    }

    @Override
    @Transactional
    public Solicitud aprobarSolicitud(Long solicitudId, String comentario) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        solicitud.setEstado(Solicitud.Estado.APROBADA);
        solicitud.setComentarioAprobador(comentario);
        solicitud.setFechaRespuesta(LocalDateTime.now());
        
        return solicitudRepository.save(solicitud);
    }

    @Override
    @Transactional
    public Solicitud rechazarSolicitud(Long solicitudId, String comentario) {
        Solicitud solicitud = solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        
        solicitud.setEstado(Solicitud.Estado.RECHAZADA);
        solicitud.setComentarioAprobador(comentario);
        solicitud.setFechaRespuesta(LocalDateTime.now());
        
        return solicitudRepository.save(solicitud);
    }

    @Override
    public Solicitud getSolicitudById(Long solicitudId) {
        return solicitudRepository.findById(solicitudId)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
    }
}
