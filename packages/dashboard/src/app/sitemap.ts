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
    
    // We want to generate a flat list of all localized versions
    const allLocalizedRoutes: string[] = [];
    
    // For each discovered route, generate it for each locale
    // Note: This assumes that slugs are the same across languages in the file system,
    // which they are if we use [lang]/[...slug]. 
    // If we have distinct folders like /de/vorordnung, we'd need more complex mapping.
    // For Phase 1, we assume structure migration.
    
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Combine manual and discovered routes
    const uniqueRoutes = Array.from(new Set(['/', ...baseRoutes]));

    uniqueRoutes.forEach((route) => {
        const cleanRoute = route.replace(/\/+/g, '/').replace(/\/$/, '') || '';
        // Extract internal slug to check against SLUG_MAP
        const internalSlug = cleanRoute.startsWith('/') ? cleanRoute.substring(1) : cleanRoute;

        // ONLY generate sitemap entries for English for now
        // This avoids crawling non-existent localized pages until dictionaries are full
        const locale = 'en';
        const publicSlug = SLUG_MAP[internalSlug]?.[locale] || internalSlug;
        const localizedPath = `/${locale}/${publicSlug}`.replace(/\/+/g, '/');
        const fullUrl = `${BASE_URL}${localizedPath}`;

        sitemapEntries.push({
            url: fullUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: cleanRoute === '' ? 1.0 : cleanRoute.split('/').length > 2 ? 0.6 : 0.8,
        });
    });

    return sitemapEntries;
}
