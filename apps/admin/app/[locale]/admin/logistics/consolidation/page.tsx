import React from 'react'
import { prisma } from '@sharufa/db'
import Link from 'next/link'
import { Badge } from '@sharufa/ui/components/badge'
import { Box, Plane, Ship, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Consolidation & Conteneurs - Admin',
}

export default async function ConsolidationAdminPage() {

  const batches = await prisma.shipmentBatch.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { orders: true } } }
  })

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Badge className="mb-4 bg-secondary text-primary hover:bg-secondary/90 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex w-fit items-center gap-2">
            <Box size={14} /> Consolidation
          </Badge>
          <h1 className="text-4xl font-black text-primary tracking-tighter uppercase italic">Lots & Conteneurs</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl font-medium">
            Gérez le groupage des commandes client en lots d'expédition (Batches). Vos actions de tracking ici se répercutent automatiquement sur les espaces clients.
          </p>
        </div>
        {/* Placeholder pour bouton 'Créer un Lot' */}
      </div>

      <div className="grid gap-4">
        {batches.map(batch => (
          <Link key={batch.id} href={`/admin/logistics/consolidation/${batch.id}`}>
            <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-secondary transition-colors group flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white ${batch.transportMode === 'AIR' ? 'bg-sky-500' : 'bg-blue-800'}`}>
                    {batch.transportMode === 'AIR' ? <Plane size={24} /> : <Ship size={24} />}
                 </div>
                 <div>
                    <h3 className="font-black text-primary uppercase">{batch.batchNumber}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase mt-1">
                      {batch.originCountry} → {batch.destinationCountry}
                    </p>
                 </div>
              </div>

              <div className="hidden md:flex gap-10 text-center">
                 <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Poids Total</p>
                    <p className="font-black text-primary">{batch.totalWeight} kg</p>
                 </div>
                 <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Volume</p>
                    <p className="font-black text-primary">{batch.totalVolume} cbm</p>
                 </div>
                 <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">Commandes</p>
                    <p className="font-black text-secondary">{batch._count.orders}</p>
                 </div>
              </div>

              <div className="flex items-center gap-4">
                 <Badge variant="outline" className="font-black uppercase">{batch.status}</Badge>
                 {batch.containerType && (
                   <Badge className="bg-slate-900 text-white font-black">{batch.containerType}</Badge>
                 )}
                 <ArrowRight className="text-muted-foreground group-hover:text-secondary transition-colors" />
              </div>
            </div>
          </Link>
        ))}
        {batches.length === 0 && (
          <div className="p-12 text-center text-muted-foreground bg-white rounded-3xl border">Aucun lot de consolidation créé.</div>
        )}
      </div>
    </div>
  )
}
