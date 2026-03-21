"use client";

import { useState } from "react";
import { usePlatform, useConnectEvents } from "@/hooks/useConnect";
import { DecisionBadge } from "@/components/connect/DecisionBadge";
import { EmptyState } from "@/components/connect/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Shield, BrickWall, Search, Activity, Cpu, Clock, Terminal } from "lucide-react";
import type { ConnectEvent } from "@/types/connect";

export default function ConnectEventsPage() {
    const { platform, loading: platformLoading } = usePlatform();
    const [customerFilter, setCustomerFilter] = useState("");
    const [decisionFilter, setDecisionFilter] = useState<string>("all");
    const [days, setDays] = useState(1);

    const { events, loading } = useConnectEvents(platform?.platformId, {
        customerId: customerFilter.trim() || undefined,
        decision: decisionFilter === "all" ? undefined : decisionFilter,
        limitDays: days,
    });

    if (platformLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Shield className="w-8 h-8 text-emerald-500 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 animate-pulse">Scanning Audit Logs...</p>
                </div>
            </div>
        );
    }

    if (!platform) {
        return (
            <EmptyState
                icon={Terminal}
                title="Audit System Offline"
                description="Initialize your Connect platform to begin recording agent forensic data."
                action={<a href="/connect"><Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px]">Initialize Connect</Button></a>}
            />
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Forensic Audit Log</h1>
                <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                    Universal telemetry feed for across all platform entities
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center bg-white/[0.05] border border-white/[0.08] p-4 rounded-2xl backdrop-blur-md">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-600" />
                    <Input
                        placeholder="IDENTIFIER SEARCH..."
                        value={customerFilter}
                        onChange={(e) => setCustomerFilter(e.target.value)}
                        className="pl-10 h-10 bg-black/40 border-white/[0.06] focus:border-emerald-500/30 text-[11px] font-black uppercase tracking-widest placeholder:text-neutral-700"
                    />
                </div>

                <Select value={decisionFilter} onValueChange={setDecisionFilter}>
                    <SelectTrigger className="w-48 h-10 bg-black/40 border-white/[0.06] text-[10px] font-black uppercase tracking-widest focus:ring-0 focus:border-emerald-500/30">
                        <SelectValue placeholder="EVENT CLASSIFICATION" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-white/[0.08] text-white">
                        <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">ALL SIGNALS</SelectItem>
                        <SelectItem value="ALLOW" className="text-[10px] font-black uppercase tracking-widest text-emerald-400">ALLOWED ONLY</SelectItem>
                        <SelectItem value="DENY" className="text-[10px] font-black uppercase tracking-widest text-rose-400">DENIED ONLY</SelectItem>
                        <SelectItem value="REQUIRE_APPROVAL" className="text-[10px] font-black uppercase tracking-widest text-amber-400">PENDING ONLY</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
                    <SelectTrigger className="w-40 h-10 bg-black/40 border-white/[0.06] text-[10px] font-black uppercase tracking-widest focus:ring-0 focus:border-emerald-500/30">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-900 border-white/[0.08] text-white">
                        <SelectItem value="1" className="text-[10px] font-black uppercase tracking-widest">LAST 24H</SelectItem>
                        <SelectItem value="7" className="text-[10px] font-black uppercase tracking-widest">LAST 7D</SelectItem>
                        <SelectItem value="30" className="text-[10px] font-black uppercase tracking-widest">LAST 30D</SelectItem>
                        <SelectItem value="90" className="text-[10px] font-black uppercase tracking-widest">LAST 90D</SelectItem>
                    </SelectContent>
                </Select>

                <div className="ml-auto flex items-center gap-2 px-4 py-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <Activity className="w-3 h-3 text-emerald-500" />
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                        {loading ? "SYNCING..." : `${events.length.toLocaleString()} SIGNALS`}
                    </span>
                </div>
            </div>

            {/* Events list */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[300px]">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500" />
                </div>
            ) : events.length === 0 ? (
                <EmptyState
                    icon={Shield}
                    title="No Telemetry Detected"
                    description="No agent activity matched your filter parameters within the specified time range."
                />
            ) : (
                <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-sm">
                    {/* Table header */}
                    <div className="grid grid-cols-[1.2fr_1.8fr_1fr_100px_120px_90px_130px] gap-4 px-6 py-4
                        bg-white/[0.01] border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                        <span>Source Entity</span>
                        <span>Capability Invoked</span>
                        <span>Heuristic Reason</span>
                        <span>Est. Cost</span>
                        <span>Class</span>
                        <span>Latency</span>
                        <span className="text-right">Timestamp</span>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-white/[0.04]">
                        {events.map((event: ConnectEvent) => (
                            <div
                                key={event.eventId}
                                className="grid grid-cols-[1.2fr_1.8fr_1fr_100px_120px_90px_130px] gap-4
                                    px-6 py-4 hover:bg-white/[0.01] transition-all items-center group"
                            >
                                {/* Customer */}
                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-neutral-200 truncate group-hover:text-white transition-colors">
                                        {event.customerId}
                                    </p>
                                    <p className="text-[9px] text-neutral-600 font-mono truncate">
                                        ID: {event.subKeyId.slice(0, 8)}...
                                    </p>
                                </div>

                                {/* Tool */}
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className="p-1.5 rounded-md bg-black border border-white/10 group-hover:border-emerald-500/20 transition-all">
                                        <Cpu className="w-3.5 h-3.5 text-neutral-600 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                    <code className="text-[11px] font-mono text-emerald-400 truncate opacity-80 group-hover:opacity-100 italic">
                                        {event.toolName}
                                    </code>
                                </div>

                                {/* Reason */}
                                <div className="min-w-0">
                                    {event.reason ? (
                                        <p className="text-[10px] text-neutral-500 truncate font-medium uppercase tracking-tight group-hover:text-neutral-400 transition-colors" title={event.reason}>
                                            {event.reason}
                                        </p>
                                    ) : (
                                        <span className="text-[10px] text-neutral-800 uppercase tracking-widest font-black">UNLISTED</span>
                                    )}
                                </div>

                                {/* Cost */}
                                <div>
                                    <span className="text-[11px] font-black text-amber-500 tabular-nums">
                                        {event.cost_usd ? `$${event.cost_usd.toFixed(4)}` : "—"}
                                    </span>
                                </div>

                                {/* Decision */}
                                <div>
                                    <DecisionBadge decision={event.decision} />
                                </div>

                                {/* Latency */}
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-neutral-700" />
                                    <span className={`text-[11px] font-black tabular-nums ${event.latencyMs > 200
                                        ? "text-orange-500"
                                        : "text-neutral-500"
                                        }`}>
                                        {event.latencyMs}ms
                                    </span>
                                </div>

                                {/* Timestamp */}
                                <div className="text-right">
                                    {event.timestamp ? (
                                        <div className="flex flex-col items-end">
                                            <p className="text-[10px] font-black text-neutral-400 uppercase tabular-nums">
                                                {new Date(event.timestamp).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                    hour12: false
                                                })}
                                            </p>
                                            <p className="text-[9px] font-bold text-neutral-700 uppercase tracking-tighter">
                                                {new Date(event.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] text-neutral-800 uppercase tracking-widest font-black">—</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
