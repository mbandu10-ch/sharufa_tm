import {
  Button,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface BuyForMeReceivedEmailProps {
  firstName: string;
  requestNumber: string;
  sourceCountry: string;
  requestSummary: string;
  requestLink: string;
}

export const BuyForMeReceivedEmail = ({
  firstName,
  requestNumber,
  sourceCountry,
  requestSummary,
  requestLink,
}: BuyForMeReceivedEmailProps) => {
  return (
    <EmailLayout previewText={`Confirmation de votre demande Buy For Me ${requestNumber}`}>
      <Text style={h1}>Demande Buy For Me reçue</Text>
      <Text style={text}>Bonjour {firstName},</Text>
      <Text style={text}>
        Votre demande Buy For Me a bien été reçue par notre équipe.
      </Text>
      
      <Section style={requestCard}>
        <Text style={summaryItem}><strong>Référence :</strong> {requestNumber}</Text>
        <Text style={summaryItem}><strong>Source souhaitée :</strong> {sourceCountry}</Text>
        <Text style={summaryItem}><strong>Détail de la demande :</strong> {requestSummary}</Text>
      </Section>

      <Text style={text}>
        Nos équipes vont analyser votre demande et revenir vers vous avec une proposition dès que possible.
      </Text>

      <Section style={btnContainer}>
        <Button style={button} href={requestLink}>
          Suivre ma demande
        </Button>
      </Section>
      
      <Text style={text}>
        Merci,
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

const requestCard = {
  backgroundColor: '#f3f4f6',
  padding: '24px',
  borderRadius: '12px',
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
