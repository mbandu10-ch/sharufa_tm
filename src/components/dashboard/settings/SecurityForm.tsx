'use client'

import React, { useState } from 'react'
import { Card } from '../../ui/card'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { Label } from '../../ui/label'
import { toast } from 'sonner'
import { ShieldCheck, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { updatePassword } from '../../../app/auth/actions'

export function SecurityForm() {
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await updatePassword(formData)

    setLoading(false)

    if (result.error) toast.error(result.error)
    else {
      toast.success(result.message)
      e.currentTarget.reset()
    }
  }

  return (
    <Card className="p-8 border-none shadow-2xl shadow-slate-200/50 rounded-[32px] bg-white/80 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full -mr-16 -mt-16 blur-3xl" />
      <div className="relative z-10 space-y-8">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
              <ShieldCheck size={24} />
           </div>
           <div>
              <h2 className="text-2xl font-black font-outfit text-primary tracking-tight">Mot de Passe</h2>
              <p className="text-muted-foreground text-sm font-medium">Sécurisez votre compte avec un mot de passe robuste.</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <Label htmlFor="password" title="Nouveau mot de passe" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nouveau mot de passe</Label>
             <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={20} />
                <Input 
                  id="password" 
                  name="password" 
                  type={showPwd ? 'text' : 'password'}
                  required 
                  className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/30 pl-14 pr-14 font-bold text-primary focus:border-red-500 transition-all"
                />
                <button 
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                   {showPwd ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
             </div>
          </div>

          <div className="space-y-2">
             <Label htmlFor="confirmPassword" title="Confirmer le mot de passe" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Confirmer le mot de passe</Label>
             <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors" size={20} />
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showPwd ? 'text' : 'password'}
                  required 
                  className="h-14 rounded-2xl border-2 border-slate-100 bg-slate-50/30 pl-14 pr-14 font-bold text-primary focus:border-red-500 transition-all"
                />
             </div>
          </div>

          <div className="pt-4 flex justify-end">
             <Button 
               type="submit" 
               disabled={loading}
               className="h-14 px-10 rounded-full bg-red-600 text-white font-black shadow-xl shadow-red-600/20 hover:scale-105 transition-all text-sm group"
             >
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Mettre à jour le mot de passe'}
             </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
