
import { Star, MapPin, Phone, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "react-day-picker";
import { useNavigate } from "react-router-dom";

const AlaUne = () => {
  const navigate = useNavigate();

  const centre = [
    {
      id: 1,
      name: "Pharmacie Tanto",
      category: "Pharmacie",
      rating: 4.8,
      reviews: 124,
      location: "Tanto, akpakpa",
      phone: "+243 123 456 789",
      hours: "9h00 - 22h00",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
      featured: true
    },
    {
      id: 2,
      name: "Centre 2",
      category: "Hôpital",
      rating: 4.6,
      reviews: 89,
      location: "Kinshasa, Gombe",
      phone: "+243 987 654 321",
      hours: "24h/24",
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
      featured: true
    },
    {
      id: 3,
      name: "Clinique Ngaliema",
      category: "Clinique",
      rating: 4.9,
      reviews: 156,
      location: "Kinshasa, Ngaliema",
      phone: "+243 555 666 777",
      hours: "8h00 - 18h00",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400&h=300&fit=crop",
      featured: false
    },
    {
      id: 4,
      name: "Centre 5",
      category: "Pharmacie",
      rating: 4.3,
      reviews: 67,
      location: "Kinshasa, Gombe",
      phone: "+243 111 222 333",
      hours: "8h00 - 15h00",
      image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&h=300&fit=crop",
      featured: false
    },
    {
      id: 5,
      name: "Siloé",
      category: "Pharmacie",
      rating: 4.7,
      reviews: 203,
      location: "Degakonn akpakpa",
      phone: "+243 444 555 666",
      hours: "7h00 - 16h00",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
      featured: false
    },
    {
      id: 6,
      name: "Centre 7",
      category: "Laboratoire",
      rating: 4.4,
      reviews: 92,
      location: "Kinshasa, Kalamu",
      phone: "+243 777 888 999",
      hours: "8h00 - 17h00",
      image: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400&h=300&fit=crop",
      featured: false
    }
  ];

  const handleViewMore = (centerId: number) => {
    navigate(`/centre/${centerId}`);
  };

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
           Les structures de santé actuellement ouvertes !
          </h2>
          {/* <p className="text-muted-foreground text-lg">
            Les structures de santé les mieux notées par notre communauté
          </p> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {centre.map((centre) => (
            <Card key={centre.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={centre.image}
                  alt={centre.name}
                  className="w-full h-48 object-cover"
                />
                {centre.featured && (
                  <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                    Recommandé
                  </Badge>
                )}
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-foreground">{centre.name}</h3>
                  <Badge variant="outline">{centre.category}</Badge>
                </div>

                <div className="flex items-center mb-3">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">{centre.rating}</span>
                  <span className="text-sm text-muted-foreground ml-1">({centre.reviews} avis)</span>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {centre.location}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {centre.phone}
                  </div>


                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {centre.hours}

                    </div>
                    <a className="cursor-pointer rounded-lg hover:border-transparent hover:bg-green-700 text-green-600 p-1 hover:text-white text-sm font-medium"
                    onClick={() => handleViewMore(centre.id)}>
                      Voir plus
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AlaUne;
