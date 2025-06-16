// src/pages/CommentsPage.tsx
import React, { useState } from 'react';
import { FaUserCircle, FaThumbsUp, FaThumbsDown, FaReply } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';
import { FiX } from 'react-icons/fi';

interface Comment {
  id: number;
  author: string;
  avatarColor: string;
  content: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  replies?: Comment[]; // Pour les réponses imbriquées
}

const initialComments: Comment[] = [
  {
    id: 1,
    author: 'Alice Dupont',
    avatarColor: 'bg-indigo-300',
    content: 'Excellent article, très instructif ! J\'ai appris beaucoup de choses.',
    date: '2024-06-14 10:30',
    status: 'approved',
  },
  {
    id: 2,
    author: 'Bob Martin',
    avatarColor: 'bg-green-300',
    content: 'J\'ai quelques questions concernant les statistiques présentées. Est-il possible d\'obtenir plus de détails ?',
    date: '2024-06-14 11:45',
    status: 'pending',
  },
  {
    id: 3,
    author: 'Charlie Legrand',
    avatarColor: 'bg-orange-300',
    content: 'Contenu peu clair et difficile à comprendre. À revoir.',
    date: '2024-06-13 15:00',
    status: 'pending',
  },
  {
    id: 4,
    author: 'Diana Prince',
    avatarColor: 'bg-purple-300',
    content: 'Merci pour ce travail formidable ! Très pertinent.',
    date: '2024-06-13 18:20',
    status: 'approved',
  },
];

const CommentsPage: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newCommentContent, setNewCommentContent] = useState('');
  const { theme } = useTheme();

  const handleApprove = (id: number) => {
    setComments(comments.map(c => c.id === id ? { ...c, status: 'approved' } : c));
  };

  const handleReject = (id: number) => {
    setComments(comments.map(c => c.id === id ? { ...c, status: 'rejected' } : c));
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      setComments(comments.filter(c => c.id !== id));
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCommentContent.trim() === '') return;

    const newComment: Comment = {
      id: comments.length + 1, // ID simple pour l'exemple
      author: 'Admin (Moi)', // Ou le nom de l'utilisateur connecté
      avatarColor: 'bg-blue-500', // Une couleur distinctive
      content: newCommentContent,
      date: new Date().toLocaleString(),
      status: 'approved', // Les commentaires de l'admin sont approuvés par défaut
    };
    setComments([newComment, ...comments]); // Ajoute le nouveau commentaire en haut
    setNewCommentContent('');
  };

  return (
    <div className="p-6 rounded-lg shadow-md
                    bg-white dark:bg-gray-800
                    text-gray-800 dark:text-gray-100
                    transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4">Gestion des Commentaires</h1>

      {/* Section pour ajouter un commentaire (Admin peut répondre ou commenter) */}
      <div className="mb-8 p-4 rounded-lg
                      bg-gray-50 dark:bg-gray-700
                      border border-gray-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold mb-3">Laisser un commentaire</h3>
        <form onSubmit={handleSubmitComment}>
          <textarea
            className="w-full p-3 mb-3 rounded-md border
                       border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-900
                       text-gray-800 dark:text-gray-100
                       focus:ring-blue-500 focus:border-blue-500 resize-y"
            rows={3}
            placeholder="Écrivez votre commentaire ici..."
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="px-6 py-2 rounded-md font-medium
                       bg-blue-600 text-white hover:bg-blue-700
                       dark:bg-blue-700 dark:hover:bg-blue-600
                       transition-colors duration-200"
          >
            Poster le commentaire
          </button>
        </form>
      </div>

      {/* Liste des commentaires */}
      <h2 className="text-xl font-bold mb-4">Tous les Commentaires ({comments.length})</h2>
      {comments.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">Aucun commentaire pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-lg shadow-sm
                                          bg-white dark:bg-gray-700
                                          border border-gray-200 dark:border-gray-600
                                          transition-colors duration-200">
              <div className="flex items-center mb-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${comment.avatarColor} text-white`}>
                  <FaUserCircle className="text-3xl" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{comment.author}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{comment.date}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-200 mb-3">{comment.content}</p>

              <div className="flex items-center space-x-3 text-sm">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
                                  ${comment.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' :
                                    comment.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-100' :
                                    'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'}`}>
                  {comment.status === 'approved' ? 'Approuvé' : comment.status === 'pending' ? 'En attente' : 'Rejeté'}
                </span>

                {comment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(comment.id)}
                      className="flex items-center space-x-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      title="Approuver ce commentaire"
                    >
                      <FaThumbsUp /> <span>Approuver</span>
                    </button>
                    <button
                      onClick={() => handleReject(comment.id)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Rejeter ce commentaire"
                    >
                      <FaThumbsDown /> <span>Rejeter</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                  title="Supprimer ce commentaire"
                >
                  <FiX /> <span>Supprimer</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsPage;