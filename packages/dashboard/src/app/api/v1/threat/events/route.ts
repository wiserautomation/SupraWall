// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
    }

    const snapshot = await db.collection("threat_events")
      .where("tenantId", "==", tenantId)
      .orderBy("timestamp", "desc")
      .limit(50)
      .get();

    const events = snapshot.docs.map(doc => {
      const data = doc.data();
      // Firestore Timestamp to ISO string for frontend compatibility
      const sanitized = JSON.parse(JSON.stringify(data, (key, value) => {
        if (value && typeof value === 'object' && '_seconds' in value) {
          return new Date(value._seconds * 1000).toISOString();
        }
        return value;
      }));
      return {
        id: doc.id,
        createdat: sanitized.timestamp || new Date().toISOString(), // Match frontend expectation
        ...sanitized
      };
    });

    return NextResponse.json(events);
  } catch (err: any) {
    console.error("[API Threat Events GET] Error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
