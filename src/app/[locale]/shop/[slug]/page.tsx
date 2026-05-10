import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { MapPin, Star, ShoppingBag, ArrowLeft, MessageSquare, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"

export default async function ShopPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>,
  searchParams: Promise<{ category?: string; subcategory?: string; subsubcategory?: string }>
}) {
  const { slug } = await params
  const { 
    category: selectedDomainSlug, 
    subcategory: selectedCategorySlug, 
    subsubcategory: selectedSubCategorySlug 
  } = await searchParams

  if (!prisma) {
    throw new Error("Prisma client not initialized")
  }

  const shop = await prisma.shop.findUnique({
    where: { slug },
    include: {
      products: {
        include: {
          category: {
            include: {
              parent: {
                include: {
                  parent: true
                }
              }
            }
          },
          originCountry: true,
        }
      },
      owner: true,
    }
  })

  if (!shop || (!shop.isVisible && (shop.status as string) !== 'APPROVED') || shop.status === 'SUSPENDED' || (shop.status as string) === 'ARCHIVED') {
    notFound()
  }

  // --- 1. HIERARCHY PROCESSING ---
  
  // We need to build a structure: Domain -> Categories -> SubCategories
  const hierarchy: Record<string, { 
    id: string, name: string, slug: string, count: number, 
    children: Record<string, { 
      id: string, name: string, slug: string, count: number,
      image?: string,
      children: Record<string, { id: string, name: string, slug: string, count: number, image?: string }>
    }> 
  }> = {}

  shop.products.forEach((product: any) => {
    const cat = product.category
    let domain, category, subcategory

    // Determine the path from top to bottom
    if (cat.parent?.parent) {
      // It's a Level 3 (Sub-SubCategory)
      domain = cat.parent.parent
      category = cat.parent
      subcategory = cat
    } else if (cat.parent) {
      // It's a Level 2 (Category)
      domain = cat.parent
      category = cat
      subcategory = null
    } else {
      // It's a Level 1 (Domain)
      domain = cat
      category = null
      subcategory = null
    }

    // Populate hierarchy
    if (!hierarchy[domain.slug]) {
      hierarchy[domain.slug] = { id: domain.id, name: domain.name, slug: domain.slug, count: 0, children: {} }
    }
    hierarchy[domain.slug].count++

    if (category) {
      if (!hierarchy[domain.slug].children[category.slug]) {
        hierarchy[domain.slug].children[category.slug] = { 
          id: category.id, 
          name: category.name, 
          slug: category.slug, 
          count: 0, 
          children: {},
          image: product.images[0] // Pick first product image as representative
        }
      }
      hierarchy[domain.slug].children[category.slug].count++

      if (subcategory) {
        if (!hierarchy[domain.slug].children[category.slug].children[subcategory.slug]) {
          hierarchy[domain.slug].children[category.slug].children[subcategory.slug] = { 
            id: subcategory.id, 
            name: subcategory.name, 
            slug: subcategory.slug, 
            count: 0,
            image: product.images[0]
          }
        }
        hierarchy[domain.slug].children[category.slug].children[subcategory.slug].count++
      }
    }
  })

  const domains = Object.values(hierarchy).sort((a, b) => b.count - a.count)
  const currentDomain = selectedDomainSlug ? hierarchy[selectedDomainSlug] : null
  const currentCategory = (currentDomain && selectedCategorySlug) ? currentDomain.children[selectedCategorySlug] : null
  const currentSubCategory = (currentCategory && selectedSubCategorySlug) ? currentCategory.children[selectedSubCategorySlug] : null

  // --- 2. FILTERING ---
  
  const filteredProducts = shop.products.filter((p: any) => {
    const cat = p.category
    const p_domain = cat.parent?.parent || cat.parent || cat
    const p_category = cat.parent?.parent ? cat.parent : (cat.parent ? cat : null)
    const p_subcategory = cat.parent?.parent ? cat : null

    // Filter by Domain
    if (selectedDomainSlug && selectedDomainSlug !== 'all' && p_domain.slug !== selectedDomainSlug) return false
    // Filter by Category
    if (selectedCategorySlug && p_category?.slug !== selectedCategorySlug) return false
    // Filter by SubCategory
    if (selectedSubCategorySlug && p_subcategory?.slug !== selectedSubCategorySlug) return false

    return true
  })

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Hero Banner */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img 
          src={shop.banner || "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600"} 
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="container mx-auto px-4 absolute bottom-0 left-0 right-0 pb-12 translate-y-1/2 md:translate-y-0 md:pb-24">
           <div className="flex flex-col md:flex-row items-center md:items-end gap-4 md:gap-8">
             <div className="w-28 h-28 md:w-48 md:h-48 rounded-[32px] md:rounded-[40px] bg-white p-1.5 md:p-2 shadow-2xl border-4 border-white/20 overflow-hidden shrink-0 group mx-auto md:mx-0">
                <img 
                  src={shop.logo || "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80&w=400"} 
                  alt={shop.name}
                  className="w-full h-full object-cover rounded-[32px] transition-transform group-hover:scale-110 duration-500"
                />
             </div>
             <div className="flex-grow space-y-3 md:space-y-4 mb-4 flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                   <Badge className="bg-secondary text-primary font-black px-4 py-1 rounded-full uppercase text-[10px] tracking-widest text-center">
                     Boutique Vérifiée
                   </Badge>
                   <Badge variant="outline" className="text-white border-white/30 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                     {shop.country === 'Émirats arabes unis' ? '🇦🇪 UAE' : shop.country === 'Turquie' ? '🇹🇷 TUR' : '🌍 ' + shop.country}
                   </Badge>
                </div>
                <h1 className="text-3xl md:text-6xl font-outfit font-black text-white tracking-tight leading-none mt-2 md:mt-0">
                  {shop.name}
                </h1>
                <div className="flex items-center justify-center md:justify-start gap-4 md:gap-6 text-white/80 font-medium">
                   <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-secondary fill-secondary" />
                      <span className="font-bold">4.9</span>
                      <span className="text-xs opacity-60">(120 avis)</span>
                   </div>
                   <div className="hidden md:flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-secondary" />
                      <span>{shop.country}</span>
                   </div>
                </div>
             </div>
             <div className="hidden lg:flex gap-4 mb-4">
                <Button className="bg-secondary text-primary font-black px-8 py-6 rounded-2xl hover:bg-white transition-all shadow-xl">
                  Suivre la boutique
                </Button>
                <Button variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-md px-8 py-6 rounded-2xl hover:bg-white hover:text-primary transition-all">
                  <MessageSquare size={20} className="mr-2" /> Contacter
                </Button>
             </div>
           </div>
        </div>
      </section>

      {/* Shop Info & Products */}
      <div className="container mx-auto px-4 mt-32 md:mt-16 pt-12">
        {/* Breadcrumbs (SHEIN Style) */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-8 overflow-hidden whitespace-nowrap">
          <Link href="/marketplace" className="hover:text-primary">Marketplace</Link>
          <ChevronRight size={10} />
          <Link href={`/shop/${slug}`} className="hover:text-primary">{shop.name}</Link>
          {currentDomain && (
            <>
              <ChevronRight size={10} />
              <Link href={`/shop/${slug}?category=${currentDomain.slug}`} className="text-secondary">{currentDomain.name}</Link>
            </>
          )}
          {currentCategory && (
            <>
              <ChevronRight size={10} />
              <Link href={`/shop/${slug}?category=${currentDomain?.slug}&subcategory=${currentCategory.slug}`} className="text-secondary">{currentCategory.name}</Link>
            </>
          )}
        </nav>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
           {/* Sidebar Info */}
           <div className="lg:col-span-1 space-y-8">
              <div className="bg-background rounded-[32px] p-8 border border-border shadow-sm space-y-6">
                 <div>
                    <h3 className="text-sm font-black text-primary uppercase tracking-[0.2em] mb-4">À propos</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {shop.description || "Cette boutique n'a pas encore de description détaillée. Elle propose une sélection exclusive de produits importés avec amour."}
                    </p>
                 </div>
                 
                 <div className="pt-6 border-t space-y-4">
                    <div className="flex items-center gap-3 text-sm font-bold text-primary">
                       <Globe className="w-5 h-5 text-secondary" />
                       Boutique Internationale
                    </div>
                    <div className="flex items-center gap-3 text-sm font-bold text-primary">
                       <ShoppingBag className="w-5 h-5 text-secondary" />
                       {shop.products.length} Produits en ligne
                    </div>
                 </div>

                 <Link href="/buy-for-me" className="block p-6 bg-secondary/10 rounded-2xl border border-secondary/20 group hover:bg-secondary/20 transition-all">
                    <div className="flex items-center gap-3 mb-2">
                       <Globe className="w-5 h-5 text-secondary" />
                       <span className="font-black text-primary text-xs uppercase tracking-widest">Buy For Me</span>
                    </div>
                    <p className="text-xs text-primary/70 font-medium">
                       Vous ne trouvez pas un article spécifique ? Demandez à nos agents de sourcer directement chez ce vendeur.
                    </p>
                 </Link>
              </div>

              <Link href="/marketplace" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors px-2">
                 <ArrowLeft size={16} /> Retour à la Marketplace
              </Link>
           </div>

           {/* Product Grid with Hierarchical Visual Tabs */}
           <div className="lg:col-span-3 space-y-12">
              <div className="space-y-10">
                {/* Level 1: Domains (Top Navigation) */}
                <Tabs key={selectedDomainSlug} defaultValue={selectedDomainSlug || 'all'} className="w-full">
                  <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    <TabsList className="bg-white/80 backdrop-blur-md px-2 py-1.5 h-auto rounded-[24px] shadow-sm border border-border">
                      <Link href={`/shop/${slug}?category=all`} scroll={false}>
                        <TabsTrigger 
                          value="all" 
                          className="rounded-[18px] px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest flex gap-2"
                        >
                          Tous <span className="opacity-50">({shop.products.length})</span>
                        </TabsTrigger>
                      </Link>
                      {domains.map((domain) => (
                        <Link key={domain.slug} href={`/shop/${slug}?category=${domain.slug}`} scroll={false}>
                          <TabsTrigger 
                            value={domain.slug}
                            className="rounded-[18px] px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white font-black uppercase text-[10px] tracking-widest flex gap-2"
                          >
                            {domain.name} <span className="opacity-40">({domain.count})</span>
                          </TabsTrigger>
                        </Link>
                      ))}
                    </TabsList>
                  </div>
                </Tabs>

                {/* Level 2: Visual Categories (SHEIN Style Circular Thumbnails) */}
                {currentDomain && Object.keys(currentDomain.children).length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary/40 px-2">Explorer {currentDomain.name}</h3>
                    <div className="flex items-center gap-8 overflow-x-auto pb-4 scrollbar-hide px-2">
                      {/* "Tout" visual option */}
                      <Link 
                        href={`/shop/${slug}?category=${selectedDomainSlug}`} 
                        className="group flex flex-col items-center gap-3 shrink-0"
                        scroll={false}
                      >
                        <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${!selectedCategorySlug ? 'border-secondary bg-secondary/10 scale-110 shadow-xl' : 'border-transparent bg-muted/30 group-hover:bg-muted group-hover:scale-105'}`}>
                           <ShoppingBag className={`w-8 h-8 ${!selectedCategorySlug ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${!selectedCategorySlug ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>Tout</span>
                      </Link>

                      {Object.values(currentDomain.children).sort((a,b) => b.count - a.count).map((cat: any) => (
                        <Link 
                          key={cat.slug}
                          href={`/shop/${slug}?category=${selectedDomainSlug}&subcategory=${cat.slug}`}
                          className="group flex flex-col items-center gap-3 shrink-0"
                          scroll={false}
                        >
                          <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm ${selectedCategorySlug === cat.slug ? 'border-secondary scale-110 shadow-xl' : 'border-transparent group-hover:border-border group-hover:scale-105'}`}>
                             <img 
                               src={cat.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400"} 
                               alt={cat.name}
                               className="w-full h-full object-cover"
                             />
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${selectedCategorySlug === cat.slug ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>
                            {cat.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Level 3: Sub-categories (Pills for precision) */}
                {currentCategory && Object.keys(currentCategory.children).length > 0 && (
                  <div className="flex flex-wrap items-center gap-3 bg-muted/20 p-4 rounded-[24px] border border-border/50">
                    <Link 
                      href={`/shop/${slug}?category=${selectedDomainSlug}&subcategory=${selectedCategorySlug}`} 
                      className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${!selectedSubCategorySlug ? 'bg-primary text-white shadow-lg' : 'bg-white border border-border text-muted-foreground hover:bg-muted'}`}
                      scroll={false}
                    >
                      Tout {currentCategory.name}
                    </Link>
                    {Object.values(currentCategory.children).sort((a,b) => b.count - a.count).map((sub) => (
                      <Link 
                        key={sub.slug}
                        href={`/shop/${slug}?category=${selectedDomainSlug}&subcategory=${selectedCategorySlug}&subsubcategory=${sub.slug}`}
                        className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${selectedSubCategorySlug === sub.slug ? 'bg-primary text-white shadow-lg' : 'bg-white border border-border text-muted-foreground hover:bg-muted'}`}
                        scroll={false}
                      >
                        {sub.name} <span className="opacity-40 ml-1">({sub.count})</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 pt-4">
                {filteredProducts.map((product: any) => (
                  <Link 
                    key={product.id} 
                    href={`/product/${product.slug}`}
                    className="group bg-background rounded-[32px] overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all hover:-translate-y-2"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img 
                        src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400'} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                        <span className="text-[10px] font-black text-primary uppercase">{product.originCountry?.code}</span>
                      </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-secondary">{product.category.name}</p>
                        <h3 className="text-lg font-bold font-outfit line-clamp-1 text-primary">{product.name}</h3>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black text-primary">{product.price.toFixed(2)} $</span>
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-primary transition-colors shadow-inner">
                          <ShoppingBag size={18} />
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="py-20 text-center bg-background rounded-[40px] border border-dashed border-border space-y-4">
                  <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                      <ShoppingBag size={32} />
                  </div>
                  <p className="text-muted-foreground font-medium">Bientôt de nouveaux produits dans cette sélection.</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
