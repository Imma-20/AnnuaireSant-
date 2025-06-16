// src/pages/StructureSantePage.tsx
import React, { useState } from 'react';
import { FaPlus, FaEye, FaBell, FaEdit, FaTrash } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

interface Structure {
  id: number;
  name: string;
  address: string; // Ajouté pour plus de réalisme
  contactEmail: string; // Ajouté
  description: string;
  status: "Approved" | "Pending";
  lastUpdate: string; // Date de dernière mise à jour
}

const initialStructures: Structure[] = [
  { id: 1, name: "Clinique du Bonheur", address: "123 Rue de la Joie", contactEmail: "bonheur@email.com", description: "Établissement privé spécialisé dans les soins primaires et la petite chirurgie.", status: "Approved", lastUpdate: "2024-05-20" },
  { id: 2, name: "Hôpital Central", address: "456 Avenue Principale", contactEmail: "central@email.com", description: "Grand complexe hospitalier public offrant une gamme complète de services médicaux.", status: "Pending", lastUpdate: "2024-04-10" },
  { id: 3, name: "Centre Médical Pro", address: "789 Boulevard de la Santé", contactEmail: "pro@email.com", description: "Clinique moderne axée sur la médecine préventive et le suivi personnalisé.", status: "Approved", lastUpdate: "2024-06-01" },
  { id: 4, name: "Polyclinique Alpha", address: "101 Chemin du Bien-Être", contactEmail: "alpha@email.com", description: "Établissement polyvalent qui regroupe plusieurs spécialités médicales et chirurgicales.", status: "Pending", lastUpdate: "2024-03-05" },
];

const StructureSantePage: React.FC = () => {
  const [structures, setStructures] = useState<Structure[]>(initialStructures);
  const [showModal, setShowModal] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<Structure | null>(null);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [currentStructureToEdit, setCurrentStructureToEdit] = useState<Structure | null>(null);

  const { theme } = useTheme();

  const handleViewDetails = (structure: Structure) => {
    setSelectedStructure(structure);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStructure(null);
  };

  const handleRemindUpdate = (structureId: number, structureName: string) => {
    alert(`Rappel de mise à jour envoyé à "${structureName}" (ID: ${structureId}) !`);
    // Ici, vous intégreriez la logique réelle pour envoyer une notification ou un email.
  };

  const handleAddStructure = () => {
    setCurrentStructureToEdit(null);
    setShowAddEditModal(true);
  };

  const handleEditStructure = (structure: Structure) => {
    setCurrentStructureToEdit(structure);
    setShowAddEditModal(true);
  };

  const handleDeleteStructure = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette structure ?")) {
      setStructures(structures.filter(s => s.id !== id));
      alert("Structure supprimée !");
    }
  };

  const handleSubmitAddEditStructure = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = form.name.value;
    const address = form.address.value;
    const contactEmail = form.contactEmail.value;
    const description = form.description.value;
    const status = form.status.value as "Approved" | "Pending";

    if (!name || !address || !contactEmail || !description || !status) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (currentStructureToEdit) {
      // Modifier une structure existante
      setStructures(structures.map(s =>
        s.id === currentStructureToEdit.id
          ? { ...s, name, address, contactEmail, description, status, lastUpdate: new Date().toISOString().slice(0, 10) }
          : s
      ));
    } else {
      // Ajouter une nouvelle structure
      const newId = structures.length > 0 ? Math.max(...structures.map(s => s.id)) + 1 : 1;
      const newStructure: Structure = {
        id: newId,
        name,
        address,
        contactEmail,
        description,
        status,
        lastUpdate: new Date().toISOString().slice(0, 10),
      };
      setStructures([...structures, newStructure]);
    }
    setShowAddEditModal(false);
    setCurrentStructureToEdit(null);
    alert(currentStructureToEdit ? "Structure mise à jour !" : "Nouvelle structure ajoutée !");
  };


  return (
    <div className="p-6 rounded-lg shadow-md
                    bg-white dark:bg-gray-800
                    text-gray-800 dark:text-gray-100
                    transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4">Gestion des Structures de Santé</h1>

      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddStructure}
          className="px-6 py-2 rounded-md font-medium flex items-center space-x-2
                     bg-green-600 text-white hover:bg-green-700
                     dark:bg-green-700 dark:hover:bg-green-600
                     transition-colors duration-200"
        >
          <FaPlus /> <span>Ajouter une structure</span>
        </button>
      </div>

      {structures.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Aucune structure de santé enregistrée.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y
                            divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Adresse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dernière maj</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y
                               divide-gray-200 dark:divide-gray-700">
              {structures.map((structure) => (
                <tr key={structure.id} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{structure.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{structure.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                      ${structure.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'}`}>
                      {structure.status === 'Approved' ? 'Approuvée' : 'En Attente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{structure.lastUpdate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(structure)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200"
                        title="Voir détails"
                      >
                        <FaEye className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleRemindUpdate(structure.id, structure.name)}
                        className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-200"
                        title="Rappeler mise à jour"
                      >
                        <FaBell className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleEditStructure(structure)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                        title="Modifier"
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDeleteStructure(structure.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                        title="Supprimer"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Détails de la Structure */}
      {showModal && selectedStructure && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 relative
                          bg-white dark:bg-gray-800
                          text-gray-800 dark:text-gray-100">
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-2xl
                         text-gray-500 hover:text-gray-800
                         dark:text-gray-300 dark:hover:text-gray-100"
            >
              <FiX />
            </button>
            <h3 className="text-2xl font-bold mb-4">{selectedStructure.name}</h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-200">
              <p><span className="font-semibold">Adresse:</span> {selectedStructure.address}</p>
              <p><span className="font-semibold">Email de Contact:</span> {selectedStructure.contactEmail}</p>
              <p><span className="font-semibold">Statut:</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-sm font-semibold
                                  ${selectedStructure.status === 'Approved' ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'}`}>
                  {selectedStructure.status === 'Approved' ? 'Approuvée' : 'En Attente'}
                </span>
              </p>
              <p><span className="font-semibold">Dernière mise à jour:</span> {selectedStructure.lastUpdate}</p>
              <p className="mt-4"><span className="font-semibold">Description:</span></p>
              <p className="whitespace-pre-wrap">{selectedStructure.description}</p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="px-5 py-2 rounded-md font-medium
                           bg-yellow-500 text-white hover:bg-yellow-600
                           dark:bg-yellow-700 dark:hover:bg-yellow-600"
                onClick={() => handleRemindUpdate(selectedStructure.id, selectedStructure.name)}
              >
                Envoyer un rappel de mise à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour Ajouter/Modifier une Structure */}
      {showAddEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 relative
                          bg-white dark:bg-gray-800
                          text-gray-800 dark:text-gray-100">
            <button
              onClick={() => setShowAddEditModal(false)}
              className="absolute top-3 right-3 text-2xl
                         text-gray-500 hover:text-gray-800
                         dark:text-gray-300 dark:hover:text-gray-100"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">{currentStructureToEdit ? 'Modifier la structure' : 'Ajouter une nouvelle structure'}</h3>
            <form onSubmit={handleSubmitAddEditStructure} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nom de la structure</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={currentStructureToEdit?.name || ''}
                  className="w-full p-2 rounded-md border
                             border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-900
                             text-gray-800 dark:text-gray-100
                             focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium mb-1">Adresse</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={currentStructureToEdit?.address || ''}
                  className="w-full p-2 rounded-md border
                             border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-900
                             text-gray-800 dark:text-gray-100
                             focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">Email de Contact</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  defaultValue={currentStructureToEdit?.contactEmail || ''}
                  className="w-full p-2 rounded-md border
                             border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-900
                             text-gray-800 dark:text-gray-100
                             focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={currentStructureToEdit?.description || ''}
                  rows={4}
                  className="w-full p-2 rounded-md border
                             border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-900
                             text-gray-800 dark:text-gray-100
                             focus:ring-blue-500 focus:border-blue-500 resize-y"
                  required
                ></textarea>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">Statut</label>
                <select
                  id="status"
                  name="status"
                  defaultValue={currentStructureToEdit?.status || 'Pending'}
                  className="w-full p-2 rounded-md border
                             border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-900
                             text-gray-800 dark:text-gray-100
                             focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="Approved">Approuvée</option>
                  <option value="Pending">En Attente</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  className="px-5 py-2 rounded-md font-medium
                             bg-gray-200 text-gray-800 hover:bg-gray-300
                             dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md font-medium
                             bg-blue-600 text-white hover:bg-blue-700
                             dark:bg-blue-700 dark:hover:bg-blue-600"
                >
                  {currentStructureToEdit ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StructureSantePage;