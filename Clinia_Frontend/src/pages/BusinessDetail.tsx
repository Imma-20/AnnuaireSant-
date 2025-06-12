
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Clock, Globe, Mail, Star, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BusinessDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for business details
  const business = {
    id: 1,
    name: "Restaurant Chez Ntemba",
    category: "Restaurant",
    rating: 4.8,
    reviews: 124,
    location: "Avenue de l'Indépendance, Kinshasa, Gombe",
    phone: "+243 123 456 789",
    email: "contact@chezntemba.cd",
    website: "www.chezntemba.cd",
    hours: "9h00 - 22h00",
    description: "Restaurant traditionnel offrant des spécialités congolaises dans un cadre authentique et chaleureux. Nous proposons une cuisine raffinée mettant en valeur les saveurs locales avec des ingrédients frais et de qualité.",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop",
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop",
    ],
    services: ["Cuisine traditionnelle", "Service de livraison", "Événements privés", "Terrasse"],
    openingHours: {
      "Lundi": "9h00 - 22h00",
      "Mardi": "9h00 - 22h00",
      "Mercredi": "9h00 - 22h00",
      "Jeudi": "9h00 - 22h00",
      "Vendredi": "9h00 - 23h00",
      "Samedi": "9h00 - 23h00",
      "Dimanche": "10h00 - 22h00",
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="relative">
        <img 
          src={business.image} 
          alt={business.name}
          className="w-full h-64 md:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/20 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{business.name}</h1>
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
            <span className="text-lg font-medium mr-2">{business.rating}</span>
            <span className="text-white/80">({business.reviews} avis)</span>
          </div>
        </div>
        <div className="absolute top-6 right-6 flex gap-2">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Heart className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>À propos</CardTitle>
                  <Badge variant="outline">{business.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {business.description}
                </p>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Services proposés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {business.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Galerie photos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {business.gallery.map((photo, index) => (
                    <img 
                      key={index}
                      src={photo} 
                      alt={`Photo ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Informations de contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-muted-foreground" />
                  <span className="text-sm">{business.location}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-muted-foreground" />
                  <a href={`tel:${business.phone}`} className="text-sm text-green-600 hover:underline">
                    {business.phone}
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-muted-foreground" />
                  <a href={`mailto:${business.email}`} className="text-sm text-green-600 hover:underline">
                    {business.email}
                  </a>
                </div>
                <div className="flex items-center">
                  <Globe className="h-5 w-5 mr-3 text-muted-foreground" />
                  <a href={`https://${business.website}`} className="text-sm text-green-600 hover:underline">
                    {business.website}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horaires d'ouverture</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(business.openingHours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="font-medium">{day}</span>
                      <span className="text-muted-foreground">{hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BusinessDetail;
