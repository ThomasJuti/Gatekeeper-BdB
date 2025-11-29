
CREATE DATABASE IF NOT EXISTS prueba_tecnica 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE prueba_tecnica;

CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE COMMENT 'Usuario de red',
    email VARCHAR(150) NOT NULL UNIQUE,
    nombre_completo VARCHAR(200) NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('SOLICITANTE', 'APROBADOR', 'ADMIN') DEFAULT 'SOLICITANTE',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE tipo_solicitud (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#003366' COMMENT 'Color hexadecimal para UI',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE solicitudes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_solicitud VARCHAR(50) NOT NULL UNIQUE COMMENT 'ID único generado (ej: SOL-2024-001)',
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    

    solicitante_id BIGINT NOT NULL,
    responsable_id BIGINT NOT NULL,
    tipo_solicitud_id BIGINT NOT NULL,
    

    estado ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA') DEFAULT 'PENDIENTE',
    prioridad ENUM('BAJA', 'MEDIA', 'ALTA', 'URGENTE') DEFAULT 'MEDIA',
    
    -- Fechas
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP NULL,
    
    -- Comentarios
    comentario_aprobador TEXT NULL,
    
    -- Notificaciones
    notificacion_enviada BOOLEAN DEFAULT FALSE,
    fecha_notificacion TIMESTAMP NULL,
    
    -- Claves foráneas
    FOREIGN KEY (solicitante_id) REFERENCES usuarios(id),
    FOREIGN KEY (responsable_id) REFERENCES usuarios(id),
    FOREIGN KEY (tipo_solicitud_id) REFERENCES tipo_solicitud(id),
    
    -- Índices para búsquedas rápidas
    INDEX idx_codigo (codigo_solicitud),
    INDEX idx_estado (estado),
    INDEX idx_solicitante (solicitante_id),
    INDEX idx_responsable (responsable_id),
    INDEX idx_tipo (tipo_solicitud_id),
    INDEX idx_fecha_creacion (fecha_creacion),
    INDEX idx_prioridad (prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE historial_cambios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    solicitud_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL,
    
    -- Cambio realizado
    accion ENUM('CREACION', 'APROBACION', 'RECHAZO', 'MODIFICACION', 'CANCELACION', 'COMENTARIO') NOT NULL,
    estado_anterior ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA') NULL,
    estado_nuevo ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA') NULL,
    
    -- Detalles
    comentario TEXT NULL,
    detalles_cambio JSON NULL COMMENT 'Información adicional en formato JSON',
    
    -- Metadata
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45) NULL,
    
    -- Claves foráneas
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    
    -- Índices
    INDEX idx_solicitud (solicitud_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha_cambio),
    INDEX idx_accion (accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notificaciones (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    solicitud_id BIGINT NOT NULL,
    
    tipo ENUM('NUEVA_SOLICITUD', 'APROBADA', 'RECHAZADA', 'COMENTARIO', 'MENCION') NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    
    leida BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_lectura TIMESTAMP NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (solicitud_id) REFERENCES solicitudes(id) ON DELETE CASCADE,
    
    INDEX idx_usuario_leida (usuario_id, leida),
    INDEX idx_fecha (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;



-- Insertar tipos de solicitud
INSERT INTO tipo_solicitud (nombre, descripcion, color) VALUES
('DESPLIEGUE', 'Aprobación para publicar una nueva versión de un microservicio', '#4CAF50'),
('ACCESO', 'Autorización de accesos a herramientas internas', '#2196F3'),
('CAMBIO_PIPELINE', 'Revisión y aprobación de cambios en pipelines o CI/CD', '#FF9800'),
('INCORPORACION_TECNICA', 'Aprobación de nueva incorporación técnica al catálogo', '#9C27B0'),
('CAMBIO_CONFIGURACION', 'Cambios en configuraciones de sistemas', '#F44336'),
('OTRO', 'Otros tipos de solicitudes', '#607D8B');

-- Insertar usuarios de prueba

INSERT INTO usuarios (username, email, nombre_completo, password, rol) VALUES
('admin', 'admin@empresa.com', 'Administrador del Sistema', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN'),
('jperez', 'juan.perez@empresa.com', 'Juan Pérez', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'APROBADOR'),
('mgarcia', 'maria.garcia@empresa.com', 'María García', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'APROBADOR'),
('clopez', 'carlos.lopez@empresa.com', 'Carlos López', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SOLICITANTE'),
('aruiz', 'ana.ruiz@empresa.com', 'Ana Ruiz', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SOLICITANTE'),
('lmartinez', 'luis.martinez@empresa.com', 'Luis Martínez', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'SOLICITANTE');

-- Insertar solicitudes de prueba
INSERT INTO solicitudes (codigo_solicitud, titulo, descripcion, solicitante_id, responsable_id, tipo_solicitud_id, estado, prioridad) VALUES
('SOL-2024-001', 'Despliegue Microservicio Usuarios v2.1', 'Se requiere aprobación para desplegar la nueva versión del microservicio de usuarios que incluye mejoras de seguridad y corrección de bugs críticos.', 4, 2, 1, 'PENDIENTE', 'ALTA'),
('SOL-2024-002', 'Acceso a Jenkins Producción', 'Solicitud de acceso a Jenkins de producción para el equipo de DevOps. Se requiere permisos de lectura y ejecución.', 5, 3, 2, 'PENDIENTE', 'MEDIA'),
('SOL-2024-003', 'Modificación Pipeline CI/CD', 'Cambios en el pipeline de integración continua para incluir análisis de código estático con SonarQube.', 6, 2, 3, 'APROBADA', 'MEDIA'),
('SOL-2024-004', 'Incorporación de Docker Compose', 'Aprobación para incorporar Docker Compose al catálogo de herramientas oficiales del equipo.', 4, 3, 4, 'APROBADA', 'BAJA'),
('SOL-2024-005', 'Cambio Configuración Base de Datos', 'Modificación de parámetros de conexión a base de datos para optimizar rendimiento.', 5, 2, 5, 'RECHAZADA', 'ALTA');

-- Insertar historial para las solicitudes
INSERT INTO historial_cambios (solicitud_id, usuario_id, accion, estado_anterior, estado_nuevo, comentario) VALUES
(1, 4, 'CREACION', NULL, 'PENDIENTE', 'Solicitud creada'),
(2, 5, 'CREACION', NULL, 'PENDIENTE', 'Solicitud creada'),
(3, 6, 'CREACION', NULL, 'PENDIENTE', 'Solicitud creada'),
(3, 2, 'APROBACION', 'PENDIENTE', 'APROBADA', 'Aprobado. Los cambios propuestos mejoran la calidad del código.'),
(4, 4, 'CREACION', NULL, 'PENDIENTE', 'Solicitud creada'),
(4, 3, 'APROBACION', 'PENDIENTE', 'APROBADA', 'Aprobado. Docker Compose es una herramienta útil para el equipo.'),
(5, 5, 'CREACION', NULL, 'PENDIENTE', 'Solicitud creada'),
(5, 2, 'RECHAZO', 'PENDIENTE', 'RECHAZADA', 'Rechazado. Los cambios propuestos pueden afectar la estabilidad del sistema. Favor revisar con el equipo de arquitectura.');

-- Insertar notificaciones de prueba
INSERT INTO notificaciones (usuario_id, solicitud_id, tipo, titulo, mensaje, leida) VALUES
(2, 1, 'NUEVA_SOLICITUD', 'Nueva solicitud pendiente', 'Tienes una nueva solicitud de aprobación: Despliegue Microservicio Usuarios v2.1', FALSE),
(3, 2, 'NUEVA_SOLICITUD', 'Nueva solicitud pendiente', 'Tienes una nueva solicitud de aprobación: Acceso a Jenkins Producción', FALSE),
(6, 3, 'APROBADA', 'Solicitud aprobada', 'Tu solicitud "Modificación Pipeline CI/CD" ha sido aprobada', TRUE),
(4, 4, 'APROBADA', 'Solicitud aprobada', 'Tu solicitud "Incorporación de Docker Compose" ha sido aprobada', TRUE),
(5, 5, 'RECHAZADA', 'Solicitud rechazada', 'Tu solicitud "Cambio Configuración Base de Datos" ha sido rechazada', FALSE);


CREATE OR REPLACE VIEW v_solicitudes_completas AS
SELECT 
    s.id,
    s.codigo_solicitud,
    s.titulo,
    s.descripcion,
    s.estado,
    s.prioridad,
    s.fecha_creacion,
    s.fecha_respuesta,
    s.comentario_aprobador,
    
    -- Solicitante
    u_sol.username AS solicitante_username,
    u_sol.nombre_completo AS solicitante_nombre,
    u_sol.email AS solicitante_email,
    
    -- Responsable
    u_resp.username AS responsable_username,
    u_resp.nombre_completo AS responsable_nombre,
    u_resp.email AS responsable_email,
    
    -- Tipo
    ts.nombre AS tipo_nombre,
    ts.descripcion AS tipo_descripcion,
    ts.color AS tipo_color
FROM solicitudes s
INNER JOIN usuarios u_sol ON s.solicitante_id = u_sol.id
INNER JOIN usuarios u_resp ON s.responsable_id = u_resp.id
INNER JOIN tipo_solicitud ts ON s.tipo_solicitud_id = ts.id;

-- Vista: Estadísticas por usuario
CREATE OR REPLACE VIEW v_estadisticas_usuario AS
SELECT 
    u.id,
    u.username,
    u.nombre_completo,
    COUNT(DISTINCT s_sol.id) AS total_solicitadas,
    COUNT(DISTINCT CASE WHEN s_sol.estado = 'PENDIENTE' THEN s_sol.id END) AS solicitadas_pendientes,
    COUNT(DISTINCT CASE WHEN s_sol.estado = 'APROBADA' THEN s_sol.id END) AS solicitadas_aprobadas,
    COUNT(DISTINCT CASE WHEN s_sol.estado = 'RECHAZADA' THEN s_sol.id END) AS solicitadas_rechazadas,
    COUNT(DISTINCT s_resp.id) AS total_por_aprobar,
    COUNT(DISTINCT CASE WHEN s_resp.estado = 'PENDIENTE' THEN s_resp.id END) AS pendientes_aprobacion
FROM usuarios u
LEFT JOIN solicitudes s_sol ON u.id = s_sol.solicitante_id
LEFT JOIN solicitudes s_resp ON u.id = s_resp.responsable_id
GROUP BY u.id, u.username, u.nombre_completo;


DELIMITER //


CREATE PROCEDURE sp_aprobar_solicitud(
    IN p_solicitud_id BIGINT,
    IN p_usuario_id BIGINT,
    IN p_comentario TEXT
)
BEGIN
    DECLARE v_estado_anterior VARCHAR(20);
    
    -- Obtener estado actual
    SELECT estado INTO v_estado_anterior FROM solicitudes WHERE id = p_solicitud_id;
    
    -- Actualizar solicitud
    UPDATE solicitudes 
    SET estado = 'APROBADA',
        comentario_aprobador = p_comentario,
        fecha_respuesta = CURRENT_TIMESTAMP
    WHERE id = p_solicitud_id;
    
    -- Registrar en historial
    INSERT INTO historial_cambios (solicitud_id, usuario_id, accion, estado_anterior, estado_nuevo, comentario)
    VALUES (p_solicitud_id, p_usuario_id, 'APROBACION', v_estado_anterior, 'APROBADA', p_comentario);
    
    -- Crear notificación para el solicitante
    INSERT INTO notificaciones (usuario_id, solicitud_id, tipo, titulo, mensaje)
    SELECT solicitante_id, id, 'APROBADA', 'Solicitud aprobada', 
           CONCAT('Tu solicitud "', titulo, '" ha sido aprobada')
    FROM solicitudes WHERE id = p_solicitud_id;
END //

-- Procedimiento: Rechazar solicitud
CREATE PROCEDURE sp_rechazar_solicitud(
    IN p_solicitud_id BIGINT,
    IN p_usuario_id BIGINT,
    IN p_comentario TEXT
)
BEGIN
    DECLARE v_estado_anterior VARCHAR(20);
    
    SELECT estado INTO v_estado_anterior FROM solicitudes WHERE id = p_solicitud_id;
    
    UPDATE solicitudes 
    SET estado = 'RECHAZADA',
        comentario_aprobador = p_comentario,
        fecha_respuesta = CURRENT_TIMESTAMP
    WHERE id = p_solicitud_id;
    
    INSERT INTO historial_cambios (solicitud_id, usuario_id, accion, estado_anterior, estado_nuevo, comentario)
    VALUES (p_solicitud_id, p_usuario_id, 'RECHAZO', v_estado_anterior, 'RECHAZADA', p_comentario);
    
    INSERT INTO notificaciones (usuario_id, solicitud_id, tipo, titulo, mensaje)
    SELECT solicitante_id, id, 'RECHAZADA', 'Solicitud rechazada', 
           CONCAT('Tu solicitud "', titulo, '" ha sido rechazada')
    FROM solicitudes WHERE id = p_solicitud_id;
END //

DELIMITER ;


SELECT 'Base de datos creada exitosamente!' AS mensaje;
SELECT COUNT(*) AS total_usuarios FROM usuarios;
SELECT COUNT(*) AS total_solicitudes FROM solicitudes;
SELECT COUNT(*) AS total_tipos FROM tipo_solicitud;
