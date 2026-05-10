import {
  Button,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface PaymentReceivedEmailProps {
  firstName: string;
  orderNumber: string;
  amountPaid: string;
  paymentDate: string;
  orderLink: string;
}

export const PaymentReceivedEmail = ({
  firstName,
  orderNumber,
  amountPaid,
  paymentDate,
  orderLink,
}: PaymentReceivedEmailProps) => {
  return (
    <EmailLayout previewText={`Paiement reçu pour votre commande ${orderNumber}`}>
      <Text style={h1}>Paiement reçu</Text>
      <Text style={text}>Bonjour {firstName},</Text>
      <Text style={text}>
        Nous vous confirmons la bonne réception de votre paiement pour la commande <strong>{orderNumber}</strong>.
      </Text>
      
      <Section style={paymentDetails}>
        <Text style={summaryItem}><strong>Montant reçu :</strong> {amountPaid}</Text>
        <Text style={summaryItem}><strong>Date :</strong> {paymentDate}</Text>
      </Section>

      <Text style={text}>
        Votre commande est maintenant en cours de traitement.
      </Text>

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

const paymentDetails = {
  backgroundColor: '#f9fafb',
  padding: '20px',
  borderRadius: '8px',
  margin: '20px 0',
};

const summaryItem = {
  ...text,
  margin: '8px 0',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
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
