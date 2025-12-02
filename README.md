
# 🛡️ Gatekeeper - Sistema de Gestión de Aprobaciones

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-green)
![React](https://img.shields.io/badge/React-18-blue)
![AWS](https://img.shields.io/badge/AWS-Deployed-orange)

**Gatekeeper** es una solución empresarial robusta diseñada para centralizar, estandarizar y auditar los flujos de aprobación técnica en organizaciones de TI. Elimina la informalidad de los correos electrónicos y chats, proporcionando una plataforma unificada para gestionar despliegues, accesos y cambios de configuración.

---

## 📑 Tabla de Contenidos
1. [Arquitectura del Sistema](#-arquitectura-del-sistema)
2. [Características Principales](#-características-principales)
3. [Tecnologías y Stack](#-tecnologías-y-stack)
4. [Modelo de Datos](#-modelo-de-datos)
5. [API Reference](#-api-reference)
6. [Guía de Instalación Local](#-guía-de-instalación-local)
7. [Despliegue en Nube (AWS)](#-despliegue-en-nube-aws)
8. [Usuarios de Prueba](#-usuarios-de-prueba)

---

## 🏗 Arquitectura del Sistema

El sistema sigue una arquitectura de **N-Capas** desacoplada, desplegada en la nube de AWS para alta disponibilidad.
![Diagrama de arquitectura](Diagrama%20de%20arquitectura.png)


### Componentes
*   **Frontend (SPA):** React + Vite alojado en S3. Maneja la UI, estado y consumo de APIs.
*   **Backend (API REST):** Spring Boot en EC2. Maneja la lógica de negocio, seguridad y orquestación.
*   **Base de Datos:** MySQL en RDS. Persistencia relacional transaccional.
*   **Notificaciones:** Servicio SMTP integrado para alertas en tiempo real.

---

## 🚀 Características Principales

### 🔐 Seguridad y Control de Acceso
*   **Autenticación JWT:** Implementación segura de JSON Web Tokens para sesiones stateless.
*   **RBAC (Role-Based Access Control):**
    *   `SOLICITANTE`: Puede crear y ver sus propias solicitudes.
    *   `APROBADOR`: Puede gestionar solicitudes asignadas y ver historial.
    *   `ADMIN`: Control total del sistema.
*   **Password Hashing:** Encriptación BCrypt para credenciales.

### 📋 Gestión de Solicitudes
*   **Ciclo de Vida Completo:** `PENDIENTE` → `APROBADA` / `RECHAZADA`.
*   **Tipificación Dinámica:** Categorías extensibles (Despliegue, Acceso, Infraestructura, etc.).
*   **Priorización:** Niveles de urgencia (Baja, Media, Alta, Urgente).
*   **Generación de Folios:** IDs únicos legibles (`SOL-2024-XXXX`) para seguimiento.

### 📧 Notificaciones y Auditoría
*   **Alertas por Correo:** Envío automático al responsable cuando se crea una solicitud.
*   **Traza de Auditoría:** Registro inmutable de quién aprobó/rechazó, cuándo y comentarios asociados.

---

## 💻 Tecnologías y Stack

### Backend (Java Ecosystem)
*   **Framework:** Spring Boot 3.2.0
*   **Lenguaje:** Java 17 (LTS)
*   **ORM:** Hibernate / Spring Data JPA
*   **Seguridad:** Spring Security 6
*   **Base de Datos:** MySQL 8.0
*   **Utilidades:** Lombok, JavaMailSender

### Frontend (Modern Web)
*   **Framework:** React 18
*   **Build Tool:** Vite
*   **Estilos:** TailwindCSS (Utility-first CSS)
*   **HTTP Client:** Axios (con interceptores para JWT)
*   **Routing:** React Router DOM 6
*   **Iconos:** Heroicons

---

## 🗄 Modelo de Datos

El esquema relacional está diseñado para integridad y escalabilidad.

*   **`usuarios`**: Almacena credenciales y roles.
*   **`solicitudes`**: Tabla central. Contiene FKs a `solicitante`, `responsable` y `tipo_solicitud`.
*   **`tipos_solicitud`**: Catálogo administrable de tipos de trámites.

---

## 🔌 API Reference

### Autenticación
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Inicia sesión y retorna JWT. |
| `POST` | `/api/auth/register` | Registra un nuevo usuario. |

### Solicitudes
| Método | Endpoint | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/solicitudes` | Crea una nueva solicitud. |
| `GET` | `/api/solicitudes/mis-solicitudes` | Lista solicitudes creadas por el usuario. |
| `GET` | `/api/solicitudes/pendientes` | Lista solicitudes asignadas pendientes de revisión. |
| `PUT` | `/api/solicitudes/{id}/aprobar` | Aprueba una solicitud con comentario. |
| `PUT` | `/api/solicitudes/{id}/rechazar` | Rechaza una solicitud con comentario. |

---

## 🛠 Guía de Instalación Local

### Prerrequisitos
*   Java JDK 17+
*   Node.js 18+
*   MySQL Server corriendo localmente

### 1. Configuración de Base de Datos
1.  Crea la base de datos:
    ```sql
    CREATE DATABASE prueba_tecnica;
    ```
2.  El sistema inicializará automáticamente las tablas y datos semilla (`data.sql`) al arrancar.

### 2. Backend Setup
1.  Clonar repositorio.
2.  Ir a `Backend/src/main/resources/application.properties`.
3.  Configurar credenciales de BD y Correo (o usar variables de entorno).
4.  Ejecutar:
    ```bash
    ./mvnw spring-boot:run
    ```

### 3. Frontend Setup
1.  Ir a carpeta `Frontend`.
2.  Crear archivo `.env`:
    ```properties
    VITE_API_URL=http://localhost:8080/api
    ```
3.  Instalar y correr:
    ```bash
    npm install
    npm run dev
    ```

---

## ☁️ Despliegue en Nube (AWS)

El proyecto está actualmente desplegado y operativo en AWS.

### Infraestructura
*   **EC2 (Backend):** Instancia `t3.micro` con Amazon Linux 2023. Ejecuta el JAR como servicio `systemd`.
    *   **IP Pública:** `52.15.196.38`
*   **RDS (Database):** Instancia gestionada MySQL. VPC Peering con EC2 para seguridad.
*   **S3 (Frontend):** Bucket configurado para *Static Website Hosting*.
    *   **URL Pública:** [http://prueba-tecnica-frontend.s3-website-us-east-1.amazonaws.com](http://prueba-tecnica-frontend.s3-website-us-east-1.amazonaws.com)

### Variables de Entorno (Producción)
El servidor EC2 tiene configuradas las siguientes variables para seguridad:
*   `RDS_ENDPOINT`, `RDS_USERNAME`, `RDS_PASSWORD`
*   `MAIL_USERNAME`, `MAIL_PASSWORD` (App Password de Google)

---

## 🧪 Usuarios de Prueba

Para facilitar la revisión del reto, se han precargado los siguientes usuarios (Password universal: `password123`):

| Username | Rol | Caso de Uso |
| :--- | :--- | :--- |
| **`jperez`** | `SOLICITANTE` | Usar para **crear** nuevas solicitudes. |
| **`mgarcia`** | `APROBADOR` | Usar para **aprobar/rechazar** solicitudes entrantes. |
| **`crodriguez`**| `APROBADOR` | Aprobador alternativo. |
| **`admin`** | `ADMIN` | Acceso total al sistema. |

---

### 📄 Licencia
Este proyecto se distribuye bajo la licencia MIT.
Desarrollado para el **Reto Técnico Fullstack/Cloud Junior**.
