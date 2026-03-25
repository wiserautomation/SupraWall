// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { usePlatform } from "@/hooks/useConnect";
import { useConnectAnalytics } from "@/hooks/useConnect";
import { StatCard } from "@/components/connect/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Shield, BrickWall, Key, Users, Activity, Zap, AlertTriangle, DollarSign, ArrowRight
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function ConnectPage() {
    const { platform, loading, createPlatform } = usePlatform();
    const { analytics } = useConnectAnalytics(platform?.platformId);
    const [platformName, setPlatformName] = useState("");
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState("");

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Shield className="w-8 h-8 text-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 animate-pulse">Scanning Platform...</p>
                </div>
            </div>
        );
    }

    if (!platform) {
        return (
            <div className="max-w-xl mx-auto py-12 px-4">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-emerald-500/10 rounded-2xl mb-6 relative">
                        <BrickWall className="w-10 h-10 text-emerald-400" />
                        <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-50 -z-10" />
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">SupraWall Connect</h1>
                    <p className="text-neutral-500 mt-3 text-sm font-medium leading-relaxed max-w-md mx-auto">
                        Connect lets you generate API and project keys to protect your agents with SupraWall. 
                        Issue security keys to your customers and govern all their agents from one place.
                    </p>
                </div>

                <div className="bg-white/[0.05] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
                    
                    <div className="space-y-2">
                        <Label htmlFor="platform-name" className="text-[10px] uppercase tracking-[0.2em] font-black text-emerald-500/80">Platform Name</Label>
                        <Input
                            id="platform-name"
                            placeholder="e.g. Acme Corp Intelligence"
                            value={platformName}
                            onChange={(e) => setPlatformName(e.target.value)}
                            className="bg-black/50 border-white/[0.08] h-12 focus:border-emerald-500/50 transition-all text-white"
                        />
                    </div>
                    {error && <p className="text-[11px] text-rose-500 bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">{error}</p>}
                    
                    <Button
                        className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] border-none"
                        disabled={creating || !platformName.trim()}
                        onClick={async () => {
                            setCreating(true);
                            setError("");
                            try {
                                await createPlatform(platformName.trim());
                            } catch (e: any) {
                                setError(e?.message ?? "Failed to create platform.");
                            } finally {
                                setCreating(false);
                            }
                        }}
                    >
                        {creating ? "Initializing Identity..." : "Initialize Connect Platform"}
                    </Button>
                </div>

                <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { icon: Key, label: "Issue sub-keys per customer" },
                        { icon: BrickWall, label: "Enforce policies across all" },
                        { icon: Activity, label: "Full forensic audit logs" }
                    ].map((feature, i) => (
                        <div key={i} className="flex flex-col items-center text-center p-4 bg-white/[0.05] border border-white/[0.08] rounded-xl group hover:bg-white/[0.04] transition-all">
                            <feature.icon className="w-5 h-5 mb-3 text-emerald-500/40 group-hover:text-emerald-500/80 transition-colors" />
                            <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500 group-hover:text-neutral-300">{feature.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const allowCount = analytics?.byDecision?.ALLOW ?? 0;
    const denyCount = analytics?.byDecision?.DENY ?? 0;
    const approvalCount = analytics?.byDecision?.REQUIRE_APPROVAL ?? 0;
    const totalEvents = analytics?.totalEvents ?? 0;
    const blockRate = totalEvents > 0
        ? Math.round(((denyCount + approvalCount) / totalEvents) * 100)
        : 0;

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                            SupraWall Connect
                        </h1>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {platform.plan}
                        </span>
                    </div>
                    <p className="text-neutral-500 text-xs font-medium uppercase tracking-widest">
                        System Identifier: <span className="text-neutral-200">{platform.name}</span>
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link href="/connect/keys">
                        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-6 h-11 uppercase tracking-widest text-[10px]">
                            <Key className="w-3.5 h-3.5 mr-2" />
                            Issue Sub-Key
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Explainer Banner */}
            <div className="bg-emerald-500/[0.03] border border-emerald-500/10 p-6 rounded-2xl flex items-center gap-6 relative overflow-hidden group">
                <div className="absolute inset-0 bg-emerald-500/[0.01] group-hover:bg-emerald-500/[0.03] transition-colors" />
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <Zap className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Developer Notice</h4>
                    <p className="text-[11px] text-neutral-400 uppercase tracking-wider leading-relaxed">
                        Connect lets you generate API and project keys to protect your agents with SupraWall. 
                        Every sub-key inherits your master security policies by default.
                    </p>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Users}
                    title="Active Customers"
                    value={platform.totalSubKeys}
                    subtitle="Sub-keys issued"
                />
                <StatCard
                    icon={Activity}
                    title="Agent Invocations"
                    value={totalEvents.toLocaleString()}
                    subtitle="Last 7 diurnal cycles"
                />
                <StatCard
                    icon={DollarSign}
                    title="Redundant Spend Prevented"
                    value={analytics?.costPreventedUsd ? `$${analytics.costPreventedUsd.toFixed(2)}` : "$0.00"}
                    subtitle="Halted loop calls"
                />
                <StatCard
                    icon={AlertTriangle}
                    title="Protection Rate"
                    value={`${blockRate}%`}
                    subtitle={`${denyCount + approvalCount} filtered actions`}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top tools */}
                <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Top Capabilities Invoked</h2>
                        <div className="h-1 flex-1 mx-4 bg-white/[0.04] rounded-full" />
                    </div>
                    
                    {(analytics?.topTools ?? []).length === 0 ? (
                        <div className="text-center py-12">
                            <Activity className="w-8 h-8 text-neutral-800 mx-auto mb-3" />
                            <p className="text-[10px] text-neutral-700 uppercase tracking-widest font-black">No Telemetry Recorded</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {analytics!.topTools.map((t, i) => (
                                <div key={i} className="flex justify-between items-center bg-white/[0.05] p-4 rounded-xl border border-white/[0.03] hover:border-emerald-500/20 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-neutral-600 font-bold w-4">0{i + 1}</span>
                                        <code className="text-[11px] text-emerald-400 font-mono tracking-tight bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 group-hover:border-emerald-500/30 transition-all">
                                            {t.toolName}
                                        </code>
                                    </div>
                                    <span className="text-xs font-bold text-white tabular-nums">
                                        {t.calls.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top customers */}
                <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-6 relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">Most Active Identifiers</h2>
                        <div className="h-1 flex-1 mx-4 bg-white/[0.04] rounded-full" />
                    </div>
                    
                    {(analytics?.topCustomers ?? []).length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-8 h-8 text-neutral-800 mx-auto mb-3" />
                            <p className="text-[10px] text-neutral-700 uppercase tracking-widest font-black">No Active Sub-Keys</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {analytics!.topCustomers.map((c, i) => (
                                <div key={c.customerId} className="flex justify-between items-center bg-white/[0.05] p-4 rounded-xl border border-white/[0.03] hover:border-emerald-500/20 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-[10px] font-black text-emerald-400 uppercase">
                                            {c.customerId[0]}
                                        </div>
                                        <span className="text-[11px] text-neutral-300 font-bold tracking-tight truncate max-w-[200px]">
                                            {c.customerId}
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-tighter tabular-nums">
                                        {c.calls.toLocaleString()} calls
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                    { href: "/connect/keys", icon: Key, title: "Manage Sub-Keys", desc: "Issue and rotate customer keys" },
                    { href: "/connect/analytics", icon: Activity, title: "Deep Analytics", desc: "Review decision latency and trends" },
                    { href: "/connect/events", icon: BrickWall, title: "Compliance Logs", desc: "Searchable forensic action trails" }
                ].map((action, i) => (
                    <Link key={i} href={action.href}>
                        <div className="bg-white/[0.05] border border-white/[0.06] rounded-2xl p-6 hover:border-emerald-500/40 hover:bg-emerald-500/[0.02] transition-all cursor-pointer group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="w-4 h-4 text-emerald-500" />
                            </div>
                            <action.icon className="w-6 h-6 text-emerald-500/50 mb-3 group-hover:text-emerald-400 transition-all group-hover:scale-110" />
                            <p className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-1">{action.title}</p>
                            <p className="text-[10px] text-neutral-600 uppercase tracking-wider font-medium font-sans">{action.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
