
/**
 * Utility to extract and normalize product attributes, 
 * especially for vehicles which have mixed French/English keys.
 */
export function getProductSpecs(attributes: any) {
  if (!attributes || typeof attributes !== 'object') return null;

  const normalized: Record<string, string | number> = {};

  // Year / Année
  const year = attributes.year || attributes.annee || attributes.Année;
  if (year) normalized.year = year;

  // Mileage / Kilométrage
  const mileage = attributes.mileage || attributes.kilometrage || attributes.Kilométrage || attributes.km;
  if (mileage) normalized.mileage = mileage;

  // Fuel / Carburant
  const fuel = attributes.fuel_type || attributes.carburant || attributes.Carburant || attributes.fuel;
  if (fuel) normalized.fuel = fuel;

  // Transmission / Boîte
  const transmission = attributes.transmission || attributes.boite || attributes.Boîte || attributes.gearbox;
  if (transmission) normalized.transmission = transmission;

  // Brand / Marque
  const brand = attributes.brand || attributes.marque || attributes.Marque;
  if (brand) normalized.brand = brand;

  // Model / Modèle
  const model = attributes.model || attributes.modele || attributes.Modèle;
  if (model) normalized.model = model;

  return Object.keys(normalized).length > 0 ? normalized : null;
}

export function isVehicle(product: any) {
  const categorySlug = product.category?.slug?.toLowerCase() || '';
  const attributes = product.attributes || {};
  
  const hasVehicleAttributes = 
    !!attributes.mileage || !!attributes.kilometrage || 
    !!attributes.year || !!attributes.annee ||
    !!attributes.transmission || !!attributes.boite;

  return categorySlug.includes('voiture') || 
         categorySlug.includes('vehicule') || 
         categorySlug.includes('car') ||
         hasVehicleAttributes;
}
