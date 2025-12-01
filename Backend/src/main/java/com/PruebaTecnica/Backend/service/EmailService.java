package com.PruebaTecnica.Backend.service;

public interface EmailService {
    void sendNewRequestNotification(String to, String requestTitle, String requestCode, String applicantName);
}
