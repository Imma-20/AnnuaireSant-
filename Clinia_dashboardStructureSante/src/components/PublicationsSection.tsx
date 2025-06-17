
import { useState } from "react";
import { Plus, Edit, Eye, Heart, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PublicationsSectionProps {
  isPreview?: boolean;
}

const publications = [
  {
    id: 1,
    title: "Comprendre la Santé Cardiovasculaire à l'Ère Moderne",
    excerpt: "Un guide complet pour maintenir la santé cardiaque grâce aux changements de mode de vie et aux interventions médicales...",
    status: "publié",
    views: 1249,
    likes: 89,
    comments: 23,
    date: "2024-06-14",
    category: "Cardiologie",
  },
  {
    id: 2,
    title: "Dernières Avancées dans la Gestion du Diabète",
    excerpt: "Explorer les nouveaux protocoles de traitement et les stratégies de soins aux patients pour une gestion efficace du diabète...",
    status: "brouillon",
    views: 0,
    likes: 0,
    comments: 0,
    date: "2024-06-13",
    category: "Endocrinologie",
  },
  {
    id: 3,
    title: "Santé Mentale chez les Professionnels de Santé",
    excerpt: "Aborder les préoccupations croissantes concernant la santé mentale des professionnels de santé...",
    status: "publié",
    views: 856,
    likes: 67,
    comments: 15,
    date: "2024-06-12",
    category: "Psychologie",
  },
];

const statusLabels = {
  "all": "Toutes",
  "publié": "Publiées",
  "brouillon": "Brouillons",
};

export const PublicationsSection = ({ isPreview }: PublicationsSectionProps) => {
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredPublications = publications.filter(pub => 
    selectedStatus === "all" || pub.status === selectedStatus
  );

  const displayedPublications = isPreview ? filteredPublications.slice(0, 2) : filteredPublications;

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <span>Publications</span>
            {!isPreview && (
              <Badge variant="secondary">{publications.length}</Badge>
            )}
          </CardTitle>
          {!isPreview && (
            <Button className="bg-blue-500 hover:bg-blue-600">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Publication
            </Button>
          )}
        </div>
        {!isPreview && (
          <div className="flex space-x-2 mt-4">
            {["all", "publié", "brouillon"].map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
              >
                {statusLabels[status as keyof typeof statusLabels]}
              </Button>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {displayedPublications.map((pub) => (
          <div key={pub.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{pub.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{pub.excerpt}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <Badge variant={pub.status === "publié" ? "default" : "secondary"}>
                    {pub.status}
                  </Badge>
                  <span className="text-blue-600">{pub.category}</span>
                  <span>{pub.date}</span>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {pub.status === "publié" && (
              <div className="flex items-center space-x-6 text-sm text-gray-500 pt-2 border-t">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{pub.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{pub.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{pub.comments}</span>
                </div>
              </div>
            )}
          </div>
        ))}
        {isPreview && (
          <Button variant="ghost" className="w-full text-blue-600">
            Voir Toutes les Publications
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
