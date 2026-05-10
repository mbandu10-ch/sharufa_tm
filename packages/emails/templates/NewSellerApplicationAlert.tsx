import {
  Button,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface NewSellerApplicationAlertProps {
  sellerName: string;
  shopName: string;
  shopCountry: string;
  adminShopLink: string;
}

export const NewSellerApplicationAlert = ({
  sellerName,
  shopName,
  shopCountry,
  adminShopLink,
}: NewSellerApplicationAlertProps) => {
  return (
    <EmailLayout previewText={`Nouvelle demande de boutique : ${shopName}`}>
      <Text style={h1}>Nouvelle demande d'ouverture de boutique</Text>
      <Text style={text}>Bonjour,</Text>
      <Text style={text}>
        Une nouvelle demande vendeur vient d'être soumise sur la plateforme.
      </Text>
      
      <Section style={adminCard}>
        <Text style={summaryItem}><strong>Boutique :</strong> {shopName}</Text>
        <Text style={summaryItem}><strong>Demandeur :</strong> {sellerName}</Text>
        <Text style={summaryItem}><strong>Pays :</strong> {shopCountry}</Text>
      </Section>

      <Section style={btnContainer}>
        <Button style={button} href={adminShopLink}>
          Accéder au dossier (Admin)
        </Button>
      </Section>
      
      <Text style={text}>
        Cordialement,
        <br />
        Système Sharufa
      </Text>
    </EmailLayout>
  );
};

const h1 = {
  color: '#004D40',
  fontSize: '20px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '20px 0',
};

const text = {
  color: '#333',
  fontSize: '14px',
  lineHeight: '22px',
};

const adminCard = {
  backgroundColor: '#f8fafc',
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #e2e8f0',
  margin: '20px 0',
};

const summaryItem = {
  ...text,
  margin: '6px 0',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const button = {
  backgroundColor: '#004D40',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
};
