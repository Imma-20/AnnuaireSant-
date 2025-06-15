import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

// Pages d'authentification (ces pages n'auront pas la Sidebar/Navbar du Dashboard)
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import RegisterPage from '../pages/RegisterPage';

// Composant de mise en page du tableau de bord (qui contient Sidebar et Navbar)
import Dashboard from '../pages/Dashboard';

// Composants de contenu spécifiques qui seront rendus dans l'Outlet du Dashboard
import DashboardOverview from '../pages/DashboardOverview'; // Le contenu du tableau de bord principal
import SettingsPage from '../pages/SettingsPage';
import CommentsPage from '../pages/CommentsPage';
import NotificationsPage from '../pages/NotificationsPage';
import StructureSantePage from '../pages/StructureSantePage';
import PublicationsPage from '../pages/PublicationsPage'; // La nouvelle page de publications

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Route principale - Redirige par défaut vers la page de connexion */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Routes d'authentification (sans la mise en page Dashboard) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/*
          Route imbriquée pour le Dashboard :
          Le composant 'Dashboard' sera rendu pour toutes les routes qui commencent par '/dashboard'.
          Les composants enfants (DashboardOverview, SettingsPage, etc.) seront rendus
          à l'intérieur de l'<Outlet /> défini dans le composant Dashboard.
        */}
        <Route path="/dashboard" element={<Dashboard />}>
          {/* Route index : Le contenu par défaut de /dashboard (quand l'URL est exactement '/dashboard') */}
          <Route index element={<DashboardOverview />} />

          {/* Routes des pages spécifiques qui seront affichées dans l'Outlet du Dashboard */}
          <Route path="settings" element={<SettingsPage />} />
          <Route path="comments" element={<CommentsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="structure-sante" element={<StructureSantePage />} />
          <Route path="publications" element={<PublicationsPage />} />
        </Route>

        {/*
          Optionnel : Route générique pour les chemins non trouvés (404).
          Vous pouvez créer un composant 'NotFoundPage' pour cela.
          <Route path="*" element={<div>Page introuvable</div>} />
        */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
