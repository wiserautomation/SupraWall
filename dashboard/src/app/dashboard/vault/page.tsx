"use client";

import { useState, useEffect } from "react";
import { Lock, Plus, RotateCcw, Trash2, Copy, Check, Shield, AlertCircle, Clock, Users } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const API_BASE = "/api/v1/vault";

type Tab = "secrets" | "rules" | "log";

interface VaultSecret {
    id: string;
    secret_name: string;
    secret_type: "api_key" | "credentials" | "oauth" | "custom";
    description: string | null;
    expires_at: string | null;
    last_rotated_at: string;
    created_at: string;
    assigned_agents: string[];
}

interface VaultRule {
    id: string;
    agent_id: string;
    secret_name: string;
    allowed_tools: string[];
    max_uses_per_hour: number;
    requires_approval: boolean;
}

interface VaultLogEntry {
    id: number;
    agent_id: string;
    secret_name: string;
    tool_name: string;
    action: string;
    created_at: string;
}

const ACTION_ICON: Record<string, string> = {
    INJECTED: "✅",
    DENIED: "❌",
    RATE_LIMITED: "⚠️",
    EXPIRED: "⏰",
    NOT_FOUND: "❓",
    ROTATED: "🔄",
    DELETED: "🗑️",
};

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

export default function VaultPage() {
    const [user, authLoading] = useAuthState(auth);

    const [tab, setTab] = useState<Tab>("secrets");
    const [secrets, setSecrets] = useState<VaultSecret[]>([]);
    const [rules, setRules] = useState<VaultRule[]>([]);
    const [agents, setAgents] = useState<any[]>([]);
    const [log, setLog] = useState<VaultLogEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [showCreateSecret, setShowCreateSecret] = useState(false);
    const [showCreateRule, setShowCreateRule] = useState(false);
    const [showRotate, setShowRotate] = useState<string | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    // Form state
    const [newSecretName, setNewSecretName] = useState("");
    const [newSecretType, setNewSecretType] = useState<VaultSecret["secret_type"]>("api_key");
    const [newSecretValue, setNewSecretValue] = useState("");
    const [templateFields, setTemplateFields] = useState<Record<string, string>>({});
    const [customFields, setCustomFields] = useState<{key: string, value: string}[]>([]);
    const [newSecretDesc, setNewSecretDesc] = useState("");
    const [newSecretExpiry, setNewSecretExpiry] = useState("");
    const [newSecretAgents, setNewSecretAgents] = useState<string[]>([]);
    const [newRuleAgent, setNewRuleAgent] = useState("");
    const [newRuleSecret, setNewRuleSecret] = useState("");
    const [newRuleTools, setNewRuleTools] = useState("");
    const [newRuleRate, setNewRuleRate] = useState("100");
    const [newRuleApproval, setNewRuleApproval] = useState(false);
    const [rotateValue, setRotateValue] = useState("");
    const [error, setError] = useState<string | null>(null);

    const getAuthHeaders = async (): Promise<Record<string, string>> => {
        if (!user) return {};
        const token = await user.getIdToken();
        return {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        };
    };

    const fetchSecrets = async () => {
        if (!user) return;
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/secrets?tenantId=${user.uid}`, { headers });
        if (res.ok) setSecrets(await res.json());
    };

    const fetchRules = async () => {
        if (!user) return;
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/rules?tenantId=${user.uid}`, { headers });
        if (res.ok) setRules(await res.json());
    };

    const fetchLog = async () => {
        if (!user) return;
        const headers = await getAuthHeaders();
        const res = await fetch(`${API_BASE}/log?tenantId=${user.uid}&limit=50`, { headers });
        if (res.ok) setLog(await res.json());
    };

    useEffect(() => {
        if (!user) return;

        // Fetch agents for selection
        const q = query(collection(db, "agents"), where("userId", "==", user.uid));
        const unsub = onSnapshot(q, (snap) => {
            setAgents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        if (tab === "secrets") fetchSecrets();
        else if (tab === "rules") { fetchRules(); fetchSecrets(); }
        else if (tab === "log") fetchLog();

        return () => unsub();
    }, [tab, user]);

    if (authLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RotateCcw className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const isSecretValueValid = () => {
        switch (newSecretType) {
            case "api_key":
                return !!newSecretValue;
            case "credentials":
                return !!templateFields.username && !!templateFields.password;
            case "oauth":
                return !!templateFields.access_token;
            case "custom":
                return customFields.length > 0 && customFields.every(f => !!f.key && !!f.value);
            default:
                return false;
        }
    };

    const copyToken = (secretName: string) => {
        const token = `$SUPRAWALL_VAULT_${secretName}`;
        navigator.clipboard.writeText(token);
        setCopied(secretName);
        setTimeout(() => setCopied(null), 2000);
    };

    const handleCreateSecret = async () => {
        setError(null);
        setLoading(true);
        try {
            let finalValue = newSecretValue;
            
            if (newSecretType === "credentials") {
                finalValue = JSON.stringify({
                    username: templateFields.username || "",
                    password: templateFields.password || ""
                });
            } else if (newSecretType === "oauth") {
                finalValue = JSON.stringify({
                    access_token: templateFields.access_token || "",
                    refresh_token: templateFields.refresh_token || "",
                    expires_at: templateFields.oauth_expiry || ""
                });
            } else if (newSecretType === "custom") {
                const obj: Record<string, string> = {};
                customFields.forEach(f => { if (f.key) obj[f.key] = f.value; });
                finalValue = JSON.stringify(obj);
            }

            const headers = await getAuthHeaders();
            const res = await fetch(`${API_BASE}/secrets`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    tenantId: user?.uid,
                    secretName: newSecretName,
                    secretValue: finalValue,
                    secretType: newSecretType,
                    description: newSecretDesc || undefined,
                    expiresAt: newSecretExpiry || undefined,
                    assignedAgents: newSecretAgents,
                }),
            });
            const data = await res.json();
            if (!res.ok) { 
              setError(data.error + (data.message ? ": " + data.message : "")); 
              return; 
            }
            setShowCreateSecret(false);
            setNewSecretName(""); setNewSecretValue(""); setNewSecretDesc(""); setNewSecretExpiry("");
            setNewSecretAgents([]);
            await fetchSecrets();
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSecret = async (id: string) => {
        if (!confirm("Delete this secret? All associated access rules will also be removed.")) return;
        const headers = await getAuthHeaders();
        await fetch(`${API_BASE}/secrets/${id}?tenantId=${user?.uid}`, { 
            method: "DELETE",
            headers
        });
        await fetchSecrets();
    };

    const handleRotate = async (id: string) => {
        setError(null);
        setLoading(true);
        try {
            const headers = await getAuthHeaders();
            const res = await fetch(`${API_BASE}/secrets/${id}/rotate`, {
                method: "PUT",
                headers,
                body: JSON.stringify({ tenantId: user?.uid, newValue: rotateValue }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            setShowRotate(null);
            setRotateValue("");
            await fetchSecrets();
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRule = async () => {
        setError(null);
        setLoading(true);
        try {
            const secret = secrets.find(s => s.secret_name === newRuleSecret);
            if (!secret) { setError("Select a valid secret"); return; }
            const headers = await getAuthHeaders();
            const res = await fetch(`${API_BASE}/rules`, {
                method: "POST",
                headers,
                body: JSON.stringify({
                    tenantId: user?.uid,
                    agentId: newRuleAgent,
                    secretId: secret.id,
                    allowedTools: newRuleTools.split(",").map(t => t.trim()).filter(Boolean),
                    maxUsesPerHour: Number(newRuleRate),
                    requiresApproval: newRuleApproval,
                }),
            });
            const data = await res.json();
            if (!res.ok) { setError(data.error); return; }
            setShowCreateRule(false);
            setNewRuleAgent(""); setNewRuleSecret(""); setNewRuleTools(""); setNewRuleRate("100"); setNewRuleApproval(false);
            await fetchRules();
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRule = async (id: string) => {
        const headers = await getAuthHeaders();
        await fetch(`${API_BASE}/rules/${id}?tenantId=${user?.uid}`, { 
            method: "DELETE",
            headers
        });
        await fetchRules();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[9px] font-black tracking-[0.2em] text-emerald-400 uppercase">Zero-Knowledge Storage</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-emerald-400" />
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Vault</h1>
                    </div>
                </div>
            </div>

            {/* Info banner */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
                <p className="text-sm text-emerald-300">
                    Your AI agents never see real secrets. SupraWall injects credentials at runtime using{" "}
                    <code className="font-mono text-emerald-200">$SUPRAWALL_VAULT_*</code> tokens and scrubs all traces from responses.
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-emerald-500/10">
                {(["secrets", "rules", "log"] as Tab[]).map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-t-lg transition-all ${
                            tab === t
                                ? "bg-emerald-500/10 text-emerald-400 border-b-2 border-emerald-400"
                                : "text-neutral-400 hover:text-neutral-200"
                        }`}
                    >
                        {t === "log" ? "Access Log" : t === "rules" ? "Access Rules" : "Secrets"}
                    </button>
                ))}
            </div>

            {/* Secrets tab */}
            {tab === "secrets" && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => { setShowCreateSecret(true); setError(null); }}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Create Secret
                        </button>
                    </div>

                    {secrets.length === 0 ? (
                        <div className="text-center py-16 text-neutral-400">No secrets stored yet.</div>
                    ) : (
                        <div className="rounded-xl border border-white/10 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 text-neutral-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Secret Name</th>
                                        <th className="px-4 py-3 text-left">Type</th>
                                        <th className="px-4 py-3 text-left">Assigned Agents</th>
                                        <th className="px-4 py-3 text-left">Expires</th>
                                        <th className="px-4 py-3 text-left">Last Rotated</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {secrets.map(s => (
                                        <tr key={s.id} className="hover:bg-white/[0.05]">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Lock className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                                    <span className="font-mono text-white text-xs">{s.secret_name}</span>
                                                </div>
                                                {s.description && <div className="text-[10px] text-neutral-400 mt-0.5 ml-5">{s.description}</div>}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[9px] font-bold uppercase tracking-wider text-neutral-400">
                                                    {s.secret_type?.replace("_", " ") || "API KEY"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-wrap gap-1">
                                                    {s.assigned_agents?.length > 0 ? (
                                                        s.assigned_agents.map(aid => (
                                                            <span key={aid} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                                                                {agents.find(a => a.id === aid)?.name || aid.slice(0, 8)}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-neutral-600 italic text-[10px]">Unrestricted (Global)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-neutral-400">
                                                {s.expires_at ? new Date(s.expires_at).toLocaleDateString() : "Never"}
                                            </td>
                                            <td className="px-4 py-3 text-neutral-400">{timeAgo(s.last_rotated_at)}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        onClick={() => copyToken(s.secret_name)}
                                                        title="Copy vault token"
                                                        className="flex items-center gap-1 px-2 py-1 text-xs text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded transition-colors"
                                                    >
                                                        {copied === s.secret_name ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                                        Token
                                                    </button>
                                                    <button
                                                        onClick={() => { setShowRotate(s.id); setRotateValue(""); setError(null); }}
                                                        className="flex items-center gap-1 px-2 py-1 text-xs text-neutral-400 hover:text-yellow-400 bg-white/5 hover:bg-yellow-500/10 rounded transition-colors"
                                                    >
                                                        <RotateCcw className="w-3 h-3" /> Rotate
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSecret(s.id)}
                                                        className="flex items-center gap-1 px-2 py-1 text-xs text-neutral-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded transition-colors"
                                                    >
                                                        <Trash2 className="w-3 h-3" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Access Rules tab */}
            {tab === "rules" && (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button
                            onClick={() => { setShowCreateRule(true); setError(null); }}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Create Rule
                        </button>
                    </div>

                    {rules.length === 0 ? (
                        <div className="text-center py-16 text-neutral-400">No access rules defined yet.</div>
                    ) : (
                        <div className="rounded-xl border border-white/10 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 text-neutral-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Agent</th>
                                        <th className="px-4 py-3 text-left">Secret</th>
                                        <th className="px-4 py-3 text-left">Allowed Tools</th>
                                        <th className="px-4 py-3 text-left">Rate Limit</th>
                                        <th className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {rules.map(r => (
                                        <tr key={r.id} className="hover:bg-white/[0.05]">
                                            <td className="px-4 py-3 font-mono text-xs text-white">
                                                {agents.find(a => a.id === r.agent_id)?.name || r.agent_id}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-emerald-300">{r.secret_name}</td>
                                            <td className="px-4 py-3 text-neutral-400 text-xs">
                                                {r.allowed_tools.length > 0 ? r.allowed_tools.join(", ") : "All tools"}
                                            </td>
                                            <td className="px-4 py-3 text-neutral-400">{r.max_uses_per_hour}/hr</td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => handleDeleteRule(r.id)}
                                                    className="flex items-center gap-1 px-2 py-1 text-xs text-neutral-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded transition-colors ml-auto"
                                                >
                                                    <Trash2 className="w-3 h-3" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Access Log tab */}
            {tab === "log" && (
                <div className="space-y-4">
                    {log.length === 0 ? (
                        <div className="text-center py-16 text-neutral-400">No vault access events yet.</div>
                    ) : (
                        <div className="rounded-xl border border-white/10 overflow-hidden">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5 text-neutral-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Timestamp</th>
                                        <th className="px-4 py-3 text-left">Agent</th>
                                        <th className="px-4 py-3 text-left">Secret</th>
                                        <th className="px-4 py-3 text-left">Tool</th>
                                        <th className="px-4 py-3 text-left">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {log.map(entry => (
                                        <tr key={entry.id} className="hover:bg-white/[0.05]">
                                            <td className="px-4 py-3 text-neutral-400 text-xs whitespace-nowrap">
                                                {new Date(entry.created_at).toLocaleString()}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-white">{entry.agent_id}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-emerald-300">{entry.secret_name}</td>
                                            <td className="px-4 py-3 font-mono text-xs text-neutral-400">{entry.tool_name}</td>
                                            <td className="px-4 py-3">
                                                <span className="text-base">{ACTION_ICON[entry.action] || "•"}</span>{" "}
                                                <span className="text-xs text-neutral-400">{entry.action}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Create Secret Modal */}
            {showCreateSecret && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Lock className="w-5 h-5 text-emerald-400" /> Create Secret
                        </h2>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {error}
                            </div>
                        )}

                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-none">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-neutral-400 mb-1 block">Secret Name <span className="text-red-400">*</span></label>
                                    <input
                                        value={newSecretName}
                                        onChange={e => setNewSecretName(e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, ""))}
                                        placeholder="GITHUB_TOKEN"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-400 mb-1 block">Template / Type</label>
                                    <select
                                        value={newSecretType}
                                        onChange={e => setNewSecretType(e.target.value as any)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="api_key">API Key (Single Field)</option>
                                        <option value="credentials">Credentials (User/Pass)</option>
                                        <option value="oauth">OAuth Token</option>
                                        <option value="custom">Custom JSON Object</option>
                                    </select>
                                </div>
                            </div>

                            {/* Dynamic Fields based on Type */}
                            <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-3">
                                {newSecretType === "api_key" && (
                                    <div>
                                        <label className="text-xs text-neutral-400 mb-1 block">Secret Value / Key <span className="text-red-400">*</span></label>
                                        <input
                                            type="password"
                                            value={newSecretValue}
                                            onChange={e => setNewSecretValue(e.target.value)}
                                            placeholder="Paste value here..."
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                                        />
                                    </div>
                                )}

                                {newSecretType === "credentials" && (
                                    <div className="grid grid-cols-1 gap-3">
                                        <div>
                                            <label className="text-xs text-neutral-400 mb-1 block">Username</label>
                                            <input
                                                value={templateFields.username || ""}
                                                onChange={e => setTemplateFields({...templateFields, username: e.target.value})}
                                                placeholder="admin"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-400 mb-1 block">Password / Secret</label>
                                            <input
                                                type="password"
                                                value={templateFields.password || ""}
                                                onChange={e => setTemplateFields({...templateFields, password: e.target.value})}
                                                placeholder="••••••••"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                    </div>
                                )}

                                {newSecretType === "oauth" && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs text-neutral-400 mb-1 block">Access Token</label>
                                            <input
                                                type="password"
                                                value={templateFields.access_token || ""}
                                                onChange={e => setTemplateFields({...templateFields, access_token: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-neutral-400 mb-1 block">Refresh Token</label>
                                                <input
                                                    type="password"
                                                    value={templateFields.refresh_token || ""}
                                                    onChange={e => setTemplateFields({...templateFields, refresh_token: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-neutral-400 mb-1 block">Expires (optional)</label>
                                                <input
                                                    value={templateFields.oauth_expiry || ""}
                                                    onChange={e => setTemplateFields({...templateFields, oauth_expiry: e.target.value})}
                                                    placeholder="3600"
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {newSecretType === "custom" && (
                                    <div className="space-y-2">
                                        {customFields.map((f, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    placeholder="Field Name"
                                                    value={f.key}
                                                    onChange={e => {
                                                        const next = [...customFields];
                                                        next[i].key = e.target.value;
                                                        setCustomFields(next);
                                                    }}
                                                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-500"
                                                />
                                                <input
                                                    type={f.key.toLowerCase().includes("key") || f.key.toLowerCase().includes("pass") ? "password" : "text"}
                                                    placeholder="Value"
                                                    value={f.value}
                                                    onChange={e => {
                                                        const next = [...customFields];
                                                        next[i].value = e.target.value;
                                                        setCustomFields(next);
                                                    }}
                                                    className="flex-[2] bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-emerald-500"
                                                />
                                                <button onClick={() => setCustomFields(customFields.filter((_, idx) => idx !== i))} className="text-red-400 p-1">
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setCustomFields([...customFields, {key: "", value: ""}])}
                                            className="text-[10px] text-emerald-400 font-bold uppercase hover:bg-emerald-500/10 px-2 py-1 rounded transition-colors"
                                        >
                                            + Add Field
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-xs text-neutral-400 mb-1 block">Description</label>
                                <input
                                    value={newSecretDesc}
                                    onChange={e => setNewSecretDesc(e.target.value)}
                                    placeholder="Purpose of this secret..."
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-neutral-400 mb-1 block">Expires At</label>
                                    <input
                                        type="datetime-local"
                                        value={newSecretExpiry}
                                        onChange={e => setNewSecretExpiry(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-400 mb-1 block">Scoped Agents</label>
                                    <div className="flex flex-wrap gap-1 p-2 rounded-lg bg-black/20 border border-white/5 min-h-[40px]">
                                        {agents.map(a => (
                                            <button
                                                key={a.id}
                                                onClick={() => {
                                                    setNewSecretAgents(prev => 
                                                        prev.includes(a.id) ? prev.filter(id => id !== a.id) : [...prev, a.id]
                                                    );
                                                }}
                                                className={`px-1.5 py-0.5 rounded text-[9px] font-mono border transition-all ${
                                                    newSecretAgents.includes(a.id)
                                                        ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                                        : "bg-white/5 border-white/10 text-neutral-600"
                                                }`}
                                            >
                                                {a.name}
                                            </button>
                                        ))}
                                        {agents.length === 0 && <span className="text-[9px] text-neutral-600">No agents found</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {newSecretName && (
                            <div className="rounded-lg bg-black/40 border border-white/10 p-3">
                                <p className="text-xs text-neutral-400 mb-1">Agent token (safe to share):</p>
                                <div className="flex items-center gap-2">
                                    <code className="text-xs text-emerald-300 font-mono flex-1 break-all">
                                        $SUPRAWALL_VAULT_{newSecretName}
                                    </code>
                                    <button
                                        onClick={() => copyToken(newSecretName)}
                                        className="text-neutral-400 hover:text-white"
                                    >
                                        {copied === newSecretName ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => { setShowCreateSecret(false); setError(null); }}
                                className="flex-1 px-4 py-2 text-sm text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateSecret}
                                disabled={loading || !newSecretName || !isSecretValueValid()}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                            >
                                {loading ? "Creating…" : "Create Secret"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rotate Modal */}
            {showRotate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-sm bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <RotateCcw className="w-5 h-5 text-yellow-400" /> Rotate Secret
                        </h2>
                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
                                <AlertCircle className="w-4 h-4" /> {error}
                            </div>
                        )}
                        <div>
                            <label className="text-xs text-neutral-400 mb-1 block">New Value</label>
                            <input
                                type="password"
                                value={rotateValue}
                                onChange={e => setRotateValue(e.target.value)}
                                placeholder="New secret value"
                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-yellow-500"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { setShowRotate(null); setError(null); }}
                                className="flex-1 px-4 py-2 text-sm text-neutral-400 hover:text-white bg-white/5 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button onClick={() => handleRotate(showRotate!)} disabled={loading || !rotateValue}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-500 disabled:opacity-50 rounded-lg transition-colors">
                                {loading ? "Rotating…" : "Rotate"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Rule Modal */}
            {showCreateRule && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-400" /> Create Access Rule
                        </h2>
                        {error && (
                            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
                                <AlertCircle className="w-4 h-4" /> {error}
                            </div>
                        )}
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-neutral-400 mb-1 block">Agent <span className="text-red-400">*</span></label>
                                <select value={newRuleAgent} onChange={e => setNewRuleAgent(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                                    <option value="">Select agent…</option>
                                    {agents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.id.slice(0, 8)})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-neutral-400 mb-1 block">Secret <span className="text-red-400">*</span></label>
                                <select value={newRuleSecret} onChange={e => setNewRuleSecret(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500">
                                    <option value="">Select secret…</option>
                                    {secrets.map(s => <option key={s.id} value={s.secret_name}>{s.secret_name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-neutral-400 mb-1 block">Allowed Tools (comma-separated, empty = all)</label>
                                <input value={newRuleTools} onChange={e => setNewRuleTools(e.target.value)}
                                    placeholder="process_payment, refund_payment"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500" />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-400 mb-1 block">Rate Limit (uses/hour)</label>
                                <input type="number" value={newRuleRate} onChange={e => setNewRuleRate(e.target.value)} min="1"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={newRuleApproval} onChange={e => setNewRuleApproval(e.target.checked)}
                                    className="rounded border-white/20 bg-white/5 text-emerald-500" />
                                <span className="text-sm text-neutral-300">Require human approval before injecting</span>
                            </label>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button onClick={() => { setShowCreateRule(false); setError(null); }}
                                className="flex-1 px-4 py-2 text-sm text-neutral-400 hover:text-white bg-white/5 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleCreateRule} disabled={loading || !newRuleAgent || !newRuleSecret}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg transition-colors">
                                {loading ? "Creating…" : "Create Rule"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
