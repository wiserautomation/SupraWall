// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest, NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

export const dynamic = "force-dynamic";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ certId: string }> }
) {
    const { certId } = await params;
    const searchParams = req.nextUrl.searchParams;
    const theme = searchParams.get("theme") === "light" ? "light" : "dark";

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
        // Fallback for demo/invalid IDs
        score = 100;
        articles = ["Article 9", "Article 12", "Article 14"];
        orgName = "Organization";
    }

    const isHigh = score >= 90;
    const accent = isHigh ? "#10b981" : score >= 60 ? "#f59e0b" : "#6b7280";
    
    // Theme Colors
    const isDark = theme === "dark";
    const bg = isDark ? "#09090b" : "#ffffff";
    const textMain = isDark ? "#ffffff" : "#09090b";
    const textSec = isDark ? "#71717a" : "#52525b";
    const border = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

    const statusText = score >= 90 ? "SECURED" : score >= 60 ? "PARTIAL" : "AUDIT PENDING";
    const articleText = articles.length > 0 
        ? articles.map(a => a.replace("Article ", "")).join(", ") 
        : "EU AI Act Compliance";

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="64" viewBox="0 0 280 64" fill="none">
  <defs>
    <filter id="shadow" x="0" y="0" width="280" height="64" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(0,0,0,0.1)" />
    </filter>
  </defs>

  <!-- Background Layer -->
  <rect x="1" y="1" width="278" height="62" rx="16" fill="${bg}" />
  <rect x="1" y="1" width="278" height="62" rx="16" stroke="${border}" stroke-width="1.5" />
  
  <!-- Left Accent Strip -->
  <path d="M1 16C1 7.71573 7.71573 1 16 1H20V63H16C7.71573 63 1 56.2843 1 48V16Z" fill="${accent}" fill-opacity="0.1" />
  <rect x="1" y="16" width="4" height="32" rx="2" fill="${accent}" />

  <!-- Shield Icon -->
  <g transform="translate(20, 18)">
    <path d="M14 0L0 5v8c0 7.5 6 12.5 14 14 8-1.5 14-6.5 14-14V5z" fill="${accent}" fill-opacity="0.1" />
    <path d="M14 0L0 5v8c0 7.5 6 12.5 14 14 8-1.5 14-6.5 14-14V5z" stroke="${accent}" stroke-width="2" stroke-linejoin="round" />
    <path d="M9 13l3 3 6-7" stroke="${accent}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
  </g>

  <!-- Main Content -->
  <text x="64" y="24" font-family="Inter, -apple-system, sans-serif" font-size="9" font-weight="800" letter-spacing="0.1em" fill="${accent}" text-transform="uppercase">EU AI ACT ${statusText}</text>
  <text x="64" y="42" font-family="Inter, -apple-system, sans-serif" font-size="13" font-weight="700" fill="${textMain}">${orgName || 'SupraWall Certified'}</text>
  <text x="64" y="55" font-family="Inter, -apple-system, sans-serif" font-size="8" font-weight="500" fill="${textSec}" letter-spacing="0.02em">Art. ${articleText}</text>

  <!-- Score Display -->
  <g transform="translate(224, 12)">
    <circle cx="20" cy="20" r="18" stroke="${accent}" stroke-width="3" stroke-dasharray="113.1" stroke-dashoffset="${113.1 - (113.1 * score / 100)}" fill="none" transform="rotate(-90 20 20)" stroke-linecap="round" />
    <circle cx="20" cy="20" r="18" stroke="${accent}" stroke-width="3" stroke-opacity="0.1" fill="none" />
    <text x="20" y="25" font-family="Inter, -apple-system, sans-serif" font-size="11" font-weight="900" fill="${textMain}" text-anchor="middle">${score}</text>
  </g>
</svg>`;

    return new NextResponse(svg, {
        headers: {
            "Content-Type": "image/svg+xml",
            "Cache-Control": "public, max-age=300, s-maxage=300",
            "Access-Control-Allow-Origin": "*",
        },
    });
}
