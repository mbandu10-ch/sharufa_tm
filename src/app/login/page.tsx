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
    <div className="container relative min-h-[calc(100vh-73px)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center gap-2">
            <Logo iconOnly className="w-10 h-10" variant="dark" />
            <span className="font-bold tracking-tight text-white uppercase text-xl font-outfit">
              SHARUFA<span className="text-secondary">.COM</span>
            </span>
          </Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;L'accès simplifié aux marchés de Dubaï, Turquie et Chine change la donne pour les entrepreneurs africains.&rdquo;
            </p>
            <footer className="text-sm">Abdoulaye K., Client Sharufa</footer>
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
