import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction pour les icônes par défaut de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const BeninMap = () => {
  const departments = [
    { name: "Alibori", position: [10.92, 2.74], color: "bg-green-500" },
    { name: "Atacora", position: [10.43, 1.48], color: "bg-green-500" },
    { name: "Atlantique", position: [6.61, 2.25], color: "bg-green-500" },
    { name: "Borgou", position: [9.35, 2.75], color: "bg-green-500" },
    { name: "Collines", position: [8.25, 2.12], color: "bg-green-500" },
    { name: "Donga", position: [9.75, 1.67], color: "bg-green-500" },
    { name: "Couffo", position: [7.12, 1.75], color: "bg-green-500" },
    { name: "Littoral", position: [6.38, 2.42], color: "bg-green-600", count: 208 },
    { name: "Mono", position: [6.42, 1.83], color: "bg-green-500" },
    { name: "Ouémé", position: [6.85, 2.48], color: "bg-green-500" },
    { name: "Plateau", position: [7.42, 2.62], color: "bg-green-500" },
    { name: "Zou", position: [7.35, 2.07], color: "bg-green-500" },
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="w-1/3">
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">🗺️ Départements</CardTitle>
                  <a href="#" className="text-green-600 hover:text-green-700 text-sm">
                    Voir tous →
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {departments.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${dept.color} mr-3`}></div>
                        <span className="text-sm text-gray-700">{dept.name}</span>
                      </div>
                      {dept.count && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {dept.count}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-2/3 pl-8">
            <div className="relative">
              <MapContainer center={[9.3077, 2.3158]} zoom={7} style={{ height: '600px', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {departments.map((dept, index) => (
                  dept.position && (
                    <Marker key={index} position={dept.position}>
                      <Popup>{dept.name}</Popup>
                    </Marker>
                  )
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeninMap;
