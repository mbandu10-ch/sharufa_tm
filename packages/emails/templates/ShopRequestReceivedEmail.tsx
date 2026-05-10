import {
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface ShopRequestReceivedEmailProps {
  sellerName: string;
  shopName: string;
  shopCountry: string;
}

export const ShopRequestReceivedEmail = ({
  sellerName,
  shopName,
  shopCountry,
}: ShopRequestReceivedEmailProps) => {
  return (
    <EmailLayout previewText={`Confirmation de votre demande d'ouverture de boutique ${shopName}`}>
      <Text style={h1}>Demande d'ouverture de boutique reçue</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      <Text style={text}>
        Nous confirmons la réception de votre demande d'ouverture de boutique sur Sharufa.
      </Text>
      <Text style={text}>
        Votre dossier est actuellement en cours de vérification par nos équipes.
      </Text>
      
      <Section style={statusCard}>
        <Text style={summaryItem}><strong>Nom de la boutique :</strong> {shopName}</Text>
        <Text style={summaryItem}><strong>Pays :</strong> {shopCountry}</Text>
        <Text style={summaryItem}><strong>Statut :</strong> <span style={badge}>En attente de validation</span></Text>
      </Section>

      <Text style={text}>
        Nous vous informerons dès qu'une décision sera prise.
      </Text>
      
      <Text style={text}>
        Merci pour votre confiance,
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

const statusCard = {
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

const badge = {
  backgroundColor: '#fef3c7',
  color: '#92400e',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '14px',
  fontWeight: 'bold',
};
