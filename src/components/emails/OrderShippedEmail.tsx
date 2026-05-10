import {
  Button,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface OrderShippedEmailProps {
  firstName: string;
  orderNumber: string;
  shippingMethod: string;
  originCountry: string;
  trackingNumber: string;
  estimatedDelivery: string;
  trackingLink: string;
}

export const OrderShippedEmail = ({
  firstName,
  orderNumber,
  shippingMethod,
  originCountry,
  trackingNumber,
  estimatedDelivery,
  trackingLink,
}: OrderShippedEmailProps) => {
  return (
    <EmailLayout previewText={`Votre commande ${orderNumber} est en route !`}>
      <Text style={h1}>Commande expédiée</Text>
      <Text style={text}>Bonjour {firstName},</Text>
      <Text style={text}>
        Bonne nouvelle : votre commande <strong>{orderNumber}</strong> a été expédiée.
      </Text>
      
      <Section style={shippingCard}>
        <Text style={summaryTitle}>Informations utiles :</Text>
        <Text style={summaryItem}><strong>Mode d&apos;expédition :</strong> {shippingMethod}</Text>
        <Text style={summaryItem}><strong>Provenance :</strong> {originCountry}</Text>
        <Text style={summaryItem}><strong>Numéro de suivi :</strong> {trackingNumber}</Text>
        <Text style={summaryItem}><strong>Livraison estimée :</strong> {estimatedDelivery}</Text>
      </Section>

      <Section style={btnContainer}>
        <Button style={button} href={trackingLink}>
          Suivre l&apos;expédition
        </Button>
      </Section>
      
      <Text style={text}>
        Merci de votre confiance,
        <br />
        L&apos;équipe Sharufa
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

const shippingCard = {
  backgroundColor: '#f8fafc',
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid #e2e8f0',
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
