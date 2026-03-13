"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    ShieldCheck,
    ShieldAlert,
    Clock,
    Terminal,
    Cpu,
    Search,
    Filter,
    ChevronRight,
    Play,
    Pause,
    BarChart3,
    Layers,
    Bot
} from "lucide-react";
import { format } from "date-fns";
import { AuditLog, Agent } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function MonitoringPage() {
    const [user] = useAuthState(auth);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [isLive, setIsLive] = useState(true);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);

    // Fetch agents first to filter logs
    useEffect(() => {
        if (!user) return;
        const q = query(collection(db, "agents"), where("userId", "==", user.uid));
        const unsub = onSnapshot(q, (snap) => {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Agent));
            setAgents(list);
        });
        return () => unsub();
    }, [user]);

    // Live Log Stream
    useEffect(() => {
        if (!user || agents.length === 0 || !isLive) return;

        const agentIds = agents.map(a => a.id).slice(0, 10);
        const q = query(
            collection(db, "audit_logs"),
            where("agentId", "in", agentIds),
            orderBy("timestamp", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const newLogs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
            setLogs(newLogs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, agents, isLive]);

    const sessions = Array.from(new Set(logs.map(l => l.sessionId || "Global"))).sort();
    const filteredLogs = selectedSession
        ? logs.filter(l => (l.sessionId || "Global") === selectedSession)
        : logs;

    const handleExport = () => {
        if (!user || agents.length === 0) return;
        
        // Export CSV for current visible logs
        const headers = ["TIMESTAMP", "AGENT", "ACTION", "DECISION", "COST", "ARGS"];
        const rows = filteredLogs.map(l => [
            l.timestamp?.toDate?.().toISOString() || "Now",
            l.agentId,
            l.toolName,
            l.decision,
            l.cost_usd || 0,
            `"${l.arguments?.toString().replace(/"/g, '""')}"`
        ]);
        
        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `suprawall_audit_${new Date().toISOString()}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="space-y-8 font-sans">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                        <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-600'}`} />
                        <span className="text-[9px] font-black tracking-[0.2em] text-emerald-400 uppercase">{isLive ? 'Live Feed' : 'Paused'}</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Live Swarm Inspector</h1>
                    <p className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.2em]">Real-time agent orchestration &amp; tool governance</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleExport}
                        className="bg-white/5 border border-white/5 text-neutral-400 hover:text-white"
                    >
                        Export CSV
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsLive(!isLive)}
                        className={`border-white/10 text-[10px] font-black uppercase tracking-wider ${isLive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-neutral-400'}`}
                    >
                        {isLive ? <Pause className="w-3.5 h-3.5 mr-1.5" /> : <Play className="w-3.5 h-3.5 mr-1.5" />}
                        {isLive ? 'Pause' : 'Resume'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-280px)]">

                {/* Session Sidebar */}
                <div className="lg:col-span-3 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-600 mb-2 px-2">Active Swarms</h3>
                    <div className="space-y-1">
                        <button
                            onClick={() => setSelectedSession(null)}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 border ${!selectedSession ? 'bg-white/5 border-white/10 text-white' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
                        >
                            <Layers className="w-4 h-4" />
                            <span className="text-xs font-black uppercase italic">All Activity</span>
                        </button>
                        {sessions.map(s => (
                            <button
                                key={s}
                                onClick={() => setSelectedSession(s)}
                                className={`w-full text-left px-4 py-3 rounded-xl transition-all flex items-center gap-3 border ${selectedSession === s ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'border-transparent text-neutral-500 hover:text-neutral-300'}`}
                            >
                                <Bot className="w-4 h-4" />
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-[10px] font-black uppercase truncate">{s}</p>
                                    <p className="text-[8px] opacity-50 font-bold uppercase tracking-widest">Active Session</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Timeline Stream */}
                <div className="lg:col-span-9 bg-black/40 backdrop-blur-3xl border border-white/[0.05] rounded-[2.5rem] overflow-hidden flex flex-col relative">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-600'}`} />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Activity Stream</span>
                        </div>
                        <Search className="w-4 h-4 text-neutral-600 cursor-pointer hover:text-white transition-colors" />
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {filteredLogs.map((log, idx) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative pl-12 group"
                                >
                                    {/* Timeline Line */}
                                    {idx !== filteredLogs.length - 1 && (
                                        <div className="absolute left-[23px] top-10 bottom-0 w-[2px] bg-white/[0.03]" />
                                    )}

                                    {/* Decision Icon */}
                                    <div className={`absolute left-0 top-0 w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-2xl transition-all duration-500 ${log.decision === 'ALLOW'
                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 group-hover:shadow-emerald-500/10'
                                        : 'bg-red-500/10 border-red-500/20 text-red-500 group-hover:shadow-red-500/10'
                                        }`}>
                                        {log.decision === 'ALLOW' ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                                    </div>

                                    <div className="bg-white/[0.01] border border-white/[0.05] p-6 rounded-[2rem] hover:bg-white/[0.03] transition-all group/card relative overflow-hidden">

                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="text-sm font-black text-white uppercase italic tracking-tight">{log.toolName}</h3>
                                                    <Badge variant="outline" className="text-[8px] border-white/10 text-neutral-500 font-bold tracking-widest uppercase">
                                                        {log.sessionId ? 'SWARM ACTION' : 'DIRECT CALL'}
                                                    </Badge>
                                                    {log.agentRole && (
                                                        <Badge variant="outline" className="text-[8px] border-orange-500/20 text-orange-400 bg-orange-500/5 font-black tracking-widest uppercase italic">
                                                            {log.agentRole}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Clock className="w-3 h-3" />
                                                    {log.timestamp ? format(log.timestamp.toDate(), 'HH:mm:ss.SSS') : 'Just now'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-black text-white italic uppercase">${log.cost_usd?.toFixed(4) || '0.0000'}</p>
                                                <p className="text-[8px] font-black text-neutral-600 uppercase tracking-[0.2em]">Compute Cost</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="bg-[#050505] rounded-xl p-4 border border-white/5 font-mono text-[11px] relative">
                                                <div className="absolute top-3 right-4 flex gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                                                </div>
                                                <p className="text-neutral-500 mb-2">// Call arguments</p>
                                                <p className="text-blue-400 break-all">{log.arguments}</p>
                                            </div>

                                            {log.reason && (
                                                <div className={`p-4 rounded-xl border flex items-start gap-3 ${log.decision === 'ALLOW' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'
                                                    }`}>
                                                    <div className={`p-1.5 rounded-md ${log.decision === 'ALLOW' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        <Activity className="w-3 h-3" />
                                                    </div>
                                                    <p className={`text-xs font-semibold ${log.decision === 'ALLOW' ? 'text-emerald-400/80' : 'text-red-400/80'}`}>
                                                        {log.reason}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Decorative progress line for active session */}
                                        {log.sessionId && (
                                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <div className="py-20 text-center">
                                <Activity className="w-12 h-12 text-neutral-800 animate-spin mx-auto mb-4" />
                                <p className="text-[10px] font-black uppercase text-neutral-600 tracking-[0.3em]">Synching Swarm Logs...</p>
                            </div>
                        )}

                        {!loading && filteredLogs.length === 0 && (
                            <div className="py-32 text-center space-y-6">
                                <div className="p-8 bg-white/[0.02] rounded-full w-24 h-24 mx-auto border border-white/5 flex items-center justify-center">
                                    <Bot className="w-10 h-10 text-neutral-700" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-white italic uppercase">No swarm activity found</h3>
                                    <p className="text-neutral-500 text-sm max-w-xs mx-auto">Connect your CrewAI or AutoGen agents to see real-time tool governance here.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div>
    );
}
