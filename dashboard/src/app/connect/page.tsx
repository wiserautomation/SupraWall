"use client";

import { usePlatform } from "@/hooks/useConnect";
import { useConnectAnalytics } from "@/hooks/useConnect";
import { StatCard } from "@/components/connect/StatCard";
import { EmptyState } from "@/components/connect/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Shield, Key, Users, Activity, Zap, AlertTriangle
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
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
        );
    }

    // ── No platform yet — show setup screen ──────────────────────────────────
    if (!platform) {
        return (
            <div className="max-w-lg mx-auto mt-20 px-4">
                <div className="text-center mb-8">
                    <div className="inline-flex p-3 bg-indigo-50 rounded-full mb-4">
                        <Shield className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Set up AgentGate Connect</h1>
                    <p className="text-gray-500 mt-2">
                        Issue security keys to your customers. Govern all their agents
                        from one place.
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
                    <div>
                        <Label htmlFor="platform-name">Platform name</Label>
                        <Input
                            id="platform-name"
                            placeholder="e.g. Acme Corp"
                            value={platformName}
                            onChange={(e) => setPlatformName(e.target.value)}
                            className="mt-1"
                        />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <Button
                        className="w-full"
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
                        {creating ? "Creating..." : "Create Platform"}
                    </Button>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-gray-500">
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <Key className="w-4 h-4 mx-auto mb-1 text-indigo-500" />
                        Issue sub-keys per customer
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <Shield className="w-4 h-4 mx-auto mb-1 text-indigo-500" />
                        Enforce policies across all agents
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <Activity className="w-4 h-4 mx-auto mb-1 text-indigo-500" />
                        Full audit log per customer
                    </div>
                </div>
            </div>
        );
    }

    // ── Platform exists — show overview dashboard ─────────────────────────────
    const allowCount = analytics?.byDecision?.ALLOW ?? 0;
    const denyCount = analytics?.byDecision?.DENY ?? 0;
    const approvalCount = analytics?.byDecision?.REQUIRE_APPROVAL ?? 0;
    const totalEvents = analytics?.totalEvents ?? 0;
    const blockRate = totalEvents > 0
        ? Math.round(((denyCount + approvalCount) / totalEvents) * 100)
        : 0;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        AgentGate Connect
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Platform: <span className="font-medium text-gray-700">{platform.name}</span>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full
              text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                            {platform.plan}
                        </span>
                    </p>
                </div>
                <Link href="/connect/keys">
                    <Button>
                        <Key className="w-4 h-4 mr-2" />
                        Issue Sub-Key
                    </Button>
                </Link>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    icon={Users}
                    title="Active Customers"
                    value={platform.totalSubKeys}
                    subtitle="with sub-keys issued"
                />
                <StatCard
                    icon={Activity}
                    title="Total Agent Calls"
                    value={totalEvents.toLocaleString()}
                    subtitle="last 7 days"
                />
                <StatCard
                    icon={Zap}
                    title="Avg Latency"
                    value={analytics ? `${analytics.avgLatencyMs}ms` : "—"}
                    subtitle="policy evaluation"
                />
                <StatCard
                    icon={AlertTriangle}
                    title="Block Rate"
                    value={`${blockRate}%`}
                    subtitle={`${denyCount + approvalCount} blocked actions`}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Top tools */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Top Tools Called</h2>
                    {(analytics?.topTools ?? []).length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No data yet.</p>
                    ) : (
                        <ol className="space-y-2">
                            {analytics!.topTools.map((t, i) => (
                                <li key={i} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">
                                            {t.toolName}
                                        </code>
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">
                                        {t.calls.toLocaleString()}
                                    </span>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>

                {/* Top customers */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">Most Active Customers</h2>
                    {(analytics?.topCustomers ?? []).length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">No data yet.</p>
                    ) : (
                        <ol className="space-y-2">
                            {analytics!.topCustomers.map((c, i) => (
                                <li key={c.customerId} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 w-4">{i + 1}.</span>
                                        <span className="text-xs text-gray-700 font-medium truncate max-w-[140px]">
                                            {c.customerId}
                                        </span>
                                    </div>
                                    <span className="text-xs font-medium text-gray-600">
                                        {c.calls.toLocaleString()} calls
                                    </span>
                                </li>
                            ))}
                        </ol>
                    )}
                </div>
            </div>

            {/* Quick nav */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/connect/keys">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300
            hover:shadow-sm transition-all cursor-pointer group">
                        <Key className="w-5 h-5 text-indigo-500 mb-2 group-hover:text-indigo-700" />
                        <p className="text-sm font-semibold text-gray-800">Manage Sub-Keys</p>
                        <p className="text-xs text-gray-400 mt-0.5">Issue, revoke, configure</p>
                    </div>
                </Link>
                <Link href="/connect/analytics">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300
            hover:shadow-sm transition-all cursor-pointer group">
                        <Activity className="w-5 h-5 text-indigo-500 mb-2 group-hover:text-indigo-700" />
                        <p className="text-sm font-semibold text-gray-800">Analytics</p>
                        <p className="text-xs text-gray-400 mt-0.5">Decisions, latency, trends</p>
                    </div>
                </Link>
                <Link href="/connect/events">
                    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:border-indigo-300
            hover:shadow-sm transition-all cursor-pointer group">
                        <Shield className="w-5 h-5 text-indigo-500 mb-2 group-hover:text-indigo-700" />
                        <p className="text-sm font-semibold text-gray-800">Audit Log</p>
                        <p className="text-xs text-gray-400 mt-0.5">Every agent action, searchable</p>
                    </div>
                </Link>
            </div>

        </div>
    );
}
