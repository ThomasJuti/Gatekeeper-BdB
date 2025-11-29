package com.PruebaTecnica.Backend.service;

import java.util.List;

import com.PruebaTecnica.Backend.model.dto.UserSummaryDTO;

public interface UsuarioService {
    List<UserSummaryDTO> getAllUsers();
}
