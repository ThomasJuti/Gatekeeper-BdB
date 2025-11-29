package com.PruebaTecnica.Backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.PruebaTecnica.Backend.model.dto.UserSummaryDTO;
import com.PruebaTecnica.Backend.model.entity.Usuario;
import com.PruebaTecnica.Backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public List<UserSummaryDTO> getAllUsers() {
        return usuarioRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private UserSummaryDTO mapToDTO(Usuario usuario) {
        return new UserSummaryDTO(
            usuario.getId(),
            usuario.getUsername(),
            usuario.getNombreCompleto(),
            usuario.getEmail()
        );
    }
}
