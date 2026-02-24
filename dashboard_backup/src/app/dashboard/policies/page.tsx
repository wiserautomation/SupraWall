"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldAlert, PlusCircle } from "lucide-react";
import { Agent, Policy, RuleType } from "@/types/database";

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

    const fetchData = async () => {
        if (!user) return;
        setLoading(true);
        try {
            // Fetch Agents for Dropdown
            const qAgents = query(collection(db, "agents"), where("userId", "==", user.uid));
            const agentsSnap = await getDocs(qAgents);
            const agentsList = agentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
            setAgents(agentsList);

            // Fetch Policies
            // In a real app we'd query by agentIds rather than fetching all and filtering, 
            // but if the rules say user can read only policies they own, we can query policies directly 
            // if we attach userId to them. To keep it aligned with Phase 1 instructions, we'll
            // fetch all policies and find those for the user's agents.
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

    useEffect(() => {
        fetchData();
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
            fetchData();
        } catch (e) {
            console.error("Error creating policy", e);
        }
    };

    const getAgentName = (id: string) => agents.find(a => a.id === id)?.name || "Unknown";

    const getRuleBadgeColor = (type: string) => {
        if (type === "ALLOW") return "bg-green-500/10 text-green-500 border-green-500/20";
        if (type === "DENY") return "bg-red-500/10 text-red-500 border-red-500/20";
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Security Policies</h1>
                    <p className="text-neutral-400">Define access control and approval flows for your agents' tools.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 bg-neutral-900 border-neutral-800 h-fit">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                            <ShieldAlert className="w-5 h-5 mr-2 text-indigo-400" />
                            New Policy Rule
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreatePolicy} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">Select Agent</label>
                                <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                                    <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white">
                                        <SelectValue placeholder="Choose an agent..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                                        {agents.map(a => (
                                            <SelectItem key={a.id} value={a.id as string}>{a.name}</SelectItem>
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
                                    className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">Condition (Regex)</label>
                                <Input
                                    value={condition}
                                    onChange={e => setCondition(e.target.value)}
                                    placeholder="e.g., rm -rf, .*"
                                    className="bg-neutral-800 border-neutral-700 text-white font-mono text-sm placeholder:text-neutral-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-neutral-400">Rule Type</label>
                                <Select value={ruleType} onValueChange={(v: RuleType) => setRuleType(v)}>
                                    <SelectTrigger className="w-full bg-neutral-800 border-neutral-700 text-white focus:ring-1 focus:ring-indigo-500">
                                        <SelectValue placeholder="Decision..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-neutral-800 border-neutral-700 text-white">
                                        <SelectItem value="ALLOW">ALLOW</SelectItem>
                                        <SelectItem value="DENY">DENY</SelectItem>
                                        <SelectItem value="REQUIRE_APPROVAL">REQUIRE_APPROVAL</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" disabled={!selectedAgentId || !toolName || !condition} className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2">
                                <PlusCircle className="mr-2 h-4 w-4" /> Add Rule
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-2 bg-neutral-900 border-neutral-800">
                    <CardHeader>
                        <CardTitle className="text-lg">Active Policies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p className="text-neutral-500 py-6 text-center">Loading policies...</p>
                        ) : policies.length === 0 ? (
                            <p className="text-neutral-500 py-12 text-center">No policies configured. Agents will fall back to ALLOW by default.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                                            <TableHead className="text-neutral-400">Agent</TableHead>
                                            <TableHead className="text-neutral-400">Tool</TableHead>
                                            <TableHead className="text-neutral-400">Condition</TableHead>
                                            <TableHead className="text-neutral-400">Decision</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {policies.map((p) => (
                                            <TableRow key={p.id} className="border-neutral-800 hover:bg-neutral-800/50">
                                                <TableCell className="font-medium text-white">{getAgentName(p.agentId)}</TableCell>
                                                <TableCell className="text-neutral-300 font-mono text-sm">{p.toolName}</TableCell>
                                                <TableCell className="font-mono text-xs max-w-[200px] truncate text-indigo-300">
                                                    {p.condition}
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getRuleBadgeColor(p.ruleType)}`}>
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
        </div>
    );
}
