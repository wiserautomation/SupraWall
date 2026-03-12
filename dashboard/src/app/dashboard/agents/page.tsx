"use client";

import { motion } from "framer-motion";
import { 
    Users, 
    Shield, 
    Activity, 
    Search, 
    MoreHorizontal, 
    ExternalLink, 
    Lock, 
    Unlock,
    AlertCircle,
    CheckCircle2,
    Clock,
    DollarSign,
    Terminal
} from "lucide-react";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";

interface Agent {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'revoked';
    scopes?: string[];
    totalCalls: number;
    totalSpendUsd: number;
    lastUsedAt?: any;
    apiKey: string;
    createdAt: any;
}

export default function AgentsPage() {
    const [user] = useAuthState(auth);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "agents"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const agentList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Agent[];
            
            setAgents(agentList.sort((a, b) => {
                const dateA = a.createdAt?.toDate?.() || new Date(0);
                const dateB = b.createdAt?.toDate?.() || new Date(0);
                return dateB - dateA;
            }));
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const toggleStatus = async (agent: Agent) => {
        const newStatus = agent.status === 'active' ? 'paused' : 'active';
        try {
            await updateDoc(doc(db, "agents", agent.id), {
                status: newStatus,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error updating agent status:", error);
        }
    };

    const filteredAgents = agents.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-neutral-500 animate-pulse font-medium tracking-wide">Scanning for authorized identities...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Agent Identities</h1>
                    </div>
                    <p className="text-neutral-400 max-w-xl">
                        Manage autonomous credentials and granular permissions for all connected AI agents in your ecosystem.
                    </p>
                </motion.div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-neutral-900/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-inner"
                    />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    icon={<Activity className="w-4 h-4 text-emerald-400" />}
                    label="Active Agents"
                    value={agents.filter(a => a.status === 'active').length.toString()}
                    subtext="Currently authorized"
                />
                <StatCard 
                    icon={<Terminal className="w-4 h-4 text-blue-400" />}
                    label="Total Tool Calls"
                    value={agents.reduce((acc, curr) => acc + (curr.totalCalls || 0), 0).toLocaleString()}
                    subtext="Across all sessions"
                />
                <StatCard 
                    icon={<DollarSign className="w-4 h-4 text-amber-400" />}
                    label="Managed Spend"
                    value={`$${agents.reduce((acc, curr) => acc + (curr.totalSpendUsd || 0), 0).toFixed(2)}`}
                    subtext="Estimated API overhead"
                />
            </div>

            {/* Agents Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-900/40 backdrop-blur-md border border-white/[0.05] rounded-2xl overflow-hidden shadow-2xl"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Identity & Scopes</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Usage Metrics</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest">Identity ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {filteredAgents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 italic">
                                        No agents found. Register your first agent using the SDK.
                                    </td>
                                </tr>
                            ) : (
                                filteredAgents.map((agent) => (
                                    <tr key={agent.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-white font-bold tracking-tight text-base group-hover:text-blue-400 transition-colors">
                                                    {agent.name}
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {agent.scopes?.slice(0, 3).map(scope => (
                                                        <span key={scope} className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 border border-white/5 text-neutral-400 font-mono">
                                                            {scope}
                                                        </span>
                                                    ))}
                                                    {(agent.scopes?.length || 0) > 3 && (
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-neutral-500">
                                                            +{(agent.scopes?.length || 0) - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex justify-center">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                                                    agent.status === 'active' 
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' 
                                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                                                    {agent.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className="text-neutral-300 font-medium">{agent.totalCalls || 0} calls</span>
                                                    <span className="text-neutral-600">/</span>
                                                    <span className="text-emerald-400/80 font-mono text-xs">${(agent.totalSpendUsd || 0).toFixed(3)}</span>
                                                </div>
                                                {agent.lastUsedAt && (
                                                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase font-bold tracking-wider">
                                                        <Clock className="w-3 h-3" />
                                                        {agent.lastUsedAt.toDate?.().toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <code className="text-xs text-neutral-500 bg-black/30 px-2 py-1 rounded border border-white/5 font-mono">
                                                {agent.id}
                                            </code>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex justify-end items-center gap-2">
                                                <button 
                                                    onClick={() => toggleStatus(agent)}
                                                    title={agent.status === 'active' ? "Pause Agent" : "Resume Agent"}
                                                    className={`p-2 rounded-lg border transition-all ${
                                                        agent.status === 'active'
                                                            ? 'bg-amber-500/5 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                                                            : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                                    }`}
                                                >
                                                    {agent.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                                </button>
                                                <Link
                                                    href={`/dashboard/logs?agentId=${agent.id}`}
                                                    className="p-2 bg-white/5 border border-white/10 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
                                                    title="View Logs"
                                                >
                                                    <Activity className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}

function StatCard({ icon, label, value, subtext }: { icon: React.ReactNode, label: string, value: string, subtext: string }) {
    return (
        <motion.div 
            whileHover={{ y: -2 }}
            className="p-6 bg-neutral-900/50 backdrop-blur-xl border border-white/[0.05] rounded-2xl shadow-xl space-y-3 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-white/10 transition-all" />
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                    {icon}
                </div>
                <span className="text-sm font-bold text-neutral-400 tracking-tight uppercase">{label}</span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tighter">{value}</span>
                <span className="text-[10px] text-neutral-500 font-bold tracking-widest uppercase">{subtext}</span>
            </div>
        </motion.div>
    );
}
