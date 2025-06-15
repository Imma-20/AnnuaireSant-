import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaCog, FaSignOutAlt, FaCommentAlt, FaBell, FaBook } from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";

interface SidebarProps {
    isMinimized: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isMinimized }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");
        navigate("/login");
    };

    return (
        <div className={`h-screen bg-blue-100 text-gray-800 shadow-lg transition-all duration-300 ease-in-out ${isMinimized ? 'w-20 p-2' : 'w-64 p-4'}`}>
            {/* Logo Section */}
            <div className={`flex items-center justify-center mb-6 ${isMinimized ? 'h-16' : ''}`}>
                <div className="bg-white rounded-full p-3 shadow-md">
                    <img
                        src="/assets/logo.png"
                        alt="Logo"
                        className={`object-cover ${isMinimized ? 'w-10 h-10' : 'w-20 h-20 rounded-full'}`}
                    />
                </div>
            </div>

            {/* Navigation Title */}
            {!isMinimized && (
                <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
                    Clinia Administrateur
                </h2>
            )}

            {/* Navigation Links - TOUS LES LIENS DOIVENT MAINTENANT COMMENCER PAR /dashboard/ */}
            <ul className="space-y-4">
                <li
                    className="flex items-center space-x-2 hover:bg-blue-200 p-2 rounded-md cursor-pointer"
                    onClick={() => navigate("/dashboard")} // Pour l'index du dashboard
                >
                    <FaHome className={isMinimized ? 'text-2xl mx-auto' : ''} />
                    {!isMinimized && <span className="hover:no-underline">Tableau de bord</span>}
                </li>
                <li
                    className="flex items-center space-x-2 hover:bg-blue-200 p-2 rounded-md cursor-pointer"
                    onClick={() => navigate("/dashboard/structure-sante")}
                >
                    <MdLocalHospital className={isMinimized ? 'text-2xl mx-auto' : ''} />
                    {!isMinimized && <span className="hover:no-underline">Structure de santé</span>}
                </li>
                <li
                    className="flex items-center space-x-2 hover:bg-blue-200 p-2 rounded-md cursor-pointer"
                    onClick={() => navigate("/dashboard/comments")}
                >
                    <FaCommentAlt className={isMinimized ? 'text-2xl mx-auto' : ''} />
                    {!isMinimized && <span className="hover:no-underline">Commentaire</span>}
                </li>
                <li
                    className="flex items-center space-x-2 hover:bg-blue-200 p-2 rounded-md cursor-pointer"
                    onClick={() => navigate("/dashboard/notifications")}
                >
                    <FaBell className={isMinimized ? 'text-2xl mx-auto' : ''} />
                    {!isMinimized && <span className="hover:no-underline">Notifications</span>}
                </li>
                <li
                    className="flex items-center space-x-2 hover:bg-blue-200 p-2 rounded-md cursor-pointer"
                    onClick={() => navigate("/dashboard/publications")}
                >
                    <FaBook className={isMinimized ? 'text-2xl mx-auto' : ''} />
                    {!isMinimized && <span className="hover:no-underline">Publications</span>}
                </li>
                <li
                    className="flex items-center space-x-2 hover:bg-blue-200 p-2 rounded-md cursor-pointer"
                    onClick={() => navigate("/dashboard/settings")}
                >
                    <FaCog className={isMinimized ? 'text-2xl mx-auto' : ''} />
                    {!isMinimized && <span className="hover:no-underline">Paramètre</span>}
                </li>
                <li
                    className="flex items-center space-x-2 hover:bg-red-200 p-2 rounded-md cursor-pointer"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt className={isMinimized ? 'text-2xl mx-auto' : ''} />
                    {!isMinimized && <span className="hover:no-underline text-red-600">Déconnexion</span>}
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
