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
 * Safe URL builder to prevent double slashes or protocol-stripping bugs.
 * Uses the URL constructor for maximum robustness.
 */
function buildUrl(base: string, path: string): string {
    try {
        const url = new URL(path.replace(/^\/+/, ''), base.replace(/\/+$/, '') + '/');
        return url.toString();
    } catch (e) {
        // Fallback to template string if URL constructor fails
        const cleanBase = base.replace(/\/+$/, '');
        const cleanPath = path.replace(/^\/+/, '');
        return `${cleanBase}/${cleanPath}`;
    }
}

// Whitelist of internal paths allowed for German (de) translation indexing
const DE_PILLAR_WHITELIST = [
    '',
    'gdpr',
    'eu-ai-act',
    'features',
    'pricing',
    'compliance',
    'for-compliance-officers',
    'about'
];

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
        const internalPath = route.replace(/^\/+/, '');
        const baseInternalPath = internalPath.split('/')[0];

        // Generate entries for all supported locales
        i18n.locales.forEach((locale) => {
            // FILTER 1: German (de) only allowed for pillar pages
            if (locale === 'de' && !DE_PILLAR_WHITELIST.includes(baseInternalPath)) {
                return;
            }

            // FILTER 2: News and Sector templates are currently English-only
            if (locale !== 'en' && (internalPath.startsWith('news/') || internalPath.startsWith('compliance-templates/'))) {
                return;
            }

            const finalPath = getLocalizedPath(internalPath, locale);
            const fullUrl = buildUrl(BASE_URL, finalPath);

            sitemapEntries.push({
                url: fullUrl,
                lastModified: new Date(),
                changeFrequency: 'weekly' as const,
                priority: internalPath === '' ? 1.0 : internalPath.split('/').length > 1 ? 0.6 : 0.8,
                // HREFLANG removed from XML as per SEO plan (keep in head only)
            });
        });
    });

    return sitemapEntries;
}


