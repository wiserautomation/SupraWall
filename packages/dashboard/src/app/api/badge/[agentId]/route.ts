// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ agentId: string }> }
) {
    const { agentId } = await params;
    const { searchParams } = new URL(req.url);
    const style = searchParams.get("style") || "flat";
    const type = searchParams.get("type") || "compliance";

    let status = "unknown";
    let color = "#9e9e9e";
    const label = type === "powered-by" ? "powered by" : "EU AI Act";

    try {
        const agentSnap = await getAdminDb().collection("agents").doc(agentId).get();
        const agent = agentSnap.data();

        if (agent) {
            const policies = (agent.policies as Record<string, unknown>[] | undefined) || [];
            const hasArticle9 = policies.some(
                (p) => p.action === "DENY" || p.riskManagement
            );
            const hasArticle12 = (agent.totalCalls as number || 0) > 0;
            const hasArticle14 = policies.some((p) => p.action === "REQUIRE_APPROVAL");

            if (type === "powered-by") {
                status = "supra-wall";
                color = "#10b981";
            } else if (hasArticle9 && hasArticle12 && hasArticle14) {
                status = "compliant";
                color = "#10b981";
            } else if (hasArticle12) {
                status = "partial";
                color = "#f59e0b";
            } else {
                status = "not compliant";
                color = "#ef4444";
            }
        } else {
            status = "not found";
            color = "#9e9e9e";
        }
    } catch {
        status = "error";
        color = "#9e9e9e";
    }

    const svg = generateBadgeSVG(label, status, color, style);

    return new NextResponse(svg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=300, s-maxage=300",
            "Access-Control-Allow-Origin": "*",
        },
    });
}

function generateBadgeSVG(
    label: string,
    status: string,
    color: string,
    style: string
): string {
    const fontSize = 11;
    const charWidth = 6.5;
    const paddingX = 10;

    const labelWidth = Math.round(label.length * charWidth + paddingX * 2);
    const statusWidth = Math.round(status.length * charWidth + paddingX * 2);
    const totalWidth = labelWidth + statusWidth;
    const height = style === "for-the-badge" ? 28 : 20;
    const textY = style === "for-the-badge" ? 18 : 14;
    const shadowY = textY + 1;
    const rx = style === "square" || style === "flat-square" ? 0 : 3;

    if (style === "for-the-badge") {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}">
  <clipPath id="r"><rect width="${totalWidth}" height="${height}" rx="${rx}"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="${height}" fill="#555"/>
    <rect x="${labelWidth}" width="${statusWidth}" height="${height}" fill="${color}"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif" font-size="10" font-weight="700" letter-spacing="0.5">
    <text x="${labelWidth / 2}" y="${textY}" text-transform="uppercase">${label.toUpperCase()}</text>
    <text x="${labelWidth + statusWidth / 2}" y="${textY}">${status.toUpperCase()}</text>
  </g>
</svg>`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r"><rect width="${totalWidth}" height="${height}" rx="${rx}" fill="#fff"/></clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="${height}" fill="#555"/>
    <rect x="${labelWidth}" width="${statusWidth}" height="${height}" fill="${color}"/>
    <rect width="${totalWidth}" height="${height}" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="${fontSize}">
    <text x="${labelWidth / 2}" y="${shadowY}" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelWidth / 2}" y="${textY}">${label}</text>
    <text x="${labelWidth + statusWidth / 2}" y="${shadowY}" fill="#010101" fill-opacity=".3">${status}</text>
    <text x="${labelWidth + statusWidth / 2}" y="${textY}">${status}</text>
  </g>
</svg>`;
}
