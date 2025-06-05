import React from "react";
import { FaBars, FaSearch, FaBell, FaCog, FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-gray-100 p-4 shadow">
      {/* Left Icons */}
      <div className="flex items-center space-x-4">
        <FaBars className="text-gray-600 cursor-pointer" />
        <FaSearch className="text-gray-600 cursor-pointer" />
      </div>

      {/* Center (Empty for now) */}
      <div className="flex-grow"></div>

      {/* Right Icons */}
      <div className="flex items-center space-x-6">
        <FaBell className="relative text-gray-600 cursor-pointer">
          <span className="absolute top-0 right-0 bg-teal-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </FaBell>
        <FaCog className="text-gray-600 cursor-pointer" />
        <FaUser className="text-gray-600 cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
