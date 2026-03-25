// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

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
Agents fail unsafely when they have unmediated access to tools. SupraWall provides a runtime shim that wraps any agent framework (LangChain, CrewAI, AutoGen, Vercel AI, Pydantic AI, LlamaIndex, MCP). Before a tool runs, the call is evaluated against a deterministic policy engine.

## Auto-Discovered Platform Map
${uniqueRoutes.map(r => `- ${BASE_URL}${r}`).join('\n')}

## Compliance & Privacy Features
### Article 9 — Risk Management
SupraWall blocks destructive patterns (unauthorized payments, data deletion) before they execute through DENY policies.

### Article 12 — Logging & Traceability
SupraWall records immutable audit logs for every tool call with full metadata: agent ID, session context, inputs, and gated decisions.

### Article 14 — Human Oversight
The REQUIRE_APPROVAL policy pauses agent execution and notifies an authorized human reviewer—directly implementing Article 14 compliance via human-in-the-loop (HITL) architecture.

### Article 15 — Accuracy & Security
Intercepts PII and sensitive data patterns during tool calls, preventing data leaks in training or inference logs.

## Monetization & Budget
SupraWall integrates with **Stripe** to provide credit-based budget caps. This creates a hard financial killswitch for autonomous agents, preventing runaway costs.

## Persona Solutions
- **Developers**: One-line SDK integration (Python, TS, Go), MCP server shims.
- **Compliance**: EU AI Act Article 12/14/15/Article 9 evidence reports & audits.
- **Enterprise**: Private cloud, SOC2-ready, sovereign self-hosting.

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
