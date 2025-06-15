import React, { useState } from "react"; // Importez useState
import { FaUserCircle } from "react-icons/fa";
import { FiMoreHorizontal, FiX } from "react-icons/fi"; // Importez FiX pour le bouton fermer du modal

// Définition de l'interface pour une meilleure typographie
interface Structure {
  id: number;
  name: string;
  description: string; // La description complète à afficher dans le modal
  status: "Approved" | "Pending";
  date: string;
  avatarColor: string;
  // Vous pouvez ajouter d'autres champs ici, ex:
  // details: string; // Pour un contenu encore plus riche
  // imageUrl: string;
  // contactInfo: string;
}

const StructureTable = () => {
  const structures: Structure[] = [
    {
      id: 1,
      name: "Clinique du Bonheur",
      description: "La Clinique du Bonheur est un établissement privé spécialisé dans les soins primaires et la petite chirurgie. Située au cœur de la ville, elle offre un environnement calme et des équipements modernes pour le bien-être de ses patients. Son équipe est composée de médecins généralistes, d'infirmières et de personnel de soutien dévoués. Notre objectif est de fournir des soins de qualité supérieure et un service personnalisé à chaque individu. Nous proposons également des consultations spécialisées sur rendez-vous.",
      status: "Approved",
      date: "11 MAY 12:56",
      avatarColor: "bg-blue-300",
    },
    {
      id: 2,
      name: "Hôpital Central",
      description: "L'Hôpital Central est un grand complexe hospitalier public offrant une gamme complète de services médicaux, y compris les urgences, la chirurgie, la pédiatrie, la cardiologie et la maternité. Il est un centre de référence régional et dispose des dernières technologies médicales. Nous nous engageons à la formation continue de notre personnel et à la recherche pour améliorer constamment nos pratiques. L'hôpital fonctionne 24h/24, 7j/7, pour répondre à tous les besoins de santé de la communauté.",
      status: "Pending",
      date: "11 MAY 10:35",
      avatarColor: "bg-pink-300",
    },
    {
      id: 3,
      name: "Centre Médical Pro",
      description: "Le Centre Médical Pro est une clinique moderne axée sur la médecine préventive et le suivi personnalisé. Nous offrons des bilans de santé complets, des consultations de spécialistes et des programmes de bien-être. Notre approche est holistique, visant à améliorer la qualité de vie de nos patients par des conseils adaptés et un suivi régulier. Les équipements de diagnostic sont à la pointe de la technologie pour des résultats précis et rapides.",
      status: "Approved",
      date: "9 MAY 17:38",
      avatarColor: "bg-green-300",
    },
    {
      id: 4,
      name: "Polyclinique Alpha",
      description: "La Polyclinique Alpha est un établissement polyvalent qui regroupe plusieurs spécialités médicales et chirurgicales sous un même toit. Elle est reconnue pour ses services d'orthopédie, de dermatologie et d'ophtalmologie. L'établissement met l'accent sur la coordination des soins pour offrir un parcours patient fluide et efficace. Un service d'imagerie médicale complet est également disponible sur place.",
      status: "Pending",
      date: "19 MAY 12:56",
      avatarColor: "bg-purple-300",
    },
    {
      id: 5,
      name: "Dispensaire Communautaire",
      description: "Le Dispensaire Communautaire est une structure de santé de proximité dédiée aux populations défavorisées. Il propose des consultations gratuites ou à faible coût, des campagnes de vaccination et des programmes de sensibilisation à la santé publique. Notre mission est de rendre les soins accessibles à tous, en particulier dans les zones rurales. Nous travaillons en étroite collaboration avec les associations locales pour identifier les besoins et apporter un soutien adapté.",
      status: "Approved",
      date: "21 MAY 12:56",
      avatarColor: "bg-teal-300",
    },
    {
      id: 6,
      name: "Clinique A",
      description: "Une clinique privée, Lorem Ipsum est simplement un texte fictif. Elle fournit des services de santé généraux et spécialisés à la communauté locale, avec un accent sur le confort du patient et l'innovation médicale.",
      status: "Pending",
      date: "21 MAY 12:56",
      avatarColor: "bg-yellow-300",
    },
    {
      id: 7,
      name: "Hôpital B",
      description: "Un hôpital général, Lorem Ipsum est simplement un texte fictif. Doté d'un service d'urgence performant et de plusieurs unités de soins intensifs, cet hôpital est un pilier de la santé publique dans la région.",
      status: "Approved",
      date: "21 MAY 12:56",
      avatarColor: "bg-red-300",
    },
    // Ajoutez plus d'entrées si nécessaire
  ];

  // État pour contrôler l'affichage du modal
  const [showModal, setShowModal] = useState(false);
  // État pour stocker la structure dont on veut lire le contenu
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null);

  // Fonction pour ouvrir le modal
  const handleReadContent = (structure: Structure) => {
    setSelectedStructure(structure);
    setShowModal(true);
  };

  // Fonction pour fermer le modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStructure(null);
  };

  // Fonctions factices pour Approuver/Rejeter (à implémenter avec votre logique métier)
  const handleApprove = (id: number) => {
    alert(`Structure ${id} approuvée ! (Logique à implémenter)`);
    handleCloseModal(); // Ferme le modal après l'action
    // Ici, vous feriez un appel API pour mettre à jour le statut
  };

  const handleReject = (id: number) => {
    alert(`Structure ${id} rejetée ! (Logique à implémenter)`);
    handleCloseModal(); // Ferme le modal après l'action
    // Ici, vous feriez un appel API pour mettre à jour le statut
  };


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Structures de santé</h2>
      </div>

      <div className="overflow-y-auto max-h-96">
        {structures.map((structure) => (
          <div key={structure.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
            {/* Colonne de gauche: Avatar, Nom, Description */}
            <div className="flex items-center flex-grow min-w-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${structure.avatarColor} text-white`}>
                <FaUserCircle className="text-3xl text-gray-700" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 font-medium truncate">{structure.name}</p>
                <p className="text-sm text-gray-500 truncate">{structure.description.substring(0, 50)}...</p> {/* Aperçu de la description */}
              </div>
            </div>

            {/* Colonne du milieu: Statut et Date */}
            <div className="flex items-center text-sm text-gray-500 mx-4 flex-shrink-0">
              <span
                className={`w-2.5 h-2.5 rounded-full mr-2 ${
                  structure.status === "Approved" ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
              <span>{structure.date}</span>
            </div>

            {/* Colonne de droite: Boutons d'action et bouton "plus" */}
            <div className="flex items-center space-x-2 flex-shrink-0 relative"> {/* Ajout de relative pour positionner le dropdown */}
              {/* Boutons Rejeter/Approuver (optionnel ici si on veut tout faire via le modal) */}
              <button
                className="bg-red-100 text-red-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-red-200"
                onClick={() => handleReject(structure.id)}
              >
                Rejeter
              </button>
              <button
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-sm font-medium hover:bg-blue-200"
                onClick={() => handleApprove(structure.id)}
              >
                Approuver
              </button>

              {/* Bouton "Plus" pour ouvrir le modal */}
              <button
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 relative">
            {/* Bouton Fermer */}
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
              aria-label="Fermer"
            >
              <FiX />
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-4">{selectedStructure.name}</h3>
            <p className="text-gray-600 mb-6 whitespace-pre-wrap">{selectedStructure.description}</p> {/* whitespace-pre-wrap pour garder les retours à la ligne */}

            <div className="flex justify-end space-x-3">
              <button
                className="bg-red-500 text-white px-5 py-2 rounded-md font-medium hover:bg-red-600"
                onClick={() => handleReject(selectedStructure.id)}
              >
                Rejeter
              </button>
              <button
                className="bg-blue-600 text-white px-5 py-2 rounded-md font-medium hover:bg-blue-700"
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