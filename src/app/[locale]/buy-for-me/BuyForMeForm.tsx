'use client'

import React, { useState } from 'react'
import { createSourcingRequest } from './actions'
import { 
  Search, Filter, MapPin, Star, ArrowRight, Store, 
  ShoppingBag, Globe, Link as LinkIcon, DollarSign, 
  Send, Info, Layers, Loader2 
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface BuyForMeFormProps {
  domains: { id: string, name: string }[]
}

const countries = [
  { id: 'DUBAI', name: 'Dubaï (UAE)', flag: '🇦🇪' },
  { id: 'TURKEY', name: 'Turquie', flag: '🇹🇷' },
  { id: 'CHINA', name: 'Chine', flag: '🇨🇳' },
]

export function BuyForMeForm({ domains }: BuyForMeFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string>("")

  async function handleSubmit(formData: FormData) {
    if (selectedDomain) {
      formData.append('categoryId', selectedDomain)
    }
    
    setIsPending(true)
    try {
      const result = await createSourcingRequest(formData)
      if (result?.error) {
        toast.error(result.error)
      }
    } catch (error) {
      console.error('Submission error:', error)
      toast.error('Une erreur est survenue.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="border-none shadow-xl bg-background rounded-[32px] overflow-hidden italic">
      <div className="h-2 bg-secondary w-full" />
      <CardHeader className="pt-8 px-8 italic">
        <CardTitle className="text-2xl font-bold font-outfit text-primary italic">Détails de votre demande</CardTitle>
        <CardDescription className="italic">
          Soyez le plus précis possible pour obtenir le meilleur prix.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 italic">
        <form action={handleSubmit} className="space-y-8 italic">
          <div className="space-y-4">
            <Label className="text-lg font-bold italic">Pays d'achat</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {countries.map((c) => (
                <label key={c.id} className="relative cursor-pointer group">
                  <input type="radio" name="country" value={c.id} className="peer sr-only" required />
                  <div className="p-4 border-2 border-border rounded-2xl text-center transition-all group-hover:border-secondary peer-checked:border-secondary peer-checked:bg-secondary/5 italic">
                    <span className="text-2xl mb-2 block">{c.flag}</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{c.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="productName" className="text-lg font-bold italic">Nom du produit</Label>
            <Input 
              id="productName" 
              name="productName" 
              placeholder="Ex: iPhone 15 Pro Max, 256GB" 
              className="rounded-xl border-none bg-muted/30 p-6 italic" 
              required 
            />
          </div>

          <div className="space-y-4">
            <Label htmlFor="domain" className="text-lg font-bold flex items-center gap-2 italic">
               <Layers className="w-4 h-4 text-secondary" /> Catégorie du produit
            </Label>
            <Select onValueChange={(val: string | null) => setSelectedDomain(val || "")}>
              <SelectTrigger className="rounded-xl border-none bg-muted/30 h-[58px] px-6 text-lg italic">
                <SelectValue placeholder="Choisir un univers..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl italic">
                {domains.map((domain) => (
                  <SelectItem key={domain.id} value={domain.id} className="rounded-lg py-3 italic">
                    {domain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label htmlFor="description" className="text-lg font-bold italic">Détails & Instructions</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Spécifiez la couleur, la taille, la quantité et toute instruction particulière..." 
              className="min-h-[120px] rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-secondary/50 p-6 text-lg italic"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 italic">
            <div className="space-y-4">
              <Label htmlFor="link" className="text-lg font-bold flex items-center gap-2 italic">
                <LinkIcon className="w-4 h-4 text-secondary" /> Lien ou URL (optionnel)
              </Label>
              <Input id="link" name="link" placeholder="Lien vers la boutique ou le produit" className="rounded-xl border-none bg-muted/30 p-6 italic" />
            </div>
            <div className="space-y-4">
              <Label htmlFor="budget" className="text-lg font-bold flex items-center gap-2 italic">
                <DollarSign className="w-4 h-4 text-secondary" /> Budget max ($)
              </Label>
              <Input id="budget" name="budget" type="number" placeholder="Ex: 1000" className="rounded-xl border-none bg-muted/30 p-6 italic" />
            </div>
          </div>

          <div className="space-y-4">
            <Label htmlFor="image" className="text-lg font-bold italic">Photo ou Capture d'écran (optionnel)</Label>
            <Input id="image" name="image" type="file" accept="image/*" className="rounded-xl border-none bg-muted/30 p-6 cursor-pointer italic" />
          </div>

          <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20 flex gap-4 italic">
            <Info className="w-6 h-6 text-blue-500 shrink-0" />
            <p className="text-sm text-blue-700 leading-relaxed italic">
              Nos agents vérifieront la disponibilité et vous enverront un devis incluant la commission Sharufa et les frais de logistique sous 24h.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full py-8 bg-primary text-secondary font-black text-xl rounded-2xl shadow-xl hover:shadow-secondary/20 transition-all flex gap-3 uppercase tracking-widest italic"
          >
            {isPending ? <Loader2 className="animate-spin" /> : (
              <>
                Trouver mon produit <Send className="w-6 h-6" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
