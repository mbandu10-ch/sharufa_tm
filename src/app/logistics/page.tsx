import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { 
  ArrowRight, Globe2, Plane, Ship, PackageCheck, 
  MapPin, ShieldCheck, Box, Layers, Users, 
  Briefcase, Boxes, Target, CheckCircle2,
  Clock
} from 'lucide-react'

export const metadata = {
  title: 'Sharufa Logistics | Votre Partenaire d\'Expédition Internationale',
  description: 'Votre passerelle logistique entre la Turquie, Dubaï, la Chine et vos destinations finales. Réception, contrôle, consolidation et expédition.',
}

export default function LogisticsPublicPage() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-secondary/30">
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:min-h-[90vh] flex items-center overflow-hidden bg-white">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-20">
            <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-black uppercase text-[10px] tracking-widest border border-secondary/20">
                <Globe2 size={14} /> Service International
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-6xl xl:text-7xl font-black text-primary tracking-tighter uppercase font-outfit leading-none">
                Sharufa <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-blue-600 block mt-2">Logistics</span>
              </h1>
              
              <h2 className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed">
                Votre passerelle logistique entre la Turquie, Dubaï, la Chine et vos destinations finales.
              </h2>
              
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Nous organisons la réception, le contrôle, la consolidation et l'expédition de vos produits avec une visibilité claire à chaque étape de la chaîne d'approvisionnement.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                 <Button asChild size="lg" className="h-16 px-10 rounded-full bg-primary hover:bg-slate-800 text-secondary text-lg font-black uppercase tracking-widest group shadow-2xl shadow-primary/20 transition-all hover:scale-105">
                   <Link href="/login">Commencer <ArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" /></Link>
                 </Button>
                 <Button asChild size="lg" variant="outline" className="h-16 px-10 rounded-full border-2 border-slate-200 hover:border-secondary hover:bg-secondary/5 text-primary text-lg font-black uppercase tracking-widest transition-all">
                   <Link href="#features">Découvrir</Link>
                 </Button>
              </div>
            </div>
            
            <div className="lg:w-1/2 w-full mt-10 lg:mt-0">
               <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square xl:aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl shadow-primary/10 border-4 border-slate-50 group">
                  <Image 
                    src="/images/logistics-hero.jpg" 
                    alt="Entrepôt Sharufa Logistics" 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" 
                    priority 
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent pointer-events-none mix-blend-multiply" />
                  
                  {/* Badge flottant sur l'image */}
                  <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-white/40 shadow-xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                     <div className="w-12 h-12 bg-secondary text-primary rounded-2xl flex items-center justify-center">
                        <Box size={24} className="animate-pulse" />
                     </div>
                     <div>
                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-500">Capacité de Stockage</p>
                        <p className="text-xl font-black text-primary">Haute Performance</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CE QUE NOUS GÉRONS (WHAT WE HANDLE) */}
      <section id="features" className="py-32 relative">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-20 space-y-4">
             <h3 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter italic">Ce que nous gérons pour vous</h3>
             <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Une infrastructure robuste pensée pour sécuriser vos importations internationales.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {[
                { icon: <MapPin size={28} />, title: "Réception Hubs", desc: "Centralisation de vos achats dans nos entrepôts sécurisés situés dans les pays d'origine professionnels." },
                { icon: <ShieldCheck size={28} />, title: "Contrôle Qualité", desc: "Vérification rigoureuse avant le départ des marchandises pour limiter les litiges et garantir la conformité." },
                { icon: <Globe2 size={28} />, title: "Fret International", desc: "Solutions d'expédition adaptées, couvrant les voies aériennes rapides et maritimes économiques." },
                { icon: <Target size={28} />, title: "Suivi en Temps Réel", desc: "Visibilité totale sur l'évolution de vos marchandises grâce à notre système de tracking intra-colis." },
                { icon: <Layers size={28} />, title: "Consolidation", desc: "Groupement stratégique de vos multiples colis en un lot unique pour optimiser drastiquement les coûts." },
                { icon: <PackageCheck size={28} />, title: "Liaison Finale", desc: "Un accompagnement structurel et opérationnel sans faille jusqu'au pays de destination prévu." }
             ].map((feature, i) => (
               <div key={i} className="group bg-white p-10 rounded-[40px] border-2 border-slate-100 hover:border-secondary transition-all hover:-translate-y-2 shadow-sm hover:shadow-2xl">
                 <div className="w-16 h-16 rounded-3xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 group-hover:scale-110 group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                   {feature.icon}
                 </div>
                 <h4 className="text-xl font-black text-primary uppercase mb-3">{feature.title}</h4>
                 <p className="text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* 3. COMMENT ÇA MARCHE (TIMELINE) */}
      <section className="py-32 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2" />
        
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <div className="text-center mb-24 space-y-4">
             <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">Comment ça marche</h3>
             <p className="text-lg text-white/60 font-medium max-w-2xl mx-auto">Un processus fluide, étape par étape, pour maîtriser votre chaîne logistique.</p>
          </div>

          <div className="relative border-l-4 border-secondary/20 ml-6 md:ml-10 space-y-16">
             {[
               { no: "1", title: "Sélection et Achat", desc: "Vous passez commande en ligne, depuis votre interface privée." },
               { no: "2", title: "Réception au Hub", desc: "Les produits sont acheminés et sécurisés physiquement dans le circuit Sharufa Logistic local." },
               { no: "3", title: "Inspection et Groupage", desc: "Si activé, nos équipes vérifient la qualité et consolident vos différents colis ensemble." },
               { no: "4", title: "Départ International", desc: "Vos lots consolidés embarquent vers le pays de destination selon le fret sélectionné." },
               { no: "5", title: "Passage et Transit", desc: "Vous suivez en direct la progression de chaque noeud d'expédition." },
               { no: "6", title: "Mise à Disposition", desc: "Les marchandises arrivent à destination final, prêtes à être récupérées en parfait état." }
             ].map((step, i) => (
                <div key={i} className="relative pl-12 md:pl-20">
                  <div className="absolute -left-[30px] top-0 w-14 h-14 rounded-full bg-primary border-4 border-secondary flex items-center justify-center text-xl font-black text-secondary shadow-[0_0_20px_rgba(var(--color-secondary),0.3)]">
                    {step.no}
                  </div>
                  <h4 className="text-2xl font-black uppercase text-white mb-2 italic tracking-tight">{step.title}</h4>
                  <p className="text-white/70 font-medium text-lg max-w-2xl leading-relaxed">{step.desc}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 4. NOS MODES D'EXPÉDITION */}
      <section className="py-32 bg-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="text-center mb-20 space-y-4">
             <h3 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter italic">Nos vecteurs de Fret</h3>
             <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Choisissez la vélocité et l'échelle adaptées à votre commerce.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
             {/* AIR */}
             <div className="bg-white p-12 rounded-[50px] border-2 border-slate-50 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-100 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-sky-200 transition-colors" />
                <div className="relative z-10">
                   <div className="w-20 h-20 rounded-[30px] bg-sky-500 flex items-center justify-center text-white mb-8 shadow-xl shadow-sky-500/20">
                     <Plane size={36} />
                   </div>
                   <h4 className="text-3xl font-black text-primary uppercase mb-4 tracking-tighter">Fret Aérien Express</h4>
                   <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
                     La solution ultime pour la réactivité. Accélérez vos réassorts et répondez aux demandes urgentes sur les commandes légères et stratégiques en un temps très court.
                   </p>
                   <ul className="space-y-4">
                     <li className="flex items-center gap-3 font-bold text-slate-700 italic"><CheckCircle2 className="text-sky-500" size={20} /> Vitesse Maximale garantie</li>
                     <li className="flex items-center gap-3 font-bold text-slate-700 italic"><CheckCircle2 className="text-sky-500" size={20} /> Orienté urgences & haute valeur</li>
                     <li className="flex items-center gap-3 font-bold text-slate-700 italic"><CheckCircle2 className="text-sky-500" size={20} /> Couverture internationale massive</li>
                   </ul>
                </div>
             </div>

             {/* SEA */}
             <div className="bg-white p-12 rounded-[50px] border-2 border-slate-50 shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-blue-200 transition-colors" />
                <div className="relative z-10">
                   <div className="w-20 h-20 rounded-[30px] bg-blue-800 flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-800/20">
                     <Ship size={36} />
                   </div>
                   <h4 className="text-3xl font-black text-primary uppercase mb-4 tracking-tighter">Fret Maritime Économique</h4>
                   <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">
                     L'infrastructure du commerce lourd. Le fret maritime rationalise vos coûts à l'unité de manière agressive pour le matériel encombrant et volumineux au mètre cube.
                   </p>
                   <ul className="space-y-4">
                     <li className="flex items-center gap-3 font-bold text-slate-700 italic"><CheckCircle2 className="text-blue-800" size={20} /> L'option la plus économique</li>
                     <li className="flex items-center gap-3 font-bold text-slate-700 italic"><CheckCircle2 className="text-blue-800" size={20} /> L'excellence pour le gros volume</li>
                     <li className="flex items-center gap-3 font-bold text-slate-700 italic"><CheckCircle2 className="text-blue-800" size={20} /> Stabilité des prix logistiques</li>
                   </ul>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 5 & 6. POUR QUI + SUIVI (BENTO GRID) */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Box 1: Pour Qui */}
              <div className="bg-slate-50 rounded-[50px] p-12 md:p-16">
                 <h3 className="text-3xl font-black text-primary uppercase tracking-tighter mb-8 italic">À qui s'adresse le réseau ?</h3>
                 <div className="space-y-6">
                    {[
                      { icon: <Users size={20}/>, text: "Particuliers s'approvisionnant à distance" },
                      { icon: <Briefcase size={20}/>, text: "Commerçants centralisant leurs achats lointains" },
                      { icon: <Box size={20}/>, text: "Vendeurs franchisés de l'écosystème Sharufa" },
                      { icon: <Globe2 size={20}/>, text: "Entrepreneurs internationaux (Trade Sans Déplacement)" },
                      { icon: <Layers size={20}/>, text: "Acheteurs industriels manipulant des volumes importants" }
                    ].map((target, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                         <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary shrink-0">
                           {target.icon}
                         </div>
                         <p className="font-bold text-slate-700">{target.text}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Box 2: Tracking */}
              <div className="bg-primary rounded-[50px] p-12 md:p-16 text-white relative overflow-hidden">
                 <div className="absolute right-0 bottom-0 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]" />
                 <div className="relative z-10">
                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-6 italic text-transparent bg-clip-text bg-gradient-to-r from-secondary to-white">
                      Visibilité Absolue
                    </h3>
                    <p className="text-white/80 font-medium text-lg leading-relaxed mb-10">
                      Rien n'est laissé dans l'ombre. Sharufa vous garde informé à l'instant T sur la position de votre capital. Une chronologie dématérialisée qui réinvente la paix d'esprit.
                    </p>
                    
                    <div className="space-y-6 border-l-2 border-secondary/30 ml-4 pl-8">
                       <div className="relative">
                          <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-secondary ring-4 ring-primary" />
                          <h4 className="font-black text-white uppercase tracking-wider">Lot Sécurisé au Hub</h4>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white ring-4 ring-primary" />
                          <h4 className="font-black text-white/50 uppercase tracking-wider">Transit Aérien/Maritime</h4>
                       </div>
                       <div className="relative">
                          <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white ring-4 ring-primary" />
                          <h4 className="font-black text-white/50 uppercase tracking-wider">Livraison Finale</h4>
                       </div>
                    </div>
                 </div>
              </div>

           </div>
        </div>
      </section>

      {/* 7. GROUPAGE & VOLUMES */}
      <section className="py-32 bg-slate-900 text-white overflow-hidden relative">
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
           <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 space-y-8">
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-black uppercase text-[10px] tracking-widest border border-secondary/20">
                    <Boxes size={14} /> Consolidation massive
                 </div>
                 <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight font-outfit">
                   Passez <span className="text-secondary italic">à l'échelle</span> du conteneur.
                 </h2>
                 <p className="text-xl text-white/70 font-medium leading-relaxed">
                   Vous avez l'ambition de déployer grand. Avec Sharufa Logistics, vos commandes multiples peuvent être retenues, empilées et consolidées dans un même lot d'expédition.
                 </p>
                 <p className="text-lg text-white/50 font-medium leading-relaxed">
                   Regroupez plusieurs achats stratégiques pour optimiser spectaculairement votre coût au volume, et concevez l'affrètement de Conteneurs Complets (FCL) sans exiger votre présence physique immédiate sur l'aire d'embarquement.
                 </p>
                 <div className="pt-4">
                   <Button size="lg" className="h-14 px-8 rounded-full bg-secondary text-primary font-black uppercase tracking-widest hover:bg-white hover:text-primary transition-all">
                      Préparer un Groupage
                   </Button>
                 </div>
              </div>
              <div className="lg:w-1/2 w-full">
                 <div className="aspect-square bg-slate-800 rounded-[50px] border border-slate-700 relative flex items-center justify-center overflow-hidden group shadow-2xl shadow-black/40">
                    <Image 
                      src="/images/logistics-container.jpg" 
                      alt="Chargement de conteneur de consolidation Sharufa" 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-[1.5s]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />
                    
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                       <div className="bg-slate-900/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                          <span className="text-white font-black uppercase tracking-widest text-sm">Gestion FCL/LCL</span>
                       </div>
                       <Boxes size={48} className="text-white/20" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 8. POURQUOI SHARUFA LOGISTICS */}
      <section className="py-32 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
           <div className="text-center mb-20 space-y-4">
             <h3 className="text-4xl md:text-5xl font-black text-primary uppercase tracking-tighter italic">Pourquoi faire appel à nous ?</h3>
             <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">Parce que l'importation ne devrait jamais être une source d'anxiété.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {[
               "Hubs de réception physiquement structurés",
               "Transparence logicielle sur les chargements",
               "Circuits d'audit et contrôles de douane",
               "Organisation commerciale 100% centralisée",
               "Canevas adapté aux marchés internationaux"
             ].map((txt, i) => (
                <div key={i} className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                   <CheckCircle2 size={24} className="text-secondary shrink-0" />
                   <p className="font-bold text-primary italic leading-tight">{txt}</p>
                </div>
             ))}
          </div>
        </div>
      </section>

      {/* 9. CTA FINAL */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-10">
             <h2 className="text-5xl md:text-7xl font-black text-primary uppercase tracking-tighter leading-tight font-outfit">
               Prêt à planifier votre <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-blue-600">Prochaine Voie ?</span>
             </h2>
             <p className="text-xl text-slate-500 font-medium leading-relaxed">
               Que vous importiez un lot unitaire rare, de vastes expéditions consolidées ou un chargement lourd, Sharufa vous offre l'armature logistique qu'il vous manquait pour la sérénité.
             </p>
             
             <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                 <Button asChild size="lg" className="h-16 px-12 rounded-full bg-secondary text-primary hover:bg-primary hover:text-secondary text-lg font-black uppercase tracking-widest transition-all scale-100 hover:scale-105 shadow-2xl">
                   <Link href="/seller">S'allier à Sharufa</Link>
                 </Button>
                 <Button asChild size="lg" variant="outline" className="h-16 px-12 rounded-full border-2 border-slate-200 hover:border-slate-800 text-slate-600 hover:text-primary text-lg font-black uppercase tracking-widest transition-all">
                   <Link href="/contact">Nous Contacter</Link>
                 </Button>
             </div>
          </div>
        </div>
      </section>
    </div>
  )
}
