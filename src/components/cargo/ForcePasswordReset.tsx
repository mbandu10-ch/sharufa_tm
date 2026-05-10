'use client'

import React, { useState } from 'react'
import { forceUpdatePassword } from '@/app/cargo/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, ShieldAlert, Key, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ForcePasswordReset() {
  const [loading, setLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password.length < 8) {
      toast.error("Le mot de passe doit faire au moins 8 caractères.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.")
      return
    }

    setLoading(true)

    try {
      const result = await forceUpdatePassword(password)
      if (result.success) {
        toast.success("Mot de passe mis à jour ! Accès au dashboard...")
        window.location.reload()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("Une erreur inattendue est survenue.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#001D1A]/95 backdrop-blur-xl flex items-center justify-center p-6">
      <Card className="max-w-md w-full rounded-[40px] border-none shadow-2xl bg-white overflow-hidden animate-in fade-in zoom-in duration-500">
        <div className="bg-secondary p-8 flex items-center justify-center">
           <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-secondary shadow-lg">
              <Key size={32} className="animate-bounce" />
           </div>
        </div>
        
        <CardHeader className="text-center pt-8">
          <CardTitle className="text-2xl font-black uppercase tracking-tighter text-primary">Sécurité Obligatoire</CardTitle>
          <CardDescription className="text-slate-500 font-medium">
            Par mesure de sécurité, vous devez modifier le mot de passe temporaire fourni par l'administrateur Sharufa.
          </CardDescription>
        </CardHeader>

        <CardContent className="pb-10 pt-4">
          <form onSubmit={handleReset} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Nouveau mot de passe</Label>
              <Input 
                type="password" 
                required 
                placeholder="********"
                className="rounded-2xl border-slate-200 h-12 focus:ring-secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-1">Confirmer le mot de passe</Label>
              <Input 
                type="password" 
                required 
                placeholder="********"
                className="rounded-2xl border-slate-200 h-12 focus:ring-secondary"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100 mb-2">
               <ShieldAlert size={16} className="text-orange-500 shrink-0 mt-0.5" />
               <p className="text-[10px] font-bold text-orange-700 leading-tight">
                 Choisissez un mot de passe robuste combinant lettres, chiffres et caractères spéciaux.
               </p>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-primary text-secondary font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-primary/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Sécuriser mon compte"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
