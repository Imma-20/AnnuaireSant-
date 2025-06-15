import React from 'react';

const CommentsPage: React.FC = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Gestion des Commentaires</h1>
      <p className="text-gray-600">
        Ceci est la page de gestion des commentaires. Vous pourrez visualiser, modérer et répondre aux commentaires ici.
      </p>
      {/* Ajoutez ici la logique et l'UI pour la gestion des commentaires */}
    </div>
  );
};

export default CommentsPage;
