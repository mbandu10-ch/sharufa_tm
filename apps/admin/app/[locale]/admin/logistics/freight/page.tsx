import React from 'react'
import { prisma } from '@sharufa/db'
import FreightRuleManager from './FreightRuleManager'
import { Badge } from '@sharufa/ui/components/badge'
import { Truck } from 'lucide-react'

export const metadata = {
  title: 'Tarification Fret - Admin Sharufa',
}

export default async function AdminFreightPage() {

  const rules = await prisma.freightRule.findMany({
    orderBy: { createdAt: 'desc' }
  })

  const countries = await prisma.country.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Badge className="mb-4 bg-secondary text-primary hover:bg-secondary/90 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-none flex w-fit items-center gap-2">
            <Truck size={14} /> Fret Logistique
          </Badge>
          <h1 className="text-4xl font-black text-primary tracking-tighter uppercase italic">Tarification du Fret</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl font-medium leading-relaxed">
            Gérez les algorithmes de calcul du fret (aérien et maritime). 
            Définissez les diviseurs volumétriques et les tarifs au kilo/CBM qui s'appliqueront automatiquement dans le tunnel de commande (Checkout) de vos clients.
          </p>
        </div>
      </div>

      <FreightRuleManager rules={rules} countries={countries} />
    </div>
  )
}
