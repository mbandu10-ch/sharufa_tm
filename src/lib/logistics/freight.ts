import { prisma } from '@/lib/prisma'

export interface FreightCalcItem {
  weight?: number | null // Poids réel unitaire
  length?: number | null // cm
  width?: number | null  // cm
  height?: number | null // cm
  quantity: number
}

/**
 * Moteur de calcul du fret logistique.
 * Analyse le poids réel, le volume CBM et le diviseur volumétrique pour chaque règle disponible.
 */
export async function calculateFreightOptions(
  originCountry: string,
  destinationCountry: string,
  items: FreightCalcItem[]
) {
  // Trouver toutes les règles de fret actives pour cette route
  const rules = await prisma.freightRule.findMany({
    where: {
      originCountry: { equals: originCountry, mode: 'insensitive' },
      destinationCountry: { equals: destinationCountry, mode: 'insensitive' },
      isActive: true
    }
  })

  // S'il n'y a pas de règle, on ne peut pas calculer de fret
  if (rules.length === 0) {
    return { options: [] }
  }

  let totalWeightKg = 0
  let totalVolumeCbm = 0

  // Standard : Si un produit n'a pas de dimension/poids par défaut :
  // On place un fallback minimum symbolique pour éviter des envois gratuits par erreur.
  const DEFAULT_WEIGHT = 0.5 // 500g
  const DEFAULT_L = 10, DEFAULT_W = 10, DEFAULT_H = 10 // cm

  items.forEach(item => {
    const q = item.quantity
    const w = item.weight && item.weight > 0 ? item.weight : DEFAULT_WEIGHT
    totalWeightKg += (w * q)

    const l = item.length && item.length > 0 ? item.length : DEFAULT_L
    const wd = item.width && item.width > 0 ? item.width : DEFAULT_W
    const h = item.height && item.height > 0 ? item.height : DEFAULT_H
    
    // Formule CBM : (L x l x H en cm) / 1,000,000 = Volume en Mètre Cube (CBM)
    totalVolumeCbm += ((l * wd * h) / 1000000) * q
  })

  const options = rules.map(rule => {
    let chargeableWeight = totalWeightKg
    let amount = 0
    let volumetricWeightKg = 0

    if (rule.transportMode === 'AIR') {
      // Poids Volumétrique = Volume (cm3) / Diviseur Volumétrique (ex: 6000)
      volumetricWeightKg = (totalVolumeCbm * 1000000) / rule.volumetricDivisor
      
      // En fret aérien, on facture toujours sur la valeur la plus haute entre Réel et Volumétrique
      chargeableWeight = Math.max(totalWeightKg, volumetricWeightKg)
      
      if (rule.pricePerKg) {
        amount = chargeableWeight * rule.pricePerKg
      }
    } else if (rule.transportMode === 'SEA') {
      // En fret maritime, la norme est la tarification directe par CBM (Mètre cube)
      if (rule.pricePerCbm && totalVolumeCbm > 0) {
        // En dessous d'un certain CBM, on applique le charge minimum, sinon on multiplie
        amount = totalVolumeCbm * rule.pricePerCbm
      } else if (rule.pricePerKg) {
        // Mode dégradé si le transporteur maritime facture exceptionnellement au kg
        amount = totalWeightKg * rule.pricePerKg
      }
    }

    // Application du Minimum Charge (Ex: "Quoi qu'il arrive, l'envoi coûte au moins 10.000 FCFA")
    amount = Math.max(amount, rule.minimumCharge || 0)

    // Arrondir au supérieur
    amount = Math.ceil(amount)

    return {
      ruleId: rule.id,
      transportMode: rule.transportMode,
      chargeableWeight,
      realWeightKg: totalWeightKg,
      volumetricWeightKg,
      totalVolumeCbm,
      amount,
      estimatedMinDays: rule.estimatedMinDays,
      estimatedMaxDays: rule.estimatedMaxDays,
      allowPayAtDestination: rule.allowPayAtDestination
    }
  })

  // On trie par prix (L'option la moins chère en premier)
  return {
    options: options.sort((a, b) => a.amount - b.amount)
  }
}
