// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { pool, ensureSchema } from '@/lib/db_sql';
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

/** Columns safe to persist to the Postgres tenants table */
const PG_ALLOWED_COLUMNS = [
    "name", "slack_webhook_url", "tier", "master_api_key",
    "db_type", "db_string", "webhook_url", "webhook_secret",
    "notification_email", "openrouter_app_url", "openrouter_app_title",
    "openrouter_categories"
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireDashboardAuth(request);
  if (guard instanceof NextResponse) return guard;
  const { userId } = guard;

  const db = getAdminDb();
  try {
    const { id } = await params;

    if (id !== userId) return apiError.forbidden();

    console.log(`[API Tenants GET] Fetching settings for tenant: ${id}`);
    const docRef = db.collection("tenants").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      console.warn(`[API Tenants GET] Tenant not found: ${id}. Returning default.`);
      return NextResponse.json({
          id,
          name: "Default Tenant",
          createdAt: new Date().toISOString()
      });
    }

    const data = docSnap.data();
    const sanitized = JSON.parse(JSON.stringify(data, (key, value) => {
      if (value && typeof value === 'object' && '_seconds' in value) {
        return new Date(value._seconds * 1000).toISOString();
      }
      return value;
    }));

    return NextResponse.json({
        id: docSnap.id,
        ...sanitized
    });
  } catch (err: any) {
    console.error("[API Tenants GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireDashboardAuth(request);
  if (guard instanceof NextResponse) return guard;
  const { userId } = guard;

  const db = getAdminDb();
  try {
    const { id } = await params;

    if (id !== userId) return apiError.forbidden();

    const body = await request.json();

    console.log(`[API Tenants POST] Updating settings for tenant: ${id}`, body);

    // 1. Write to Firestore (primary store for dashboard reads)
    const docRef = db.collection("tenants").doc(id);
    await docRef.set({
        ...body,
        updatedAt: new Date()
    }, { merge: true });

    // 2. Dual-write to Postgres (required for Express server evaluate engine)
    try {
        await ensureSchema();
        const pgEntries = Object.entries(body).filter(
            ([key]) => PG_ALLOWED_COLUMNS.includes(key)
        );

        if (pgEntries.length > 0) {
            const columns = pgEntries.map(([key]) => key);
            const values = pgEntries.map(([, val]) => val);
            const placeholders = values.map((_, i) => `$${i + 2}`);
            const sets = columns.map((col, i) => `${col} = $${i + 2}`);

            await pool.query(
                `INSERT INTO tenants (id, ${columns.join(", ")})
                 VALUES ($1, ${placeholders.join(", ")})
                 ON CONFLICT (id) DO UPDATE SET ${sets.join(", ")}`,
                [id, ...values]
            );
            console.log(`[API Tenants POST] Postgres dual-write OK for tenant: ${id}`);
        }
    } catch (pgErr) {
        // Log but don't fail — Firestore write already succeeded
        console.error("[API Tenants POST] Postgres dual-write failed (non-fatal):", pgErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[API Tenants POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
