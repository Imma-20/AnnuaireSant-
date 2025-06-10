import { useState, useEffect } from "react";
import { TextField, Grid, MenuItem, FormControl, InputLabel, Select, Box, Typography, Paper } from "@mui/material";
import StructureCard from "../components/StructureCard";

// Données d'exemple
const sampleHealthCenters = [
  {
    idStructure: "1",
    nom: "Centre de Santé Principal de la Ville",
    type: "Hôpital",
    adresse: "123 Rue de la Santé, 75001 Paris",
    localisationGPS: "48.8566, 2.3522",
    contact: "01 23 45 67 89",
    horairesFermeture: "Urgences 24/7, Consultations 08:00 - 18:00",
  },
  {
    idStructure: "2",
    nom: "Clinique du Parc Fleuri",
    type: "Clinique",
    adresse: "456 Avenue du Parc, 75016 Paris",
    localisationGPS: "48.8622, 2.2770",
    contact: "01 98 76 54 32",
    horairesFermeture: "09:00 - 19:00, Samedi 09:00 - 13:00",
  },
  {
    idStructure: "3",
    nom: "Pharmacie Centrale de la Gare",
    type: "Pharmacie",
    adresse: "789 Boulevard de la Gare, 75010 Paris",
    localisationGPS: "48.8760, 2.3580",
    contact: "01 12 34 56 78",
    horairesFermeture: "08:30 - 20:00, Dimanche 10:00 - 18:00 (garde)",
  },
  {
    idStructure: "4",
    nom: "Centre de Santé Les Lilas",
    type: "Centre de Santé",
    adresse: "101 Rue des Lilas, 93260 Les Lilas",
    localisationGPS: "48.8795, 2.4170",
    contact: "01 48 48 48 48",
    horairesFermeture: "Lundi-Vendredi 09:00 - 12:30, 14:00 - 19:00",
  },
  {
    idStructure: "5",
    nom: "Hôpital Universitaire Grand Est",
    type: "Hôpital",
    adresse: "202 Avenue de Strasbourg, 67000 Strasbourg",
    localisationGPS: "48.5734, 7.7521",
    contact: "03 88 11 22 33",
    horairesFermeture: "Urgences 24/7, Visites 13:00 - 20:00",
  },
  {
    idStructure: "6",
    nom: "Clinique de la Vision Ouest",
    type: "Clinique",
    adresse: "33 Rue de la Vision, 44000 Nantes",
    localisationGPS: "47.2184, -1.5536",
    contact: "02 40 50 60 70",
    horairesFermeture: "08:00 - 18:00 (fermé le weekend)",
  },
  {
    idStructure: "7",
    nom: "Pharmacie du Vieux Port",
    type: "Pharmacie",
    adresse: "5 Quai des Belges, 13001 Marseille",
    localisationGPS: "43.2954, 5.3745",
    contact: "04 91 81 91 01",
    horairesFermeture: "09:00 - 19:30 (ouvert 7/7 pendant saison estivale)",
  },
  {
    idStructure: "8",
    nom: "Centre de Santé Jean Jaurès",
    type: "Centre de Santé",
    adresse: "77 Boulevard Jean Jaurès, 31000 Toulouse",
    localisationGPS: "43.6019, 1.4499",
    contact: "05 61 10 20 30",
    horairesFermeture: "09:00 - 17:00 (sur RDV uniquement)",
  },
  {
    idStructure: "9",
    nom: "Hôpital Pédiatrique Les Enfants d'Abord",
    type: "Hôpital",
    adresse: "1 Avenue des Petits Princes, 69008 Lyon",
    localisationGPS: "45.7319, 4.8694",
    contact: "04 72 00 00 00",
    horairesFermeture: "Urgences pédiatriques 24/7",
  },
  {
    idStructure: "10",
    nom: "Clinique Vétérinaire Les Compagnons",
    type: "Clinique",
    adresse: "15 Rue des Animaux, 75011 Paris",
    localisationGPS: "48.8580, 2.3790",
    contact: "01 55 66 77 88",
    horairesFermeture: "10:00 - 12:00, 15:00 - 19:00 (Samedi matin)",
  },
  {
    idStructure: "11",
    nom: "Pharmacie de Nuit Étoile",
    type: "Pharmacie",
    adresse: "Place de l'Étoile, 75008 Paris",
    localisationGPS: "48.8738, 2.2950",
    contact: "01 22 33 44 55",
    horairesFermeture: "20:00 - 08:00 (Service de garde)",
  },
  {
    idStructure: "12",
    nom: "Centre de Radiologie Médicale",
    type: "Centre de Santé",
    adresse: "88 Rue du Scanner, 59000 Lille",
    localisationGPS: "50.6320, 3.0576",
    contact: "03 20 99 88 77",
    horairesFermeture: "07:30 - 19:30",
  }

];
const structureTypes = ["Tous", "Hôpital", "Clinique", "Centre de Santé", "Pharmacie"];

const SearchService = () => {
  const [filters, setFilters] = useState({
    type: "",
    horaire: "",
    distance: "",
    nom: "",
  });

  const [filteredCenters, setFilteredCenters] = useState(sampleHealthCenters);

  useEffect(() => {
    const results = sampleHealthCenters.filter(center => {
      // Filtrer par type
      if (filters.type && center.type !== filters.type) {
        return false;
      }

      // Filtrer par nom
      if (filters.nom && !center.nom.toLowerCase().includes(filters.nom.toLowerCase())) {
        return false;
      }

      // Filtrer par horaire
      if (filters.horaire) {
        const currentHour = new Date().getHours();
        const [start, end] = filters.horaire.split('-').map(Number);

        if (currentHour >= start && currentHour < end) {
          return false;
        }
      }

      return true;
    });
    setFilteredCenters(results);
  }, [filters]); // Lorsque les filtres changent, le filtre est appliqué

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (!name) return;

    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  return (
    <div className="">
      <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
        <Typography variant="h4" gutterBottom>
          Trouver un établissement de santé
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Filtres de recherche
          </Typography>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid size={{ xs: 12, sm: 6, md: 3 }} >
              <FormControl fullWidth size="small">
                <InputLabel id="type-label">Type d'établissement</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={filters.type}
                  onChange={handleFilterChange}
                  label="Type d'établissement"
                >
                  <MenuItem value="">Tous les types</MenuItem>
                  {structureTypes.filter(type => type !== "Tous").map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="horaire-label">Horaire de fermeture</InputLabel>
                <Select
                  labelId="horaire-label"
                  name="horaire"
                  value={filters.horaire}
                  onChange={handleFilterChange}
                  label="Horaire de fermeture"
                >
                  <MenuItem value="">Toutes les heures</MenuItem>
                  <MenuItem value="8-12">Matin (8h-12h)</MenuItem>
                  <MenuItem value="12-14">Midi (12h-14h)</MenuItem>
                  <MenuItem value="17-8">Soir/Nuit (17h-8h)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="distance-label">Distance</InputLabel>
                <Select
                  labelId="distance-label"
                  name="distance"
                  value={filters.distance}
                  onChange={handleFilterChange}
                  label="Distance"
                >
                  <MenuItem value="">Toutes distances</MenuItem>
                  <MenuItem value="1">Moins de 1km</MenuItem>
                  <MenuItem value="5">Moins de 5km</MenuItem>
                  <MenuItem value="10">Moins de 10km</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                label="Rechercher par nom"
                name="nom"
                value={filters.nom}
                onChange={handleFilterChange}
                variant="outlined"
                placeholder="Entrez un nom..."
              />
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={3}>
          {filteredCenters.length > 0 ? (
            filteredCenters.map((center) => (
              <Grid key={center.idStructure} size={{ xs: 12, sm: 6, md: 4 }}>
                <StructureCard healthCenter={center} />
              </Grid>
            ))
          ) : (
            <Grid size="grow">
              <Typography variant="body1" align="center" sx={{ py: 4 }}>
                Aucun résultat trouvé pour votre recherche.
              </Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </div>
  );
};

export default SearchService;