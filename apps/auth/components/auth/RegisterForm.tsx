'use client'

import { useState } from 'react'
import { signup } from '@/auth/actions'
import { Button } from '@sharufa/ui/components/button'
import { Input } from '@sharufa/ui/components/input'
import { Label } from '@sharufa/ui/components/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@sharufa/ui/components/dialog'
import { CheckCircle2, Loader2, Mail } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface RegisterFormProps {
  next?: string
}

export function RegisterForm({ next }: RegisterFormProps) {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [password, setPassword] = useState('')
  const router = useRouter()

  const passwordRequirements = {
    length: password.length >= 8,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasUpper: /[A-Z]/.test(password),
  }

  const isPasswordValid = passwordRequirements.length && passwordRequirements.hasLetter && passwordRequirements.hasNumber
  const passwordStrength = [
    passwordRequirements.length,
    passwordRequirements.hasLetter,
    passwordRequirements.hasNumber,
    passwordRequirements.hasUpper
  ].filter(Boolean).length

  async function handleSubmit(formData: FormData) {
    setIsPending(true)
    setError(null)

    try {
      const result = await signup(formData)
      
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setShowSuccessDialog(true)
      }
    } catch (e) {
      setError("Une erreur inattendue est survenue. Veuillez réessayer.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <>
      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="next" value={next || '/dashboard'} />
        
        {error && (
          <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20 font-medium">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input id="firstName" name="firstName" placeholder="Jean" required className="rounded-xl" disabled={isPending} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input id="lastName" name="lastName" placeholder="Dupont" required className="rounded-xl" disabled={isPending} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email professionnel</Label>
          <Input id="email" name="email" type="email" placeholder="jean@entreprise.com" required className="rounded-xl" disabled={isPending} />
        </div>

        <div className="space-y-3">
          <Label htmlFor="password">Mot de passe</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
            className="rounded-xl h-12" 
            disabled={isPending} 
          />
          
          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex gap-1 h-1">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level}
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      passwordStrength >= level 
                        ? (passwordStrength <= 2 ? 'bg-orange-500' : passwordStrength === 3 ? 'bg-amber-400' : 'bg-emerald-500')
                        : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-y-2">
                <RequirementSet label="8+ caractères" met={passwordRequirements.length} />
                <RequirementSet label="Au moins une lettre" met={passwordRequirements.hasLetter} />
                <RequirementSet label="Au moins un chiffre" met={passwordRequirements.hasNumber} />
                <RequirementSet label="1 Majuscule (conseillé)" met={passwordRequirements.hasUpper} />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 text-sm text-muted-foreground py-2">
          <input type="checkbox" id="terms" required className="rounded border-gray-300 text-secondary focus:ring-secondary" disabled={isPending} />
          <label htmlFor="terms">J'accepte les Conditions d'Utilisation</label>
        </div>

        <Button 
          type="submit" 
          disabled={isPending || !isPasswordValid}
          className={`w-full text-primary-foreground font-black py-7 rounded-2xl shadow-xl transition-all uppercase text-xs tracking-widest ${
            isPasswordValid ? 'bg-primary hover:shadow-primary/20 hover:-translate-y-0.5' : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Création en cours...
            </>
          ) : (
            'Créer mon compte'
          )}
        </Button>
      </form>

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader className="flex flex-col items-center justify-center space-y-4 pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold font-outfit text-center">Compte créé !</DialogTitle>
            <DialogDescription className="text-center text-base">
              Un e-mail de confirmation premium vous a été envoyé à votre adresse.
              Veuillez cliquer sur le lien dans l'e-mail pour activer votre compte.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-xl border border-border/50">
            <Mail className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium italic">Vérifiez vos spams si vous ne le voyez pas.</span>
          </div>
          <DialogFooter className="sm:justify-center pb-6">
            <Button 
              type="button" 
              onClick={() => router.push('/login')}
              className="px-8 py-4 rounded-xl font-bold bg-primary"
            >
              Aller à la connexion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function RequirementSet({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${met ? 'bg-emerald-500' : 'bg-slate-300'}`} />
      <span className={`text-[10px] font-bold uppercase tracking-tight ${met ? 'text-primary' : 'text-slate-400'}`}>
        {label}
      </span>
    </div>
  )
}
