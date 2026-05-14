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
import { MarketplaceHeader } from '@/components/marketplace/MarketplaceHeader';
import { MarketplaceCategoryGrid } from '@/components/marketplace/MarketplaceCategoryGrid';
import { MarketplaceInfoBar } from '@/components/marketplace/MarketplaceInfoBar';
import { MarketplaceSheinHero } from '@/components/marketplace/MarketplaceSheinHero';
import { MarketplaceCommercialSections } from '@/components/marketplace/MarketplaceCommercialSections';
import { MarketplaceProductsGrid } from '@/components/marketplace/MarketplaceProductsGrid';

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
  const isHomeView = !groupSlug && !categorySlug && !query && !countryCode && currentView === 'products'

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
  const limit = 45 // 45 produits = 3 lignes de 15 colonnes, idéal pour défilement horizontal
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

  let productsRaw: any[] = [];
  let totalProducts = await prisma.product.count({ where: productWhere })

  if (isHomeView) {
    // Vrai affichage aléatoire pour la vue d'accueil : on donne une chance à tous les vendeurs/catégories
    // 1. Récupérer tous les IDs correspondant (très léger en mémoire)
    const allIds = await prisma.product.findMany({
      where: productWhere,
      select: { id: true }
    });

    // 2. Mélanger tous les IDs de manière aléatoire
    const shuffledIds = allIds.sort(() => 0.5 - Math.random()).map(p => p.id);
    
    // 3. Prendre juste la portion de la page actuelle
    const paginatedIds = shuffledIds.slice(skip, skip + limit);

    // 4. Charger les données complètes uniquement pour ces IDs
    productsRaw = await prisma.product.findMany({
      where: { id: { in: paginatedIds } },
      include: {
        shop: true,
        originCountry: true,
        category: {
            include: { translations: { where: { locale } } }
        },
        translations: { where: { locale } }
      }
    });
  } else {
    // Si l'utilisateur fait une recherche ou applique un filtre, on garde le tri par nouveauté/pertinence
    productsRaw = await prisma.product.findMany({
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
    });
  }

  let products = productsRaw.map(p => ({
    ...p,
    name: p.translations[0]?.name || p.name,
    description: p.translations[0]?.description || p.description,
    category: {
        ...p.category,
        name: p.category.translations[0]?.name || p.category.name
    }
  }))

  // Mélange aléatoire (shuffle) pour avoir une vue différente et variée (habits, tech, etc.)
  products = products.sort(() => Math.random() - 0.5)

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
          ...(targetCategoryIds.length > 0 ? { categoryId: { in: targetCategoryIds } } : (groupSlug || categorySlug ? { categoryId: { in: ['none'] } } : { }))
        },
        include: { translations: { where: { locale } } },
        take: 3 
      }
    },
    take: 12
  })

  // 4. Fetch Commercial Data (for home view)
  
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

  // 5. Fetch Cheapest Products for Hero
  const cheapestProductsRaw = isHomeView ? await prisma.product.findMany({
    where: { 
        status: 'APPROVED',
        shop: { status: 'APPROVED', isVisible: true },
        price: { gt: 0 }
    },
    orderBy: { price: 'asc' },
    take: 10,
    include: {
      translations: { where: { locale } }
    }
  }) : []

  const cheapestProductsHero = cheapestProductsRaw.map(p => ({
    ...p,
    name: p.translations[0]?.name || p.name,
  }))


  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-20">
      <MarketplaceHeader />

      {/* Tabs & Filters Navigation */}
      <div className="container mx-auto px-4 mt-8 relative z-20">
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
            </TabsList>

            <MarketplaceFilters 
              countries={countries.map(c => ({ id: c.id, name: c.name, code: c.code, flag: c.flag }))} 
            />
          </div>

          <div className="mt-8">
            {(isHomeView || groupSlug) && (
              <>
                {isHomeView && <MarketplaceSheinHero products={cheapestProductsHero} />}
                {!groupSlug && <MarketplaceCategoryGrid />}
              </>
            )}
          </div>

          <div className="mt-16 flex flex-col lg:flex-row gap-12">
            {/* Left Sidebar - Removed per request */}

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

              {/* Breadcrumbs removed per request for cleaner UI */}
              
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
                <MarketplaceProductsGrid products={products} isHomeView={isHomeView} />

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
            </div>
          </div>
        </Tabs>
      </div>

      {isHomeView && (
        <div className="mt-20">
          <MarketplaceCommercialSections />
        </div>
      )}
    </div>
  )
}
