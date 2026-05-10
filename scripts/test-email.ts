import { sendEmail } from '../src/lib/resend';
import { NewSellerApplicationAlert } from '../src/components/emails/NewSellerApplicationAlert';
import * as React from 'react';

async function testAdminAlert() {
  console.log('--- Testing Internal Admin Alert (Sellers) ---');
  
  if (!process.env.RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY is missing in .env');
    return;
  }

  const { success, data, error } = await sendEmail({
    to: 'bcb@sharufa.com', 
    from: 'Sharufa Système <b2b@sharufa.com>',
    subject: '🧪 TEST : Nouvelle demande de boutique',
    react: React.createElement(NewSellerApplicationAlert, {
      sellerName: 'Jean Testeur',
      shopName: 'Boutique Alpha Test',
      shopCountry: 'Turquie',
      adminShopLink: 'https://sharufa.com/admin/shops/test-123',
    }),
  });

  if (success) {
    console.log('✅ Alert email sent successfully to bcb@sharufa.com');
    console.log('Data:', data);
  } else {
    console.error('❌ Failed to send alert email:', error);
  }
}

testAdminAlert();
