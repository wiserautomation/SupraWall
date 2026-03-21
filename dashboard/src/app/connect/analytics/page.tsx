"use client";

import { useState } from "react";
import { usePlatform, useConnectAnalytics } from "@/hooks/useConnect";
import { StatCard } from "@/components/connect/StatCard";
import { EmptyState } from "@/components/connect/EmptyState";
import { Button } from "@/components/ui/button";
import { Activity, Zap, Shield, BrickWall, TrendingUp, Clock, Target, Users } from "lucide-react";

const PERIOD_OPTIONS = [
    { label: "24H", days: 1 },
    { label: "7D", days: 7 },
    { label: "30D", days: 30 },
    { label: "90D", days: 90 },
];

export default function ConnectAnalyticsPage() {
    const { platform, loading: platformLoading } = usePlatform();
    const [days, setDays] = useState(7);
    const { analytics, loading } = useConnectAnalytics(platform?.platformId, days);

    if (platformLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Shield className="w-8 h-8 text-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 animate-pulse">Retrieving Analytics...</p>
                </div>
            </div>
        );
    }

    if (!platform) {
        return (
            <EmptyState
                icon={Activity}
                title="Telemetry Offline"
                description="Initialize your Connect platform to start recording agent telemetry."
                action={<a href="/connect"><Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px]">Initialize Platform</Button></a>}
            />
        );
    }

    const total = analytics?.totalEvents ?? 0;
    const allow = analytics?.byDecision?.ALLOW ?? 0;
    const deny = analytics?.byDecision?.DENY ?? 0;
    const approval = analytics?.byDecision?.REQUIRE_APPROVAL ?? 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Connect Analytics</h1>
                    <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                        Aggregated performance metrics across platform: <span className="text-emerald-500">{platform.name}</span>
                    </p>
                </div>
                {/* Period selector */}
                <div className="flex items-center gap-1 bg-white/[0.05] border border-white/[0.08] rounded-xl p-1 backdrop-blur-sm">
                    {PERIOD_OPTIONS.map((opt) => (
                        <button
                            key={opt.days}
                            onClick={() => setDays(opt.days)}
                            className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${days === opt.days
                                ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.05]"
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500" />
                </div>
            ) : (
                <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={Activity}
                            title="Total Invocations"
                            value={total.toLocaleString()}
                            subtitle={`Period: ${days} days`}
                        />
                        <StatCard
                            icon={TrendingUp}
                            title="Success Rate"
                            value={total > 0 ? `${Math.round((allow / total) * 100)}%` : "0%"}
                            subtitle="Allowed requests"
                        />
                        <StatCard
                            icon={Shield}
                            title="Filter Actions"
                            value={(deny + approval).toLocaleString()}
                            subtitle="Security interceptions"
                        />
                        <StatCard
                            icon={Clock}
                            title="Avg Latency"
                            value={analytics ? `${analytics.avgLatencyMs}ms` : "—"}
                            subtitle="Decision overhead"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Decision breakdown (takes 2 cols) */}
                        <div className="lg:col-span-2 bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden group hover:border-white/[0.12] transition-all">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Decision Distribution</h2>
                                <div className="h-0.5 flex-1 mx-6 bg-white/[0.05] rounded-full" />
                            </div>
                            
                            {total === 0 ? (
                                <div className="text-center py-20 border border-dashed border-white/[0.08] rounded-xl">
                                    <Target className="w-8 h-8 text-neutral-800 mx-auto mb-3" />
                                    <p className="text-[10px] text-neutral-700 font-black uppercase tracking-widest">No Telemetry In Range</p>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {[
                                        { label: "Execution Allowed", count: allow, color: "bg-emerald-500", glow: "shadow-[0_0_10px_rgba(16,185,129,0.3)]", textColor: "text-emerald-400" },
                                        { label: "Execution Denied", count: deny, color: "bg-rose-500", glow: "shadow-[0_0_10px_rgba(244,63,94,0.3)]", textColor: "text-rose-400" },
                                        { label: "Pending Approval", count: approval, color: "bg-amber-400", glow: "shadow-[0_0_10px_rgba(251,191,36,0.3)]", textColor: "text-amber-400" },
                                    ].map((row) => (
                                        <div key={row.label} className="space-y-2 group/row">
                                            <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tight">
                                                <span className={`${row.textColor} opacity-80 group-hover/row:opacity-100 transition-opacity`}>{row.label}</span>
                                                <span className="text-white tabular-nums">
                                                    {row.count.toLocaleString()} &nbsp;
                                                    <span className="text-neutral-600">
                                                        [{total > 0 ? Math.round((row.count / total) * 100) : 0}%]
                                                    </span>
                                                </span>
                                            </div>
                                            <div className="w-full bg-black/40 rounded-full h-2 overflow-hidden border border-white/[0.03]">
                                                <div
                                                    className={`h-full rounded-full transition-all duration-1000 ease-out ${row.color} ${row.glow}`}
                                                    style={{
                                                        width: `${total > 0 ? (row.count / total) * 100 : 0}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Top tools */}
                        <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6 transition-all hover:border-white/[0.12]">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Capability Heat</h2>
                                <div className="h-0.5 w-12 bg-white/[0.05] rounded-full" />
                            </div>
                            
                            {(analytics?.topTools ?? []).length === 0 ? (
                                <div className="text-center py-10 opacity-20">
                                    <Zap className="w-8 h-8 text-white mx-auto" />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {analytics!.topTools.map((tool, i) => {
                                        const pct = total > 0
                                            ? Math.round((tool.calls / total) * 100)
                                            : 0;
                                        return (
                                            <div key={tool.toolName} className="space-y-2">
                                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tighter">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-neutral-700 w-3">#{(i + 1).toString().padStart(2, '0')}</span>
                                                        <code className="text-emerald-400/80 font-mono tracking-normal leading-none truncate max-w-[120px]">
                                                            {tool.toolName}
                                                        </code>
                                                    </div>
                                                    <span className="text-neutral-400 tabular-nums">
                                                        {tool.calls.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-black/40 rounded-full h-1 overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-500/40 rounded-full transition-all duration-700"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Secondary Metrics */}
                    <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl p-6 transition-all hover:border-white/[0.12]">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Load Per Entity</h2>
                            <div className="h-0.5 flex-1 mx-6 bg-white/[0.05] rounded-full" />
                        </div>
                        
                        {(analytics?.topCustomers ?? []).length === 0 ? (
                            <div className="text-center py-8 opacity-20">
                                <Users className="w-8 h-8 text-white mx-auto" />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {analytics!.topCustomers.map((customer, i) => {
                                    const pct = total > 0
                                        ? Math.round((customer.calls / total) * 100)
                                        : 0;
                                    return (
                                        <div key={customer.customerId} className="bg-black/20 p-4 rounded-xl border border-white/[0.03] group hover:border-white/[0.08] transition-all">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded bg-emerald-500/5 flex items-center justify-center text-[10px] font-black text-emerald-500/60 group-hover:bg-emerald-500/10 group-hover:text-emerald-400 transition-colors">
                                                        {customer.customerId[0].toUpperCase()}
                                                    </div>
                                                    <span className="text-[11px] font-bold text-neutral-300 truncate max-w-[140px] tracking-tight">
                                                        {customer.customerId}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-black text-white tabular-nums">
                                                    {pct}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-black/60 rounded-full h-1 overflow-hidden">
                                                <div
                                                    className="h-full bg-emerald-500/60 rounded-full transition-all duration-700"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                            <p className="text-[9px] text-neutral-600 mt-2 font-black uppercase tracking-widest text-right">
                                                {customer.calls.toLocaleString()} Total Calls
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
