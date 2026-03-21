import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * BASE URL for the links
 */
const BASE_URL = 'https://www.supra-wall.com';

/**
 * Discovery logic similar to sitemap.ts
 */
function getRoutes(dir: string, baseRoute = ''): string[] {
    const routes: string[] = [];
    if (!fs.existsSync(dir)) return [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        if (
            item.startsWith('_') ||
            item.startsWith('(') ||
            item.startsWith('[') ||
            ['api', 'admin', 'dashboard', 'connect'].includes(item)
        ) continue;

        const itemPath = path.join(dir, item);
        if (fs.statSync(itemPath).isDirectory()) {
            const currentRoute = `${baseRoute}/${item}`;
            if (fs.readdirSync(itemPath).some(f => f.startsWith('page.'))) {
                routes.push(currentRoute);
            }
            routes.push(...getRoutes(itemPath, currentRoute));
        }
    }
    return routes;
}

export async function GET() {
    const appDir = path.join(process.cwd(), 'src', 'app');
    const routes = ['/', ...getRoutes(appDir)];
    const uniqueRoutes = Array.from(new Set(routes)).map(r => r.replace(/\/+/g, '/').replace(/\/$/, '') || '');

    const content = `# SupraWall — AI Agent Security & EU AI Act Compliance Platform

## What is SupraWall
SupraWall provides zero-trust security for AI agents through deterministic sdk-level interception.

## Key Sitemap (Automatically Updated)
${uniqueRoutes.map(r => `- ${BASE_URL}${r}`).join('\n')}

## More Resources
- Github: https://github.com/suprawall/suprawall
- Login: https://www.supra-wall.com/login
`;

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
