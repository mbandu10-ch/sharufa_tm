import React from 'react'
import { prisma } from '@sharufa/db'
import { notFound } from 'next/navigation'
import { AdminSourcingDetail } from '@/components/admin/sourcing/AdminSourcingDetail'
import { ArrowLeft, Globe } from 'lucide-react'
import Link from 'next/link'

export default async function AdminSourcingDetailPage({ params }: { params: Promise<{ requestId: string }> }) {
  const { requestId } = await params
  
  const request = await prisma.sourcingRequest.findUnique({
    where: { id: requestId },
    include: {
      client: true,
      quotes: {
        orderBy: {
          createdAt: 'desc'
        }
      },
      events: {
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  })

  if (!request) {
    notFound()
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/sourcing" 
            className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
             <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1 italic">Retour au pilotage sourcing</div>
             <h1 className="text-xl font-black text-primary uppercase tracking-tight italic flex items-center gap-2">
                <Globe size={18} className="text-secondary" /> Dossier : {request.title || 'Buy For Me'}
             </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="px-6 py-3 rounded-full bg-slate-100 text-[10px] font-black uppercase tracking-widest text-primary italic border-2 border-white shadow-sm">
              Type: {request.type === 'B2B' ? 'GROSSISTE B2B' : 'ACCESSOIRES B2C'}
           </div>
        </div>
      </div>

      <AdminSourcingDetail 
        request={request} 
        events={request.events} 
        quotes={request.quotes} 
      />
    </div>
  )
}
