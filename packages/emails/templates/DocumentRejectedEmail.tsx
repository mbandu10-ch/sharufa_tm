import {
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface DocumentRejectedEmailProps {
  sellerName: string;
  shopName: string;
  documentType: string;
  rejectionReason: string;
  verificationLink: string;
}

export const DocumentRejectedEmail = ({
  sellerName,
  shopName,
  documentType,
  rejectionReason,
  verificationLink,
}: DocumentRejectedEmailProps) => {
  return (
    <EmailLayout previewText={`Action requise : Document de votre boutique ${shopName} à corriger`}>
      <Text style={h1}>Un document doit être corrigé</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      <Text style={text}>
        Lors de l’examen de votre dossier pour la boutique <strong>{shopName}</strong>, nous avons constaté qu’un document nécessite une correction.
      </Text>
      
      <Section style={errorCard}>
        <Text style={summaryItem}><strong>Document concerné :</strong> {documentType}</Text>
        <Text style={summaryItem}><strong>Motif :</strong> {rejectionReason}</Text>
      </Section>

      <Text style={text}>
        Merci de transmettre une version corrigée depuis votre espace vendeur :
      </Text>

      <Section style={btnContainer}>
        <Button style={button} href={verificationLink}>
          Mettre à jour le document
        </Button>
      </Section>

      <Text style={text}>
        Notre équipe poursuivra la validation dès réception du document mis à jour.
      </Text>
      
      <Text style={text}>
        Cordialement,
        <br />
        L’équipe Sharufa
      </Text>
    </EmailLayout>
  );
};

const h1 = {
  color: '#D32F2F', // Error Red
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

const errorCard = {
  backgroundColor: '#fef2f2',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #fecaca',
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
