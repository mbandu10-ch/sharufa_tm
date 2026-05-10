import Link from 'next/link'
import { Logo } from '@sharufa/ui/components/Logo'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@sharufa/ui/components/card'
import { ShieldCheck, Truck, Globe } from 'lucide-react'
import { RegisterForm } from '@components/auth/RegisterForm'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>
}) {
  const resolvedSearchParams = await searchParams;

  return (
    <div className="container relative min-h-[calc(100vh-73px)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <Card className="border-none shadow-none lg:border lg:shadow-sm">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-3xl font-bold font-outfit text-primary">Créer un compte</CardTitle>
              <CardDescription>
                Rejoignez la première plateforme de commerce international premium
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RegisterForm next={resolvedSearchParams?.next} />
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground font-medium">
                Déjà membre ?{' '}
                <Link 
                  href={`/login${resolvedSearchParams?.next ? `?next=${resolvedSearchParams.next}` : ''}`} 
                  className="text-secondary font-bold hover:underline"
                >
                  Se connecter
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-l">
        <div className="absolute inset-0 bg-primary" />
        <div className="relative z-20 space-y-12">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Logo iconOnly className="w-10 h-10 group-hover:scale-110 transition-transform" variant="dark" />
            <span className="font-bold tracking-tight text-white uppercase text-xl font-outfit">
              SHARUFA<span className="text-secondary">.COM</span>
            </span>
          </Link>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold font-outfit text-secondary italic">Pourquoi Sharufa ?</h3>
            <p className="text-primary-foreground/70">La solution complète pour vos besoins d'import-export.</p>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <Globe className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-bold">Réseau Mondial</h4>
                <p className="text-sm text-primary-foreground/60">Dubai, Turquie et Chine à portée de clic.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-bold">Transactions Protégées</h4>
                <p className="text-sm text-primary-foreground/60">Vos fonds sont sécurisés jusqu'à la livraison.</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                <Truck className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h4 className="font-bold">Logistique Intégrée</h4>
                <p className="text-sm text-primary-foreground/60">Suivi en temps réel de vos expéditions.</p>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/10">
            <p className="text-sm text-primary-foreground/50 border-white/10 italic">
              "Notre mission est de digitaliser le commerce informel et de professionnaliser les échanges internationaux pour l'Afrique."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
