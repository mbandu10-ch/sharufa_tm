import React from 'react'
import { prisma } from '@sharufa/db'
import { Card, CardContent } from '@sharufa/ui/components/card'
import { 
  Globe2, 
  MapPin, 
  Phone, 
  Users, 
  Building2,
  CheckCircle2,
  XCircle,
  Truck,
  Plane,
  Ship
} from 'lucide-react'
import CargoPartnerForm from '@/components/admin/cargo/CargoPartnerForm'
import CargoUserForm from '@/components/admin/cargo/CargoUserForm'
import CargoCardActions from '@/components/admin/cargo/CargoCardActions'

export const metadata = {
  title: 'Gestion Cargo | Admin Sharufa',
  description: 'Gérez vos hubs logistiques et vos partenaires cargo.'
}

export default async function AdminCargosPage() {
  const cargos = await prisma.cargo.findMany({
    include: {
      profiles: {
        where: { role: 'CARGO' }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const countries = await prisma.country.findMany({
    where: { active: true },
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-12">
      {/* HEADER */}
      <div>
        <div className="flex items-center gap-3 text-secondary mb-2">
          <Truck size={20} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logistique Internationale</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-outfit font-black text-primary uppercase tracking-tighter">Gestion des Partenaires Cargo</h1>
        <p className="text-muted-foreground font-medium mt-2 max-w-xl italic">
          Configurez vos points de dépôt mondiaux et créez les accès pour vos agents logistiques.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        {/* FORMS SECTION */}
        <div className="xl:col-span-1 space-y-8">
          <CargoPartnerForm countries={countries.map(c => ({ name: c.name, code: c.code, flag: c.flag }))} />
          <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Ajouter un Agent à un Hub existant</h4>
             <CargoUserForm cargos={cargos.map(c => ({ id: c.id, name: c.name }))} />
          </div>
        </div>

        {/* LIST SECTION */}
        <div className="xl:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
               <Building2 size={16} className="text-secondary" /> Hubs Enregistrés ({cargos.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {cargos.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200 text-muted-foreground">
                <Globe2 size={40} className="mb-4 opacity-20" />
                <p className="font-black uppercase text-[10px] tracking-widest">Aucun hub cargo configuré</p>
              </div>
            ) : (
              cargos.map((cargo) => (
                <Card key={cargo.id} className="rounded-[40px] border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white group">
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                      <div className="space-y-4 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h4 className="text-2xl font-black text-primary tracking-tight uppercase group-hover:text-secondary transition-colors">{cargo.name}</h4>
                            <div className="flex gap-1">
                               {cargo.transportType === 'AIR' && (
                                 <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center" title="Fret Aérien">
                                    <Plane size={12} />
                                 </div>
                               )}
                               {cargo.transportType === 'SEA' && (
                                 <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center" title="Fret Maritime">
                                    <Ship size={12} />
                                 </div>
                               )}
                            </div>
                          </div>
                          
                          <CargoCardActions id={cargo.id} isActive={cargo.isActive} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 text-slate-500">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                              <Globe2 size={14} />
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Route Logistique</p>
                              <p className="text-sm font-bold text-primary italic">
                                {cargo.originCountry} → {cargo.destinationCountry}
                              </p>
                              {cargo.city && <p className="text-[10px] font-medium text-slate-400 leading-none">Ville : {cargo.city}</p>}
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-slate-500">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                              <MapPin size={14} />
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Adresse</p>
                              <p className="text-sm font-medium leading-tight line-clamp-1">{cargo.warehouseAddress}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3 text-slate-500">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                              <Phone size={14} />
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Contact</p>
                              <p className="text-sm font-bold">{cargo.contact || 'Non renseigné'}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-slate-500">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                              <Users size={14} />
                            </div>
                            <div>
                              <p className="text-[9px] font-black uppercase tracking-widest opacity-50">Utilisateurs</p>
                              <p className="text-sm font-bold">{cargo.profiles.length} agent(s) rattaché(s)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-64 space-y-4">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-3">Agents Actifs</p>
                        <div className="space-y-2">
                          {cargo.profiles.length > 0 ? (
                            cargo.profiles.map(p => (
                              <div key={p.id} className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 group/user">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <span className="text-[11px] font-bold text-slate-600 truncate">{p.email}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-[10px] italic text-muted-foreground font-medium">Aucun compte utilisateur.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
