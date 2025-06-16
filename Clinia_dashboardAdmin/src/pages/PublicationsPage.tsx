// src/pages/PublicationsPage.tsx
import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

interface Publication {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
}

const initialPublications: Publication[] = [
  {
    id: 1,
    title: 'Les Nouveautés de l\'Application Mobile Santé',
    content: 'Découvrez les dernières fonctionnalités de notre application mobile, incluant un suivi amélioré des rendez-vous et une interface utilisateur plus intuitive.',
    author: 'Admin Santé',
    date: '2024-06-10',
  },
  {
    id: 2,
    title: 'Rapport Annuel sur la Santé Publique 2023',
    content: 'Notre rapport annuel détaille les avancées et les défis du secteur de la santé publique au cours de l\'année écoulée, avec un focus sur les initiatives communautaires.',
    author: 'Dr. Ben',
    date: '2024-05-28',
  },
  {
    id: 3,
    title: 'Conseils pour une Meilleure Hygiène de Vie',
    content: 'Un guide simple pour adopter des habitudes saines au quotidien : alimentation équilibrée, exercice régulier et gestion du stress.',
    author: 'Equipe Bien-être',
    date: '2024-05-15',
  },
];

const PublicationsPage: React.FC = () => {
  const [publications, setPublications] = useState<Publication[]>(initialPublications);
  const [showModal, setShowModal] = useState(false);
  const [currentPublication, setCurrentPublication] = useState<Publication | null>(null);
  const { theme } = useTheme();

  const handleAddPublication = () => {
    setCurrentPublication(null); // Réinitialise pour un nouvel ajout
    setShowModal(true);
  };

  const handleEditPublication = (pub: Publication) => {
    setCurrentPublication(pub);
    setShowModal(true);
  };

  const handleDeletePublication = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")) {
      setPublications(publications.filter(pub => pub.id !== id));
    }
  };

  const handleSubmitPublication = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const title = form.publicationTitle.value;
    const content = form.publicationContent.value;
    const author = form.publicationAuthor.value;

    if (!title || !content || !author) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (currentPublication) {
      // Modifier une publication existante
      setPublications(publications.map(pub =>
        pub.id === currentPublication.id
          ? { ...pub, title, content, author }
          : pub
      ));
    } else {
      // Ajouter une nouvelle publication
      const newPub: Publication = {
        id: publications.length > 0 ? Math.max(...publications.map(p => p.id)) + 1 : 1,
        title,
        content,
        author,
        date: new Date().toISOString().slice(0, 10), // Date actuelle (AAAA-MM-JJ)
      };
      setPublications([newPub, ...publications]);
    }
    setShowModal(false);
    setCurrentPublication(null);
  };

  return (
    <div className="p-6 rounded-lg shadow-md
                    bg-white dark:bg-gray-800
                    text-gray-800 dark:text-gray-100
                    transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4">Gestion des Publications</h1>

      <div className="mb-6">
        <button
          onClick={handleAddPublication}
          className="px-6 py-2 rounded-md font-medium flex items-center space-x-2
                     bg-green-600 text-white hover:bg-green-700
                     dark:bg-green-700 dark:hover:bg-green-600
                     transition-colors duration-200"
        >
          <FaPlus /> <span>Ajouter une publication</span>
        </button>
      </div>

      {publications.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Aucune publication pour le moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.map((pub) => (
            <div key={pub.id} className="p-5 rounded-lg shadow-sm border
                                        bg-white dark:bg-gray-700
                                        border-gray-200 dark:border-gray-600
                                        transition-colors duration-200">
              <h3 className="text-xl font-semibold mb-2">{pub.title}</h3>
              <p className="text-gray-700 dark:text-gray-200 text-sm mb-3 line-clamp-3">{pub.content}</p>
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Par: {pub.author}</span>
                <span>Date: {pub.date}</span>
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => handleEditPublication(pub)}
                  className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-700"
                  title="Modifier"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDeletePublication(pub.id)}
                  className="p-2 rounded-full text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-700"
                  title="Supprimer"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal pour ajouter/modifier une publication */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg shadow-xl w-full max-w-lg mx-auto p-6 relative
                          bg-white dark:bg-gray-800
                          text-gray-800 dark:text-gray-100">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-2xl
                         text-gray-500 hover:text-gray-800
                         dark:text-gray-300 dark:hover:text-gray-100"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">{currentPublication ? 'Modifier la publication' : 'Ajouter une nouvelle publication'}</h3>
            <form onSubmit={handleSubmitPublication}>
              <div className="mb-4">
                <label htmlFor="publicationTitle" className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  id="publicationTitle"
                  name="publicationTitle"
                  defaultValue={currentPublication?.title || ''}
                  className="w-full p-2 rounded-md border
                             border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-900
                             text-gray-800 dark:text-gray-100
                             focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="publicationAuthor" className="block text-sm font-medium mb-1">Auteur</label>
                <input
                  type="text"
                  id="publicationAuthor"
                  name="publicationAuthor"
                  defaultValue={currentPublication?.author || ''}
                  className="w-full p-2 rounded-md border
                             border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-900
                             text-gray-800 dark:text-gray-100
                             focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="publicationContent" className="block text-sm font-medium mb-1">Contenu</label>
                <textarea
                  id="publicationContent"
                  name="publicationContent"
                  defaultValue={currentPublication?.content || ''}
                  rows={6}
                  className="w-full p-2 rounded-md border
                             border-gray-300 dark:border-gray-600
                             bg-white dark:bg-gray-900
                             text-gray-800 dark:text-gray-100
                             focus:ring-blue-500 focus:border-blue-500 resize-y"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-md font-medium
                             bg-gray-200 text-gray-800 hover:bg-gray-300
                             dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500
                             transition-colors duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md font-medium
                             bg-blue-600 text-white hover:bg-blue-700
                             dark:bg-blue-700 dark:hover:bg-blue-600
                             transition-colors duration-200"
                >
                  {currentPublication ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicationsPage;