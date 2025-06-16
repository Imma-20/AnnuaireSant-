import React from "react";
import { FaStar, FaArrowUp } from "react-icons/fa";

const RatingTable = () => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-gray-200"> {/* Mode sombre pour le conteneur principal */}
            <h2 className="text-xl font-bold mb-4 dark:text-gray-100">Notations</h2> {/* Mode sombre pour le titre */}
            <div className="flex items-center mb-4">
                <span className="text-4xl font-bold dark:text-gray-50">4.7</span> {/* Mode sombre pour le nombre de la note */}
                <FaStar className="text-yellow-500 text-3xl mx-2" />
                <span className="text-sm text-green-500 flex items-center dark:text-green-400"> {/* Mode sombre pour le texte vert */}
                    0.4 <FaArrowUp className="ml-1" />
                </span>
            </div>
            <ul className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars, index) => (
                    <li key={index} className="flex items-center">
                        <span className="flex items-center">
                            {Array(stars)
                                .fill(0)
                                .map((_, i) => (
                                    <FaStar key={i} className="text-yellow-500 text-sm" />
                                ))}
                        </span>
                        <div className="flex-1 h-2 bg-gray-200 mx-2 rounded-full dark:bg-gray-700"> {/* Mode sombre pour le fond de la barre de progression */}
                            <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${stars * 10}%` }}
                            ></div>
                        </div>
                        <span className="dark:text-gray-300">{stars * 50} users</span> {/* Mode sombre pour le nombre d'utilisateurs */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RatingTable;