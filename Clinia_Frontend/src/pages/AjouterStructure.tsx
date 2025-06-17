import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
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
        adresse: "",
        contact: "",
        horairesOuverture: "",
        horairesFermeture: "",
        services: "",
        assurances: "",
        photo: null,
        typeService: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, files } = e.target as HTMLInputElement;
        if (name === "photo" && files) {
            setFormData((prev) => ({
                ...prev,
                photo: files[0],
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.nom || !formData.adresse || !formData.contact) {
            toast({
                title: "Erreur",
                description: "Veuillez remplir tous les champs obligatoires",
                variant: "destructive",
            });
            return;
        }

        console.log("Form submitted:", formData);

        toast({
            title: "Succès",
            description: "Structure de santé ajoutée avec succès !",
        });

        setFormData({
            nom: "",
            adresse: "",
            contact: "",
            horairesOuverture: "",
            horairesFermeture: "",
            services: "",
            assurances: "",
            photo: null,
            typeService: "",
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-green-500 px-4 py-8">
            <div className="absolute top-6 left-6 flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
                <LogOut className="w-5 h-5 text-white" />
                <span className="text-white text-lg font-medium">Retour à la page d'accueil</span>
            </div>

            <Card className="w-full max-w-xl rounded-2xl shadow-lg bg-white">
                <CardHeader>
                    <CardTitle className="text-2xl text-center text-green-700">Ajouter une structure de santé</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1">
                            <Label htmlFor="nom">Nom de la structure *</Label>
                            <Input id="nom" name="nom" value={formData.nom} onChange={handleInputChange} required />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="adresse">Adresse *</Label>
                            <Textarea id="adresse" name="adresse" value={formData.adresse} onChange={handleInputChange} rows={2} required />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="contact">Téléphone *</Label>
                            <Input id="contact" name="contact" value={formData.contact} onChange={handleInputChange} required />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="horairesOuverture">Horaire d'ouverture</Label>
                            <Input id="horairesOuverture" name="horairesOuverture" value={formData.horairesOuverture} onChange={handleInputChange} />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="horairesFermeture">Horaire de fermeture</Label>
                            <Input id="horairesFermeture" name="horairesFermeture" value={formData.horairesFermeture} onChange={handleInputChange} />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="services">Services disponibles</Label>
                            <Textarea id="services" name="services" value={formData.services} onChange={handleInputChange} rows={2} />
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="assurances">Assurances acceptées</Label>
                            <select
                                id="assurances"
                                name="assurances"
                                value={formData.assurances}
                                onChange={handleInputChange}
                                className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">-- Sélectionnez --</option>
                                <option value="cnam">CNAM</option>
                                <option value="sunu">SUNU Assurances</option>
                                <option value="nsia">NSIA</option>
                                <option value="saar">SAAR</option>
                                <option value="atlantique">Atlantique Assurance</option>
                                <option value="autre">Autre</option>
                            </select>
                        </div>


                        <div className="space-y-1">
                            <Label htmlFor="typeService">Type de service</Label>
                            <select
                                id="typeService"
                                name="typeService"
                                value={formData.typeService}
                                onChange={handleInputChange}
                                className="w-full border border-input rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="">-- Sélectionnez --</option>
                                <option value="pharmacie">Pharmacie</option>
                                <option value="hopital">Hôpital</option>
                                <option value="clinique">Clinique</option>
                                <option value="reeducation">Centre de rééducation</option>
                                <option value="imagerie">Centre d’imagerie</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <Label htmlFor="photo">Télécharger une photo</Label>
                            <Input id="photo" name="photo" type="file" accept="image/*" onChange={handleInputChange} />
                        </div>

                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
                            Ajouter la structure
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default AjouterStructure;
