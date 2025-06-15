import React, { useState } from "react";
import { Outlet } from "react-router-dom"; // Importez Outlet pour le routage imbriqué
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    const [isSidebarMinimized, setIsSidebarMinimized] = useState<boolean>(false);

    // Fonction pour basculer l'état de la sidebar
    const toggleSidebar = () => {
        setIsSidebarMinimized(prev => !prev);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar fixe */}
            <div className={`fixed left-0 top-0 h-full transition-all duration-300 ease-in-out ${isSidebarMinimized ? 'w-20' : 'w-64'}`}>
                <Sidebar isMinimized={isSidebarMinimized} />
            </div>

            {/* Contenu principal */}
            <div className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarMinimized ? 'ml-20' : 'ml-64'}`}>
                {/* Navbar fixe */}
                <div className={`fixed top-0 right-0 z-10 transition-all duration-300 ease-in-out ${isSidebarMinimized ? 'left-20' : 'left-64'}`}>
                    <Navbar toggleSidebar={toggleSidebar} />
                </div>

                {/* Zone de contenu défilable où les pages seront rendues */}
                {/* Le `pt-16` est pour compenser la hauteur de la Navbar fixe */}
                <div className="pt-16 p-6 overflow-y-auto h-screen">
                    <Outlet /> {/* C'est ici que le contenu des routes enfants sera affiché */}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
