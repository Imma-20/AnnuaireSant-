// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useTheme } from '../contexts/ThemeContext'; // Importez le hook useTheme

const Dashboard = () => {
    const [isSidebarMinimized, setIsSidebarMinimized] = useState<boolean>(false);
    const { theme } = useTheme(); // Obtenez le thème actuel depuis le contexte

    const toggleSidebar = () => {
        setIsSidebarMinimized(prev => !prev);
    };

    return (
        // Appliquez le fond conditionnel à l'élément principal du Dashboard
        // Il est préférable d'appliquer le fond ici pour qu'il englobe tout
        <div className={`flex h-screen transition-colors duration-300
                        ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}> {/* Fond dynamique */}
            {/* Sidebar fixe */}
            <div className={`fixed left-0 top-0 h-full transition-all duration-300 ease-in-out z-20 ${isSidebarMinimized ? 'w-20' : 'w-64'}`}>
                <Sidebar isMinimized={isSidebarMinimized} />
            </div>

            {/* Contenu principal */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarMinimized ? 'ml-20' : 'ml-64'}`}>
                {/* Navbar fixe */}
                {/* Assurez-vous que la Navbar s'étende sur toute la largeur restante */}
                <div className={`fixed top-0 right-0 z-10 transition-all duration-300 ease-in-out ${isSidebarMinimized ? 'left-20' : 'left-64'}`}>
                    {/* La Navbar prend 100% de la largeur disponible dans sa div parente */}
                    <Navbar toggleSidebar={toggleSidebar} />
                </div>

                {/* Zone de contenu défilable où les pages seront rendues */}
                {/* Le `pt-[4rem]` (équivalent à pt-16) compense la hauteur de la Navbar fixe.
                    Ajout de `overflow-auto` et `flex-1` pour gérer le défilement du contenu principal.
                    Le padding `p-6` donne de l'espace autour du contenu des pages.
                */}
                <div className="pt-16 p-6 flex-1 overflow-y-auto"> {/* bg-gray-100 est retiré ici */}
                    <Outlet /> {/* C'est ici que le contenu des routes enfants sera affiché */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;