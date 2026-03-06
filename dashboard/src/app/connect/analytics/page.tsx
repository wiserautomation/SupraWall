"use client";

import { useState } from "react";
import { usePlatform, useConnectAnalytics } from "@/hooks/useConnect";
import { StatCard } from "@/components/connect/StatCard";
import { EmptyState } from "@/components/connect/EmptyState";
import { Button } from "@/components/ui/button";
import { Activity, Zap, Shield, BrickWall, TrendingUp } from "lucide-react";

const PERIOD_OPTIONS = [
    { label: "24h", days: 1 },
    { label: "7d", days: 7 },
    { label: "30d", days: 30 },
    { label: "90d", days: 90 },
];

export default function ConnectAnalyticsPage() {
    const { platform, loading: platformLoading } = usePlatform();
    const [days, setDays] = useState(7);
    const { analytics, loading } = useConnectAnalytics(platform?.platformId, days);

    if (platformLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
            </div>
        );
    }

    if (!platform) {
        return (
            <EmptyState
                icon={Activity}
                title="No platform set up"
                description="Set up AgentGate Connect first."
                action={<a href="/connect"><Button>Go to Connect</Button></a>}
            />
        );
    }

    const total = analytics?.totalEvents ?? 0;
    const allow = analytics?.byDecision?.ALLOW ?? 0;
    const deny = analytics?.byDecision?.DENY ?? 0;
    const approval = analytics?.byDecision?.REQUIRE_APPROVAL ?? 0;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Across all customers on <span className="font-medium">{platform.name}</span>
                    </p>
                </div>
                {/* Period selector */}
                <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                    {PERIOD_OPTIONS.map((opt) => (
                        <button
                            key={opt.days}
                            onClick={() => setDays(opt.days)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${days === opt.days
                                    ? "bg-white shadow text-gray-900"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
                </div>
            ) : (
                <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            icon={Activity}
                            title="Total Calls"
                            value={total.toLocaleString()}
                            subtitle={`last ${days} day${days !== 1 ? "s" : ""}`}
                        />
                        <StatCard
                            icon={TrendingUp}
                            title="Allowed"
                            value={allow.toLocaleString()}
                            subtitle={total > 0 ? `${Math.round((allow / total) * 100)}% of calls` : "—"}
                        />
                        <StatCard
                            icon={Shield}
                            title="Blocked"
                            value={deny.toLocaleString()}
                            subtitle={total > 0 ? `${Math.round((deny / total) * 100)}% of calls` : "—"}
                        />
                        <StatCard
                            icon={Zap}
                            title="Avg Latency"
                            value={analytics ? `${analytics.avgLatencyMs}ms` : "—"}
                            subtitle="policy evaluation time"
                        />
                    </div>

                    {/* Decision breakdown */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h2 className="text-sm font-semibold text-gray-700 mb-5">
                            Decision Breakdown
                        </h2>
                        {total === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">
                                No agent activity in this period.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {[
                                    { label: "Allow", count: allow, color: "bg-green-500", textColor: "text-green-700" },
                                    { label: "Deny", count: deny, color: "bg-red-500", textColor: "text-red-700" },
                                    { label: "Needs Approval", count: approval, color: "bg-yellow-400", textColor: "text-yellow-700" },
                                ].map((row) => (
                                    <div key={row.label} className="space-y-1">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className={`font-medium ${row.textColor}`}>{row.label}</span>
                                            <span className="text-gray-500">
                                                {row.count.toLocaleString()} &nbsp;
                                                <span className="text-gray-400">
                                                    ({total > 0 ? Math.round((row.count / total) * 100) : 0}%)
                                                </span>
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${row.color}`}
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

                    {/* Top tools + top customers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Top tools */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-sm font-semibold text-gray-700 mb-4">
                                Top Tools Called
                            </h2>
                            {(analytics?.topTools ?? []).length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">
                                    No data in this period.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {analytics!.topTools.map((tool, i) => {
                                        const pct = total > 0
                                            ? Math.round((tool.calls / total) * 100)
                                            : 0;
                                        return (
                                            <div key={tool.toolName} className="space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-400 w-4">{i + 1}.</span>
                                                        <code className="bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-700">
                                                            {tool.toolName}
                                                        </code>
                                                    </div>
                                                    <span className="text-gray-500 font-medium">
                                                        {tool.calls.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Top customers */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-sm font-semibold text-gray-700 mb-4">
                                Most Active Customers
                            </h2>
                            {(analytics?.topCustomers ?? []).length === 0 ? (
                                <p className="text-sm text-gray-400 text-center py-6">
                                    No data in this period.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {analytics!.topCustomers.map((customer, i) => {
                                        const pct = total > 0
                                            ? Math.round((customer.calls / total) * 100)
                                            : 0;
                                        return (
                                            <div key={customer.customerId} className="space-y-1">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-400 w-4">{i + 1}.</span>
                                                        <span className="font-medium text-gray-700 truncate max-w-[150px]">
                                                            {customer.customerId}
                                                        </span>
                                                    </div>
                                                    <span className="text-gray-500 font-medium">
                                                        {customer.calls.toLocaleString()} calls
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className="h-full bg-purple-400 rounded-full transition-all duration-500"
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
                </>
            )}
        </div>
    );
}
