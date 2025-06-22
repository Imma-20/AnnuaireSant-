// src/contexts/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Assurez-vous d'avoir axios installé: npm install axios

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true); // Pour gérer l'état de chargement initial
    const [role, setRole] = useState(localStorage.getItem('role') || null); // Stocke le rôle

    // Configure Axios pour inclure le token dans les requêtes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
        }
        if (role) {
            localStorage.setItem('role', role);
        } else {
            localStorage.removeItem('role');
        }
    }, [token, role]);

    // Fonction pour récupérer les infos utilisateur
    const fetchUser = useCallback(async () => {
        if (!token) {
            setUser(null);
            setRole(null);
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/user'); // Remplacez par l'URL de votre backend Laravel
            setUser(response.data.user);
            setRole(response.data.role); // Récupère et stocke le rôle
        } catch (error) {
            console.error('Failed to fetch user:', error);
            // Si le token est invalide ou expiré, déconnecter l'utilisateur
            logout();
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });
            const { access_token, utilisateur } = response.data;
            setToken(access_token);
            setUser(utilisateur);
            setRole(utilisateur.role); // Stocke le rôle après connexion
            return { success: true, role: utilisateur.role };
        } catch (error) {
            console.error('Login failed:', error);
            setUser(null);
            setToken(null);
            setRole(null);
            setLoading(false);
            // Gérer les erreurs spécifiques (ex: 401 pour identifiants incorrects)
            if (error.response && error.response.status === 401) {
                return { success: false, message: error.response.data.message || 'Identifiants incorrects.' };
            }
            return { success: false, message: 'Une erreur est survenue lors de la connexion.' };
        }
    };

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await axios.post('http://127.0.0.1:8000/api/register', userData);
            const { access_token, utilisateur } = response.data;
            setToken(access_token);
            setUser(utilisateur);
            setRole(utilisateur.role); // Stocke le rôle après enregistrement
            return { success: true, role: utilisateur.role };
        } catch (error) {
            console.error('Registration failed:', error);
            setUser(null);
            setToken(null);
            setRole(null);
            setLoading(false);
            return { success: false, message: error.response.data.message || 'Une erreur est survenue lors de l\'enregistrement.' };
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            if (token) {
                await axios.post('http://127.0.0.1:8000/api/logout');
            }
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setUser(null);
            setToken(null);
            setRole(null);
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            delete axios.defaults.headers.common['Authorization'];
            setLoading(false);
        }
    };

    const isAuthenticated = !!user && !!token; // Vérifie si l'utilisateur et le token sont présents

    return (
        <AuthContext.Provider value={{
            user,
            token,
            role,
            isAuthenticated,
            loading,
            login,
            register,
            logout,
            fetchUser // Expose fetchUser pour rafraîchir manuellement si besoin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);