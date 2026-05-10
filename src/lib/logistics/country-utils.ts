import { ALL_COUNTRIES } from '../constants/countries';

/**
 * Resolves a country name to its standard French name used in the system.
 * Handles ISO codes (AE, TR, CD) and common aliases (UAE).
 */
export function resolveStandardCountryName(input: string | null | undefined): string {
  if (!input) return "Sharufa Central";

  const normalizedInput = input.trim().toUpperCase();

  // Special cases / Aliases
  if (normalizedInput === 'UAE') return 'Émirats arabes unis';
  if (normalizedInput === 'UK') return 'Royaume-Uni';
  if (normalizedInput === 'USA') return 'États-Unis';

  // Try to find by code
  const byCode = ALL_COUNTRIES.find(c => c.code === normalizedInput);
  if (byCode) return byCode.name;

  // Try to find by name (case-insensitive)
  const byName = ALL_COUNTRIES.find(c => c.name.toLowerCase() === input.trim().toLowerCase());
  if (byName) return byName.name;

  // Fallback to original input if no match found
  return input.trim();
}
