import {
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface LicenseExpiringEmailProps {
  sellerName: string;
  shopName: string;
  expiryDate: string;
  verificationLink: string;
}

export const LicenseExpiringEmail = ({
  sellerName,
  shopName,
  expiryDate,
  verificationLink,
}: LicenseExpiringEmailProps) => {
  return (
    <EmailLayout previewText={`Action requise : La licence de votre boutique ${shopName} expire bientôt`}>
      <Text style={h1}>Votre licence arrive bientôt à expiration</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      <Text style={text}>
        Nous vous informons que la licence de commerce liée à votre boutique <strong>{shopName}</strong> arrivera à expiration prochainement.
      </Text>
      
      <Section style={warningCard}>
        <Text style={summaryItem}><strong>Date d’expiration :</strong> {expiryDate}</Text>
        <Text style={summaryItem}><strong>Statut :</strong> Expire dans 30 jours</Text>
      </Section>

      <Text style={text}>
        Pour éviter toute interruption ou limitation de votre statut boutique, merci de prévoir le renouvellement et de nous transmettre la nouvelle version dès que possible.
      </Text>

      <Section style={btnContainer}>
        <Button style={button} href={verificationLink}>
          Mettre à jour ma licence
        </Button>
      </Section>

      <Text style={text}>
        Cordialement,
        <br />
        L’équipe Sharufa
      </Text>
    </EmailLayout>
  );
};

const h1 = {
  color: '#ED6C02', // Warning Orange
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

const warningCard = {
  backgroundColor: '#fff7ed',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #ffedd5',
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
