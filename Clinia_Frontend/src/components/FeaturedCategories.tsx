import { Hospital, Stethoscope, Microscope, Pill, ScanLine, PersonStanding, Ambulance } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeaturedCategoriesProps {
  onCategorySelect: (category: string) => void;
}

const FeaturedCategories = ({ onCategorySelect }: FeaturedCategoriesProps) => {
  // J'ai mis à jour les icônes et les noms pour plus de pertinence.
  const categories = [
    { icon: Hospital, name: "Hôpitaux", count: "1,234", color: "text-red-600", bgColor: "bg-red-100" },
    { icon: Stethoscope, name: "Cliniques", count: "567", color: "text-blue-600", bgColor: "bg-blue-100" },
    { icon: Microscope, name: "Laboratoires", count: "89", color: "text-green-600", bgColor: "bg-green-100" },
    { icon: Pill, name: "Pharmacies", count: "345", color: "text-teal-600", bgColor: "bg-teal-100" },
    { icon: ScanLine, name: "Cabinets d'imagerie", count: "678", color: "text-purple-600", bgColor: "bg-purple-100" },
    { icon: PersonStanding, name: "Centres de rééducation", count: "234", color: "text-yellow-600", bgColor: "bg-yellow-100" },
    { icon: Ambulance, name: "Ambulances & Urgences", count: "123", color: "text-orange-600", bgColor: "bg-orange-100" },
  ];

  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Explorez par catégorie
          </h2>
          <p className="text-muted-foreground text-lg">
            Trouvez rapidement l'établissement de santé qu'il vous faut
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Note: Pour un affichage parfait, il est mieux d'avoir un multiple de 4 ou 2 catégories. 
              Avec 7 catégories, la dernière ligne aura un élément seul sur mobile et 3 sur grand écran.
              Vous pourriez ajouter une 8ème catégorie comme "Opticiens" ou "Cabinets Dentaires".
          */}
          {categories.map((category, index) => (
            <Card 
              key={index}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              onClick={() => onCategorySelect(category.name.toLowerCase())}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <category.icon className={`h-8 w-8 ${category.color}`} />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.count} établissements</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;