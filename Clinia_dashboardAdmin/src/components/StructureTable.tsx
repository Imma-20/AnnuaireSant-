// src/components/StructureTable.tsx
import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { FiMoreHorizontal, FiX } from "react-icons/fi";
import { useTheme } from '../contexts/ThemeContext'; // Importez le hook useTheme

interface Structure {
  id: number;
  name: string;
  description: string;
  status: "Approved" | "Pending";
  date: string;
  avatarColor: string; // Tailwind CSS class like "bg-blue-300"
}

const StructureTable = () => {
  const { theme } = useTheme(); // Obtenez le thème actuel

  const structures: Structure[] = [
    { id: 1, name: "Clinique du Bonheur", description: "La Clinique du Bonheur est un établissement privé spécialisé dans les soins primaires et la petite chirurgie. Située au cœur de la ville, elle offre un environnement calme et des équipements modernes pour le bien-être de ses patients. Son équipe est composée de médecins généralistes, d'infirmières et de personnel de soutien dévoués. Notre objectif est de fournir des soins de qualité supérieure et un service personnalisé à chaque individu. Nous proposons également des consultations spécialisées sur rendez-vous.", status: "Approved", date: "11 MAY 12:56", avatarColor: "bg-blue-300" },
    { id: 2, name: "Hôpital Central", description: "L'Hôpital Central est un grand complexe hospitalier public offrant une gamme complète de services médicaux, y compris les urgences, la chirurgie, la pédiatrie, la cardiologie et la maternité. Il est un centre de référence régional et dispose des dernières technologies médicales. Nous nous engageons à la formation continue de notre personnel et à la recherche pour améliorer constamment nos pratiques. L'hôpital fonctionne 24h/24, 7j/7, pour répondre à tous les besoins de santé de la communauté.", status: "Pending", date: "11 MAY 10:35", avatarColor: "bg-pink-300" },
    { id: 3, name: "Centre Médical Pro", description: "Le Centre Médical Pro est une clinique moderne axée sur la médecine préventive et le suivi personnalisé. Nous offrons des bilans de santé complets, des consultations de spécialistes et des programmes de bien-être. Notre approche est holistique, visant à améliorer la qualité de vie de nos patients par des conseils adaptés et un suivi régulier. Les équipements de diagnostic sont à la pointe de la technologie pour des résultats précis et rapides.", status: "Approved", date: "9 MAY 17:38", avatarColor: "bg-green-300" },
    { id: 4, name: "Polyclinique Alpha", description: "La Polyclinique Alpha est un établissement polyvalent qui regroupe plusieurs spécialités médicales et chirurgicales sous un même toit. Elle est reconnue pour ses services d'orthopédie, de dermatologie et d'ophtalmologie. L'établissement met l'accent sur la coordination des soins pour offrir un parcours patient fluide et efficace. Un service d'imagerie médicale complet est également disponible sur place.", status: "Pending", date: "19 MAY 12:56", avatarColor: "bg-purple-300" },
    { id: 5, name: "Dispensaire Communautaire", description: "Le Dispensaire Communautaire est une structure de santé de proximité dédiée aux populations défavorisées. Il propose des consultations gratuites ou à faible coût, des campagnes de vaccination et des programmes de sensibilisation à la santé publique. Notre mission est de rendre les soins accessibles à tous, en particulier dans les zones rurales. Nous travaillons en étroite collaboration avec les associations locales pour identifier les besoins et apporter un soutien adapté.", status: "Approved", date: "21 MAY 12:56", avatarColor: "bg-teal-300" },
    { id: 6, name: "Clinique A", description: "Une clinique privée, Lorem Ipsum est simplement un texte fictif. Elle fournit des services de santé généraux et spécialisés à la communauté locale, avec un accent sur le confort du patient et l'innovation médicale.", status: "Pending", date: "21 MAY 12:56", avatarColor: "bg-yellow-300" },
    { id: 7, name: "Hôpital B", description: "Un hôpital général, Lorem Ipsum est simplement un texte fictif. Doté d'un service d'urgence performant et de plusieurs unités de soins intensifs, cet hôpital est un pilier de la santé publique dans la région.", status: "Approved", date: "21 MAY 12:56", avatarColor: "bg-red-300" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null);

  const handleReadContent = (structure: Structure) => {
    setSelectedStructure(structure);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStructure(null);
  };

  const handleApprove = (id: number) => {
    alert(`Structure ${id} approuvée ! (Logique à implémenter)`);
    handleCloseModal();
  };

  const handleReject = (id: number) => {
    alert(`Structure ${id} rejetée ! (Logique à implémenter)`);
    handleCloseModal();
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden
                    bg-white dark:bg-gray-800                 {/* Fond du tableau */}
                    transition-colors duration-300">
      <div className="p-4 border-b
                      border-gray-200 dark:border-gray-700">   {/* Bordure de l'en-tête */}
        <h2 className="text-xl font-semibold
                       text-gray-800 dark:text-gray-100">      {/* Titre du tableau */}
          Structures de santé
        </h2>
      </div>

      <div className="overflow-y-auto max-h-96">
        {structures.map((structure) => (
          <div key={structure.id} className={`flex items-center justify-between p-4 border-b
                      ${theme === 'dark' ? 'border-gray-700' : 'border-gray-100'} {/* Bordure de chaque ligne */}
                      last:border-b-0
                      ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} {/* Survol des lignes */}
                      transition-colors duration-200`}>
            {/* Colonne de gauche: Avatar, Nom, Description */}
            <div className="flex items-center flex-grow min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${structure.avatarColor} text-white`}>
                {/* Icône de l'avatar : la couleur text-gray-700 pourrait être trop foncée sur certains avatarColor clairs en mode clair,
                    mais comme ce sont des bg-XYZ-300, ça reste correct.
                    En mode sombre, on pourrait envisager un dark:text-gray-200 si les avatarColor devenaient sombres aussi.
                */}
                <FaUserCircle className="text-3xl text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate
                              text-gray-800 dark:text-gray-100"> {/* Nom de la structure */}
                  {structure.name}
                </p>
                <p className="text-sm truncate
                              text-gray-500 dark:text-gray-400"> {/* Description aperçu */}
                  {structure.description.substring(0, 50)}...
                </p>
              </div>
            </div>

            {/* Colonne du milieu: Statut et Date */}
            <div className="flex items-center text-sm mx-4 flex-shrink-0
                            text-gray-500 dark:text-gray-400"> {/* Texte du statut/date */}
              <span
                className={`w-2.5 h-2.5 rounded-full mr-2 ${
                  structure.status === "Approved" ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span>{structure.date}</span>
            </div>

            {/* Colonne de droite: Boutons d'action et bouton "plus" */}
            <div className="flex items-center space-x-2 flex-shrink-0 relative">
              <button
                className="px-3 py-1 rounded-md text-sm font-medium
                           bg-red-100 text-red-700 hover:bg-red-200          {/* Mode clair */}
                           dark:bg-red-700 dark:text-red-100 dark:hover:bg-red-600 {/* Mode sombre */}
                           transition-colors duration-200"
                onClick={() => handleReject(structure.id)}
              >
                Rejeter
              </button>
              <button
                className="px-3 py-1 rounded-md text-sm font-medium
                           bg-blue-100 text-blue-700 hover:bg-blue-200         {/* Mode clair */}
                           dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600 {/* Mode sombre */}
                           transition-colors duration-200"
                onClick={() => handleApprove(structure.id)}
              >
                Approuver
              </button>

              <button
                className="p-1 rounded-full focus:outline-none
                           text-gray-500 hover:text-gray-700 hover:bg-gray-100      {/* Mode clair */}
                           dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700 {/* Mode sombre */}
                           transition-colors duration-200"
                onClick={() => handleReadContent(structure)}
                aria-label="Plus d'options"
              >
                <FiMoreHorizontal className="text-lg" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'affichage du contenu */}
      {showModal && selectedStructure && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 relative
                          bg-white dark:bg-gray-800                                {/* Fond du modal */}
                          text-gray-800 dark:text-gray-100">                      {/* Texte du modal */}
            {/* Bouton Fermer */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-2xl
                         text-gray-500 hover:text-gray-800               {/* Mode clair */}
                         dark:text-gray-300 dark:hover:text-gray-100"    
              aria-label="Fermer"
            >
              <FiX />
            </button>

            <h3 className="text-2xl font-bold mb-4">{selectedStructure.name}</h3>
            <p className="whitespace-pre-wrap mb-6
                          text-gray-600 dark:text-gray-300"> {/* Description du modal */}
                {selectedStructure.description}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                className="px-5 py-2 rounded-md font-medium
                           bg-red-500 text-white hover:bg-red-600            {/* Mode clair */}
                           dark:bg-red-700 dark:hover:bg-red-600"            
                onClick={() => handleReject(selectedStructure.id)}
              >
                Rejeter
              </button>
              <button
                className="px-5 py-2 rounded-md font-medium
                           bg-blue-600 text-white hover:bg-blue-700           {/* Mode clair */}
                           dark:bg-blue-700 dark:hover:bg-blue-600"          
                onClick={() => handleApprove(selectedStructure.id)}
              >
                Approuver
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StructureTable;