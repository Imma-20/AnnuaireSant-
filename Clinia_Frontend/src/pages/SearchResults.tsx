
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, MapPin, Phone, Clock, Star, Eye, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  const businesses = [
    {
      id: 1,
      name: "Restaurant Chez Ntemba",
      category: "Restaurant",
      rating: 4.8,
      reviews: 124,
      location: "Kinshasa, Gombe",
      phone: "+243 123 456 789",
      hours: "9h00 - 22h00",
      description: "Restaurant traditionnel offrant des spécialités congolaises dans un cadre authentique et chaleureux.",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      featured: true
    },
    {
      id: 2,
      name: "Hôtel Memling",
      category: "Hôtel",
      rating: 4.6,
      reviews: 89,
      location: "Kinshasa, Gombe",
      phone: "+243 987 654 321",
      hours: "24h/24",
      description: "Hôtel de luxe au cœur de Kinshasa offrant des services haut de gamme pour voyageurs d'affaires.",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      featured: true
    },
    {
      id: 3,
      name: "Clinique Ngaliema",
      category: "Santé",
      rating: 4.9,
      reviews: 156,
      location: "Kinshasa, Ngaliema",
      phone: "+243 555 666 777",
      hours: "8h00 - 18h00",
      description: "Centre médical moderne proposant des soins de qualité avec équipement dernier cri.",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop",
      featured: false
    },
  ];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleViewMore = (businessId: number) => {
    navigate(`/entreprise/${businessId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="bg-green-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="text-white hover:bg-green-700 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-2xl font-bold text-white">
              Résultats de recherche
            </h1>
          </div>
          
          <div className="max-w-2xl relative">
            <Input
              placeholder="Rechercher une entreprise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="h-12 pl-6 pr-32 text-lg"
            />
            <Button 
              onClick={handleSearch}
              className="absolute right-2 top-2 h-8 px-6 bg-green-800 hover:bg-green-900 text-white"
            >
              <Search className="mr-2 h-4 w-4" />
              Rechercher
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <p className="text-muted-foreground">
            {businesses.length} résultat(s) trouvé(s) pour "{searchParams.get('q')}"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((business) => (
            <Card key={business.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className="relative">
                <img 
                  src={business.image} 
                  alt={business.name}
                  className="w-full h-48 object-cover"
                />
                {business.featured && (
                  <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                    Recommandé
                  </Badge>
                )}
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

                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {business.description}
                </p>

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

                <Button 
                  onClick={() => handleViewMore(business.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir plus
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SearchResultsPage;
