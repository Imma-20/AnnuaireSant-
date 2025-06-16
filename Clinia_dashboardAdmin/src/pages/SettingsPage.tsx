// src/pages/SettingsPage.tsx
import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FaUserEdit, FaLock, FaGlobe } from 'react-icons/fa';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  // États factices pour les paramètres
  const [userName, setUserName] = useState('Méchac ASSONGBA');
  const [userEmail, setUserEmail] = useState('mechacassongba@gmail.com');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [language, setLanguage] = useState('fr');

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profil mis à jour ! (Logique à implémenter)');
    // Ici, vous feriez un appel API pour sauvegarder les infos de l'utilisateur
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Changement de mot de passe (Logique à implémenter)');
    // Ici, vous redirigeriez vers la page de changement de mot de passe ou afficheriez un modal
  };

  return (
    <div className="p-6 rounded-lg shadow-md
                    bg-white dark:bg-gray-800
                    text-gray-800 dark:text-gray-100
                    transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-6">Paramètres du Compte</h1>

      <div className="space-y-8">
        {/* Section Informations du Profil */}
        <div className="p-6 rounded-lg border
                        bg-gray-50 dark:bg-gray-700
                        border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <FaUserEdit className="text-blue-500 dark:text-blue-400" />
            <span>Informations du Profil</span>
          </h2>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">Nom Complet</label>
              <input
                type="text"
                id="name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full p-2 rounded-md border
                           border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-900
                           text-gray-800 dark:text-gray-100
                           focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Adresse Email</label>
              <input
                type="email"
                id="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="w-full p-2 rounded-md border
                           border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-900
                           text-gray-800 dark:text-gray-100
                           focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-md font-medium
                         bg-blue-600 text-white hover:bg-blue-700
                         dark:bg-blue-700 dark:hover:bg-blue-600
                         transition-colors duration-200"
            >
              Enregistrer les modifications
            </button>
          </form>
        </div>

        {/* Section Sécurité */}
        <div className="p-6 rounded-lg border
                        bg-gray-50 dark:bg-gray-700
                        border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <FaLock className="text-red-500 dark:text-red-400" />
            <span>Sécurité</span>
          </h2>
          <button
            onClick={handleChangePassword}
            className="px-5 py-2 rounded-md font-medium
                       bg-red-500 text-white hover:bg-red-600
                       dark:bg-red-700 dark:hover:bg-red-600
                       transition-colors duration-200"
          >
            Changer le mot de passe
          </button>
        </div>

        {/* Section Préférences d'Application */}
        <div className="p-6 rounded-lg border
                        bg-gray-50 dark:bg-gray-700
                        border-gray-200 dark:border-gray-600">
          <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
            <FaGlobe className="text-green-500 dark:text-green-400" />
            <span>Préférences d'Application</span>
          </h2>
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="notifications" className="block text-sm font-medium">Activer les notifications</label>
            <input
              type="checkbox"
              id="notifications"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400
                         rounded-md border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-900 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="language" className="block text-sm font-medium">Langue</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="p-2 rounded-md border
                         border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-900
                         text-gray-800 dark:text-gray-100
                         focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="mb-4 flex items-center justify-between">
            <label htmlFor="themeToggle" className="block text-sm font-medium">Mode d'affichage</label>
            <button
              onClick={toggleTheme}
              className="px-4 py-2 rounded-md text-sm font-medium
                         bg-gray-200 text-gray-700 hover:bg-gray-300
                         dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600
                         transition-colors duration-200"
            >
              Passer au mode {theme === 'light' ? 'sombre' : 'clair'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;