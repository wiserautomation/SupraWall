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
  'compliance-templates': {
    de: 'compliance-vorlagen',
    fr: 'modeles-conformite',
    es: 'plantillas-cumplimiento',
    it: 'modelli-conformita',
    pl: 'szablony-zgodnosci',
    nl: 'compliance-sjablonen'
  },
  'hr-employment': {
    de: 'personalwesen-beschaeftigung',
    fr: 'rh-emploi',
    es: 'recursos-humanos-empleo',
    it: 'risorse-umane-lavoro',
    pl: 'kadry-i-zatrudnienie',
    nl: 'hr-werkgelegenheid'
  },
  'healthcare': {
    de: 'gesundheitswesen',
    fr: 'sante',
    es: 'atencion-sanitaria',
    it: 'sanita',
    pl: 'opieka-zdrowotna',
    nl: 'gezondheidszorg'
  },
  'education': {
    de: 'bildungswesen',
    fr: 'education',
    es: 'educacion',
    it: 'istruzione',
    pl: 'edukacja',
    nl: 'onderwijs'
  },
  'critical-infrastructure': {
    de: 'kritische-infrastruktur',
    fr: 'infrastructures-critiques',
    es: 'infraestructura-critica',
    it: 'infrastrutture-critiche',
    pl: 'infrastruktura-krytyczna',
    nl: 'kritieke-infrastructuur'
  },
  'biometrics': {
    de: 'biometrie',
    fr: 'biometrie',
    es: 'biometria',
    it: 'biometria',
    pl: 'biometria',
    nl: 'biometrie'
  },
  'law-enforcement': {
    de: 'strafverfolgung',
    fr: 'application-de-la-loi',
    es: 'fuerzas-del-orden',
    it: 'forze-dell-ordine',
    pl: 'egzekwowanie-prawa',
    nl: 'wetshandhaving'
  },
  'migration-border': {
    de: 'migration-grenzkontrolle',
    fr: 'migration-frontieres',
    es: 'migracion-fronteras',
    it: 'migrazione-frontiere',
    pl: 'migracja-granice',
    nl: 'migratie-grenzen'
  },
  'justice-democracy': {
    de: 'justiz-demokratie',
    fr: 'justice-democratie',
    es: 'justicia-democracia',
    it: 'giustizia-democrazia',
    pl: 'wymiar-sprawiedliwosci-demokracja',
    nl: 'rechtspraak-democratie'
  },
  'baseline-controls': {
    de: 'basiskontrollen',
    fr: 'controles-de-base',
    es: 'controles-base',
    it: 'controlli-base',
    pl: 'podstawowe-mechanizmy-kontrolne',
    nl: 'basiscontroles'
  },
  'conformity-assessment': {
    de: 'konformitaetsbewertung',
    fr: 'evaluation-de-la-conformite',
    es: 'evaluacion-de-conformidad',
    it: 'valutazione-della-conformita',
    pl: 'ocena-zgodnosci',
    nl: 'conformiteitsbeoordeling'
  },
  'deadline-august-2026': {
    de: 'frist-august-2026',
    fr: 'echeance-aout-2026',
    es: 'fecha-limite-agosto-2026',
    it: 'scadenza-agosto-2026',
    pl: 'termin-sierpien-2026',
    nl: 'deadline-augustus-2026'
  },
  'multi-sector-agents': {
    de: 'multi-sektor-agenten',
    fr: 'agents-multi-sectoriels',
    es: 'agentes-multisectoriales',
    it: 'agenti-multisettoriali',
    pl: 'agenci-wielosektorowi',
    nl: 'multi-sectorale-agenten'
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
  },
  'for-hr-teams': {
    de: 'fuer-hr-teams',
    fr: 'pour-les-rh',
    es: 'para-equipos-hr',
    it: 'per-team-hr',
    pl: 'dla-zespolow-hr',
    nl: 'voor-hr-teams'
  },
  'for-banking-teams': {
    de: 'fuer-banken-teams',
    fr: 'pour-les-banques',
    es: 'para-equipos-banca',
    it: 'per-team-bancari',
    pl: 'dla-zespolow-bankowych',
    nl: 'voor-bankteams'
  },
  'for-healthcare-teams': {
    de: 'fuer-gesundheitswesen',
    fr: 'pour-les-equipes-sante',
    es: 'para-equipos-sanitarios',
    it: 'per-team-sanitari',
    pl: 'dla-zespolow-ochrony-zdrowia',
    nl: 'voor-zorgteams'
  },
  'for-legal-teams': {
    de: 'fuer-rechtsabteilungen',
    fr: 'pour-les-equipes-juridiques',
    es: 'para-equipos-legales',
    it: 'per-team-legali',
    pl: 'dla-zespolow-prawnych',
    nl: 'voor-juridische-teams'
  },
  'for-executives': {
    de: 'fuer-fuehrungskraefte',
    fr: 'pour-les-dirigeants',
    es: 'para-ejecutivos',
    it: 'per-dirigenti',
    pl: 'dla-kadry-zarzadzajacej',
    nl: 'voor-leidinggevenden'
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
