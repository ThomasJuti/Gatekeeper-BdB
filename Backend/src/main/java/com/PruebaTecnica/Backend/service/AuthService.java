package com.PruebaTecnica.Backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.PruebaTecnica.Backend.model.dto.AuthResponse;
import com.PruebaTecnica.Backend.model.dto.LoginRequest;
import com.PruebaTecnica.Backend.model.dto.RegisterRequest;
import com.PruebaTecnica.Backend.model.entity.Usuario;
import com.PruebaTecnica.Backend.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validar que las contraseñas coincidan
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Las contraseñas no coinciden");
        }

        // Validar que el username no exista
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("El username ya está en uso");
        }

        // Validar que el email no exista
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("El email ya está registrado");
        }

        // Crear nuevo usuario
        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setEmail(request.getEmail());
        usuario.setNombreCompleto(request.getNombreCompleto());
        // Encriptar contraseña
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(Usuario.Rol.SOLICITANTE); //rol por defecto
        usuario.setActivo(true);

        // Guardar usuario
        Usuario savedUsuario = usuarioRepository.save(usuario);

        return AuthResponse.fromUsuario(savedUsuario, "Usuario registrado exitosamente");
    }

    public AuthResponse login(LoginRequest request) {
        // Buscar usuario por username
        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        // Verificar contraseña 
        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        // Verificar que el usuario esté activo
        if (!usuario.getActivo()) {
            throw new RuntimeException("Usuario inactivo");
        }

        return AuthResponse.fromUsuario(usuario, "Login exitoso");
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public Usuario findByUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
}
