import { 
  ShoppingBag, 
  Smartphone, 
  Home, 
  Sparkles, 
  Car, 
  Hammer, 
  Apple, 
  Droplets, 
  Baby, 
  Factory
} from 'lucide-react'

import { ElementType } from 'react'

export interface NavigationItem {
  id: string
  name: string
  categorySlugs: string[]
}

export interface NavigationGroup {
  id: string
  name: string
  icon: ElementType
  items: NavigationItem[]
}

export const NAVIGATION_GROUPS: NavigationGroup[] = [
  {
    id: 'mode-accessoires',
    name: 'Mode & Accessoires',
    icon: ShoppingBag,
    items: [
      { 
        id: 'femme', 
        name: 'Femme', 
        categorySlugs: [
          'vetements-femme', 
          'chaussures-femme', 
          'sacs-maroquinerie-femme', 
          'bijoux-femme', 
          'beaute-cosmetiques-femme', 
          'accessoires-femme', 
          'mariage-ceremonie-femme', 
          'sante-bien-etre-femme', 
          'maternite-bebe-maman', 
          'luxe-premium-femme'
        ] 
      },
      { 
        id: 'homme', 
        name: 'Homme', 
        categorySlugs: [
          'vetements-homme', 
          'chaussures-homme', 
          'sacs-maroquinerie-homme', 
          'montres-bijoux-homme', 
          'grooming-soins-homme', 
          'accessoires-homme', 
          'sport-fitness-homme', 
          'business-executive-homme', 
          'luxe-premium-homme', 
          'voyage-lifestyle-homme'
        ] 
      },
      { id: 'enfants', name: 'Enfants', categorySlugs: ['vetements-enfant', 'chaussures-enfant', 'ecole-rentree-enfant'] },
      { id: 'accessoires', name: 'Accessoires', categorySlugs: ['accessoires', 'sacs-maroquinerie', 'bijoux-montres'] }
    ]
  },
  {
    id: 'electronique-technologie',
    name: 'Électronique & Technologie',
    icon: Smartphone,
    items: [
      { id: 'smartphones', name: 'Smartphones & Tablettes', categorySlugs: ['smart-devices', 'acc-tel', 'electronique-legere'] },
      { id: 'informatique', name: 'Informatique', categorySlugs: ['laptops', 'electronique-legere'] },
      { id: 'audio', name: 'Audio & Son', categorySlugs: ['casques', 'electronique-legere'] },
      { id: 'tv-photo', name: 'TV & Photographie', categorySlugs: ['tv-camera', 'electronique-legere'] }
    ]
  },
  {
    id: 'maison-cuisine',
    name: 'Maison & Cuisine',
    icon: Home,
    items: [
      { id: 'decoration', name: 'Décoration & Mobilier', categorySlugs: ['maison-deco', 'mobilier'] },
      { id: 'cuisine', name: 'Cuisine & Ustensiles', categorySlugs: ['cuisine-v2', 'cuisine'] }
    ]
  },
  {
    id: 'beaute-soins',
    name: 'Beauté & Soins',
    icon: Sparkles,
    items: [
      { id: 'maquillage', name: 'Maquillage', categorySlugs: ['beauty-makeup', 'beaute'] },
      { id: 'soins', name: 'Soins visage & corps', categorySlugs: ['beauty-skincare', 'beaute'] },
      { id: 'parfums', name: 'Parfums', categorySlugs: ['beauty-perfume', 'beaute'] },
      { id: 'cheveux', name: 'Soins capillaires', categorySlugs: ['beauty-haircare', 'beaute'] }
    ]
  },
  {
    id: 'vehicules-mobilite',
    name: 'Véhicules & Mobilité',
    icon: Car,
    items: [
      { id: 'auto-moto', name: 'Voitures & Motos', categorySlugs: ['voitures-v2', 'voitures', 'motos-scooters'] },
      { id: 'mobilite-douce', name: 'Mobilité douce', categorySlugs: ['velos-mobilite'] },
      { id: 'pieces-auto', name: 'Pièces & Entretien', categorySlugs: ['pieces-auto-v2', 'accessoires-auto', 'pieces-auto', 'entretien-auto'] }
    ]
  },
  {
    id: 'construction-materiaux',
    name: 'Construction & Matériaux',
    icon: Hammer,
    items: [
      { id: 'outillage', name: 'Outillage', categorySlugs: ['outillage'] },
      { id: 'materiaux', name: 'Matériaux de base', categorySlugs: ['construction'] },
      { id: 'technique', name: 'Électricité & Plomberie', categorySlugs: ['electricite-plomberie', 'technique'] }
    ]
  },
  {
    id: 'alimentaire-denrees',
    name: 'Alimentaire & Denrées',
    icon: Apple,
    items: [
      { id: 'epicerie', name: 'Épicerie', categorySlugs: ['alimentaire'] },
      { id: 'boissons', name: 'Boissons', categorySlugs: ['boissons'] }
    ]
  },
  {
    id: 'menagers-hygiene',
    name: 'Produits ménagers & Hygiène',
    icon: Droplets,
    items: [
      { id: 'entretien', name: 'Entretien Maison', categorySlugs: ['entretien-maison', 'hygiene'] },
      { id: 'hygiene', name: 'Hygiène & Papier', categorySlugs: ['hygiene-papier', 'hygiene'] }
    ]
  },
  {
    id: 'enfants-bebe',
    name: 'Enfants & Bébé',
    icon: Baby,
    items: [
      { id: 'bebe-vetements', name: 'Vêtements Bébé', categorySlugs: ['bebe-habille', 'vetements-bebe-0-24'] },
      { id: 'bebe-puericulture', name: 'Puériculture', categorySlugs: ['bebe-pueri-v2', 'puericulture-bebe'] },
      { id: 'bebe-alimentation', name: 'Alimentation', categorySlugs: ['bebe-alim-v2', 'alimentation-bebe'] },
      { id: 'bebe-soins', name: 'Soins & Hygiène', categorySlugs: ['bebe-soins-v2', 'soins-hygiene-bebe'] },
      { id: 'bebe-sante', name: 'Santé & Sécurité', categorySlugs: ['bebe-sante-v2', 'sante-securite-bebe'] },
      { id: 'bebe-jouets', name: 'Jouets & Éveil', categorySlugs: ['jouets-eveil-bebe'] },
      { id: 'bebe-chambre', name: 'Chambre Bébé', categorySlugs: ['chambre-bebe'] },
      { id: 'maman-maternite', name: 'Maman & Maternité', categorySlugs: ['maman-maternite-bebe'] }
    ]
  },
  {
    id: 'industrie-equipements',
    name: 'Industrie & Équipements',
    icon: Factory,
    items: [
      { id: 'machines', name: 'Machines & Équipements', categorySlugs: ['industrie-v3', 'industrie'] },
      { id: 'securite', name: 'Sécurité & EPI', categorySlugs: ['securite'] },
      { id: 'commercial', name: 'Fournitures commerciales', categorySlugs: ['pro'] }
    ]
  }
]
