import {
  Button,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface OrderDeliveredEmailProps {
  firstName: string;
  orderNumber: string;
  dashboardLink: string;
}

export const OrderDeliveredEmail = ({
  firstName,
  orderNumber,
  dashboardLink,
}: OrderDeliveredEmailProps) => {
  return (
    <EmailLayout previewText={`Votre commande ${orderNumber} a été livrée !`}>
      <Text style={h1}>Commande livrée</Text>
      <Text style={text}>Bonjour {firstName},</Text>
      <Text style={text}>
        Votre commande <strong>{orderNumber}</strong> a été marquée comme livrée.
      </Text>
      <Text style={text}>
        Nous espérons que votre expérience avec Sharufa a été à la hauteur de vos attentes.
      </Text>
      
      <Section style={btnContainer}>
        <Button style={button} href={dashboardLink}>
          Consulter mon historique
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
