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
    Terminal,
    X,
    BarChart3,
    History,
    Settings2,
    ShieldCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogDescription,
    DialogFooter 
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Plus, Key as KeyIcon, Trash2 } from "lucide-react";

const SCOPE_PRESETS = [
    { label: "Full Access", value: "*:*" },
    { label: "Read Only", value: "read:*" },
    { label: "Finance Only", value: "finance:*" },
    { label: "Identity Only", value: "identity:*" },
];

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

interface VaultSecret {
    id: string;
    secret_name: string;
    assigned_agents: string[];
}

interface Policy {
    id: string;
    agentId: string;
    toolName: string;
    condition: string;
    ruleType: string;
}

export default function AgentsPage() {
    const [user] = useAuthState(auth);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAgentName, setNewAgentName] = useState("");
    const [generatedKey, setGeneratedKey] = useState<string | null>(null);
    const [isCopying, setIsCopying] = useState(false);
    const [selectedScopes, setSelectedScopes] = useState<string[]>(["*:*"]);
    const [customScope, setCustomScope] = useState("");
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editScopes, setEditScopes] = useState<string[]>([]);
    const [isRotatingKey, setIsRotatingKey] = useState(false);
    const [agentPolicies, setAgentPolicies] = useState<Policy[]>([]);
    const [agentSecrets, setAgentSecrets] = useState<VaultSecret[]>([]);

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

    useEffect(() => {
        if (!selectedAgent || !isDrawerOpen) {
            setAuditLogs([]);
            setIsEditing(false);
            return;
        }

        setEditName(selectedAgent.name);
        setEditScopes(selectedAgent.scopes || []);

        const qaudit = query(
            collection(db, "audit_logs"),
            where("agentId", "==", selectedAgent.id)
        );

        const unsubscribeAudit = onSnapshot(qaudit, (snapshot) => {
            const logs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data() as any
            }));
            
            setAuditLogs(logs.sort((a, b) => {
                const dateA = a.timestamp?.toDate?.() || new Date(0);
                const dateB = b.timestamp?.toDate?.() || new Date(0);
                return dateB - dateA;
            }).slice(0, 5));
        });

        // Fetch Policies
        const qPolicies = query(
            collection(db, "policies"),
            where("agentId", "==", selectedAgent.id)
        );
        const unsubscribePolicies = onSnapshot(qPolicies, (snapshot) => {
            setAgentPolicies(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Policy)));
        });

        // Fetch Vault Secrets
        const fetchSecrets = async () => {
            try {
                const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || '') + '/api'}/v1/vault/secrets?tenantId=${user.uid}`);
                if (res.ok) {
                    const allSecrets = await res.json() as VaultSecret[];
                    setAgentSecrets(allSecrets.filter(s => s.assigned_agents?.includes(selectedAgent.id)));
                }
            } catch (err) {
                console.error("Error fetching agent secrets:", err);
            }
        };
        fetchSecrets();

        return () => {
            unsubscribeAudit();
            unsubscribePolicies();
        };
    }, [selectedAgent, isDrawerOpen, user]);

    const toggleStatus = async (agent: Agent) => {
        const newStatus = agent.status === 'active' ? 'paused' : 'active';
        try {
            await updateDoc(doc(db, "agents", agent.id), {
                status: newStatus,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error updating agent status:", error);
        }
    };

    const filteredAgents = agents.filter(a => 
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const generateApiKey = () => {
        const bytes = new Uint8Array(24);
        window.crypto.getRandomValues(bytes);
        return "ag_" + btoa(String.fromCharCode(...Array.from(bytes)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    };

    const handleCreateAgent = async () => {
        if (!user || !newAgentName) return;
        
        const apiKey = generateApiKey();
        
        try {
            await addDoc(collection(db, "agents"), {
                name: newAgentName,
                userId: user.uid,
                status: 'active',
                apiKey,
                totalCalls: 0,
                totalSpendUsd: 0,
                createdAt: serverTimestamp(),
                scopes: selectedScopes
            });
            
            setGeneratedKey(apiKey);
            setNewAgentName("");
            setSelectedScopes(["*:*"]);
        } catch (error) {
            console.error("Error creating agent:", error);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopying(true);
        setTimeout(() => setIsCopying(false), 2000);
    };

    const deleteAgent = async (agentId: string) => {
        if (!confirm("Are you sure you want to delete this agent? This action is irreversible.")) return;
        try {
            await updateDoc(doc(db, "agents", agentId), {
                status: 'revoked',
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error("Error revoking agent:", error);
        }
    };

    const handleUpdateAgent = async () => {
        if (!selectedAgent) return;
        try {
            await updateDoc(doc(db, "agents", selectedAgent.id), {
                name: editName,
                scopes: editScopes,
                updatedAt: serverTimestamp()
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating agent:", error);
        }
    };

    const handleRotateKey = async () => {
        if (!selectedAgent || !confirm("Generating a new API key will immediately invalidate the current one. Continue?")) return;
        
        setIsRotatingKey(true);
        const newKey = generateApiKey();
        
        try {
            await updateDoc(doc(db, "agents", selectedAgent.id), {
                apiKey: newKey,
                updatedAt: serverTimestamp()
            });
            alert(`New API Key generated: ${newKey}\nPlease save it securely as it won't be shown again.`);
            setSelectedAgent(prev => prev ? { ...prev, apiKey: newKey } : null);
        } catch (error) {
            console.error("Error rotating key:", error);
        } finally {
            setIsRotatingKey(false);
        }
    };

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

                <div className="flex items-center gap-4">
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
                    <Button 
                        onClick={() => {
                            setGeneratedKey(null);
                            setIsCreateModalOpen(true);
                        }}
                        className="bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-wider text-[11px] h-[42px] px-6 rounded-xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Register Agent
                    </Button>
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
                                    <tr 
                                        key={agent.id} 
                                        className="hover:bg-white/[0.04] transition-colors group cursor-pointer"
                                        onClick={() => {
                                            setSelectedAgent(agent);
                                            setIsDrawerOpen(true);
                                        }}
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1.5">
                                                <span className="text-white font-bold tracking-tight text-base group-hover:text-blue-400 transition-colors">
                                                    {agent.name}
                                                </span>
                                                <div className="flex flex-wrap gap-1">
                                                    {agent.scopes?.slice(0, 3).map(scope => (
                                                        <Badge key={scope} variant="outline" className="text-[10px] bg-white/5 border-white/10 text-neutral-400 font-mono">
                                                            {scope}
                                                        </Badge>
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
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedAgent(agent);
                                                        setIsDrawerOpen(true);
                                                    }}
                                                    title="View Analytics"
                                                    className="p-2 bg-indigo-500/5 border border-indigo-500/10 rounded-lg text-indigo-500/60 hover:text-indigo-400 hover:bg-indigo-500/20 transition-all"
                                                >
                                                    <BarChart3 className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleStatus(agent);
                                                    }}
                                                    title={agent.status === 'active' ? "Pause Agent" : "Resume Agent"}
                                                    className={`p-2 rounded-lg border transition-all ${
                                                        agent.status === 'active'
                                                            ? 'bg-amber-500/5 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                                                            : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                                    }`}
                                                >
                                                    {agent.status === 'active' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                                                </button>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteAgent(agent.id);
                                                    }}
                                                    className="p-2 bg-rose-500/5 border border-rose-500/10 rounded-lg text-rose-500/60 hover:text-rose-400 hover:bg-rose-500/20 transition-all"
                                                    title="Revoke Agent"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>

            {/* Create Agent Modal */}
            <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogContent className="bg-neutral-950 border-white/[0.05] shadow-2xl space-y-6 sm:max-w-[450px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">
                            Register AI Identity
                        </DialogTitle>
                        <DialogDescription className="text-neutral-500 text-xs font-medium uppercase tracking-widest">
                            Authorize a new autonomous entity in your ecosystem.
                        </DialogDescription>
                    </DialogHeader>

                    {!generatedKey ? (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/70 ml-1">
                                    Agent Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Finance Intelligence Agent"
                                    value={newAgentName}
                                    onChange={(e) => setNewAgentName(e.target.value)}
                                    className="bg-white/[0.03] border-white/10 h-12 rounded-xl text-white focus:ring-emerald-500/50 focus:border-emerald-500/50"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/70 ml-1">
                                    Authorization Scopes
                                </Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {SCOPE_PRESETS.map((preset) => (
                                        <Badge 
                                            key={preset.value}
                                            variant={selectedScopes.includes(preset.value) ? "secondary" : "outline"}
                                            className={`cursor-pointer hover:bg-emerald-500/20 transition-all border-white/10 ${selectedScopes.includes(preset.value) ? "bg-emerald-500 text-black border-transparent" : "text-neutral-400"}`}
                                            onClick={() => {
                                                if (selectedScopes.includes(preset.value)) {
                                                    setSelectedScopes(selectedScopes.filter(s => s !== preset.value));
                                                } else {
                                                    setSelectedScopes([...selectedScopes, preset.value]);
                                                }
                                            }}
                                        >
                                            {preset.label}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input 
                                        placeholder="Add custom scope (e.g. tools:*)"
                                        value={customScope}
                                        onChange={(e) => setCustomScope(e.target.value)}
                                        className="bg-white/[0.03] border-white/10 h-10 rounded-xl text-white text-xs"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && customScope) {
                                                e.preventDefault();
                                                if (!selectedScopes.includes(customScope)) {
                                                    setSelectedScopes([...selectedScopes, customScope]);
                                                }
                                                setCustomScope("");
                                            }
                                        }}
                                    />
                                    <Button 
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            if (customScope && !selectedScopes.includes(customScope)) {
                                                setSelectedScopes([...selectedScopes, customScope]);
                                                setCustomScope("");
                                            }
                                        }}
                                        className="border-white/10 h-10 px-3 hover:bg-white/5"
                                    >
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mt-2 max-h-24 overflow-y-auto">
                                    {selectedScopes.map(scope => (
                                        <Badge key={scope} variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1 pr-1 border">
                                            {scope}
                                            <X 
                                                className="w-3 h-3 cursor-pointer hover:text-white" 
                                                onClick={() => setSelectedScopes(selectedScopes.filter(s => s !== scope))}
                                            />
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 py-4">
                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Secure Discovery</span>
                                </div>
                                <p className="text-[11px] text-neutral-400 leading-relaxed font-medium">
                                    Store this API key safely. For security reasons, <span className="text-white italic">it will never be shown again</span> in the dashboard.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/70 ml-1">
                                    Agent API Key
                                </Label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyIcon className="h-4 w-4 text-neutral-500" />
                                    </div>
                                    <div className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-12 py-3 text-xs font-mono text-blue-100 shadow-inner break-all">
                                        {generatedKey}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(generatedKey)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-lg transition-colors group-hover:bg-white/10"
                                    >
                                        {isCopying ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-neutral-400" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        {!generatedKey ? (
                            <Button
                                onClick={handleCreateAgent}
                                disabled={!newAgentName}
                                className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-black uppercase tracking-widest text-[11px] h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            >
                                Generate Identity
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="w-full bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[11px] h-12 rounded-xl transition-all border border-white/10"
                            >
                                Done
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Agent Detail Sheet */}
            <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <SheetContent side="right" className="w-full sm:max-w-xl bg-neutral-950 border-white/10 p-0 overflow-hidden flex flex-col">
                    {selectedAgent && (
                        <>
                            <div className="p-8 pb-4">
                                <SheetHeader className="space-y-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                                            <Terminal className="w-6 h-6 text-indigo-400" />
                                        </div>
                                        <div className="flex-1">
                                            {isEditing ? (
                                                <Input 
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="bg-white/5 border-white/10 text-xl font-black text-white p-2 h-auto"
                                                />
                                            ) : (
                                                <SheetTitle className="text-2xl font-black text-white tracking-tight">
                                                    {selectedAgent.name}
                                                </SheetTitle>
                                            )}
                                            <SheetDescription className="text-neutral-500 font-mono text-[10px] uppercase tracking-widest mt-0.5">
                                                AGENT_ID: {selectedAgent.id}
                                            </SheetDescription>
                                        </div>
                                        {isEditing && (
                                            <Button size="sm" onClick={handleUpdateAgent} className="bg-emerald-500 text-black font-bold uppercase text-[10px]">
                                                Save
                                            </Button>
                                        )}
                                    </div>
                                </SheetHeader>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 pt-0 space-y-8">
                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Total Calls</span>
                                        <div className="text-xl font-black text-white">{selectedAgent.totalCalls || 0}</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Total Spend</span>
                                        <div className="text-xl font-black text-emerald-400">${(selectedAgent.totalSpendUsd || 0).toFixed(3)}</div>
                                    </div>
                                </div>

                                {/* Scopes Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">
                                            Authorization Scopes
                                        </Label>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={() => setIsEditing(!isEditing)}
                                            className={`h-6 text-[10px] ${isEditing ? 'text-amber-400' : 'text-indigo-400'} hover:bg-white/5`}
                                        >
                                            <Settings2 className="w-3 h-3 mr-1" /> {isEditing ? "Editing..." : "Edit Scopes"}
                                        </Button>
                                    </div>
                                    <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                        {isEditing ? (
                                            <>
                                                <div className="flex gap-2 mb-3">
                                                    <Input 
                                                        placeholder="Add custom scope..."
                                                        value={customScope}
                                                        onChange={(e) => setCustomScope(e.target.value)}
                                                        className="bg-white/5 border-white/10 h-9 text-xs"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter' && customScope) {
                                                                if (!editScopes.includes(customScope)) {
                                                                    setEditScopes([...editScopes, customScope]);
                                                                }
                                                                setCustomScope("");
                                                            }
                                                        }}
                                                    />
                                                    <Button size="sm" variant="outline" onClick={() => {
                                                        if (customScope && !editScopes.includes(customScope)) {
                                                            setEditScopes([...editScopes, customScope]);
                                                            setCustomScope("");
                                                        }
                                                    }}>Add</Button>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {editScopes.map(scope => (
                                                        <Badge key={scope} variant="secondary" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 gap-1 border">
                                                            {scope}
                                                            <X className="w-3 h-3 cursor-pointer" onClick={() => setEditScopes(editScopes.filter(s => s !== scope))} />
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedAgent.scopes?.map(scope => (
                                                    <Badge key={scope} variant="outline" className="bg-white/5 border-white/10 text-neutral-400 font-mono py-1 px-2">
                                                        {scope}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Security Posture: Policies & Secrets */}
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">
                                        Security Posture
                                    </Label>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                                                    <span className="text-xs font-bold text-white">Active Policies</span>
                                                </div>
                                                <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/20">{agentPolicies.length}</Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {agentPolicies.length > 0 ? agentPolicies.map(p => (
                                                    <Badge key={p.id} variant="outline" className="text-[9px] bg-black/20 border-white/5 text-neutral-400 py-0 h-5">
                                                        {p.toolName} ({p.ruleType})
                                                    </Badge>
                                                )) : (
                                                    <span className="text-[10px] text-neutral-600 italic">No restrictive policies active</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Lock className="w-4 h-4 text-emerald-400" />
                                                    <span className="text-xs font-bold text-white">Vault Access</span>
                                                </div>
                                                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/20">{agentSecrets.length}</Badge>
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {agentSecrets.length > 0 ? agentSecrets.map(s => (
                                                    <Badge key={s.id} variant="outline" className="text-[9px] bg-black/20 border-white/5 text-neutral-400 py-0 h-5">
                                                        {s.secret_name}
                                                    </Badge>
                                                )) : (
                                                    <span className="text-[10px] text-neutral-600 italic">No credentials linked in Vault</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* API Key Section */}
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">
                                        Authentication
                                    </Label>
                                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <KeyIcon className={`w-4 h-4 ${isRotatingKey ? 'animate-spin' : 'text-emerald-400'}`} />
                                            <code className="text-xs text-neutral-500 font-mono">
                                                {isRotatingKey ? "GENERATING..." : "••••••••••••••••••••••••"}
                                            </code>
                                        </div>
                                        <Button 
                                            size="sm" 
                                            variant="outline" 
                                            onClick={handleRotateKey}
                                            disabled={isRotatingKey}
                                            className="h-8 border-rose-500/20 text-[10px] font-black uppercase text-rose-500 hover:bg-rose-500/10"
                                        >
                                            Rotate Key
                                        </Button>
                                    </div>
                                </div>

                                {/* Audit Log / Timeline */}
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">
                                        Recent Activity (Real-time Audit)
                                    </Label>
                                    <div className="space-y-3">
                                        {auditLogs.length === 0 ? (
                                            <div className="text-center py-8 text-neutral-600 italic text-xs">
                                                No activity recorded for this identity yet.
                                            </div>
                                        ) : (
                                            auditLogs.map((log) => (
                                                <div key={log.id} className="flex gap-4 p-3 rounded-xl hover:bg-white/[0.02] transition-colors border border-transparent hover:border-white/5 group">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
                                                        log.decision === 'ALLOW' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'
                                                    }`}>
                                                        {log.decision === 'ALLOW' ? 
                                                            <ShieldCheck className="w-5 h-5 text-emerald-400/50 group-hover:text-emerald-400 transition-colors" /> : 
                                                            <Shield className="w-5 h-5 text-rose-400/50 group-hover:text-rose-400 transition-colors" />
                                                        }
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs font-bold text-neutral-300">
                                                                {log.toolName}
                                                            </span>
                                                            <span className="text-[10px] text-neutral-600 font-mono uppercase">
                                                                {log.timestamp?.toDate?.().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-[11px] text-neutral-500 line-clamp-1 italic">
                                                                {log.decision === 'DENY' ? log.reason : `Executed successfully ($${(log.cost_usd || 0).toFixed(4)})`}
                                                            </p>
                                                            {log.riskScore > 20 && (
                                                                <Badge className="bg-amber-500/10 text-amber-500 text-[8px] h-4">RISK: {log.riskScore}</Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <Link href="/dashboard/forensics" className="block">
                                        <Button variant="ghost" className="w-full text-[11px] font-black uppercase tracking-widest text-neutral-600 hover:text-white">
                                            Deep Forensic Analysis
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="p-8 pt-4 border-t border-white/5 bg-white/[0.01] flex items-center justify-between">
                                <Button 
                                    variant="outline" 
                                    className={`h-11 rounded-xl px-6 border-white/10 font-bold transition-all ${
                                        selectedAgent.status === 'active' 
                                            ? 'text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/20' 
                                            : 'text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20'
                                    }`}
                                    onClick={() => toggleStatus(selectedAgent)}
                                >
                                    {selectedAgent.status === 'active' ? (
                                        <><Lock className="w-4 h-4 mr-2" /> Pause Agent</>
                                    ) : (
                                        <><Unlock className="w-4 h-4 mr-2" /> Resume Agent</>
                                    )}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    className="h-11 rounded-xl px-6 text-rose-500 font-bold hover:bg-rose-500/10"
                                    onClick={() => deleteAgent(selectedAgent.id)}
                                >
                                    Revoke Access
                                </Button>
                            </div>
                        </>
                    )}
                </SheetContent>
            </Sheet>
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
