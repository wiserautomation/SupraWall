import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';
import { i18n } from '../i18n/config';
import { SLUG_MAP } from '../i18n/slug-map';
import { newsArticles } from './[lang]/news/newsData';
import { sectorTemplates } from '../data/compliance-matrix';

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

/**
 * Helper to localize a full path
 */
function getLocalizedPath(internalPath: string, locale: string): string {
    const parts = internalPath.split('/').filter(Boolean);
    const localizedParts = parts.map(part => SLUG_MAP[part]?.[locale] || part);
    return `/${locale}/${localizedParts.join('/')}`.replace(/\/+/g, '/').replace(/\/$/, '');
}

/**
 * Safe URL builder to prevent double slashes.
 */
function buildUrl(base: string, path: string): string {
    const cleanBase = base.replace(/\/+$/, '');
    const cleanPath = path.replace(/^\/+/, '');
    return `${cleanBase}/${cleanPath}`;
}


export default function sitemap(): MetadataRoute.Sitemap {
    const appDir = path.join(process.cwd(), 'src', 'app');
    
    // Get base routes
    const baseRoutes = getRoutes(appDir);
    
    // Explicitly add dynamic routes
    const newsRoutes = newsArticles.filter((a: any) => a.published).map((a: any) => `/news/${a.slug}`);
    const sectorRoutes = sectorTemplates.map((t: any) => `/compliance-templates/${t.slug}`);
    
    const sitemapEntries: MetadataRoute.Sitemap = [];

    // Combine manual and discovered routes
    const uniqueRoutes = Array.from(new Set(['', ...baseRoutes, ...newsRoutes, ...sectorRoutes]));

    uniqueRoutes.forEach((route) => {
        // Normalize the route path
        const internalPath = route;

        // Generate entries for all supported locales
        i18n.locales.forEach((locale) => {
            const finalPath = getLocalizedPath(internalPath, locale);
            const fullUrl = buildUrl(BASE_URL, finalPath || `/${locale}`);

            // Build alternates for this URL
            const languages: Record<string, string> = {};
            i18n.locales.forEach((altLocale) => {
                const altPath = getLocalizedPath(internalPath, altLocale);
                languages[altLocale] = buildUrl(BASE_URL, altPath || `/${altLocale}`);
            });
            
            // Add x-default (pointing to English version)
            const xDefaultPath = getLocalizedPath(internalPath, 'en');
            languages['x-default'] = buildUrl(BASE_URL, xDefaultPath || '/en');

            sitemapEntries.push({
                url: fullUrl,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: internalPath === '' ? 1.0 : internalPath.split('/').length > 2 ? 0.6 : 0.8,
                // @ts-ignore
                alternates: {
                    languages,
                }
            });
        });
    });

    return sitemapEntries;
}

