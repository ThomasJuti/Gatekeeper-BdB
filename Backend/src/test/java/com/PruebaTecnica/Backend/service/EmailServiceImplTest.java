package com.PruebaTecnica.Backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

//Pruebas unitarias para EmailServiceImpl
//Estas pruebas validan el comportamiento del servicio de envio de emails
@ExtendWith(MockitoExtension.class)
class EmailServiceImplTest {

    // Mock del componente de envio de emails de Spring
    @Mock
    private JavaMailSender emailSender;

    // Servicio bajo prueba con la dependencia inyectada
    @InjectMocks
    private EmailServiceImpl emailService;

    //Prueba: Enviar notificacion de nueva solicitud exitosamente
    @Test
    void testSendNewRequestNotification_Success() {
        // Preparar datos de prueba
        String to = "test@empresa.com";
        String requestTitle = "Test Request";
        String requestCode = "SOL-2024-001";
        String applicantName = "Juan Pérez";

        // Configurar el mock para simular envio exitoso
        doNothing().when(emailSender).send(any(SimpleMailMessage.class));

        // Ejecutar el envio de notificacion
        emailService.sendNewRequestNotification(to, requestTitle, requestCode, applicantName);

        // Verificar que se intento enviar el email
        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }

    //Prueba: Manejo de excepciones al enviar email
    @Test
    void testSendNewRequestNotification_HandlesException() {
        // Preparar datos de prueba
        String to = "test@empresa.com";
        String requestTitle = "Test Request";
        String requestCode = "SOL-2024-001";
        String applicantName = "Juan Pérez";

        // Configurar el mock para simular un error en el servidor de correo
        doThrow(new RuntimeException("Mail server error"))
            .when(emailSender).send(any(SimpleMailMessage.class));

        // Ejecutar el envio (no deberia lanzar excepcion)
        emailService.sendNewRequestNotification(to, requestTitle, requestCode, applicantName);

        // Verificar que se intento enviar el email
        // Aunque fallo, el metodo debe completarse sin lanzar excepcion
        verify(emailSender, times(1)).send(any(SimpleMailMessage.class));
    }
}
