'use client'

import React, { useState } from 'react'
import { FreightRule, TransportType, Country } from '@prisma/client'
import { createFreightRule, deleteFreightRule, toggleFreightRuleStatus } from '@/lib/actions/admin/logistics/freight/actions'
import { toast } from 'sonner'
import { Plus, Trash2, Plane, Ship, Loader2 } from 'lucide-react'
import { Button } from '@sharufa/ui/components/button'
import { Input } from '@sharufa/ui/components/input'
import { Label } from '@sharufa/ui/components/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FreightRuleManagerProps {
  rules: FreightRule[]
  countries: Country[]
}

export default function FreightRuleManager({ rules, countries }: FreightRuleManagerProps) {
  const [loading, setLoading] = useState(false)
  
  // States
  const [originCountry, setOriginCountry] = useState('')
  const [destinationCountry, setDestinationCountry] = useState('')
  const [transportMode, setTransportMode] = useState<TransportType>('AIR')
  const [pricePerKg, setPricePerKg] = useState('')
  const [pricePerCbm, setPricePerCbm] = useState('')
  const [minimumCharge, setMinimumCharge] = useState('0')
  const [volumetricDivisor, setVolumetricDivisor] = useState('6000')
  const [allowPayAtDestination, setAllowPayAtDestination] = useState(true)
  const [estimatedMinDays, setEstimatedMinDays] = useState('5')
  const [estimatedMaxDays, setEstimatedMaxDays] = useState('10')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!originCountry || !destinationCountry) {
      toast.error('Veuillez sélectionner l\'origine et la destination.')
      return
    }
    
    setLoading(true)
    const result = await createFreightRule({
      originCountry,
      destinationCountry,
      transportMode,
      pricePerKg: pricePerKg ? parseFloat(pricePerKg) : undefined,
      pricePerCbm: pricePerCbm ? parseFloat(pricePerCbm) : undefined,
      minimumCharge: parseFloat(minimumCharge) || 0,
      volumetricDivisor: parseFloat(volumetricDivisor) || 6000,
      allowPayAtDestination,
      estimatedMinDays: parseInt(estimatedMinDays) || 5,
      estimatedMaxDays: parseInt(estimatedMaxDays) || 10
    })

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Règle de fret ajoutée avec succès !')
      setPricePerKg('')
      setPricePerCbm('')
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Voulez-vous vraiment supprimer cette règle ?')) return
    const result = await deleteFreightRule(id)
    if (result.error) toast.error(result.error)
    else toast.success('Règle supprimée.')
  }

  const handleToggle = async (id: string, active: boolean) => {
    const result = await toggleFreightRuleStatus(id, active)
    if (result.error) toast.error(result.error)
    else toast.success('Statut mis à jour.')
  }

  return (
    <div className="space-y-10">
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-lg font-black uppercase tracking-tight mb-6">Ajouter une règle de tarification</h2>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Origine</Label>
              <Select value={originCountry} onValueChange={(val: string | null) => setOriginCountry(val || '')}>
                <SelectTrigger className="rounded-xl border-2"><SelectValue placeholder="Pays de départ" /></SelectTrigger>
                <SelectContent>
                  {countries.map(c => (
                    <SelectItem key={c.id} value={c.name}>{c.flag} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Destination</Label>
              <Select value={destinationCountry} onValueChange={(val: string | null) => setDestinationCountry(val || '')}>
                <SelectTrigger className="rounded-xl border-2"><SelectValue placeholder="Pays d'arrivée" /></SelectTrigger>
                <SelectContent>
                  {countries.map(c => (
                    <SelectItem key={c.id} value={c.name}>{c.flag} {c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Transport</Label>
              <Select value={transportMode} onValueChange={(val: any) => setTransportMode(val)}>
                <SelectTrigger className="rounded-xl border-2"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="AIR">Aérien (AIR)</SelectItem>
                  <SelectItem value="SEA">Maritime (SEA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 bg-slate-50 p-6 rounded-2xl">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Prix au Kg</Label>
              <Input value={pricePerKg} onChange={e => setPricePerKg(e.target.value)} type="number" step="1" className="rounded-xl" placeholder="ex: 8500" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Prix par CBM (m³)</Label>
              <Input value={pricePerCbm} onChange={e => setPricePerCbm(e.target.value)} type="number" step="1" className="rounded-xl" placeholder="Maritime ex: 250000" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Taxe Fixe Min.</Label>
              <Input value={minimumCharge} onChange={e => setMinimumCharge(e.target.value)} type="number" step="1" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground uppercase">Diviseur Volumétrique</Label>
              <Input value={volumetricDivisor} onChange={e => setVolumetricDivisor(e.target.value)} type="number" className="rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="space-y-2 flex flex-col justify-center">
                <Label className="text-xs font-bold text-muted-foreground uppercase mb-2">Paiement à destination ?</Label>
                <div className="flex items-center gap-2">
                  <Switch checked={allowPayAtDestination} onCheckedChange={setAllowPayAtDestination} />
                  <span className="text-xs font-bold">{allowPayAtDestination ? "Autorisé" : "Interdit (Prépayé strict)"}</span>
                </div>
             </div>
             <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Délai Min. (Jours)</Label>
                <Input value={estimatedMinDays} onChange={e => setEstimatedMinDays(e.target.value)} type="number" className="rounded-xl" />
             </div>
             <div className="space-y-2">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Délai Max. (Jours)</Label>
                <Input value={estimatedMaxDays} onChange={e => setEstimatedMaxDays(e.target.value)} type="number" className="rounded-xl" />
             </div>
          </div>

          <Button disabled={loading} type="submit" className="w-full rounded-xl bg-primary text-white h-12 font-bold tracking-widest text-xs uppercase">
            {loading ? <Loader2 className="animate-spin" /> : <><Plus size={16} className="mr-2" /> Créer la règle Fret</>}
          </Button>
        </form>
      </div>

      <div className="space-y-4">
         <h2 className="text-lg font-black uppercase tracking-tight">Règles Actives ({rules.length})</h2>
         <div className="grid gap-4">
           {rules.map(rule => (
             <div key={rule.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm gap-4">
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${rule.transportMode === 'AIR' ? 'bg-sky-500' : 'bg-blue-800'}`}>
                      {rule.transportMode === 'AIR' ? <Plane size={20} /> : <Ship size={20} />}
                   </div>
                   <div>
                      <div className="font-black text-primary uppercase text-sm">{rule.originCountry} → {rule.destinationCountry}</div>
                      <div className="text-xs text-muted-foreground font-bold mt-1">
                         {rule.pricePerKg ? `$ ${rule.pricePerKg} / Kg` : ''} 
                         {rule.pricePerCbm ? ` | $ ${rule.pricePerCbm} / CBM` : ''} 
                         {' | Diviseur: ' + rule.volumetricDivisor}
                      </div>
                      {!rule.allowPayAtDestination && (
                         <div className="text-[10px] uppercase font-black tracking-widest text-orange-600 mt-1">Paiement à destination interdit</div>
                      )}
                   </div>
                </div>
                
                <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 border-r pr-4">
                     <span className="text-[10px] font-bold uppercase text-muted-foreground">Actif</span>
                     <Switch checked={rule.isActive} onCheckedChange={(val: boolean) => handleToggle(rule.id, val)} />
                   </div>
                   <button onClick={() => handleDelete(rule.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                     <Trash2 size={16} />
                   </button>
                </div>
             </div>
           ))}
           {rules.length === 0 && (
             <div className="p-10 text-center text-muted-foreground italic bg-white rounded-3xl border border-slate-100">
                Aucune règle tarifaire configurée.
             </div>
           )}
         </div>
      </div>
    </div>
  )
}
