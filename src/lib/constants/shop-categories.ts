import { ShopType } from '@prisma/client';

export const SHOP_DOMAIN_MAPPING: Record<ShopType, string[]> = {
  FASHION_STORE: ['Mode & Accessoires'],
  BEAUTY_STORE: ['Beauté & Cosmétiques', 'Soins corporels'],
  HOME_STORE: ['Maison & Décoration', 'Cuisine & Ustensiles'],
  ELECTRONICS_STORE: ['Électronique & Technologie'],
  VEHICLE_SHOWROOM: ['Véhicules & Mobilité'],
  AUTO_PARTS_STORE: ['Automobile & Accessoires'],
  CONSTRUCTION_STORE: ['Construction & Matériaux'],
  PACKAGING_STORE: ['Emballage & Conditionnement'],
  FMCG_STORE: ['Produits ménagers & Hygiène'],
  FOOD_STORE: ['Alimentaire & Denrées'],
  INDUSTRIAL_STORE: ['Industrie & Gros'],
  KIDS_STORE: ['Enfants & Jouets'],
  GENERAL_STORE: ['Mode & Accessoires', 'Beauté & Cosmétiques', 'Maison & Décoration', 'Électronique & Technologie'],
  WHOLESALE_STORE: ['Alimentaire & Denrées', 'Produits ménagers & Hygiène', 'Emballage & Conditionnement'],
};

export const SHOP_LABELS: Record<ShopType, string> = {
  FASHION_STORE: 'Mode & Luxe',
  BEAUTY_STORE: 'Beauté & Soins',
  HOME_STORE: 'Maison & Déco',
  ELECTRONICS_STORE: 'High-Tech & Électronique',
  VEHICLE_SHOWROOM: 'Véhicules & Mobilité',
  AUTO_PARTS_STORE: 'Pièces Auto & Accessoires',
  CONSTRUCTION_STORE: 'Construction & BTP',
  PACKAGING_STORE: 'Emballages & Packaging',
  FMCG_STORE: 'Hygiène & Entretien',
  FOOD_STORE: 'Alimentation & Boissons',
  INDUSTRIAL_STORE: 'Industrie & Équipements',
  KIDS_STORE: 'Univers Enfants',
  GENERAL_STORE: 'Magasin Généraliste',
  WHOLESALE_STORE: 'Grossiste Généraliste',
};

/**
 * Retourne les noms des domaines (Level 1 Categories) autorisés pour un type de boutique donné.
 */
export function getAllowedDomainNames(shopType: ShopType): string[] {
  return SHOP_DOMAIN_MAPPING[shopType] || [];
}
