import {
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface LicenseExpiredEmailProps {
  sellerName: string;
  shopName: string;
  expiryDate: string;
  verificationLink: string;
}

export const LicenseExpiredEmail = ({
  sellerName,
  shopName,
  expiryDate,
  verificationLink,
}: LicenseExpiredEmailProps) => {
  return (
    <EmailLayout previewText={`Urgent : La licence de votre boutique ${shopName} est expirée`}>
      <Text style={h1}>Votre licence de commerce est expirée</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      <Text style={text}>
        Nous vous informons que la licence de commerce liée à votre boutique <strong>{shopName}</strong> est maintenant expirée.
      </Text>
      
      <Section style={errorCard}>
        <Text style={summaryItem}><strong>Date d’expiration :</strong> {expiryDate}</Text>
        <Text style={summaryItem}><strong>Statut :</strong> Expirée</Text>
      </Section>

      <Text style={text}>
        Veuillez transmettre votre document renouvelé dès que possible depuis votre espace vendeur pour régulariser votre situation.
      </Text>

      <Section style={btnContainer}>
        <Button style={button} href={verificationLink}>
          Mettre à jour ma licence
        </Button>
      </Section>

      <Text style={text}>
        Tant que la situation n’est pas régularisée, certaines restrictions peuvent être appliquées à votre boutique.
      </Text>
      
      <Text style={text}>
        Cordialement,
        <br />
        L’équipe Sharufa
      </Text>
    </EmailLayout>
  );
};

const h1 = {
  color: '#D32F2F', // Error Red
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

const errorCard = {
  backgroundColor: '#fef2f2',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #fecaca',
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
