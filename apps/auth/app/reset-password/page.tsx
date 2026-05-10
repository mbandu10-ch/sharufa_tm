'use client'

import React from 'react'
import Link from 'next/link'
import { Logo } from '@sharufa/ui/components/Logo'
import { updatePassword } from '@/auth/actions'
import { Button } from '@sharufa/ui/components/button'
import { Input } from '@sharufa/ui/components/input'
import { Label } from '@sharufa/ui/components/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sharufa/ui/components/card'
import { CheckCircle2, Lock, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const router = useRouter()

  const passwordRequirements = {
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasUpper: /[A-Z]/.test(password),
  }

  const isPasswordValid = passwordRequirements.length && passwordRequirements.hasLetter && passwordRequirements.hasNumber
  const passwordsMatch = password === confirmPassword && password !== ''
  const canSubmit = isPasswordValid && passwordsMatch

  const passwordStrength = [
    passwordRequirements.length,
    passwordRequirements.hasLetter,
    passwordRequirements.hasNumber,
    passwordRequirements.hasUpper
  ].filter(Boolean).length

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    const res = await updatePassword(formData)
    setIsSubmitting(false)

    if (res?.error) {
      toast.error(res.error)
    } else {
      setIsSuccess(true)
      toast.success(res?.message || 'Mot de passe mis à jour.')
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  }

  return (
    <div className="container relative min-h-[calc(100vh-73px)] flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        
        {isSuccess ? (
          <Card className="border-none shadow-2xl bg-white rounded-[40px] overflow-hidden p-12 text-center">
            <div className="flex justify-center mb-8">
               <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 shadow-inner animate-bounce">
                  <CheckCircle2 size={48} />
               </div>
            </div>
            <CardTitle className="text-3xl font-black font-outfit text-primary italic uppercase tracking-tighter mb-4">Succès !</CardTitle>
            <CardDescription className="text-base font-bold text-slate-600 mb-8 px-4">
              Votre mot de passe a été modifié avec succès. Vous allez être redirigé vers la page de connexion.
            </CardDescription>
            <Button asChild className="rounded-2xl px-10 py-7 h-auto bg-primary text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all">
              <Link href="/login">Se connecter maintenant</Link>
            </Button>
          </Card>
        ) : (
          <Card className="border-none shadow-2xl bg-white rounded-[40px] overflow-hidden">
            <CardHeader className="space-y-4 pt-12 px-12 pb-10 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div className="flex justify-center mb-4 relative z-10">
                <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center text-primary">
                  <Lock size={32} />
                </div>
              </div>
              <div className="relative z-10">
                <CardTitle className="text-3xl font-black font-outfit text-primary italic uppercase tracking-tighter">Nouveau mot de passe</CardTitle>
                <CardDescription className="text-sm font-bold mt-2 text-slate-500 italic uppercase tracking-widest bg-slate-50 inline-block px-4 py-1 rounded-full">
                  Étape finale de sécurité
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-12 pb-10">
              <form action={handleSubmit} className="space-y-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nouveau mot de passe</Label>
                    <Input 
                      id="password" 
                      name="password" 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                      className="rounded-2xl py-7 px-8 bg-slate-50 border-none text-primary font-black placeholder:text-muted-foreground/20 focus:ring-secondary/50 shadow-inner" 
                      placeholder="••••••••"
                    />
                  </div>

                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <div className="space-y-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <div className="flex gap-1.5 h-1.5">
                        {[1, 2, 3, 4].map((level) => (
                          <div 
                            key={level}
                            className={`flex-1 rounded-full transition-all duration-700 ${
                              passwordStrength >= level 
                                ? (passwordStrength <= 2 ? 'bg-orange-500' : passwordStrength === 3 ? 'bg-amber-400' : 'bg-emerald-500')
                                : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      
                      <div className="grid grid-cols-1 gap-y-2.5">
                        <RequirementItem label="8 caractères minimum" met={passwordRequirements.length} />
                        <RequirementItem label="Contient au moins une lettre" met={passwordRequirements.hasLetter} />
                        <RequirementItem label="Contient au moins un chiffre" met={passwordRequirements.hasNumber} />
                        <RequirementItem label="Majuscule conseillée" met={passwordRequirements.hasUpper} />
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Confirmer le mot de passe</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required 
                      className="rounded-2xl py-7 px-8 bg-slate-50 border-none text-primary font-black placeholder:text-muted-foreground/20 focus:ring-secondary/50 shadow-inner" 
                      placeholder="••••••••"
                    />
                    {confirmPassword.length > 0 && !passwordsMatch && (
                      <p className="text-[10px] font-bold text-destructive uppercase tracking-widest ml-1 pt-1 animate-pulse">
                        Les mots de passe ne correspondent pas
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100/50 flex items-start gap-4 italic mb-2">
                   <ShieldCheck className="text-amber-500 shrink-0" size={20} />
                   <p className="text-[11px] font-bold text-amber-800 leading-relaxed uppercase tracking-tight">
                      Utilisez au moins 8 caractères, un mélange de lettres et de chiffres pour une sécurité optimale.
                   </p>
                </div>

                <Button 
                  disabled={isSubmitting || !canSubmit}
                  type="submit" 
                  className={`w-full text-primary-foreground font-black py-8 rounded-2xl shadow-2xl transition-all uppercase text-xs tracking-[0.3em] ${
                    canSubmit ? 'bg-primary shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1' : 'bg-slate-300 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isSubmitting ? 'Mise à jour...' : 'Sécuriser mon compte'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="pb-10 pt-6 flex justify-center bg-slate-50/50 border-t border-slate-100">
               <div className="flex items-center gap-2 grayscale brightness-50 opacity-40">
                  <Logo className="w-6 h-6" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Sharufa Security Protocol</span>
               </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

function RequirementItem({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${met ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-300'}`} />
      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${met ? 'text-primary' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  )
}
