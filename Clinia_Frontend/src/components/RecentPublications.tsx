
import { Calendar, User, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RecentPublications = () => {
  const publications = [
    {
      id: 1,
      title: "Nouvelle société de transport urbain à Brazzaville",
      excerpt: "Une nouvelle compagnie de transport vient d'ouvrir ses portes pour améliorer la mobilité urbaine...",
      author: "Admin CongoFinder",
      date: "2024-12-10",
      category: "Transport",
      views: 324,
      image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Ouverture d'un nouveau centre médical à Pointe-Noire",
      excerpt: "Le centre médical moderne offre des services de pointe pour la population locale...",
      author: "Équipe CongoFinder",
      date: "2024-12-08",
      category: "Santé",
      views: 287,
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Forum des entrepreneurs congolais 2024",
      excerpt: "Un événement majeur pour promouvoir l'entrepreneuriat local et les opportunités d'affaires...",
      author: "CongoFinder",
      date: "2024-12-05",
      category: "Événements",
      views: 456,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop"
    },
  ];

  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Publications récentes
          </h2>
          <p className="text-muted-foreground text-lg">
            Restez informé des dernières actualités du monde des affaires au Congo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publications.map((publication) => (
            <Card key={publication.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img 
                  src={publication.image} 
                  alt={publication.title}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-green-600 text-white">
                  {publication.category}
                </Badge>
              </div>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg text-foreground mb-3 line-clamp-2">
                  {publication.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                  {publication.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center">
                    <User className="h-3 w-3 mr-1" />
                    {publication.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(publication.date).toLocaleDateString('fr-FR')}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Eye className="h-3 w-3 mr-1" />
                    {publication.views} vues
                  </div>
                  <a href="#" className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Lire la suite →
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentPublications;
