// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
    Users, Server, Activity, Shield, Zap, AlertCircle,
    DollarSign, Filter, Percent, Gauge, CheckCircle2, XCircle, MinusCircle
} from "lucide-react";
import {
    AreaChart, Area,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-fetch";

// ---------------------------------------------------------------------------
// DataSourcesStrip — Phase 1 honesty fix
// ---------------------------------------------------------------------------

type SourceStatus = { configured: boolean; reachable: boolean; last_seen_at: string | null; detail: string };

function SourceBadge({ name, s }: { name: string; s: SourceStatus }) {
    let color: string;
    let Icon: React.ElementType;
    let label: string;

    if (!s.configured) {
        color = "bg-rose-500/10 border-rose-500/20 text-rose-400";
        Icon = XCircle;
        label = "Not configured";
    } else if (!s.reachable) {
        color = "bg-rose-500/10 border-rose-500/20 text-rose-400";
        Icon = XCircle;
        label = "Unreachable";
    } else if (!s.last_seen_at) {
        color = "bg-amber-500/10 border-amber-500/20 text-amber-400";
        Icon = MinusCircle;
        label = "No data yet";
    } else {
        color = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
        Icon = CheckCircle2;
        label = "OK";
    }

    return (
        <div title={s.detail} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${color}`}>
            <Icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="capitalize">{name.replace(/_/g, " ")}</span>
            <span className="opacity-60 font-normal">· {label}</span>
        </div>
    );
}

function DataSourcesStrip() {
    const [sources, setSources] = useState<Record<string, SourceStatus> | null>(null);
    const [checkedAt, setCheckedAt] = useState<string | null>(null);

    useEffect(() => {
        adminFetch(`/api/admin/health?t=${Date.now()}`)
            .then(r => r.json())
            .then(data => { setSources(data.sources); setCheckedAt(data.checked_at); })
            .catch(() => {});
    }, []);

    if (!sources) return null;

    const allOk = Object.values(sources).every(s => s.configured && s.reachable);

    return (
        <div className={`p-4 rounded-xl border ${allOk ? "bg-emerald-500/5 border-emerald-500/15" : "bg-amber-500/5 border-amber-500/15"}`}>
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mr-1">Data sources</span>
                {Object.entries(sources).map(([name, s]) => (
                    <SourceBadge key={name} name={name} s={s} />
                ))}
                {checkedAt && (
                    <span className="ml-auto text-[10px] text-neutral-600">
                        Checked {new Date(checkedAt).toLocaleTimeString()}
                    </span>
                )}
            </div>
            {!allOk && (
                <p className="mt-2 text-xs text-amber-400/80">
                    One or more data sources are misconfigured or unreachable — numbers below may show as zero.{" "}
                    <Link href="/admin/settings" className="underline hover:text-amber-300">View settings →</Link>
                </p>
            )}
        </div>
    );
}

export default function AdminOverviewPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [funnel, setFunnel] = useState<any>(null);
    const [warnings, setWarnings] = useState<string[]>([]);

    useEffect(() => {
        async function fetchAllData() {
            setLoading(true);
            setWarnings([]);
            try {
                const [overviewRes, funnelRes] = await Promise.allSettled([
                    adminFetch('/api/admin/overview'),
                    adminFetch('/api/admin/funnel')
                ]);

                const newWarnings: string[] = [];

                if (overviewRes.status === 'fulfilled' && overviewRes.value.ok) {
                    const data = await overviewRes.value.json();
                    setStats(data);
                    if (data.warnings?.length > 0) newWarnings.push(...data.warnings);
                } else {
                    newWarnings.push("Overview data failed to load.");
                }

                if (funnelRes.status === 'fulfilled' && funnelRes.value.ok) {
                    const data = await funnelRes.value.json();
                    setFunnel(data);
                    if (data.warnings?.length > 0) newWarnings.push(...data.warnings);
                } else {
                    newWarnings.push("Funnel data failed to load.");
                }

                setWarnings(newWarnings);
            } catch (err) {
                console.error("SupraWall Admin: Failed to load executive insights", err);
                setWarnings(["Critical failure fetching dashboard data."]);
            }
            setLoading(false);
        }
        fetchAllData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <Zap className="w-12 h-12 text-emerald-500 animate-pulse" />
            </div>
        );
    }

    const { stats: kpis, signupTrends } = stats || {};

    const executiveKPIs = [
        { title: "Total Users", value: kpis?.totalUsers || 0, sub: "Registered", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Active Agents", value: kpis?.totalAgents || 0, sub: "Live Monitoring", icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { title: "Monthly Revenue", value: `$${kpis?.mrr || 0}`, sub: "Live MRR", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { title: "Churn Rate", value: kpis?.churnRate || '0%', sub: "Retention", icon: Percent, color: "text-rose-500", bg: "bg-rose-500/10" },
        { title: "Ops Today", value: kpis?.opsToday || 0, sub: "Global Volume", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Success Rate", value: kpis?.successRate || '0%', sub: "System Health", icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { title: "Paid Orgs", value: kpis?.totalPaidUsers || 0, sub: "Conversion", icon: Filter, color: "text-purple-500", bg: "bg-purple-500/10" },
        { title: "Global Savings", value: `$${((kpis?.totalRevenue || 0) * 0.4).toFixed(0)}`, sub: "Damage Blocked", icon: Shield, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            <div className="flex justify-between items-end mb-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic heading-glow">Command Console</h1>
                    <p className="text-neutral-500 text-xs font-black uppercase tracking-[0.2em]">Real-time platform-wide executive metrics.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/revenue" className="px-5 py-2.5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600/20 transition-all flex items-center gap-2">
                        <DollarSign className="w-3.5 h-3.5" /> Revenue Dashboard
                    </Link>
                </div>
            </div>

            <DataSourcesStrip />

            {warnings.length > 0 && (
                <div className="space-y-2">
                    {warnings.map((warn, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-500">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{warn}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {executiveKPIs.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <Card key={index} className="bg-[#080808] border-white/5 backdrop-blur-3xl hover:border-white/10 transition-colors group relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent" />
                            <CardContent className="p-6 flex items-center justify-between relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em]">{kpi.title}</p>
                                    <p className="text-3xl font-black text-white tracking-tighter italic">{kpi.value?.toLocaleString()}</p>
                                    <p className="text-[8px] text-neutral-600 font-bold uppercase tracking-widest">{kpi.sub}</p>
                                </div>
                                <div className={`p-4 rounded-[1.25rem] ${kpi.bg} border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic vs Signups Trend */}
                <Card className="col-span-1 lg:col-span-2 bg-black border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Gauge className="w-40 h-40 text-emerald-500" />
                    </div>
                    <CardHeader className="flex flex-row items-center justify-between pb-8">
                        <CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Activity className="w-4 h-4 text-emerald-500" /> Intake Velocity (7D Signups)
                        </CardTitle>
                        <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full uppercase tracking-widest border border-emerald-500/20">Live</span>
                    </CardHeader>
                    <CardContent className="h-[350px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={signupTrends || []}>
                                <defs>
                                    <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="date" stroke="#444" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ stroke: '#10b981', strokeWidth: 1 }}
                                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid #222', borderRadius: '12px' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSignups)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Conversion Funnel Snippet */}
                <Card className="col-span-1 bg-black border-white/5 overflow-hidden flex flex-col justify-between">
                    <CardHeader className="border-b border-white/[0.05] py-5">
                        <CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] flex items-center gap-2">
                            <Filter className="w-4 h-4 text-emerald-500" /> Lifecycle Yield
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-center py-8 gap-1.5 px-6">
                        {funnel?.funnel?.length > 0 ? funnel.funnel.map((stage: any) => (
                            <div key={stage.name} className="space-y-1">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{stage.name}</span>
                                    <span className="text-xs font-black text-white italic">{stage.count.toLocaleString()}</span>
                                </div>
                                <div className="h-2.5 bg-white/[0.03] border border-white/[0.05] rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                        style={{ width: `${stage.ratio}%` }}
                                    />
                                </div>
                            </div>
                        )) : (
                            <div className="text-center text-neutral-500 text-xs py-10">Funnel data unavailable</div>
                        )}
                    </CardContent>
                    <div className="p-4 bg-emerald-500/5 border-t border-white/[0.05]">
                        <Link href="/admin/funnel" className="text-center block text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] hover:text-emerald-400 transition-colors">
                            Full Drop-off Analysis →
                        </Link>
                    </div>
                </Card>
            </div>

            {/* Bottom Row - Performance Insight */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-emerald-800 border-2 border-emerald-400 text-white shadow-[0_40px_80px_rgba(16,185,129,0.2)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                    <Zap className="w-64 h-64 text-white" />
                </div>
                <div className="space-y-4 relative z-10">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Healthy Yield Targets.</h2>
                    <p className="text-emerald-100 font-bold italic uppercase text-sm tracking-tight opacity-80 max-w-xl">
                        Platform success rate is currently {kpis?.successRate || 'computing'}% across all evaluation nodes. 
                    </p>
                </div>
                <div className="relative z-10 flex gap-4">
                    <Link href="/admin/analytics" className="px-8 py-4 bg-white text-black font-black uppercase text-sm rounded-2xl hover:bg-emerald-50 transition-all shadow-2xl hover:-translate-y-1">
                        Network Health →
                    </Link>
                </div>
            </div>
        </div>
    );
}
