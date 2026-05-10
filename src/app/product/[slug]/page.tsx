import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Store, Globe, Package, ShieldCheck, Heart, Share2, Info, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ProductGallery from "@/components/product/ProductGallery"
import AddToCartButton from "@/components/product/AddToCartButton"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      shop: true,
      category: {
        include: {
          attributeTemplates: true
        }
      },
      originCountry: true,
    }
  })

  if (!product) {
    notFound()
  }

  // Fetch similar products
  const similarProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id }
    },
    include: { shop: true, originCountry: true, category: true },
    take: 4,
    orderBy: { createdAt: 'desc' }
  })

  const originCode = product.originCountry?.code || 'INT'
  const originFlag = product.originCountry?.flag || '🌍'

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-10">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <span>/</span>
          <Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
          <span>/</span>
          <Link href={`/marketplace?category=${product.category.slug}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Gallery */}
          <div className="relative">
            <ProductGallery images={product.images} name={product.name} />
          </div>

          {/* Right: Info */}
          <div className="space-y-10">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                <Badge className="bg-secondary/20 text-secondary border-none px-4 py-1.5 rounded-full font-black uppercase text-[10px] tracking-widest">
                  {product.category.name}
                </Badge>
                <div className="flex items-center gap-2 bg-muted px-4 py-1.5 rounded-full border border-border">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Origine : {originFlag} {product.originCountry?.name || 'International'}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-6xl font-outfit font-black text-primary tracking-tight leading-none">
                {product.name}
              </h1>

              <div className="flex items-center gap-8">
                 <div className="text-3xl md:text-5xl font-black text-primary">
                    {product.price.toFixed(2)} $
                 </div>
                 {product.stock > 0 ? (
                   <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-xl w-fit">
                        <Package size={16} /> {product.stock} en stock
                     </div>
                     {product.minOrderQuantity > 1 && (
                       <div className="flex items-center gap-2 text-secondary font-black text-[10px] bg-secondary/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-secondary/20 shadow-sm animate-pulse">
                          Commande minimum : {product.minOrderQuantity} unités
                       </div>
                     )}
                   </div>
                 ) : (
                   <div className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 px-4 py-2 rounded-xl">
                      Rupture de stock
                   </div>
                 )}
              </div>
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed italic">
              "{product.description.split('.')[0]}."
            </p>

            {/* Shop Box */}
            <Link 
              href={`/shop/${product.shop?.slug}`}
              className="group block p-6 bg-slate-50 rounded-[32px] border border-border hover:border-secondary hover:bg-white transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-2xl bg-white border border-border overflow-hidden shrink-0">
                      <img src={product.shop?.logo || 'https://via.placeholder.com/150'} alt="shop" className="w-full h-full object-cover" />
                   </div>
                   <div className="min-w-0">
                      <h4 className="font-outfit font-black text-primary text-xl uppercase tracking-tighter flex items-center gap-2 truncate">
                        {product.shop?.name}
                        {product.shop?.isVerified && (
                          <ShieldCheck size={18} className="text-secondary fill-secondary/10" />
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                        {product.shop?.isVerified ? (
                          <span className="text-secondary font-black">Vendeur Officiel Vérifié</span>
                        ) : (
                          "Vendeur Certifié Sharufa"
                        )}
                      </p>
                   </div>
                </div>
                <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center text-primary group-hover:bg-secondary group-hover:text-primary transition-colors shrink-0 self-end sm:self-auto">
                   <ArrowLeft size={20} className="rotate-180" />
                </div>
              </div>
            </Link>

            {/* Actions */}
            <div className="space-y-4 pt-6 border-t">
              <AddToCartButton 
                productId={product.id} 
                productName={product.name} 
                price={product.price}
                image={product.images[0]}
                shopName={product.shop?.name || 'Sharufa Store'}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="py-4 sm:py-6 rounded-2xl border-2 flex gap-2 font-bold group">
                   <Heart className="w-5 h-5 group-hover:fill-red-500 group-hover:text-red-500 transition-colors" /> Favoris
                </Button>
                <Button variant="outline" className="py-4 sm:py-6 rounded-2xl border-2 flex gap-2 font-bold">
                   <Share2 className="w-5 h-5 text-secondary" /> Partager
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Paiement 100% Sécurisé</div>
               </div>
               <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary shadow-sm">
                    <Globe size={20} />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary">Logistique Intégrée</div>
               </div>
            </div>
          </div>
        </div>

        {/* Long Description */}
        <section className="mt-32 space-y-12">
           <div className="flex items-center gap-4">
              <h2 className="text-2xl font-outfit font-black text-primary uppercase tracking-tight">Informations Détaillées</h2>
              <div className="flex-grow h-px bg-border" />
           </div>
           
           <div className="max-w-4xl prose prose-slate prose-lg">
              <div className="text-muted-foreground leading-loose text-lg whitespace-pre-line">
                 {product.description}
              </div>
           </div>
           
           {/* Caractéristiques Dynamiques */}
           {product.attributes && typeof product.attributes === 'object' && Object.keys(product.attributes as object).length > 0 && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-12">
               {Object.entries(product.attributes as Record<string, any>).map(([key, value]) => {
                 const template = (product.category as any).attributeTemplates?.find((t: any) => t.fieldKey === key)
                 const label = template?.label || key.charAt(0).toUpperCase() + key.slice(1)
                 
                 if (!value || (Array.isArray(value) && value.length === 0)) return null

                 return (
                   <div key={key} className="p-6 bg-slate-50 rounded-[24px] border border-border/50 hover:border-secondary/30 transition-colors">
                     <span className="block text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{label}</span>
                     <span className="text-lg font-bold text-primary">
                       {Array.isArray(value) ? value.join(', ') : value}
                     </span>
                   </div>
                 )
               })}
             </div>
           )}
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-secondary">
                    <Info size={18} />
                    <h5 className="font-black uppercase tracking-widest text-xs">Origine Certifiée</h5>
                 </div>
                 <p className="text-sm text-muted-foreground">{product.originCountry?.name} - Provenance vérifiée par nos agents locaux en Turquie/Dubai/Chine.</p>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-secondary">
                    <Package size={18} />
                    <h5 className="font-black uppercase tracking-widest text-xs">Achat Accompagné</h5>
                 </div>
                 <p className="text-sm text-muted-foreground">Chaque produit est inspecté avant l'expédition internationale pour garantir la conformité.</p>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-secondary">
                    <Store size={18} />
                    <h5 className="font-black uppercase tracking-widest text-xs">Vitesse d'expédition</h5>
                 </div>
                 <p className="text-sm text-muted-foreground">Généralement expédié sous 48h vers nos hubs logistiques locaux.</p>
              </div>
           </div>
        </section>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mt-32 space-y-12">
             <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <h2 className="text-3xl font-outfit font-black text-primary uppercase tracking-tight">Découvrir aussi</h2>
                  <p className="text-muted-foreground font-medium">D'autres articles de la catégorie {product.category.name}</p>
                </div>
                <Link href="/marketplace" className="text-xs font-black uppercase text-secondary tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                   Voir Plus <ArrowLeft size={14} className="rotate-180" />
                </Link>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               {similarProducts.map((sp) => (
                 <Link 
                   key={sp.id} 
                   href={`/product/${sp.slug}`}
                   className="group bg-background rounded-[32px] overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all"
                 >
                   <div className="relative aspect-square overflow-hidden">
                     <img 
                       src={sp.images[0]} 
                       alt={sp.name}
                       className="w-full h-full object-contain transition-transform duration-700"
                     />
                     <div className="absolute top-4 left-4 bg-white/90 px-3 py-1.5 rounded-full shadow-sm text-[10px] font-black">{sp.originCountry?.flag} {sp.originCountry?.code}</div>
                   </div>
                   <div className="p-6">
                      <h4 className="font-bold font-outfit text-primary line-clamp-1 mb-2">{sp.name}</h4>
                      <div className="flex items-center justify-between">
                         <span className="font-black text-primary">{sp.price.toFixed(2)} $</span>
                         <span className="text-[10px] font-bold text-muted-foreground uppercase">{sp.shop?.name}</span>
                      </div>
                   </div>
                 </Link>
               ))}
             </div>
          </section>
        )}
      </div>
    </div>
  )
}
