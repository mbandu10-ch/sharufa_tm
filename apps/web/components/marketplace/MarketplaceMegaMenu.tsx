'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Link } from '@/lib/i18n-navigation'
import { NAVIGATION_GROUPS } from '@/lib/navigation'
import { ChevronDown, ChevronRight, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

// Mapping strict et exact des 65 slugs de la base de données vers des noms lisibles
const CATEGORY_NAMES: Record<string, string> = {
  // Mode Femme
  'vetements-femme': 'Vêtements',
  'chaussures-femme': 'Chaussures',
  'sacs-maroquinerie-femme': 'Sacs',
  'bijoux-femme': 'Bijoux',
  'beaute-cosmetiques-femme': 'Cosmétiques',
  'accessoires-femme': 'Accessoires',
  'mariage-ceremonie-femme': 'Mariage',
  'sante-bien-etre-femme': 'Bien-être',
  'maternite-bebe-maman': 'Maternité',
  'luxe-premium-femme': 'Luxe Premium',

  // Mode Homme
  'vetements-homme': 'Vêtements',
  'chaussures-homme': 'Chaussures',
  'sacs-maroquinerie-homme': 'Maroquinerie',
  'montres-bijoux-homme': 'Montres',
  'grooming-soins-homme': 'Soins Homme',
  'accessoires-homme': 'Accessoires',
  'sport-fitness-homme': 'Sport',
  'business-executive-homme': 'Business',
  'luxe-premium-homme': 'Luxe',
  'voyage-lifestyle-homme': 'Voyage',

  // Enfants
  'vetements-enfant': 'Vêtements',
  'chaussures-enfant': 'Chaussures',
  'ecole-rentree-enfant': 'École',

  // Accessoires Divers
  'accessoires': 'Accessoires Divers',
  'sacs-maroquinerie': 'Maroquinerie',
  'bijoux-montres': 'Bijoux & Montres',

  // Electronique
  'electronique-legere': 'Électronique',
  'smartphones': 'Smartphones',
  'acc-tel': 'Accessoires Tel',
  'laptops': 'Ordinateurs',
  'casques': 'Audio',
  'tv-photo': 'TV & Photo',

  // Maison
  'maison-deco': 'Décoration',
  'mobilier': 'Mobilier',
  'cuisine-v2': 'Cuisine & Ustensiles',
  'cuisine': 'Cuisine',

  // Beaute (Multiple usage)
  'beaute': 'Produits de beauté',
  'makeup': 'Maquillage',
  'skincare': 'Soins Visage & Corps',
  'perfume': 'Parfums',
  'haircare': 'Soins Capillaires',
  
  // Vehicules
  'voitures-v2': 'Voitures & Motos',
  'voitures': 'Voitures',
  'motos-scooters': 'Motos',
  'velos-mobilite': 'Vélos',
  'accessoires-auto': 'Accessoires Auto',
  'pieces-auto-v2': 'Pièces & Entretien',
  'pieces-auto': 'Pièces',
  'entretien-auto': 'Entretien',

  // Construction
  'outillage': 'Outillage',
  'construction': 'Matériaux',
  'technique': 'Technique',
  'electricite-plomberie': 'Électricité & Plomberie',

  // Alimentaire & Hygiene
  'alimentaire': 'Alimentation',
  'boissons': 'Boissons',
  'hygiene': 'Hygiène',
  'entretien-maison': 'Entretien Maison',
  'hygiene-papier': 'Hygiène & Papier',

  // Bebes
  'bebe-habille': 'Vêtements Bébé',
  'bebe-pueri-v2': 'Puériculture',
  'bebe-alim-v2': 'Alimentation',
  'bebe-soins-v2': 'Soins & Hygiène',
  'bebe-sante-v2': 'Santé & Sécurité',
  'vetements-bebe-0-24': 'Vêtements Bébé',
  'puericulture-bebe': 'Puériculture',
  'alimentation-bebe': 'Alimentation',
  'soins-hygiene-bebe': 'Soins Bébé',
  'sante-securite-bebe': 'Sécurité',
  'jouets-eveil-bebe': 'Jouets',
  'chambre-bebe': 'Chambre Bébé',
  'maman-maternite-bebe': 'Maternité',

  // Industrie
  'industrie-v3': 'Machines & Équipements',
  'industrie-v2': 'Machines & Équipements',
  'industrie': 'Industrie',
  'securite': 'Sécurité EPI',
  'pro': 'Commercial',
}

export function MarketplaceMegaMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeGroup, setActiveGroup] = useState(NAVIGATION_GROUPS[0].id)
  const menuRef = useRef<HTMLDivElement>(null)

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleClose = () => setIsOpen(false)

  const currentGroupData = NAVIGATION_GROUPS.find(g => g.id === activeGroup)

  return (
    <div className="relative" ref={menuRef} onMouseLeave={() => setIsOpen(false)}>
      {/* Bouton Trigger (Catégories) */}
      <button 
        onMouseEnter={() => setIsOpen(true)}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-all"
      >
        <Menu size={16} />
        Catégories
        <ChevronDown size={14} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {/* Dropdown Mega Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-4 w-[1000px] h-[600px] bg-white border border-border shadow-2xl z-50 flex rounded-xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          
          {/* Colonne de gauche : Univers (10) */}
          <div className="w-[280px] bg-[#F7F7F7] overflow-y-auto scrollbar-hide py-4 border-r border-border flex flex-col">
            <h3 className="px-6 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-4">Tous les univers</h3>
            {NAVIGATION_GROUPS.map((group) => {
              const isActive = activeGroup === group.id
              const Icon = group.icon
              return (
                <button
                  key={group.id}
                  onMouseEnter={() => setActiveGroup(group.id)}
                  className={cn(
                    "flex items-center justify-between w-full px-6 py-3.5 text-left transition-colors",
                    isActive ? "bg-white text-primary border-l-4 border-secondary font-black shadow-sm" : "text-muted-foreground hover:bg-white hover:text-primary font-bold"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} className={isActive ? "text-secondary" : ""} />
                    <span className="text-xs uppercase tracking-wider">{group.name}</span>
                  </div>
                  <ChevronRight size={14} className={isActive ? "opacity-100" : "opacity-0"} />
                </button>
              )
            })}
          </div>

          {/* Panneau de droite : Sous-catégories & Bulles (35 & 65) */}
          <div className="flex-1 overflow-y-auto bg-white p-8">
            {currentGroupData && (
              <div className="space-y-12">
                {currentGroupData.items.map((item) => (
                  <div key={item.id} className="space-y-6">
                    {/* Titre de la Sous-catégorie */}
                    <div className="flex items-center gap-4">
                      <h4 className="text-sm font-black font-outfit text-primary uppercase tracking-widest border-b-2 border-secondary pb-1">
                        {item.name}
                      </h4>
                      <Link 
                        href={`/marketplace?group=${activeGroup}&item=${item.id}`}
                        onClick={handleClose}
                        className="text-[10px] font-bold text-secondary uppercase tracking-widest hover:underline flex items-center gap-1"
                      >
                        Voir tout <ChevronRight size={10} />
                      </Link>
                    </div>

                    {/* Grille des bulles (Sous-sous-catégories / Slugs) */}
                    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-8 gap-x-4">
                      {item.categorySlugs.map((slug) => {
                        // Récupérer le nom exact depuis le dictionnaire, et l'image locale générée par DALL-E
                        const name = CATEGORY_NAMES[slug] || slug.replace(/-/g, ' ')
                        const imageUrl = `/categories/${slug}.webp`
                        
                        return (
                          <Link 
                            key={slug} 
                            href={`/marketplace?category=${slug}`}
                            onClick={handleClose}
                            className="group flex flex-col items-center gap-3 text-center"
                          >
                            <div className="w-16 h-16 rounded-full overflow-hidden border border-border group-hover:border-secondary transition-colors shadow-sm group-hover:shadow-md">
                              <img 
                                src={imageUrl} 
                                alt={name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => {
                                  // Fallback au cas où l'image n'est pas encore générée
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=200'
                                }}
                              />
                            </div>
                            <span className="text-[9px] font-bold text-primary group-hover:text-secondary uppercase tracking-tighter line-clamp-2 leading-tight w-20">
                              {name}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
        </div>
      )}
    </div>
  )
}
