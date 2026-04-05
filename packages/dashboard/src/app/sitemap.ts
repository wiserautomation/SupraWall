// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { i18n } from '../i18n/config';
import { SLUG_MAP } from '../i18n/slug-map';

const BASE_URL = 'https://www.supra-wall.com';

/**
 * Automatically discover routes in the src/app directory.
 */
function getRoutes(dir: string, baseRoute = '', isLocaleRoot = false): string[] {
    const routes: string[] = [];
    const absolutePath = path.resolve(dir);

    if (!fs.existsSync(absolutePath)) return [];

    const items = fs.readdirSync(absolutePath);

    for (const item of items) {
        const itemPath = path.join(absolutePath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            // Special handling for [lang] root
            if (item === '[lang]' && !isLocaleRoot) {
                // If we encounter [lang], we recurse into it but mark it as locale root
                // to avoid skipping its children
                routes.push(...getRoutes(itemPath, baseRoute, true));
                continue;
            }

            // Skip private folders, api, and protected routes
            if (
                item.startsWith('_') ||
                item.startsWith('(') ||
                (item.startsWith('[') && item !== '[lang]') ||
                ['api', 'admin', 'dashboard', 'connect', 'stripe', 'share'].includes(item)
            ) {
                continue;
            }

            const currentRoute = `${baseRoute}/${item}`;

            // Check if this directory has a page file
            const files = fs.readdirSync(itemPath);
            const hasPage = files.some(file =>
                file.startsWith('page.tsx') || file.startsWith('page.js')
            );

            if (hasPage) {
                routes.push(currentRoute);
            }

            // Recurse into subdirectories
            routes.push(...getRoutes(itemPath, currentRoute, isLocaleRoot));
        }
    }

    return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
    const appDir = path.join(process.cwd(), 'src', 'app');
    
    // Get base routes from app root (excluding [lang] for now)
    const baseRoutes = getRoutes(appDir);
    
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Combine manual and discovered routes
    const uniqueRoutes = Array.from(new Set(['/', ...baseRoutes]));

    uniqueRoutes.forEach((route) => {
        // Normalize the route path
        const internalSlug = route.split('/').filter(Boolean).join('/');

        // Generate entries for all supported locales
        i18n.locales.forEach((locale) => {
            const publicSlug = SLUG_MAP[internalSlug]?.[locale] || internalSlug;
            // Clean paths and ensure they start with /
            const localizedPath = `/${locale}/${publicSlug}`.replace(/\/+/g, '/').replace(/\/$/, '');
            const finalPath = localizedPath || `/${locale}`;
            const fullUrl = `${BASE_URL}${finalPath}`;

            // Build alternates for this URL
            const languages: Record<string, string> = {};
            i18n.locales.forEach((altLocale) => {
                const altPublicSlug = SLUG_MAP[internalSlug]?.[altLocale] || internalSlug;
                const altLocalizedPath = `/${altLocale}/${altPublicSlug}`.replace(/\/+/g, '/').replace(/\/$/, '');
                languages[altLocale] = `${BASE_URL}${altLocalizedPath || `/${altLocale}`}`;
            });
            
            // Add x-default (usually English)
            const defaultSlug = SLUG_MAP[internalSlug]?.['en'] || internalSlug;
            const defaultPath = `/en/${defaultSlug}`.replace(/\/+/g, '/').replace(/\/$/, '');
            languages['x-default'] = `${BASE_URL}${defaultPath || '/en'}`;

            sitemapEntries.push({
                url: fullUrl,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: internalSlug === '' ? 1.0 : internalSlug.split('/').length > 1 ? 0.6 : 0.8,
                // @ts-ignore
                alternates: {
                    languages,
                }
            });
        });
    });

    return sitemapEntries;
}

