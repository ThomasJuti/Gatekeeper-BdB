package com.PruebaTecnica.Backend.model.dto;

import com.PruebaTecnica.Backend.model.entity.Usuario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private Long id;
    private String username;
    private String email;
    private String nombreCompleto;
    private Usuario.Rol rol;
    private String message;

    public static AuthResponse fromUsuario(Usuario usuario, String message) {
        return AuthResponse.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .nombreCompleto(usuario.getNombreCompleto())
                .rol(usuario.getRol())
                .message(message)
                .build();
    }
}
