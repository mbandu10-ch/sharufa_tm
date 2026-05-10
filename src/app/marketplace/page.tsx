import Link from 'next/link'
import { Search, Filter, MapPin, Star, ArrowRight, Store, ShoppingBag, Package, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { prisma } from '@/lib/prisma'
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters'
import { CategorySidebar } from '@/components/marketplace/CategorySidebar'
import { cn } from '@/lib/utils'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { GroupGrid } from '@/components/marketplace/GroupGrid'
import { MarketplaceBreadcrumbs } from '@/components/marketplace/Breadcrumbs'
import { ShopFilters } from '@/components/marketplace/ShopFilters'
import { ShopGrid } from '@/components/marketplace/ShopGrid'
import { CountryCard } from '@/components/home/CountryCard'

export default async function MarketplacePage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string; view?: string; category?: string; country?: string; group?: string; item?: string; shopType?: string; tab?: string }> 
}) {
  const params = await searchParams
  const query = params.q || ''
  const currentView = params.view || 'products'
  const isCountriesTab = params.tab === 'countries' || currentView === 'countries'
  const categorySlug = params.category
  const countryCode = params.country
  const groupSlug = params.group
  const itemSlug = params.item
  const shopType = params.shopType

  // 1. Handle Categories & Recursive Filtering
  let targetCategoryIds: string[] = []
  
  // Phase 3 Mapping: Group -> Item -> Categories
  if (groupSlug) {
    const group = NAVIGATION_GROUPS.find(g => g.id === groupSlug)
    if (group) {
      let slugsToFetch: string[] = []
      if (itemSlug) {
        const item = group.items.find(i => i.id === itemSlug)
        if (item) slugsToFetch = item.categorySlugs
      } else {
        // All categories in the group
        slugsToFetch = Array.from(new Set(group.items.flatMap(i => i.categorySlugs)))
      }

      if (slugsToFetch.length > 0) {
        const navCategories = await prisma.category.findMany({
          where: { slug: { in: slugsToFetch } }
        })
        targetCategoryIds = navCategories.map(c => c.id)
      }
    }
  } else if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: { subCategories: true }
    })
    
    if (category) {
      targetCategoryIds = [category.id, ...category.subCategories.map(s => s.id)]
    }
  }
  
  // 1.5 Intelligent Group/Univers Detection from Search Query
  if (query && !groupSlug && !itemSlug && !categorySlug) {
    const normalizedQuery = query.toLowerCase().trim()
    const matchingGroup = NAVIGATION_GROUPS.find(g => 
      g.name.toLowerCase().includes(normalizedQuery) || 
      normalizedQuery.includes(g.name.toLowerCase())
    )

    if (matchingGroup) {
      const groupCategorySlugs = Array.from(new Set(matchingGroup.items.flatMap(i => i.categorySlugs)))
      const matchedNavCategories = await prisma.category.findMany({
        where: { slug: { in: groupCategorySlugs } }
      })
      const groupCategoryIds = matchedNavCategories.map(c => c.id)
      
      // Merge with targetCategoryIds
      targetCategoryIds = Array.from(new Set([...targetCategoryIds, ...groupCategoryIds]))
    }
  }

  const countries = await prisma.country.findMany({ where: { active: true } })
  const selectedCountry = countries.find(c => c.code === countryCode)
  const countryName = selectedCountry?.name

  // 2. Fetch Products
  const products = await prisma.product.findMany({
    where: {
      status: 'APPROVED',
      shop: {
        status: 'APPROVED',
        isVisible: true
      },
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { category: { name: { contains: query, mode: 'insensitive' } } },
        { shop: { name: { contains: query, mode: 'insensitive' } } },
        { originCountry: { name: { contains: query, mode: 'insensitive' } } },
        { originCountry: { code: { contains: query, mode: 'insensitive' } } }
      ],
      ...(targetCategoryIds.length > 0 ? { categoryId: { in: targetCategoryIds } } : (groupSlug || categorySlug ? { categoryId: { in: ['none'] } } : {})),
      ...(countryCode && { originCountry: { code: countryCode } })
    },
    include: {
      shop: true,
      originCountry: true,
      category: true
    },
    orderBy: { createdAt: 'desc' },
    take: 24
  })

  // 3. Fetch Shops
  const shops = await prisma.shop.findMany({
    where: {
      status: 'APPROVED',
      isVisible: true,
      ...(countryCode === 'AE' ? {
        OR: [
          { country: { contains: 'Émirats', mode: 'insensitive' } },
          { country: { contains: 'UAE', mode: 'insensitive' } },
          { country: { contains: 'Emirates', mode: 'insensitive' } },
          { country: { contains: 'Dubai', mode: 'insensitive' } }
        ]
      } : countryName ? { country: countryName } : {}),
      ...(shopType === 'WHOLESALE' ? { type: 'WHOLESALE_STORE' } : shopType === 'RETAIL' ? { type: { not: 'WHOLESALE_STORE' } } : {}),
      ...(targetCategoryIds.length > 0 && {
        products: {
          some: {
            categoryId: { in: targetCategoryIds },
            status: 'APPROVED'
          }
        }
      }),
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { products: {
            some: {
                category: { name: { contains: query, mode: 'insensitive' } }
            }
        }}
      ]
    },
    include: {
      _count: {
        select: { products: { where: { status: 'APPROVED' } } }
      },
      products: { 
        where: { 
          status: 'APPROVED',
          ...(targetCategoryIds.length > 0 ? { categoryId: { in: targetCategoryIds } } : (groupSlug || categorySlug ? { categoryId: { in: ['none'] } } : {}))
        },
        take: 3 
      }
    },
    take: 12
  })

  // 4. Hierarchical categories for Sidebar (Removed legacy fetching)

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Search Header - Dynamic Height based on filter status */}
      <section className={cn(
        "bg-primary pt-20 pb-12 md:pt-32 md:pb-24 text-white relative overflow-hidden transition-all duration-700",
        (groupSlug || categorySlug) && "pt-16 pb-8 md:pt-24 md:pb-16"
      )}>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 skew-x-12 transform translate-x-1/2" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-secondary text-primary font-black px-6 py-2 rounded-full uppercase tracking-widest text-xs">
              Sourcing & Marketplace
            </Badge>
            <h1 className="text-4xl md:text-7xl font-outfit font-black tracking-tight leading-none">
              Trouvez l'excellence <br/><span className="text-secondary italic">partout dans le monde.</span>
            </h1>
            <p className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto font-medium">
              Explorez les meilleures pépites de Dubaï, Turquie et Chine sélectionnées par nos experts.
            </p>
            
            <form action="/marketplace" method="GET" className="flex flex-col md:flex-row gap-4 bg-white/10 p-2 rounded-[32px] backdrop-blur-xl border border-white/20 shadow-2xl">
              <input type="hidden" name="view" value={currentView} />
              <div className="flex-grow flex items-center px-6 gap-3">
                <Search className="text-secondary w-6 h-6" />
                <input 
                  name="q"
                  type="text" 
                  placeholder="Que recherchez-vous aujourd'hui ?" 
                  defaultValue={query}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 w-full py-3 md:py-5 text-base md:text-lg text-white placeholder:text-white/40"
                />
              </div>
              <Button type="submit" className="bg-secondary text-primary font-black px-8 py-6 md:px-12 md:py-8 rounded-3xl hover:bg-white transition-all text-base md:text-lg shadow-lg">
                Explorer
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Tabs & Filters Navigation */}
      <div className="container mx-auto px-4 -mt-10 relative z-20">
        <Tabs key={currentView} defaultValue={currentView} className="w-full">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-background rounded-[40px] p-4 shadow-2xl border border-border">
            <TabsList className="bg-muted/50 p-1.5 rounded-3xl h-auto flex-wrap sm:flex-nowrap justify-center gap-2">
              <Link href={`/marketplace?view=products&q=${query}`} scroll={false}>
                <TabsTrigger value="products" className="rounded-2xl px-4 py-3 sm:px-8 sm:py-4 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase text-[10px] sm:text-xs tracking-widest flex gap-2">
                  <Package size={16} /> Produits
                </TabsTrigger>
              </Link>
              <Link href={`/marketplace?view=shops&q=${query}`} scroll={false}>
                <TabsTrigger value="shops" className="rounded-2xl px-4 py-3 sm:px-8 sm:py-4 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase text-[10px] sm:text-xs tracking-widest flex gap-2">
                  <Store size={16} /> Boutiques
                </TabsTrigger>
              </Link>
              <Link href={`/marketplace?view=countries&q=${query}`} scroll={false}>
                <TabsTrigger value="countries" className="rounded-2xl px-4 py-3 sm:px-8 sm:py-4 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase text-[10px] sm:text-xs tracking-widest flex gap-2">
                  <Globe size={16} /> Destinations
                </TabsTrigger>
              </Link>
            </TabsList>

            <MarketplaceFilters 
              countries={countries.map(c => ({ id: c.id, name: c.name, code: c.code, flag: c.flag }))} 
            />
          </div>

          <div className="mt-16 flex flex-col lg:flex-row gap-12">
            {/* Left Sidebar - Conditional for Products only */}
            {currentView === 'products' && (
              <div className="w-full lg:w-80 space-y-12">
                <CategorySidebar currentGroupId={groupSlug} currentItemId={itemSlug} />
              </div>
            )}

            {/* Right Content - Product/Shop Grid */}
            <div className="flex-grow">
              <MarketplaceBreadcrumbs groupId={groupSlug} itemId={itemSlug} />
              
              {/* Marketplace Home: Visual Groups (Products View Only) */}
              {!groupSlug && !categorySlug && !query && currentView === 'products' && (
                <div className="mb-24">
                  <GroupGrid />
                </div>
              )}
            <TabsContent value="products" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.length > 0 ? products.map((product) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.slug}`}
                    className="group bg-background rounded-[32px] overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img 
                        src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'} 
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <span className="text-xs font-black text-primary">{product.originCountry?.flag} {product.originCountry?.code}</span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary">{product.category.name}</p>
                        <h3 className="text-lg font-bold font-outfit line-clamp-1 text-primary">{product.name}</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-primary">{product.price.toFixed(2)} $</span>
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors shadow-inner">
                          <ShoppingBag size={18} />
                        </div>
                      </div>
                      <div className="pt-2 border-t flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                         <Store size={12} className="text-secondary" /> {product.shop?.name}
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="col-span-full py-20 text-center space-y-4">
                    <Package className="mx-auto w-16 h-16 text-muted-foreground opacity-20" />
                    <p className="text-xl text-muted-foreground font-medium">Aucun produit trouvé pour "{query}"</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="shops" className="mt-0 space-y-12">
              <ShopFilters 
                countries={countries.map(c => ({ id: c.id, name: c.name, code: c.code, flag: c.flag }))} 
              />
              
              <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-border/50 pb-6">
                    <h2 className="text-3xl font-black font-outfit tracking-tight text-primary">
                        {groupSlug ? (
                          <>Boutiques — <span className="text-secondary">{NAVIGATION_GROUPS.find(g => g.id === groupSlug)?.name}</span></>
                        ) : shopType === 'WHOLESALE' ? (
                          <>Boutiques — <span className="text-secondary">Grossistes B2B</span></>
                        ) : (
                          "Toutes les boutiques"
                        )}
                    </h2>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-4 py-2 rounded-full">
                        {shops.length} résultat{shops.length > 1 ? 's' : ''}
                    </p>
                </div>

                {shops.length > 0 ? (
                  <ShopGrid shops={shops} />
                ) : (
                  <div className="py-32 text-center space-y-6 bg-white rounded-[60px] border border-dashed border-border/60">
                    <Store className="mx-auto w-20 h-20 text-muted-foreground opacity-10" />
                    <div className="space-y-2">
                        <p className="text-2xl text-primary font-black font-outfit">Aucune boutique trouvée</p>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto">Essayez de modifier vos filtres pour découvrir d'autres vendeurs.</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="countries" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {countries.map((c) => (
                  <CountryCard 
                    key={c.id} 
                    country={{
                      id: c.id,
                      name: c.name,
                      code: c.code,
                      image: c.code === 'AE' 
                        ? 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800' 
                        : c.code === 'TR'
                        ? 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&q=80&w=800'
                        : 'https://images.unsplash.com/photo-1508433957232-41487cc5652f?auto=format&fit=crop&q=80&w=800',
                      description: c.code === 'AE' 
                        ? 'Le Hub mondial du luxe et de la technologie. Accédez aux meilleurs fournisseurs de Dubai.' 
                        : c.code === 'TR'
                        ? 'Qualité européenne et savoir-faire traditionnel. Textile, cuir et mobilier haut de gamme.'
                        : 'La plus grande usine du monde. Sourcing sur mesure pour tous les secteurs industriels.'
                    }} 
                  />
                ))}
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
      </div>

      {/* Sourcing Banner */}
      <section className="container mx-auto px-4 mt-24">
        <div className="bg-secondary p-8 sm:p-12 md:p-20 rounded-[40px] md:rounded-[80px] flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12 text-primary overflow-hidden relative shadow-2xl">
          <div className="absolute -right-20 -bottom-20 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-white/10 rounded-full blur-[80px] md:blur-[120px]" />
          <div className="space-y-6 md:space-y-8 relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-7xl font-outfit font-black leading-[0.9] uppercase tracking-tighter">
              Le sourcing <br/>sur mesure <br/><span className="italic opacity-50">BY SHARUFA</span>
            </h2>
            <p className="text-lg md:text-2xl font-bold opacity-80 leading-snug">
              Vous avez une idée, une photo ? On s'occupe de l'achat, la négo et l'expédition.
            </p>
          </div>
          <Link 
            href="/buy-for-me"
            className="px-8 py-5 md:px-12 md:py-8 bg-primary text-secondary font-black rounded-full text-lg md:text-2xl shadow-2xl hover:bg-white hover:text-primary transition-all relative z-10 scale-100 hover:scale-105 text-center w-full sm:w-auto"
          >
            Lancer un Sourcing
          </Link>
        </div>
      </section>
    </div>
  )
}
