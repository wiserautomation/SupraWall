"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { suprawall } from "@/lib/suprawall";
import { useAuthState } from "react-firebase-hooks/auth";
import { sendGAEvent } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";
import { Agent } from "@/types/database";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Key, Copy, Check, Terminal, Coins, ShieldAlert, Activity, TrendingUp, DollarSign, Shield, Lock, X, UserCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Link from "next/link";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { AuditLog } from "@/types/database";
import { format } from "date-fns";

export default function OverviewPage() {
    const [user] = useAuthState(auth);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [copiedNode, setCopiedNode] = useState(false);
    const [copiedCurl, setCopiedCurl] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAgentName, setNewAgentName] = useState("");
    const [selectedScopes, setSelectedScopes] = useState<string[]>([]);
    const [customScope, setCustomScope] = useState("");
    const [nameError, setNameError] = useState("");
    const [stats, setStats] = useState({
        totalCalls: 0,
        blockedActions: 0,
        actualSpend: 0,
        costSaved: 0
    });
    const [chartData, setChartData] = useState<any[]>([]);
    const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0);


    useEffect(() => {
        if (!user) {
            // Wait for user or fallback
            return;
        }

        const q = query(collection(db, "agents"), where("userId", "==", user.uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const agentsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
            setAgents(agentsList);
            setLoading(false);

            // Fetch logs to calculate stats for THESE agents
            if (agentsList.length > 0) {
                const agentIds = agentsList.map(a => a.id).slice(0, 10);
                const qLogs = query(collection(db, "audit_logs"), where("agentId", "in", agentIds));

                onSnapshot(qLogs, (logSnap) => {
                    const logs = logSnap.docs.map(d => d.data() as AuditLog);
                    let total = logs.length;
                    let blocked = 0;
                    let spend = 0;
                    let saved = 0;

                    const dailyBuckets: Record<string, number> = {};

                    logs.forEach(log => {
                        const callCost = log.estimated_cost_usd || log.cost_usd || 0;

                        if (log.decision === "DENY") {
                            blocked++;
                            // Savings estimate: 
                            // 1. If loop detection: assume we saved 10-20 more calls
                            // 2. Base protection value: $2.50 per block
                            if (log.isLoop) {
                                saved += 10.00; // Loops are expensive
                            } else {
                                saved += 2.50;
                            }
                        } else if (log.decision === "ALLOW") {
                            spend += callCost;
                            if (log.timestamp) {
                                const dateStr = format(log.timestamp.toDate(), 'MM/dd');
                                dailyBuckets[dateStr] = (dailyBuckets[dateStr] || 0) + callCost;
                            }
                        }
                    });

                    setStats({
                        totalCalls: total,
                        blockedActions: blocked,
                        actualSpend: spend,
                        costSaved: saved
                    });

                    const chartItems = Object.entries(dailyBuckets)
                        .map(([date, amount]) => ({ date, amount: parseFloat(amount.toFixed(4)) }))
                        .sort((a, b) => a.date.localeCompare(b.date))
                        .slice(-7);

                    setChartData(chartItems);
                });
            }
        }, (error) => {
            console.error("Error fetching agents:", error);
            setLoading(false);
        });

        // Fetch pending approvals count
        const qApprovals = query(
            collection(db, "approvalRequests"),
            where("userId", "==", user.uid),
            where("status", "==", "pending")
        );
        const unsubscribeApprovals = onSnapshot(qApprovals, (snap) => {
            setPendingApprovalsCount(snap.size);
        });

        return () => {
            unsubscribe();
            unsubscribeApprovals();
        }
    }, [user]);

    const generateApiKey = () => {
        return 'ag_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const createAgent = async () => {
        const trimmedName = newAgentName.trim();
        if (!user || !trimmedName) {
            setNameError("Agent name cannot be empty.");
            return;
        }

        const isTaken = agents.some(a => a.name.toLowerCase() === trimmedName.toLowerCase());
        if (isTaken) {
            setNameError(`The name "${trimmedName}" is already taken.`);
            return;
        }

        setNameError("");
        try {
            const newAgent: Agent = {
                userId: user.uid,
                name: trimmedName,
                apiKey: generateApiKey(),
                scopes: selectedScopes.length > 0 ? selectedScopes : undefined,
                status: 'active',
            };

            // Replaced generic Firebase addDoc with our database-agnostic suprawall core SDK
            await suprawall.agents.create(newAgent);
            setNewAgentName("");
            setSelectedScopes([]);
            setIsCreateModalOpen(false);
            sendGAEvent('event', 'create_agent', { agent_name: trimmedName });
            // No need to fetchAgents() manually because onSnapshot handles it instantly!
        } catch (e) {
            console.error("Error creating agent", e);
            setNameError("Failed to create the agent. Please try again.");
        }
    };

    const copyToClipboard = async (text: string, type: 'node' | 'curl') => {
        try {
            await navigator.clipboard.writeText(text);
            if (type === 'node') {
                setCopiedNode(true);
                setTimeout(() => setCopiedNode(false), 2000);
            } else {
                setCopiedCurl(true);
                setTimeout(() => setCopiedCurl(false), 2000);
            }
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const getNodeCode = (apiKey: string) => `import { protect } from '@suprawall/langchain';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

// 1. Initialize your LangGraph Agent
const agent = createReactAgent({ llm, tools });

// 2. Wrap it with SupraWall (Zero-Config)
const secured = protect(agent, {
  apiKey: "${apiKey}",
  riskThreshold: 70 // Optional: block actions >= 70 risk score
});

// 3. Run safely - Forensic logs are automatically streamed
await secured.invoke({ messages: [...] });`;

    const getPythonCode = (apiKey: string) => `from suprawall import protect
from langgraph.prebuilt import create_react_agent

# 🛡️ Secure any LangGraph agent with one wrapper
agent = create_react_agent(llm, tools)
secured = protect(agent, api_key="${apiKey}")

# That's it. Tool usage is now governed.
secured.invoke({"messages": [...]})`;

    const getCurlCode = (apiKey: string) => `curl -X POST https://api.suprawall.ai/v1/evaluate \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "toolName": "bash_tool",
    "args": { "command": "rm -rf /" },
    "agentRole": "customer-support"
  }'`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex justify-between items-end mb-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black tracking-[0.2em] text-emerald-400 uppercase">Zero-Trust Active</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Security Overview</h1>
                    <p className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.2em]">Real-time cost control and agent governance.</p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all font-black uppercase tracking-wider text-xs">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Agent
                    </Button>
                </motion.div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {[
                    { label: "Actual Spend", value: `$${stats.actualSpend.toFixed(2)}`, icon: <Coins className="w-4 h-4 text-amber-400" />, sub: "current month", accent: "amber" },
                    { label: "Cost Saved", value: `$${stats.costSaved.toFixed(2)}`, icon: <DollarSign className="w-4 h-4 text-emerald-400" />, sub: "by policy blocks", accent: "emerald" },
                    { label: "Blocked Actions", value: stats.blockedActions, icon: <ShieldAlert className="w-4 h-4 text-rose-400" />, sub: "dangerous/unwanted", accent: "rose" },
                    { label: "Vault Secrets", value: "Active", icon: <Lock className="w-4 h-4 text-purple-400" />, sub: "secure injection", href: "/dashboard/vault", accent: "purple" },
                    { label: "Human Approvals", value: pendingApprovalsCount, icon: <UserCheck className="w-4 h-4 text-blue-400" />, sub: "needs intervention", href: "/dashboard/approvals", accent: "blue" }
                ].map((item, i) => {
                    const accentMap: Record<string, string> = {
                        amber: "via-amber-500/30 border-amber-500/10 hover:border-amber-500/30",
                        emerald: "via-emerald-500/30 border-emerald-500/10 hover:border-emerald-500/30",
                        rose: "via-rose-500/30 border-rose-500/10 hover:border-rose-500/30",
                        blue: "via-blue-500/30 border-blue-500/10 hover:border-blue-500/30",
                        purple: "via-purple-500/30 border-purple-500/10 hover:border-purple-500/30",
                    };
                    const iconBgMap: Record<string, string> = {
                        amber: "bg-amber-500/10 border-amber-500/20",
                        emerald: "bg-emerald-500/10 border-emerald-500/20",
                        rose: "bg-rose-500/10 border-rose-500/20",
                        blue: "bg-blue-500/10 border-blue-500/20",
                        purple: "bg-purple-500/10 border-purple-500/20",
                    };
                    const accent = item.accent || "emerald";
                    const content = (
                        <>
                            <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent ${accentMap[accent].split(' ')[0]} to-transparent`} />
                            <div className="flex items-start gap-3">
                                <div className={`p-2.5 rounded-xl border flex-shrink-0 ${iconBgMap[accent]}`}>
                                    {item.icon}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em]">{item.label}</p>
                                    <p className="text-2xl font-black text-white mt-1 tracking-tighter italic flex items-center gap-2">
                                        {item.value}
                                        {typeof item.value === 'number' && item.value > 0 && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                        )}
                                    </p>
                                    <p className="text-[9px] font-black text-neutral-600 mt-1 uppercase tracking-wider">{item.sub}</p>
                                </div>
                            </div>
                        </>
                    );
                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-black/60 backdrop-blur-xl border p-5 rounded-2xl relative group overflow-hidden transition-all duration-300 ${accentMap[accent].split(' ').slice(1).join(' ')}`}
                        >
                            {item.href ? (
                                <Link href={item.href}>{content}</Link>
                            ) : content}
                        </motion.div>
                    );
                })}
            </div>

            {/* Spend Chart Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
                <Card className="lg:col-span-2 bg-black/60 backdrop-blur-xl border-emerald-500/10 shadow-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-sm font-black text-white uppercase italic tracking-tighter">Spend Over Time</h3>
                            <p className="text-[9px] font-black text-neutral-500 mt-1 uppercase tracking-[0.2em]">Daily actual spend across all agents (USD)</p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Actual Spend
                        </div>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData.length > 0 ? chartData : [
                                { date: '02/20', amount: 0.12 },
                                { date: '02/21', amount: 0.34 },
                                { date: '02/22', amount: 0.21 },
                                { date: '02/23', amount: 0.45 },
                                { date: '02/24', amount: 0.89 },
                                { date: '02/25', amount: 0.32 },
                                { date: '02/26', amount: 0.12 },
                            ]}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 11 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 11 }}
                                    tickFormatter={(val) => `$${val}`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }}
                                    itemStyle={{ color: '#10b981' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorAmount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="bg-black/60 backdrop-blur-xl border-emerald-500/10 shadow-2xl p-6 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                    <div>
                        <h3 className="text-sm font-black text-white uppercase italic tracking-tighter mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                            Cost Summary
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-neutral-400">Monthly Usage</span>
                                    <span className="text-white font-medium">{Math.min(100, Math.round((stats.actualSpend / 50) * 100))}%</span>
                                </div>
                                <div className="w-full bg-white/[0.03] rounded-full h-2 border border-white/[0.05]">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (stats.actualSpend / 50) * 100)}%` }}
                                        className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                    />
                                </div>
                            </div>

                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-xl space-y-1">
                                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Efficiency Wins</p>
                                <p className="text-sm text-neutral-300">
                                    You've prevented <span className="text-emerald-400 font-bold">${stats.costSaved.toFixed(2)}</span> in costs this month via policy blocks.
                                </p>
                            </div>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full mt-6 bg-white/5 border-white/10 hover:bg-white/10 text-white">
                        Full Analytics Report
                    </Button>
                </Card>
            </motion.div>

            <Card className="bg-black/60 backdrop-blur-xl border-emerald-500/10 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent group-hover:via-emerald-500/50 transition-all duration-700" />

                <CardHeader className="border-b border-white/[0.04] bg-black/20">
                    <CardTitle className="text-sm font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-500" />
                        Connected Agents
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="py-24 text-center">
                            <p className="text-neutral-500 animate-pulse">Loading agents...</p>
                        </div>
                    ) : agents.length === 0 ? (
                        <div className="py-24 text-center text-neutral-500">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-col items-center gap-4"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
                                    <Key className="w-8 h-8 text-emerald-500/30" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-500">No agents registered</p>
                                    <p className="text-[10px] text-neutral-600 font-black uppercase tracking-wider">Create an agent to generate a zero-trust API key.</p>
                                </div>
                            </motion.div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/[0.04] hover:bg-transparent">
                                    <TableHead className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] py-4 px-6">Agent</TableHead>
                                    <TableHead className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] py-4 px-6">API Key</TableHead>
                                    <TableHead className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] py-4 px-6">Scopes</TableHead>
                                    <TableHead className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] py-4 px-6">Status</TableHead>
                                    <TableHead className="text-[9px] font-black text-neutral-500 uppercase tracking-[0.2em] py-4 px-6 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {agents.map((agent) => (
                                    <TableRow
                                        key={agent.id}
                                        className="border-white/[0.02] hover:bg-white/[0.02] transition-colors group/row"
                                    >
                                        <TableCell className="font-medium text-white px-6 py-4">
                                            {agent.name}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm text-emerald-400 break-all px-6 py-4 group-hover/row:text-emerald-300 transition-colors">
                                            <span className="bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">{agent.apiKey}</span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {agent.scopes && agent.scopes.length > 0 ? (
                                                    agent.scopes.slice(0, 3).map((scope, i) => (
                                                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                            <Lock className="w-2.5 h-2.5" />{scope}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-neutral-600 italic">No scopes (full access)</span>
                                                )}
                                                {agent.scopes && agent.scopes.length > 3 && (
                                                    <span className="text-[10px] text-neutral-500">+{agent.scopes.length - 3} more</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-semibold border ${agent.status === 'active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                agent.status === 'suspended' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                                                    agent.status === 'revoked' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                        'bg-green-500/10 text-green-400 border-green-500/20'
                                                }`}>
                                                {agent.status || 'active'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 text-right">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white transition-colors text-neutral-300"
                                                onClick={() => setSelectedAgent(agent)}
                                            >
                                                <Terminal className="w-4 h-4 mr-2" />
                                                Connect
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Create Agent Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
                setIsCreateModalOpen(open);
                if (!open) {
                    setNewAgentName("");
                    setNameError("");
                    setSelectedScopes([]);
                    setCustomScope("");
                }
            }}>
                <DialogContent className="sm:max-w-md bg-black border-emerald-500/20 text-white shadow-[0_0_60px_rgba(16,185,129,0.08)]">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-500" />
                            Register New Agent
                        </DialogTitle>
                        <DialogDescription className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.15em]">
                            Name your agent to generate a zero-trust API key.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-neutral-300">
                                Agent Name
                            </label>
                            <input
                                id="name"
                                value={newAgentName}
                                onChange={(e) => {
                                    setNewAgentName(e.target.value);
                                    if (nameError) setNameError("");
                                }}
                                placeholder="e.g. Browser Assistant"
                                className={`w-full bg-neutral-800 border ${nameError ? "border-red-500" : "border-neutral-700"} rounded-md px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') createAgent();
                                }}
                                autoFocus
                            />
                            {nameError && (
                                <p className="text-red-400 text-xs mt-1.5 font-medium">{nameError}</p>
                            )}
                        </div>

                        {/* Scope Selection */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4 h-4 text-blue-400" />
                                <label className="text-sm font-medium text-neutral-300">Agent Scopes</label>
                                <span className="text-[10px] text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">optional</span>
                            </div>
                            <p className="text-xs text-neutral-500">Restrict what this agent can access. Leave empty for full access.</p>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { scope: 'crm:read', label: 'CRM Read' },
                                    { scope: 'crm:write', label: 'CRM Write' },
                                    { scope: 'email:send', label: 'Email Send' },
                                    { scope: 'email:read', label: 'Email Read' },
                                    { scope: 'database:read', label: 'Database Read' },
                                    { scope: 'database:write', label: 'Database Write' },
                                    { scope: 'files:read', label: 'Files Read' },
                                    { scope: 'files:write', label: 'Files Write' },
                                    { scope: 'browser:navigate', label: 'Browser Navigate' },
                                    { scope: 'api:call', label: 'API Call' },
                                ].map(({ scope, label }) => (
                                    <label
                                        key={scope}
                                        className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-xs ${selectedScopes.includes(scope)
                                            ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                                            : 'bg-neutral-800/50 border-neutral-700/50 text-neutral-400 hover:border-neutral-600'
                                            }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedScopes.includes(scope)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedScopes([...selectedScopes, scope]);
                                                } else {
                                                    setSelectedScopes(selectedScopes.filter(s => s !== scope));
                                                }
                                            }}
                                            className="sr-only"
                                        />
                                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${selectedScopes.includes(scope)
                                            ? 'bg-blue-500 border-blue-400'
                                            : 'border-neutral-600'
                                            }`}>
                                            {selectedScopes.includes(scope) && <Check className="w-2.5 h-2.5 text-white" />}
                                        </div>
                                        <span className="font-mono">{label}</span>
                                    </label>
                                ))}
                            </div>

                            {/* Custom scope input */}
                            <div className="flex gap-2">
                                <input
                                    value={customScope}
                                    onChange={(e) => setCustomScope(e.target.value)}
                                    placeholder="custom:scope"
                                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-md px-3 py-1.5 text-xs text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && customScope.includes(':')) {
                                            e.preventDefault();
                                            if (!selectedScopes.includes(customScope)) {
                                                setSelectedScopes([...selectedScopes, customScope]);
                                            }
                                            setCustomScope('');
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={!customScope.includes(':')}
                                    onClick={() => {
                                        if (customScope.includes(':') && !selectedScopes.includes(customScope)) {
                                            setSelectedScopes([...selectedScopes, customScope]);
                                            setCustomScope('');
                                        }
                                    }}
                                    className="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 text-xs"
                                >
                                    Add
                                </Button>
                            </div>

                            {/* Selected scopes pills */}
                            {selectedScopes.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {selectedScopes.map(scope => (
                                        <span key={scope} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                            <Lock className="w-2.5 h-2.5" />
                                            {scope}
                                            <button
                                                onClick={() => setSelectedScopes(selectedScopes.filter(s => s !== scope))}
                                                className="ml-0.5 hover:text-red-400 transition-colors"
                                            >
                                                <X className="w-2.5 h-2.5" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">
                            Cancel
                        </Button>
                        <Button onClick={createAgent} className="bg-emerald-600 hover:bg-emerald-500 text-white border-transparent">
                            Create Agent
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Integration Modal */}
            <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
                <DialogContent className="sm:max-w-2xl bg-black border-emerald-500/20 text-white shadow-[0_0_80px_rgba(16,185,129,0.08)]">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black uppercase italic tracking-tighter text-white flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-emerald-500" />
                            Connect {selectedAgent?.name}
                        </DialogTitle>
                        <DialogDescription className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.15em]">
                            Drop this into your agent codebase to activate zero-trust interception.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAgent && (
                        <div className="mt-4">
                            <Tabs defaultValue="node" className="w-full">
                                <TabsList className="bg-neutral-800 border-neutral-700 w-full justify-start rounded-none border-b -mb-px px-0 h-auto">
                                    <TabsTrigger value="node" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-6 py-3 data-[state=active]:text-emerald-400">Node.js SDK</TabsTrigger>
                                    <TabsTrigger value="python" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-6 py-3 data-[state=active]:text-emerald-400">Python (LangChain)</TabsTrigger>
                                    <TabsTrigger value="curl" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none px-6 py-3 data-[state=active]:text-emerald-400">cURL (REST API)</TabsTrigger>
                                </TabsList>
                                <TabsContent value="node" className="pt-4 outline-none">
                                    <div className="relative group">
                                        <pre className="bg-[#0D0D0D] p-4 rounded-lg font-mono text-sm overflow-x-auto border border-neutral-800 text-emerald-200">
                                            <code>{getNodeCode(selectedAgent.apiKey)}</code>
                                        </pre>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(getNodeCode(selectedAgent.apiKey), 'node')}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800/80 hover:bg-neutral-700 text-white"
                                        >
                                            {copiedNode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="python" className="pt-4 outline-none">
                                    <div className="relative group">
                                        <pre className="bg-[#0D0D0D] p-4 rounded-lg font-mono text-sm overflow-x-auto border border-neutral-800 text-emerald-200">
                                            <code>{getPythonCode(selectedAgent.apiKey)}</code>
                                        </pre>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(getPythonCode(selectedAgent.apiKey), 'node')}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800/80 hover:bg-neutral-700 text-white"
                                        >
                                            {copiedNode ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </TabsContent>
                                <TabsContent value="curl" className="pt-4 outline-none">
                                    <div className="relative group">
                                        <pre className="bg-[#0D0D0D] p-4 rounded-lg font-mono text-sm overflow-x-auto border border-neutral-800 text-emerald-200">
                                            <code>{getCurlCode(selectedAgent.apiKey)}</code>
                                        </pre>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(getCurlCode(selectedAgent.apiKey), 'curl')}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-800/80 hover:bg-neutral-700 text-white"
                                        >
                                            {copiedCurl ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </motion.div >
    );
}
