import { getBaseUrl } from './config';

/**
 * Configuration centralisée pour les redirections vers le portail d'authentification.
 */
export const AUTH_CONFIG = {
  // Flag pour activer la redirection vers le portail autonome
  // On le garde à false par défaut jusqu'à validation complète de apps/auth
  USE_STANDALONE_AUTH: process.env.NEXT_PUBLIC_USE_STANDALONE_AUTH === 'true',
  
  // URL du portail d'authentification
  // En local: http://login.sharufa.test:3001
  // En prod: https://login.sharufa.com
  AUTH_PORTAL_URL: process.env.NEXT_PUBLIC_AUTH_PORTAL_URL || 'https://login.sharufa.com',
  
  // Flag pour activer la redirection vers le portail vendeur autonome
  USE_STANDALONE_SELLER: process.env.NEXT_PUBLIC_USE_STANDALONE_SELLER === 'true',
  SELLER_PORTAL_URL: process.env.NEXT_PUBLIC_SELLER_PORTAL_URL || 'https://seller.sharufa.com',

  // Flag pour activer la redirection vers le portail admin autonome
  USE_STANDALONE_ADMIN: process.env.NEXT_PUBLIC_USE_STANDALONE_ADMIN === 'true',
  ADMIN_PORTAL_URL: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'https://admin.sharufa.com',

  // Flag pour activer la redirection vers le portail cargo autonome
  USE_STANDALONE_CARGO: process.env.NEXT_PUBLIC_USE_STANDALONE_CARGO === 'true',
  CARGO_PORTAL_URL: process.env.NEXT_PUBLIC_CARGO_PORTAL_URL || 'https://cargo.sharufa.com',

  // Flag pour activer la redirection vers le portail web autonome
  USE_STANDALONE_WEB: process.env.NEXT_PUBLIC_USE_STANDALONE_WEB === 'true',
  WEB_PORTAL_URL: process.env.NEXT_PUBLIC_WEB_PORTAL_URL || 'https://sharufa.com',
};

export function getAuthRedirectUrl(path: string, returnTo?: string) {
  if (!AUTH_CONFIG.USE_STANDALONE_AUTH) {
    const url = new URL(path, getBaseUrl());
    if (returnTo) url.searchParams.set('next', returnTo);
    return url.toString();
  }

  const url = new URL(path, AUTH_CONFIG.AUTH_PORTAL_URL);
  if (returnTo) {
    // On s'assure que le returnTo est sécurisé ou relatif
    url.searchParams.set('next', returnTo);
  }
  return url.toString();
}
