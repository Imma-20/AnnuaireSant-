import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Phone, Mail, Globe } from "lucide-react";
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// IMPORTANT : Définissez l'URL de base de votre API Laravel ici
// Si votre backend Laravel tourne sur http://localhost:8000, laissez ceci.
// Sinon, ajustez-le à l'URL de votre backend (ex: 'https://api.votre-domaine.com')
const API_BASE_URL = 'http://localhost:8000/api'; // Assurez-vous que c'est correct

// Types pour les données de structure (DOIT CORRESPONDRE à ce que votre API Laravel renvoie)
// J'ai mis à jour les types pour inclure tous les champs de votre migration
interface StructureSante {
  id_structure: string; // Ou number si votre ID est un int
  nom_structure: string;
  type_structure: 'pharmacie' | 'hopital' | 'laboratoire' | 'clinique' | 'centre_medical' | 'autre' | 'cabinet_imagerie' | 'centre_reeducation' | 'ambulance' | 'cabinet_dentaire';
  adresse: string | null;
  quartier: string | null;
  ville: string | null;
  commune: string | null;
  departement: string | null;
  latitude: number | null;
  longitude: number | null;
  telephone_principal: string | null;
  telephone_secondaire: string | null;
  email_contact: string | null;
  site_web: string | null;
  horaires_ouverture: any; // Peut être un objet JSON, donc 'any' ou un type plus spécifique si vous le parsez
  est_de_garde: boolean;
  periode_garde_debut: string | null; // Les dates seront des chaînes de caractères de l'API
  periode_garde_fin: string | null;
  description: string | null;
  logo: string | null;
  statut_verification: 'en_attente' | 'verifie' | 'rejete';
  id_utilisateur: number | null;
  created_at: string;
  updated_at: string;
}

// Nouveau type pour encapsuler la réponse de l'API, car elle contient la propriété 'structures'
interface ApiResponse {
    status: boolean;
    structures: StructureSante[];
}


const StructuresListe = () => {
  const { categoryType } = useParams<{ categoryType: string }>();
  const navigate = useNavigate();

  const [structures, setStructures] = useState<StructureSante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStructures = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = `${API_BASE_URL}/structures-sante`; // URL de base pour l'API

        // Si une catégorie est spécifiée (et pas "toutes"), ajoutez-la aux paramètres de l'URL
        if (categoryType && categoryType !== "toutes") {
          url += `?type=${categoryType}`;
        }
        
        // Effectuer l'appel API
        const response = await fetch(url);

        if (!response.ok) {
          // Si la réponse n'est pas OK (ex: 404, 500), lancez une erreur
          throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
        }

        // --- C'EST ICI LA MODIFICATION CLÉ ! ---
        // On s'attend à recevoir un objet avec une propriété 'structures'
        const data: ApiResponse = await response.json(); 
        
        // Vérifiez que la réponse est valide et contient un tableau de structures
        if (data.status === true && Array.isArray(data.structures)) {
          setStructures(data.structures); // On ne stocke que le tableau des structures
        } else {
          // Si le format n'est pas celui attendu, afficher une erreur
          setError("Les données reçues de l'API ne sont pas au format attendu.");
          setStructures([]); // Assurez-vous que l'état reste un tableau vide
        }
        // --- FIN DE LA MODIFICATION CLÉ ---

      } catch (err) {
        // Gérer les erreurs de réseau ou d'API
        console.error("Erreur de chargement des structures:", err);
        setError("Impossible de charger les structures. Veuillez vérifier votre connexion ou réessayer plus tard.");
        setStructures([]); // Assurez-vous que l'état reste un tableau vide en cas d'erreur
      } finally {
        setLoading(false);
      }
    };

    fetchStructures();
    // Déclenchez l'effet lorsque 'categoryType' change ou lorsque le composant est monté
  }, [categoryType]);

  const getCategoryDisplayName = (type: string) => {
    switch (type) {
      case "hopital": return "Hôpitaux";
      case "pharmacie": return "Pharmacies";
      case "clinique": return "Cliniques";
      case "laboratoire": return "Laboratoires";
      case "centre_medical": return "Centres Médicaux";
      case "autre": return "Autres Structures";
      case "cabinet_imagerie": return "Cabinets d'Imagerie";
      case "centre_reeducation": return "Centres de Rééducation";
      case "ambulance": return "Ambulances & Urgences";
      case "cabinet_dentaire": return "Cabinets Dentaires";
      case "toutes": return "Toutes les structures";
      default: return "Structures de Santé";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gradient-to-br from-green-50 to-green-100 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Bouton de retour */}
          <Button
            onClick={() => navigate(-1)}
            className="mb-8 flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour</span>
          </Button>

          {/* Titre de la Page */}
          <h1 className="text-5xl font-extrabold text-green-800 mb-10 text-center drop-shadow-sm">
            {getCategoryDisplayName(categoryType || "toutes")}
          </h1>

          {/* États de chargement, erreur, ou pas de structures */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-md">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-500 mb-4"></div>
              <p className="text-xl text-gray-700 font-medium">Chargement des structures...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col justify-center items-center py-20 bg-red-50 text-red-700 rounded-lg shadow-md p-6">
              <p className="text-xl mb-4 font-semibold">{error}</p>
              <Button onClick={() => navigate(-1)} className="bg-red-600 hover:bg-red-700 text-white">
                Retour
              </Button>
            </div>
           ) : structures.length === 0 ? (
            <div className="text-center text-gray-600 text-xl py-20 bg-white rounded-lg shadow-md p-6">
              <p className="font-semibold">Oups ! Aucune structure trouvée pour cette catégorie.</p>
              <p className="mt-2 text-lg">Essayez une autre recherche ou revenez plus tard.</p>
            </div>
          ) : (
            // Grille des structures <-- Ce commentaire est correct, mais l'accolade ci-dessous est le problème
            // SUPPRIMEZ L'ACCOLADE ICI --> {
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {structures.map((structure) => (
                <Card
                  key={structure.id_structure}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <CardHeader className="p-6 pb-4">
                    <CardTitle className="text-2xl font-bold text-green-700 line-clamp-2">
                      {structure.nom_structure}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {getCategoryDisplayName(structure.type_structure)}
                    </p>
                  </CardHeader>
                  <CardContent className="p-6 pt-0 space-y-3 text-gray-700">
                    {structure.adresse && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-base">
                          {structure.adresse}
                          {structure.quartier && `, ${structure.quartier}`}
                          {structure.ville && `, ${structure.ville}`}
                        </p>
                      </div>
                    )}
                    {structure.telephone_principal && (
                      <div className="flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-base">{structure.telephone_principal}</p>
                      </div>
                    )}
                    {structure.email_contact && (
                      <div className="flex items-center space-x-2">
                        <Mail className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <p className="text-base truncate">{structure.email_contact}</p>
                      </div>
                    )}
                    {structure.site_web && (
                      <div className="flex items-center space-x-2">
                        <Globe className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <a
                          href={structure.site_web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base text-blue-600 hover:underline truncate"
                        >
                          {structure.site_web.replace(/(^\w+:|^)\/\//, '')}
                        </a>
                      </div>
                    )}
                      {structure.description && (
                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {structure.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StructuresListe;