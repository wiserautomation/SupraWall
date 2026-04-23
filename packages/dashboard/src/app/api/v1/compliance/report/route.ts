// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";
import { apiError } from '@/lib/api-errors';
import { requireDashboardAuth } from '@/lib/api-guard';

export const dynamic = "force-dynamic";

// Server-side proxy: avoids browser CORS by fetching the PDF from the
// Express server on the server side, then streaming it back to the client.
export async function GET(request: NextRequest) {
    const guard = await requireDashboardAuth(request);
    if (guard instanceof NextResponse) return guard;
    const { userId } = guard;

    try {
        const { searchParams } = new URL(request.url);
        const tenantId = searchParams.get("tenantId");
        if (!tenantId) {
            return NextResponse.json({ error: "Missing tenantId" }, { status: 400 });
        }

        if (tenantId !== userId) return apiError.forbidden();

        const API_URL = process.env.SUPRAWALL_API_URL || process.env.NEXT_PUBLIC_SUPRAWALL_API_URL || "http://localhost:3000";

        const upstream = new URL(`${API_URL}/v1/compliance/report`);
        upstream.searchParams.set("tenantId", tenantId);
        if (searchParams.get("from")) upstream.searchParams.set("from", searchParams.get("from")!);
        if (searchParams.get("to")) upstream.searchParams.set("to", searchParams.get("to")!);
        if (searchParams.get("agentId")) upstream.searchParams.set("agentId", searchParams.get("agentId")!);

        const res = await fetch(upstream.toString());
        if (!res.ok) {
            return NextResponse.json({ error: "Report generation failed" }, { status: res.status });
        }

        const pdfBuffer = await res.arrayBuffer();
        const date = new Date().toISOString().split("T")[0];

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="suprawall-compliance-report-${date}.pdf"`,
            },
        });
    } catch (err: any) {
        console.error("[API Compliance Report] Error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
