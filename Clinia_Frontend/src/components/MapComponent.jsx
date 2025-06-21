// src/components/MapComponent.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Correction des problèmes d'icône de marqueur par défaut avec Webpack/Create React App
import L from 'leaflet';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Cette partie est cruciale pour que les icônes Leaflet s'affichent correctement dans React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

const MapComponent = ({ latitude, longitude, name, address, zoom = 15 }) => {
    // Validation de base pour les coordonnées
    if (typeof latitude !== 'number' || typeof longitude !== 'number' || isNaN(latitude) || isNaN(longitude)) {
        return <div className="map-error">Coordonnées de carte invalides ou manquantes.</div>;
    }

    const position = [latitude, longitude];

    return (
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={false} style={{ height: '500px', width: '100%', borderRadius: '8px' }}>
            <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
                <Popup>
                    <strong>{name}</strong><br />
                    {address}<br />
                    {/* CORRECTION ICI : Le lien Google Maps a été ajusté. */}
                    {/* Utilisez "q=" pour une recherche par nom et adresse, ou "ll=" pour latitude/longitude */}
                    {/* Le format le plus fiable pour une adresse précise est de passer les coordonnées dans 'q=' */}
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ", " + address)}&query_place_id=${latitude},${longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        Voir sur Google Maps
                    </a>
                </Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapComponent;