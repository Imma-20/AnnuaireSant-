import React, { useState } from "react";
import axios from "axios";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [mailSent, setMailSent] = useState(false); // Nouveau state pour suivre l'envoi du mail

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/api/password/forgot", {
        email,
      });
      // Mettez à jour le message de succès avec un texte clair pour l'utilisateur
      setMessage(response.data.message || "Un lien de réinitialisation a été envoyé à votre adresse e-mail. Veuillez vérifier votre boîte de réception (et vos spams).");
      setMailSent(true); // Indique que l'e-mail a été envoyé avec succès
    } catch (error: any) {
      // Pour les erreurs, vous pouvez utiliser un message plus explicite si l'API en fournit
      setMessage(error.response?.data?.message || "Une erreur est survenue. Veuillez réessayer.");
      setMailSent(false); // S'assurer que le formulaire reste affiché en cas d'erreur
    }
  };

  // --- Rendu conditionnel ici ---
  if (mailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-600"> {/* Fond blanc */}
        <div className="w-full max-w-md p-8 space-y-6 bg-white text-center">
          <h2 className="text-3xl font-bold text-green-600 mb-4">Succès !</h2>
          <p className="text-lg text-gray-800">
            {message}
          </p>
          <p className="text-md text-gray-600 mt-6">
            Vous devriez recevoir l'e-mail de réinitialisation dans les prochaines minutes.
          </p>
          <div className="mt-8">
            <a href="/login" className="text-blue-600 hover:underline text-lg font-medium">
              Retour à la page de connexion
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Si le mail n'a pas encore été envoyé, on affiche le formulaire original
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 via-yellow-500 to-red-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="flex justify-center">
          <img
            src="assets/logo.png"
            alt="Logo de l'application"
            className="w-24 h-24 rounded-full"
          />
        </div>
        <h2 className="text-center text-2xl font-bold text-gray-700">Mot de passe oublié</h2>
        <p className="text-center text-sm text-gray-600">
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Envoyer le lien
            </button>
          </div>
        </form>
        {message && <p className="text-center text-sm text-gray-600 mt-4">{message}</p>} {/* Ajouté mt-4 pour un peu d'espace */}
        <div className="text-center">
          <a href="/login" className="text-sm text-blue-600 hover:underline">
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;