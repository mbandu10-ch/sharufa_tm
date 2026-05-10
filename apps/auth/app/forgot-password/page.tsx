'use client'

import React from 'react'
import Link from 'next/link'
import { Logo } from '@sharufa/ui/components/Logo'
import { requestPasswordReset } from '@/auth/actions'
import { Button } from '@sharufa/ui/components/button'
import { Input } from '@sharufa/ui/components/input'
import { Label } from '@sharufa/ui/components/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sharufa/ui/components/card'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    const res = await requestPasswordReset(formData)
    setIsSubmitting(false)

    if (res?.error) {
      toast.error(res.error)
    } else {
      setIsSuccess(true)
      toast.success(res?.message || 'Demande envoyée avec succès.')
    }
  }

  return (
    <div className="container relative min-h-[calc(100vh-73px)] flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <Link 
          href="/login" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à la connexion
        </Link>

        {isSuccess ? (
          <Card className="border-none shadow-xl bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="text-center pt-12 pb-6">
              <div className="flex justify-center mb-6">
                 <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-inner">
                    <CheckCircle2 size={40} />
                 </div>
              </div>
              <CardTitle className="text-2xl font-black font-outfit text-primary italic uppercase tracking-tighter">Email Envoyé !</CardTitle>
              <CardDescription className="px-6 text-sm font-medium mt-2">
                Si un compte existe pour cette adresse, vous recevrez un lien de réinitialisation d'ici quelques instants.
              </CardDescription>
            </CardHeader>
            <CardFooter className="pb-12 pt-0 flex justify-center">
              <Button asChild className="rounded-xl px-8 py-6 h-auto bg-primary text-white font-bold uppercase text-xs tracking-widest shadow-lg hover:shadow-xl transition-all">
                <Link href="/login">Retour à l'accueil</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="border-none shadow-xl bg-white rounded-[32px] overflow-hidden">
            <CardHeader className="space-y-4 pt-10 px-10 pb-8 text-center">
              <div className="flex justify-center mb-2">
                <Logo className="w-12 h-12" />
              </div>
              <div>
                <CardTitle className="text-3xl font-black font-outfit text-primary italic uppercase tracking-tighter">Mot de passe oublié ?</CardTitle>
                <CardDescription className="text-sm font-medium mt-2">
                  Pas de panique. Saisissez votre adresse e-mail et nous vous enverrons un lien pour sécuriser à nouveau votre compte.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-10">
              <form action={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Adresse E-mail</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="votre@email.com" 
                    required 
                    className="rounded-2xl py-7 px-6 bg-slate-50 border-none text-primary font-bold placeholder:text-muted-foreground/30 focus:ring-secondary/50" 
                  />
                </div>
                <Button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="w-full bg-primary text-primary-foreground font-black py-7 rounded-2xl shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all uppercase text-[11px] tracking-[0.2em]"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien de secours'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="pb-10 pt-6 flex justify-center border-t border-slate-50">
              <div className="text-sm text-center text-muted-foreground font-medium grayscale opacity-50">
                Sharufa Security • Protection des données
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
