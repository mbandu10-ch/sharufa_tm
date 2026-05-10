import {
  Button,
  Hr,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface OrderConfirmedEmailProps {
  firstName: string;
  orderNumber: string;
  orderItems: string;
  orderTotal: string;
  shippingMethod: string;
  originCountry: string;
  orderLink: string;
}

export const OrderConfirmedEmail = ({
  firstName,
  orderNumber,
  orderItems,
  orderTotal,
  shippingMethod,
  originCountry,
  orderLink,
}: OrderConfirmedEmailProps) => {
  return (
    <EmailLayout previewText={`Confirmation de votre commande ${orderNumber}`}>
      <Text style={h1}>Commande confirmée</Text>
      <Text style={text}>Bonjour {firstName},</Text>
      <Text style={text}>
        Nous vous confirmons que votre commande <strong>{orderNumber}</strong> a bien été enregistrée.
      </Text>
      
      <Section style={orderSummary}>
        <Text style={summaryTitle}>Résumé de la commande :</Text>
        <Text style={summaryItem}><strong>Produit(s) :</strong> {orderItems}</Text>
        <Text style={summaryItem}><strong>Montant total :</strong> {orderTotal}</Text>
        <Text style={summaryItem}><strong>Livraison :</strong> {shippingMethod}</Text>
        <Text style={summaryItem}><strong>Pays d'origine :</strong> {originCountry}</Text>
      </Section>

      <Section style={btnContainer}>
        <Button style={button} href={orderLink}>
          Suivre ma commande
        </Button>
      </Section>
      
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

const orderSummary = {
  backgroundColor: '#f9f9f9',
  padding: '24px',
  borderRadius: '12px',
  margin: '20px 0',
};

const summaryTitle = {
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#004D40',
  marginBottom: '12px',
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
