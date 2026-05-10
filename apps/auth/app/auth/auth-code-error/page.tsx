import Link from 'next/link'
import { Button } from '@sharufa/ui/components/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sharufa/ui/components/card'
import { AlertCircle, ArrowLeft } from 'lucide-react'

export default function AuthCodeErrorPage() {
  return (
    <div className="container relative min-h-[calc(100vh-73px)] flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
        <Card className="border-none shadow-2xl bg-white rounded-[40px] overflow-hidden">
          <CardHeader className="space-y-4 pt-12 px-12 pb-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
                <AlertCircle size={40} />
              </div>
            </div>
            <CardTitle className="text-3xl font-black font-outfit text-primary italic uppercase tracking-tighter">Erreur d'Authentification</CardTitle>
            <CardDescription className="text-base font-bold text-slate-600 px-4">
              Le lien de confirmation est invalide, a expiré, ou une restriction technique empêche la connexion.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-12 text-center text-sm text-muted-foreground">
            <p>Cela peut arriver si vous avez déjà utilisé ce lien ou si trop de temps s'est écoulé.</p>
            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-medium italic">
              Note : Si le problème persiste, contactez le support technique de Sharufa.
            </div>
          </CardContent>
          <CardFooter className="pb-12 pt-6 flex flex-col gap-4 px-12">
            <Button asChild className="w-full rounded-2xl py-7 bg-primary text-white font-black uppercase text-xs tracking-widest shadow-xl hover:shadow-2xl transition-all">
              <Link href="/login">Retour à la connexion</Link>
            </Button>
            <Link href="/" className="inline-flex items-center justify-center text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-3 w-3" />
              Retour à l'accueil
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
