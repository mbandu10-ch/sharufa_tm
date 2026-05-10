import {
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface BankInfoApprovedEmailProps {
  sellerName: string;
  shopName: string;
  dashboardLink: string;
}

export const BankInfoApprovedEmail = ({
  sellerName,
  shopName,
  dashboardLink,
}: BankInfoApprovedEmailProps) => {
  return (
    <EmailLayout previewText={`Bonne nouvelle : Vos coordonnées bancaires pour ${shopName} sont validées`}>
      <Text style={h1}>Vos coordonnées bancaires ont été validées</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      <Text style={text}>
        Nous confirmons que les coordonnées bancaires de votre boutique <strong>{shopName}</strong> ont été vérifiées avec succès par notre équipe financière.
      </Text>
      
      <Section style={successCard}>
        <Text style={summaryItem}>✔️ Dossier bancaire conforme</Text>
        <Text style={summaryItem}>✔️ Prêt pour les futurs règlements</Text>
      </Section>

      <Text style={text}>
        Tout est en ordre pour vos futurs virements sur Sharufa.
      </Text>

      <Section style={btnContainer}>
        <Button style={button} href={dashboardLink}>
          Accéder à mon espace vendeur
        </Button>
      </Section>

      <Text style={text}>
        Merci pour votre réactivité,
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

const successCard = {
  backgroundColor: '#f0fdf4',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #bbf7d0',
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
