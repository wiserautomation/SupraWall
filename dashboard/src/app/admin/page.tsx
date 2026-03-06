"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Server, Activity, Shield, BrickWall, TrendingUp, Zap, AlertCircle } from "lucide-react";
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { subDays, subHours } from "date-fns";
import Link from "next/link";

const COLORS = ['#10b981', '#f43f5e', '#f59e0b']; // ALLOW, DENY, REQUIRE_APPROVAL

export default function AdminOverviewPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAgents: 0,
        recentLogs: 0,
        activePolicies: 0,
        successRate: "99.4%",
        threatsBlocked: 0
    });

    const [charts, setCharts] = useState({
        signups: [] as any[],
        activity: [] as any[],
        decisions: [] as any[],
        traffic: [] as any[],
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
                // Fetch basic metrics
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

                // --- Calculate Traffic & Charts ---
                let allow = 0, deny = 0, reqApprove = 0;
                const blockedTools: Record<string, number> = {};
                const agentLogCounts: Record<string, number> = {};

                // Traffic by hour (for sparkline)
                const trafficMap: Record<string, number> = {};
                for (let i = 12; i >= 0; i--) {
                    trafficMap[subHours(new Date(), i).getHours() + ":00"] = 0;
                }

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

                    const logHour = new Date(data.timestamp).getHours() + ":00";
                    if (trafficMap[logHour] !== undefined) trafficMap[logHour]++;
                });

                // Signups map
                const signupsMap: Record<string, number> = {};
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

                const agentActivity = Object.entries(agentLogCounts)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([id, count]) => {
                        const agent = agentsSnap.docs.find((d: any) => d.id === id);
                        return { name: agent ? agent.data().name : 'Unknown', Activity: count };
                    });

                setStats({
                    totalUsers: usersSnap.size,
                    totalAgents: agentsSnap.size,
                    recentLogs: logsSnap.size,
                    activePolicies: policiesSnap.size,
                    successRate: logsSnap.size > 0 ? ((allow / logsSnap.size) * 100).toFixed(1) + "%" : "100%",
                    threatsBlocked: deny
                });

                setCharts({
                    signups: Object.entries(signupsMap).map(([date, count]) => ({ date, signups: count })),
                    activity: agentActivity,
                    decisions: [
                        { name: "ALLOW", value: allow },
                        { name: "DENY", value: deny },
                        { name: "REQUIRE_APPROVAL", value: reqApprove },
                    ].filter(d => d.value > 0),
                    traffic: Object.entries(trafficMap).map(([hour, count]) => ({ hour, requests: count })),
                });

                // Quick Stats
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
        { title: "Agents Active", value: stats.totalAgents, icon: Server, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { title: "Success Rate", value: stats.successRate, icon: Zap, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { title: "Threats Blocked", value: stats.threatsBlocked, icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10" },
    ];

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex justify-between items-end mb-8">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-sm italic uppercase">System Overview</h1>
                    <p className="text-neutral-400 text-sm font-medium">Real-time metrics and system health for the entire platform.</p>
                </div>
                <Link href="/admin/analytics" className="px-4 py-2 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold hover:bg-emerald-600/20 transition-all flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" /> View Advanced Traffic
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, index) => {
                    const Icon = kpi.icon;
                    return (
                        <Card key={index} className="bg-[#0A0A0A] border-white/5 backdrop-blur-md hover:border-white/10 transition-colors">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{kpi.title}</p>
                                    <p className="text-4xl font-black text-white tracking-tighter">{kpi.value}</p>
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
                {/* Traffic Sparkline (Simplified Line Chart) */}
                <Card className="col-span-1 lg:col-span-2 bg-[#0A0A0A] border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Global Traffic (12H)
                        </CardTitle>
                        <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Live</span>
                    </CardHeader>
                    <CardContent className="h-[300px] pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={charts.traffic}>
                                <defs>
                                    <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="hour" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '8px', color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="requests" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTraffic)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Policy Decisions Pie Chart */}
                <Card className="col-span-1 bg-[#0A0A0A] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <BrickWall className="w-4 h-4" /> Decisions (24h)
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agent Activity Bar Chart */}
                <Card className="col-span-1 lg:col-span-2 bg-[#0A0A0A] border-white/5">
                    <CardHeader>
                        <CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Server className="w-4 h-4" /> Top Agents By Traffic
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
                        <CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            Quick Global Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-neutral-500 text-[10px] font-black uppercase">Most Active Agent</span>
                                <span className="text-white font-bold text-sm truncate max-w-[120px]">{quickStats.mostActiveAgent}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-neutral-500 text-[10px] font-black uppercase">Most Blocked Tool</span>
                                <span className="text-rose-400 font-bold text-sm truncate max-w-[120px]">{quickStats.mostBlockedTool}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-white/5">
                                <span className="text-neutral-500 text-[10px] font-black uppercase">Top Engine User</span>
                                <span className="text-white font-bold text-sm truncate max-w-[120px]">{quickStats.topUser}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-neutral-500 text-[10px] font-black uppercase">Avg Policies / Agent</span>
                                <span className="text-white font-bold text-sm">{quickStats.avgPolicies}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

