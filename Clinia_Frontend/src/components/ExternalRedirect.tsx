// src/components/ExternalRedirect.jsx
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Assurez-vous que le chemin est correct
import { useNavigate } from 'react-router-dom';

const ExternalRedirect = ({ to, allowedRoles }) => {
    const { isAuthenticated, loading, role } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (isAuthenticated && allowedRoles && allowedRoles.includes(role)) {
                // Effectue la redirection externe
                window.location.href = to;
            } else if (!isAuthenticated) {
                // Si non authentifié, redirige vers la page de connexion dans l'application actuelle
                localStorage.setItem('redirectPath', window.location.pathname); // Stocke le chemin prévu
                navigate('/login');
            } else {
                // Si authentifié mais que le rôle n'est pas autorisé, redirige vers l'accueil ou affiche une alerte
                alert('Accès non autorisé !');
                navigate('/');
            }
        }
    }, [isAuthenticated, loading, role, allowedRoles, to, navigate]);

    if (loading) {
        return <div>Vérification de l'accès...</div>; // Ou un indicateur de chargement
    }

    // Ce composant effectuera une redirection, il ne rendra donc rien après la redirection
    // à moins qu'il n'y ait une erreur ou qu'il soit toujours en chargement.
    return null; // Ou un indicateur de chargement avant que la redirection ne se produise
};

export default ExternalRedirect;