'use client'

import React, { useState } from 'react'
import { createCargoPartner } from '@/lib/actions/admin/cargos/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Loader2, Mail, Key, Globe2, Building2, Plane, Ship } from 'lucide-react'
import { toast } from 'sonner'
import { ALL_COUNTRIES } from '@/lib/constants/countries'
import { TransportType } from '@prisma/client'
import { cn } from '@/lib/utils'

export default function CargoPartnerForm({ countries, onSuccess }: { 
  countries: { name: string, code: string, flag: string | null }[],
  onSuccess?: () => void 
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    hub: {
      name: '',
      country: '',
      destinationCountry: '',
      city: '',
      address: '',
      contact: '',
      active: true,
      transportType: 'AIR' as TransportType
    },
    user: {
      email: '',
      password: ''
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.hub.country || !formData.hub.destinationCountry) {
      toast.error("Veuillez sélectionner l'origine et la destination")
      return
    }
    setLoading(true)

    try {
      const result = await createCargoPartner(formData)
      if (result.success) {
        toast.success("Partenaire Cargo et Compte créés avec succès")
        setFormData({
          hub: { name: '', country: '', destinationCountry: '', city: '', address: '', contact: '', active: true, transportType: 'AIR' },
          user: { email: '', password: '' }
        })
        if (onSuccess) onSuccess()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/50 italic">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 rounded-[20px] bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
          <Building2 size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black uppercase tracking-tight text-primary">Nouveau Partenaire Cargo</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic">Hub physique & Compte d'accès</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* SECTION 1: HUB INFO */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-secondary mb-2">
            <Globe2 size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest italic">Configuration du Hub</span>
          </div>
          
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Nom Commercial</Label>
            <Input 
              required 
              placeholder="ex: Sharufa Hub Istanbul"
              className="rounded-2xl border-slate-200 h-12 font-medium italic"
              value={formData.hub.name}
              onChange={(e) => setFormData({...formData, hub: {...formData.hub, name: e.target.value}})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Origine</Label>
              <select 
                required 
                className="w-full rounded-2xl border border-slate-200 h-12 px-4 bg-white outline-none text-sm font-medium italic"
                value={formData.hub.country}
                onChange={(e) => setFormData({...formData, hub: {...formData.hub, country: e.target.value}})}
              >
                <option value="">Origine...</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Destination</Label>
              <select 
                required 
                className="w-full rounded-2xl border border-slate-200 h-12 px-4 bg-white outline-none text-sm font-medium italic"
                value={formData.hub.destinationCountry}
                onChange={(e) => setFormData({...formData, hub: {...formData.hub, destinationCountry: e.target.value}})}
              >
                <option value="">Destination...</option>
                {ALL_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ville</Label>
              <Input 
                required 
                placeholder="ex: Istanbul"
                className="rounded-2xl border-slate-200 h-12 font-medium italic"
                value={formData.hub.city}
                onChange={(e) => setFormData({...formData, hub: {...formData.hub, city: e.target.value}})}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Hub</Label>
              <Input 
                placeholder="ex: +90 5xx xxx xxx"
                className="rounded-2xl border-slate-200 h-12 font-medium italic"
                value={formData.hub.contact}
                onChange={(e) => setFormData({...formData, hub: {...formData.hub, contact: e.target.value}})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Adresse Complète</Label>
            <Input 
              required 
              placeholder="Adresse du dépôt pour les vendeurs..."
              className="rounded-2xl border-slate-200 h-12 font-medium italic"
              value={formData.hub.address}
              onChange={(e) => setFormData({...formData, hub: {...formData.hub, address: e.target.value}})}
            />
          </div>
        </div>

        {/* SECTION 2: ACCOUNT INFO */}
        <div className="space-y-4 p-6 bg-slate-900 rounded-[32px] text-white">
          <div className="flex items-center gap-2 text-secondary mb-2">
            <Mail size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest text-white/60 italic">Compte d'accès (Agent Principal)</span>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 italic">Email de connexion</Label>
              <div className="relative">
                <Input 
                  type="email"
                  required 
                  placeholder="partenaire@email.com"
                  className="rounded-2xl border-white/10 bg-white/5 h-12 text-white placeholder:text-white/20 pl-10 italic"
                  value={formData.user.email}
                  onChange={(e) => setFormData({...formData, user: {...formData.user, email: e.target.value}})}
                />
                <Mail className="absolute left-3.5 top-3.5 text-white/20" size={16} />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1 italic">Mot de passe temporaire</Label>
              <div className="relative">
                <Input 
                  type="text"
                  placeholder="Laisser vide pour générer"
                  className="rounded-2xl border-white/10 bg-white/5 h-12 text-white placeholder:text-white/20 pl-10 italic"
                  value={formData.user.password}
                  onChange={(e) => setFormData({...formData, user: {...formData.user, password: e.target.value}})}
                />
                <Key className="absolute left-3.5 top-3.5 text-white/20" size={16} />
              </div>
              <p className="text-[9px] text-secondary font-bold uppercase tracking-tighter italic">L'utilisateur devra obligatoirement changer ce mot de passe à la première connexion.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
           <div className="space-y-0.5 w-full">
             <Label className="text-[10px] font-black uppercase tracking-widest text-primary italic">Mode de Fret</Label>
             <div className="grid grid-cols-2 gap-2 mt-2">
               <button 
                type="button"
                onClick={() => setFormData({...formData, hub: {...formData.hub, transportType: 'AIR'}})}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all italic",
                  formData.hub.transportType === 'AIR' 
                    ? "bg-primary text-secondary border-primary shadow-lg shadow-primary/20" 
                    : "bg-white text-slate-400 border-slate-100"
                )}
               >
                 <Plane size={14} /> Aérien
               </button>
               <button 
                type="button"
                onClick={() => setFormData({...formData, hub: {...formData.hub, transportType: 'SEA'}})}
                className={cn(
                  "flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all italic",
                  formData.hub.transportType === 'SEA' 
                    ? "bg-primary text-secondary border-primary shadow-lg shadow-primary/20" 
                    : "bg-white text-slate-400 border-slate-100"
                )}
               >
                 <Ship size={14} /> Maritime
               </button>
             </div>
           </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 italic">
          <div className="space-y-0.5">
            <Label className="text-xs font-bold text-primary uppercase italic">Hub Actif</Label>
            <p className="text-[10px] text-muted-foreground font-medium italic">Prêt pour l'assignation immédiate.</p>
          </div>
          <Switch 
            checked={formData.hub.active}
            onCheckedChange={(checked) => setFormData({...formData, hub: {...formData.hub, active: checked}})}
          />
        </div>
      </div>

      <Button 
        type="submit" 
        disabled={loading}
        className="w-full h-16 rounded-2xl bg-primary text-white font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-2xl shadow-primary/20 italic"
      >
        {loading ? <Loader2 className="animate-spin" /> : "Créer le Partenaire Cargo"}
      </Button>
    </form>
  )
}
