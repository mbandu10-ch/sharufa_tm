'use client'

import React, { useState } from 'react'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { toast } from 'sonner'
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react'
import { updateProfile } from '../../../app/dashboard/settings/actions'

interface ProfileFormProps {
  profile: any
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)

    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.message)
    }
  }

  return (
    <Card className="p-8 border-none shadow-2xl shadow-slate-200/50 rounded-[32px] bg-white/80 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
              <User size={24} />
           </div>
           <div>
              <h2 className="text-2xl font-black font-outfit text-primary tracking-tight">Informations de Profil</h2>
              <p className="text-muted-foreground text-sm font-medium">Gérez vos coordonnées personnelles.</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2">
                <Label htmlFor="firstName" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Prénom</Label>
                <div className="relative group">
                   <Input 
                      id="firstName" 
                      name="firstName" 
                      defaultValue={profile?.firstName || ''} 
                      className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-6 font-bold text-primary focus:border-secondary transition-all"
                   />
                </div>
             </div>
             <div className="space-y-2">
                <Label htmlFor="lastName" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nom</Label>
                <Input 
                  id="lastName" 
                  name="lastName" 
                  defaultValue={profile?.lastName || ''} 
                  className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/30 px-6 font-bold text-primary focus:border-secondary transition-all"
                />
             </div>
          </div>

          <div className="space-y-2">
             <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail (Non modifiable)</Label>
             <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <Input 
                  id="email" 
                  disabled 
                  defaultValue={profile?.email || ''} 
                  className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50 opacity-60 pl-14 pr-6 font-bold text-slate-500 cursor-not-allowed"
                />
             </div>
          </div>

          <div className="space-y-2">
             <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Numéro de Téléphone</Label>
             <div className="relative group">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-secondary transition-colors" size={20} />
                <Input 
                  id="phone" 
                  name="phone"
                  placeholder="+225 ..."
                  defaultValue={profile?.phone || ''} 
                  className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/30 pl-14 pr-6 font-bold text-primary focus:border-secondary transition-all"
                />
             </div>
          </div>

          <div className="pt-4 flex justify-end">
             <Button 
               type="submit" 
               disabled={loading}
               className="h-14 px-10 rounded-full bg-primary text-white font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-sm group"
             >
                {loading ? (
                   <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Mise à jour...
                   </>
                ) : (
                   <>
                      <Save className="mr-2 h-5 w-5" /> Enregistrer les modifications
                   </>
                )}
             </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
