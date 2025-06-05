import React from "react";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { MdLocalHospital } from "react-icons/md";


const Sidebar = () => {
  return (
    <div className="h-screen bg-blue-100 text-gray-800 w-64 p-4 shadow-lg">
      {/* Logo Section */}
      <div className="flex items-center justify-center mb-6">
        <div className="bg-white rounded-full p-3 shadow-md">
			<img
				src="assets/logo.png"
				alt="Logo"
				className="w-20 h-20 rounded-full object-cover"
			/>
		</div>
      </div>

      {/* Navigation Title */}
      <h2 className="text-xl font-bold mb-4 text-center text-gray-700">
        Clinia Administrateur
      </h2>

      {/* Navigation Links */}
      <ul className="space-y-4">
        <li className="flex items-center space-x-2 hover:bg-blue-200 p-2 rounded-md">
          <FaHome />
          <a href="/dashboard" className="hover:underline">Dashboard</a>
        </li>
        <li className="flex items-center space-x-2 hover:bg-blue-200 p-2 rounded-md">
          <FaUser />
          <a href="/profile" className="hover:underline">Profile</a>
        </li>
        <li className="flex items-center space-x-2 hover:bg-blue-200 p-2 rounded-md">
          <FaCog />
          <a href="/settings" className="hover:underline">Settings</a>
        </li>
		<li className="flex items-center space-x-2 hover:bg-blue-200 p-2 rounded-md">
          <MdLocalHospital />
          <a href="/structure-sante" className="hover:underline">Structure de santé</a>
        </li>
		<li className="flex items-center space-x-2 hover:bg-blue-200 p-2 rounded-md">
          <MdLocalHospital />
          <a href="/structure-sante" className="hover:underline">Commentaire</a>
        </li>
        {/* Déconnexion Link */}
        <li className="flex items-center space-x-2 hover:bg-red-200 p-2 rounded-md">
          <FaSignOutAlt />
          <a href="/logout" className="hover:underline text-red-600">Déconnexion</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
