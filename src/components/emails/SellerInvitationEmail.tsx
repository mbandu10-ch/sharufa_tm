import {
  Button,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface SellerInvitationEmailProps {
  sellerName: string;
  sellerLink: string;
}

export const SellerInvitationEmail = ({
  sellerName,
  sellerLink,
}: SellerInvitationEmailProps) => {
  return (
    <EmailLayout previewText={`Développez votre activité internationale avec Sharufa`}>
      <Text style={h1}>Boostez votre croissance avec Sharufa</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      <Text style={text}>
        Sharufa permet aux boutiques et fournisseurs de vendre à une clientèle internationale dans un environnement structuré et professionnel.
      </Text>
      <Text style={text}>Avec Sharufa, vous bénéficiez notamment de :</Text>
      <ul style={list}>
        <li>Visibilité internationale</li>
        <li>Logistique facilitée (Dubaï, Turquie, Chine)</li>
        <li>Accompagnement commercial dédié</li>
        <li>Gestion simplifiée de votre catalogue</li>
      </ul>

      <Section style={btnContainer}>
        <Button style={button} href={sellerLink}>
          Rejoindre Sharufa
        </Button>
      </Section>
      
      <Text style={text}>
        Cordialement,
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
