package com.PruebaTecnica.Backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSolicitudRequest {
    private String titulo;
    private String descripcion;
    private String solicitante;
    private String responsable;
    private String tipoSolicitud;
}
