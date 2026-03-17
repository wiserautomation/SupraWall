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
    ShieldCheck,
    ArrowLeft,
    Copy,
    RefreshCw,
    Layers,
    Trash2,
    PauseCircle,
    Ban,
    Code
} from "lucide-react";
import { useState, useEffect, use } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";

interface Agent {
    id: string;
    userId: string;
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

export default function AgentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: agentId } = use(params);
    const [user, authLoading] = useAuthState(auth);
    const [agent, setAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [agentPolicies, setAgentPolicies] = useState<Policy[]>([]);
    const [agentSecrets, setAgentSecrets] = useState<VaultSecret[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editScopes, setEditScopes] = useState<string[]>([]);
    const [customScope, setCustomScope] = useState("");
    const [isRotatingKey, setIsRotatingKey] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const [integrationTab, setIntegrationTab] = useState<'python' | 'ts' | 'go'>('python');

    useEffect(() => {
        if (authLoading || !user || !agentId) return;

        const agentRef = doc(db, "agents", agentId);
        const unsubscribeAgent = onSnapshot(agentRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = { id: snapshot.id, ...snapshot.data() } as Agent;
                if (data.userId !== user.uid) {
                    setAgent(null);
                } else {
                    setAgent(data);
                    setEditName(data.name);
                    setEditScopes(data.scopes || []);
                }
            } else {
                setAgent(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching agent:", error);
            setLoading(false);
        });

        const qaudit = query(
            collection(db, "audit_logs"),
            where("agentId", "==", agentId)
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
            }).slice(0, 100));
        });

        const qPolicies = query(
            collection(db, "policies"),
            where("agentId", "==", agentId)
        );
        const unsubscribePolicies = onSnapshot(qPolicies, (snapshot) => {
            setAgentPolicies(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Policy)));
        });

        const fetchSecrets = async () => {
            try {
                const res = await fetch(`${(process.env.NEXT_PUBLIC_API_URL || '') + '/api'}/v1/vault/secrets?tenantId=${user.uid}`);
                if (res.ok) {
                    const allSecrets = await res.json() as VaultSecret[];
                    setAgentSecrets(allSecrets.filter(s => s.assigned_agents?.includes(agentId)));
                }
            } catch (err) {
                console.error("Error fetching agent secrets:", err);
            }
        };
        fetchSecrets();

        return () => {
            unsubscribeAgent();
            unsubscribeAudit();
            unsubscribePolicies();
        };
    }, [user, agentId]);

    const toggleStatus = async () => {
        if (!agent) return;
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

    const handleUpdateAgent = async () => {
        if (!agent) return;
        try {
            await updateDoc(doc(db, "agents", agent.id), {
                name: editName,
                scopes: editScopes,
                updatedAt: serverTimestamp()
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating agent:", error);
        }
    };

    const generateApiKey = () => {
        const bytes = new Uint8Array(24);
        window.crypto.getRandomValues(bytes);
        return "ag_" + btoa(String.fromCharCode(...Array.from(bytes)))
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    };

    const handleRotateKey = async () => {
        if (!agent || !confirm("Generating a new API key will immediately invalidate the current one. Continue?")) return;
        setIsRotatingKey(true);
        const newKey = generateApiKey();
        try {
            await updateDoc(doc(db, "agents", agent.id), {
                apiKey: newKey,
                updatedAt: serverTimestamp()
            });
            alert(`New API Key generated: ${newKey}\nPlease save it securely as it won't be shown again.`);
        } catch (error) {
            console.error("Error rotating key:", error);
        } finally {
            setIsRotatingKey(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setIsCopying(true);
        setTimeout(() => setIsCopying(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-black">
                <p className="text-neutral-500 animate-pulse font-medium tracking-widest uppercase">Initializing Secure Tunnel...</p>
            </div>
        );
    }

    if (!agent) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-black text-center p-8">
                <AlertCircle className="w-12 h-12 text-rose-500 mb-4" />
                <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                <p className="text-neutral-500 mb-6">The requested agent identity could not be verified or has been redacted.</p>
                <Link href="/dashboard/agents">
                    <Button variant="outline" className="border-white/10">Return to Registry</Button>
                </Link>
            </div>
        );
    }

    const interceptionCount = auditLogs.filter(l => l.decision === 'DENY').length;
    const validLogsCount = auditLogs.filter(l => l.decision !== 'PAUSED').length || 1;
    const interceptionRate = ((interceptionCount / validLogsCount) * 100).toFixed(1);
    const loopDetections = auditLogs.filter(l => l.isLoop).length;
    const maxBudget = 10.00;
    const currentSpend = agent.totalSpendUsd || 0;
    const spendProgress = Math.min((currentSpend / maxBudget) * 100, 100);
    const agentUri = `agent://${agent.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.acme.suprawall.com`;
    const hasPendingApproval = auditLogs.some(l => l.decision === 'PAUSED');

    const snippetCode = {
        python: `import suprawall\n\nagent = suprawall.Agent(\n  identity="${agentUri}",\n  api_key="ag_xxxxxxxxxxx"\n)\n\nagent.start()`,
        ts: `import { SupraWall } from '@suprawall/sdk';\n\nconst agent = new SupraWall({\n  identity: "${agentUri}",\n  apiKey: "ag_xxxxxxxxxxx"\n});\n\nawait agent.connect();`,
        go: `import "github.com/suprawall/sdk-go"\n\nagent := suprawall.NewAgent(&suprawall.Config{\n    Identity: "${agentUri}",\n    APIKey:   "ag_xxxxxxxxxxx",\n})\nagent.Run()`
    };

    return (
        <div className="min-h-screen bg-black text-neutral-200 p-8 space-y-12 pb-24">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-6">
                    <Link href="/dashboard/agents">
                        <Button variant="ghost" size="icon" className="rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-center justify-center relative shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                            <Terminal className="w-8 h-8 text-indigo-400" />
                            <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-black flex items-center justify-center ${
                                agent.status === 'active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                            }`}>
                                {agent.status === 'active' && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                            </div>
                        </div>
                        <div>
                            {isEditing ? (
                                <div className="flex items-center gap-3">
                                    <Input 
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="bg-white/5 border-white/10 text-3xl font-black text-white p-2 h-auto max-w-[300px]"
                                    />
                                    <Button size="sm" onClick={handleUpdateAgent} className="h-10 bg-emerald-500 text-black font-bold uppercase text-xs hover:bg-emerald-400">Save</Button>
                                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)} className="h-10 text-neutral-500">Cancel</Button>
                                </div>
                            ) : (
                                <h1 className="text-5xl font-black text-white tracking-tighter flex items-center gap-4">
                                    {agent.name}
                                    <Badge onClick={() => setIsEditing(true)} variant="outline" className="cursor-pointer text-[10px] bg-white/5 hover:bg-white/10 transition-colors border-white/10 py-1 uppercase tracking-[0.2em]">{agent.status}</Badge>
                                </h1>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs font-mono text-neutral-600 tracking-wider">ID: {agentId}</span>
                                <span className="w-1 h-1 bg-neutral-800 rounded-full" />
                                <span className="text-xs text-neutral-500 italic">Established {agent.createdAt?.toDate?.().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button 
                        onClick={toggleStatus}
                        variant="outline"
                        className={`h-14 rounded-2xl px-8 font-black uppercase tracking-widest text-xs transition-all ${
                            agent.status === 'active' 
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20' 
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'
                        }`}
                    >
                        {agent.status === 'active' ? <><Lock className="w-4 h-4 mr-2" /> Suspend Operations</> : <><Unlock className="w-4 h-4 mr-2" /> Resume Operations</>}
                    </Button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <div className="lg:col-span-2 space-y-8">
                    {/* human loop alert */}
                    {hasPendingApproval && (
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 flex items-start gap-6 shadow-[0_0_50px_rgba(245,158,11,0.05)]">
                            <div className="p-4 bg-amber-500/20 rounded-2xl shrink-0">
                                <PauseCircle className="w-8 h-8 text-amber-500 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-xl font-black text-amber-400 tracking-tight uppercase">Manual Intervention Required</h4>
                                <p className="text-neutral-300 leading-relaxed text-sm">Policy <strong>"High Stakes Approval"</strong> triggered. Operations paused to prevent unauthorized resource allocation.</p>
                                <div className="flex gap-4 mt-4">
                                    <Link href="/dashboard/approvals">
                                        <Button className="bg-amber-500 text-black font-black uppercase text-[10px] tracking-widest h-10 px-6 rounded-xl">Review & Approve</Button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatItem label="Total Compute Cycles" value={agent.totalCalls?.toLocaleString() || "0"} icon={<Terminal className="w-4 h-4 text-neutral-500" />} />
                        <StatItem label="Interception Delta" value={`${interceptionRate}%`} sub="Policies Enforced" color="text-rose-400" icon={<Shield className="w-4 h-4 text-rose-500" />} />
                        <StatItem label="Detected Loops" value={loopDetections.toString()} sub="Circular Ref Protection" color="text-indigo-400" icon={<RefreshCw className="w-4 h-4 text-indigo-400" />} />
                    </div>

                    {/* Budget Section */}
                    <div className="bg-neutral-900/40 border border-white/[0.05] rounded-3xl p-8 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -mr-48 -mt-48 transition-all group-hover:bg-amber-500/10" />
                        <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-6 h-6 text-amber-500" />
                                <h3 className="text-xl font-black uppercase tracking-tighter text-white">Agent Resource Budget</h3>
                            </div>
                            <Badge variant="outline" className="border-amber-500/20 text-amber-400 font-mono tracking-widest">${currentSpend.toFixed(3)} / ${maxBudget.toFixed(2)}</Badge>
                        </div>
                        <div className="space-y-4 relative z-10">
                            <div className="flex items-end gap-3">
                                <div className="text-6xl font-black text-white tracking-tighter">${currentSpend.toFixed(3)}</div>
                                <div className="text-sm text-neutral-500 mb-2 font-black italic uppercase tracking-widest opacity-50">Accrued Usage</div>
                            </div>
                            <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden p-1 border border-white/5">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${spendProgress}%` }} className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 rounded-full" />
                            </div>
                            <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold">Automatic Killswitch at $10.00 USD Overhead</p>
                        </div>
                    </div>

                    {/* Activity Feed */}
                    <div className="bg-neutral-900/40 border border-white/[0.05] rounded-3xl overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <History className="w-5 h-5 text-purple-400" />
                                <h3 className="text-lg font-black uppercase tracking-tighter text-white">Live Operations Feed</h3>
                            </div>
                            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 uppercase text-[10px] tracking-widest px-3">Real-time Stream</Badge>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.02]">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-neutral-500 uppercase tracking-widest">Temporal Vector</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-neutral-500 uppercase tracking-widest">Tool/Function</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-neutral-500 uppercase tracking-widest text-right">Gatekeeper Sec.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/[0.03]">
                                    {auditLogs.length === 0 ? (
                                        <tr><td colSpan={3} className="text-center py-12 text-neutral-600 uppercase font-black tracking-widest text-xs italic">Awaiting Telemetry Data...</td></tr>
                                    ) : (
                                        auditLogs.map((log) => (
                                            <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-5 whitespace-nowrap text-xs font-mono text-neutral-500">
                                                    {log.timestamp?.toDate?.().toLocaleString()}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-white font-mono">{log.toolName}</span>
                                                        <span className="text-[10px] text-neutral-600 font-mono truncate max-w-[250px]">{log.arguments || "{}"}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${
                                                        log.decision === 'ALLOW' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                        log.decision === 'PAUSED' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                        'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                    }`}>
                                                        {log.decision}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Identity Details Sidebar */}
                    <div className="bg-neutral-900/60 border border-white/[0.05] rounded-3xl p-8 space-y-8">
                        {/* Integration */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Code className="w-5 h-5 text-blue-400" />
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Identity Handshake</h3>
                            </div>
                            <div className="bg-black/60 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                                <div className="flex border-b border-white/5">
                                    {(['python', 'ts', 'go'] as const).map(t => (
                                        <button 
                                            key={t}
                                            onClick={() => setIntegrationTab(t)}
                                            className={`flex-1 py-3 text-[10px] font-black uppercase transition-all ${integrationTab === t ? 'bg-blue-500 text-black' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-4 relative group">
                                    <pre className="text-[11px] font-mono text-blue-100/80 leading-relaxed overflow-x-auto">{snippetCode[integrationTab]}</pre>
                                    <button onClick={() => copyToClipboard(snippetCode[integrationTab])} className="absolute top-2 right-2 p-2 bg-white/10 rounded-xl text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20">
                                        {isCopying ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Endpoint URI */}
                        <div className="space-y-2">
                             <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Assigned Identity URI</Label>
                             <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-between group hover:border-blue-500/30 transition-colors cursor-pointer" onClick={() => copyToClipboard(agentUri)}>
                                 <code className="text-xs font-mono text-blue-400">{agentUri}</code>
                                 <Copy className="w-3 h-3 text-neutral-700 group-hover:text-blue-400" />
                             </div>
                        </div>

                        {/* Scopes */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 ml-1">Authorized Scopes</Label>
                                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)} className="h-5 text-[8px] uppercase tracking-widest text-blue-400 hover:text-blue-300">Expand Access</Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {agent.scopes?.map(s => (
                                    <Badge key={s} variant="outline" className="bg-neutral-800/50 border-white/5 text-neutral-400 text-[10px] font-mono py-1 px-3 rounded-lg">{s}</Badge>
                                ))}
                            </div>
                        </div>

                                                {/* API Key Rotation */}
                                                <div className="pt-4 border-t border-white/5 space-y-4 uppercase">
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-rose-500" />
                                <h3 className="text-xs font-black tracking-widest text-white">Credential Rotation</h3>
                            </div>
                            <p className="text-[10px] text-neutral-500 leading-relaxed font-bold">Revoke currently authorized credentials and generate a fresh cryptographic identity key.</p>
                            <Button variant="outline" onClick={handleRotateKey} disabled={isRotatingKey} className="w-full border-rose-500/20 text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 h-12 text-[10px] font-black tracking-widest rounded-2xl">
                                {isRotatingKey ? "REGENERATING..." : "ROTATE IDENTITY KEY"}
                            </Button>
                        </div>
                    </div>

                    {/* Security Perimeter */}
                    <div className="bg-neutral-900/60 border border-white/[0.05] rounded-3xl p-8 space-y-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            <h3 className="text-xl font-black uppercase tracking-tighter text-white">Security Perimeter</h3>
                        </div>
                        
                        <div className="space-y-6">
                            {/* Linked Secrets */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                    <span>Validated Secrets</span>
                                    <span>{agentSecrets.length} ENTITIES</span>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    {agentSecrets.map(s => (
                                        <div key={s.id} className="bg-black/40 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                                            <div className="p-1.5 bg-emerald-500/10 rounded-lg"><Lock className="w-3 h-3 text-emerald-400" /></div>
                                            <span className="text-xs font-mono font-bold text-emerald-100">{s.secret_name}</span>
                                        </div>
                                    ))}
                                    {agentSecrets.length === 0 && <p className="text-xs text-neutral-600 font-bold italic py-4 text-center border border-dashed border-white/10 rounded-2xl">No vault access assigned.</p>}
                                </div>
                            </div>

                            {/* Enforced Policies */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                    <span>Active Interceptors</span>
                                    <span>{agentPolicies.length} RULES</span>
                                </div>
                                <div className="space-y-2">
                                    {agentPolicies.map(p => (
                                        <div key={p.id} className="bg-black/40 border border-white/5 rounded-2xl p-4 space-y-2 group transition-all hover:border-rose-500/20">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-mono font-black text-rose-300">{p.toolName}</span>
                                                <Badge className={`text-[8px] h-4 font-black uppercase tracking-tighter ${p.ruleType === 'DENY' ? 'bg-rose-500 text-black' : 'bg-emerald-500 text-black'}`}>{p.ruleType}</Badge>
                                            </div>
                                            <p className="text-[10px] text-neutral-500 leading-relaxed font-medium line-clamp-2">{p.condition}</p>
                                        </div>
                                    ))}
                                    {agentPolicies.length === 0 && <p className="text-xs text-neutral-600 font-bold italic py-4 text-center border border-dashed border-white/10 rounded-2xl">Unrestricted execution perimeter.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatItem({ label, value, sub, color = "text-white", icon }: { label: string, value: string, sub?: string, color?: string, icon: React.ReactNode }) {
    return (
        <div className="bg-neutral-900/40 border border-white/[0.05] rounded-3xl p-6 space-y-2 relative overflow-hidden group">
            <div className="flex items-center gap-3 relative z-10">
                {icon}
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">{label}</span>
            </div>
            <div className="relative z-10 flex flex-col">
                <span className={`text-4xl font-black tracking-tighter ${color}`}>{value}</span>
                {sub && <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest mt-1">{sub}</span>}
            </div>
        </div>
    );
}
