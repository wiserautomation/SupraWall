// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { i18n } from '../../i18n/config';
import { SLUG_MAP } from '../../i18n/slug-map';

const BASE_URL = 'https://www.supra-wall.com';

function getRoutes(dir: string, baseRoute = '', isLocaleRoot = false): string[] {
    const routes: string[] = [];
    if (!fs.existsSync(dir)) return [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            if (item === '[lang]' && !isLocaleRoot) {
                routes.push(...getRoutes(itemPath, baseRoute, true));
                continue;
            }

            if (
                item.startsWith('_') ||
                item.startsWith('(') ||
                (item.startsWith('[') && item !== '[lang]') ||
                ['api', 'admin', 'dashboard', 'connect', 'stripe', 'share'].includes(item)
            ) continue;

            const currentRoute = `${baseRoute}/${item}`;
            if (fs.readdirSync(itemPath).some(f => f.startsWith('page.'))) {
                routes.push(currentRoute);
            }
            routes.push(...getRoutes(itemPath, currentRoute, isLocaleRoot));
        }
    }
    return routes;
}

export async function GET() {
    const appDir = path.join(process.cwd(), 'src', 'app');
    const baseRoutes = getRoutes(appDir);
    const uniqueBaseRoutes = Array.from(new Set(['/', ...baseRoutes])).map(r => r.replace(/\/+/g, '/').replace(/\/$/, '') || '');

    let content = `# SupraWall — The Compliance OS for Autonomous AI Agents

> SupraWall is the unified security and compliance layer for AI agent swarms. One-line SDK middleware that wraps LangChain, CrewAI, AutoGen, Vercel AI SDK, and MCP agents with enterprise governance.

## Languages
SupraWall content is available in: English (default), German (de), French (fr), Spanish (es), Italian (it), Polish (pl), Dutch (nl).
- EU AI Act compliance content: /de/eu-ki-verordnung, /fr/loi-ia-ue, /es/reglamento-ia-ue

## All Pages (Multilingual)
Metadata and descriptions in English for indexing optimization.

${uniqueBaseRoutes.flatMap(r => {
    const internalSlug = r.startsWith('/') ? r.substring(1) : r;
    return i18n.locales.map(locale => {
        const publicSlug = SLUG_MAP[internalSlug]?.[locale] || internalSlug;
        const localizedPath = `/${locale}/${publicSlug}`.replace(/\/+/g, '/');
        const description = locale === 'en' ? 'Core documentation' : `Localized version for ${locale} market`;
        return `- ${BASE_URL}${localizedPath}: ${description}`;
    });
}).join('\n')}

## Resource Links
- Website: https://www.supra-wall.com
- Github: https://github.com/wiserautomation/SupraWall
- Contact: founders@supra-wall.com
`;

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
