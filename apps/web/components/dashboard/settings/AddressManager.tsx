'use client'

import React, { useState, useMemo } from 'react'
import { Card } from '@sharufa/ui/components/card'
import { Button } from '@sharufa/ui/components/button'
import { Input } from '@sharufa/ui/components/input'
import { Label } from '@sharufa/ui/components/label'
import { Checkbox } from '@sharufa/ui/components/checkbox'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@sharufa/ui/components/dialog'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@sharufa/ui/components/select'
import { Country, State, City } from 'country-state-city'
import { MapPin, Plus, Trash2, Home, CheckCircle2, Loader2, Globe, Phone as PhoneIcon, Info, Search } from 'lucide-react'
import { toast } from 'sonner'
import { addAddress, deleteAddress, setDefaultAddress } from '@/app/dashboard/settings/actions'
import { cn } from '@/lib/utils'

interface Address {
  id: string
  fullName: string
  street: string
  city: string
  state?: string | null
  postalCode: string
  country: string
  isDefault: boolean
  phone?: string | null
  details?: string | null
}

interface AddressManagerProps {
  addresses: Address[]
  onSuccess?: () => void
  selectedId?: string | null
  onSelect?: (id: string) => void
}

export function AddressManager({ addresses, onSuccess, selectedId, onSelect }: AddressManagerProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  
  // Cascading states
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedState, setSelectedState] = useState<string>('')

  // Memoized data to prevent expensive recalculations
  const allCountries = useMemo(() => Country.getAllCountries(), [])
  
  const availableStates = useMemo(() => 
    selectedCountry ? State.getStatesOfCountry(selectedCountry) : []
  , [selectedCountry])

  const availableCities = useMemo(() => {
    if (!selectedCountry) return []
    const cities = selectedState 
      ? City.getCitiesOfState(selectedCountry, selectedState) 
      : City.getCitiesOfCountry(selectedCountry)
    return cities || []
  }, [selectedCountry, selectedState])

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading('add')
    const formData = new FormData(e.currentTarget)
    
    // Server action
    const result = await addAddress(formData)
    
    setLoading(null)
    if (result.error) {
       toast.error(result.error)
       console.error('Submission error:', result.error)
    } else {
      toast.success(result.message)
      setOpen(false)
      setSelectedCountry('')
      setSelectedState('')
      if (onSuccess) onSuccess()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Souhaitez-vous supprimer cette adresse ?')) return
    setLoading(id)
    const result = await deleteAddress(id)
    setLoading(null)
    if (result.error) toast.error(result.error)
    else {
      toast.success(result.message)
      if (onSuccess) onSuccess()
    }
  }

  const handleSetDefault = async (id: string) => {
    setLoading(`default-${id}`)
    const result = await setDefaultAddress(id)
    setLoading(null)
    if (result.error) toast.error(result.error)
    else {
      toast.success(result.message)
      if (onSuccess) onSuccess()
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600">
               <MapPin size={24} />
            </div>
            <div>
               <h2 className="text-2xl font-black font-outfit text-primary tracking-tight">Carnet d'Adresses</h2>
               <p className="text-muted-foreground text-sm font-medium">Gérez vos expéditions globales en un clic.</p>
            </div>
         </div>

         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger 
              render={<Button className="h-14 px-8 rounded-full bg-primary text-white font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all" />}
            >
               <>
                 <Plus className="mr-2" size={20} /> Nouvelle Adresse
               </>
            </DialogTrigger>

            <DialogContent className="max-w-2xl rounded-[40px] p-10 border-none overflow-y-auto max-h-[95vh] bg-white ring-1 ring-slate-200">
              <DialogHeader className="mb-8">
                 <DialogTitle className="text-4xl font-black font-outfit text-primary tracking-tighter">Où livrons-nous ?</DialogTitle>
                 <p className="text-muted-foreground font-medium text-sm">Précisez votre destination pour une logistique fluide.</p>
              </DialogHeader>
              
              <form onSubmit={handleAdd} className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Destinataire</Label>
                       <Input name="fullName" required placeholder="Nom et Prénom" className="h-14 rounded-2xl border-2 border-slate-100 px-6 font-bold focus:border-secondary transition-all" />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Numéro de Téléphone</Label>
                       <div className="relative group">
                         <PhoneIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors" size={18} />
                         <Input name="phone" required placeholder="+225 00 00 00 00" className="h-14 rounded-2xl border-2 border-slate-100 pl-12 pr-6 font-bold focus:border-secondary transition-all" />
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pays</Label>
                       <Select 
                         name="country" 
                         onValueChange={(val: string | null) => {
                           if (val) {
                             setSelectedCountry(val)
                             setSelectedState('')
                           }
                         }}
                         required
                       >
                          <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 px-6 font-bold focus:border-secondary transition-all">
                             <SelectValue placeholder="Choisir un pays" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-none shadow-2xl p-2 max-h-64">
                             {allCountries.map(c => (
                                <SelectItem key={c.isoCode} value={c.isoCode} className="rounded-xl py-3 font-bold">{c.name}</SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>

                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ville (Saisie intelligente)</Label>
                       <div className="relative group">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                         <Input 
                            name="city" 
                            list="cities-list"
                            required 
                            disabled={!selectedCountry}
                            placeholder={selectedCountry ? "Tapez pour voir les villes..." : "Choisissez d'abord un pays"}
                            className="h-14 rounded-2xl border-2 border-slate-100 pl-12 pr-6 font-bold focus:border-blue-500 transition-all" 
                         />
                         <datalist id="cities-list">
                            {availableCities.slice(0, 500).map((c, i) => (
                               <option key={`${c.name}-${i}`} value={c.name} />
                            ))}
                         </datalist>
                       </div>
                       {availableCities.length > 500 && (
                          <p className="text-[10px] font-bold text-blue-600 mt-1 ml-1 flex items-center gap-1">
                            <Info size={10} /> +{availableCities.length - 500} autres villes... Tapez pour filtrer.
                          </p>
                       )}
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Région / État (Optionnel)</Label>
                       <Select 
                         name="state" 
                         disabled={!selectedCountry || availableStates.length === 0}
                         onValueChange={(val: string | null) => {
                           if (val) setSelectedState(val)
                         }}
                       >
                          <SelectTrigger className="h-14 rounded-2xl border-2 border-slate-100 px-6 font-bold">
                             <SelectValue placeholder="Région" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-none shadow-2xl p-2 max-h-64">
                             {availableStates.map(s => (
                                <SelectItem key={s.isoCode} value={s.isoCode} className="rounded-xl py-3 font-bold">{s.name}</SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Code Postal</Label>
                       <Input name="postalCode" required placeholder="0000" className="h-14 rounded-2xl border-2 border-slate-100 px-6 font-bold focus:border-secondary transition-all" />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Adresse (Rue, Quartier, Immeuble)</Label>
                    <Input name="street" required placeholder="Ex: Rue 12, Plateau, Imm. ABC" className="h-14 rounded-2xl border-2 border-slate-100 px-6 font-bold focus:border-secondary transition-all" />
                 </div>

                 <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Compléments (Étage, Code porte, Infos livreur)</Label>
                    <Input name="details" placeholder="Appartement 14, 2ème gauche..." className="h-14 rounded-2xl border-2 border-slate-100 px-6 font-bold italic focus:border-secondary transition-all" />
                 </div>

                 <div className="flex items-center space-x-3 pt-2">
                    <Checkbox id="isDefault" name="isDefault" className="text-secondary border-2 h-5 w-5 rounded-md" />
                    <Label htmlFor="isDefault" className="text-sm font-bold text-primary cursor-pointer select-none">Définir comme adresse principale</Label>
                 </div>

                 <div className="pt-6 border-t border-slate-100">
                    <Button 
                       type="submit" 
                       disabled={loading === 'add'}
                       className="w-full h-16 rounded-2xl bg-primary text-white font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                       {loading === 'add' ? <Loader2 className="animate-spin mr-2" /> : 'Enregistrer la destination'}
                    </Button>
                 </div>
              </form>
            </DialogContent>
         </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
         {addresses.length === 0 ? (
           <div className="col-span-full py-24 flex flex-col items-center justify-center bg-slate-50/50 rounded-[48px] border-4 border-dashed border-slate-100 group hover:border-slate-200 transition-colors">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                <Home size={40} className="text-slate-200" />
              </div>
              <p className="text-muted-foreground font-black uppercase tracking-widest text-xs mb-2">Aucune adresse détectée</p>
              <p className="text-slate-400 text-sm font-medium">Commencez par ajouter votre premier lieu de livraison.</p>
           </div>
         ) : (
           addresses.map((addr) => (
             <Card 
               key={addr.id} 
               onClick={() => onSelect?.(addr.id)}
               className={cn(
                 "p-10 rounded-[48px] border-2 transition-all relative group overflow-hidden flex flex-col justify-between h-auto",
                 onSelect 
                   ? (selectedId === addr.id ? "border-secondary bg-white shadow-2xl ring-4 ring-secondary/5" : "border-slate-100 bg-white/50 hover:border-slate-200 cursor-pointer")
                   : (addr.isDefault ? "border-secondary/20 bg-white shadow-2xl shadow-secondary/5 ring-4 ring-secondary/5" : "border-slate-100 bg-white/50 hover:border-blue-100 shadow-sm")
               )}
             >
                {addr.isDefault && !onSelect && (
                  <div className="absolute top-0 right-0 bg-secondary text-primary px-6 py-2.5 rounded-bl-[28px] flex items-center gap-2 shadow-lg z-20">
                     <CheckCircle2 size={16} />
                     <span className="text-[11px] font-black uppercase tracking-widest">Adresse Principale</span>
                  </div>
                )}

                {onSelect && (
                   <div className="absolute top-6 right-6 z-20">
                      <div className={cn(
                        "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
                        selectedId === addr.id ? "bg-secondary border-secondary text-primary shadow-lg scale-110" : "bg-white border-slate-200 text-transparent"
                      )}>
                        <CheckCircle2 size={20} />
                      </div>
                   </div>
                 )}

                <div className="space-y-8 relative z-10">
                   <div className="flex items-start justify-between">
                      <div className="space-y-2">
                         <h3 className="font-black text-primary text-2xl tracking-tighter leading-none">{addr.fullName}</h3>
                         <div className="flex items-center gap-2 text-muted-foreground font-black text-[10px] uppercase tracking-widest bg-slate-100/50 px-3 py-1 rounded-full w-fit">
                            <Globe size={12} className="text-secondary" />
                            {Country.getCountryByCode(addr.country)?.name || addr.country}
                            {addr.state && <span className="opacity-40"> | </span>}
                            {addr.state && (State.getStateByCodeAndCountry(addr.state, addr.country)?.name || addr.state)}
                         </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        {!addr.isDefault && !onSelect && (
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             onClick={(e) => {
                               e.stopPropagation()
                               handleSetDefault(addr.id)
                             }}
                             disabled={!!loading}
                             className="rounded-full hover:bg-secondary/10 hover:text-secondary h-12 w-12 transition-all shadow-sm hover:shadow"
                           >
                              {loading === `default-${addr.id}` ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={22} />}
                           </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(addr.id)
                          }}
                          disabled={!!loading}
                          className="rounded-full hover:bg-red-50 hover:text-red-500 h-12 w-12 transition-all shadow-sm hover:shadow"
                        >
                           {loading === addr.id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={22} />}
                        </Button>
                      </div>
                   </div>

                   <div className="p-8 rounded-[40px] bg-slate-50/50 border border-slate-100/50 space-y-6">
                      <div className="space-y-2">
                        <p className="text-lg font-black text-primary leading-tight font-outfit">{addr.street}</p>
                        {addr.details && (
                          <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-2xl border border-blue-100/20">
                             <Info size={14} className="text-blue-500 shrink-0 mt-0.5" /> 
                             <p className="text-xs font-bold text-blue-700/80 leading-snug">{addr.details}</p>
                          </div>
                        )}
                        <p className="text-sm font-bold text-slate-500">{addr.city}{addr.postalCode && ` (${addr.postalCode})`}</p>
                      </div>

                      {addr.phone && (
                         <div className="pt-5 border-t border-slate-200/40 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-2xl bg-white shadow-soft flex items-center justify-center text-secondary border border-slate-100">
                               <PhoneIcon size={16} />
                            </div>
                            <span className="text-base font-black text-primary tracking-tight">{addr.phone}</span>
                         </div>
                      )}
                   </div>
                </div>
             </Card>
           ))
         )}
      </div>
    </div>
  )
}
