'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/lib/i18n-navigation'
import { Globe, Mail, Phone, MapPin, Share2, Shield, Info, Users } from 'lucide-react'
import { Logo } from "@/components/ui/Logo";
import { toast } from "sonner";

export default function Footer() {
  const t = useTranslations('Footer');
  const locale = useLocale();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t('share_title'),
        text: t('share_text'),
        url: window.location.origin,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.origin);
      toast.success(t('link_copied'));
    }
  };

  const handleGlobe = () => {
    toast.info(t('globe_info'));
  };

  return (
    <footer className="bg-primary text-primary-foreground pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="transition-all hover:scale-105 inline-block">
              <Logo variant="dark" />
            </Link>
            <p className="text-primary-foreground/70 leading-relaxed text-sm">
              {t('description')}
            </p>
            <div className="flex gap-4">
              <button 
                onClick={handleShare}
                className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all cursor-pointer"
                title="Share Sharufa"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={handleGlobe}
                className="w-10 h-10 rounded-full border border-primary-foreground/20 flex items-center justify-center hover:bg-secondary hover:text-primary transition-all cursor-pointer"
                title="Region Selector"
              >
                <Globe className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">{t('platform')}</h4>
            <ul className="space-y-4">
              <li><Link href="/about" className="text-primary-foreground/70 hover:text-secondary transition-colors transition-all hover:translate-x-1 inline-flex items-center gap-2"><Users className="w-4 h-4" /> {t('about')}</Link></li>
              <li><Link href="/seller" className="text-primary-foreground/70 hover:text-secondary transition-colors transition-all hover:translate-x-1 inline-block font-bold text-secondary">{t('become_seller')}</Link></li>
              <li><Link href="/marketplace" className="text-primary-foreground/70 hover:text-secondary transition-colors transition-all hover:translate-x-1 inline-block">{t('buy_marketplace')}</Link></li>
              <li><Link href="/buy-for-me" className="text-primary-foreground/70 hover:text-secondary transition-colors transition-all hover:translate-x-1 inline-block">Buy For Me</Link></li>
              <li><Link href="/logistics" className="text-primary-foreground/70 hover:text-secondary transition-colors transition-all hover:translate-x-1 inline-block">{t('solutions')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">{t('support')}</h4>
            <ul className="space-y-4">
              <li><Link href="/faq" className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-2"><Info className="w-4 h-4" /> {t('faq')}</Link></li>
              <li><Link href="/contact" className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-2"><Mail className="w-4 h-4" /> {t('contact')}</Link></li>
              <li><Link href="/shipping-policy" className="text-primary-foreground/70 hover:text-secondary transition-colors inline-flex items-center gap-2"><Shield className="w-4 h-4" /> {t('shipping')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-white uppercase tracking-wider">{t('contact')}</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex gap-3 text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <span>Dubaï, UAE / Istanbul, Turquie / Guangzhou, Chine</span>
              </li>
              <li className="flex gap-3 text-primary-foreground/70">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <div className="flex flex-col gap-1">
                  <span>Dubaï: +971 50 516 8219</span>
                  <span>Turquie: +90 544 357 6295</span>
                </div>
              </li>
              <li className="flex gap-3 text-primary-foreground/70">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <span>contact@sharufa.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-foreground/50">
          <p>© {new Date().getFullYear()} Sharufa.com - {t('rights')}</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">{t('privacy')}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t('cookies')}</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
