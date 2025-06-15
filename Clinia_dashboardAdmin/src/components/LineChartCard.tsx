import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ChartData {
  name: string; // Ex: 'Jan', 'Fev', 'Mar'
  users?: number;
  comments?: number;
  structures?: number;
  appUsage?: number;
  // Ajoutez d'autres métriques si nécessaire
}

interface LineChartCardProps {
  title: string;
  data: ChartData[];
  dataKeys: { key: string; color: string; name: string }[];
  description?: string;
}

const LineChartCard: React.FC<LineChartCardProps> = ({ title, data, dataKeys, description }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md col-span-full"> {/* col-span-full pour prendre toute la largeur */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      {description && <p className="text-gray-600 text-sm mb-4">{description}</p>}
      <div style={{ width: '100%', height: 300 }}> {/* Conteneur pour le graphique */}
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> {/* Lignes de grille */}
            <XAxis dataKey="name" /> {/* Axe des X (généralement le temps ou des catégories) */}
            <YAxis /> {/* Axe des Y (valeurs des métriques) */}
            <Tooltip /> {/* Affiche les détails au survol */}
            <Legend /> {/* Légende des différentes lignes */}
            {dataKeys.map((item, index) => (
              <Line
                key={index}
                type="monotone" // Forme de la courbe (monotone, linear, etc.)
                dataKey={item.key} // Clé de la donnée dans l'objet ChartData
                stroke={item.color} // Couleur de la ligne
                name={item.name} // Nom affiché dans la légende
                activeDot={{ r: 8 }} // Point actif au survol
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartCard;