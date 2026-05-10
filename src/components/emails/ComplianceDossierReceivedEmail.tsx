import {
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface ComplianceDossierReceivedEmailProps {
  sellerName: string;
  shopName: string;
  verificationLink: string;
}

export const ComplianceDossierReceivedEmail = ({
  sellerName,
  shopName,
  verificationLink,
}: ComplianceDossierReceivedEmailProps) => {
  return (
    <EmailLayout previewText={`Confirmation de réception de votre dossier boutique ${shopName}`}>
      <Text style={h1}>Votre dossier boutique a bien été reçu</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      <Text style={text}>
        Nous confirmons la bonne réception des documents relatifs à votre boutique <strong>{shopName}</strong>.
      </Text>
      <Text style={text}>
        Votre dossier est actuellement en cours de vérification par notre équipe.
      </Text>
      
      <Section style={statusCard}>
        <Text style={summaryItem}><strong>Statut actuel :</strong> <span style={badge}>En attente de validation</span></Text>
      </Section>

      <Text style={text}>
        Vous pouvez suivre l’évolution de votre dossier ici :
      </Text>

      <Section style={btnContainer}>
        <Button style={button} href={verificationLink}>
          Suivre mon dossier
        </Button>
      </Section>

      <Text style={text}>
        Merci,
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

const statusCard = {
  backgroundColor: '#f0fdf4',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #bbf7d0',
  margin: '20px 0',
};

const summaryItem = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
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
  textAlign: 'center' as const,
  display: 'inline-block' as const,
  padding: '12px 24px',
};
