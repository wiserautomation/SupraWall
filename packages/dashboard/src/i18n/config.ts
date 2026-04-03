// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'de', 'fr', 'es', 'it', 'pl', 'nl'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
