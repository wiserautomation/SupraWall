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
import { Shield, Search } from "lucide-react";
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
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
        );
    }

    if (!platform) {
        return (
            <EmptyState
                icon={Shield}
                title="No platform set up"
                description="Set up AgentGate Connect first."
                action={<a href="/connect"><Button>Go to Connect</Button></a>}
            />
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Every agent action across all customers — searchable and filterable.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Filter by customer ID..."
                        value={customerFilter}
                        onChange={(e) => setCustomerFilter(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select value={decisionFilter} onValueChange={setDecisionFilter}>
                    <SelectTrigger className="w-44">
                        <SelectValue placeholder="All decisions" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All decisions</SelectItem>
                        <SelectItem value="ALLOW">Allow</SelectItem>
                        <SelectItem value="DENY">Deny</SelectItem>
                        <SelectItem value="REQUIRE_APPROVAL">Needs Approval</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={String(days)} onValueChange={(v) => setDays(Number(v))}>
                    <SelectTrigger className="w-32">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Last 24h</SelectItem>
                        <SelectItem value="7">Last 7 days</SelectItem>
                        <SelectItem value="30">Last 30 days</SelectItem>
                        <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                </Select>

                <span className="text-xs text-gray-400 ml-auto">
                    {loading ? "Loading..." : `${events.length} event${events.length !== 1 ? "s" : ""}`}
                </span>
            </div>

            {/* Events list */}
            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
                </div>
            ) : events.length === 0 ? (
                <EmptyState
                    icon={Shield}
                    title="No events found"
                    description="No agent activity matches your filters in this time period."
                />
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    {/* Table header */}
                    <div className="grid grid-cols-[1fr_1.5fr_1fr_100px_80px_120px] gap-4 px-5 py-3
            bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600">
                        <span>Customer</span>
                        <span>Tool</span>
                        <span>Reason</span>
                        <span>Decision</span>
                        <span>Latency</span>
                        <span>Time</span>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-gray-100">
                        {events.map((event: ConnectEvent) => (
                            <div
                                key={event.eventId}
                                className="grid grid-cols-[1fr_1.5fr_1fr_100px_80px_120px] gap-4
                  px-5 py-3.5 hover:bg-gray-50 transition-colors items-center"
                            >
                                {/* Customer */}
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-gray-800 truncate">
                                        {event.customerId}
                                    </p>
                                    <p className="text-xs text-gray-400 font-mono truncate">
                                        {event.subKeyId.slice(0, 14)}...
                                    </p>
                                </div>

                                {/* Tool */}
                                <div className="min-w-0">
                                    <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700 block truncate">
                                        {event.toolName}
                                    </code>
                                </div>

                                {/* Reason */}
                                <div className="min-w-0">
                                    {event.reason ? (
                                        <p className="text-xs text-gray-500 truncate" title={event.reason}>
                                            {event.reason}
                                        </p>
                                    ) : (
                                        <span className="text-xs text-gray-300">—</span>
                                    )}
                                </div>

                                {/* Decision */}
                                <div>
                                    <DecisionBadge decision={event.decision} />
                                </div>

                                {/* Latency */}
                                <div>
                                    <span className={`text-xs font-medium ${event.latencyMs > 100
                                            ? "text-orange-600"
                                            : "text-gray-600"
                                        }`}>
                                        {event.latencyMs}ms
                                    </span>
                                </div>

                                {/* Timestamp */}
                                <div>
                                    {event.timestamp ? (
                                        <div>
                                            <p className="text-xs text-gray-600">
                                                {new Date(event.timestamp).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    second: "2-digit",
                                                })}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(event.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-300">—</span>
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
