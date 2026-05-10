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

interface ResetPasswordEmailProps {
  firstName: string;
  resetLink: string;
}

export const ResetPasswordEmail = ({
  firstName,
  resetLink,
}: ResetPasswordEmailProps) => {
  return (
    <EmailLayout previewText={`Réinitialisez votre mot de passe Sharufa, ${firstName}`}>
      <Text style={h1}>Demande de réinitialisation</Text>
      <Text style={text}>Bonjour {firstName},</Text>
      <Text style={text}>
        Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte Sharufa. 
        Si vous êtes à l'origine de cette demande, vous pouvez définir un nouveau mot de passe en cliquant sur le bouton ci-dessous :
      </Text>
      <Section style={btnContainer}>
        <Button style={button} href={resetLink}>
          Réinitialiser mon mot de passe
        </Button>
      </Section>
      <Text style={text}>
        Ce lien est valable pendant 24 heures. Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet e-mail en toute sécurité. Votre mot de passe actuel restera inchangé.
      </Text>
      <Hr style={hr} />
      <Text style={footer}>
        Pour votre sécurité, ne partagez jamais ce lien avec qui que ce soit.
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
