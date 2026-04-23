// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import 'server-only';
import type { Locale } from './config';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default),
  fr: () => import('./dictionaries/fr.json').then((module) => module.default),
  es: () => import('./dictionaries/es.json').then((module) => module.default),
  it: () => import('./dictionaries/it.json').then((module) => module.default),
  pl: () => import('./dictionaries/pl.json').then((module) => module.default),
  nl: () => import('./dictionaries/nl.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  return dictionaries[locale]?.() ?? dictionaries.en();
};
