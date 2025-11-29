package com.PruebaTecnica.Backend.service;

import com.PruebaTecnica.Backend.model.dto.CreateSolicitudRequest;
import com.PruebaTecnica.Backend.model.entity.Solicitud;

public interface SolicitudService {
    Solicitud createSolicitud(CreateSolicitudRequest request);
}
