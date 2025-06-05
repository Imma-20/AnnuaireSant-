import React from "react";

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-500 via-yellow-500 to-red-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        {/* Logo */}
        <div className="flex justify-center">
          <img
            src="assets/logo.png"
            alt="Logo de l'application"
            className="w-24 h-24 rounded-full"
          />
        </div>

        {/* Titre */}
        <h2 className="text-center text-2xl font-bold text-gray-700">
          Mot de passe oublié
        </h2>
        <p className="text-center text-sm text-gray-600">
          Entrez votre adresse email pour recevoir un lien de réinitialisation.
        </p>

        {/* Formulaire */}
        <form className="space-y-4" action="#" method="POST">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
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

        {/* Lien pour retourner */}
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
