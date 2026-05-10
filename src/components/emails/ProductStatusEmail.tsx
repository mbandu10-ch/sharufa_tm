import {
  Button,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './EmailLayout';

interface ProductStatusEmailProps {
  sellerName: string;
  productName: string;
  productLink?: string;
  status: 'PUBLISHED' | 'REVISION';
  issuesList?: string;
}

export const ProductStatusEmail = ({
  sellerName,
  productName,
  productLink,
  status,
  issuesList,
}: ProductStatusEmailProps) => {
  const isPublished = status === 'PUBLISHED';
  
  return (
    <EmailLayout previewText={isPublished ? `Votre produit ${productName} est en ligne !` : `Action requise sur votre produit ${productName}`}>
      <Text style={h1}>{isPublished ? 'Produit validé et publié' : 'Action requise sur votre produit'}</Text>
      <Text style={text}>Bonjour {sellerName},</Text>
      
      {isPublished ? (
        <>
          <Text style={text}>
            Votre produit <strong>{productName}</strong> a été validé et est désormais visible sur Sharufa.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={productLink}>
              Voir le produit
            </Button>
          </Section>
        </>
      ) : (
        <>
          <Text style={text}>
            Votre produit <strong>{productName}</strong> nécessite quelques ajustements avant publication.
          </Text>
          <Section style={issueCard}>
            <Text style={summaryTitle}>Points à corriger :</Text>
            <Text style={text}>{issuesList}</Text>
          </Section>
          <Section style={btnContainer}>
            <Button style={button} href={productLink}>
              Modifier mon produit
            </Button>
          </Section>
        </>
      )}
      
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
  fontSize: '14px',
  lineHeight: '24px',
};

const issueCard = {
  backgroundColor: '#fffbeb',
  padding: '24px',
  borderRadius: '12px',
  border: '1px solid #fef3c7',
  margin: '20px 0',
};

const summaryTitle = {
  fontWeight: 'bold',
  fontSize: '16px',
  color: '#92400e',
  marginBottom: '8px',
};

const btnContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#D4AF37',
  borderRadius: '8px',
  color: '#004D40',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 20px',
};
