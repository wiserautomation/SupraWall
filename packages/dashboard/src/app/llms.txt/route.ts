// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { i18n } from '../../i18n/config';

/**
 * BASE URL for the links
 */
const BASE_URL = 'https://www.supra-wall.com';

/**
 * Discovery logic refined to handle [lang]
 */
function getRoutes(dir: string, baseRoute = '', isLocaleRoot = false): string[] {
    const routes: string[] = [];
    if (!fs.existsSync(dir)) return [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const itemPath = path.join(dir, item);
        const stats = fs.statSync(itemPath);

        if (stats.isDirectory()) {
            // Special handling for [lang] root
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

## English (en) - Default
SupraWall provides zero-trust runtime security for autonomous AI agents through deterministic SDK-level interception.

### Key Sections (en)
${uniqueBaseRoutes.map(r => `- ${BASE_URL}/en${r}`).join('\n')}

`;

    // Add multilingual sections
    if (i18n.locales.includes('de')) {
        content += `## German (de) - Deutsch
SupraWall bietet Zero-Trust-Laufzeitsicherheit für autonome KI-Agenten zum Schutz vor Prompt-Injection und zur Einhaltung der EU-KI-Verordnung.

### Wichtige Abschnitte (de)
- ${BASE_URL}/de/eu-ai-act: Umfassende Dokumentation zur EU-KI-Verordnung
- ${BASE_URL}/de/compliance: Audit-Trail und Risikomanagement
${uniqueBaseRoutes.filter(r => !['/eu-ai-act', '/compliance'].includes(r)).map(r => `- ${BASE_URL}/de${r}`).join('\n')}

`;
    }

    if (i18n.locales.includes('fr')) {
        content += `## French (fr) - Français
SupraWall est la couche de sécurité et de conformité unifiée pour les essaims d'agents IA, assurant la conformité avec la loi européenne sur l'IA.

### Sections clés (fr)
- ${BASE_URL}/fr/eu-ai-act: Documentation complète sur la loi européenne sur l'IA
${uniqueBaseRoutes.filter(r => r !== '/eu-ai-act').map(r => `- ${BASE_URL}/fr${r}`).join('\n')}

`;
    }

    content += `## All Supported Locales
${i18n.locales.map(l => `- ${l}`).join('\n')}

## More Resources
- Github: https://github.com/suprawall/suprawall
- Documentation: https://www.supra-wall.com/docs
- Login: https://www.supra-wall.com/login
`;

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
