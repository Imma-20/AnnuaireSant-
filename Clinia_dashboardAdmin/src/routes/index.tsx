import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import Dashboard from '../pages/Dashboard';
import RegisterPage from '../pages/RegisterPage';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route principale - Redirige vers la page de connexion */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        {/* Page de connexion */}
        <Route path="/login" element={<LoginPage />} />
		<Route path="/register" element={<RegisterPage />} />
		{/* Page de mot de passe oublié */}
		<Route path="/forgot-password" element={<ForgotPasswordPage />} />
        {/* Page du tableau de bord */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
