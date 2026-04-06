// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from 'next';
import { i18n, Locale } from './config';
import { SLUG_MAP } from './slug-map';

const BASE_URL = 'https://www.supra-wall.com';

/**
 * generateLocalizedMetadata: Standardized generator for all pages to ensure correct
 * canonical and hreflang signals, preventing "crawled but not indexed" failures.
 */
export async function generateLocalizedMetadata({
    params,
    title,
    description,
    keywords,
    internalPath, // e.g. "learn/ai-agent-runaway-costs"
}: {
    params: Promise<{ lang: string }>;
    title: string;
    description: string;
    keywords?: string[];
    internalPath: string;
}): Promise<Metadata> {
    const { lang } = await params;
    
    // Normalize path components
    const pathParts = internalPath.split('/').filter(Boolean);
    const parentPaths = pathParts.slice(0, -1);
    const internalSlug = pathParts[pathParts.length - 1];

    // Build alternates for hreflang
    const languages: Record<string, string> = {};
    i18n.locales.forEach((locale) => {
        const publicSlug = SLUG_MAP[internalSlug]?.[locale] || internalSlug;
        const localizedPath = `/${locale}/${[...parentPaths, publicSlug].join('/')}`.replace(/\/+/g, '/').replace(/\/$/, '');
        languages[locale] = `${BASE_URL}${localizedPath}`;
    });
    
    // Add x-default (usually English)
    const enSlug = SLUG_MAP[internalSlug]?.['en'] || internalSlug;
    const xDefaultPath = `/en/${[...parentPaths, enSlug].join('/')}`.replace(/\/+/g, '/').replace(/\/$/, '');
    languages['x-default'] = `${BASE_URL}${xDefaultPath}`;

    // Current page's localized public path
    const currentSlug = SLUG_MAP[internalSlug]?.[lang] || internalSlug;
    const currentPath = `/${lang}/${[...parentPaths, currentSlug].join('/')}`.replace(/\/+/g, '/').replace(/\/$/, '');
    const canonical = `${BASE_URL}${currentPath}`;

    return {
        title,
        description,
        keywords,
        alternates: {
            canonical,
            languages,
        },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: "SupraWall",
            type: "article",
            images: ["/og-image.png"],
        }
    };
}
