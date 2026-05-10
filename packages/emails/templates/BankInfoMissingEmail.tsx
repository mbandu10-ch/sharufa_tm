import {
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface BankInfoMissingEmailProps {
  sellerName: string;
  shopName: string;
  bankingLink: string;
}

export const BankInfoMissingEmail = ({
  sellerName,
  shopName,
  bankingLink,
}: BankInfoMissingEmailProps) => {
  return (
    <EmailLayout previewText={`Action requise : Coordonnées bancaires manquantes pour votre boutique ${shopName}`}>
      <Text style={h1}>Coordonnées bancaires requises</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      <Text style={text}>
        Afin de finaliser le dossier de votre boutique <strong>{shopName}</strong> et préparer vos futurs versements, nous avons besoin de vos coordonnées bancaires complètes.
      </Text>
      
      <Section style={infoCard}>
        <Text style={summaryItem}>🕒 Merci de renseigner ou compléter :</Text>
        <Text style={summaryItem}>• Nom du bénéficiaire</Text>
        <Text style={summaryItem}>• Nom de la banque</Text>
        <Text style={summaryItem}>• IBAN et SWIFT/BIC</Text>
        <Text style={summaryItem}>• Document justificatif (RIB)</Text>
      </Section>

      <Section style={btnContainer}>
        <Button style={button} href={bankingLink}>
          Mettre à jour mes infos bancaires
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

const infoCard = {
  backgroundColor: '#f8fafc',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
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
