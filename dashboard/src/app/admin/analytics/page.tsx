"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { 
    Activity, Globe, Server, Clock, Zap, AlertCircle, 
    ArrowUpRight, ArrowDownRight, Database 
} from "lucide-react";
import {
    AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, 
    CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

export default function AdminAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [traffic, setTraffic] = useState<any>(null);
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const [trafficRes, statsRes] = await Promise.all([
                    fetch('/api/admin/traffic'),
                    fetch('/api/admin/users/stats')
                ]);
                if (trafficRes.ok) setTraffic(await trafficRes.json());
                if (statsRes.ok) setStats(await statsRes.json());
            } catch (err) {
                console.error("Failed to fetch analytics", err);
            }
            setLoading(false);
        }
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2 italic uppercase">
                        <Activity className="w-8 h-8 text-emerald-500 not-italic" /> Traffic & Network
                    </h1>
                    <p className="text-neutral-500 text-sm font-medium italic uppercase tracking-widest">Global system throughput and network health.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { title: "DAU / MAU", value: `${((stats?.stats?.dauCount / stats?.stats?.mauCount) * 100).toFixed(1)}%`, sub: "Stickiness", icon: Zap, color: "text-emerald-400" },
                    { title: "7D Traffic", value: traffic?.daily?.reduce((acc: any, r: any) => acc + r.count, 0)?.toLocaleString(), sub: "Total Ops", icon: Globe, color: "text-blue-400" },
                    { title: "Peak Hourly", value: Math.max(...traffic?.hourly?.map((h: any) => h.ALLOW + h.DENY + h.REQUIRE_APPROVAL) || [0]), sub: "Ops / Hr", icon: Clock, color: "text-purple-400" },
                    { title: "Growth", value: stats?.growth?.activeGrowth, sub: "W/W Engagement", icon: ArrowUpRight, color: "text-emerald-400" }
                ].map((stat, i) => (
                    <Card key={i} className="bg-[#080808] border-white/5 relative overflow-hidden group">
                        <CardContent className="p-6">
                            <stat.icon className={`w-5 h-5 mb-2 ${stat.color}`} />
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{stat.title}</p>
                            <h3 className="text-3xl font-black text-white mt-1 tracking-tighter italic">{stat.value}</h3>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-[#080808] border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" /> Hourly Throughput (24H Breakdown)
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[350px] pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={traffic?.hourly}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                            <XAxis dataKey="hour" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                            <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '8px' }} />
                            <Area type="monotone" dataKey="ALLOW" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                            <Area type="monotone" dataKey="DENY" stackId="1" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
                            <Area type="monotone" dataKey="REQUIRE_APPROVAL" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                            <Legend verticalAlign="top" height={36} iconType="circle" />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black border-white/5">
                    <CardHeader><CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Top Tool Volume (7D)</CardTitle></CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={traffic?.topTools} layout="vertical">
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" stroke="#888" fontSize={10} width={100} tickLine={false} axisLine={false} />
                                <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#000', border: 'none' }} />
                                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="bg-black border-white/5">
                    <CardHeader><CardTitle className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Active Retention Curve</CardTitle></CardHeader>
                    <CardContent className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.retention}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                                <XAxis dataKey="day" stroke="#444" fontSize={10} tickLine={false} axisLine={false} />
                                <YAxis stroke="#444" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}%`} />
                                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #222', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
