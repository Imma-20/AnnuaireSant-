// src/pages/ResetPasswordPage.tsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa"; // Nouvelles icônes pour le mot de passe, succès, erreur

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); // Pour récupérer les paramètres d'URL

  const query = new URLSearchParams(location.search);
  const token = query.get("token"); // Récupère le token de l'URL
  const email = query.get("email"); // Récupère l'email de l'URL

  // Effet pour vérifier si le token et l'email sont présents
  useEffect(() => {
    if (!token || !email) {
      setIsError(true);
      setMessage("Lien de réinitialisation invalide ou incomplet.");
    }
  }, [token, email]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    if (password !== passwordConfirmation) {
      setMessage("Les mots de passe ne correspondent pas.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    if (!token || !email) {
      setMessage("Le token ou l'email est manquant. Veuillez refaire une demande.");
      setIsError(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/password/reset", {
        email,
        token,
        password,
        password_confirmation: passwordConfirmation, // Laravel attend 'password_confirmation'
      });

      setMessage(response.data.message || "Votre mot de passe a été réinitialisé avec succès !");
      setIsResetSuccessful(true);
      // Rediriger vers la page de connexion après un court délai
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 3000);

    } catch (error: any) {
      console.error("Erreur de réinitialisation :", error);
      setMessage(error.response?.data?.message || "Une erreur est survenue lors de la réinitialisation du mot de passe.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-600 p-4 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 dark:bg-gray-800 dark:text-gray-100">
        <div className="flex justify-center">
          <img
            src="/assets/logo.png" // Assurez-vous que le chemin est correct
            alt="Logo de l'application"
            className="w-24 h-24 rounded-full shadow-md"
          />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-800 dark:text-gray-100">Réinitialiser le mot de passe</h2>
        <p className="text-center text-md text-gray-600 dark:text-gray-300">
          Veuillez entrer votre nouveau mot de passe.
        </p>

        {/* Messages d'alerte */}
        {message && (
          <div className={`px-4 py-3 rounded-lg relative text-center ${isError ? 'bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:text-red-100' : 'bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:text-green-100'}`}>
            {isError ? <FaExclamationCircle className="inline-block mr-2" /> : <FaCheckCircle className="inline-block mr-2" />}
            {message}
          </div>
        )}

        {/* Afficher le formulaire seulement si tout va bien et que le reset n'est pas déjà un succès */}
        {!isError && !isResetSuccessful && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nouveau mot de passe
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
              </div>
            </div>
            <div>
              <label htmlFor="passwordConfirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed dark:bg-green-700 dark:hover:bg-green-600"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  "Réinitialiser le mot de passe"
                )}
              </button>
            </div>
          </form>
        )}

        {isResetSuccessful && (
            <div className="text-center mt-4">
                <Link to="/login" className="text-md text-blue-600 hover:underline font-medium dark:text-blue-400">
                    Retour à la connexion
                </Link>
            </div>
        )}

      </div>
    </div>
  );
};

export default ResetPasswordPage;
