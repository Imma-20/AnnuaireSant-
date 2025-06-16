import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaBars,
  FaSearch,
  FaCog,
  FaUser,
  FaLock,
  FaSignOutAlt,
  FaSun, // Icône pour le mode clair
  FaMoon, // Icône pour le mode sombre
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotificationBell from './NotificationBell';
import { useTheme } from '../contexts/ThemeContext'; // Importe le hook useTheme

// --- Définition des types pour une meilleure structure des données ---
interface UserInfo {
  name: string;
  email: string;
}

// --- Ajout de l'interface pour les props de Navbar ---
interface NavbarProps {
  toggleSidebar: () => void; // Fonction pour basculer la sidebar
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  // --- Gestion de l'état ---
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const { theme, toggleTheme } = useTheme(); // Utilise le contexte de thème

  // Références pour détecter les clics en dehors des éléments
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Informations utilisateur
  const user: UserInfo = {
    name: "Méchac ASSONGBA",
    email: "mechacassongba@gmail.com",
  };

  const navigate = useNavigate();

  // --- Gestionnaires ---
  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/login");
  }, [navigate]);

  const handleForgotPassword = useCallback(() => {
    navigate("/forgot-password");
  }, [navigate]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setShowDropdown(false);
    }
  }, []);

  // --- Effets de bord ---
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [handleClickOutside]);

  // --- Rendu du Composant ---
  return (
    <div className="flex items-center justify-between p-4 shadow-md
                    bg-green-600 text-white                      {/* Fond green-600 par défaut, texte blanc */}
                    dark:bg-gray-900 dark:text-gray-100        {/* Styles du mode sombre */}
                    transition-colors duration-300">           {/* Transition douce */}
      {/* Icônes de gauche */}
      <div className="flex items-center space-x-4">
        <FaBars
          className="cursor-pointer text-xl
                     text-white dark:text-gray-300               {/* Icône blanche en mode clair, grise en sombre */}
                     hover:text-green-200 dark:hover:text-green-400" 
          title="Ouvrir/Fermer le menu"
          onClick={toggleSidebar}
        />
        <FaSearch
          className="cursor-pointer text-xl
                     text-white dark:text-gray-300
                     hover:text-green-200 dark:hover:text-green-400"
          title="Rechercher"
        />
      </div>

      {/* Centre (vide pour l'instant) */}
      <div className="flex-grow"></div>

      {/* Icônes de droite */}
      <div className="relative flex items-center space-x-6">
        {/* Bouton de bascule de thème */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full focus:outline-none
                     bg-green-700 text-white                  {/* Bouton vert en mode clair */}
                     dark:bg-gray-700 dark:text-gray-200
                     hover:bg-green-800 dark:hover:bg-gray-600
                     transition-colors duration-300"
          title={`Activer le mode ${theme === 'light' ? 'sombre' : 'clair'}`}
        >
          {theme === 'light' ? (
            <FaMoon className="text-xl" /> // Icône de lune pour le mode clair
          ) : (
            <FaSun className="text-xl" />  // Icône de soleil pour le mode sombre
          )}
        </button>

        <NotificationBell /> {/* Supposons que NotificationBell gère également le mode sombre */}

        {/* Icône de paramètres */}
        <FaCog
          className="cursor-pointer text-xl
                     text-white dark:text-gray-300
                     hover:text-green-200 dark:hover:text-green-400"
          title="Aller aux paramètres"
          onClick={() => navigate("/dashboard/settings")}
        />

        {/* Icône utilisateur avec Dropdown */}
        <div ref={dropdownRef} className="relative">
          <FaUser
            className="cursor-pointer text-xl
                       text-white dark:text-gray-300
                       hover:text-green-200 dark:hover:text-green-400"
            title="Profil utilisateur"
            onClick={() => {
              setShowDropdown((prev) => !prev);
            }}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg z-10
                            bg-white border border-gray-200                     {/* Valeurs par défaut du mode clair */}
                            dark:bg-gray-700 dark:border-gray-600">             {/* Styles du mode sombre */}
              <div className="bg-green-600 text-white p-4 rounded-t-lg"> {/* L'en-tête reste vert */}
                <p className="font-bold text-lg">{user.name}</p>
                <p className="text-sm opacity-90">{user.email}</p>
              </div>

              <ul className="divide-y
                             divide-gray-200 dark:divide-gray-600">             {/* Couleur du séparateur */}
                <li
                  className="flex items-center space-x-3 p-4 cursor-pointer
                             text-gray-800 hover:bg-gray-100                     {/* Mode clair */}
                             dark:text-gray-100 dark:hover:bg-gray-600          {/* Mode sombre */}
                             transition-colors duration-200"
                  onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                >
                  <FaUser className="text-green-500 dark:text-green-400" /> {/* Couleur de l'icône */}
                  <span>Mon Profil</span>
                </li>
                <li
                  className="flex items-center space-x-3 p-4 cursor-pointer
                             text-gray-800 hover:bg-gray-100
                             dark:text-gray-100 dark:hover:bg-gray-600
                             transition-colors duration-200"
                  onClick={() => { navigate("/dashboard/settings"); setShowDropdown(false); }}
                >
                  <FaCog className="text-gray-500 dark:text-gray-400" />
                  <span>Paramètres du compte</span>
                </li>
                <li
                  className="flex items-center space-x-3 p-4 cursor-pointer
                             text-gray-800 hover:bg-gray-100
                             dark:text-gray-100 dark:hover:bg-gray-600
                             transition-colors duration-200"
                  onClick={handleForgotPassword}
                >
                  <FaLock className="text-orange-500 dark:text-orange-400" />
                  <span>Changer le mot de passe</span>
                </li>
                <li
                  className="flex items-center space-x-3 p-4 cursor-pointer
                             text-red-600 hover:bg-red-100
                             dark:text-red-400 dark:hover:bg-red-900/50          {/* Rouge en mode sombre */}
                             transition-colors duration-200"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="text-red-500 dark:text-red-400" />
                  <span>Déconnexion</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;