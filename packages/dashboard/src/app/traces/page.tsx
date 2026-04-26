// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * /traces — Public gallery of recent shared agent block traces.
 *
 * Server-rendered. No auth required. Revalidates every 60 seconds so
 * newly uploaded traces appear without a full redeploy.
 */

export const revalidate = 60;

import type { Metadata } from "next";
import Link from "next/link";
import { pool, ensureSchema } from "@/lib/db_sql";

export const metadata: Metadata = {
    title: "Agent Attack Gallery | SupraWall",
    description:
        "Real AI agent attacks blocked in production — shared by developers using SupraWall. Browse recent traces to see what your agents could have done.",
    openGraph: {
        title: "Agent Attack Gallery | SupraWall",
        description:
            "Real AI agent attacks blocked in production. Browse what SupraWall stopped.",
    },
};

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

type TraceRow = {
    id: string;
    tool: string;
    policy: string;
    framework: string;
    created_at: string;
};

async function getRecentTraces(): Promise<TraceRow[]> {
    try {
        await ensureSchema();
        const result = await pool.query(
            `SELECT
                id,
                trace_json->>'framework'                        AS framework,
                trace_json->'attempted_action'->>'tool'         AS tool,
                trace_json->'matched_policy'->>'rule'           AS policy,
                created_at
             FROM public_traces
             WHERE public = TRUE AND deleted = FALSE AND flagged = FALSE
             ORDER BY created_at DESC
             LIMIT 40`
        );
        return result.rows.map((r: any) => ({
            id: r.id,
            tool: r.tool ?? "unknown",
            policy: r.policy ?? "unknown",
            framework: r.framework ?? "unknown",
            created_at: r.created_at,
        }));
    } catch {
        return [];
    }
}

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function TraceCard({ trace }: { trace: TraceRow }) {
    const age = new Date(trace.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <Link
            href={`/trace/${trace.id}`}
            className="group block bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 transition-all"
        >
            <div className="flex items-start justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                    Blocked
                </span>
                <span className="text-[10px] font-mono text-zinc-600">{trace.id}</span>
            </div>

            <p className="text-sm font-semibold text-white mb-1 group-hover:text-[#b8ff00] transition-colors">
                <code className="font-mono">{trace.tool}</code>
            </p>
            <p className="text-xs text-zinc-500 mb-3">
                Policy: <span className="text-zinc-400 font-mono">{trace.policy}</span>
            </p>

            <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">
                    {trace.framework}
                </span>
                <span className="text-[10px] text-zinc-700">{age}</span>
            </div>
        </Link>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function TracesGalleryPage() {
    const traces = await getRecentTraces();

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <header className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                <Link href="/" className="font-bold text-white tracking-tight text-sm hover:text-[#b8ff00] transition-colors">
                    SupraWall
                </Link>
                <Link
                    href="/#get-started"
                    className="text-xs bg-[#b8ff00] text-black font-bold px-4 py-1.5 rounded-lg hover:bg-[#c8ff20] transition-colors"
                >
                    Protect your agents →
                </Link>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-12">
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        Live gallery
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold mb-3">Agent Attack Gallery</h1>
                    <p className="text-zinc-400 max-w-2xl">
                        Real tool-call blocks shared by developers using SupraWall in production.
                        Every trace is PII-redacted before upload. Arguments never leave your machine unredacted.
                    </p>
                </div>

                {traces.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-zinc-500 text-sm mb-4">No public traces yet.</p>
                        <p className="text-zinc-600 text-xs">
                            Be the first — call{" "}
                            <code className="font-mono text-zinc-400">e.share_url()</code>{" "}
                            after catching a{" "}
                            <code className="font-mono text-zinc-400">SupraWallBlocked</code>.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {traces.map((trace) => (
                            <TraceCard key={trace.id} trace={trace} />
                        ))}
                    </div>
                )}

                <p className="mt-10 text-xs text-zinc-700 text-center">
                    Showing the {traces.length} most recent public traces · Updated every 60 seconds
                </p>
            </main>

            <footer className="border-t border-zinc-800 py-8 px-4 text-center">
                <Link href="/" className="text-zinc-500 text-sm hover:text-white transition-colors">
                    ← Back to SupraWall
                </Link>
            </footer>
        </div>
    );
}
