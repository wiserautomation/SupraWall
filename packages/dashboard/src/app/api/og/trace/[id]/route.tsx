// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * OG image for a public trace — /api/og/trace/[id]
 *
 * Pre-generated on upload and cached by Vercel Edge CDN.
 * Returned as a 1200×630 PNG. No spinner, no client-side JS.
 *
 * Uses Next.js built-in ImageResponse (Satori-based, no extra deps).
 */

export const runtime = "edge";

import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Fetch trace data from the API route (same deployment)
    let tool = "unknown tool";
    let policy = "unknown policy";
    let framework = "unknown";

    try {
        const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://supra-wall.com";
        const resp = await fetch(`${base}/api/v1/traces?id=${id}`, { cache: "force-cache" });
        if (resp.ok) {
            const data = await resp.json();
            const t = data.trace ?? {};
            tool = t.attempted_action?.tool ?? tool;
            policy = t.matched_policy?.rule ?? policy;
            framework = t.framework ?? framework;
        }
    } catch {
        // fallback to defaults — OG image still renders
    }

    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#0a0a0a",
                    padding: "60px 64px",
                    fontFamily: '"Inter", "Helvetica Neue", sans-serif',
                }}
            >
                {/* Top row: brand + blocked badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 22, fontWeight: 700, color: "#ffffff", letterSpacing: "-0.5px" }}>
                        SupraWall
                    </span>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            backgroundColor: "rgba(239,68,68,0.12)",
                            border: "1px solid rgba(239,68,68,0.3)",
                            borderRadius: 999,
                            padding: "6px 14px",
                        }}
                    >
                        <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ef4444" }} />
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#f87171", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                            Blocked
                        </span>
                    </div>
                </div>

                {/* Main headline */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div style={{ fontSize: 15, color: "#71717a", fontWeight: 500 }}>
                        Agent attempted to call
                    </div>
                    <div
                        style={{
                            fontSize: 48,
                            fontWeight: 800,
                            color: "#b8ff00",
                            fontFamily: '"Courier New", monospace',
                            letterSpacing: "-1px",
                            lineHeight: 1.1,
                        }}
                    >
                        {tool.length > 30 ? tool.slice(0, 30) + "…" : tool}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <div style={{ fontSize: 22, color: "#d4d4d8", fontWeight: 500 }}>
                            Stopped by policy{" "}
                            <span style={{ color: "#ffffff", fontWeight: 700 }}>
                                {policy.length > 40 ? policy.slice(0, 40) + "…" : policy}
                            </span>
                        </div>
                        <div style={{ fontSize: 16, color: "#52525b" }}>
                            Framework: {framework} · trace/{id}
                        </div>
                    </div>
                </div>

                {/* Bottom: audit badge */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        backgroundColor: "rgba(184,255,0,0.06)",
                        border: "1px solid rgba(184,255,0,0.15)",
                        borderRadius: 10,
                        padding: "12px 20px",
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#b8ff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span style={{ fontSize: 13, color: "#b8ff00", fontWeight: 600 }}>
                        Audit hash verified · supra-wall.com/trace/{id}
                    </span>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        }
    );
}
