"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Server, Activity, Shield, TrendingUp } from "lucide-react";
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { subDays, subHours } from "date-fns";

const COLORS = ['#10b981', '#f43f5e', '#f59e0b']; // ALLOW, DENY, REQUIRE_APPROVAL

export default function AdminOverviewPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAgents: 0,
        recentLogs: 0,
        activePolicies: 0,
    });

    const [charts, setCharts] = useState({
        signups: [] as any[],
        activity: [] as any[],
        decisions: [] as any[],
    });

    const [quickStats, setQuickStats] = useState({
        mostActiveAgent: "Loading...",
        mostBlockedTool: "Loading...",
        topUser: "Loading...",
        avgPolicies: "0",
    });

    useEffect(() => {
        async function fetchAdminData() {
            setLoading(true);
            try {
                // Fetch basic metrics securely from DB (Assumes proper Admin Firestore Rules or server emulation)
                const [usersSnap, agentsSnap, policiesSnap] = await Promise.all([
                    getDocs(collection(db, "users")).catch(() => ({ size: 0, docs: [] })),
                    getDocs(collection(db, "agents")).catch(() => ({ size: 0, docs: [] })),
                    getDocs(collection(db, "policies")).catch(() => ({ size: 0, docs: [] }))
                ]);

                // Recent Logs (24h)
                const yesterday = subDays(new Date(), 1).getTime();
                const logsSnap = await getDocs(
                    query(collection(db, "audit_logs"), where("timestamp", ">=", yesterday))
                ).catch(() => ({ size: 0, docs: [] }));

                // --- Calculate KPIs ---
                setStats({
                    totalUsers: usersSnap.size,
                    totalAgents: agentsSnap.size,
                    recentLogs: logsSnap.size,
                    activePolicies: policiesSnap.size,
                });

                // --- Build Charts Data ---
                // 1. Signups Over Time (Mocked from user timestamps or defaulting to 0)
                const signupsMap: Record<string, number> = {};
                // Fill last 7 days with 0s first
                for (let i = 6; i >= 0; i--) {
                    signupsMap[subDays(new Date(), i).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })] = 0;
                }
                usersSnap.docs.forEach((doc: any) => {
                    const data = doc.data();
                    if (data.createdAt) {
                        const date = new Date(data.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                        if (signupsMap[date] !== undefined) signupsMap[date]++;
                    }
                });

                // 2. Policy Decisions
                let allow = 0, deny = 0, reqApprove = 0;
                const toolCounts: Record<string, number> = {};
                const blockedTools: Record<string, number> = {};
                const agentLogCounts: Record<string, number> = {};

                logsSnap.docs.forEach((doc: any) => {
                    const data = doc.data();
                    const d = data.decision?.toUpperCase();
                    if (d === 'ALLOW') allow++;
                    else if (d === 'DENY') {
                        deny++;
                        blockedTools[data.toolName] = (blockedTools[data.toolName] || 0) + 1;
                    }
                    else if (d === 'REQUIRE_APPROVAL') reqApprove++;

                    agentLogCounts[data.agentId] = (agentLogCounts[data.agentId] || 0) + 1;
                });

                // 3. Agent Activity (Top 5 agents by log count)
                const agentActivity = Object.entries(agentLogCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([id, count]) => {
                        const agent = agentsSnap.docs.find((d: any) => d.id === id);
                        return { name: agent ? agent.data().name : 'Unknown', Activity: count };
                    });

                setCharts({
                    signups: Object.entries(signupsMap).map(([date, count]) => ({ date, signups: count })),
                    activity: agentActivity,
                    decisions: [
                        { name: "ALLOW", value: allow },
                        { name: "DENY", value: deny },
                        { name: "REQUIRE_APPROVAL", value: reqApprove },
                    ].filter(d => d.value > 0),
                });

                // --- Quick Stats Table Data ---
                let mostActiveAgentId = Object.keys(agentLogCounts).sort((a, b) => agentLogCounts[b] - agentLogCounts[a])[0];
                let mostBlockedToolName = Object.keys(blockedTools).sort((a, b) => blockedTools[b] - blockedTools[a])[0];

                const userAgentCounts: Record<string, number> = {};
                agentsSnap.docs.forEach((doc: any) => {
                    const data = doc.data();
                    if (data.userId) userAgentCounts[data.userId] = (userAgentCounts[data.userId] || 0) + 1;
                });
                let topUserId = Object.keys(userAgentCounts).sort((a, b) => userAgentCounts[b] - userAgentCounts[a])[0];
                let topUserEmail = usersSnap.docs.find((u: any) => u.id === topUserId)?.data().email || topUserId;

                let avg = agentsSnap.size > 0 ? (policiesSnap.size / agentsSnap.size).toFixed(1) : "0";

                setQuickStats({
                    mostActiveAgent: mostActiveAgentId ? (agentsSnap.docs.find((d: any) => d.id === mostActiveAgentId)?.data().name || mostActiveAgentId) : "None",
                    mostBlockedTool: mostBlockedToolName || "None",
                    topUser: topUserEmail || "None",
                    avgPolicies: avg,
                });

            } catch (error) {
                console.error("AgentGate Admin: Failed to load admin insights", error);
            }
            setLoading(false);
        }

        fetchAdminData();
    }, []);

    const kpiData = [
        { title: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { title: "Agents Created", value: stats.totalAgents, icon: Server, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { title: "Active Policies", value: stats.activePolicies, icon: Shield, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { title: "Audit Logs (24h)", value: stats.recentLogs, icon: Activity, color: "text-rose-500", bg: "bg-rose-500/10" },
    ];

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">System Overview</h1>
                    <p className="text-neutral-400 text-sm">Real-time metrics and system health for the entire platform.</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <Card key={index} className="bg-[#0A0A0A] border-white/5 backdrop-blur-md hover:border-white/10 transition-colors">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-neutral-400">{kpi.title}</p>
                                    <p className="text-3xl font-black text-white">{kpi.value}</p>
                                </div>
                                <div className={`p-3 rounded-xl ${kpi.bg}`}>
                                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Signups Chart */}
                <Card className="col-span-1 lg:col-span-2 bg-[#0A0A0A] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            Signups Over Time (7D)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={charts.signups}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                />
                                <Line type="monotone" dataKey="signups" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Policy Decisions Pie Chart */}
                <Card className="col-span-1 bg-[#0A0A0A] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Policy Decisions (24h)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px] flex items-center justify-center">
                        {charts.decisions.length === 0 ? (
                            <p className="text-neutral-500 text-sm">No activity recorded</p>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={charts.decisions}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {charts.decisions.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#171717', border: 'none', borderRadius: '8px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Bottom Row - Agent Activity & Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Agent Activity Bar Chart */}
                <Card className="col-span-1 lg:col-span-2 bg-[#0A0A0A] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                            <Server className="w-4 h-4" />
                            Top Agent Activity (24h)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={charts.activity}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    cursor={{ fill: '#ffffff0a' }}
                                    contentStyle={{ backgroundColor: '#171717', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="Activity" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Quick Stats Table */}
                <Card className="col-span-1 bg-[#0A0A0A] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            Quick Global Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-neutral-500 text-sm">Most Active Agent</span>
                                <span className="text-white font-medium text-sm truncate max-w-[120px]">{quickStats.mostActiveAgent}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-neutral-500 text-sm">Most Blocked Tool</span>
                                <span className="text-rose-400 font-medium text-sm truncate max-w-[120px]">{quickStats.mostBlockedTool}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-neutral-500 text-sm">Top Engine User</span>
                                <span className="text-white font-medium text-sm truncate max-w-[120px]">{quickStats.topUser}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-neutral-500 text-sm">Avg Policies / Agent</span>
                                <span className="text-white font-medium text-sm">{quickStats.avgPolicies}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
