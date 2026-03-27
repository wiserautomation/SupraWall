// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ certId: string }> }
) {
    const { certId } = await params;

    let score = 0;
    let articles: string[] = [];
    let orgName = "";

    try {
        const snap = await getAdminDb().collection("certificates").doc(certId).get();
        const cert = snap.data();
        if (cert) {
            score = cert.complianceScore ?? 0;
            articles = cert.articlesCompliant ?? [];
            orgName = cert.orgName ?? "";
        }
    } catch {
        // return a "not found" badge
    }

    const isCompliant = score >= 60;
    const color = score >= 90 ? "#10b981" : score >= 60 ? "#f59e0b" : "#6b7280";
    const statusText = score >= 90 ? "COMPLIANT" : score >= 60 ? "PARTIAL" : "NOT FOUND";
    const articleText = articles.length > 0 ? articles.map(a => a.replace("Article ", "Art. ")).join(" · ") : "EU AI Act";
    const safeOrg = orgName ? ` · ${orgName.substring(0, 20)}` : "";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="56">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a2332"/>
      <stop offset="100%" stop-color="#0f1923"/>
    </linearGradient>
    <linearGradient id="acc" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.3"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="220" height="56" rx="8" fill="url(#bg)" stroke="${color}" stroke-width="1" stroke-opacity="0.4"/>

  <!-- Top accent bar -->
  <rect width="220" height="2" rx="1" fill="url(#acc)"/>

  <!-- Shield icon -->
  <g transform="translate(12, 14)">
    <path d="M14 0L0 5v8c0 7.5 6 12.5 14 14 8-1.5 14-6.5 14-14V5z" fill="none" stroke="${color}" stroke-width="1.8" stroke-linejoin="round"/>
    <path d="M9 13l3 3 6-7" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>

  <!-- Labels -->
  <text x="44" y="22" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="8" font-weight="700" letter-spacing="0.12em" fill="${color}" text-transform="uppercase">EU AI ACT ${statusText}</text>
  <text x="44" y="37" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="9.5" font-weight="600" fill="#e2e8f0">${articleText}${safeOrg}</text>

  <!-- Score pill -->
  <rect x="168" y="16" width="38" height="22" rx="6" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1" stroke-opacity="0.5"/>
  <text x="187" y="31" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="11" font-weight="900" fill="${color}" text-anchor="middle">${score}</text>
</svg>`;

    return new NextResponse(svg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=300, s-maxage=300",
            "Access-Control-Allow-Origin": "*",
        },
    });
}
