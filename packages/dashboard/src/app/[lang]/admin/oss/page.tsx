// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from "recharts";
import {
    PackageOpen, Shield, Download, Star, GitFork, Eye,
    RefreshCw, AlertCircle, ExternalLink,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-fetch";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Telemetry = {
    totals: { blocks: number; installs: number; wraps: number };
    framework_breakdown: { framework: string; wraps: number }[];
    fetched_at: string;
};

type NpmData = {
    packages: { package: string; total: number; daily: { day: string; downloads: number }[]; error?: string }[];
    grand_total: number;
    fetched_at: string;
};

type PypiData = {
    recent: { last_day: number; last_week: number; last_month: number } | null;
    daily: { date: string; downloads: number }[];
    errors: { recent: string | null; daily: string | null };
    fetched_at: string;
};

type GithubData = {
    configured: boolean;
    repo: { stars: number; forks: number; open_issues: number; pushed_at: string } | null;
    views: { total_count: number; unique_count: number; daily: { day: string; views: number; unique: number }[] } | null;
    clones: { total_count: number; unique_count: number; daily: { day: string; clones: number; unique: number }[] } | null;
    top_referrers: { referrer: string; count: number; unique: number }[];
    errors: Record<string, string>;
    note?: string;
    fetched_at: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(n: number): string {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000)     return (n / 1_000).toFixed(1)     + "K";
    return String(n);
}

function StatCard({
    label, value, sub, icon: Icon, color = "emerald",
}: { label: string; value: string | number; sub?: string; icon: React.ElementType; color?: string }) {
    const colors: Record<string, string> = {
        emerald: "text-emerald-400 bg-emerald-500/10",
        lime:    "text-[#b8ff00] bg-[#b8ff00]/10",
        blue:    "text-blue-400 bg-blue-500/10",
        amber:   "text-amber-400 bg-amber-500/10",
        purple:  "text-purple-400 bg-purple-500/10",
    };
    const cls = colors[color] ?? colors.emerald;
    return (
        <Card className="bg-[#080808] border-white/5 hover:border-white/10 transition-colors">
            <CardContent className="p-6 flex items-center justify-between">
                <div>
                    <p className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em]">{label}</p>
                    <p className="text-3xl font-black text-white tracking-tighter italic mt-0.5">{typeof value === "number" ? fmt(value) : value}</p>
                    {sub && <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest mt-0.5">{sub}</p>}
                </div>
                <div className={`p-4 rounded-2xl ${cls}`}>
                    <Icon className="w-5 h-5" />
                </div>
            </CardContent>
        </Card>
    );
}

function FetchError({ msg }: { msg: string }) {
    return (
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            {msg}
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-4">{children}</h2>;
}

function Timestamp({ ts }: { ts: string }) {
    return (
        <span className="text-[10px] text-neutral-600 ml-auto">
            Updated {new Date(ts).toLocaleTimeString()}
        </span>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function OssMetricsPage() {
    const [telemetry, setTelemetry] = useState<Telemetry | null>(null);
    const [npm, setNpm]             = useState<NpmData | null>(null);
    const [pypi, setPypi]           = useState<PypiData | null>(null);
    const [github, setGithub]       = useState<GithubData | null>(null);
    const [loading, setLoading]     = useState(true);
    const [errors, setErrors]       = useState<Record<string, string>>({});

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const errs: Record<string, string> = {};

        const safe = async <T,>(key: string, fn: () => Promise<T>): Promise<T | null> => {
            try { return await fn(); }
            catch (e: any) { errs[key] = e.message; return null; }
        };

        const [telRes, npmRes, pypiRes, ghRes] = await Promise.all([
            safe("telemetry", () => adminFetch("/api/admin/oss-telemetry").then(r => r.json())),
            safe("npm",       () => adminFetch("/api/admin/oss/npm").then(r => r.json())),
            safe("pypi",      () => adminFetch("/api/admin/oss/pypi").then(r => r.json())),
            safe("github",    () => adminFetch("/api/admin/oss/github").then(r => r.json())),
        ]);

        setTelemetry(telRes);
        setNpm(npmRes);
        setPypi(pypiRes);
        setGithub(ghRes);
        setErrors(errs);
        setLoading(false);
    }, []);

    useEffect(() => { fetchAll(); }, [fetchAll]);

    // Combine npm + pypi daily into a single series for the "downloads" chart
    const combinedDownloads = (() => {
        const map: Record<string, { day: string; npm: number; pypi: number }> = {};
        const mainPkg = npm?.packages.find(p => p.package === "suprawall");
        for (const d of mainPkg?.daily ?? []) {
            map[d.day] = { day: d.day, npm: d.downloads, pypi: 0 };
        }
        for (const d of pypi?.daily ?? []) {
            if (!map[d.date]) map[d.date] = { day: d.date, npm: 0, pypi: 0 };
            map[d.date].pypi = d.downloads;
        }
        return Object.values(map).sort((a, b) => a.day.localeCompare(b.day));
    })();

    const ghViews = github?.views?.daily ?? [];
    const ghClones = github?.clones?.daily ?? [];
    // Merge views + clones into a single daily series
    const ghTraffic = (() => {
        const map: Record<string, { day: string; views: number; clones: number }> = {};
        for (const v of ghViews)  { map[v.day] = { day: v.day, views: v.views, clones: 0 }; }
        for (const c of ghClones) { if (!map[c.day]) map[c.day] = { day: c.day, views: 0, clones: 0 }; map[c.day].clones = c.clones; }
        return Object.values(map).sort((a, b) => a.day.localeCompare(b.day));
    })();

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic flex items-center gap-3">
                        <PackageOpen className="w-8 h-8 text-[#b8ff00]" /> OSS Metrics
                    </h1>
                    <p className="text-neutral-500 text-xs mt-1 uppercase tracking-widest font-bold">
                        SDK telemetry · npm · PyPI · GitHub
                    </p>
                </div>
                <button
                    onClick={fetchAll}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-lg text-xs text-neutral-300 transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {Object.keys(errors).length > 0 && (
                <div className="space-y-2">
                    {Object.entries(errors).map(([k, msg]) => (
                        <FetchError key={k} msg={`${k}: ${msg}`} />
                    ))}
                </div>
            )}

            {/* ── SDK Telemetry ── */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <SectionTitle>SDK Telemetry (anonymous, opt-in)</SectionTitle>
                    {telemetry && <Timestamp ts={telemetry.fetched_at} />}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <StatCard label="Attacks Blocked" value={telemetry?.totals.blocks ?? 0} sub="All time" icon={Shield} color="lime" />
                    <StatCard label="SDK Installs"    value={telemetry?.totals.installs ?? 0} sub="Unique machines" icon={PackageOpen} color="emerald" />
                    <StatCard label="Agents Wrapped"  value={telemetry?.totals.wraps ?? 0} sub="wrap_with_firewall() calls" icon={Download} color="blue" />
                </div>

                {(telemetry?.framework_breakdown ?? []).length > 0 && (
                    <Card className="bg-black border-white/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">
                                Framework breakdown (wraps)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={telemetry!.framework_breakdown} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" horizontal={false} />
                                    <XAxis type="number" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis type="category" dataKey="framework" stroke="#444" fontSize={10} tickLine={false} axisLine={false} width={80} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "rgba(0,0,0,0.9)", border: "1px solid #222", borderRadius: "10px" }}
                                        cursor={{ fill: "rgba(255,255,255,0.03)" }}
                                    />
                                    <Bar dataKey="wraps" fill="#b8ff00" radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
            </section>

            {/* ── Package Downloads ── */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <SectionTitle>Package downloads (last 30 days)</SectionTitle>
                    {npm && <Timestamp ts={npm.fetched_at} />}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {npm?.packages.map(pkg => (
                        <StatCard
                            key={pkg.package}
                            label={pkg.package}
                            value={pkg.total}
                            sub="npm downloads"
                            icon={Download}
                            color="purple"
                        />
                    ))}
                    {pypi?.recent && (
                        <StatCard
                            label="suprawall (PyPI)"
                            value={pypi.recent.last_month}
                            sub="last 30 days"
                            icon={Download}
                            color="amber"
                        />
                    )}
                </div>

                {combinedDownloads.length > 0 && (
                    <Card className="bg-black border-white/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">
                                suprawall downloads/day — npm vs PyPI
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-52">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={combinedDownloads}>
                                    <defs>
                                        <linearGradient id="gNpm"  x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="#a78bfa" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gPypi" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%"  stopColor="#fbbf24" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                    <XAxis dataKey="day" stroke="#444" fontSize={9} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#444" fontSize={9} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "rgba(0,0,0,0.9)", border: "1px solid #222", borderRadius: "10px" }}
                                        cursor={{ stroke: "#ffffff20", strokeWidth: 1 }}
                                    />
                                    <Area type="monotone" dataKey="npm"  stroke="#a78bfa" strokeWidth={2} fill="url(#gNpm)"  name="npm" />
                                    <Area type="monotone" dataKey="pypi" stroke="#fbbf24" strokeWidth={2} fill="url(#gPypi)" name="PyPI" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                )}
            </section>

            {/* ── GitHub ── */}
            <section>
                <div className="flex items-center gap-3 mb-4">
                    <SectionTitle>Repo growth (GitHub)</SectionTitle>
                    {github && <Timestamp ts={github.fetched_at} />}
                </div>

                {!github?.configured && (
                    <FetchError msg="GITHUB_TOKEN not configured — set the env var to enable GitHub stats." />
                )}

                {github?.configured && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <StatCard label="GitHub Stars"        value={github.repo?.stars ?? 0}         sub="Total"             icon={Star}    color="amber" />
                            <StatCard label="Forks"               value={github.repo?.forks ?? 0}         sub="Total"             icon={GitFork} color="blue" />
                            <StatCard label="Visitors (14d)"      value={github.views?.unique_count ?? 0}  sub="Unique"            icon={Eye}     color="emerald" />
                            <StatCard label="Clones (14d)"        value={github.clones?.unique_count ?? 0} sub="Unique"            icon={Download} color="purple" />
                        </div>

                        {ghTraffic.length > 0 && (
                            <Card className="bg-black border-white/5 mb-6">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">
                                        Views &amp; clones (14-day)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="h-52">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={ghTraffic}>
                                            <defs>
                                                <linearGradient id="gViews"  x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="gClones" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
                                            <XAxis dataKey="day" stroke="#444" fontSize={9} tickLine={false} axisLine={false} />
                                            <YAxis stroke="#444" fontSize={9} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: "rgba(0,0,0,0.9)", border: "1px solid #222", borderRadius: "10px" }}
                                                cursor={{ stroke: "#ffffff20", strokeWidth: 1 }}
                                            />
                                            <Area type="monotone" dataKey="views"  stroke="#10b981" strokeWidth={2} fill="url(#gViews)"  name="Views" />
                                            <Area type="monotone" dataKey="clones" stroke="#60a5fa" strokeWidth={2} fill="url(#gClones)" name="Clones" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        )}

                        {github.top_referrers?.length > 0 && (
                            <Card className="bg-[#080808] border-white/5">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">
                                        Top referrers
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {github.top_referrers.map(r => (
                                            <div key={r.referrer} className="flex items-center justify-between text-sm">
                                                <span className="text-neutral-300 flex items-center gap-1.5">
                                                    <ExternalLink className="w-3 h-3 text-neutral-600" />
                                                    {r.referrer}
                                                </span>
                                                <span className="text-neutral-500 text-xs tabular-nums">
                                                    {r.count.toLocaleString()} views · {r.unique.toLocaleString()} unique
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {github.note && <p className="text-xs text-amber-400/70 mt-3">{github.note}</p>}
                    </>
                )}
            </section>
        </div>
    );
}
