// src/components/LineChartCard.tsx
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
import { useTheme } from '../contexts/ThemeContext'; // Importez le hook useTheme

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
  const { theme } = useTheme(); // Utilisez le thème pour adapter les couleurs du graphique

  // Couleurs des éléments du graphique en fonction du thème
  const axisColor = theme === 'dark' ? '#cbd5e1' : '#4b5563'; // gray-300 ou gray-600
  const gridColor = theme === 'dark' ? '#4a5568' : '#e0e0e0'; // gray-700 ou gray-200
  const tooltipBg = theme === 'dark' ? '#2d3748' : '#ffffff'; // gray-800 ou white
  const tooltipText = theme === 'dark' ? '#cbd5e1' : '#1f2937'; // gray-300 ou gray-800

  return (
    <div className="p-6 rounded-lg shadow-md col-span-full
                    bg-white dark:bg-gray-800                  {/* Fond de carte clair/sombre */}
                    transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-2
                     text-gray-800 dark:text-gray-100">        {/* Titre clair/sombre */}
        {title}
      </h2>
      {description && <p className="text-sm mb-4
                                     text-gray-600 dark:text-gray-300"> {/* Description clair/sombre */}
        {description}
      </p>}
      <div style={{ width: '100%', height: 300 }}>
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
            {/* Lignes de grille avec couleur dynamique */}
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            {/* Axes avec couleur dynamique */}
            <XAxis dataKey="name" stroke={axisColor} tick={{ fill: axisColor }} />
            <YAxis stroke={axisColor} tick={{ fill: axisColor }} />
            {/* Tooltip et Légende personnalisés si nécessaire pour le thème,
                mais les valeurs par défaut fonctionnent souvent bien avec les couleurs de texte ajustées
            */}
            <Tooltip
                contentStyle={{
                    backgroundColor: tooltipBg,
                    borderColor: gridColor,
                    color: tooltipText
                }}
                labelStyle={{ color: tooltipText }}
            />
            <Legend wrapperStyle={{ color: axisColor }} />
            {dataKeys.map((item, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={item.key}
                stroke={item.color}
                name={item.name}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartCard;