// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * SLUG_MAP: The single source of truth for localized URL aliases.
 * 
 * Key: The internal folder name (e.g., 'eu-ai-act')
 * Value: Map of locale to public-facing localized slug (e.g., 'eu-ki-verordnung')
 */
export const SLUG_MAP: Record<string, Record<string, string>> = {
  'eu-ai-act': {
    de: 'eu-ki-verordnung',
    fr: 'loi-ia-ue',
    es: 'reglamento-ia-ue',
    it: 'regolamento-ia-ue',
    pl: 'rozporzadzenie-ai',
    nl: 'eu-ai-verordening'
  },
  'compliance': {
    de: 'compliance-dashboard',
    fr: 'tableau-de-bord-conformite',
    es: 'panel-de-cumplimiento',
  },
  'gdpr': {
    de: 'dsgvo',
    fr: 'rgpd',
    es: 'rgpd',
    it: 'rgpd',
    pl: 'rodo',
    nl: 'avg'
  },
  'pricing': {
    de: 'preise',
    fr: 'tarifs',
    es: 'precios',
    it: 'prezzi',
    pl: 'cennik',
    nl: 'prijzen'
  },
  'about': {
    de: 'ueber-uns',
    fr: 'a-propos',
    es: 'sobre-nosotros',
  },
  'features': {
    de: 'funktionen',
    fr: 'fonctionnalites',
    es: 'caracteristicas',
  }
};

/**
 * Helper to get the public slug for a given internal path and locale.
 */
export function getPublicSlug(internalPath: string, locale: string): string {
  // Extract the segment after the locale if it's a full path
  const parts = internalPath.split('/').filter(Boolean);
  const internalSlug = parts[parts.length - 1];
  
  if (SLUG_MAP[internalSlug]?.[locale]) {
    return SLUG_MAP[internalSlug][locale];
  }
  
  return internalSlug;
}
