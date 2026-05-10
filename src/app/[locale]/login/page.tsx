import Link from 'next/link'
import { Logo } from '@/components/ui/Logo'
import { login } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string; error?: string; next?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  
  return (
    <div className="relative h-screen w-full flex items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0 overflow-hidden">
      <div className="relative hidden h-full flex-col bg-primary p-12 text-white lg:flex border-r border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-[#0A192F]" />
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -ml-32 -mb-32" />

        <div className="relative z-20 flex items-center mb-20">
          <Link href="/" className="flex items-center gap-4 group">
            <Logo iconOnly className="w-16 h-16 transition-transform group-hover:scale-110" variant="dark" />
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase font-outfit">
              SHARUFA<span className="text-secondary">.COM</span>
            </h1>
          </Link>
        </div>

        <div className="relative z-20 space-y-10 max-w-xl">
          <div className="space-y-4">
             <h2 className="text-4xl font-black font-outfit leading-tight tracking-tight">
               Votre accès intelligent aux marchés de <span className="text-secondary italic">Dubaï</span>, <span className="text-secondary italic">Turquie</span> et <span className="text-secondary italic">Chine</span>.
             </h2>
             <p className="text-lg text-white/80 font-medium leading-relaxed italic">
               Sharufa connecte acheteurs, vendeurs et partenaires logistiques dans une seule plateforme pensée pour simplifier le commerce international.
             </p>
          </div>

          <div className="p-8 bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-sm space-y-6">
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-secondary italic">Ce que nous vous offrons :</h3>
             <ul className="grid grid-cols-1 gap-4">
                {[
                  "Marketplace multi-vendeurs internationale",
                  "Service Buy For Me pour le sourcing personnalisé",
                  "Réseau de partenaires cargo vérifiés",
                  "Suivi logistique en temps réel",
                  "Paiements sécurisés et gestion simplifiée",
                  "Accompagnement professionnel pour vendeurs et importateurs"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-white/90">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                    {item}
                  </li>
                ))}
             </ul>
          </div>

          <div className="space-y-6 pt-6">
             <p className="text-lg font-bold leading-relaxed">
               Achetez, vendez, sourcez et expédiez avec plus de sécurité, plus de transparence et un meilleur contrôle à chaque étape.
             </p>
             <p className="text-base text-white/70 leading-relaxed italic border-l-2 border-secondary/50 pl-6">
               &ldquo;Nous ne vendons pas seulement des produits. Nous construisons un écosystème fiable pour permettre aux entrepreneurs africains de commercer avec le monde en toute confiance.&rdquo;
             </p>
          </div>
        </div>

        <div className="relative z-20 mt-auto pt-10 border-t border-white/10 flex items-center justify-between">
           <div className="text-xs font-black uppercase tracking-widest text-secondary">
             Sharufa — Excellence en Commerce Global
           </div>
           <div className="flex gap-4">
              <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-secondary/40" />
              <div className="w-2 h-2 rounded-full bg-secondary/20" />
           </div>
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
