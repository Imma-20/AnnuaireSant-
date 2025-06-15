import React from 'react';

const NotificationsPage: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Mes Notifications</h1>
      <p className="text-gray-600">
        Ceci est la page des notifications. Vous trouverez ici toutes les alertes et informations importantes.
      </p>
      {/* Ajoutez ici la logique et l'UI pour afficher les notifications */}
    </div>
  );
};

export default NotificationsPage;
