import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FaBars,
  FaSearch,
  FaCog,
  FaUser,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NotificationBell from './NotificationBell'; 
// --- Définition des types pour une meilleure structure des données ---
interface UserInfo {
  name: string;
  email: string;
}

// --- Ajout de l'interface pour les props de Navbar ---
interface NavbarProps {
  toggleSidebar: () => void; // Fonction pour basculer la sidebar
}

// Modifiez la déclaration du composant pour accepter les props
const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
  // --- State Management ---
  const [showDropdown, setShowDropdown] = useState<boolean>(false);


  // Références pour détecter les clics en dehors des éléments
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Informations utilisateur
  const user: UserInfo = {
    name: "Méchac ASSONGBA",
    email: "mechacassongba@gmail.com",
  };

  const navigate = useNavigate();

  // --- Handlers ---
  const handleLogout = useCallback(() => {
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("authToken");
    navigate("/login");
  }, [navigate]);

  const handleForgotPassword = useCallback(() => {
    navigate("/forgot-password");
  }, [navigate]);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    // Ne gère plus que le dropdown utilisateur, NotificationBell gère le sien
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
    <div className="flex items-center justify-between bg-gray-100 p-4 shadow-md">
      {/* Left Icons */}
      <div className="flex items-center space-x-4">
        {/* L'icône FaBars appelle maintenant la fonction toggleSidebar passée en prop */}
        <FaBars
          className="text-gray-600 cursor-pointer text-xl"
          title="Ouvrir/Fermer le menu"
          onClick={toggleSidebar}
        />
        <FaSearch className="text-gray-600 cursor-pointer text-xl" title="Rechercher" />
      </div>

      {/* Center (Empty for now) */}
      <div className="flex-grow"></div>

      {/* Right Icons */}
      <div className="relative flex items-center space-x-6">
        <NotificationBell />
        {/* Settings Icon */}
        <FaCog className="text-gray-600 cursor-pointer text-xl" title="Aller aux paramètres" onClick={() => navigate("/dashboard/settings")} />

        {/* User Icon with Dropdown */}
        <div ref={dropdownRef} className="relative">
          <FaUser
            className="text-gray-600 cursor-pointer text-xl"
            title="Profil utilisateur"
            onClick={() => {
              setShowDropdown((prev) => !prev);
              // Pas besoin de fermer les notifications ici, NotificationBell s'en charge
            }}
          />
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="bg-blue-600 text-white p-4 rounded-t-lg">
                <p className="font-bold text-lg">{user.name}</p>
                <p className="text-sm opacity-90">{user.email}</p>
              </div>

              <ul className="divide-y divide-gray-200">
                <li
                  className="flex items-center space-x-3 p-4 hover:bg-gray-100 cursor-pointer text-gray-800"
                  onClick={() => { navigate("/profile"); setShowDropdown(false); }}
                >
                  <FaUser className="text-blue-500" />
                  <span>Mon Profil</span>
                </li>
                <li
                  className="flex items-center space-x-3 p-4 hover:bg-gray-100 cursor-pointer text-gray-800"
                  onClick={() => { navigate("/dashboard/settings"); setShowDropdown(false); }}
                >
                  <FaCog className="text-gray-500" />
                  <span>Paramètres du compte</span>
                </li>
                <li
                  className="flex items-center space-x-3 p-4 hover:bg-gray-100 cursor-pointer text-gray-800"
                  onClick={handleForgotPassword}
                >
                  <FaLock className="text-orange-500" />
                  <span>Changer le mot de passe</span>
                </li>
                <li
                  className="flex items-center space-x-3 p-4 hover:bg-red-100 cursor-pointer text-red-600"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt className="text-red-500" />
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