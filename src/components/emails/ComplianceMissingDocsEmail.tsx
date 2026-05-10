import {
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface ComplianceMissingDocsEmailProps {
  sellerName: string;
  missingDocumentsList: string;
  verificationLink: string;
}

export const ComplianceMissingDocsEmail = ({
  sellerName,
  missingDocumentsList,
  verificationLink,
}: ComplianceMissingDocsEmailProps) => {
  return (
    <EmailLayout previewText="Documents nécessaires pour finaliser la validation de votre boutique">
      <Text style={h1}>Action requise : Documents manquants</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      <Text style={text}>
        Merci pour votre demande d’ouverture de boutique sur Sharufa.
      </Text>
      <Text style={text}>
        Afin de poursuivre la vérification de votre dossier, nous avons besoin des éléments suivants :
      </Text>
      
      <Section style={listContainer}>
        <Text style={listText}>{missingDocumentsList}</Text>
      </Section>

      <Text style={text}>
        Vous pouvez transmettre ces documents directement depuis votre espace vendeur :
      </Text>

      <Section style={btnContainer}>
        <Button style={button} href={verificationLink}>
          Mettre à jour mon dossier
        </Button>
      </Section>

      <Text style={text}>
        Dès réception, notre équipe procédera à l’examen de votre dossier.
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

const listContainer = {
  backgroundColor: '#f8fafc',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
  margin: '20px 0',
};

const listText = {
  ...text,
  margin: '0',
  whiteSpace: 'pre-line' as const,
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
