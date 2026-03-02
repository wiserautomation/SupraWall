"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { sendGAEvent } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ShieldAlert, PlusCircle, Sparkles, Loader2, Coins, RefreshCw, Save, Activity } from "lucide-react";
import { Agent, Policy, RuleType } from "@/types/database";
import { doc, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

export default function PoliciesPage() {
    const [user] = useAuthState(auth);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [policies, setPolicies] = useState<Policy[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [selectedAgentId, setSelectedAgentId] = useState("");
    const [toolName, setToolName] = useState("");
    const [condition, setCondition] = useState("");
    const [ruleType, setRuleType] = useState<RuleType>("DENY");

    // Agent Config State
    const [maxCostUsd, setMaxCostUsd] = useState<string>("");
    const [budgetAlertUsd, setBudgetAlertUsd] = useState<string>("");
    const [maxIterations, setMaxIterations] = useState<string>("");
    const [loopDetection, setLoopDetection] = useState<boolean>(false);
    const [isSavingConfig, setIsSavingConfig] = useState(false);

    // AI Wizard State
    const [showAiWizard, setShowAiWizard] = useState(false);
    const [aiPrompt, setAiPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const qAgents = query(collection(db, "agents"), where("userId", "==", user.uid));
            const agentsSnap = await getDocs(qAgents);
            const agentsList = agentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
            setAgents(agentsList);

            const qPolicies = query(collection(db, "policies"));
            const policiesSnap = await getDocs(qPolicies);
            const allPolicies = policiesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Policy));

            const userAgentIds = new Set(agentsList.map(a => a.id));
            const userPolicies = allPolicies.filter(p => userAgentIds.has(p.agentId));
            setPolicies(userPolicies);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const fetchAgentConfig = async (agentId: string) => {
        const agent = agents.find(a => a.id === agentId);
        if (agent) {
            setMaxCostUsd(agent.maxCostUsd?.toString() || "");
            setBudgetAlertUsd(agent.budgetAlertUsd?.toString() || "");
            setMaxIterations(agent.maxIterations?.toString() || "");
            setLoopDetection(agent.loopDetection || false);
        }
    };

    useEffect(() => {
        if (selectedAgentId) {
            fetchAgentConfig(selectedAgentId);
        }
    }, [selectedAgentId, agents]);

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleCreatePolicy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAgentId || !toolName || !condition) return;

        try {
            const newPolicy: Policy = {
                agentId: selectedAgentId,
                toolName,
                condition,
                ruleType
            };
            await addDoc(collection(db, "policies"), newPolicy);
            setToolName("");
            setCondition("");
            sendGAEvent('event', 'create_policy', { tool_name: toolName, rule_type: ruleType });
            fetchData();
        } catch (e) {
            console.error("Error creating policy", e);
        }
    };

    const handleSaveConfig = async () => {
        if (!selectedAgentId) return;
        setIsSavingConfig(true);
        try {
            const agentRef = doc(db, "agents", selectedAgentId);
            await updateDoc(agentRef, {
                maxCostUsd: maxCostUsd ? parseFloat(maxCostUsd) : null,
                budgetAlertUsd: budgetAlertUsd ? parseFloat(budgetAlertUsd) : null,
                maxIterations: maxIterations ? parseInt(maxIterations) : null,
                loopDetection
            });
            fetchData();
            sendGAEvent('event', 'update_agent_config', { agent_id: selectedAgentId });
        } catch (e) {
            console.error("Error updating agent config", e);
        }
        setIsSavingConfig(false);
    };

    const handleGenerateRegex = async () => {
        if (!toolName || !aiPrompt) return;
        setIsGenerating(true);
        try {
            const res = await fetch(`/api/generate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: aiPrompt, toolName })
            });
            const data = await res.json();
            if (data.regex) {
                setCondition(data.regex);
                setShowAiWizard(false);
                setAiPrompt("");
            }
        } catch (e) {
            console.error("AI Generation failed:", e);
        }
        setIsGenerating(false);
    };

    const getAgentName = (id: string) => agents.find(a => a.id === id)?.name || "Unknown";

    const getRuleBadgeColor = (type: string) => {
        if (type === "ALLOW") return "bg-green-500/10 text-green-500 border-green-500/20";
        if (type === "DENY") return "bg-red-500/10 text-red-500 border-red-500/20";
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-end mb-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">Security Policies</h1>
                    <p className="text-neutral-400 text-sm">Define access control and approval flows for your agents&apos; tools.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 bg-black/40 backdrop-blur-xl border-white/[0.05] shadow-2xl h-fit relative group overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                    <CardHeader className="bg-white/[0.01] border-b border-white/[0.05]">
                        <div className="flex justify-between items-center w-full">
                            <CardTitle className="text-lg flex items-center font-semibold text-white/90 tracking-tight">
                                <ShieldAlert className="w-5 h-5 mr-2 text-emerald-400" />
                                New Policy Rule
                            </CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowAiWizard(!showAiWizard)}
                                className={`text-xs border-emerald-500/30 hover:bg-emerald-500/10 transition-colors ${showAiWizard ? 'bg-emerald-500/10 text-emerald-300' : 'bg-transparent text-emerald-400'}`}
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                {showAiWizard ? "Hide AI Wizard" : "Magic AI Generator"}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <AnimatePresence>
                            {showAiWizard && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden mb-6"
                                >
                                    <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                                        <label className="text-sm font-medium text-emerald-300">Describe restriction in plain English</label>
                                        <Textarea
                                            value={aiPrompt}
                                            onChange={e => setAiPrompt(e.target.value)}
                                            placeholder="e.g., Stop the agent from deleting files."
                                            className="bg-black/50 border-emerald-500/30 text-white placeholder:text-emerald-200/50 resize-none focus-visible:ring-emerald-500/50"
                                            rows={2}
                                        />
                                        <Button
                                            type="button"
                                            onClick={handleGenerateRegex}
                                            disabled={!toolName || !aiPrompt || isGenerating}
                                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white disabled:opacity-50"
                                        >
                                            {isGenerating ? (
                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
                                            ) : (
                                                <><Sparkles className="mr-2 h-4 w-4" /> Generate Rule (Requires Tool Name)</>
                                            )}
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <form onSubmit={handleCreatePolicy} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">Select Agent</label>
                                <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                                    <SelectTrigger className="w-full bg-neutral-900 border-white/10 text-white hover:border-white/20 transition-colors">
                                        <SelectValue placeholder="Choose an agent..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-neutral-900 border-white/10 text-white">
                                        {agents.map(a => (
                                            <SelectItem key={a.id} value={a.id as string} className="hover:bg-white/5">{a.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">Tool Name</label>
                                <Input
                                    value={toolName}
                                    onChange={e => setToolName(e.target.value)}
                                    placeholder="e.g., bash, browser, fetch"
                                    className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-500 hover:border-white/20 transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">Condition (Regex)</label>
                                <Input
                                    value={condition}
                                    onChange={e => setCondition(e.target.value)}
                                    placeholder="e.g., rm -rf, .*"
                                    className="bg-neutral-900 border-white/10 text-white font-mono text-sm placeholder:text-neutral-500 hover:border-white/20 transition-colors"
                                />
                                <p className="text-xs text-emerald-400/80 italic mt-1">Generated by AI. Please review before saving.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">Rule Type</label>
                                <Select value={ruleType} onValueChange={(v: RuleType) => setRuleType(v)}>
                                    <SelectTrigger className="w-full bg-neutral-900 border-white/10 text-white focus:ring-1 focus:ring-emerald-500 hover:border-white/20 transition-colors">
                                        <SelectValue placeholder="Decision..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-neutral-900 border-white/10 text-white">
                                        <SelectItem value="ALLOW" className="text-green-400 hover:bg-white/5">ALLOW</SelectItem>
                                        <SelectItem value="DENY" className="text-red-400 hover:bg-white/5">DENY</SelectItem>
                                        <SelectItem value="REQUIRE_APPROVAL" className="text-yellow-400 hover:bg-white/5">REQUIRE_APPROVAL</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <motion.div whileHover={(!selectedAgentId || !toolName || !condition) ? {} : { scale: 1.02 }} whileTap={(!selectedAgentId || !toolName || !condition) ? {} : { scale: 0.98 }}>
                                <Button type="submit" disabled={!selectedAgentId || !toolName || !condition} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all font-medium mt-4 disabled:opacity-50 disabled:shadow-none">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
                                </Button>
                            </motion.div>
                        </form>
                    </CardContent>
                </Card>

                {/* Agent Global Settings Card */}
                <Card className="col-span-1 lg:col-span-2 bg-black/40 backdrop-blur-xl border-white/[0.05] shadow-2xl overflow-hidden relative group h-fit">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                    <CardHeader className="bg-white/[0.01] border-b border-white/[0.05]">
                        <CardTitle className="text-lg flex items-center font-semibold text-white/90 tracking-tight">
                            <Activity className="w-5 h-5 mr-2 text-blue-400" />
                            Agent Budget & Safety Control — {selectedAgentId ? getAgentName(selectedAgentId) : "Select an Agent"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {!selectedAgentId ? (
                            <div className="py-12 text-center text-neutral-500 italic">
                                Please select an agent from the dropdown to configure budget limits and loop protection.
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                                                <Coins className="w-4 h-4 text-amber-400" /> Budget Cap (USD)
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={maxCostUsd}
                                                onChange={e => setMaxCostUsd(e.target.value)}
                                                placeholder="e.g. 5.00 — Hard stop agent spent"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4 text-emerald-400" /> Budget Warning (USD)
                                            </label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={budgetAlertUsd}
                                                onChange={e => setBudgetAlertUsd(e.target.value)}
                                                placeholder="e.g. 4.00 — Fire alert webhook"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-500"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-400 flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-blue-400" /> Max Tool Iterations
                                            </label>
                                            <Input
                                                type="number"
                                                value={maxIterations}
                                                onChange={e => setMaxIterations(e.target.value)}
                                                placeholder="e.g. 10 — Circuit breaker"
                                                className="bg-neutral-900 border-white/10 text-white placeholder:text-neutral-500"
                                            />
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:bg-white/[0.04] transition-colors">
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium text-white">Loop Detection</p>
                                                <p className="text-xs text-neutral-500">Auto-block repeated tool patterns</p>
                                            </div>
                                            <div
                                                onClick={() => setLoopDetection(!loopDetection)}
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${loopDetection ? "bg-emerald-600" : "bg-neutral-800"}`}
                                            >
                                                <motion.div
                                                    animate={{ x: loopDetection ? 24 : 0 }}
                                                    className="w-4 h-4 bg-white rounded-full shadow-lg"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-white/[0.05]">
                                    <Button
                                        onClick={handleSaveConfig}
                                        disabled={isSavingConfig}
                                        className="bg-blue-600 hover:bg-blue-500 text-white min-w-[120px]"
                                    >
                                        {isSavingConfig ? (
                                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                                        ) : (
                                            <><Save className="mr-2 h-4 w-4" /> Save Configuration</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-3 bg-black/40 backdrop-blur-xl border-white/[0.05] shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
                    <CardHeader className="bg-white/[0.01] border-b border-white/[0.05]">
                        <CardTitle className="text-lg font-semibold text-white/90 tracking-tight">Active Policies</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <p className="text-neutral-500 py-24 text-center animate-pulse">Loading policies...</p>
                        ) : policies.length === 0 ? (
                            <p className="text-neutral-500 py-24 text-center">No policies configured. Agents will fall back to ALLOW by default.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-white/[0.05] hover:bg-transparent">
                                            <TableHead className="text-neutral-400 font-medium px-6 py-4">Agent</TableHead>
                                            <TableHead className="text-neutral-400 font-medium py-4">Tool</TableHead>
                                            <TableHead className="text-neutral-400 font-medium py-4">Condition</TableHead>
                                            <TableHead className="text-neutral-400 font-medium py-4">Decision</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {policies.map((p) => (
                                            <TableRow key={p.id} className="border-white/[0.02] hover:bg-white/[0.02] transition-colors group/row">
                                                <TableCell className="font-medium text-white px-6 py-4">{getAgentName(p.agentId)}</TableCell>
                                                <TableCell className="text-neutral-300 font-mono text-sm py-4">{p.toolName}</TableCell>
                                                <TableCell className="font-mono text-xs max-w-[200px] truncate text-emerald-400 py-4 group-hover/row:text-emerald-300 transition-colors">
                                                    <span className="bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">{p.condition}</span>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${getRuleBadgeColor(p.ruleType)}`}>
                                                        {p.ruleType}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    );
}
