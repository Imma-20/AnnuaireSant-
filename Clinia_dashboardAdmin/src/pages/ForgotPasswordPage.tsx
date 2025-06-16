// src/pages/ForgotPasswordPage.tsx

import React, { useState } from "react";
import axios from "axios";
import { FaEnvelope } from "react-icons/fa"; // Importe l'icône
import { useNavigate } from "react-router-dom"; // Importe useNavigate pour la redirection

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); // Pour les messages d'erreur sur cette page
  const [isError, setIsError] = useState(false); // Pour styliser le message d'erreur
  const [isLoading, setIsLoading] = useState(false); // Pour le spinner sur le bouton
  const navigate = useNavigate(); // Hook pour la navigation

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(""); // Réinitialise le message d'erreur à chaque soumission
    setIsError(false); // Réinitialise l'état d'erreur
    setIsLoading(true); // Active le spinner

    try {
      const response = await axios.post("http://localhost:8000/api/password/forgot", {
        email,
      });

      // Si la requête réussit, redirige vers la page de confirmation
      navigate('/password-reset-confirmation', {
        state: {
          message: response.data.message || "Un lien de réinitialisation a été envoyé à votre adresse e-mail. Veuillez vérifier votre boîte de réception (et vos spams)."
        }
      });

    } catch (error: any) {
      // Si la requête échoue, affiche le message d'erreur sur cette même page
      setMessage(error.response?.data?.message || "Une erreur est survenue. Veuillez vérifier votre adresse e-mail et réessayer.");
      setIsError(true); // Définit l'état d'erreur pour le style
    } finally {
      setIsLoading(false); // Désactive le spinner
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-600 p-4"> 
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105">
        <div className="flex justify-center">
          <img
            src="assets/logo.png"
            alt="Logo de l'application"
            className="w-24 h-24 rounded-full shadow-md"
          />
        </div>
        <h2 className="text-center text-3xl font-extrabold text-gray-800">Mot de passe oublié</h2>
        <p className="text-center text-md text-gray-600">
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </p>

        {/* Message d'erreur affiché uniquement si isError est vrai et qu'il y a un message */}
        {message && isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" /> {/* Icône d'email */}
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-150 ease-in-out"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading} 
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Envoyer le lien"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <a href="/login" className="text-md text-blue-600 hover:underline font-medium">
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;