import React, { useState, useEffect } from "react";
import "./Solicitudes.css";

const Solicitudes = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [comentario, setComentario] = useState("");
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    solicitante: "",
    responsable: "",
    tipoSolicitud: "despliegue",
  });

  const [users, setUsers] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      setFormData((prev) => ({
        ...prev,
        solicitante: user.username,
      }));
    }
  }, []);

  useEffect(() => {
    fetch("http://localhost:8081/api/usuarios")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const fetchSolicitudes = () => {
    if (currentUser && currentUser.id) {
      fetch(`http://localhost:8081/api/solicitudes/usuario/${currentUser.id}`)
        .then((response) => response.json())
        .then((data) => setSolicitudes(data))
        .catch((error) => console.error("Error fetching solicitudes:", error));
    }
  };

  useEffect(() => {
    fetchSolicitudes();
  }, [currentUser]);

  const handleViewDetails = (solicitud) => {
    setSelectedSolicitud(solicitud);
    setComentario("");
    setShowDetailModal(true);
  };

  const handleAprobar = async () => {
    if (!comentario.trim()) {
      alert("Por favor ingrese un comentario");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/solicitudes/${selectedSolicitud.id}/aprobar`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comentario }),
        },
      );

      if (!response.ok) throw new Error("Error al aprobar la solicitud");

      alert("Solicitud aprobada exitosamente");
      setShowDetailModal(false);
      fetchSolicitudes();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al aprobar la solicitud");
    }
  };

  const handleRechazar = async () => {
    if (!comentario.trim()) {
      alert("Por favor ingrese un comentario");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/solicitudes/${selectedSolicitud.id}/rechazar`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comentario }),
        },
      );

      if (!response.ok) throw new Error("Error al rechazar la solicitud");

      alert("Solicitud rechazada");
      setShowDetailModal(false);
      fetchSolicitudes();
    } catch (error) {
      console.error("Error:", error);
      alert("Error al rechazar la solicitud");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8081/api/solicitudes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        solicitante: formData.solicitante,
        responsable: formData.responsable,
        tipoSolicitud: (formData.tipoSolicitud || "otro").toUpperCase(),
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Error creando la solicitud");
        }
        return res.json();
      })
      .then((data) => {
        fetchSolicitudes();
        setShowModal(false);
        setFormData({
          titulo: "",
          descripcion: "",
          solicitante: currentUser?.username || "",
          responsable: "",
          tipoSolicitud: "despliegue",
        });
        alert(
          "Solicitud creada correctamente (codigo: " +
            (data.codigoSolicitud || data.codigo_solicitud || data.id) +
            ")",
        );
      })
      .catch((err) => {
        console.error("Error creating solicitud:", err);
        alert("Error creando la solicitud: " + err.message);
      });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getEstadoBadge = (estado) => {
    const badgeClass = `estado-badge estado-${estado.toLowerCase()}`;
    const labels = {
      PENDIENTE: "Pendiente",
      APROBADA: "Aprobada",
      RECHAZADA: "Rechazada",
      CANCELADA: "Cancelada",
    };
    return <span className={badgeClass}>{labels[estado] || estado}</span>;
  };

  const isResponsable = (solicitud) => {
    return solicitud.responsable?.username === currentUser?.username;
  };

  const canTakeAction = (solicitud) => {
    return isResponsable(solicitud) && solicitud.estado === "PENDIENTE";
  };

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 className="page-title">Mis Solicitudes</h1>
            {currentUser && (
              <p className="user-welcome">
                Bienvenido, {currentUser.nombreCompleto}
              </p>
            )}
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "8px" }}
            >
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Nueva Solicitud
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Solicitudes Asignadas</h3>
        <p style={{ marginBottom: "20px" }}>
          Solicitudes donde eres solicitante o responsable
        </p>

        {solicitudes.length === 0 ? (
          <div className="empty-state">No tienes solicitudes asignadas</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="solicitudes-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Título</th>
                  <th>Estado</th>
                  <th>Tipo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudes.map((sol) => (
                  <tr key={sol.id}>
                    <td>{sol.codigoSolicitud}</td>
                    <td>{sol.titulo}</td>
                    <td>{getEstadoBadge(sol.estado)}</td>
                    <td>{sol.tipoSolicitud?.nombre || "N/A"}</td>
                    <td>
                      <span
                        className={
                          sol.solicitante?.username === currentUser?.username
                            ? "rol-solicitante"
                            : "rol-responsable"
                        }
                      >
                        {sol.solicitante?.username === currentUser?.username
                          ? "Solicitante"
                          : "Responsable"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-details"
                        onClick={() => handleViewDetails(sol)}
                      >
                        Ver Detalles
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {showDetailModal && selectedSolicitud && (
        <div
          className="modal-overlay"
          onClick={() => setShowDetailModal(false)}
        >
          <div
            className="modal-content modal-content-wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Detalles de Solicitud</h2>
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="detail-section">
              <div className="detail-item">
                <strong className="detail-label">Código:</strong>
                <p className="detail-value">
                  {selectedSolicitud.codigoSolicitud}
                </p>
              </div>

              <div className="detail-item">
                <strong className="detail-label">Título:</strong>
                <p className="detail-value">{selectedSolicitud.titulo}</p>
              </div>

              <div className="detail-item">
                <strong className="detail-label">Descripción:</strong>
                <p className="detail-value">{selectedSolicitud.descripcion}</p>
              </div>

              <div className="detail-item">
                <strong className="detail-label">Estado:</strong>
                <div className="detail-value">
                  {getEstadoBadge(selectedSolicitud.estado)}
                </div>
              </div>

              <div className="detail-item">
                <strong className="detail-label">Tipo:</strong>
                <p className="detail-value">
                  {selectedSolicitud.tipoSolicitud?.nombre || "N/A"}
                </p>
              </div>

              <div className="detail-item">
                <strong className="detail-label">Solicitante:</strong>
                <p className="detail-value">
                  {selectedSolicitud.solicitante?.nombreCompleto}
                </p>
              </div>

              <div className="detail-item">
                <strong className="detail-label">Responsable:</strong>
                <p className="detail-value">
                  {selectedSolicitud.responsable?.nombreCompleto}
                </p>
              </div>

              {selectedSolicitud.comentarioAprobador && (
                <div className="comment-box">
                  <strong className="detail-label">
                    Comentario del Responsable:
                  </strong>
                  <p className="detail-value">
                    {selectedSolicitud.comentarioAprobador}
                  </p>
                </div>
              )}

              {canTakeAction(selectedSolicitud) && (
                <div className="actions-section">
                  <strong className="actions-title">
                    Acciones del Responsable:
                  </strong>
                  <textarea
                    className="comment-textarea"
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    placeholder="Ingrese un comentario (requerido)"
                    rows="4"
                  />
                  <div className="action-buttons">
                    <button className="btn-aprobar" onClick={handleAprobar}>
                      Aprobar
                    </button>
                    <button className="btn-rechazar" onClick={handleRechazar}>
                      Rechazar
                    </button>
                  </div>
                </div>
              )}

              {!canTakeAction(selectedSolicitud) &&
                isResponsable(selectedSolicitud) && (
                  <div className="status-message">
                    Esta solicitud ya fue{" "}
                    {selectedSolicitud.estado.toLowerCase()}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Formulario de solicitud */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Solicitud</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="titulo">Título *</label>
                <input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ingrese el título de la solicitud"
                />
              </div>

              <div className="form-group">
                <label htmlFor="descripcion">Descripción *</label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Describa los detalles de la solicitud"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="solicitante">Solicitante *</label>
                  <select
                    id="solicitante"
                    name="solicitante"
                    value={formData.solicitante}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un usuario</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.username}>
                        {user.nombreCompleto} ({user.username})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="responsable">Responsable *</label>
                  <select
                    id="responsable"
                    name="responsable"
                    value={formData.responsable}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione un usuario</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.username}>
                        {user.nombreCompleto} ({user.username})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="tipoSolicitud">Tipo de Solicitud *</label>
                <select
                  id="tipoSolicitud"
                  name="tipoSolicitud"
                  value={formData.tipoSolicitud}
                  onChange={handleChange}
                  required
                >
                  <option value="despliegue">Despliegue</option>
                  <option value="acceso">Acceso</option>
                  <option value="cambio_tecnico">Cambio Técnico</option>
                  <option value="soporte">Soporte</option>
                  <option value="mantenimiento">Mantenimiento</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Crear Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Solicitudes;
