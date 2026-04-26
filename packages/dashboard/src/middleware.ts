// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n/config';
import { SLUG_MAP } from './i18n/slug-map';

/**
 * Reverse SLUG_MAP for reverse lookup.
 * Structure: { locale: { localizedSlug: internalPath } }
 */
const REVERSE_SLUG_MAP: Record<string, Record<string, string>> = {};

// Build REVERSE_SLUG_MAP once on initialization
Object.keys(SLUG_MAP).forEach(internalPath => {
  const translations = SLUG_MAP[internalPath];
  Object.keys(translations).forEach(locale => {
    if (!REVERSE_SLUG_MAP[locale]) REVERSE_SLUG_MAP[locale] = {};
    REVERSE_SLUG_MAP[locale][translations[locale]] = internalPath;
  });
});

/**
 * Get the locale from request headers.
 */
function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return i18n.defaultLocale;

  const languages = acceptLanguage.split(',').map((lang) => {
    const [tag] = lang.split(';q=');
    return tag.trim().split('-')[0].toLowerCase();
  });

  const matched = languages.find((lang) => 
    i18n.locales.includes(lang as any)
  );

  return matched || i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if there is any supported locale in the pathname
  const locale = i18n.locales.find(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );

  if (locale) {
    // RESOLVE LOCALIZED SLUGS
    // Example: /de/funktionen -> /de/features
    const parts = pathname.split('/').filter(Boolean); // [de, funktionen]
    const currentLocale = parts[0];
    const pathSegments = parts.slice(1); // [funktionen]

    let hasUpdate = false;
    const resolvedSegments = pathSegments.map(segment => {
       const internal = REVERSE_SLUG_MAP[currentLocale]?.[segment];
       if (internal) {
         hasUpdate = true;
         return internal;
       }
       return segment;
    });

    if (hasUpdate) {
      const resolvedPath = `/${currentLocale}/${resolvedSegments.join('/')}`;
      return NextResponse.rewrite(new URL(resolvedPath, request.url));
    }

    return;
  }

  // Redirect if there is no locale
  const detectedLocale = getLocale(request);
  
  // Create a new URL for the redirect
  const url = new URL(request.url);
  url.pathname = `/${detectedLocale}${pathname === '/' ? '' : pathname}`;
  
  // Use 301 (Permanent Redirect) for marketing SEO
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, static)
    // Skip static files (images, favicon, robots.txt, etc.)
    // Skip API routes
    // Skip internal dashboard area logic (which should handle its own session)
    // BUT INCLUDE login and admin/login to handle the root-level redirect to [lang]
    '/((?!api|dashboard|share|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|og-image.png|.*\\..*).*)',
  ],
};
