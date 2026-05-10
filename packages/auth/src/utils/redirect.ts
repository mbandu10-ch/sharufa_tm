const ALLOWED_DOMAINS = [
  'sharufa.com',
  'login.sharufa.com',
  'seller.sharufa.com',
  'admin.sharufa.com',
  'cargo.sharufa.com',
];

/**
 * Valide une URL de redirection (returnTo) pour prévenir les failles d'Open Redirect.
 * Accepte les chemins relatifs (ex: /dashboard) et les URLs absolues vers les domaines autorisés.
 * En local (dev), on peut assouplir si nécessaire, mais il est préférable de 
 * vérifier avec l'environnement ou un port par défaut, ou ignorer la vérification de domaine exact.
 */
export const getSafeReturnTo = (returnTo: string | null | undefined, fallback: string = '/'): string => {
  if (!returnTo) return fallback;

  try {
    // 1. Vérifier si c'est un chemin relatif pur (ex: /dashboard)
    if (returnTo.startsWith('/') && !returnTo.startsWith('//')) {
      return returnTo;
    }

    // 2. Vérifier si c'est une URL absolue
    const url = new URL(returnTo);
    
    // Tolérance pour localhost en développement
    if (process.env.NODE_ENV !== 'production' && url.hostname === 'localhost') {
      return returnTo;
    }

    // Tolérance pour .sharufa.test si configuré en local
    if (process.env.NODE_ENV !== 'production' && url.hostname.endsWith('.sharufa.test')) {
      return returnTo;
    }

    // 3. Vérification de la liste blanche en production
    if (ALLOWED_DOMAINS.includes(url.hostname)) {
      return returnTo;
    }

    // Si le domaine n'est pas autorisé, on fallback
    console.warn(`Tentative de redirection non autorisée détectée vers : ${returnTo}`);
    return fallback;

  } catch (error) {
    // Si l'URL est malformée (ex: javascript:alert(1))
    return fallback;
  }
};
