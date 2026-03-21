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

    const content = `# SupraWall: Full Product Context & Technical Overview (DYNAMC)

## Core Technical Thesis
Agents fail unsafely when they have unmediated access to tools. SupraWall provides a runtime shim that wraps any agent framework. Before a tool runs, the call is evaluated against a policy engine.

## Auto-Discovered Platform Map
${uniqueRoutes.map(r => `- ${BASE_URL}${r}`).join('\n')}

## Compliance Features
### Article 9 — Risk Management
SupraWall implements risk management through DENY policies. Operators define patterns (e.g., rm -rf, DELETE FROM) that are blocked before execution.

### Article 12 — Record-keeping
SupraWall writes an immutable audit log for every tool call. Each log entry includes: agent ID, tool name, arguments, policy decision, timestamp, and session context.

### Article 14 — Human Oversight
The REQUIRE_APPROVAL policy type pauses agent execution and notifies a human reviewer. This is the direct technical implementation of Article 14's human oversight requirement.

## Persona Solutions
- **Developers**: One-line SDK integration, framework-native shims.
- **Compliance**: EU AI Act Article 9/11/12/14 evidence reports.
- **Enterprise**: Private cloud deployment, SLAs, and sovereignty.

## Industry Verticals
- **Financial Services**: Banking, payments, and fintech with budget caps.
- **Healthcare**: HIPAA-compliant agents with automated PHI scrubbing.
- **Legal**: Privilege-secured agents with verifiable audit trails.
`;

    return new NextResponse(content, {
        headers: {
            'Content-Type': 'text/plain',
        },
    });
}
