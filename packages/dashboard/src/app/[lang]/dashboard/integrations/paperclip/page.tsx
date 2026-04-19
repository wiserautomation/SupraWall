// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { 
    Zap, 
    Shield, 
    Link as LinkIcon, 
    Activity, 
    Cpu, 
    Users, 
    ShieldCheck, 
    Clock, 
    ChevronRight,
    ExternalLink,
    RefreshCw,
    CheckCircle2,
    Lock,
    Terminal,
    AlertCircle,
    TrendingUp,
    Gauge,
    ShieldAlert,
    BarChart3
} from "lucide-react";
import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface PaperclipStatus {
    connected: boolean;
    companyId?: string;
    agentCount?: number;
    status?: string;
    onboardedAt?: string;
    apiUrl?: string;
    activeTokens?: number;
    shadowCount?: number;
    roi?: {
        costSaved: number;
        totalSpend: number;
    };
    performance?: {
        avgLatency: number;
        complianceRate: number;
    };
    toolDistribution?: Array<{
        toolname: string;
        usage_count: string;
    }>;
    recentActivity?: Array<{
        action: string;
        agent_id: string;
        tool_name: string;
        created_at: string;
    }>;
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

export default function PaperclipDashboardPage() {
    const [user] = useAuthState(auth);
    const [status, setStatus] = useState<PaperclipStatus | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchStatus = async () => {
        if (!user) return;
        setIsRefreshing(true);
        try {
            const idToken = await user.getIdToken();
            const res = await fetch("/api/v1/integrations/paperclip/status", {
                headers: { 'Authorization': `Bearer ${idToken}` }
            });
            if (res.ok) {
                const data = await res.json();
                setStatus(data);
            }
        } catch (error) {
            console.error("Error fetching Paperclip status:", error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
        );
    }

    if (!status?.connected) {
        return (
            <div className="max-w-4xl mx-auto py-20 px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900/50 border border-white/10 rounded-[40px] p-12 text-center space-y-8"
                >
                    <div className="mx-auto w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center border border-emerald-500/20">
                        <Zap className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">Connection Required</h1>
                        <p className="text-neutral-500 max-w-md mx-auto font-medium">
                            SupraWall is not yet connected to your Paperclip company. Sync your fleet to enable zero-trust credential injection.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-xs h-14 px-10 rounded-2xl">
                            <Link href="/integrations/paperclip">Setup Integration Guide</Link>
                        </Button>
                        <Button variant="outline" className="border-white/10 text-white font-black uppercase tracking-widest text-xs h-14 px-10 rounded-2xl hover:bg-white/5">
                            Open Paperclip Dashboard <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const chartData = status.toolDistribution?.map((t, idx) => ({
        name: t.toolname,
        value: parseInt(t.usage_count, 10)
    })) || [];

    return (
        <div className="space-y-12 pb-20">
            {/* Pro Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" /> Enterprise Governance
                        </div>
                        <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
                            Pro Metrics Active
                        </div>
                    </div>
                    <h1 className="text-5xl font-black text-white tracking-tighter italic uppercase">Paperclip Fleet Control</h1>
                    <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">Real-time risk thermal map and ROI auditing.</p>
                </div>
                <div className="flex gap-4">
                    <Button 
                        onClick={fetchStatus} 
                        disabled={isRefreshing}
                        variant="outline" 
                        className="bg-white/5 border-white/10 text-neutral-400 hover:text-white rounded-xl h-12"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs h-12 px-6 rounded-xl shadow-lg shadow-emerald-500/20">
                        Rotate Master Key
                    </Button>
                </div>
            </div>

            {/* Pro Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: "Active Agents", value: status.agentCount, icon: Users, color: "text-emerald-400", bg: "bg-emerald-500/10", border: 'border-emerald-500/20' },
                    { label: "Live Run Tokens", value: status.activeTokens, icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10", border: 'border-blue-500/20' },
                    { label: "Vault Endpoint", value: "Active", icon: Lock, color: "text-purple-400", bg: "bg-purple-500/10", border: 'border-purple-500/20' },
                    { label: "Shadow Mode", value: status.shadowCount, icon: Activity, color: "text-amber-400", bg: "bg-amber-500/10", border: 'border-amber-500/20' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-6 bg-neutral-900/30 border ${stat.border} rounded-[32px] space-y-4 hover:bg-neutral-900/50 transition-all group relative overflow-hidden`}
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="w-16 h-16" />
                        </div>
                        <div className={`p-3 w-fit rounded-2xl ${stat.bg} border border-white/5`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black text-white italic tracking-tight">{stat.value}</p>
                            <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-tight mt-1">{stat.sub}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Insights Section */}
                <Card className="lg:col-span-2 bg-neutral-900/40 border-white/10 rounded-[32px] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-5 h-5 text-emerald-500" />
                            <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Fleet Composition & Tool Usage</h3>
                        </div>
                        <div className="flex gap-2">
                             <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20">Low Risk</Badge>
                             <Badge variant="outline" className="bg-neutral-900 text-neutral-500 border-white/5">{status.agentCount} Agents</Badge>
                        </div>
                    </div>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="h-[240px] relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '12px' }}
                                            itemStyle={{ color: '#fff', fontSize: '10px' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                    <span className="text-2xl font-black text-white italic">Tools</span>
                                    <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest">Usage Distribution</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {status.toolDistribution?.slice(0, 4).map((tool, idx) => (
                                    <div key={idx} className="space-y-2">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                            <span className="text-neutral-300 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                                {tool.toolname}
                                            </span>
                                            <span className="text-neutral-500">{tool.usage_count} calls</span>
                                        </div>
                                        <Progress value={Math.min(100, (parseInt(tool.usage_count, 10) / 100) * 100)} className="h-1 bg-white/5" />
                                    </div>
                                ))}
                                {(!status.toolDistribution || status.toolDistribution.length === 0) && (
                                    <div className="py-10 text-center border-2 border-dashed border-white/5 rounded-3xl">
                                        <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">No activity yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Efficiency Score Card */}
                <Card className="bg-emerald-600 text-white rounded-[32px] overflow-hidden relative group">
                    <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <ShieldCheck className="w-64 h-64" />
                    </div>
                    <CardContent className="p-8 h-full flex flex-col justify-between space-y-8 relative z-10">
                        <div className="space-y-6">
                            <div className="p-4 bg-white/10 rounded-2xl w-fit">
                                <Activity className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Governance Efficiency</h3>
                                <p className="text-emerald-100/70 text-xs font-bold uppercase tracking-widest">Real-time audit performance</p>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Compliance Baseline</span>
                                <span className="text-2xl font-black italic">{status.performance?.complianceRate}%</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/10 pb-4">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Risk Decoupling</span>
                                <span className="text-2xl font-black italic">ACTIVE</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Fleet Health</span>
                                <span className="text-2xl font-black italic">PRIME</span>
                            </div>
                        </div>

                        <Button className="w-full bg-white text-emerald-600 font-black uppercase tracking-widest text-xs h-14 rounded-2xl hover:bg-neutral-100 transition-all">
                            Generate Pro Audit PDF
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Advanced Configuration */}
                <Card className="bg-neutral-900/40 border-white/10 rounded-[32px] overflow-hidden">
                    <div className="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-purple-500" />
                            <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Identity & Scopes</h3>
                        </div>
                        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">RBAC Enabled</Badge>
                    </div>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                                <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Primary Identity</p>
                                <p className="text-xs font-mono text-white truncate">{status.companyId}</p>
                            </div>
                            <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                                <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Current Framework</p>
                                <p className="text-xs font-bold text-white uppercase italic">Paperclip CLI 1.4.2</p>
                            </div>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-relaxed italic border-l-2 border-purple-500/30 pl-4 py-1">
                            "Agent roles (CEO, Marketing, Finance) are dynamically mapped to SupraWall policies during the <strong>agent.hired</strong> callback. Scoped tool permissions are injected at the runtime level."
                        </p>
                    </CardContent>
                </Card>

                {/* Audit Lifecycle Trace */}
                <Card className="bg-neutral-900/40 border-white/10 rounded-[32px] overflow-hidden">
                    <div className="p-8 border-b border-white/5 bg-black/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Terminal className="w-5 h-5 text-amber-500" />
                            <h3 className="text-sm font-black text-white uppercase italic tracking-widest">Lifecycle Audit Trace</h3>
                        </div>
                        <Link href="/dashboard/audit-logs" className="text-[10px] font-black text-neutral-500 uppercase tracking-widest hover:text-white transition-colors">
                            Full Logs &rarr;
                        </Link>
                    </div>
                    <CardContent className="p-0">
                        <div className="divide-y divide-white/5">
                            {status.recentActivity?.map((log, i) => (
                                <div key={i} className="px-8 py-5 flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${log.tool_name.includes('hired') ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-rose-500 shadow-[0_0_8px_#ef4444]'}`} />
                                        <div>
                                            <p className="text-[11px] font-black text-white uppercase italic">{log.tool_name === 'agent.hired' ? 'Agent Onboarded' : 'Identity Revoked'}</p>
                                            <p className="text-[9px] font-mono text-neutral-600">{log.agent_id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{new Date(log.created_at).toLocaleTimeString()}</p>
                                        <p className="text-[8px] font-bold text-neutral-700 uppercase">{new Date(log.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )) || (
                                <div className="p-20 text-center space-y-4">
                                     <AlertCircle className="w-8 h-8 text-neutral-800 mx-auto" />
                                     <p className="text-[10px] font-black text-neutral-700 uppercase tracking-widest">No recently synced events</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
