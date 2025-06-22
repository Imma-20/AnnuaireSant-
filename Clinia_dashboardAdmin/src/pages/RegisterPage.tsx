import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// Import des icônes nécessaires depuis react-icons/fa (Font Awesome)
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash } from "react-icons/fa";

const RegisterPage: React.FC = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [telephone, setTelephone] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // État pour le champ mot de passe
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // État pour le champ confirmation mot de passe
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/admin/register", {
        nom,
        prenom,
        email,
        password,
        password_confirmation: confirmPassword,
        telephone,
      });

      // Redirection vers la page de connexion après inscription réussie
      navigate("/login");
    } catch (err) {
      // Amélioration de la gestion d'erreur pour afficher le message du backend si disponible
      setError(err.response?.data?.message || "Erreur lors de l'inscription. Veuillez réessayer.");
    }
  };

  // Fonction pour basculer la visibilité du mot de passe principal
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fonction pour basculer la visibilité du mot de passe de confirmation
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4"> {/* Ajout de p-4 pour le padding sur mobile */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <img
            src="assets/logo.png"
            alt="Logo de l'application"
            className="w-24 h-24 mx-auto rounded-full shadow-md" 
          />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-800">Créer un compte Admin</h2> {/* Texte plus grand et gras */}
        </div>
        {error && (
          <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
            {error}
          </p>
        )}
        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Champ Nom */}
          <div>
            <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
              Nom
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="nom"
                name="nom"
                type="text"
                required
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Champ Prénom */}
          <div>
            <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
              Prénom
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="prenom"
                name="prenom"
                type="text"
                required
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Champ Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'} 
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Champ Confirmer le mot de passe */}
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'} 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-gray-400" />
                ) : (
                  <FaEye className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
          </div>

          {/* Champ Téléphone */}
          <div>
            <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
              Téléphone
            </label>
            <div className="relative mt-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPhone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="telephone"
                name="telephone"
                type="text"
                required
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Bouton S'inscrire */}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out" //Effet de transition 
            >
              S'inscrire
            </button>
          </div>

          {/* Lien vers la page de connexion */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{" "}
              <a href="/login" className="text-green-600 hover:underline font-medium"> 
                Connectez-vous
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;