// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { pool } from "@/lib/db_sql";

export async function POST(request: NextRequest) {
  try {
    const { tenantId } = await request.json();
    
    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    // Ensure tables exist
    await pool.query(`
        CREATE TABLE IF NOT EXISTS threat_events (
            id SERIAL PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            agentid VARCHAR(255),
            event_type VARCHAR(100) NOT NULL,
            severity VARCHAR(50) DEFAULT 'medium',
            details JSONB,
            timestamp TIMESTAMP DEFAULT NOW()
        );
        CREATE TABLE IF NOT EXISTS threat_summaries (
            id SERIAL PRIMARY KEY,
            tenantid VARCHAR(255) NOT NULL,
            entity_id VARCHAR(255) NOT NULL, 
            entity_type VARCHAR(50) NOT NULL,
            threat_score FLOAT DEFAULT 0,
            total_events INTEGER DEFAULT 0,
            last_updated TIMESTAMP DEFAULT NOW(),
            UNIQUE(tenantid, entity_id, entity_type)
        );
    `);

    // Aggregation logic (Severity weights)
    const weights: Record<string, number> = { low: 1, medium: 5, high: 20, critical: 100 };

    console.log(`[ThreatAggregate] Processing for tenant: ${tenantId}`);

    const eventsResult = await pool.query(
        `SELECT agentid, severity, COUNT(*) as count 
         FROM threat_events 
         WHERE tenantid = $1 AND timestamp >= NOW() - INTERVAL '24 hours' 
         GROUP BY agentid, severity`,
        [tenantId]
    );

    let processed = 0;
    for (const row of eventsResult.rows) {
        const severity = (row.severity || 'medium').toLowerCase();
        const score = (weights[severity] || 5) * parseInt(row.count);
        
        await pool.query(
            `INSERT INTO threat_summaries (tenantid, entity_id, entity_type, threat_score, total_events, last_updated)
             VALUES ($1, $2, 'agent', $3, $4, NOW())
             ON CONFLICT (tenantid, entity_id, entity_type)
             DO UPDATE SET 
                threat_score = EXCLUDED.threat_score, -- Reset to current window score
                total_events = threat_summaries.total_events + EXCLUDED.total_events,
                last_updated = NOW()`,
            [tenantId, row.agentid, score, parseInt(row.count)]
        );
        processed++;
    }

    return NextResponse.json({ status: "aggregated", processed });

  } catch (err: any) {
    console.error("[API Threat Aggregate POST] Error:", err);
    return NextResponse.json({ error: "Failed to aggregate scores from Postgres", details: err.message }, { status: 500 });
  }
}


