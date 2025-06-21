// src/pages/SearchResultsPage.jsx (ou le composant où vous gérez les filtres)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Assurez-vous que le chemin est correct
import Header from '../components/Header'; // Si vous l'utilisez
import Footer from '../components/Footer'; // Si vous l'utilisez
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
        // Ajoutez d'autres icônes au besoin
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
    const [radius, setRadius] = useState(null); // Rayon de recherche (si applicable)

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
                const typesResponse = await api.get('/structure-types'); // Endpoint supposé
                // Ajouter une option "Tous les types" en premier
                const dynamicTypes = [{ value: '', label: 'Tous les types', icon: Building2 },
                                      ...typesResponse.data.data.map(type => ({
                                          value: type.slug || type.nom.toLowerCase().replace(/\s/g, '_'), // Utilisez un slug ou générez-en un
                                          label: type.nom,
                                          icon: getIconComponent(type.icon_name || 'Building2') // Supposons que l'API renvoie un nom d'icône
                                      }))
                                     ];
                setStructureTypes(dynamicTypes);

                // Récupérer les services
                const servicesResponse = await api.get('/services'); // Endpoint supposé
                const dynamicServices = [{ value: '', label: 'Tous les services' },
                                         ...servicesResponse.data.data.map(service => ({
                                             value: service.id, // Ou service.slug si vous avez
                                             label: service.nom_service
                                         }))
                                        ];
                setAvailableServices(dynamicServices);

                // Récupérer les assurances
                const assurancesResponse = await api.get('/assurances'); // Endpoint supposé
                const dynamicAssurances = [{ value: '', label: 'Toutes les assurances' },
                                           ...assurancesResponse.data.data.map(assurance => ({
                                               value: assurance.id, // Ou assurance.slug
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
    }, []); // Dépendances vides : s'exécute une seule fois au montage du composant

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
                    // setFilterError("Impossible d'obtenir votre position. La recherche par distance sera limitée.");
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            // setFilterError("La géolocalisation n'est pas supportée par votre navigateur.");
        }
    }, []);

    // ******************************************************
    // FONCTION POUR LA RECHERCHE DE STRUCTURES
    // ******************************************************
    const handleSearch = async (e) => {
        e.preventDefault();
        setLoadingResults(true);
        setResultsError(null);

        try {
            const params = {
                search: searchTerm,
                type: selectedType,
                service: selectedService,
                assurance: selectedAssurance,
                // Ajoutez userLocation et radius si vous voulez une recherche par proximité
                ...(userLocation && radius && {
                    user_lat: userLocation.latitude,
                    user_lon: userLocation.longitude,
                    radius: radius
                })
            };

            const response = await api.get('/structures/search', { params }); // Endpoint pour la recherche
            setSearchResults(response.data.structures); // Assurez-vous que votre API renvoie un tableau 'structures'
        } catch (err) {
            console.error("Erreur lors de la recherche des structures:", err);
            setResultsError(err.response?.data?.message || "Erreur lors de la recherche des structures. Veuillez réessayer.");
        } finally {
            setLoadingResults(false);
        }
    };

    // ******************************************************
    // GESTION DU CLIC "VOIR SUR LA CARTE" POUR UNE STRUCTURE
    // ******************************************************
    const handleViewOnMapClick = (structure) => {
        navigate('/map', { // Assurez-vous que '/map' est la route de votre StructureLocationMap
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
                    structures: searchResults, // Passe le tableau entier des résultats
                    userLocation: userLocation, // Passe aussi la position de l'utilisateur pour le calcul de distance dans les popups
                }
            });
        } else {
            alert("Veuillez effectuer une recherche pour afficher des structures sur la carte.");
        }
    };


    // ******************************************************
    // RENDU DU COMPOSANT
    // ******************************************************
    return (
        <div className="search-page-container">
            <Header />
            <main className="search-main-content">
                <section className="search-filters-section">
                    <h2>Trouvez une structure de santé</h2>
                    <form onSubmit={handleSearch} className="search-form">
                        <input
                            type="text"
                            placeholder="Rechercher par nom, ville..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />

                        {loadingFilters ? (
                            <p>Chargement des filtres...</p>
                        ) : filterError ? (
                            <p className="error-message">Erreur de chargement des filtres: {filterError}</p>
                        ) : (
                            <>
                                <select
                                    value={selectedType}
                                    onChange={(e) => setSelectedType(e.target.value)}
                                    className="filter-select"
                                >
                                    {structureTypes.map((type) => {
                                        const Icon = type.icon; // Obtenir le composant icône
                                        return (
                                            <option key={type.value} value={type.value}>
                                                {/* Les icônes ne sont pas affichables directement dans <option>, c'est juste pour le JS */}
                                                {type.label}
                                            </option>
                                        );
                                    })}
                                </select>

                                <select
                                    value={selectedService}
                                    onChange={(e) => setSelectedService(e.target.value)}
                                    className="filter-select"
                                >
                                    {availableServices.map((service) => (
                                        <option key={service.value} value={service.value}>{service.label}</option>
                                    ))}
                                </select>

                                <select
                                    value={selectedAssurance}
                                    onChange={(e) => setSelectedAssurance(e.target.value)}
                                    className="filter-select"
                                >
                                    {availableAssurances.map((assurance) => (
                                        <option key={assurance.value} value={assurance.value}>{assurance.label}</option>
                                    ))}
                                </select>
                            </>
                        )}

                        <button type="submit" className="search-button" disabled={loadingResults}>
                            <Search size={20} className="mr-2" />
                            {loadingResults ? 'Recherche en cours...' : 'Rechercher'}
                        </button>
                    </form>
                </section>

                <section className="search-results-section">
                    <div className="results-header">
                        <h3>Résultats ({searchResults.length})</h3>
                        {searchResults.length > 0 && (
                            <button onClick={handleViewAllOnMapClick} className="view-all-on-map-button">
                                <MapPin size={20} className="mr-2" />
                                Afficher tout sur la carte
                            </button>
                        )}
                    </div>


                    {resultsError && (
                        <p className="error-message">{resultsError}</p>
                    )}

                    {!loadingResults && searchResults.length === 0 && !resultsError && (
                        <p className="no-results-message">Aucune structure trouvée pour vos critères.</p>
                    )}

                    {loadingResults ? (
                        <p>Chargement des résultats...</p>
                    ) : (
                        <div className="structures-grid">
                            {searchResults.map((structure) => (
                                <div key={structure.id_structure} className="structure-card">
                                    <h4 className="structure-name">{structure.nom_structure}</h4>
                                    <p className="structure-address"><MapPin size={16} className="inline-icon" /> {structure.adresse}, {structure.ville}</p>
                                    {/* Ajoutez d'autres informations ici */}
                                    <div className="card-actions">
                                        <button
                                            onClick={() => handleViewOnMapClick(structure)}
                                            className="view-on-map-button-card"
                                        >
                                            <MapPin size={18} className="mr-1" /> Voir sur la carte
                                        </button>
                                        {/* Bouton pour voir les détails si vous avez une page dédiée */}
                                        {/* <button
                                            onClick={() => navigate(`/structure/${structure.id_structure}`)}
                                            className="details-button-card"
                                        >
                                            Détails
                                        </button> */}
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