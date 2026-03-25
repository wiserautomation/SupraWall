// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";

export async function POST(req: NextRequest) {
    try {
        const { prefix = "ag_" } = await req.json();
        
        // Generate a cryptographically secure random key
        // 32 bytes = 64 hex characters
        const randomString = randomBytes(32).toString("hex");
        const key = prefix + randomString;
        
        // Create a hash for storage
        const hash = createHash("sha256").update(key).digest("hex");
        
        // Create a display-safe prefix (first 12 chars + ...)
        const displayPrefix = key.slice(0, 12) + "...";
        
        return NextResponse.json({ 
            key, 
            hash, 
            displayPrefix 
        });
    } catch (error) {
        console.error("Error generating key:", error);
        return NextResponse.json({ error: "Failed to generate key" }, { status: 500 });
    }
}
