import React from 'react';

const StructureSantePage: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Gestion des Structures de Santé</h1>
      <p className="text-gray-600">
        Ceci est la page de gestion des structures de santé. Vous pourrez ajouter, modifier et supprimer des structures ici.
      </p>
      {/* Ajoutez ici la logique et l'UI pour la gestion des structures de santé */}
    </div>
  );
};

export default StructureSantePage;
