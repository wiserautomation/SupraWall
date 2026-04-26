// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, MinusCircle, RefreshCw, Settings } from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

// ---------------------------------------------------------------------------
// Every required environment variable, grouped by service.
// Source of truth: the route handlers themselves — not a manually-maintained list.
// ---------------------------------------------------------------------------

const ENV_GROUPS = [
    {
        label: "PostgreSQL",
        color: "blue",
        vars: [
            { name: "DATABASE_URL", alt: "POSTGRES_URL", note: "Primary Postgres connection string." },
            { name: "DATABASE_POOL_SIZE", required: false, note: "Optional — defaults to 20 connections." },
        ],
    },
    {
        label: "Firebase / Firestore",
        color: "yellow",
        vars: [
            { name: "FIREBASE_PROJECT_ID", note: "Firebase project ID (used by client SDK and Admin SDK)." },
            { name: "FIREBASE_CLIENT_EMAIL", note: "Service account email — required for Admin SDK and GA4." },
            { name: "FIREBASE_PRIVATE_KEY", note: "Service account private key (PEM). Include escaped newlines." },
            { name: "NEXT_PUBLIC_FIREBASE_API_KEY", note: "Client-side Firebase API key." },
            { name: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", note: "Client-side auth domain." },
        ],
    },
    {
        label: "Stripe",
        color: "purple",
        vars: [
            { name: "STRIPE_SECRET_KEY", note: "Secret key (sk_live_… or sk_test_…). Required for revenue routes." },
            { name: "STRIPE_WEBHOOK_SECRET", required: false, note: "Optional — only needed if you receive Stripe webhooks." },
            { name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", required: false, note: "Optional — only needed for client-side checkout." },
        ],
    },
    {
        label: "Admin Access",
        color: "red",
        vars: [
            { name: "ADMIN_EMAILS", note: "Comma-separated admin email addresses (e.g. alex@example.com)." },
            { name: "SUPRAWALL_ADMIN_KEY", required: false, note: "Optional master key for server-to-server admin calls." },
        ],
    },
    {
        label: "App URLs",
        color: "emerald",
        vars: [
            { name: "NEXT_PUBLIC_APP_URL", note: "Canonical app URL (e.g. https://supra-wall.com). Used in OG images and trace share URLs." },
            { name: "APP_URL", required: false, note: "Optional — Express server equivalent of NEXT_PUBLIC_APP_URL." },
        ],
    },
    {
        label: "GitHub",
        color: "neutral",
        vars: [
            { name: "GITHUB_TOKEN", note: "Personal access token or GitHub App token. Needs repo scope for traffic endpoints." },
        ],
    },
    {
        label: "Google Analytics 4",
        color: "orange",
        vars: [
            {
                name: "FIREBASE_CLIENT_EMAIL",
                note: "Same service account as Firebase Admin — must have Viewer access on GA4 property 525946717.",
                alias: "Same as Firebase",
            },
        ],
    },
];

type SourceStatus = { configured: boolean; reachable: boolean; last_seen_at: string | null; detail: string };

const COLOR_MAP: Record<string, { bg: string; border: string; text: string }> = {
    blue:    { bg: "bg-blue-500/10",    border: "border-blue-500/20",    text: "text-blue-400"    },
    yellow:  { bg: "bg-yellow-500/10",  border: "border-yellow-500/20",  text: "text-yellow-400"  },
    purple:  { bg: "bg-purple-500/10",  border: "border-purple-500/20",  text: "text-purple-400"  },
    red:     { bg: "bg-rose-500/10",    border: "border-rose-500/20",    text: "text-rose-400"    },
    emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
    neutral: { bg: "bg-neutral-500/10", border: "border-neutral-500/20", text: "text-neutral-400" },
    orange:  { bg: "bg-orange-500/10",  border: "border-orange-500/20",  text: "text-orange-400"  },
};

// Map from env-group label to health source key
const GROUP_TO_SOURCE: Record<string, string> = {
    "PostgreSQL": "postgres",
    "Firebase / Firestore": "firestore",
    "Stripe": "stripe",
    "Google Analytics 4": "ga4",
    "GitHub": "github",
};

function StatusIcon({ ok, warn }: { ok?: boolean; warn?: boolean }) {
    if (ok)   return <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />;
    if (warn) return <MinusCircle  className="w-4 h-4 text-amber-400 flex-shrink-0" />;
    return        <XCircle       className="w-4 h-4 text-rose-400 flex-shrink-0" />;
}

export default function AdminSettingsPage() {
    const [sources, setSources] = useState<Record<string, SourceStatus> | null>(null);
    const [checkedAt, setCheckedAt] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    async function refresh() {
        setLoading(true);
        try {
            const res = await adminFetch("/api/admin/health");
            const data = await res.json();
            setSources(data.sources);
            setCheckedAt(data.checked_at);
        } catch {
            // keep previous state
        }
        setLoading(false);
    }

    useEffect(() => { refresh(); }, []);

    const allOk = sources && Object.values(sources).every(s => s.configured && s.reachable);

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic flex items-center gap-3">
                        <Settings className="w-7 h-7 text-emerald-500" /> System Settings
                    </h1>
                    <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-bold">
                        Required environment variables · service connectivity
                    </p>
                </div>
                <button
                    onClick={refresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-lg text-xs text-neutral-300 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    Re-check
                </button>
            </div>

            {/* Live connectivity summary */}
            {sources && (
                <div className={`p-4 rounded-xl border text-sm ${allOk ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" : "bg-amber-500/5 border-amber-500/20 text-amber-300"}`}>
                    {allOk
                        ? "All data sources are configured and reachable."
                        : "One or more sources need attention. See details below."}
                    {checkedAt && (
                        <span className="ml-2 text-xs opacity-60">Last checked {new Date(checkedAt).toLocaleTimeString()}</span>
                    )}
                </div>
            )}

            {/* Env-var groups */}
            <div className="space-y-6">
                {ENV_GROUPS.map(group => {
                    const c = COLOR_MAP[group.color] ?? COLOR_MAP.neutral;
                    const sourceKey = GROUP_TO_SOURCE[group.label];
                    const source = sourceKey ? sources?.[sourceKey] : undefined;

                    return (
                        <div key={group.label} className={`rounded-xl border ${c.border} ${c.bg} overflow-hidden`}>
                            {/* Group header */}
                            <div className={`px-6 py-3 flex items-center justify-between border-b ${c.border}`}>
                                <h2 className={`text-xs font-black uppercase tracking-widest ${c.text}`}>{group.label}</h2>
                                {source && (
                                    <div className="flex items-center gap-1.5">
                                        <StatusIcon ok={source.configured && source.reachable} warn={source.configured && !source.reachable} />
                                        <span className="text-[10px] text-neutral-500">{source.detail}</span>
                                    </div>
                                )}
                            </div>

                            {/* Variable rows */}
                            <div className="divide-y divide-white/[0.04]">
                                {group.vars.map(v => {
                                    const isRequired = v.required !== false;
                                    return (
                                        <div key={v.name} className="px-6 py-3 flex items-start gap-4">
                                            <code className="text-xs font-mono text-white bg-black/30 px-2 py-0.5 rounded mt-0.5 shrink-0">
                                                {v.name}
                                            </code>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-neutral-400 leading-relaxed">
                                                    {"alias" in v ? (
                                                        <span className="text-neutral-500 italic">{v.alias as string} — </span>
                                                    ) : null}
                                                    {v.note}
                                                    {"alt" in v ? (
                                                        <span className="ml-1 text-neutral-600">(or <code className="font-mono">{v.alt as string}</code>)</span>
                                                    ) : null}
                                                </p>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase shrink-0 mt-0.5 ${isRequired ? "text-rose-400" : "text-neutral-600"}`}>
                                                {isRequired ? "required" : "optional"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            <p className="text-xs text-neutral-600 pb-4">
                Variable presence is verified server-side via <code className="font-mono">/api/admin/health</code>.
                The panel never reads or exposes variable values — only whether they are set and whether the service responds.
            </p>
        </div>
    );
}
