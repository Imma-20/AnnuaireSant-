// src/pages/PasswordResetConfirmation.tsx

import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // Icône de succès

const PasswordResetConfirmation: React.FC = () => {
  const location = useLocation();
  // Récupère le message passé via l'état de navigation
  const message = location.state?.message || "Un lien de réinitialisation a été envoyé à votre adresse e-mail. Veuillez vérifier votre boîte de réception (et vos spams).";

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-600 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg text-center">
        <FaCheckCircle className="mx-auto h-20 w-20 text-green-500 mb-4 animate-bounce" /> {/* Icône animée */}
        <h2 className="text-3xl font-bold text-gray-800">Demande Envoyée !</h2>
        <p className="text-lg text-gray-700">
          {message}
        </p>
        <p className="text-md text-gray-600 mt-6">
          Si l'adresse email est associée à un compte, vous recevrez un email sous peu.
        </p>
        <div className="mt-8">
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out"
          >
            Retour à la connexion
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetConfirmation;