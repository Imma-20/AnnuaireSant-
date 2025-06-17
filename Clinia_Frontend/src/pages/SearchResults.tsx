import { useState } from "react";
import {
  Star, MapPin, Phone, Clock,
  Filter, SlidersHorizontal
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface SearchResultsProps {
  query: string;
  category: string;
}

const ResultatsRecherches = ({ query, category }: SearchResultsProps) => {
  const [sortBy, setSortBy] = useState("rating");
  const [selectedStructure, setSelectedStructure] = useState("");
  const [selectedHeure, setSelectedHeure] = useState("");
  const [selectedAssurance, setSelectedAssurance] = useState("");
  const [distanceMax, setDistanceMax] = useState("");

  const results = [
    {
      id: 1,
      name: "Centre Médical Espoir",
      category: "Clinique",
      rating: 4.8,
      reviews: 124,
      location: "Cotonou, Zogbo",
      phone: "+229 90 12 34 56",
      hours: "08h00 - 20h00",
      image: "https://images.unsplash.com/photo-1588776814546-ec7e55f9b144?w=400",
      price: "Consultation",
      distance: "2.3 km",
      assurance: ["CNSS", "MSA", "AXA"]
    },
    // autres résultats...
  ];

  return (
    <>
      <Header />

      <section className="py-8 px-4 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Résultats de recherche
            </h1>
            <p className="text-muted-foreground">
              {results.length} résultats trouvés pour "{query || category}" à Cotonou
            </p>
          </div>

          {/* Filtres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block mb-1 text-sm text-muted-foreground">Type de structure</label>
              <Select onValueChange={setSelectedStructure}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hôpital">Hôpital</SelectItem>
                  <SelectItem value="clinique">Clinique</SelectItem>
                  <SelectItem value="pharmacie">Pharmacie</SelectItem>
                  <SelectItem value="laboratoire">Laboratoire</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1 text-sm text-muted-foreground">Horaires disponibles</label>
              <Select onValueChange={setSelectedHeure}>
                <SelectTrigger>
                  <SelectValue placeholder="Ex: Matin, Soir..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="matin">Matin (08h - 12h)</SelectItem>
                  <SelectItem value="après-midi">Après-midi (12h - 17h)</SelectItem>
                  <SelectItem value="soir">Soir (17h - 21h)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1 text-sm text-muted-foreground">Assurance acceptée</label>
              <Select onValueChange={setSelectedAssurance}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CNSS">CNSS</SelectItem>
                  <SelectItem value="AXA">AXA</SelectItem>
                  <SelectItem value="MSA">MSA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-1 text-sm text-muted-foreground">Distance maximale (km)</label>
              <Input
                type="number"
                placeholder="Ex: 5"
                value={distanceMax}
                onChange={(e) => setDistanceMax(e.target.value)}
              />
            </div>
          </div>

          {/* Tri */}
          {/* <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtres
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Affiner
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Trier par:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Note</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="reviews">Avis</SelectItem>
                  <SelectItem value="name">Nom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div> */}

          {/* Résultats */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {results.map((business) => (
              <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  <img src={business.image} alt={business.name} className="w-full h-48 object-cover" />
                  <Badge className="absolute top-4 left-4 bg-background/90 text-foreground">{business.price}</Badge>
                  <Badge className="absolute top-4 right-4 bg-green-600 text-white">{business.distance}</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-foreground">{business.name}</h3>
                    <Badge variant="outline">{business.category}</Badge>
                  </div>
                  <div className="flex items-center mb-3">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1">{business.rating}</span>
                    <span className="text-sm text-muted-foreground ml-1">({business.reviews} avis)</span>
                  </div>
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" />{business.location}</div>
                    <div className="flex items-center"><Phone className="h-4 w-4 mr-2" />{business.phone}</div>
                    <div className="flex items-center"><Clock className="h-4 w-4 mr-2" />{business.hours}</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">Voir détails</Button>
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">Contacter</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charger plus */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Charger plus de résultats
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default ResultatsRecherches;
