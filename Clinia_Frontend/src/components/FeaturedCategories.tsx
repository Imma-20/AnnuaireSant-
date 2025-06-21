import React, { useState, useEffect } from 'react';
import {
  Hospital,
  Stethoscope,
  Microscope,
  Pill,
  ScanLine,
  PersonStanding,
  Ambulance,
  Syringe,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom"; // Assurez-vous que useNavigate est importé

const API_BASE_URL = 'http://localhost:8000/api'; // Assurez-vous que c'est correct

// Définir un type pour la structure des comptes API
interface StructureCounts {
    [key: string]: number; // Clé est le type de structure (string), valeur est le compte (number)
}

const FeaturedCategories = () => {
  const navigate = useNavigate();
  const [categoryCounts, setCategoryCounts] = useState<StructureCounts>({});
  const [loadingCounts, setLoadingCounts] = useState(true);
  const [errorCounts, setErrorCounts] = useState<string | null>(null);

  // Définition initiale des catégories avec les icônes et couleurs
  // Le 'count' sera mis à jour dynamiquement
  const categoriesConfig = [
    { icon: Hospital, name: "Hôpitaux", type: "hopital", color: "text-red-600", bgColor: "bg-red-100" },
    { icon: Stethoscope, name: "Cliniques", type: "clinique", color: "text-blue-600", bgColor: "bg-blue-100" },
    { icon: Microscope, name: "Laboratoires", type: "laboratoire", color: "text-green-600", bgColor: "bg-green-100" },
    { icon: Pill, name: "Pharmacies", type: "pharmacie", color: "text-teal-600", bgColor: "bg-teal-100" },
    { icon: ScanLine, name: "Cabinets d'imagerie", type: "cabinet_imagerie", color: "text-purple-600", bgColor: "bg-purple-100" },
    { icon: PersonStanding, name: "Centres de rééducation", type: "centre_reeducation", color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { icon: Ambulance, name: "Ambulances & Urgences", type: "ambulance", color: "text-orange-600", bgColor: "bg-orange-100" },
    { icon: Syringe, name: "Cabinets dentaires", type: "cabinet_dentaire", color: "text-pink-600", bgColor: "bg-pink-100" },
  ];

  useEffect(() => {
    const fetchCategoryCounts = async () => {
      setLoadingCounts(true);
      setErrorCounts(null);
      try {
        const response = await fetch(`${API_BASE_URL}/structures-counts`);
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        const data = await response.json();
        
        // Vérifier si la réponse est bien au format attendu (status: true, counts: {...})
        if (data.status === true && typeof data.counts === 'object' && data.counts !== null) {
          setCategoryCounts(data.counts);
        } else {
          // Gérer le cas où 'data.counts' est null ou non un objet
          throw new Error("Format de données des comptes inattendu ou 'counts' manquant.");
        }
      } catch (err) {
        console.error("Erreur lors du chargement des comptes de catégories:", err);
        setErrorCounts("Impossible de charger les comptes.");
      } finally {
        setLoadingCounts(false);
      }
    };

    fetchCategoryCounts();
  }, []);

  const handleCategoryClick = (categoryType: string) => {
    navigate(`/structures/${categoryType}`);
  };

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Structure par Catégorie
          </h2>
          <p className="text-muted-foreground text-lg">
            Trouvez rapidement l'établissement de santé que vous recherchez.
          </p>
        </div>

        {loadingCounts ? (
            <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-green-500 mb-2"></div>
                <p className="text-gray-600">Chargement des comptes...</p>
            </div>
        ) : errorCounts ? (
            <div className="text-center text-red-600 py-10">
                <p>{errorCounts}</p>
                <p className="text-sm text-gray-500">Veuillez vérifier le serveur ou réessayer.</p>
            </div>
        ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {categoriesConfig.map((category, index) => {
                    // Récupérer le compte réel pour cette catégorie, ou 0 si non disponible
                    const count = categoryCounts[category.type] !== undefined ? categoryCounts[category.type] : 0;
                    return (
                        <Card
                            key={index}
                            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
                            onClick={() => handleCategoryClick(category.type)}
                        >
                            <CardContent className="p-6 text-center">
                                <div className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                    <category.icon className={`h-8 w-8 ${category.color}`} />
                                </div>
                                <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    {count.toLocaleString()} établissements
                                </p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCategories;