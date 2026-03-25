// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getAdminDb();
  try {
    const { id } = await params;
    
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
  const db = getAdminDb();
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log(`[API Tenants POST] Updating settings for tenant: ${id}`, body);
    const docRef = db.collection("tenants").doc(id);
    
    await docRef.set({
        ...body,
        updatedAt: new Date()
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[API Tenants POST] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
