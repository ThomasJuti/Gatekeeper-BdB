package com.PruebaTecnica.Backend.service;

import com.PruebaTecnica.Backend.model.dto.CreateSolicitudRequest;
import com.PruebaTecnica.Backend.model.entity.Solicitud;
import com.PruebaTecnica.Backend.model.entity.TipoSolicitud;
import com.PruebaTecnica.Backend.model.entity.Usuario;
import com.PruebaTecnica.Backend.repository.SolicitudRepository;
import com.PruebaTecnica.Backend.repository.TipoSolicitudRepository;
import com.PruebaTecnica.Backend.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SolicitudServiceImplTest {

    // Mocks de las dependencias del servicio
    @Mock
    private SolicitudRepository solicitudRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private TipoSolicitudRepository tipoSolicitudRepository;

    @Mock
    private EmailService emailService;

    // Servicio bajo prueba con las dependencias inyectadas
    @InjectMocks
    private SolicitudServiceImpl solicitudService;

    // Datos de prueba reutilizables
    private Usuario solicitante;
    private Usuario responsable;
    private TipoSolicitud tipoSolicitud;
    private CreateSolicitudRequest request;

    //Configuración inicial que se ejecuta antes de cada prueba

    @BeforeEach
    void setUp() {
        // Configurar usuario solicitante
        solicitante = new Usuario();
        solicitante.setId(1L);
        solicitante.setUsername("jperez");
        solicitante.setNombreCompleto("Juan Pérez");
        solicitante.setEmail("juan.perez@empresa.com");

        // Configurar usuario responsable    (aprobador)
        responsable = new Usuario();
        responsable.setId(2L);
        responsable.setUsername("mgarcia");
        responsable.setNombreCompleto("María García");
        responsable.setEmail("maria.garcia@empresa.com");

        // Configurar tipo de solicitud
        tipoSolicitud = new TipoSolicitud();
        tipoSolicitud.setId(1L);
        tipoSolicitud.setNombre("DESPLIEGUE");
        tipoSolicitud.setDescripcion("Solicitud de despliegue");

        // Configurar request de creacion de solicitud
        request = new CreateSolicitudRequest();
        request.setTitulo("Test Solicitud");
        request.setDescripcion("Descripción de prueba");
        request.setSolicitante("jperez");
        request.setResponsable("mgarcia");
        request.setTipoSolicitud("DESPLIEGUE");
    }

     //Prueba: Crear solicitud exitosamente
    @Test
    void testCreateSolicitud_Success() {
        when(usuarioRepository.findByUsername("jperez")).thenReturn(Optional.of(solicitante));
        when(usuarioRepository.findByUsername("mgarcia")).thenReturn(Optional.of(responsable));
        when(tipoSolicitudRepository.findByNombreIgnoreCase("DESPLIEGUE")).thenReturn(Optional.of(tipoSolicitud));
        
        Solicitud savedSolicitud = new Solicitud();
        savedSolicitud.setId(1L);
        savedSolicitud.setTitulo(request.getTitulo());
        savedSolicitud.setCodigoSolicitud("SOL-2024-001");
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(savedSolicitud);

        // Ejecutar el metodo bajo prueba
        Solicitud result = solicitudService.createSolicitud(request);

        // Verificar los resultados
        assertNotNull(result, "La solicitud creada no debe ser null");
        assertEquals("Test Solicitud", result.getTitulo(), "El titulo debe coincidir");
        assertNotNull(result.getCodigoSolicitud(), "Debe generarse un codigo de solicitud");
        
        // Verificar que se llamo al servicio de email con los parametros correctos
        verify(emailService, times(1)).sendNewRequestNotification(
            eq("maria.garcia@empresa.com"),
            eq("Test Solicitud"),
            anyString(),
            eq("Juan Pérez")
        );
    }

    //Prueba: Error cuando el solicitante no existe
    @Test
    void testCreateSolicitud_SolicitanteNotFound() {
        // Simular que el usuario no existe
        when(usuarioRepository.findByUsername("jperez")).thenReturn(Optional.empty());

        //Verificar que se lanza la excepción esperada
        assertThrows(RuntimeException.class, () -> {
            solicitudService.createSolicitud(request);
        }, "Debe lanzar RuntimeException cuando el solicitante no existe");
    }

    //Prueba: Aprobar solicitud exitosamente
    @Test
    void testAprobarSolicitud_Success() {
        // Preparar una solicitud pendiente
        Solicitud solicitud = new Solicitud();
        solicitud.setId(1L);
        solicitud.setEstado(Solicitud.Estado.PENDIENTE);
        
        when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitud));
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        // Aprobar la solicitud
        Solicitud result = solicitudService.aprobarSolicitud(1L, "Aprobado por prueba");

        // Verificar que se aprobo correctamente
        assertNotNull(result, "El resultado no debe ser null");
        assertEquals(Solicitud.Estado.APROBADA, result.getEstado(), "El estado debe ser APROBADA");
        assertEquals("Aprobado por prueba", result.getComentarioAprobador(), "El comentario debe guardarse");
        assertNotNull(result.getFechaRespuesta(), "Debe registrarse la fecha de respuesta");
    }

    //Prueba: Rechazar solicitud exitosamente   
    @Test
    void testRechazarSolicitud_Success() {
        // Preparar una solicitud pendiente
        Solicitud solicitud = new Solicitud();
        solicitud.setId(1L);
        solicitud.setEstado(Solicitud.Estado.PENDIENTE);
        
        when(solicitudRepository.findById(1L)).thenReturn(Optional.of(solicitud));
        when(solicitudRepository.save(any(Solicitud.class))).thenReturn(solicitud);

        // Rechazar la solicitud
        Solicitud result = solicitudService.rechazarSolicitud(1L, "Rechazado por prueba");

        // Verificar que se rechazo correctamente
        assertNotNull(result, "El resultado no debe ser null");
        assertEquals(Solicitud.Estado.RECHAZADA, result.getEstado(), "El estado debe ser RECHAZADA");
        assertEquals("Rechazado por prueba", result.getComentarioAprobador(), "El comentario debe guardarse");
        assertNotNull(result.getFechaRespuesta(), "Debe registrarse la fecha de respuesta");
    }

    //Prueba: Error al buscar solicitud inexistente
    @Test
    void testGetSolicitudById_NotFound() {
        // Simular que la solicitud no existe
        when(solicitudRepository.findById(999L)).thenReturn(Optional.empty());

        // Verificar que se lanza la excepción esperada
        assertThrows(RuntimeException.class, () -> {
            solicitudService.getSolicitudById(999L);
        }, "Debe lanzar RuntimeException cuando la solicitud no existe");
    }
}
