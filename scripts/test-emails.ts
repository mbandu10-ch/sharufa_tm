import { sendEmail } from "../src/lib/resend";
import { ComplianceDossierReceivedEmail } from "../src/components/emails/ComplianceDossierReceivedEmail";
import { ComplianceMissingDocsEmail } from "../src/components/emails/ComplianceMissingDocsEmail";
import { ShopVerifiedApprovedEmail } from "../src/components/emails/ShopVerifiedApprovedEmail";
import { DocumentRejectedEmail } from "../src/components/emails/DocumentRejectedEmail";
import { LicenseExpiringEmail } from "../src/components/emails/LicenseExpiringEmail";
import { LicenseExpiredEmail } from "../src/components/emails/LicenseExpiredEmail";
import { BankInfoMissingEmail } from "../src/components/emails/BankInfoMissingEmail";
import { BankInfoApprovedEmail } from "../src/components/emails/BankInfoApprovedEmail";

/**
 * Script de test pour visualiser les nouveaux modèles d'e-mails de conformité.
 * Usage: npx tsx scripts/test-emails.ts <votre-email>
 */

async function main() {
  const targetEmail = process.argv[2];

  if (!targetEmail) {
    console.error("Erreur : Veuillez spécifier un e-mail cible (ex: npx tsx scripts/test-emails.ts test@example.com)");
    process.exit(1);
  }

  console.log(`🚀 Début de l'envoi des e-mails de test vers : ${targetEmail}`);

  const testData = {
    sellerName: "Jean Dupont",
    shopName: "Boutique Test Sharufa",
    verificationLink: "https://sharufa.com/dashboard/compliance",
    dashboardLink: "https://sharufa.com/dashboard",
    bankingLink: "https://sharufa.com/dashboard/compliance",
    missingDocumentsList: "• Copie de la CNI / Passeport\n• Justificatif de domicile de moins de 3 mois",
    documentType: "Licence de commerce",
    rejectionReason: "Le document est illisible ou tronqué.",
    expiryDate: "15 Mai 2026"
  };

  const emails = [
    {
      subject: "Test: Dossier boutique reçu",
      react: ComplianceDossierReceivedEmail({
        sellerName: testData.sellerName,
        shopName: testData.shopName,
        verificationLink: testData.verificationLink
      })
    },
    {
      subject: "Test: Documents manquants",
      react: ComplianceMissingDocsEmail({
        sellerName: testData.sellerName,
        missingDocumentsList: testData.missingDocumentsList,
        verificationLink: testData.verificationLink
      })
    },
    {
      subject: "Test: Boutique vérifiée et approuvée",
      react: ShopVerifiedApprovedEmail({
        sellerName: testData.sellerName,
        shopName: testData.shopName,
        dashboardLink: testData.dashboardLink
      })
    },
    {
      subject: "Test: Document rejeté",
      react: DocumentRejectedEmail({
        sellerName: testData.sellerName,
        shopName: testData.shopName,
        documentType: testData.documentType,
        rejectionReason: testData.rejectionReason,
        verificationLink: testData.verificationLink
      })
    },
    {
      subject: "Test: Licence expirant bientôt",
      react: LicenseExpiringEmail({
        sellerName: testData.sellerName,
        shopName: testData.shopName,
        expiryDate: testData.expiryDate,
        verificationLink: testData.verificationLink
      })
    },
    {
      subject: "Test: Licence expirée",
      react: LicenseExpiredEmail({
        sellerName: testData.sellerName,
        shopName: testData.shopName,
        expiryDate: testData.expiryDate,
        verificationLink: testData.verificationLink
      })
    },
    {
      subject: "Test: RIB manquant",
      react: BankInfoMissingEmail({
        sellerName: testData.sellerName,
        shopName: testData.shopName,
        bankingLink: testData.bankingLink
      })
    },
    {
      subject: "Test: RIB validé",
      react: BankInfoApprovedEmail({
        sellerName: testData.sellerName,
        shopName: testData.shopName,
        dashboardLink: testData.dashboardLink
      })
    }
  ];

  for (const email of emails) {
    console.log(`Sending: ${email.subject}...`);
    const result = await sendEmail({
      to: targetEmail,
      subject: email.subject,
      react: email.react
    });

    if (result.success) {
      console.log(`✅ ${email.subject} envoyé.`);
    } else {
      console.error(`❌ Erreur pour ${email.subject}:`, result.error);
    }
  }

  console.log("🏁 Tous les e-mails de test ont été traités.");
}

main().catch(console.error);
