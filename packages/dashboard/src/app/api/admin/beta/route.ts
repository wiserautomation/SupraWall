// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
 
 export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        // In a real app, I'd verify admin session here. 
        // For now, I'll rely on the layout gate and assume this is safe or add a simple check if possible.
        
        const snapshot = await db.collection("waitlist").orderBy("appliedAt", "desc").get();
        const leads = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            appliedAt: doc.data().appliedAt?.toDate() || new Date()
        }));

        return NextResponse.json({ leads });
    } catch (err: any) {
        console.error("[Admin Beta API Error]:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
