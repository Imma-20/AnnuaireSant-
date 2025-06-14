
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const AjouterStructure = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    nom: "",
    type: "",
    adresse: "",
    localisationGps: "",
    contact: "",
    horairesFermeture: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.nom || !formData.type || !formData.adresse || !formData.contact) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData);
    
    toast({
      title: "Succès",
      description: "Votre entreprise a été ajoutée avec succès!",
    });
    
    // Reset form
    setFormData({
      nom: "",
      type: "",
      adresse: "",
      localisationGps: "",
      contact: "",
      horairesFermeture: ""
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold text-foreground">
            Ajouter une entreprise
          </h1>
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader>
            <CardTitle>Informations de l'entreprise</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div className="space-y-2">
                <Label htmlFor="nom">Nom de l'entreprise *</Label>
                <Input
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Entrez le nom de l'entreprise"
                  required
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Type d'entreprise *</Label>
                <Input
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Ex: Restaurant, Hôtel, Banque..."
                  required
                />
              </div>

              {/* Adresse */}
              <div className="space-y-2">
                <Label htmlFor="adresse">Adresse *</Label>
                <Textarea
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  placeholder="Entrez l'adresse complète de l'entreprise"
                  required
                  rows={3}
                />
              </div>

              {/* Localisation GPS */}
              <div className="space-y-2">
                <Label htmlFor="localisationGps">Localisation GPS</Label>
                <Input
                  id="localisationGps"
                  name="localisationGps"
                  value={formData.localisationGps}
                  onChange={handleInputChange}
                  placeholder="Ex: -4.2634, 15.2429"
                />
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label htmlFor="contact">Contact *</Label>
                <Input
                  id="contact"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Téléphone, email, etc."
                  required
                />
              </div>

              {/* Horaires de fermeture */}
              <div className="space-y-2">
                <Label htmlFor="horairesFermeture">Horaires de fermeture</Label>
                <Input
                  id="horairesFermeture"
                  name="horairesFermeture"
                  value={formData.horairesFermeture}
                  onChange={handleInputChange}
                  placeholder="Ex: Lundi-Vendredi: 8h-18h, Samedi: 8h-14h"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  Ajouter l'entreprise
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AjouterStructure;