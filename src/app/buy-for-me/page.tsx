'use client'

import { createSourcingRequest } from './actions'
import { getDomainCategories } from '@/app/seller/actions'
import { Search, Filter, MapPin, Star, ArrowRight, Store, ShoppingBag, Globe, Link as LinkIcon, DollarSign, Send, Info, Layers } from 'lucide-react'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
import { toast } from 'sonner'

const countries = [
  { id: 'DUBAI', name: 'Dubaï (UAE)', flag: '🇦🇪' },
  { id: 'TURKEY', name: 'Turquie', flag: '🇹🇷' },
  { id: 'CHINA', name: 'Chine', flag: '🇨🇳' },
]

export default function BuyForMePage() {
  const [isPending, setIsPending] = useState(false)
  const [domains, setDomains] = useState<{id: string, name: string}[]>([])
  const [selectedDomain, setSelectedDomain] = useState<string>("")

  useEffect(() => {
    getDomainCategories().then(res => {
      if (res.domains) setDomains(res.domains)
    })
  }, [])

  async function handleSubmit(formData: FormData) {
    if (selectedDomain) {
      formData.append('categoryId', selectedDomain)
    }
    
    setIsPending(true)
    const result = await createSourcingRequest(formData)
    setIsPending(false)
    
    if (result?.error) {
      toast.error(result.error)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge variant="outline" className="px-4 py-1 border-secondary text-secondary font-bold">
            SERVICE DE CONCIERGERIE
          </Badge>
          <h1 className="text-4xl md:text-6xl font-outfit font-bold text-primary italic tracking-tighter uppercase">Buy For Me</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            Vous avez trouvé un produit en ligne ou vous cherchez un fournisseur ? <br className="hidden md:block" />
            Envoyez-nous votre demande, et notre équipe s&apos;occupe de tout : <span className="text-primary font-bold">recherche, négociation, achat et expédition</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl bg-background rounded-[32px] overflow-hidden">
              <div className="h-2 bg-secondary w-full" />
              <CardHeader className="pt-8 px-8">
                <CardTitle className="text-2xl font-bold font-outfit text-primary">Détails de votre demande</CardTitle>
                <CardDescription>
                  Soyez le plus précis possible pour obtenir le meilleur prix.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form action={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <Label className="text-lg font-bold">Pays d'achat</Label>
                    <div className="grid grid-cols-3 gap-4">
                      {countries.map((c) => (
                        <label key={c.id} className="relative cursor-pointer group">
                          <input type="radio" name="country" value={c.id} className="peer sr-only" required />
                          <div className="p-4 border-2 border-border rounded-2xl text-center transition-all group-hover:border-secondary peer-checked:border-secondary peer-checked:bg-secondary/5">
                            <span className="text-2xl mb-2 block">{c.flag}</span>
                            <span className="text-xs font-bold uppercase tracking-wider">{c.name}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="productName" className="text-lg font-bold">Nom du produit</Label>
                    <Input 
                      id="productName" 
                      name="productName" 
                      placeholder="Ex: iPhone 15 Pro Max, 256GB" 
                      className="rounded-xl border-none bg-muted/30 p-6" 
                      required 
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="domain" className="text-lg font-bold flex items-center gap-2">
                       <Layers className="w-4 h-4 text-secondary" /> Catégorie du produit
                    </Label>
                    <Select onValueChange={(v: string | null) => setSelectedDomain(v || "")} required>
                      <SelectTrigger className="rounded-xl border-none bg-muted/30 h-[58px] px-6 text-lg">
                        <SelectValue placeholder="Choisir un univers..." />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {domains.map((domain) => (
                          <SelectItem key={domain.id} value={domain.id} className="rounded-lg py-3">
                            {domain.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="description" className="text-lg font-bold">Détails & Instructions</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="Spécifiez la couleur, la taille, la quantité et toute instruction particulière..." 
                      className="min-h-[120px] rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-secondary/50 p-6 text-lg"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <Label htmlFor="link" className="text-lg font-bold flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-secondary" /> Lien ou URL (optionnel)
                      </Label>
                      <Input id="link" name="link" placeholder="Lien vers la boutique ou le produit" className="rounded-xl border-none bg-muted/30 p-6" />
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="budget" className="text-lg font-bold flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-secondary" /> Budget max ($)
                      </Label>
                      <Input id="budget" name="budget" type="number" placeholder="Ex: 1000" className="rounded-xl border-none bg-muted/30 p-6" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="image" className="text-lg font-bold">Photo ou Capture d'écran (optionnel)</Label>
                    <Input id="image" name="image" type="file" accept="image/*" className="rounded-xl border-none bg-muted/30 p-6 cursor-pointer" />
                  </div>

                  <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20 flex gap-4">
                    <Info className="w-6 h-6 text-blue-500 shrink-0" />
                    <p className="text-sm text-blue-700 leading-relaxed">
                      Nos agents vérifieront la disponibilité et vous enverront un devis incluant la commission Sharufa et les frais de logistique sous 24h.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isPending}
                    className="w-full py-8 bg-primary text-secondary font-black text-xl rounded-2xl shadow-xl hover:shadow-secondary/20 transition-all flex gap-3 uppercase tracking-widest italic"
                  >
                    {isPending ? 'Recherche en cours...' : (
                      <>
                        Trouver mon produit <Send className="w-6 h-6" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-8">
            <div className="p-8 bg-secondary rounded-[32px] text-primary space-y-6 shadow-lg rotate-1">
              <h3 className="text-2xl font-bold font-outfit uppercase tracking-tighter">Comment ça marche ?</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">1</div>
                  <p className="font-medium">Décrivez le produit que vous cherchez (ou collez un lien).</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">2</div>
                  <p className="font-medium">Recevez un devis personnalisé incluant l'achat et le transport.</p>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">3</div>
                  <p className="font-medium">Validez, payez et suivez l'acheminement de votre colis.</p>
                </div>
              </div>
            </div>

            <div className="p-8 border border-border rounded-[32px] space-y-4">
          <h4 className="font-bold flex items-center gap-2 text-primary">
            <Globe className="w-5 h-5 text-secondary" /> Garantie Sharufa
          </h4>
              <p className="text-sm text-muted-foreground">
                Nous agissons comme tiers de confiance. Votre argent n'est décaissé au fournisseur qu'après vérification de la marchandise par nos équipes locales.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
