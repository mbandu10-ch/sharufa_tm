import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Link,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';

interface EmailLayoutProps {
  previewText: string;
  children: React.ReactNode;
}

export const EmailLayout = ({
  previewText,
  children,
}: EmailLayoutProps) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Img
            src="https://sharufa.com/images/logo-sharufa.png"
            width="150"
            height="auto"
            alt="Sharufa Logo"
            style={logo}
          />
        </Section>

        {/* Content */}
        <Section style={content}>
          {children}
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Hr style={hr} />
          <Row>
            <Column align="left">
               <Text style={footerText}>
                © {new Date().getFullYear()} Sharufa.com. Tous droits réservés.
              </Text>
            </Column>
            <Column align="right">
              <Row style={{ width: '100px' }}>
                <Column>
                  <Link href="https://instagram.com/sharufa">
                    <Img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" width="24" height="24" alt="Instagram" />
                  </Link>
                </Column>
                <Column>
                  <Link href="https://facebook.com/sharufa">
                    <Img src="https://cdn-icons-png.flaticon.com/512/174/174848.png" width="24" height="24" alt="Facebook" />
                  </Link>
                </Column>
              </Row>
            </Column>
          </Row>
          <Text style={footerLinks}>
            <Link href="https://sharufa.com/terms" style={footerLink}>Conditions</Link> • 
            <Link href="https://sharufa.com/privacy" style={footerLink}> Confidentialité</Link> • 
            <Link href="https://sharufa.com/contact" style={footerLink}> Contact</Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const header = {
  padding: '32px 48px',
  backgroundColor: '#004D40', // Sharufa Premium Green
  textAlign: 'center' as const,
};

const logo = {
  margin: '0 auto',
};

const content = {
  padding: '40px 48px',
};

const footer = {
  padding: '0 48px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footerText = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};

const footerLinks = {
  color: '#8898aa',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '20px',
};

const footerLink = {
  color: '#004D40',
  textDecoration: 'underline',
};
