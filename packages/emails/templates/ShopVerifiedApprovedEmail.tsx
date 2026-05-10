import {
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface ShopVerifiedApprovedEmailProps {
  sellerName: string;
  shopName: string;
  dashboardLink: string;
}

export const ShopVerifiedApprovedEmail = ({
  sellerName,
  shopName,
  dashboardLink,
}: ShopVerifiedApprovedEmailProps) => {
  return (
    <EmailLayout previewText={`Félicitations ! Votre boutique ${shopName} est vérifiée`}>
      <Text style={h1}>Votre boutique est vérifiée et approuvée</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      <Text style={text}>
        Excellente nouvelle : votre boutique <strong>{shopName}</strong> a été vérifiée et approuvée sur Sharufa.
      </Text>
      <Text style={text}>
        Votre badge <strong>Verified</strong> est désormais actif, et vous pouvez profiter pleinement de votre activité sur notre plateforme.
      </Text>

      <Section style={successCard}>
        <Text style={summaryItem}>🎉 Vous pouvez maintenant :</Text>
        <Text style={summaryItem}>• Publier et gérer vos produits</Text>
        <Text style={summaryItem}>• Suivre vos commandes en temps réel</Text>
        <Text style={summaryItem}>• Développer votre marque à l'international</Text>
      </Section>

      <Section style={btnContainer}>
        <Button style={button} href={dashboardLink}>
          Accéder à mon espace vendeur
        </Button>
      </Section>

      <Text style={text}>
        Bienvenue sur Sharufa,
        <br />
        L’équipe Sharufa
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

const successCard = {
  backgroundColor: '#f0fdf4',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #bbf7d0',
  margin: '20px 0',
};

const summaryItem = {
  ...text,
  margin: '8px 0',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#004D40',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'inline-block' as const,
};
