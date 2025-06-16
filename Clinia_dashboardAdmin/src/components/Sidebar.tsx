import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaCog, FaSignOutAlt, FaCommentAlt, FaBell, FaBook } from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";

interface SidebarProps {
    isMinimized: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMinimized }) => {
    const navigate = useNavigate();
    // État pour gérer le mode sombre (maintenu pour les styles conditionnels si d'autres parties de l'app utilisent le mode sombre)
    const [isDarkMode] = useState(() => {
        const savedMode = localStorage.getItem("darkMode");
        return savedMode ? JSON.parse(savedMode) : false;
    });

    // Effet pour appliquer/supprimer la classe 'dark' au corps du document
    // Ceci est maintenu pour que si le mode sombre est géré ailleurs, la sidebar réagisse
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        // Pas besoin de sauvegarder la préférence ici car le bouton de bascule a été supprimé
    }, [isDarkMode]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        navigate("/login");
    };

    return (
        <div className={`
            h-screen
            bg-green-600 text-white shadow-2xl
            dark:bg-gray-900 dark:text-gray-100 dark:shadow-none {/* Styles du mode sombre */}
            transition-all duration-300 ease-in-out
            overflow-hidden
            flex flex-col
            ${isMinimized ? 'w-20 p-2 items-center' : 'w-64 p-4'}
        `}>
            {/* Section du logo */}
            <div className={`flex items-center justify-center mb-8 ${isMinimized ? 'mt-4' : ''}`}>
                <div className="bg-white rounded-full p-2.5 shadow-lg dark:bg-gray-800"> {/* Mode sombre pour le fond du logo */}
                    <img
                        src="/assets/logo.png"
                        alt="Logo"
                        className={`object-cover ${isMinimized ? 'w-10 h-10' : 'w-16 h-16 rounded-full'}`}
                    />
                </div>
            </div>

            {/* Titre de navigation */}
            {!isMinimized && (
                <h2 className="text-2xl font-extrabold mb-8 text-center text-white tracking-wide dark:text-gray-200"> {/* Mode sombre pour le titre */}
                    Clinia Admin
                </h2>
            )}

            {/* Liens de navigation */}
            <ul className="flex-grow space-y-3">
                {/* Tableau de bord */}
                <li
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                                 hover:bg-green-700 hover:shadow-md transition-colors duration-200
                                 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => navigate("/dashboard")}
                >
                    <FaHome className={`text-xl ${isMinimized ? 'mx-auto' : ''}`} />
                    {!isMinimized && <span className="font-semibold text-lg">Tableau de bord</span>}
                </li>
                {/* Structure de santé */}
                <li
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                                 hover:bg-green-700 hover:shadow-md transition-colors duration-200
                                 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => navigate("/dashboard/structure-sante")}
                >
                    <MdLocalHospital className={`text-xl ${isMinimized ? 'mx-auto' : ''}`} />
                    {!isMinimized && <span className="font-semibold text-lg">Structure de santé</span>}
                </li>
                {/* Commentaire */}
                <li
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                                 hover:bg-green-700 hover:shadow-md transition-colors duration-200
                                 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => navigate("/dashboard/comments")}
                >
                    <FaCommentAlt className={`text-xl ${isMinimized ? 'mx-auto' : ''}`} />
                    {!isMinimized && <span className="font-semibold text-lg">Commentaire</span>}
                </li>
                {/* Notifications */}
                <li
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                                 hover:bg-green-700 hover:shadow-md transition-colors duration-200
                                 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => navigate("/dashboard/notifications")}
                >
                    <FaBell className={`text-xl ${isMinimized ? 'mx-auto' : ''}`} />
                    {!isMinimized && <span className="font-semibold text-lg">Notifications</span>}
                </li>
                {/* Publications */}
                <li
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                                 hover:bg-green-700 hover:shadow-md transition-colors duration-200
                                 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => navigate("/dashboard/publications")}
                >
                    <FaBook className={`text-xl ${isMinimized ? 'mx-auto' : ''}`} />
                    {!isMinimized && <span className="font-semibold text-lg">Publications</span>}
                </li>
                {/* Paramètre */}
                <li
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                                 hover:bg-green-700 hover:shadow-md transition-colors duration-200
                                 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white"
                    onClick={() => navigate("/dashboard/settings")}
                >
                    <FaCog className={`text-xl ${isMinimized ? 'mx-auto' : ''}`} />
                    {!isMinimized && <span className="font-semibold text-lg">Paramètre</span>}
                </li>
            </ul>

            {/* Lien de déconnexion - Poussé vers le bas */}
            <ul className="mt-auto pb-4">
                <li
                    className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer
                                 bg-green-700 text-white hover:bg-red-700 hover:shadow-md
                                 dark:bg-red-700 dark:hover:bg-red-800 dark:text-white
                                 transition-colors duration-200"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt className={`text-xl ${isMinimized ? 'mx-auto' : ''}`} />
                    {!isMinimized && <span className="font-semibold text-lg">Déconnexion</span>}
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;