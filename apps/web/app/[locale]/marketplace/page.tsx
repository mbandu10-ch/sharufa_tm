import { Link } from '@/lib/i18n-navigation';
import { getTranslations } from 'next-intl/server';
import { Search, Filter, MapPin, Star, ArrowRight, Store, ShoppingBag, Package, Globe, Gauge, Calendar } from 'lucide-react';
import { Button } from '@sharufa/ui/components/button';
import { Badge } from '@sharufa/ui/components/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@sharufa/ui/components/select';
import { CardContent } from '@sharufa/ui/components/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@sharufa/ui/components/tabs";
import { prisma } from '@sharufa/db';
import { MarketplaceFilters } from '@/components/marketplace/MarketplaceFilters';
import { CategorySidebar } from '@/components/marketplace/CategorySidebar';
import { cn } from '@/lib/utils';
import { NAVIGATION_GROUPS } from '@/lib/navigation';
import { MarketplaceBreadcrumbs } from '@/components/marketplace/Breadcrumbs';
import { ShopFilters } from '@/components/marketplace/ShopFilters';
import { ShopGrid } from '@/components/marketplace/ShopGrid';
import { CountryCard } from '@/components/home/CountryCard';
import { StepExploration } from '@/components/marketplace/StepExploration';
import { MarketplacePagination } from '@/components/marketplace/MarketplacePagination';
import { MobileCategoryDrawer } from '@/components/marketplace/MobileCategoryDrawer';
import { MarketplaceMobileDiscovery } from '@/components/marketplace/MarketplaceMobileDiscovery';

export default async function MarketplacePage({ 
  searchParams,
  params: routeParams
}: { 
  searchParams: Promise<{ q?: string; view?: string; category?: string; country?: string; group?: string; item?: string; shopType?: string; tab?: string; page?: string }>;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await routeParams;
  const params = await searchParams;
  const query = params.q || '';
  const currentView = params.view || 'products';
  const isCountriesTab = params.tab === 'countries' || currentView === 'countries';
  const categorySlug = params.category;
  const countryCode = params.country;
  const groupSlug = params.group;
  const itemSlug = params.item;
  const shopType = params.shopType;

  const tNav = await getTranslations('NavigationGroups');
  const t = await getTranslations('Marketplace');
  
  // 1. Handle Categories & Recursive Filtering
  let targetCategoryIds: string[] = [];
  
  // Phase 3 Mapping: Group -> Item -> Categories
  if (categorySlug) {
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug },
      include: { subCategories: true }
    });
    
    if (category) {
      targetCategoryIds = [category.id, ...category.subCategories.map(s => s.id)]
    }
  } else if (groupSlug) {
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
  }
  
  // 1.5 Intelligent Group/Univers Detection from Search Query
  if (query && !groupSlug && !itemSlug && !categorySlug) {
    const normalizedQuery = query.toLowerCase().trim()
    const matchingGroup = NAVIGATION_GROUPS.find(g => {
      const groupName = tNav(g.id).toLowerCase()
      return groupName.includes(normalizedQuery) || normalizedQuery.includes(groupName)
    })

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

  // Fetch real categories for the sidebar drill-down
  let sidebarCategories: any[] = []
  if (itemSlug) {
    const group = NAVIGATION_GROUPS.find(g => g.id === groupSlug)
    const item = group?.items.find(i => i.id === itemSlug)
    if (item) {
        sidebarCategories = await prisma.category.findMany({
            where: { slug: { in: item.categorySlugs } },
            include: { 
                subCategories: {
                    include: { translations: { where: { locale } } }
                },
                translations: { where: { locale } }
            }
        })
    }
  } else if (categorySlug) {
      const cat = await prisma.category.findUnique({
          where: { slug: categorySlug },
          include: { 
              subCategories: {
                include: { translations: { where: { locale } } }
              }, 
              parent: { 
                include: { 
                    subCategories: {
                        include: { translations: { where: { locale } } }
                    },
                    translations: { where: { locale } }
                } 
              },
              translations: { where: { locale } }
          }
      })
      if (cat) {
          sidebarCategories = cat.parentId ? cat.parent!.subCategories : [cat]
      }
  }

  // Localize sidebar categories
  sidebarCategories = sidebarCategories.map(cat => ({
    ...cat,
    name: cat.translations[0]?.name || cat.name,
    subCategories: cat.subCategories?.map((sub: any) => ({
        ...sub,
        name: sub.translations[0]?.name || sub.name
    }))
  }))

  const page = Number(params.page) || 1
  const limit = 24
  const skip = (page - 1) * limit

  // 2. Fetch Products
  const productWhere = {
    status: 'APPROVED' as const,
    shop: {
      status: 'APPROVED' as const,
      isVisible: true
    },
    OR: [
      { name: { contains: query, mode: 'insensitive' as const } },
      { description: { contains: query, mode: 'insensitive' as const } },
      { category: { name: { contains: query, mode: 'insensitive' as const } } },
      { shop: { name: { contains: query, mode: 'insensitive' as const } } },
      { originCountry: { name: { contains: query, mode: 'insensitive' as const } } },
      { originCountry: { code: { contains: query, mode: 'insensitive' as const } } }
    ],
    ...(targetCategoryIds.length > 0 ? { categoryId: { in: targetCategoryIds } } : (groupSlug || categorySlug ? { categoryId: { in: ['none'] } } : {})),
    ...(countryCode && { originCountry: { code: countryCode } })
  }

  const [productsRaw, totalProducts] = await Promise.all([
    prisma.product.findMany({
      where: productWhere,
      include: {
        shop: true,
        originCountry: true,
        category: {
            include: { translations: { where: { locale } } }
        },
        translations: { where: { locale } }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    }),
    prisma.product.count({ where: productWhere })
  ])

  const products = productsRaw.map(p => ({
    ...p,
    name: p.translations[0]?.name || p.name,
    description: p.translations[0]?.description || p.description,
    category: {
        ...p.category,
        name: p.category.translations[0]?.name || p.category.name
    }
  }))

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
        include: { translations: { where: { locale } } },
        take: 3 
      }
    },
    take: 12
  })

  // 4. Fetch Commercial Data (for home view)
  const isHomeView = !groupSlug && !categorySlug && !query && !countryCode && currentView === 'products'
  
  const fetchLocalProducts = async (where: any, take: number) => {
    const raw = await prisma.product.findMany({
        where,
        include: { 
            shop: true, 
            originCountry: true, 
            category: { include: { translations: { where: { locale } } } },
            translations: { where: { locale } }
        },
        take
    })
    return raw.map(p => ({
        ...p,
        name: p.translations[0]?.name || p.name,
        category: {
            ...p.category,
            name: p.category.translations[0]?.name || p.category.name
        }
    }))
  }

  const featuredProducts = isHomeView ? await fetchLocalProducts({ status: 'APPROVED', isSharufa: true }, 4) : []
  const newArrivals = isHomeView ? await fetchLocalProducts({ status: 'APPROVED' }, 4) : []
  const topSales = isHomeView ? await fetchLocalProducts({ status: 'APPROVED' }, 4) : []

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Search & Header simplified */}
      <div className="bg-primary pt-24 pb-16 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-secondary/5 skew-x-12 transform translate-x-1/2" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-outfit font-black tracking-tight leading-none uppercase italic">
              Marketplace <span className="text-secondary italic">Sharufa</span>
            </h1>
            
            <form action="/marketplace" method="GET" className="flex flex-col md:flex-row gap-4 bg-white/10 p-2 rounded-[32px] backdrop-blur-xl border border-white/20 shadow-2xl">
              <input type="hidden" name="view" value={currentView} />
              <div className="flex-grow flex items-center px-6 gap-3">
                <Search className="text-secondary w-6 h-6" />
                <input 
                  name="q"
                  type="text" 
                  placeholder={t('search_placeholder')} 
                  defaultValue={query}
                  className="bg-transparent border-none focus:outline-none focus:ring-0 w-full py-3 md:py-4 text-base text-white placeholder:text-white/40"
                />
              </div>
              <Button type="submit" className="bg-secondary text-primary font-black px-10 py-5 rounded-2xl hover:bg-white transition-all text-base shadow-lg">
                {t('explore')}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Tabs & Filters Navigation */}
      <div className="container mx-auto px-4 -mt-8 relative z-20">
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
            {/* Left Sidebar */}
            <div className="hidden lg:block w-80 space-y-12">
              <CategorySidebar 
                currentGroupId={groupSlug} 
                currentItemId={itemSlug} 
                currentCategorySlug={categorySlug}
                categories={sidebarCategories}
              />
            </div>

            {/* Mobile Sidebar Trigger */}
            {/* Mobile Sidebar Trigger */}
            <div className="lg:hidden fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
                <MobileCategoryDrawer 
                    currentGroupId={groupSlug} 
                    currentItemId={itemSlug} 
                    currentCategorySlug={categorySlug}
                    categories={sidebarCategories}
                />
            </div>

            {/* Right Content */}
            <div className="flex-grow">
              {/* Mobile Visual Category Bar (SHEIN Style) */}
              <div className="lg:hidden bg-white -mx-4 px-4 py-4 mb-6 border-b border-border shadow-sm sticky top-0 z-30">
                <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
                  {NAVIGATION_GROUPS.map((group) => {
                    const Icon = group.icon
                    const isSelected = groupSlug === group.id
                    return (
                      <Link 
                        key={group.id} 
                        href={`/marketplace?group=${group.id}`}
                        className="flex flex-col items-center gap-2 shrink-0 group"
                      >
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                          isSelected ? "bg-secondary text-primary shadow-lg shadow-secondary/20" : "bg-muted/50 text-primary group-hover:bg-secondary/20"
                        )}>
                          <Icon size={24} />
                        </div>
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-tighter text-center w-16 line-clamp-2 transition-colors",
                          isSelected ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                        )}>
                          {group.name.split(' ')[0]}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between mb-8">
                <MarketplaceBreadcrumbs groupId={groupSlug} itemId={itemSlug} />
              </div>
              
              {/* Step Exploration (Only if products view and not searching by query) */}
              {currentView === 'products' && !query && (
                <div className="hidden lg:block">
                  <StepExploration />
                </div>
              )}

              {/* Mobile Discovery View (Only if products view and home) */}
              {isHomeView && (
                <MarketplaceMobileDiscovery 
                  featuredProducts={featuredProducts} 
                  newArrivals={newArrivals} 
                  topSales={topSales} 
                />
              )}

              {/* Products Grid */}
              <TabsContent value="products" className="mt-0 space-y-8">
                <div className="flex items-center justify-between border-b border-border pb-6 mb-8">
                   <h2 className="text-2xl md:text-3xl font-black font-outfit tracking-tight text-primary">
                      {groupSlug || categorySlug ? (
                        <>Affichage de votre <span className="text-secondary">sélection</span></>
                      ) : (
                        <>Tous les <span className="text-secondary">Produits</span></>
                      )}
                   </h2>
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted/50 px-4 py-2 rounded-full">
                      {totalProducts} produits
                   </p>
                </div>

                <div className={cn(
                  "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8",
                  isHomeView && "hidden lg:grid" // Hide default grid on mobile if home (handled by discovery)
                )}>
                  {products.length > 0 ? products.map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/product/${product.slug}`}
                      className="group bg-background rounded-2xl md:rounded-[32px] overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2 flex flex-col"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden">
                        <img 
                          src={product.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400'} 
                          alt={product.name}
                          className="w-full h-full object-contain md:object-contain transition-transform duration-700"
                        />
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                          <span className="text-[8px] md:text-xs font-black text-primary">{product.originCountry?.flag} {product.originCountry?.code}</span>
                        </div>
                      </div>
                      <div className="p-3 md:p-6 space-y-2 md:space-y-4 flex-grow flex flex-col">
                        <div className="space-y-1">
                          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-secondary">{product.category.name}</p>
                          <h3 className="text-sm md:text-lg font-bold font-outfit line-clamp-1 text-primary">{product.name}</h3>
                        </div>
                        <div className="mt-auto">
                          <div className="flex items-center justify-between">
                            {product.price > 0 ? (
                              <>
                                <span className="text-base md:text-2xl font-black text-primary">$ {product.price.toFixed(2)}</span>
                                <div className="hidden md:flex w-10 h-10 rounded-full bg-secondary/10 items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors">
                                  <ShoppingBag size={18} />
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="text-[10px] md:text-sm font-black text-muted-foreground uppercase tracking-wider">Sur demande</span>
                                <div className="hidden md:flex w-10 h-10 rounded-full bg-primary/10 items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                  <Search size={18} />
                                </div>
                              </>
                            )}
                          </div>
                          <div className="pt-2 mt-2 border-t flex items-center gap-2 text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-wider truncate">
                             <Store size={10} className="text-secondary shrink-0" /> {product.shop?.name}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                      <Package className="mx-auto w-16 h-16 text-muted-foreground opacity-20" />
                      <p className="text-xl text-muted-foreground font-medium">Aucun produit trouvé</p>
                    </div>
                  )}
                </div>

                <MarketplacePagination 
                   totalItems={totalProducts}
                   itemsPerPage={limit}
                   currentPage={page}
                />
              </TabsContent>

              <TabsContent value="shops" className="mt-0 space-y-12">
                <ShopFilters countries={countries.map(c => ({ id: c.id, name: c.name, code: c.code, flag: c.flag }))} />
                <ShopGrid shops={shops} />
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
                          ? 'Le Hub mondial du luxe et de la technologie.' 
                          : c.code === 'TR'
                          ? 'Qualité européenne et savoir-faire traditionnel.'
                          : 'La plus grande usine du monde.'
                      }} 
                    />
                  ))}
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
