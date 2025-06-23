// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Building2, Hospital, Stethoscope, FlaskConical, Syringe, BriefcaseMedical, HeartPulse, Search, MapPin, XCircle } from 'lucide-react'; // Icônes

// Vous aurez besoin d'une fonction pour mapper les noms d'icônes aux composants d'icônes
const getIconComponent = (iconName) => {
    switch (iconName) {
        case 'Building2': return Building2;
        case 'Hospital': return Hospital;
        case 'Stethoscope': return Stethoscope;
        case 'FlaskConical': return FlaskConical;
        case 'Syringe': return Syringe;
        case 'BriefcaseMedical': return BriefcaseMedical;
        case 'HeartPulse': return HeartPulse;
        default: return Building2; // Icône par défaut
    }
};

const SearchResultsPage = () => {
    const navigate = useNavigate();

    // État pour les données des filtres (initialement vides)
    const [structureTypes, setStructureTypes] = useState([]);
    const [availableServices, setAvailableServices] = useState([]);
    const [availableAssurances, setAvailableAssurances] = useState([]);

    // États pour le chargement et les erreurs des filtres
    const [loadingFilters, setLoadingFilters] = useState(true);
    const [filterError, setFilterError] = useState(null);

    // États pour les critères de recherche
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [selectedService, setSelectedService] = useState('');
    const [selectedAssurance, setSelectedAssurance] = useState('');
    const [userLocation, setUserLocation] = useState(null); // Pour la géolocalisation
    const [radius, setRadius] = useState(10); // Rayon de recherche par défaut (10 km)
    const [openNow, setOpenNow] = useState(false); // Nouveau champ pour "Ouvert maintenant"

    // État pour les résultats de la recherche de structures
    const [searchResults, setSearchResults] = useState([]);
    const [loadingResults, setLoadingResults] = useState(false);
    const [resultsError, setResultsError] = useState(null);

    // ******************************************************
    // EFFET POUR RÉCUPÉRER LES OPTIONS DE FILTRE DE L'API
    // ******************************************************
    useEffect(() => {
        const fetchFilterOptions = async () => {
            setLoadingFilters(true);
            setFilterError(null);
            try {
                // Récupérer les types de structure
                const typesResponse = await api.get('/structure-types');
                const typesData = typesResponse.data?.data ?? [];
                const dynamicTypes = [
                    { value: '', label: 'Sélectionner un type' },
                    ...typesData.map((type) => ({
                        value: type.value || type.value?.toLowerCase().replace(/\s/g, '_'),
                        label: type.label,
                    }))
                ];
                setStructureTypes(dynamicTypes);

                // Récupérer les services
                const servicesResponse = await api.get('/services');
                const servicesData = servicesResponse.data?.data ?? [];
                const dynamicServices = [
                    { value: '', label: 'Tous les services' },
                    ...servicesData.map((service: { id: string | number; nom_service: string }) => ({
                        value: service.id,
                        label: service.nom_service
                    }))
                ];
                setAvailableServices(dynamicServices);

                // Récupérer les assurances
                const assurancesResponse = await api.get('/assurances');
                const assurancesData = assurancesResponse.data?.data ?? [];
                const dynamicAssurances = [
                    { value: '', label: 'Toutes les assurances' },
                    ...assurancesData.map((assurance: { id: string | number; nom_assurance: string }) => ({
                        value: assurance.id,
                        label: assurance.nom_assurance
                    }))
                ];
                setAvailableAssurances(dynamicAssurances);

            } catch (err) {
                console.error("Erreur lors de la récupération des options de filtre:", err);
                setFilterError("Impossible de charger les options de filtre. Veuillez vérifier votre connexion.");
            } finally {
                setLoadingFilters(false);
            }
        };

        fetchFilterOptions();
    }, []);

    // ******************************************************
    // EFFET POUR LA GÉOLOCALISATION DE L'UTILISATEUR
    // ******************************************************
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ latitude, longitude });
                },
                (err) => {
                    console.warn(`Geolocation Error (${err.code}): ${err.message}`);
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }
    }, []);

    // ******************************************************
    // FONCTION POUR LA RECHERCHE DE STRUCTURES
    // ******************************************************
    const handleSearch = async (e: any) => {
        e.preventDefault();
        setLoadingResults(true);
        setResultsError(null);

        try {
            const params = {
                search: searchTerm,
                type: selectedType,
                service: selectedService,
                assurance: selectedAssurance,
                open_now: openNow,
                ...(userLocation && radius && {
                    user_lat: userLocation.latitude,
                    user_lon: userLocation.longitude,
                    radius: radius
                })
            };

            const response = await api.get('/structures/search', { params });
            console.log(response.data); // Pour déboguer la réponse de l'API
            setSearchResults(response.data.structures || []);
        } catch (err) {
            setResultsError(
                err.response?.data?.message ||
                "Erreur lors de la recherche des structures. Veuillez réessayer."
            );
        } finally {
            setLoadingResults(false);
        }
    };

    // Fonction pour réinitialiser les filtres
    const handleResetFilters = () => {
        setSearchTerm('');
        setSelectedType('');
        setSelectedService('');
        setSelectedAssurance('');
        setRadius(10);
        setOpenNow(false);
        setSearchResults([]); // Efface les résultats
        setResultsError(null); // Efface les erreurs
        // Optionnel: relancer la recherche par défaut si vous voulez des résultats sans filtres
        // handleSearch(new Event('submit'));
    };

    // ******************************************************
    // GESTION DU CLIC "VOIR SUR LA CARTE" POUR UNE STRUCTURE
    // ******************************************************
    const handleViewOnMapClick = (structure) => {
        navigate('/map', {
            state: {
                latitude: structure.latitude,
                longitude: structure.longitude,
                name: structure.nom_structure,
                address: structure.adresse,
                id_structure: structure.id_structure,
                ville: structure.ville,
            }
        });
    };

    // ******************************************************
    // GESTION DU CLIC "VOIR TOUT SUR LA CARTE"
    // ******************************************************
    const handleViewAllOnMapClick = () => {
        if (searchResults.length > 0) {
            navigate('/map', {
                state: {
                    structures: searchResults,
                    userLocation: userLocation,
                }
            });
        } else {
            alert("Veuillez effectuer une recherche pour afficher des structures sur la carte.");
        }
    };


    // Obtenir le composant icône pour le type de structure sélectionné
    const SelectedTypeIcon = selectedType
        ? getIconComponent(structureTypes.find(type => type.value === selectedType)?.icon_name)
        : Building2; // Icône par défaut si "Tous les types" ou rien n'est sélectionné

    // ******************************************************
    // RENDU DU COMPOSANT
    // ******************************************************
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header /> {/* */}
            <main className="flex-grow container mx-auto px-4 py-8">
                {/* Section Filtres de recherche */}
                <section className="bg-white rounded-lg shadow-md p-6 mb-8 w-full max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter mr-2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                            </svg>
                            Filtres de recherche
                        </h2>
                        <button
                            onClick={handleResetFilters}
                            className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium"
                        >
                            <XCircle size={16} className="mr-1" />
                            Réinitialiser
                        </button>
                    </div>

                    {loadingFilters ? (
                        <p className="text-gray-600 text-center py-4">Chargement des filtres...</p>
                    ) : filterError ? (
                        <p className="text-red-500 text-center py-4">Erreur de chargement des filtres: {filterError}</p>
                    ) : (
                        <form onSubmit={handleSearch} className="space-y-6">
                            {/* Barre de recherche principale en haut */}
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher par nom, ville..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Type de structure */}
                                <div>
                                    <label htmlFor="structureType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Type de structure
                                    </label>
                                    {/* Pour simuler l'icône dans le select comme sur l'image, c'est plus complexe.
                                        Ici, on utilise un select standard, mais vous pouvez le styliser avec un composant
                                        custom si vous voulez l'icône *devant* le texte de l'option sélectionnée.
                                        Pour l'instant, l'icône est juste pour le JS qui mappe le nom.
                                    */}
                                    <div className="relative">
                                        <SelectedTypeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <select
                                            id="structureType"
                                            value={selectedType}
                                            onChange={(e) => setSelectedType(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                                        >
                                            {structureTypes.map((type, idx) => (
                                                <option
                                                    key={type.value !== '' ? type.value : `all-type-${idx}`}
                                                    value={type.value}
                                                >
                                                    {type.label ?? 'Tous les types'}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Services proposés */}
                                <div>
                                    <label htmlFor="services" className="block text-sm font-medium text-gray-700 mb-1">
                                        Services proposés
                                    </label>
                                    <select
                                        id="services"
                                        value={selectedService}
                                        onChange={(e) => setSelectedService(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                                    >
                                        {availableServices.map((service, idx) => (
                                            <option
                                                key={service.value !== '' ? service.value : `all-service-${idx}`}
                                                value={service.value}
                                            >
                                                {service.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>

                                {/* Compagnies d'assurance */}
                                <div>
                                    <label htmlFor="assurances" className="block text-sm font-medium text-gray-700 mb-1">
                                        Compagnies d'assurance
                                    </label>
                                    <select
                                        id="assurances"
                                        value={selectedAssurance}
                                        onChange={(e) => setSelectedAssurance(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
                                    >
                                        {availableAssurances.map((assurance, idx) => (
                                            <option
                                                key={assurance.value !== '' ? assurance.value : `all-assurance-${idx}`}
                                                value={assurance.value}
                                            >
                                                {assurance.label}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                {/* Ouvert maintenant */}
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={openNow}
                                        onChange={(e) => setOpenNow(e.target.checked)}
                                        className="form-checkbox h-4 w-4 text-green-600 rounded"
                                    />
                                    <span className="ml-2 text-gray-700">Ouvert maintenant</span>
                                </label>

                                {/* Distance Max */}
                                <div className="flex-grow">
                                    <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-1">
                                        Distance Max: <span className="font-semibold">{radius} km</span>
                                    </label>
                                    <input
                                        type="range"
                                        id="radius"
                                        min="1"
                                        max="100"
                                        value={radius}
                                        onChange={(e) => setRadius(parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                                disabled={loadingResults}
                            >
                                <Search size={20} className="mr-2" />
                                {loadingResults ? 'Recherche en cours...' : 'Appliquer les filtres'}
                            </button>
                        </form>
                    )}
                </section>

                {/* Section Résultats de la recherche */}
                <section className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-gray-800">Résultats de la recherche</h3>
                        {searchResults.length > 0 && (
                            <button
                                onClick={handleViewAllOnMapClick}
                                className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-600 transition-colors duration-200"
                            >
                                <MapPin size={20} className="mr-2" />
                                Afficher tout sur la carte
                            </button>
                        )}
                    </div>

                    {resultsError && (
                        <p className="text-red-500 text-center py-4">{resultsError}</p>
                    )}

                    {!loadingResults && searchResults.length === 0 && !resultsError && (
                        <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-center flex items-center justify-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-info">
                                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                            </svg>
                            <span>Information : Aucune structure trouvée pour vos critères.</span>
                        </div>
                    )}

                    {loadingResults ? (
                        <p className="text-gray-600 text-center py-4">Chargement des résultats...</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {searchResults.map((structure) => (
                                <div key={structure.id_structure} className="structure-card bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between">
                                    <div>
                                        <h4 className="structure-name text-lg font-bold text-gray-900 mb-1">{structure.nom_structure}</h4>
                                        <p className="structure-address text-gray-600 text-sm flex items-center mb-2">
                                            <MapPin size={16} className="inline-icon mr-1 text-gray-500" /> {structure.adresse}, {structure.ville}
                                        </p>
                                        {/* Ajoutez d'autres informations pertinentes de la structure ici */}
                                        {structure.type_structure && (
                                            <p className="text-gray-700 text-sm mb-1">
                                                <span className="font-semibold">Type:</span> {structure.type_structure.nom}
                                            </p>
                                        )}
                                        {/* Exemple pour les services, à adapter si vous avez une relation Many-to-Many */}
                                        {/* {structure.services && structure.services.length > 0 && (
                                            <p className="text-gray-700 text-sm mb-1">
                                                <span className="font-semibold">Services:</span> {structure.services.map(s => s.nom_service).join(', ')}
                                            </p>
                                        )} */}
                                    </div>
                                    <div className="card-actions mt-4 flex justify-end">
                                        <button
                                            onClick={() => handleViewOnMapClick(structure)}
                                            className="bg-green-500 text-white py-2 px-3 rounded-lg flex items-center text-sm hover:bg-green-600 transition-colors duration-200"
                                        >
                                            <MapPin size={18} className="mr-1" /> Voir sur la carte
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default SearchResultsPage;