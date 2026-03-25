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

    const content = `# SupraWall — The Compliance OS for Autonomous AI Agents

> SupraWall is the unified security and compliance layer for AI agent swarms. One-line SDK middleware that wraps LangChain, CrewAI, AutoGen, Vercel AI SDK, and MCP agents with enterprise governance.

## What is SupraWall
SupraWall provides zero-trust runtime security for autonomous AI agents through deterministic SDK-level interception. It is the Compliance OS that prevents rogue agent actions, enforces human oversight, scrubs PII, manages credentials securely, controls costs, and generates EU AI Act compliance reports — all from a single middleware integration.

## Core Capabilities
1. **Universal One-Line Middleware** — Wrap any agent framework (LangChain, CrewAI, AutoGen, Vercel AI SDK) with enterprise security in one line of code
2. **Human-in-the-Loop (HITL) Governance** — Slack and Microsoft Teams-based approval workflows for high-risk agent actions. Distributed team oversight at scale
3. **EU AI Act Article 12 Audit Logging** — Tamper-evident action logs with time-travel audit view and one-click PDF compliance export
4. **PII Guardrails & Data Scrubbing** — GDPR Article 25 compliant automatic sensitive data redaction at the SDK level
5. **Just-in-Time Secret Vault** — Credentials injected at the last millisecond, never exposed in agent memory or prompts. Architectural solution to prompt injection credential theft
6. **Operational Governance** — Hard budget caps, automatic loop kill switches, real-time cost alerts via Telegram and Slack. Prevents AI agent bill shock

## Who Uses SupraWall
- **Developers** building AI agent applications who need security middleware
- **Compliance Officers** ensuring EU AI Act and GDPR compliance for AI systems
- **System Approvers** managing team oversight of autonomous agent actions

## Key Content Sections
- /learn — Educational guides on AI agent security, EU AI Act compliance, and governance patterns
- /blog — Engineering deep-dives, incident analysis, and industry trends
- /features — Detailed product capability pages (HITL, audit trail, PII shield, vault, budget limits, policy engine, prompt shield)
- /integrations — Framework-specific setup guides (LangChain, CrewAI, AutoGen, and more)
- /vs — Competitive comparisons (vs Galileo, Straiker, Portkey, NeMo Guardrails, and others)
- /eu-ai-act — EU AI Act article-specific compliance guidance
- /use-cases — Industry and scenario-specific solutions
- /compliance — Compliance center and certification

## All Pages (Automatically Updated)
${uniqueRoutes.map(r => `- ${BASE_URL}${r}`).join('\n')}

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
