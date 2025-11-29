import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';

function App() {
  // Intentamos restaurar la sesión desde localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (credentials) => {
    console.log('Login successful:');
    // Guardamos la info de usuario en localStorage para persistir entre recargas
    try {
      localStorage.setItem('user', JSON.stringify(credentials || {}));
    } catch (e) {
      console.warn('No se pudo guardar el usuario en localStorage', e);
    }
    setIsAuthenticated(true);
  };

  const handleRegister = (userData) => {

    console.log('Register successful:');
    try {
      localStorage.setItem('user', JSON.stringify(userData || {}));
    } catch (e) {
      console.warn('No se pudo guardar el usuario en localStorage', e);
    }
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('user');
    } catch (e) {
      console.warn('No se pudo eliminar el usuario de localStorage', e);
    }
  };

  // Componente para proteger rutas
  const ProtectedRoute = ({ children }) => {
    // También comprobamos localStorage por si la app se recargó
    const stored = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const auth = isAuthenticated || Boolean(stored);
    return auth ? children : <Navigate to="/login" replace />;
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard/solicitudes" replace />
          ) : (
            <Login onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard/solicitudes" replace />
          ) : (
            <Register onRegister={handleRegister} />
          )
        }
      />
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          isAuthenticated || localStorage.getItem('user') ? (
            <Navigate to="/dashboard/solicitudes" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="*"
        element={
          isAuthenticated || localStorage.getItem('user') ? (
            <Navigate to="/dashboard/solicitudes" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
