// src/api/axiosConfig.ts (ou .js)

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // L'URL de base de votre API Laravel
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Ou où que vous stockiez votre token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;