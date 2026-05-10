import {
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface WelcomeEmailProps {
  firstName: string;
  dashboardLink: string;
}

export const WelcomeEmail = ({
  firstName,
  dashboardLink,
}: WelcomeEmailProps) => {
  return (
    <EmailLayout previewText={`Bienvenue sur Sharufa, ${firstName} !`}>
      <Text style={h1}>Bienvenue sur Sharufa</Text>
      <Text style={text}>Bonjour {firstName},</Text>
      <Text style={text}>
        Bienvenue sur Sharufa. Votre compte a bien été créé.
      </Text>
      <Text style={text}>Vous pouvez désormais :</Text>
      <ul style={list}>
        <li>Explorer la marketplace</li>
        <li>Rechercher des produits par pays</li>
        <li>Découvrir des boutiques</li>
        <li>Soumettre une demande Buy For Me</li>
        <li>Suivre vos commandes plus facilement</li>
      </ul>
      <Section style={btnContainer}>
        <Button style={button} href={dashboardLink}>
          Accéder à mon espace
        </Button>
      </Section>
      <Text style={text}>
        Merci de votre confiance,
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
  backgroundColor: '#D4AF37', // Sharufa Gold
  borderRadius: '8px',
  color: '#004D40', // Black/Green contrast
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 24px',
};
