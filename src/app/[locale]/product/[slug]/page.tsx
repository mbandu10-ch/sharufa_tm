import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { Link } from "@/lib/i18n-navigation"
import { 
  ArrowLeft, 
  Store, 
  Globe, 
  Package, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Info,
  Calendar,
  Gauge,
  Fuel,
  Activity,
  Zap,
  MapPin,
  ShoppingBag
} from "lucide-react"
import { getProductSpecs, isVehicle as checkIsVehicle } from "@/lib/product-utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ProductGallery from "@/components/product/ProductGallery"
import ProductInteraction from "@/components/product/ProductInteraction"
import { cn } from "@/lib/utils"
import { getTranslations } from "next-intl/server"

export default async function ProductPage({ params }: { params: Promise<{ slug: string, locale: string }> }) {
  const { slug, locale } = await params
  const t = await getTranslations('ProductDetail')

  const productRaw = await prisma.product.findUnique({
    where: { slug },
    include: {
      shop: true,
      category: {
        include: {
          attributeTemplates: true,
          translations: { where: { locale } }
        }
      },
      originCountry: true,
      translations: { where: { locale } }
    }
  })

  if (!productRaw) {
    notFound()
  }

  const product = {
    ...productRaw,
    name: productRaw.translations[0]?.name || productRaw.name,
    description: productRaw.translations[0]?.description || productRaw.description,
    category: {
        ...productRaw.category,
        name: productRaw.category.translations[0]?.name || productRaw.category.name
    }
  }

  // Fetch similar products
  const similarProductsRaw = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      status: 'APPROVED'
    },
    include: { 
        shop: true, 
        originCountry: true, 
        category: {
            include: { translations: { where: { locale } } }
        },
        translations: { where: { locale } }
    },
    take: 4,
    orderBy: { createdAt: 'desc' }
  })

  const similarProducts = similarProductsRaw.map(p => ({
    ...p,
    name: p.translations[0]?.name || p.name,
    category: {
        ...p.category,
        name: p.category.translations[0]?.name || p.category.name
    }
  }))

  const originFlag = product.originCountry?.flag || '🌍'
  const attributes = (product.attributes as Record<string, any>) || {}
  
  // Check if it's a vehicle or has vehicle attributes
  const isVehicle = checkIsVehicle(product)
  const specs = getProductSpecs(attributes)

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-10">
          <Link href="/" className="hover:text-primary transition-colors">{t('home')}</Link>
          <span>/</span>
          <Link href="/marketplace" className="hover:text-primary transition-colors">{t('marketplace')}</Link>
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
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t('origin')} : {originFlag} {product.originCountry?.name || 'International'}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-6xl font-outfit font-black text-primary tracking-tight leading-none">
                {product.name}
              </h1>

              {/* Vehicle Quick Specs */}
              {isVehicle && specs && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-100">
                  {specs.year && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{t('year')}</span>
                      </div>
                      <span className="text-sm font-black text-primary">{specs.year}</span>
                    </div>
                  )}
                  {specs.mileage && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Gauge size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{t('mileage')}</span>
                      </div>
                      <span className="text-sm font-black text-primary">{Number(specs.mileage).toLocaleString()} km</span>
                    </div>
                  )}
                  {specs.fuel && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Fuel size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{t('fuel')}</span>
                      </div>
                      <span className="text-sm font-black text-primary">{specs.fuel}</span>
                    </div>
                  )}
                  {specs.transmission && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Activity size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">{t('transmission')}</span>
                      </div>
                      <span className="text-sm font-black text-primary">{specs.transmission}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-8">
                 <div className="text-3xl md:text-5xl font-black text-primary">
                    {product.price > 0 ? (
                      `$ ${product.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                    ) : (
                      t('price_on_request')
                    )}
                 </div>
                 {product.stock > 0 ? (
                   <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-xl w-fit">
                        <Package size={16} /> {t('in_stock', { count: product.stock })}
                     </div>
                     {product.minOrderQuantity > 1 && (
                       <div className="flex items-center gap-2 text-secondary font-black text-[10px] bg-secondary/10 px-4 py-1.5 rounded-full uppercase tracking-widest border border-secondary/20 shadow-sm animate-pulse">
                          {t('min_order', { count: product.minOrderQuantity })}
                       </div>
                     )}
                   </div>
                 ) : (
                   <div className="flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 px-4 py-2 rounded-xl">
                      {t('out_of_stock')}
                   </div>
                 )}
              </div>
            </div>

            <p className="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-secondary/30 pl-6 py-2">
              &quot;{product.description.split('.')[0]}.&quot;
            </p>

            {/* Shop Box */}
            <Link 
              href={`/shop/${product.shop?.slug}`}
              className="group block p-6 bg-slate-50 rounded-[32px] border border-border hover:border-secondary hover:bg-white transition-all shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="w-16 h-16 rounded-2xl bg-white border border-border overflow-hidden shrink-0 relative">
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
                          <span className="text-secondary font-black">{t('verified_seller')}</span>
                        ) : (
                          t('certified_seller')
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
              <ProductInteraction product={product} />
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="py-4 sm:py-6 rounded-2xl border-2 flex gap-2 font-bold group">
                   <Heart className="w-5 h-5 group-hover:fill-red-500 group-hover:text-red-500 transition-colors" /> {t('favorites')}
                </Button>
                <Button variant="outline" className="py-4 sm:py-6 rounded-2xl border-2 flex gap-2 font-bold">
                   <Share2 className="w-5 h-5 text-secondary" /> {t('share')}
                </Button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary shadow-sm">
                    <ShieldCheck size={20} />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary">{t('secure_payment')}</div>
               </div>
               <div className="p-4 bg-muted/30 rounded-2xl border border-border flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-secondary shadow-sm">
                    <Globe size={20} />
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-primary">{t('integrated_logistics')}</div>
               </div>
            </div>

            {/* Premium Buy For Me CTA */}
            <div className="bg-primary rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl">
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-secondary rounded-full blur-[80px] opacity-20 group-hover:scale-150 transition-transform duration-1000" />
               <div className="relative z-10 space-y-6">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center text-secondary">
                        <ShoppingBag size={20} />
                     </div>
                     <h4 className="text-xl font-outfit font-black uppercase tracking-tight">
                        {t('need_sourcing').split(' ')[0]} <span className="text-secondary italic">{t('need_sourcing').split(' ').slice(1).join(' ')}</span>
                     </h4>
                  </div>
                  <p className="text-sm text-primary-foreground/60 leading-relaxed font-medium">
                     {t('sourcing_desc')}
                  </p>
                  <Link 
                    href="/buy-for-me"
                    className="flex items-center justify-between w-full py-4 px-6 bg-secondary text-primary font-black rounded-2xl hover:bg-white transition-all uppercase text-xs tracking-widest group/btn"
                  >
                     {t('request_sourcing')}
                     <ArrowLeft size={18} className="rotate-180 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
               </div>
            </div>
          </div>
        </div>

        {/* Long Description */}
        <section className="mt-32 space-y-12">
           <div className="flex items-center gap-4">
              <h2 className="text-2xl font-outfit font-black text-primary uppercase tracking-tight italic">{t('technical_specs')}</h2>
              <div className="flex-grow h-px bg-border" />
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2 prose prose-slate prose-lg">
                <div className="text-muted-foreground leading-loose text-lg whitespace-pre-line">
                   {product.description}
                </div>
              </div>

              {/* Sidebar Attributes */}
              <div className="space-y-6">
                {product.attributes && typeof product.attributes === 'object' && Object.keys(product.attributes as object).length > 0 && (
                  <div className="bg-slate-50 rounded-[40px] p-10 border border-slate-100 space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/40 italic">{t('technical_specs')}</h3>
                    <div className="space-y-6">
                      {Object.entries(product.attributes as Record<string, unknown>).map(([key, value]) => {
                        const template = product.category.attributeTemplates?.find((t) => t.fieldKey === key)
                        const label = template?.label || key.charAt(0).toUpperCase() + key.slice(1)
                        
                        if (!value || (Array.isArray(value) && value.length === 0)) return null

                        return (
                          <div key={key} className="flex flex-col gap-1 border-b border-slate-200/50 pb-4 last:border-0">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
                            <span className="text-sm font-bold text-primary">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t">
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-secondary">
                    <Info size={18} />
                    <h5 className="font-black uppercase tracking-widest text-xs">{t('certified_origin')}</h5>
                 </div>
                 <p className="text-sm text-muted-foreground">{t('certified_origin_desc', { country: product.originCountry?.name || "" })}</p>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-secondary">
                    <Package size={18} />
                    <h5 className="font-black uppercase tracking-widest text-xs">{t('accompanied_purchase')}</h5>
                 </div>
                  <p className="text-sm text-muted-foreground">{t('accompanied_purchase_desc')}</p>
              </div>
              <div className="space-y-4">
                 <div className="flex items-center gap-2 text-secondary">
                    <Store size={18} />
                    <h5 className="font-black uppercase tracking-widest text-xs">{t('shipping_speed')}</h5>
                 </div>
                  <p className="text-sm text-muted-foreground">{t('shipping_speed_desc')}</p>
              </div>
           </div>
        </section>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <section className="mt-32 space-y-12">
             <div className="flex justify-between items-end">
                <div className="space-y-2">
                   <h2 className="text-3xl font-outfit font-black text-primary uppercase tracking-tight">{t('discover_also')}</h2>
                   <p className="text-muted-foreground font-medium">{t('other_items_category', { category: product.category.name })}</p>
                </div>
                <Link href="/marketplace" className="text-xs font-black uppercase text-secondary tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                   {t('see_more')} <ArrowLeft size={14} className="rotate-180" />
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
                        <h4 className="font-bold font-outfit text-primary line-clamp-1 mb-1">{sp.name}</h4>
                        {(sp.attributes as any)?.mileage && (
                           <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground mb-2">
                             <Gauge size={10} className="text-secondary" />
                             <span>{(sp.attributes as any).mileage} km</span>
                           </div>
                        )}
                        <div className="flex items-center justify-between">
                           <span className="font-black text-primary">$ {sp.price.toLocaleString()}</span>
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
