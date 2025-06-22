import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming you have a Select component in your shadcn/ui

const AjouterStructure = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    nom_structure: "",
    type_structure: "",
    description: "",
    logo: null,
    adresse: "",
    quartier: "",
    ville: "",
    commune: "",
    departement: "",
    latitude: "",
    longitude: "",
    telephone_principal: "",
    telephone_secondaire: "",
    email_contact: "",
    site_web: "",
    horaires_ouverture: "", // This will be a string for now, could be JSON later
    est_de_garde: false,
    periode_garde_debut: "",
    periode_garde_fin: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type, files, checked } = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement;

    if (type === "file" && files) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom_structure || !formData.type_structure) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires (*)",
        variant: "destructive",
      });
      return;
    }

    console.log("Form submitted:", formData);

    toast({
      title: "Succès",
      description: "Structure de santé ajoutée avec succès !",
    });

    // Reset form
    setFormData({
      nom_structure: "",
      type_structure: "",
      description: "",
      logo: null,
      adresse: "",
      quartier: "",
      ville: "",
      commune: "",
      departement: "",
      latitude: "",
      longitude: "",
      telephone_principal: "",
      telephone_secondaire: "",
      email_contact: "",
      site_web: "",
      horaires_ouverture: "",
      est_de_garde: false,
      periode_garde_debut: "",
      periode_garde_fin: "",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-green-500 px-4 py-8">
      <div
        className="absolute top-6 left-6 flex items-center space-x-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <LogOut className="w-5 h-5 text-white" />
        <span className="text-white text-lg font-medium">
          Retour à la page d'accueil
        </span>
      </div>

      <Card className="w-full max-w-2xl rounded-2xl shadow-lg bg-white">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-green-700">
            Fiche d'Ajout de Structure de Santé
          </CardTitle>
          <p className="text-center text-gray-500 text-sm">
            Veuillez remplir les informations de la structure.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700">
                Informations Générales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="nom_structure">Nom de la structure *</Label>
                  <Input
                    id="nom_structure"
                    name="nom_structure"
                    value={formData.nom_structure}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="type_structure">Type de structure *</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("type_structure", value)
                    }
                    value={formData.type_structure}
                  >
                    <SelectTrigger id="type_structure">
                      <SelectValue placeholder="Sélectionnez un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pharmacie">Pharmacie</SelectItem>
                      <SelectItem value="hopital">Hôpital</SelectItem>
                      <SelectItem value="laboratoire">Laboratoire</SelectItem>
                      <SelectItem value="clinique">Clinique</SelectItem>
                      <SelectItem value="centre_medical">
                        Centre Médical
                      </SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="description">Description (facultatif)</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Décrivez la structure, ses spécialités, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="logo">Logo de la structure (facultatif)</Label>
                <Input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700">Adresse</h3>
              <div className="space-y-1">
                <Label htmlFor="adresse">Adresse complète *</Label>
                <Input
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  placeholder="Ex: 123 Rue de la Santé"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="quartier">Quartier (facultatif)</Label>
                  <Input
                    id="quartier"
                    name="quartier"
                    value={formData.quartier}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="ville">Ville (facultatif)</Label>
                  <Input
                    id="ville"
                    name="ville"
                    value={formData.ville}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="commune">Commune (facultatif)</Label>
                  <Input
                    id="commune"
                    name="commune"
                    value={formData.commune}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="departement">Département (facultatif)</Label>
                  <Input
                    id="departement"
                    name="departement"
                    value={formData.departement}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="latitude">Latitude (facultatif)</Label>
                  <Input
                    id="latitude"
                    name="latitude"
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="longitude">Longitude (facultatif)</Label>
                  <Input
                    id="longitude"
                    name="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700">Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="telephone_principal">
                    Téléphone Principal (facultatif)
                  </Label>
                  <Input
                    id="telephone_principal"
                    name="telephone_principal"
                    value={formData.telephone_principal}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="telephone_secondaire">
                    Téléphone Secondaire (facultatif)
                  </Label>
                  <Input
                    id="telephone_secondaire"
                    name="telephone_secondaire"
                    value={formData.telephone_secondaire}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="email_contact">Email de contact (facultatif)</Label>
                  <Input
                    id="email_contact"
                    name="email_contact"
                    type="email"
                    value={formData.email_contact}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="site_web">Site Web (facultatif)</Label>
                  <Input
                    id="site_web"
                    name="site_web"
                    type="url"
                    value={formData.site_web}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-700">
                Horaires et Garde
              </h3>
              <div className="space-y-1">
                <Label htmlFor="horaires_ouverture">
                  Horaires d'ouverture (format libre, ex: Lun-Ven 8h-18h)
                </Label>
                <Textarea
                  id="horaires_ouverture"
                  name="horaires_ouverture"
                  value={formData.horaires_ouverture}
                  onChange={handleInputChange}
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Input
                  id="est_de_garde"
                  name="est_de_garde"
                  type="checkbox"
                  checked={formData.est_de_garde}
                  onChange={handleInputChange}
                  className="w-4 h-4"
                />
                <Label htmlFor="est_de_garde">Est de garde ?</Label>
              </div>

              {formData.est_de_garde && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="periode_garde_debut">
                      Début Période de Garde
                    </Label>
                    <Input
                      id="periode_garde_debut"
                      name="periode_garde_debut"
                      type="date"
                      value={formData.periode_garde_debut}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="periode_garde_fin">
                      Fin Période de Garde
                    </Label>
                    <Input
                      id="periode_garde_fin"
                      name="periode_garde_fin"
                      type="date"
                      value={formData.periode_garde_fin}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
            >
              Ajouter la structure
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AjouterStructure;