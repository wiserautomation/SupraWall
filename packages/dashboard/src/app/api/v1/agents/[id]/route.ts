// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const db = getAdminDb();
  try {
    const { id } = await params;
    
    console.log(`[API Agent GET] Fetching agent detail by ID: ${id}`);
    const docRef = db.collection("agents").doc(id);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      console.warn(`[API Agent GET] Agent not found: ${id}`);
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
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
    console.error("[API Agent GET] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
    const db = getAdminDb();
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log(`[API Agent PATCH] Updating agent: ${id}`, body);
    const docRef = db.collection("agents").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
        return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const updateData: any = {
        updatedAt: new Date()
    };

    if (body.name) updateData.name = body.name;
    if (body.status) updateData.status = body.status;
    if (body.scopes) updateData.scopes = body.scopes;
    if (body.apiKey) updateData.apiKey = body.apiKey; // For rotation

    await docRef.update(updateData);
    
    const updatedSnap = await docRef.get();
    const data = updatedSnap.data();

    return NextResponse.json({
        id: updatedSnap.id,
        ...data,
        createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt
    });
  } catch (err: any) {
    console.error("[API Agent PATCH] Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const db = getAdminDb();
    try {
        const { id } = await params;
        console.log(`[API Agent DELETE] Deleting agent: ${id}`);
        await db.collection("agents").doc(id).delete();
        return NextResponse.json({ message: "Agent deleted successfully" });
    } catch (err: any) {
        console.error("[API Agent DELETE] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
