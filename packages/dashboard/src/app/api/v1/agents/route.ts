// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { db as firestore } from '@/lib/firebase-admin';
import { checkResourceLimit } from '@/lib/tier-enforcement';
import { verifyAuth, unauthorizedResponse } from '@/lib/api-auth';
import { pool, ensureSchema } from "@/lib/db_sql";
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getEffectiveTenantId } from '@/lib/user';

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Authenticate and derive tenantId from token
    const userId = await verifyAuth(request);
    if (!userId) return unauthorizedResponse();

    const tenantId = await getEffectiveTenantId(userId);

    await ensureSchema();

    // 1. Fetch from PostgreSQL (Source of Truth for new agents)
    const pgResult = await pool.query(
        "SELECT * FROM agents WHERE tenantid = $1 OR tenantid = $2 ORDER BY createdat DESC",
        [userId, tenantId]
    );

    const pgAgents = pgResult.rows.map(row => ({
        id: row.id,
        name: row.name,
        tenantId: row.tenantid,
        userId: row.tenantid, // UI consistency
        status: row.status,
        createdAt: row.createdat,
        scopes: row.scopes,
        max_cost_usd: row.max_cost_usd,
        budget_alert_usd: row.budget_alert_usd,
        max_iterations: row.max_iterations,
        loop_detection: row.loop_detection,
        source: 'postgres'
    }));

    // 2. Fetch from Firestore (Legacy support for existing agents)
    const fsAgents: any[] = [];
    try {
        const queryIds = Array.from(new Set([userId, tenantId]));
        const fsSnap = await firestore.collection("agents").where("userId", "in", queryIds).get();
        fsSnap.docs.forEach(doc => {
            const data = doc.data();
            // Avoid duplicates if already in Postgres (unlikely but possible if moved)
            if (pgAgents.some(a => a.id === doc.id)) return;
            
            fsAgents.push({
                id: doc.id,
                name: data.name,
                tenantId: data.tenantId || data.userId,
                userId: data.userId,
                status: data.status || 'active',
                createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
                scopes: data.scopes || ["*:*"],
                source: 'firestore'
            });
        });
    } catch (e) {
        console.warn("[API Agents GET] Legacy Firestore fetch failed:", e);
    }

    // Combine and sort
    const allAgents = [...pgAgents, ...fsAgents].sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
    });

    return NextResponse.json(allAgents);
  } catch (err: any) {
    console.error("[API Agents GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Authenticate and derive tenantId from token
    const userId = await verifyAuth(request);
    if (!userId) return unauthorizedResponse();

    const body = await request.json();
    const { name, apiKey, scopes } = body;

    if (!name || !apiKey) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // --- Tier Enforcement ---
    const { allowed, count, limit } = await checkResourceLimit(userId, 'agents', 'userId');

    if (!allowed) {
        return NextResponse.json({
            error: `Agent limit reached (${count}/${limit}). Upgrade your plan to create more agents.`,
            code: "TIER_LIMIT_EXCEEDED"
        }, { status: 403 });
    }

    const effectiveTenantId = await getEffectiveTenantId(userId);

    const agentId = `agent_${crypto.randomBytes(8).toString('hex')}`;
    
    await pool.query(`
        INSERT INTO agents (id, tenantid, name, apikeyhash, scopes, status)
        VALUES ($1, $2, $3, $4, $5, $6)
    `, [agentId, effectiveTenantId, name, apiKey, scopes || ["*:*"], 'active']);

    return NextResponse.json({ 
        id: agentId, 
        name, 
        tenantId: effectiveTenantId, 
        status: 'active',
        createdAt: new Date().toISOString()
    });
  } catch (err: any) {
    console.error("[API Agents POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) return unauthorizedResponse();

    const tenantId = await getEffectiveTenantId(userId);

    const result = await pool.query(
        "DELETE FROM agents WHERE tenantid = $1 OR tenantid = $2",
        [userId, tenantId]
    );

    return NextResponse.json({ message: `Successfully deleted ${result.rowCount} agents for tenant.` });
  } catch (err: any) {
    console.error("[API Agents DELETE] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

