import { Metadata } from 'next'
import { HeroSection } from '@/components/home/existing/HeroSection'
import { TrustBar } from '@/components/home/existing/TrustBar'
import { FeaturesSection } from '@/components/home/existing/FeaturesSection'
import { HowItWorksSection } from '@/components/home/existing/HowItWorksSection'
import { SourcingSection } from '@/components/home/existing/SourcingSection'
import { TeamSection } from '@/components/home/existing/TeamSection'
import { MobileExperienceSection } from '@/components/home/existing/MobileExperienceSection'
import { SellerCTASection } from '@/components/home/existing/SellerCTASection'
import { NewsletterSection } from '@/components/home/existing/NewsletterSection'

// New Components
import { QuickAccess } from '@/components/home/QuickAccess'
import { StatsBar } from '@/components/home/StatsBar'
import { FeaturedProductsSection } from '@/components/home/FeaturedProductsSection'
import { BuyByCountrySection } from '@/components/home/BuyByCountrySection'
import { FeaturedShopsSection } from '@/components/home/FeaturedShopsSection'

// Data
import { getFeaturedProducts, getFeaturedShops, getPlatformStats } from '@/lib/data'

import { getTranslations } from 'next-intl/server'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // Fetch data on the server
  const [products, shops, stats] = await Promise.all([
    getFeaturedProducts(locale, 8),
    getFeaturedShops(locale, 6),
    getPlatformStats()
  ])

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section (Validé, pas touche) */}
      <HeroSection />

      {/* 2. Quick Access (Homepage only) */}
      <QuickAccess />

      {/* 3. Trust Bar (Expertise Globale) */}
      <TrustBar />

      {/* 4. Stats Bar (Crédibilité Marketplace) */}
      <StatsBar stats={stats} />

      {/* 5. Featured Products (Connexion Marketplace) */}
      <FeaturedProductsSection products={products} />

      {/* 6. Buy by Country (Différenciateur fort) */}
      <BuyByCountrySection />

      {/* 7. Featured Shops (Vendeurs réels) */}
      <FeaturedShopsSection shops={shops as any} />

      {/* 8. How it Works (Pédagogie) */}
      <HowItWorksSection />
      
      {/* 9. Features Grid (Solution complète) */}
      <FeaturesSection />

      {/* 10. Sourcing Section (Service Buy For Me) */}
      <SourcingSection />

      {/* 11. Team Section (Expertise Internationale) */}
      <TeamSection />

      {/* 12. Mobile Experience (Suivi de commande) */}
      <MobileExperienceSection />

      {/* 13. Seller Call to Action */}
      <SellerCTASection />

      {/* 14. Newsletter / Final Section */}
      <NewsletterSection />
    </div>
  )
}
