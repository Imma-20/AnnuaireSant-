// TestMap.jsx (pour le débogage)
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Pour la correction des icônes
// ... import des icônes si besoin pour L.Icon.Default.mergeOptions

// Fix des icônes (si non fait globalement)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


const TestMap = () => {
    const beninCenter = [6.4000, 2.6167]; // Centre du Bénin (près d'Abomey-Calavi)
    const zoomLevel = 9;

    return (
        <MapContainer center={beninCenter} zoom={zoomLevel} scrollWheelZoom={true} style={{ height: '700px', width: '100vw' }}>
            <TileLayer
                attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Vous pouvez ajouter un marqueur ici si vous voulez tester */}
            {/* <Marker position={beninCenter}><Popup>Centre du Bénin</Popup></Marker> */}
        </MapContainer>
    );
};

export default TestMap;