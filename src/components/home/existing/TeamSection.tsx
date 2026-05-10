'use client'

import React from 'react'
import Image from 'next/image'
import { CheckCircle2 } from 'lucide-react'
import { useTranslations } from 'next-intl'

export function TeamSection() {
  const t = useTranslations('Team')

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
          <div className="flex-1 space-y-10">
            <h2 className="text-4xl md:text-6xl font-outfit font-black text-primary leading-tight">
              {t('title')}
              <span className="text-secondary italic">{t('title_highlight')}</span>
              {t('title_end')}
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('description')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: t('reliability'), desc: t('reliability_desc') },
                { title: t('speed'), desc: t('speed_desc') },
                { title: t('transparency'), desc: t('transparency_desc') },
                { title: t('expertise'), desc: t('expertise_desc') }
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-black uppercase tracking-tighter">
                    <CheckCircle2 className="w-5 h-5 text-secondary" />
                    {item.title}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative w-full aspect-square rounded-[60px] overflow-hidden shadow-2xl group">
             <Image 
               src="/images/marketing/team.jpg" 
               alt="Une équipe internationale à votre service" 
               fill 
               className="object-cover group-hover:scale-105 transition-transform duration-700" 
             />
             <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
