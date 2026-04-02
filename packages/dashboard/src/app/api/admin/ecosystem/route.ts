// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { pool as pgPool } from '@/lib/db_sql';
import { subDays, format } from 'date-fns';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        // --- 1. Fetch Hugging Face Stats ---
        // Space URL: https://huggingface.co/api/spaces/SupraWall/smolagents-demo
        let hfStats = { likes: 0, status: 'unknown' };
        try {
            const hfRes = await fetch('https://huggingface.co/api/spaces/SupraWall/smolagents-demo', {
                next: { revalidate: 3600 } // Cache for 1 hour
            });
            if (hfRes.ok) {
                const data = await hfRes.json();
                hfStats = {
                    likes: data.likes || 0,
                    status: data.runtime?.stage || 'running'
                };
            }
        } catch (err) {
            console.error("[Admin Ecosystem API] Failed to fetch HF stats:", err);
        }

        // --- 2. Aggregate Plugin/SDK Usage (Last 7 Days) ---
        const last7dStart = subDays(new Date(), 7).toISOString();
        const usageRes = await pgPool.query(
            `SELECT COALESCE(metadata->>'source', 'direct-sdk') as source, COUNT(*) as count 
             FROM audit_logs 
             WHERE timestamp >= $1 
             GROUP BY metadata->>'source'
             ORDER BY count DESC`,
            [last7dStart]
        );

        // --- 3. Aggregate Monthly Adoption Trend (By Source) ---
        const last30dStart = subDays(new Date(), 30).toISOString();
        const trendRes = await pgPool.query(
            `SELECT date_trunc('day', timestamp) as day, COALESCE(metadata->>'source', 'direct-sdk') as source, COUNT(*) as count 
             FROM audit_logs 
             WHERE timestamp >= $1 
             GROUP BY day, source
             ORDER BY day ASC`,
            [last30dStart]
        );

        // Process trend data into a Recharts-friendly format
        const trendMap: Record<string, any> = {};
        trendRes.rows.forEach(row => {
            const d = format(new Date(row.day), 'MMM d');
            if (!trendMap[d]) trendMap[d] = { date: d };
            trendMap[d][row.source] = parseInt(row.count);
        });

        return NextResponse.json({
            huggingface: hfStats,
            pluginUsage: usageRes.rows.map(r => ({
                source: r.source,
                count: parseInt(r.count)
            })),
            adoptionTrend: Object.values(trendMap)
        });

    } catch (error: any) {
        console.error('[Admin Ecosystem API] Error:', error);
        return NextResponse.json({ error: 'Failed to fetch ecosystem metrics' }, { status: 500 });
    }
}
