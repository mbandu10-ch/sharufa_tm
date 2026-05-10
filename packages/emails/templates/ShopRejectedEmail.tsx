import {
  Button,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface ShopRejectedEmailProps {
  sellerName: string;
  rejectionReason: string;
  supportLink: string;
}

export const ShopRejectedEmail = ({
  sellerName,
  rejectionReason,
  supportLink,
}: ShopRejectedEmailProps) => {
  return (
    <EmailLayout previewText={`Mise à jour concernant votre demande de boutique`}>
      <Text style={h1}>Mise à jour de votre demande</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      <Text style={text}>
        Nous avons étudié votre demande d'ouverture de boutique sur Sharufa. À ce stade, votre boutique n'a pas pu être approuvée.
      </Text>
      
      <Section style={reasonCard}>
        <Text style={summaryTitle}>Motif principal :</Text>
        <Text style={text}>{rejectionReason}</Text>
      </Section>
      
      <Text style={text}>
        Si vous souhaitez obtenir plus d'informations ou soumettre une version corrigée de votre dossier, merci de nous contacter ici :
      </Text>

      <Section style={btnContainer}>
        <Button style={button} href={supportLink}>
          Contacter le support
        </Button>
      </Section>
      
      <Text style={text}>
        Cordialement,
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

const reasonCard = {
  backgroundColor: '#fff1f2',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #fecaca',
  margin: '20px 0',
};

const summaryTitle = {
  fontWeight: 'bold',
  fontSize: '18px',
  color: '#991b1b',
  marginBottom: '12px',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#004D40',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '16px 24px',
};
