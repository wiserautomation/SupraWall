// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import { Shield, AlertTriangle, Activity, Skull, Filter, RefreshCw, ChevronRight } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

interface ThreatEvent {
    id: number;
    agentid: string;
    event_type: string;
    severity: string;
    details: any;
    createdat: string;
}

interface ThreatSummary {
    id: number;
    entity_id: string;
    entity_type: string;
    threat_score: number;
    total_events: number;
    last_updated: string;
}

export default function ThreatIntelligencePage() {
    const [user] = useAuthState(auth);
    const [events, setEvents] = useState<ThreatEvent[]>([]);
    const [summaries, setSummaries] = useState<ThreatSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [aggregating, setAggregating] = useState(false);

    const API_BASE = "/api";

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const tenantId = "default-tenant";

            const [eventsRes, summaryRes] = await Promise.all([
                fetch(`${API_BASE}/v1/threat/events?tenantId=${tenantId}`),
                fetch(`${API_BASE}/v1/threat/summary?tenantId=${tenantId}`)
            ]);

            if (eventsRes.ok) setEvents(await eventsRes.json());
            if (summaryRes.ok) setSummaries(await summaryRes.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const runAggregation = async () => {
        if (!user) return;
        setAggregating(true);
        try {
            const tenantId = "default-tenant";
            await fetch(`${API_BASE}/v1/threat/aggregate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ tenantId: tenantId })
            });
            await fetchData();
        } catch (e) {
            console.error(e);
        } finally {
            setAggregating(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Shield className="w-4 h-4 text-emerald-400" />
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter text-white italic">Threat Intelligence</h1>
                    </div>
                    <p className="text-neutral-400 text-xs font-medium uppercase tracking-[0.2em]">Network-wide anomaly detection & risk scoring</p>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={runAggregation}
                        disabled={aggregating}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest text-emerald-400 transition-all disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3 h-3 ${aggregating ? 'animate-spin' : ''}`} />
                        {aggregating ? 'Aggregating...' : 'Sync Scores'}
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white/[0.05] hover:bg-white/[0.06] border border-white/[0.06] rounded-lg text-[10px] font-black uppercase tracking-widest text-neutral-400 transition-all">
                        <Filter className="w-3 h-3" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Aggregated Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {summaries.slice(0, 3).map((summary) => (
                    <div key={summary.id} className="relative group overflow-hidden rounded-2xl border border-white/[0.06] bg-neutral-900/50 backdrop-blur-xl p-6 transition-all hover:border-emerald-500/30">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Skull className="w-12 h-12 text-rose-500" />
                        </div>
                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Entity: {summary.entity_id}</p>
                        <h3 className="text-3xl font-black text-white mb-4 italic tracking-tighter">{summary.threat_score}</h3>
                        <div className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest">
                            <span className="text-rose-500/80">Threat Level</span>
                            <span className={summary.threat_score > 50 ? "text-rose-500" : "text-amber-500"}>
                                {summary.threat_score > 100 ? "CRITICAL" : (summary.threat_score > 50 ? "HIGH" : "ELEVATED")}
                            </span>
                        </div>
                        <div className="mt-4 w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                            <div 
                                className={`h-full transition-all duration-1000 ${summary.threat_score > 50 ? "bg-rose-500" : "bg-amber-500"}`}
                                style={{ width: `${Math.min(summary.threat_score, 100)}%` }}
                            />
                        </div>
                    </div>
                ))}
                {summaries.length === 0 && !loading && (
                    <div className="md:col-span-3 py-12 rounded-2xl border border-dashed border-white/[0.06] flex flex-col items-center justify-center text-neutral-400">
                        <Shield className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No critical threats detected</p>
                    </div>
                )}
            </div>

            {/* Live Event Stream */}
            <div className="rounded-2xl border border-white/[0.06] bg-neutral-900/40 overflow-hidden">
                <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.05] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-emerald-400" />
                        <h2 className="text-[11px] font-black uppercase tracking-widest text-white">Live Threat Stream</h2>
                    </div>
                    <span className="text-[9px] font-black text-emerald-500/50 uppercase tracking-widest animate-pulse">Scanning Network...</span>
                </div>

                <div className="divide-y divide-white/[0.04]">
                    {events.map((event) => (
                        <div key={event.id} className="p-4 hover:bg-white/[0.05] transition-colors group">
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 p-1.5 rounded-lg border flex-shrink-0 ${
                                    event.severity === 'high' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' :
                                    event.severity === 'medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                    'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                }`}>
                                    <AlertTriangle className="w-3 h-3" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-[11px] font-black text-white uppercase tracking-wider">{event.event_type.replace(/_/g, ' ')}</h4>
                                        <span className="text-[9px] font-medium text-neutral-600 italic">{new Date(event.createdat).toLocaleString()}</span>
                                    </div>
                                    <p className="text-[10px] text-neutral-400 font-medium mb-2">Agent <code className="text-emerald-400 px-1 bg-emerald-500/5 rounded">{event.agentid}</code> triggered a security flag.</p>
                                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                                        {Object.entries(event.details || {}).map(([k, v]) => (
                                            <span key={k} className="text-[8px] font-black text-neutral-400 border border-white/[0.06] px-2 py-0.5 rounded uppercase tracking-tighter whitespace-nowrap">
                                                {k}: {String(v)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-neutral-600 hover:text-white">
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {events.length === 0 && !loading && (
                        <div className="p-12 text-center text-neutral-600">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Silence is golden. No incidents recorded.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
