import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', {
        email,
        password,
      });

      // Sauvegarder le token
      localStorage.setItem('token', response.data.token);

      // Déclencher l'animation
      setIsLoading(true);

      // Attendre 30 secondes avant la redirection
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000); // 
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-yellow-500 to-red-500">
      {isLoading ? (
        // Écran de chargement
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          <p className="mt-4 text-lg text-white font-semibold">Chargement...</p>
        </div>
      ) : (
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
          {/* Logo de l'application */}
          <div className="flex justify-center">
            <img
              src="assets/logo.png"
              alt="Logo de l'application"
              className="w-24 h-24 rounded-full"
            />
          </div>

          {/* Titre du formulaire */}
          <h2 className="text-center text-2xl font-bold text-gray-700">Admin Login</h2>

          {/* Affichage de l'erreur */}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {/* Formulaire */}
          <form className="space-y-4" action="#" method="POST" onSubmit={handleLogin}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <label htmlFor="remember-me" className="flex items-center text-sm text-gray-600">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="ml-2">Se souvenir</span>
              </label>
              <a href="/forgot-password" className="text-sm text-green-600 hover:underline">
                Mot de passe oublié ?
              </a>
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Se connecter
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte ?{' '}
                <a href="/register" className="text-green-600 hover:underline">
                  Inscrivez-vous
                </a>
              </p>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
