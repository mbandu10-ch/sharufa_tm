/**
 * Détermine le domaine à utiliser pour les cookies de session.
 * En production, retourne le domaine partagé (ex: .sharufa.com).
 * En local, retourne undefined pour laisser le navigateur utiliser le domaine exact (localhost).
 */
export const getCookieDomain = (): string | undefined => {
  const domain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN;
  if (!domain) {
    return undefined; // Fallback for localhost / default behavior
  }
  return domain;
};
