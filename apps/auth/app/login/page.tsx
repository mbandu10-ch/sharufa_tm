import Link from 'next/link'
import { Globe, ShieldCheck, Truck, Wallet } from 'lucide-react'
import { Logo } from '@sharufa/ui/components/Logo'
import { login } from '@/auth/actions'
import { Button } from '@sharufa/ui/components/button'
import { Input } from '@sharufa/ui/components/input'
import { Label } from '@sharufa/ui/components/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sharufa/ui/components/card'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string; next?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <div className="container relative min-h-[calc(100vh-73px)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center gap-2">
            <Logo iconOnly className="w-7 h-7" variant="dark" />
            <span className="font-bold tracking-tight text-white uppercase text-xl font-outfit">
              SHARUFA<span className="text-secondary">.COM</span>
            </span>
          </Link>
        </div>

        <div className="relative z-20 mt-12 space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black font-outfit uppercase tracking-tight text-white">
              Votre pont vers le <span className="text-secondary">Commerce Mondial</span>
            </h2>
            <p className="text-white/70 text-lg font-medium max-w-[400px]">
              La première marketplace qui connecte directement l'Afrique aux hubs de sourcing mondiaux.
            </p>
          </div>

          <div className="grid gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <Globe className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase text-sm tracking-wider">Sourcing Direct</h3>
                <p className="text-white/60 text-sm">Achetez à la source : Dubaï, Turquie et Chine.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <ShieldCheck className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase text-sm tracking-wider">Fournisseurs Vérifiés</h3>
                <p className="text-white/60 text-sm">Sécurité totale avec des boutiques auditées.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <Truck className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase text-sm tracking-wider">Logistique Cargo</h3>
                <p className="text-white/60 text-sm">Expédition simplifiée vers toute l'Afrique.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                <Wallet className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h3 className="font-bold text-white uppercase text-sm tracking-wider">Paiements Locaux</h3>
                <p className="text-white/60 text-sm">Payez en toute simplicité dans votre devise.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2 border-l-4 border-secondary pl-6">
            <p className="text-lg italic text-white/90">
              &ldquo;L'accès simplifié aux marchés de Dubaï, Turquie et Chine change la donne pour les entrepreneurs africains.&rdquo;
            </p>
            <footer className="text-sm font-bold uppercase tracking-widest text-secondary">Abdoulaye K., Client Sharufa</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <Card className="border-none shadow-none lg:border lg:shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold font-outfit text-primary">Connexion</CardTitle>
              <CardDescription>
                Entrez vos identifiants pour accéder à votre espace Sharufa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={login as any} className="space-y-4">
                <input type="hidden" name="next" value={resolvedSearchParams?.next || '/dashboard'} />
                {resolvedSearchParams?.error && (
                  <div className="p-3 text-sm bg-destructive/10 text-destructive rounded-lg border border-destructive/20 font-medium">
                    {resolvedSearchParams.error}
                  </div>
                )}
                {resolvedSearchParams?.message && (
                  <div className="p-3 text-sm bg-emerald-500/10 text-emerald-600 rounded-lg border border-emerald-500/20 font-medium">
                    {resolvedSearchParams.message}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="nom@exemple.com" required className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Link href="/forgot-password" className="text-xs text-secondary hover:underline">Mot de passe oublié ?</Link>
                  </div>
                  <Input id="password" name="password" type="password" required className="rounded-xl" />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground font-bold py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  Se connecter
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link href="/register" className="text-secondary font-bold hover:underline">
                  S'inscrire gratuitement
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
