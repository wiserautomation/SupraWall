// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool as pgPool, ensureSchema } from '@/lib/db_sql';
import { getAdminAuth } from '@/lib/firebase-admin';
import { subDays, format } from 'date-fns';

export const dynamic = 'force-dynamic';

const ADMIN_EMAILS_RAW = (process.env.ADMIN_EMAILS || process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean);
const ADMIN_EMAILS = ADMIN_EMAILS_RAW.length > 0 ? ADMIN_EMAILS_RAW : [];

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.slice(7);
    let decodedToken: { email?: string };
    try {
        decodedToken = await getAdminAuth().verifyIdToken(token);
    } catch {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (!decodedToken.email || !ADMIN_EMAILS.includes(decodedToken.email)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const warnings: string[] = [];

    // --- 1. Fetch Hugging Face Stats ---
    let hfStats = { likes: 0, status: 'unknown' };
    try {
        const hfRes = await fetch('https://huggingface.co/api/spaces/SupraWall/smolagents-demo', {
            next: { revalidate: 3600 }
        });
        if (hfRes.ok) {
            const data = await hfRes.json();
            hfStats = {
                likes: data.likes || 0,
                status: data.runtime?.stage || 'running'
            };
        }
    } catch (err: any) {
        console.error("[Admin Ecosystem API] Failed to fetch HF stats:", err.message);
        warnings.push("HuggingFace stats unavailable.");
    }

    // --- 2. Postgres Aggregates ---
    let pluginUsage: any[] = [];
    let adoptionTrend: any[] = [];

    try {
        await ensureSchema();
        const last7dStart = subDays(new Date(), 7).toISOString();
        const last30dStart = subDays(new Date(), 30).toISOString();

        const [usageRes, trendRes] = await Promise.all([
            pgPool.query(
                `SELECT COALESCE(metadata->>'source', 'direct-sdk') as source, COUNT(*) as count 
                 FROM audit_logs WHERE timestamp >= $1 GROUP BY metadata->>'source' ORDER BY count DESC`,
                [last7dStart]
            ),
            pgPool.query(
                `SELECT date_trunc('day', timestamp) as day, COALESCE(metadata->>'source', 'direct-sdk') as source, COUNT(*) as count 
                 FROM audit_logs WHERE timestamp >= $1 GROUP BY day, source ORDER BY day ASC`,
                [last30dStart]
            )
        ]);

        pluginUsage = usageRes.rows.map(r => ({
            source: r.source,
            count: parseInt(r.count, 10)
        }));

        const trendMap: Record<string, any> = {};
        trendRes.rows.forEach(row => {
            const d = format(new Date(row.day), 'MMM d');
            if (!trendMap[d]) trendMap[d] = { date: d };
            trendMap[d][row.source] = parseInt(row.count, 10);
        });
        adoptionTrend = Object.values(trendMap);

    } catch (pgErr: any) {
        console.error('[Admin Ecosystem] Postgres fetch failed:', pgErr.message);
        warnings.push('Postgres data unavailable: ' + pgErr.message);
    }

    // --- 3. GitHub PR Statuses ---
    const prsToTrack = [
        { repo: "crewAIInc/awesome-crewai", number: 49, label: "CrewAI Awesome" },
        { repo: "e2b-dev/awesome-ai-agents", number: 696, label: "e2b AI Agents" },
        { repo: "e2b-dev/awesome-ai-sdks", number: 133, label: "e2b AI SDKs" },
        { repo: "corca-ai/awesome-llm-security", number: 137, label: "LLM Security" },
        { repo: "Giskard-AI/awesome-ai-safety", number: 21, label: "Giskard Safety" },
        { repo: "Joe-B-Security/awesome-prompt-injection", number: 37, label: "Prompt Injection" },
        { repo: "chenryn/aiops-handbook", number: 8, label: "AIOps Handbook" },
        { repo: "modelcontextprotocol/servers", number: 4295, label: "MCP Registry" },
        { repo: "langgenius/dify-plugins", number: 2252, label: "Dify Marketplace" },
        { repo: "run-llama/llama_index", number: 21311, label: "LlamaIndex Hub" },
        { repo: "microsoft/autogen", number: 7541, label: "AutoGen Framework" }
    ];

    const ghToken = process.env.GITHUB_TOKEN;
    let prStatuses: any[] = [];
    
    try {
        prStatuses = await Promise.all(prsToTrack.map(async (pr) => {
            try {
                if (!ghToken) {
                    return { id: pr.number, label: pr.label, repo: pr.repo, status: "unconfigured", url: "" };
                }

                const ghRes = await fetch(`https://api.github.com/repos/${pr.repo}/pulls/${pr.number}`, {
                    headers: {
                        "Authorization": `token ${ghToken}`,
                        "Accept": "application/vnd.github.v3+json",
                        "User-Agent": "SupraWall-Ecosystem-Tracker"
                    },
                    next: { revalidate: 300 }
                });
                
                if (ghRes.ok) {
                    const data = await ghRes.json();
                    return {
                        id: pr.number, label: pr.label, repo: pr.repo,
                        status: data.merged ? "merged" : data.state,
                        url: data.html_url, updated_at: data.updated_at
                    };
                }
                return { id: pr.number, label: pr.label, repo: pr.repo, status: "unknown", url: `https://github.com/pulls/${pr.number}` };
            } catch (err) {
                return { id: pr.number, label: pr.label, repo: pr.repo, status: "error", url: "" };
            }
        }));
    } catch (ghErr: any) {
         console.error('[Admin Ecosystem] GitHub fetch failed:', ghErr.message);
         warnings.push('GitHub data unavailable: ' + ghErr.message);
    }

    return NextResponse.json({
        huggingface: hfStats,
        pluginUsage,
        adoptionTrend,
        registryPRs: prStatuses,
        warnings
    });
}
