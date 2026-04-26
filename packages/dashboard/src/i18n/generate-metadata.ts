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
    internalPath,
    ogImage = "/og-image.png",
    ogType = "article",
}: {
    params: Promise<{ lang: string }>;
    title: string;
    description: string;
    keywords?: string[];
    internalPath: string;
    ogImage?: string;
    ogType?: "article" | "website";
}): Promise<Metadata> {
    const { lang } = await params;
    
    // Helper to localize a full path
    const getLocalizedPath = (locale: string) => {
        const parts = internalPath.split('/').filter(Boolean);
        const localizedParts = parts.map(part => SLUG_MAP[part]?.[locale] || part);
        return `/${locale}/${localizedParts.join('/')}`.replace(/\/+/g, '/').replace(/\/$/, '');
    };

    const buildFullUrl = (path: string) => {
        try {
            return new URL(path.replace(/^\/+/, ''), BASE_URL.replace(/\/+$/, '') + '/').toString();
        } catch (e) {
            return `${BASE_URL}${path}`;
        }
    };

    // Build alternates for hreflang
    const languages: Record<string, string> = {};
    i18n.locales.forEach((locale) => {
        languages[locale] = buildFullUrl(getLocalizedPath(locale));
    });
    
    // Add x-default (English)
    languages['x-default'] = buildFullUrl(getLocalizedPath('en'));

    // Current page's canonical URL
    const canonical = buildFullUrl(getLocalizedPath(lang));

    return {
        title,
        description,
        keywords: keywords || [
            "AI security", "agent runtime", "suprawall",
            "deterministic ai defense", "llm firewall", "zero trust agents"
        ],
        alternates: {
            canonical,
            languages,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            title,
            description,
            url: canonical,
            siteName: "SupraWall",
            type: ogType,
            images: [ogImage],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        }
    };
}
