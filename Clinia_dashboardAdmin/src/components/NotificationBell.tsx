import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaBell } from "react-icons/fa"; // Icône de cloche

// Interface pour structurer chaque notification comme dans votre exemple d'image
interface Notification {
  id: string; // Un ID unique pour la clé React
  avatar: string; // URL de l'avatar ou icône pour le type de notification
  title: string;
  content: string;
  time: string; // Ex: "2 min ago", "1 hour ago"
  read: boolean; // Pour gérer l'état lu/non lu
  group: 'today' | 'yesterday' | 'older'; // Pour regrouper les notifications
}

const NotificationBell: React.FC = () => {
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState<boolean>(false);
  const notificationsDropdownRef = useRef<HTMLDivElement>(null);

  // Tableau de notifications (simulé pour l'exemple)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif1',
      avatar: 'https://via.placeholder.com/32/FF6347/FFFFFF?text=UI', // Exemple d'avatar
      title: 'UI/UX Design',
      content: 'Lorem ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type',
      time: '2 min ago',
      read: false,
      group: 'today',
    },
    {
      id: 'notif2',
      avatar: 'https://via.placeholder.com/32/4682B4/FFFFFF?text=Msg', // Exemple d'avatar
      title: 'Message',
      content: 'Lorem ipsum has been the industry\'s standard dummy text ever since the 1500.',
      time: '1 hour ago',
      read: false,
      group: 'today',
    },
    {
      id: 'notif3',
      avatar: 'https://via.placeholder.com/32/32CD32/FFFFFF?text=F', // Exemple d'avatar
      title: 'Forms',
      content: 'Lorem ipsum has been the industry\'s standard dummy text ever since the 1500.',
      time: '2 hour ago',
      read: true, // Cette notification est lue
      group: 'yesterday',
    },
    {
      id: 'notif4',
      avatar: 'https://via.placeholder.com/32/FFD700/FFFFFF?text=P',
      title: 'Projects',
      content: 'Nouveau projet ajouté. Veuillez vérifier le tableau de bord des projets pour les détails.',
      time: 'Hier soir',
      read: false,
      group: 'yesterday',
    },
    {
      id: 'notif5',
      avatar: 'https://via.placeholder.com/32/8A2BE2/FFFFFF?text=S',
      title: 'Security Alert',
      content: 'Tentative de connexion suspecte détectée sur votre compte il y a 3 jours. Vérifiez l\'activité de votre compte.',
      time: '3 days ago',
      read: true,
      group: 'older',
    },
    {
      id: 'notif6',
      avatar: 'https://via.placeholder.com/32/00CED1/FFFFFF?text=U',
      title: 'User Feedback',
      content: 'Nouveau feedback utilisateur sur la page de contact. Merci de consulter la section des feedbacks.',
      time: '5 days ago',
      read: false,
      group: 'older',
    },
  ]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Regrouper les notifications
  const groupedNotifications = {
    today: notifications.filter(n => n.group === 'today'),
    yesterday: notifications.filter(n => n.group === 'yesterday'),
    older: notifications.filter(n => n.group === 'older'),
  };

  // --- Handlers ---
  const handleMarkAsRead = useCallback((id: string) => {
    setNotifications(prevNotifs =>
      prevNotifs.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  const handleMarkAllAsRead = useCallback(() => {
    setNotifications(prevNotifs => prevNotifs.map(notif => ({ ...notif, read: true })));
  }, []);

  const handleClearAllNotifications = useCallback(() => {
    setNotifications([]);
    setShowNotificationsDropdown(false); // Fermer le dropdown après avoir vidé
  }, []);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (notificationsDropdownRef.current && !notificationsDropdownRef.current.contains(event.target as Node)) {
      setShowNotificationsDropdown(false);
    }
  }, []);

  // --- Effets de bord ---
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside); // Utilisez mousedown pour une meilleure détection
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div ref={notificationsDropdownRef} className="relative">
      <FaBell
        className="text-gray-600 cursor-pointer text-xl"
        title="Voir les notifications"
        onClick={() => setShowNotificationsDropdown((prev) => !prev)}
      />
      {unreadNotificationsCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-white">
          {unreadNotificationsCount}
        </span>
      )}

      {showNotificationsDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto z-20 transform origin-top-right transition-all duration-200 ease-out animate-fade-in-down">
          {/* Entête des notifications */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <span className="font-semibold text-lg text-gray-800">Notifications</span>
            <span
              className="text-blue-500 hover:text-blue-700 cursor-pointer text-sm font-medium"
              onClick={handleMarkAllAsRead}
            >
              Mark all read
            </span>
          </div>

          {/* Contenu des notifications */}
          <ul className="divide-y divide-gray-100">
            {unreadNotificationsCount === 0 && notifications.length === 0 ? (
              <li className="p-4 text-center text-gray-500 text-sm">Aucune nouvelle notification.</li>
            ) : (
              <>
                {/* Groupe "Today" */}
                {groupedNotifications.today.length > 0 && (
                  <li className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">Today</li>
                )}
                {groupedNotifications.today.map((notif) => (
                  <li
                    key={notif.id}
                    className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${notif.read ? 'bg-white text-gray-600' : 'bg-blue-50 bg-opacity-75 font-medium text-gray-800'}`}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <img
                      src={notif.avatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full mr-3 flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-900">{notif.title}</span>
                        <span className="text-xs text-gray-500">{notif.time}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-snug break-words">
                        {notif.content}
                      </p>
                    </div>
                  </li>
                ))}

                {/* Groupe "Yesterday" */}
                {groupedNotifications.yesterday.length > 0 && (
                  <li className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">Yesterday</li>
                )}
                {groupedNotifications.yesterday.map((notif) => (
                  <li
                    key={notif.id}
                    className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${notif.read ? 'bg-white text-gray-600' : 'bg-blue-50 bg-opacity-75 font-medium text-gray-800'}`}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <img
                      src={notif.avatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full mr-3 flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-900">{notif.title}</span>
                        <span className="text-xs text-gray-500">{notif.time}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-snug break-words">
                        {notif.content}
                      </p>
                    </div>
                  </li>
                ))}

                {/* Groupe "Older" */}
                {groupedNotifications.older.length > 0 && (
                  <li className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">Older</li>
                )}
                {groupedNotifications.older.map((notif) => (
                  <li
                    key={notif.id}
                    className={`flex items-start p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${notif.read ? 'bg-white text-gray-600' : 'bg-blue-50 bg-opacity-75 font-medium text-gray-800'}`}
                    onClick={() => handleMarkAsRead(notif.id)}
                  >
                    <img
                      src={notif.avatar}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full mr-3 flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-semibold text-gray-900">{notif.title}</span>
                        <span className="text-xs text-gray-500">{notif.time}</span>
                      </div>
                      <p className="text-xs text-gray-700 leading-snug break-words">
                        {notif.content}
                      </p>
                    </div>
                  </li>
                ))}

                {/* Pied de page des notifications */}
                {notifications.length > 0 && (
                  <li className="p-3 text-center border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <span
                      className="text-red-500 hover:underline cursor-pointer text-sm font-medium"
                      onClick={handleClearAllNotifications}
                    >
                      Clear all Notifications
                    </span>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;