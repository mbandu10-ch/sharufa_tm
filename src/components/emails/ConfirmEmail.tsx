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

interface ConfirmEmailProps {
  firstName: string;
  confirmLink: string;
}

export const ConfirmEmail = ({
  firstName,
  confirmLink,
}: ConfirmEmailProps) => {
  return (
    <EmailLayout previewText={`Confirmez votre compte Sharufa, ${firstName}`}>
      <Text style={h1}>Confirmez votre inscription</Text>
      <Text style={text}>Bonjour {firstName},</Text>
      <Text style={text}>
        Merci d'avoir rejoint Sharufa, la plateforme premium de commerce international. 
        Pour activer votre compte et accéder à toutes nos fonctionnalités, merci de confirmer votre adresse e-mail en cliquant sur le bouton ci-dessous :
      </Text>
      <Section style={btnContainer}>
        <Button style={button} href={confirmLink}>
          Confirmer mon compte
        </Button>
      </Section>
      <Text style={text}>
        Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail en toute sécurité.
      </Text>
      <Hr style={hr} />
      <Text style={footer}>
        Ce lien de confirmation expirera dans 24 heures.
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
  backgroundColor: '#D4AF37', // Sharufa Gold
  borderRadius: '8px',
  color: '#004D40',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '16px 32px',
  display: 'inline-block',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
};
