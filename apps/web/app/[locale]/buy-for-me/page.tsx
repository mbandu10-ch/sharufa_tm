import React from 'react'
import { getDomainCategories } from './fetch-actions'
import { BuyForMeForm } from './BuyForMeForm'
import { Badge } from '@sharufa/ui/components/badge'
import { Globe } from 'lucide-react'

export default async function BuyForMePage() {
  const { domains } = await getDomainCategories()

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 italic">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-secondary text-secondary font-bold italic">
            SERVICE DE CONCIERGERIE
          </Badge>
          <h1 className="text-4xl md:text-6xl font-outfit font-bold text-primary italic tracking-tighter uppercase">Buy For Me</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed italic">
            Vous avez trouvé un produit en ligne ou vous cherchez un fournisseur ? <br className="hidden md:block" />
            Envoyez-nous votre demande, et notre équipe s&apos;occupe de tout : <span className="text-primary font-bold italic">recherche, négociation, achat et expédition</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2 italic">
            <BuyForMeForm domains={domains || []} />
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-8 italic">
            <div className="p-8 bg-secondary rounded-[32px] text-primary space-y-6 shadow-lg rotate-1 italic">
              <h3 className="text-2xl font-bold font-outfit uppercase tracking-tighter italic">Comment ça marche ?</h3>
              <div className="space-y-6 italic">
                <div className="flex gap-4 italic">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 italic">1</div>
                  <p className="font-medium italic">Décrivez le produit que vous cherchez (ou collez un lien).</p>
                </div>
                <div className="flex gap-4 italic">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 italic">2</div>
                  <p className="font-medium italic">Recevez un devis personnalisé incluant l'achat et le transport.</p>
                </div>
                <div className="flex gap-4 italic">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 italic">3</div>
                  <p className="font-medium italic">Validez, payez et suivez l'acheminement de votre colis.</p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-border rounded-[32px] space-y-4 italic">
               <h4 className="font-bold flex items-center gap-2 text-primary italic">
                  <Globe className="w-5 h-5 text-secondary" /> Garantie Sharufa
               </h4>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                Nous agissons comme tiers de confiance. Votre argent n'est décaissé au fournisseur qu'après vérification de la marchandise par nos équipes locales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
