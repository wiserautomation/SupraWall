// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Public trace page — /trace/[id]
 *
 * Fully server-rendered. No client-side fetch for main content.
 * Mobile-first. Loads in <500ms.
 */

import type { Metadata } from "next";
import { pool, ensureSchema } from "@/lib/db_sql";
import Link from "next/link";
import CopyLinkButton from "./CopyLinkButton";
import DownloadPngButton from "./DownloadPngButton";
import FlagButton from "./FlagButton";

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function getTrace(id: string): Promise<Record<string, any> | null> {
    try {
        await ensureSchema();
        const result = await pool.query(
            "SELECT trace_json, created_at FROM public_traces WHERE id = $1 AND deleted = FALSE AND flagged = FALSE AND public = TRUE",
            [id]
        );
        if (result.rows.length === 0) return null;
        const row = result.rows[0];
        return { ...(row.trace_json as Record<string, any>), _created_at: row.created_at };
    } catch {
        return null;
    }
}

// ---------------------------------------------------------------------------
// Metadata + OG
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const trace = await getTrace(id);
    const tool = trace?.attempted_action?.tool ?? "unknown tool";
    const policy = trace?.matched_policy?.rule ?? "policy";

    const title = trace
        ? `Blocked: agent attempted to call '${tool}' | SupraWall`
        : `Trace ${id} | SupraWall`;
    const description = trace
        ? `AI agent blocked by SupraWall policy '${policy}'. ${trace.matched_policy?.reason ?? ""}`
        : "SupraWall blocked a dangerous agent action. View the full trace.";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [`/api/og/trace/${id}`],
            type: "article",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [`/api/og/trace/${id}`],
        },
    };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default async function TracePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const trace = await getTrace(id);

    if (!trace) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-3">Trace Not Found</h1>
                    <p className="text-zinc-400 mb-6">
                        This trace does not exist, was deleted by its owner, or was flagged for review.
                    </p>
                    <Link href="/" className="text-[#b8ff00] hover:underline text-sm">
                        ← Back to SupraWall
                    </Link>
                </div>
            </div>
        );
    }

    const tool = trace.attempted_action?.tool ?? "unknown tool";
    const toolArgs = trace.attempted_action?.args ?? {};
    const policy = trace.matched_policy?.rule ?? "unknown policy";
    const reason = trace.matched_policy?.reason ?? "";
    const framework = trace.framework ?? "unknown";
    const blockedAt = trace.blocked_at ? new Date(trace.blocked_at).toUTCString() : "unknown";
    const auditHash = trace.audit_hash ?? "";
    const shareUrl = `https://supra-wall.com/trace/${id}`;
    const tweetText = encodeURIComponent(
        `My AI agent just tried to call '${tool}'. SupraWall blocked it. Trace: ${shareUrl}`
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
                    <span className="font-bold text-white tracking-tight">SupraWall</span>
                    <span className="text-zinc-600">/</span>
                    <span>trace</span>
                    <span className="text-zinc-600">/</span>
                    <span className="font-mono">{id}</span>
                </Link>
                <a
                    href={`https://twitter.com/intent/tweet?text=${tweetText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-3 py-1.5 rounded-lg transition-colors"
                >
                    Share on X
                </a>
            </header>

            <main className="max-w-3xl mx-auto px-4 py-10 space-y-8">

                {/* Headline */}
                <section>
                    <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        Blocked
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                        Agent attempted to call{" "}
                        <code className="text-[#b8ff00] bg-zinc-900 rounded px-1.5 py-0.5 font-mono text-xl">
                            {tool}
                        </code>
                    </h1>
                    <p className="mt-2 text-zinc-400 text-sm">{blockedAt} · Framework: {framework}</p>
                </section>

                {/* Why */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Why it was blocked</h2>
                    <p className="text-white font-medium mb-1">
                        Policy <code className="text-[#b8ff00] font-mono text-sm">{policy}</code> matched.
                    </p>
                    <p className="text-zinc-400 text-sm">{reason}</p>
                </section>

                {/* What the agent tried */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">What the agent tried</h2>
                    <pre className="text-sm text-zinc-200 font-mono overflow-x-auto whitespace-pre-wrap break-words bg-black/40 rounded-lg p-4">
                        {JSON.stringify({ tool, args: toolArgs }, null, 2)}
                    </pre>
                    <p className="text-xs text-zinc-600 mt-3">
                        Arguments were PII-redacted by the SupraWall SDK before upload. No credentials, emails, or phone numbers are stored.
                    </p>
                </section>

                {/* Agent reasoning */}
                {trace.agent_reasoning && (
                    <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Agent reasoning (redacted)</h2>
                        <p className="text-zinc-300 text-sm italic">{trace.agent_reasoning}</p>
                    </section>
                )}

                {/* Audit hash */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Audit integrity</h2>
                    <p className="text-zinc-400 text-xs mb-2">
                        SHA-256 of the canonical trace JSON, computed at block time by the SupraWall SDK.
                        The server verified this hash on upload — tampered traces are rejected.
                    </p>
                    <pre className="text-xs font-mono text-zinc-300 bg-black/40 rounded-lg p-3 overflow-x-auto break-all">
                        {auditHash}
                    </pre>
                </section>

                {/* Share block */}
                <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                    <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-4">Share this trace</h2>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a
                            href={`https://twitter.com/intent/tweet?text=${tweetText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2.5 rounded-lg transition-colors font-medium"
                        >
                            Share on X
                        </a>
                        <CopyLinkButton url={shareUrl} />
                        <DownloadPngButton traceId={id} />
                    </div>
                    <p className="text-xs text-zinc-600 mt-3">
                        Pre-filled X text: <em>&ldquo;My AI agent just tried to {tool}. SupraWall blocked it.&rdquo;</em>
                    </p>
                    <FlagButton traceId={id} />
                </section>

            </main>

            {/* Footer CTA */}
            <footer className="border-t border-zinc-800 py-8 px-4 text-center">
                <p className="text-zinc-500 text-sm">
                    This block was protected by{" "}
                    <Link href="/" className="text-white font-medium hover:text-[#b8ff00] transition-colors">
                        SupraWall
                    </Link>{" "}
                    — the deterministic firewall for AI agents.
                </p>
                <Link
                    href="/#get-started"
                    className="inline-block mt-3 bg-[#b8ff00] text-black text-sm font-bold px-5 py-2 rounded-lg hover:bg-[#c8ff20] transition-colors"
                >
                    Install in 2 minutes →
                </Link>
            </footer>
        </div>
    );
}
