import {
  Button,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface ShopApprovedEmailProps {
  sellerName: string;
  shopName: string;
  sellerDashboardLink: string;
}

export const ShopApprovedEmail = ({
  sellerName,
  shopName,
  sellerDashboardLink,
}: ShopApprovedEmailProps) => {
  return (
    <EmailLayout previewText={`Félicitations ! Votre boutique ${shopName} est approuvée.`}>
      <Text style={h1}>Boutique approuvée</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      <Text style={text}>
        Excellente nouvelle : votre boutique <strong>{shopName}</strong> a été approuvée sur Sharufa.
      </Text>
      <Text style={text}>Vous pouvez désormais :</Text>
      <ul style={list}>
        <li>Accéder à votre espace vendeur</li>
        <li>Ajouter vos produits</li>
        <li>Gérer votre catalogue</li>
        <li>Suivre vos commandes</li>
      </ul>
      
      <Section style={btnContainer}>
        <Button style={button} href={sellerDashboardLink}>
          Accéder au dashboard vendeur
        </Button>
      </Section>
      
      <Text style={text}>
        Bienvenue sur Sharufa,
        <br />
        L'équipe Sharufa
      </Text>
    </EmailLayout>
  );
};

const h1 = {
  color: '#004D40',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
};

const list = {
  ...text,
  paddingLeft: '20px',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#D4AF37',
  borderRadius: '8px',
  color: '#004D40',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 24px',
};
