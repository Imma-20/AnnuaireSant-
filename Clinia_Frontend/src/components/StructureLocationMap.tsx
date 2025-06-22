// src/components/StructureLocationMap.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button"; // Pour le bouton de retour
import { MapPin, XCircle, Route as RouteIcon } from 'lucide-react'; // Icônes
import Header from './Header'; // Assurez-vous d'avoir ce composant
import Footer from './Footer'; // Assurez-vous d'avoir ce composant
import './StructureLocationMap.css'; // Importez le CSS pour les styles personnalisés

// Correction de l'icône de marqueur par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


// Composant Helper pour centrer la carte
function ChangeView({ center, zoom }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
}

const StructureLocationMap = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Destructuration avec une valeur par défaut vide pour éviter les erreurs si location.state est null
    // Maintenant, 'name' et 'address' peuvent être pour UNE structure spécifique ou null si on affiche toutes les 'structures'
    const { latitude, longitude, name, address, structures } = location.state || {};

    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState(null);
    // Initialisation de mapCenter: Si une lat/long spécifique est passée, l'utiliser. Sinon, le Bénin.
    // Si 'structures' est présent et non vide, on pourrait vouloir ajuster le centre plus tard
    // (par exemple, calculer le centroïde des structures ou juste le Bénin par défaut).
    const [mapCenter, setMapCenter] = useState(latitude && longitude ? [latitude, longitude] : [6.4000, 2.6167]);
    const [mapZoom, setMapZoom] = useState(latitude ? 15 : 9); // Zoom plus élevé si une structure est spécifiée

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
                    const { latitude: userLat, longitude: userLon } = position.coords;
                    setUserLocation([userLat, userLon]);

                    // Si aucune structure spécifique n'est passée (ex: on est sur une vue d'ensemble)
                    // et que l'utilisateur a autorisé la géolocalisation, centrer sur lui.
                    if (!latitude && !longitude && !structures) { // S'il n'y a pas de cible spécifique
                        setMapCenter([userLat, userLon]);
                        setMapZoom(13); // Zoom plus proche pour la position de l'utilisateur
                    }
                },
                (err) => {
                    console.error("Erreur de géolocalisation:", err);
                    setLocationError("Impossible d'obtenir votre position. Veuillez autoriser la géolocalisation.");
                    // Si la géolocalisation échoue et aucune structure spécifique n'est passée,
                    // la carte reste centrée sur le Bénin par défaut.
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setLocationError("La géolocalisation n'est pas supportée par votre navigateur.");
        }

        // Si une structure spécifique est passée, centrer la carte sur elle dès le départ
        // Cette logique est déjà gérée dans l'initialisation du state `mapCenter`
    }, []); // Dépendances vides pour que cela ne s'exécute qu'une fois au montage

    // Calcul de la distance une fois que la position utilisateur et la position cible sont disponibles
    useEffect(() => {
        // La distance n'est pertinente que s'il y a UNE structure spécifique passée
        if (userLocation && latitude && longitude) {
            const dist = calculateDistance(
                userLocation[0], userLocation[1],
                latitude, longitude
            );
            // Formater la distance pour l'affichage (mètres ou kilomètres)
            if (dist < 1000) {
                setDistance(`${Math.round(dist)} m`);
            } else {
                setDistance(`${(dist / 1000).toFixed(2)} km`);
            }
        } else if (userLocation && structures && structures.length > 0) {
            // Si on est sur la vue d'ensemble des structures, on ne calcule pas de distance unique
            setDistance("Plusieurs structures affichées. Distance non applicable.");
        }
        else {
            setDistance("Calcul de distance en attente de votre position...");
        }
    }, [userLocation, latitude, longitude, structures]);


    // Définir les tuiles OpenStreetMap
    const tilesUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    // Déterminer le titre de la page
    const pageTitle = name ? `Localisation de ${name}` : (structures && structures.length > 0 ? "Localisation des structures" : "Localisation sur la carte");
    const displayAddress = name && address ? `Adresse: ${address}` : "";

    return (
        <div className="structure-location-map-page">
            <Header />

            <main className="location-content-main">
                <div className="content-card"> {/* Utiliser une carte pour le contenu principal */}
                    <div className="header-section">
                        <h2 className="page-title">
                            <MapPin size={28} className="icon" />
                            {pageTitle}
                        </h2>
                        <Button
                            onClick={() => navigate(-1)}
                            variant="outline"
                            className="close-button"
                        >
                            <XCircle size={18} className="icon" />
                            Fermer la carte
                        </Button>
                    </div>

                    {displayAddress && (
                        <p className="structure-address">{displayAddress}</p>
                    )}

                    {locationError && (
                        <div className="error-alert" role="alert">
                            <strong className="font-bold">Erreur de géolocalisation:</strong>
                            <span className="block sm:inline"> {locationError}</span>
                        </div>
                    )}

                    <div className="map-container-wrapper">
                        <MapContainer
                            center={mapCenter}
                            zoom={mapZoom}
                            scrollWheelZoom={true}
                            className="h-full w-full" // Ces classes seront gérées par le CSS externe
                            // style={{ height: '100%', width: '100%', borderRadius: '8px' }} // Supprimé pour laisser le CSS prendre le dessus
                        >
                            <ChangeView center={mapCenter} zoom={mapZoom} />

                            <TileLayer
                                attribution={attribution}
                                url={tilesUrl}
                            />

                            {userLocation && (
                                <CircleMarker center={userLocation} radius={8} color="blue" fillColor="#30F" fillOpacity={0.7}>
                                    <Popup>Votre position actuelle</Popup>
                                </CircleMarker>
                            )}

                            {latitude && longitude && (
                                <Marker position={[latitude, longitude]}>
                                    <Popup>
                                        <h4 className="font-bold">{name}</h4>
                                        <p>{address}</p>
                                        {userLocation && distance && (
                                            <p className="text-sm text-gray-700 mt-1">Distance : {distance}</p>
                                        )}
                                        {/* Lien pour ouvrir dans Google Maps */}
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="map-directions-link"
                                        >
                                            <RouteIcon size={16} className="inline-icon mr-1" /> Obtenir l'itinéraire
                                        </a>
                                    </Popup>
                                </Marker>
                            )}

                            {structures && structures.length > 0 && structures.map(structure => (
                                <Marker key={structure.id_structure} position={[structure.latitude, structure.longitude]}>
                                    <Popup>
                                        <h4 className="font-bold">{structure.nom_structure}</h4>
                                        <p>{structure.adresse}, {structure.ville}</p>
                                        {userLocation && structure.latitude && structure.longitude && (
                                            <p className="text-sm text-gray-700 mt-1">
                                                Distance : {
                                                    (() => {
                                                        const dist = calculateDistance(userLocation[0], userLocation[1], structure.latitude, structure.longitude);
                                                        return dist < 1000 ? `${Math.round(dist)} m` : `${(dist / 1000).toFixed(2)} km`;
                                                    })()
                                                }
                                            </p>
                                        )}
                                        <Button
                                            onClick={() => navigate(`/structure/${structure.id_structure}`)}
                                            size="sm"
                                            className="mt-2 bg-green-500 hover:bg-green-600"
                                        >
                                            Voir les détails
                                        </Button>
                                    </Popup>
                                </Marker>
                            ))}

                        </MapContainer>
                    </div>

                    {/* Section d'information sur la distance si une seule structure est affichée */}
                    {latitude && longitude && (
                        <div className="distance-info-section">
                            {distance ? (
                                <p>Distance de votre position : **{distance}**</p>
                            ) : (
                                <p>Calcul de la distance en attente de votre position...</p>
                            )}
                            <p className="geolocation-note">
                                <MapPin size={16} className="inline-icon" /> Pour un calcul précis, veuillez autoriser la géolocalisation dans votre navigateur.
                            </p>
                        </div>
                    )}

                    {/* Si plusieurs structures, on peut ajouter une note ou une légende ici si besoin */}
                    {structures && structures.length > 0 && !latitude && (
                         <div className="distance-info-section">
                            <p className="geolocation-note">
                                <MapPin size={16} className="inline-icon" /> Votre position est affichée. Les distances aux structures sont visibles dans les popups.
                            </p>
                         </div>
                    )}

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default StructureLocationMap;