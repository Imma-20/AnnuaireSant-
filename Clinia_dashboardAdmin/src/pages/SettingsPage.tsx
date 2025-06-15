import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Paramètres du Compte</h1>
      <p className="text-gray-600">
        Ceci est la page des paramètres. Vous pouvez ajuster les préférences de votre compte ici.
      </p>
      {/* Ajoutez ici les formulaires et les options pour les paramètres */}
    </div>
  );
};

export default SettingsPage;
