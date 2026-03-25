// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { MetadataRoute } from 'next';
import fs from 'fs';
import path from 'path';

/**
 * BASE URL for the sitemap.
 * Priority: Used in layout metadata and new SEO pages as www.supra-wall.com
 */
const BASE_URL = 'https://www.supra-wall.com';

/**
 * Automatically discovery routes in the src/app directory.
 * This runs during 'next build' to generate the dynamic sitemap.
 */
function getRoutes(dir: string, baseRoute = ''): string[] {
    const routes: string[] = [];
    const absolutePath = path.resolve(dir);

    if (!fs.existsSync(absolutePath)) return [];

    const items = fs.readdirSync(absolutePath);

    for (const item of items) {
        const itemPath = path.join(absolutePath, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            // Skip private folders, api, and protected routes
            // Exclude dashboard and admin as per robots.txt
            if (
                item.startsWith('_') ||
                item.startsWith('(') ||
                item.startsWith('[') ||
                ['api', 'admin', 'dashboard', 'connect'].includes(item)
            ) {
                continue;
            }

            const currentRoute = `${baseRoute}/${item}`;

            // Check if this directory has a page file (tsx or js)
            const hasPage = fs.readdirSync(itemPath).some(file =>
                file.startsWith('page.tsx') || file.startsWith('page.js')
            );

            if (hasPage) {
                routes.push(currentRoute);
            }

            // Recurse into subdirectories
            routes.push(...getRoutes(itemPath, currentRoute));
        }
    }

    return routes;
}

export default function sitemap(): MetadataRoute.Sitemap {
    // Discovery routes relative to the app root
    // We assume the standard src/app structure
    const appDir = path.join(process.cwd(), 'src', 'app');
    const discoveredRoutes = ['/', ...getRoutes(appDir)];

    // De-duplicate
    const uniqueRoutes = Array.from(new Set(discoveredRoutes));

    return uniqueRoutes.map((route) => {
        // Clean up double slashes and trailing slashes
        const cleanRoute = route.replace(/\/+/g, '/').replace(/\/$/, '') || '';

        return {
            url: `${BASE_URL}${cleanRoute}`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: cleanRoute === '' ? 1.0 : cleanRoute.split('/').length > 2 ? 0.6 : 0.8,
        };
    });
}
