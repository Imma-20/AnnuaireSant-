// src/components/Card.tsx
import React from "react";

interface CardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}

const Card: React.FC<CardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="p-4 rounded-lg shadow-md
                    bg-white dark:bg-gray-800                  {/* Fond de carte clair/sombre */}
                    transition-colors duration-300">
      <div className="flex items-center space-x-4">
        <div className="text-3xl text-blue-500 dark:text-blue-400"> {/* Couleur de l'icône */}
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium
                         text-gray-600 dark:text-gray-300">    {/* Couleur du titre */}
            {title}
          </h3>
          <p className="text-xl font-bold
                        text-gray-800 dark:text-gray-100">     {/* Couleur de la valeur */}
            {value}
          </p>
          <span className="text-sm text-green-500 dark:text-green-400">{trend}</span> {/* Couleur de la tendance */}
        </div>
      </div>
    </div>
  );
};

export default Card;