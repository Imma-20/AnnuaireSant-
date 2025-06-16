import React, { useState, useEffect, useCallback } from "react";
import Card from "../components/Card";
import RatingTable from "../components/RatingTable";
import StructureTable from "../components/StructureTable";
import ArticleTable from "../components/ArticleTable";
import LineChartCard from "../components/LineChartCard";
import { FaUsers, FaHospital, FaComment } from "react-icons/fa"; // Import des nouvelles icônes

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

    // Calcul des valeurs agrégées pour les cartes (simulées pour l'exemple)
    // En production, ces totaux viendraient directement de votre API ou seraient calculés sur des données plus larges
    const totalStructures = commentsAndStructuresData.reduce((acc, curr) => acc + (curr.structures || 0), 0) + 25; // Ajout d'une base pour un affichage significatif
    const totalComments = commentsAndStructuresData.reduce((acc, curr) => acc + (curr.comments || 0), 0) + 89; // Ajout d'une base
    const totalUsers = userData.reduce((acc, curr) => acc + (curr.users || 0), 0) + 1500; // Ajout d'une base pour un nombre d'utilisateurs plus réaliste

    return (
        <div className="p-6 bg-gray-100 min-h-screen dark:bg-gray-900 dark:text-gray-200">
            {/* Section des cartes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                <Card
                    title="Utilisateurs"
                    value={totalUsers.toLocaleString()} // Formatage du nombre
                    icon={<FaUsers className="text-2xl text-purple-600" />} // Icône plus visible et couleur distinctive
                    className="bg-white shadow-lg rounded-xl p-6 dark:bg-gray-800 transition transform hover:scale-105 duration-300" // Styles améliorés
                />
                <Card
                    title="Structures de Santé"
                    value={totalStructures.toLocaleString()}
                    icon={<FaHospital className="text-2xl text-blue-600" />} // Icône et couleur
                    className="bg-white shadow-lg rounded-xl p-6 dark:bg-gray-800 transition transform hover:scale-105 duration-300"
                />
                <Card
                    title="Commentaires"
                    value={totalComments.toLocaleString()}
                    icon={<FaComment className="text-2xl text-yellow-600" />} // Icône et couleur
                    className="bg-white shadow-lg rounded-xl p-6 dark:bg-gray-800 transition transform hover:scale-105 duration-300"
                />
                {/* La carte "Articles" est conservée avec une valeur statique ou pourrait être dynamisée si les données sont disponibles */}
                <Card
                    title="Articles"
                    value="15"
                    icon={<FaComment className="text-2xl text-green-600" />} // Icône appropriée pour les articles (peut être changée si une icône spécifique aux articles est disponible)
                    className="bg-white shadow-lg rounded-xl p-6 dark:bg-gray-800 transition transform hover:scale-105 duration-300"
                />
            </div>

            {/* Filtres de période pour les graphiques */}
            <div className="flex justify-end space-x-3 mb-8">
                <button
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentPeriod === '7days' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                    }`}
                    onClick={() => setCurrentPeriod('7days')}
                >
                    7 Derniers Jours
                </button>
                <button
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentPeriod === '30days' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                    }`}
                    onClick={() => setCurrentPeriod('30days')}
                >
                    30 Derniers Jours
                </button>
                <button
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        currentPeriod === '90days' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white'
                    }`}
                    onClick={() => setCurrentPeriod('90days')}
                >
                    90 Derniers Jours
                </button>
            </div>

            {/* Section des graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <LineChartCard
                    title="Évolution des Utilisateurs"
                    description="Nombre d'utilisateurs inscrits au fil du temps."
                    data={userData}
                    dataKeys={[{ key: 'users', color: '#8884d8', name: 'Utilisateurs' }]}
                    className="bg-white shadow-lg rounded-xl p-6 dark:bg-gray-800"
                />
                <LineChartCard
                    title="Commentaires & Structures de Santé"
                    description="Tendances des commentaires et des nouvelles structures."
                    data={commentsAndStructuresData}
                    dataKeys={[
                        { key: 'comments', color: '#82ca9d', name: 'Commentaires' },
                        { key: 'structures', color: '#ffc658', name: 'Structures' }
                    ]}
                    className="bg-white shadow-lg rounded-xl p-6 dark:bg-gray-800"
                />
                <div className="lg:col-span-2">
                    <LineChartCard
                        title="Utilisation de l'Application Web"
                        description="Nombre de sessions et utilisateurs actifs quotidiens."
                        data={appUsageData}
                        dataKeys={[
                            { key: 'appUsage', color: '#ff7300', name: 'Sessions' },
                            { key: 'activeUsers', color: '#00c49f', name: 'Utilisateurs Actifs' }
                        ]}
                        className="bg-white shadow-lg rounded-xl p-6 dark:bg-gray-800"
                    />
                </div>
            </div>

            {/* Section des tableaux */}
            <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 dark:text-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-100">Évaluations Récentes</h3>
                    <RatingTable />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 dark:text-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-100">Structures de Santé</h3>
                    <StructureTable />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800 dark:text-gray-200">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-100">Articles Récents</h3>
                    <ArticleTable />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;