// src/pages/NotificationsPage.tsx
import React, { useState } from 'react';
import { FaBell, FaCheckCircle, FaTrash } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

const initialNotifications: Notification[] = [
  { id: 1, message: 'Nouvelle structure "Clinique du Bonheur" en attente d\'approbation.', date: 'Il y a 5 min', read: false, type: 'info' },
  { id: 2, message: 'La publication "Les bienfaits de la marche" a été mise à jour.', date: 'Il y a 1 heure', read: false, type: 'success' },
  { id: 3, message: 'Erreur de connexion détectée sur l\'API des structures.', date: 'Hier', read: true, type: 'error' },
  { id: 4, message: 'Votre abonnement premium expire dans 3 jours.', date: '2 jours', read: false, type: 'warning' },
  { id: 5, message: 'Nouveau commentaire sur votre dernier article.', date: '3 jours', read: true, type: 'info' },
];

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const { theme } = useTheme();

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })));
  };

  const deleteAllNotifications = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les notifications ?")) {
      setNotifications([]);
    }
  };

  // Filtrer les notifications non lues
  const unreadNotifications = notifications.filter(notif => !notif.read).length;

  const getTypeColorClass = (type: Notification['type']) => {
    switch (type) {
      case 'info': return theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
      case 'warning': return theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600';
      case 'success': return theme === 'dark' ? 'text-green-400' : 'text-green-600';
      case 'error': return theme === 'dark' ? 'text-red-400' : 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-6 rounded-lg shadow-md
                    bg-white dark:bg-gray-800
                    text-gray-800 dark:text-gray-100
                    transition-colors duration-300">
      <h1 className="text-2xl font-bold mb-4">Mes Notifications</h1>

      <div className="flex justify-between items-center mb-6">
        <p className="text-gray-600 dark:text-gray-300">
          Vous avez <span className="font-semibold">{unreadNotifications}</span> notification(s) non lue(s).
        </p>
        <div className="space-x-2">
          <button
            onClick={markAllAsRead}
            disabled={unreadNotifications === 0}
            className="px-4 py-2 rounded-md text-sm font-medium
                       bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed
                       dark:bg-blue-700 dark:text-blue-100 dark:hover:bg-blue-600"
          >
            Tout marquer comme lu
          </button>
          <button
            onClick={deleteAllNotifications}
            disabled={notifications.length === 0}
            className="px-4 py-2 rounded-md text-sm font-medium
                       bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed
                       dark:bg-red-700 dark:text-red-100 dark:hover:bg-red-600"
          >
            Tout supprimer
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400">
          <FaBell className="mx-auto text-5xl mb-4" />
          <p>Vous n'avez aucune notification pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`flex items-center p-4 rounded-lg shadow-sm border
                          ${notif.read ? 'bg-gray-50 dark:bg-gray-700' : 'bg-blue-50 dark:bg-blue-900/50 font-semibold'}
                          ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}
                          transition-colors duration-200`}
            >
              <FaBell className={`text-xl mr-4 ${getTypeColorClass(notif.type)}`} />
              <div className="flex-1">
                <p className={`text-gray-800 dark:text-gray-100 ${notif.read ? 'font-normal' : 'font-semibold'}`}>{notif.message}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{notif.date}</p>
              </div>
              <div className="flex space-x-2">
                {!notif.read && (
                  <button
                    onClick={() => markAsRead(notif.id)}
                    className="p-2 rounded-full text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-700"
                    title="Marquer comme lu"
                  >
                    <FaCheckCircle />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif.id)}
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
    </div>
  );
};

export default NotificationsPage;