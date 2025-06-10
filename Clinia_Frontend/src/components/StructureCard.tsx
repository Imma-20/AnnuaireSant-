import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import { styled } from '@mui/material/styles';

interface HealthCenter {
  idStructure: string;
  nom: string;
  type: string;
  adresse: string;
  localisationGPS: string;
  contact: string;
  horairesFermeture: string;
}

interface StructureCardProps {
  healthCenter: HealthCenter;
}

const StyledCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: '16px',
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const InfoRow = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  margin: '8px 0',
  gap: '8px',
});

const StructureCard: React.FC<StructureCardProps> = ({ healthCenter }) => {
  return (
    <StyledCard>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            {healthCenter.nom}
          </Typography>
          <Chip 
            label={healthCenter.type} 
            color="primary" 
            size="small" 
            variant="outlined"
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>
        
        <InfoRow>
          <LocationOnIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {healthCenter.adresse}
          </Typography>
        </InfoRow>

        <InfoRow>
          <PhoneIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            {healthCenter.contact}
          </Typography>
        </InfoRow>

        <InfoRow>
          <AccessTimeIcon color="action" fontSize="small" />
          <Typography variant="body2" color="text.secondary">
            Fermeture: {healthCenter.horairesFermeture}
          </Typography>
        </InfoRow>
      </CardContent>
    </StyledCard>
  );
};

export default StructureCard;