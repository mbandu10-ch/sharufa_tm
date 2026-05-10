import {
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface SourcingQuoteAcceptedEmailProps {
  firstName: string;
  requestTitle: string;
  orderNumber: string;
  totalPrice: number;
}

export const SourcingQuoteAcceptedEmail = ({
  firstName,
  requestTitle,
  orderNumber,
  totalPrice,
}: SourcingQuoteAcceptedEmailProps) => {
  return (
    <EmailLayout previewText={`Bonne nouvelle ! Votre devis de sourcing a été accepté.`}>
      <Text style={h1}>Devis de Sourcing Accepté</Text>
      <Text style={text}>Bonjour {firstName},</Text>
      <Text style={text}>
        Nous avons le plaisir de vous confirmer que votre devis pour la demande de sourcing <strong>"{requestTitle}"</strong> a été accepté avec succès.
      </Text>
      <Section style={orderInfo}>
        <Text style={orderText}>Numéro de commande : <strong>{orderNumber}</strong></Text>
        <Text style={orderText}>Montant total : <strong>{totalPrice.toLocaleString()} CFA</strong></Text>
      </Section>
      <Text style={text}>
        Une commande a été générée automatiquement. Notre équipe logistique va maintenant procéder au traitement de votre demande.
      </Text>
      <Text style={text}>
        Vous pouvez suivre l'avancement de votre commande dans votre espace personnel.
      </Text>
      <Section style={btnContainer}>
        <Button style={button} href={`https://sharufa.com/dashboard/orders`}>
          Voir ma commande
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

const orderInfo = {
  backgroundColor: '#f9f9f9',
  padding: '20px',
  borderRadius: '12px',
  margin: '24px 0',
};

const orderText = {
  ...text,
  margin: '4px 0',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#D4AF37', // Sharufa Gold
  borderRadius: '8px',
  color: '#004D40', // Black/Green contrast
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 24px',
};
