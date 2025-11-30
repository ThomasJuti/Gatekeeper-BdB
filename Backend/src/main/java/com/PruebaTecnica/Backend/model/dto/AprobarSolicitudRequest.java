package com.PruebaTecnica.Backend.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AprobarSolicitudRequest {
    
    @NotBlank(message = "El comentario es requerido")
    private String comentario;
}
