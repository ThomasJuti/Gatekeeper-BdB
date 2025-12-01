package com.PruebaTecnica.Backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender emailSender;

    @Override
    public void sendNewRequestNotification(String to, String requestTitle, String requestCode, String applicantName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@gatekeeper.com");
            message.setTo(to);
            message.setSubject("Nueva Solicitud Pendiente de Aprobación: " + requestCode);
            message.setText("Hola,\n\n" +
                    "Se te ha asignado una nueva solicitud para revisión.\n\n" +
                    "Código: " + requestCode + "\n" +
                    "Título: " + requestTitle + "\n" +
                    "Solicitante: " + applicantName + "\n\n" +
                    "Por favor, ingresa a la plataforma para aprobar o rechazar esta solicitud.\n\n" +
                    "Saludos,\n" +
                    "Equipo Gatekeeper");

            emailSender.send(message);
            System.out.println("Correo enviado exitosamente a: " + to);
        } catch (Exception e) {
            System.err.println("Error al enviar correo: " + e.getMessage());
        }
    }
}
