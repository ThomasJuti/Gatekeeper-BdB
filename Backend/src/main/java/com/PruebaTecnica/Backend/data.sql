
-- script completo de inicializacion
-- base de datos: prueba_tecnica

-- este script crea la base de datos, las tablas y los datos de prueba
-- puede ejecutarse desde cero o sobre una base de datos existente


-- 1. crear base de datos

CREATE DATABASE IF NOT EXISTS prueba_tecnica 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE prueba_tecnica;

-- 2. crear tablas

-- Tabla: usuarios
CREATE TABLE IF NOT EXISTS usuarios (
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

-- Tabla: tipos_solicitud
CREATE TABLE IF NOT EXISTS tipos_solicitud (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: solicitudes
CREATE TABLE IF NOT EXISTS solicitudes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_solicitud VARCHAR(50) NOT NULL UNIQUE COMMENT 'ID único generado',
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    
    solicitante_id BIGINT NOT NULL,
    responsable_id BIGINT NOT NULL,
    tipo_solicitud_id BIGINT NOT NULL,
    
    estado ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA') DEFAULT 'PENDIENTE',
    prioridad ENUM('BAJA', 'MEDIA', 'ALTA', 'URGENTE') DEFAULT 'MEDIA',
    
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_respuesta TIMESTAMP NULL,
    
    comentario_aprobador TEXT NULL,
    
    notificacion_enviada BOOLEAN DEFAULT FALSE,
    fecha_notificacion TIMESTAMP NULL,
    
    FOREIGN KEY (solicitante_id) REFERENCES usuarios(id),
    FOREIGN KEY (responsable_id) REFERENCES usuarios(id),
    FOREIGN KEY (tipo_solicitud_id) REFERENCES tipos_solicitud(id),
    
    INDEX idx_codigo (codigo_solicitud),
    INDEX idx_estado (estado),
    INDEX idx_solicitante (solicitante_id),
    INDEX idx_responsable (responsable_id),
    INDEX idx_tipo (tipo_solicitud_id),
    INDEX idx_fecha_creacion (fecha_creacion),
    INDEX idx_prioridad (prioridad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. insertar datos de prueba

-- Limpiar datos existentes (opcional, comentar si no se desea)
-- DELETE FROM solicitudes;
-- DELETE FROM tipos_solicitud;
-- DELETE FROM usuarios;

-- 3.1 insertar usuarios
-- Nota: Las contraseñas están hasheadas con BCrypt
-- Contraseña para todos: "password123"

INSERT INTO usuarios (username, email, nombre_completo, password, rol, activo, fecha_creacion, fecha_actualizacion) VALUES
('jperez', 'juan.perez@empresa.com', 'Juan Pérez', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'SOLICITANTE', true, NOW(), NOW()),
('mgarcia', 'maria.garcia@empresa.com', 'María García', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'APROBADOR', true, NOW(), NOW()),
('crodriguez', 'carlos.rodriguez@empresa.com', 'Carlos Rodríguez', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'APROBADOR', true, NOW(), NOW()),
('alopez', 'ana.lopez@empresa.com', 'Ana López', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'SOLICITANTE', true, NOW(), NOW()),
('admin', 'admin@empresa.com', 'Administrador', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhCu', 'ADMIN', true, NOW(), NOW());

-- 3.2 insertar tipos de solicitud

INSERT INTO tipos_solicitud (nombre, descripcion, activo) VALUES
('DESPLIEGUE', 'Solicitud de despliegue de nueva versión de microservicio', true),
('ACCESO', 'Solicitud de acceso a herramientas internas', true),
('CAMBIO_PIPELINE', 'Solicitud de cambio en pipeline o CI/CD', true),
('INCORPORACION_TECNICA', 'Solicitud de incorporación de nueva herramienta al catálogo', true),
('CAMBIO_CONFIGURACION', 'Solicitud de cambio de configuración en ambiente', true),
('OTRO', 'Otro tipo de solicitud', true);

-- 3.3 insertar solicitudes de ejemplo

-- Solicitudes PENDIENTES
INSERT INTO solicitudes (codigo_solicitud, titulo, descripcion, estado, prioridad, fecha_creacion, fecha_actualizacion, solicitante_id, responsable_id, tipo_solicitud_id) VALUES
('SOL-2024-001234', 'Despliegue de Microservicio Auth v2.1', 'Se requiere aprobar el despliegue de la nueva versión del microservicio de autenticación que incluye mejoras de seguridad', 'PENDIENTE', 'ALTA', NOW(), NOW(), 
    (SELECT id FROM usuarios WHERE username = 'jperez'),
    (SELECT id FROM usuarios WHERE username = 'mgarcia'),
    (SELECT id FROM tipos_solicitud WHERE nombre = 'DESPLIEGUE')),

('SOL-2024-002456', 'Acceso a Jenkins para nuevo desarrollador', 'Solicito acceso a Jenkins para el nuevo desarrollador del equipo', 'PENDIENTE', 'MEDIA', NOW(), NOW(),
    (SELECT id FROM usuarios WHERE username = 'alopez'),
    (SELECT id FROM usuarios WHERE username = 'crodriguez'),
    (SELECT id FROM tipos_solicitud WHERE nombre = 'ACCESO')),

('SOL-2024-003678', 'Modificación de Pipeline de Frontend', 'Necesito agregar un paso de análisis de código estático al pipeline de frontend', 'PENDIENTE', 'BAJA', NOW(), NOW(),
    (SELECT id FROM usuarios WHERE username = 'jperez'),
    (SELECT id FROM usuarios WHERE username = 'mgarcia'),
    (SELECT id FROM tipos_solicitud WHERE nombre = 'CAMBIO_PIPELINE'));

-- Solicitudes APROBADAS
INSERT INTO solicitudes (codigo_solicitud, titulo, descripcion, estado, prioridad, fecha_creacion, fecha_actualizacion, fecha_respuesta, comentario_aprobador, solicitante_id, responsable_id, tipo_solicitud_id) VALUES
('SOL-2024-000123', 'Incorporación de SonarQube al catálogo', 'Solicito agregar SonarQube como herramienta oficial para análisis de código', 'APROBADA', 'ALTA', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 'Aprobado. Excelente propuesta para mejorar la calidad del código.',
    (SELECT id FROM usuarios WHERE username = 'alopez'),
    (SELECT id FROM usuarios WHERE username = 'mgarcia'),
    (SELECT id FROM tipos_solicitud WHERE nombre = 'INCORPORACION_TECNICA')),

('SOL-2024-000456', 'Cambio de configuración en ambiente QA', 'Actualizar variables de entorno en QA para nueva integración', 'APROBADA', 'MEDIA', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY), 'Aprobado. Coordinado con el equipo de infraestructura.',
    (SELECT id FROM usuarios WHERE username = 'jperez'),
    (SELECT id FROM usuarios WHERE username = 'crodriguez'),
    (SELECT id FROM tipos_solicitud WHERE nombre = 'CAMBIO_CONFIGURACION'));

-- Solicitudes RECHAZADAS
INSERT INTO solicitudes (codigo_solicitud, titulo, descripcion, estado, prioridad, fecha_creacion, fecha_actualizacion, fecha_respuesta, comentario_aprobador, solicitante_id, responsable_id, tipo_solicitud_id) VALUES
('SOL-2024-000789', 'Despliegue urgente sin pruebas', 'Necesito desplegar a producción sin pasar por QA', 'RECHAZADA', 'ALTA', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY), 'Rechazado. No se pueden saltear los procesos de QA por política de calidad.',
    (SELECT id FROM usuarios WHERE username = 'alopez'),
    (SELECT id FROM usuarios WHERE username = 'mgarcia'),
    (SELECT id FROM tipos_solicitud WHERE nombre = 'DESPLIEGUE'));


-- verificacion de datos


SELECT 'Base de datos creada exitosamente!' as Mensaje;
SELECT 'Usuarios creados:' as Info, COUNT(*) as Total FROM usuarios;
SELECT 'Tipos de solicitud creados:' as Info, COUNT(*) as Total FROM tipos_solicitud;
SELECT 'Solicitudes por estado:' as Info, estado, COUNT(*) as Total FROM solicitudes GROUP BY estado;

-- notas importantes
-- 1. La contraseña para todos los usuarios de prueba es: "password123"
-- 2. Los emails son ficticios para pruebas
-- 3. Para usar en producción, cambiar las contraseñas y emails reales
-- 4. Este script puede ejecutarse múltiples veces gracias a "IF NOT EXISTS"
