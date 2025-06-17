
import { useState } from "react";
import { Star, MapPin, Phone, Clock, Filter, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchResultsProps {
  query: string;
  category: string;
}

const ResultatsRecherches = ({ query, category }: SearchResultsProps) => {
  const [sortBy, setSortBy] = useState("rating");
  const [filterOpen, setFilterOpen] = useState(false);

  // Mock search results
  const results = [
    {
      id: 1,
      name: "Restaurant Le Gourmet",
      category: "Restaurant",
      rating: 4.8,
      reviews: 124,
      location: "Kinshasa, Gombe",
      phone: "+243 123 456 789",
      hours: "9h00 - 22h00",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      price: "$$",
      distance: "2.3 km"
    },
    {
      id: 2,
      name: "Café Central",
      category: "Restaurant",
      rating: 4.5,
      reviews: 67,
      location: "Kinshasa, Kalamu",
      phone: "+243 987 654 321",
      hours: "7h00 - 19h00",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
      price: "$",
      distance: "1.8 km"
    },
    {
      id: 3,
      name: "Brasserie Kinoise",
      category: "Restaurant",
      rating: 4.6,
      reviews: 89,
      location: "Kinshasa, Lingwala",
      phone: "+243 555 666 777",
      hours: "11h00 - 23h00",
      image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
      price: "$$",
      distance: "3.1 km"
    }
  ];

  return (
    <section className="py-8 px-4 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Résultats de recherche
          </h1>
          <p className="text-muted-foreground">
            {results.length} résultats trouvés pour "{query || category}" à Kinshasa
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2"
            >
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
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {results.map((business) => (
            <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={business.image} 
                  alt={business.name}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-background/90 text-foreground">
                  {business.price}
                </Badge>
                <Badge className="absolute top-4 right-4 bg-green-600 text-white">
                  {business.distance}
                </Badge>
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
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {business.location}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {business.phone}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {business.hours}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Voir détails
                  </Button>
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    Contacter
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Charger plus de résultats
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ResultatsRecherches;
