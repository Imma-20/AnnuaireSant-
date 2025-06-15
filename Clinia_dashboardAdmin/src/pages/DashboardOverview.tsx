import React, { useState, useEffect, useCallback } from "react";
import Card from "../components/Card";
import RatingTable from "../components/RatingTable";
import StructureTable from "../components/StructureTable";
import ArticleTable from "../components/ArticleTable";
import LineChartCard from "../components/LineChartCard";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

// Définition des types pour une meilleure lisibilité
interface ChartData {
	name: string;
	users?: number;
	comments?: number;
	structures?: number;
	appUsage?: number;
	activeUsers?: number;
}

// Fonction utilitaire pour générer des données de graphique simulées
// En production, ces données viendraient de votre API
const generateChartData = (period: '7days' | '30days' | '90days'): ChartData[] => {
	const data: ChartData[] = [];
	let numEntries = 7; // Par défaut pour 7 jours

	if (period === '30days') {
		numEntries = 30;
	} else if (period === '90days') {
		numEntries = 90;
	}

	for (let i = 0; i < numEntries; i++) {
		const date = new Date();
		date.setDate(date.getDate() - (numEntries - 1 - i)); // Commence il y a X jours
		const name = `${date.getMonth() + 1}/${date.getDate()}`; // Format MM/JJ

		data.push({
			name: name,
			users: Math.floor(Math.random() * 200) + 300, // entre 300 et 500
			comments: Math.floor(Math.random() * 50) + 100, // entre 100 et 150
			structures: Math.floor(Math.random() * 5) + 1, // entre 1 et 5
			appUsage: Math.floor(Math.random() * 100) + 200, // entre 200 et 300
			activeUsers: Math.floor(Math.random() * 70) + 100, // entre 100 et 170
		});
	}
	return data;
};

const DashboardOverview = () => {
	const [currentPeriod, setCurrentPeriod] = useState<'7days' | '30days' | '90days'>('7days'); // Nouvel état pour la période

	// États pour les données des graphiques, initialisés avec la période par défaut
	const [userData, setUserData] = useState<ChartData[]>([]);
	const [commentsAndStructuresData, setCommentsAndStructuresData] = useState<ChartData[]>([]);
	const [appUsageData, setAppUsageData] = useState<ChartData[]>([]);

	// Callback pour mettre à jour les données des graphiques en fonction de la période
	const updateChartData = useCallback((period: '7days' | '30days' | '90days') => {
		const newData = generateChartData(period);
		setUserData(newData.map(d => ({ name: d.name, users: d.users })));
		setCommentsAndStructuresData(newData.map(d => ({ name: d.name, comments: d.comments, structures: d.structures })));
		setAppUsageData(newData.map(d => ({ name: d.name, appUsage: d.appUsage, activeUsers: d.activeUsers })));
	}, []);

	// Utilisation de useEffect pour charger les données initiales et les mettre à jour si la période change
	useEffect(() => {
		updateChartData(currentPeriod);
	}, [currentPeriod, updateChartData]); // Dépend de currentPeriod et updateChartData

	return (
		<div>
			{/* Section des cartes */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
				<Card
					title="Structures"
					value="25"
					icon={<FaArrowUp className="text-green-500 text-xl" />}
					trend="+12%"
				/>
				<Card
					title="Commentaires"
					value="89"
					icon={<FaArrowDown className="text-red-500 text-xl" />}
					trend="-8%"
				/>
				<Card
					title="Articles"
					value="15"
					icon={<FaArrowUp className="text-green-500 text-xl" />}
					trend="+25%"
				/>
			</div>

			{/* Filtres de période pour les graphiques */}
			<div className="flex justify-end space-x-2 mb-6">
				<button
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
						currentPeriod === '7days' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}
					onClick={() => setCurrentPeriod('7days')}
				>
					7 Derniers Jours
				</button>
				<button
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
						currentPeriod === '30days' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}
					onClick={() => setCurrentPeriod('30days')}
				>
					30 Derniers Jours
				</button>
				<button
					className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
						currentPeriod === '90days' ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
					}`}
					onClick={() => setCurrentPeriod('90days')}
				>
					90 Derniers Jours
				</button>
			</div>

			{/* Section des graphiques */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
				<LineChartCard
					title="Évolution des Utilisateurs"
					description="Nombre d'utilisateurs inscrits au fil du temps."
					data={userData}
					dataKeys={[{ key: 'users', color: '#8884d8', name: 'Utilisateurs' }]}
				/>
				<LineChartCard
					title="Commentaires & Structures de Santé"
					description="Tendances des commentaires et des nouvelles structures."
					data={commentsAndStructuresData}
					dataKeys={[
						{ key: 'comments', color: '#82ca9d', name: 'Commentaires' },
						{ key: 'structures', color: '#ffc658', name: 'Structures' }
					]}
				/>
				{/* Ce graphique prendra toute la largeur sur les grands écrans pour mieux s'adapter si la grille est 2 colonnes */}
				<div className="lg:col-span-2"> {/* Ajout de lg:col-span-2 pour qu'il prenne toute la largeur sur les grands écrans */}
					<LineChartCard
						title="Utilisation de l'Application Web"
						description="Nombre de sessions et utilisateurs actifs quotidiens."
						data={appUsageData}
						dataKeys={[
							{ key: 'appUsage', color: '#ff7300', name: 'Sessions' }, // appUsage renommée en Sessions pour la lisibilité
							{ key: 'activeUsers', color: '#00c49f', name: 'Utilisateurs Actifs' }
						]}
					/>
				</div>
			</div>

			{/* Section des tableaux */}
			<div className="flex flex-col gap-6">
				<div className="bg-white p-4 rounded-lg shadow-md">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Évaluations Récentes</h3>
					<RatingTable />
				</div>

				<div className="bg-white p-4 rounded-lg shadow-md">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Structures de Santé</h3>
					<StructureTable />
				</div>

				<div className="bg-white p-4 rounded-lg shadow-md">
					<h3 className="text-lg font-semibold text-gray-800 mb-4">Articles Récents</h3>
					<ArticleTable />
				</div>
			</div>
		</div>
	);
};

export default DashboardOverview;
