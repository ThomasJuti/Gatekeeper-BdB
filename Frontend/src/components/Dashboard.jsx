import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Solicitudes from './Solicitudes';
import Historial from './Historial';
import './Dashboard.css';


const Dashboard = ({ onLogout }) => {
    return (
        <div className="dashboard-container">
            <Sidebar onLogout={onLogout} />
            <main className="main-content">
                <Routes>
                    <Route path="solicitudes" element={<Solicitudes />} />
                    <Route path="historial" element={<Historial />} />
                    <Route path="/" element={<Navigate to="solicitudes" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default Dashboard;
