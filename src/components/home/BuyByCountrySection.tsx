'use client'

import React from 'react'
import { SectionHeader } from './SectionHeader'
import { CountryCard } from './CountryCard'
import { useTranslations } from 'next-intl'

export function BuyByCountrySection() {
  const t = useTranslations('BuyByCountry')

  const countries = [
    {
      id: 'ae',
      name: t('dubai'),
      code: 'AE',
      image: '/images/marketing/dubai.jpg',
      description: 'Accédez aux grossistes de Dubaï. Haute couture, textile et produits de luxe au meilleur prix.'
    },
    {
      id: 'tr',
      name: t('turkey'),
      code: 'TR',
      image: '/images/marketing/istanbul.jpg',
      description: 'Le meilleur du textile et du cuir turc. Qualité européenne, prix compétitifs.'
    },
    {
      id: 'cn',
      name: t('china'),
      code: 'CN',
      image: '/images/marketing/china.jpg',
      description: 'Sourcing direct depuis les usines de Guangzhou. Électronique, vrac et mobilier.'
    }
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader 
          title={t('title')} 
          subtitle={t('subtitle')}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {countries.map((country) => (
            <CountryCard key={country.id} country={country} />
          ))}
        </div>
      </div>
    </section>
  )
}
