// src/pages/StructureLocationPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MapComponent from '../components/MapComponent';
import Footer from '../components/Footer'; // Assurez-vous d'avoir un composant Footer
import api from '../api/axiosConfig';
import { MapPin, XCircle, Router } from 'lucide-react'; // Icônes
import './StructureLocationPage.css'; // Créez ou mettez à jour ce fichier CSS

const StructureLocationPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [structureData, setStructureData] = useState(location.state || null);
    const [loading, setLoading] = useState(!location.state);
    const [error, setError] = useState(null);
    const [userLocation, setUserLocation] = useState(null); // Pour stocker la position de l'utilisateur
    const [distance, setDistance] = useState(null); // Pour stocker la distance

    // Fonction pour calculer la distance (Haversine Formula)
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const d = R * c; // in metres
        return d;
    };

    useEffect(() => {
        // Obtenir la localisation de l'utilisateur
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation([latitude, longitude]);
                },
                (err) => {
                    console.warn(`ERROR(${err.code}): ${err.message}`);
                    // setLocationError("Impossible d'obtenir votre position. Veuillez autoriser la géolocalisation.");
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }, []); // S'exécute une seule fois au montage pour obtenir la position utilisateur

    useEffect(() => {
        // Si structureData n'est pas disponible ET qu'un ID est présent, récupérez-le depuis l'API
        if (!structureData && id) {
            const fetchStructureDetails = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await api.get(`/structures-sante/${id}`);
                    setStructureData(response.data.structure);
                } catch (err) {
                    console.error("Erreur lors de la récupération des détails de la structure pour la carte :", err);
                    setError(err.response?.data?.message || "Structure introuvable ou erreur de chargement des détails.");
                } finally {
                    setLoading(false);
                }
            };
            fetchStructureDetails();
        } else if (!id) {
            setError("Aucun ID de structure fourni dans l'URL.");
            setLoading(false);
        }
    }, [id, structureData, location.state]);

    // Calcul de la distance une fois que les deux localisations sont disponibles
    useEffect(() => {
        if (userLocation && structureData?.latitude && structureData?.longitude) {
            const dist = calculateDistance(
                userLocation[0], userLocation[1],
                structureData.latitude, structureData.longitude
            );
            // Formater la distance pour l'affichage (mètres ou kilomètres)
            if (dist < 1000) {
                setDistance(`${Math.round(dist)} m`);
            } else {
                setDistance(`${(dist / 1000).toFixed(2)} km`);
            }
        } else {
             setDistance("Calcul de distance en attente de votre position...");
        }
    }, [userLocation, structureData]);


    if (loading) return (
        <div className="structure-location-page">
            <Header />
            <main className="location-content">
                <p className="loading-message">Chargement de la localisation de la structure...</p>
            </main>
            <Footer />
        </div>
    );
    if (error) return (
        <div className="structure-location-page">
            <Header />
            <main className="location-content">
                <p className="error-message">Erreur: {error}</p>
            </main>
            <Footer />
        </div>
    );
    if (!structureData || typeof structureData.latitude !== 'number' || typeof structureData.longitude !== 'number' || isNaN(structureData.latitude) || isNaN(structureData.longitude)) {
        return (
            <div className="structure-location-page">
                <Header />
                <main className="location-content">
                    <p className="no-data-message">Détails de localisation non disponibles pour cette structure.</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="structure-location-page">
            <Header />
            <main className="location-content">
                <div className="header-section">
                    <h2 className="page-title">Localisation de {structureData.nom_structure}</h2>
                    <button onClick={() => navigate(-1)} className="close-button">
                        <XCircle size={20} className="icon" />
                        Fermer la carte
                    </button>
                </div>

                <p className="structure-address">Adresse: {structureData.adresse}, {structureData.ville}</p>

                <div className="map-container-wrapper"> {/* Conteneur pour la carte */}
                    <MapComponent
                        latitude={structureData.latitude}
                        longitude={structureData.longitude}
                        name={structureData.nom_structure}
                        address={structureData.adresse}
                        zoom={15} // Zoom par défaut pour une structure spécifique
                    />
                </div>

                <div className="distance-info">
                    {distance ? (
                        <p>Distance de votre position : **{distance}**</p>
                    ) : (
                        <p>Calcul de la distance...</p>
                    )}
                     <p className="geolocation-note">
                        <MapPin size={16} className="inline-icon" /> Pour un calcul précis, veuillez autoriser la géolocalisation dans votre navigateur.
                    </p>
                </div>

                {/* Le bouton "Retour aux résultats" est déplacé vers le haut avec "Fermer la carte" pour une meilleure UX */}
                {/* <div className="back-button-container">
                    <button onClick={() => navigate(-1)} className="back-button">
                        Retour aux résultats
                    </button>
                </div> */}
            </main>
            <Footer />
        </div>
    );
};

export default StructureLocationPage;