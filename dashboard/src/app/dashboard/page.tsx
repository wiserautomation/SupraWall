"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { agentgate } from "@/lib/agentgate";
import { useAuthState } from "react-firebase-hooks/auth";
import { sendGAEvent } from "@next/third-parties/google";
import { Button } from "@/components/ui/button";
import { Agent } from "@/types/database";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Key, Copy, Check, Terminal } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

export default function AgentsPage() {
    const [user] = useAuthState(auth);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [copiedNode, setCopiedNode] = useState(false);
    const [copiedCurl, setCopiedCurl] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAgentName, setNewAgentName] = useState("");
    const [nameError, setNameError] = useState("");

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
        }, (error) => {
            console.error("Error fetching agents:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const generateApiKey = () => {
        return 'ga_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
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
            };

            // Replaced generic Firebase addDoc with our database-agnostic agentgate core SDK
            await agentgate.agents.create(newAgent);
            setNewAgentName("");
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

    const getNodeCode = (apiKey: string) => `import { Agent } from 'your-ai-framework';
import { withAgentGate } from 'agentgate';

// 1. Initialize your AI Agent
const myAgent = new Agent();

// 2. Secure it with your GateAPI Key
const securedAgent = withAgentGate(myAgent, {
  apiKey: "${apiKey}",
  // endpoint: "https://agent-gate-rho.vercel.app/evaluateAction" // optional fallback
});

// 3. Run your agent safely
await securedAgent.executeTool("Start task", {});`;

    const getCurlCode = (apiKey: string) => `curl -X POST https://[YOUR_FIREBASE_PROJECT_URL]/evaluateAction \\
  -H "Content-Type: application/json" \\
  -d '{
    "apiKey": "${apiKey}",
    "toolName": "bash",
    "args": { "command": "rm -rf /" }
  }'`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-end mb-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">Agents</h1>
                    <p className="text-neutral-400 text-sm">Manage your connected AI agents and generate API keys.</p>
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all font-medium">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Agent
                    </Button>
                </motion.div>
            </div>

            <Card className="bg-black/40 backdrop-blur-xl border-white/[0.05] shadow-2xl overflow-hidden relative group">
                {/* Subtle top glare */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                <CardHeader className="border-b border-white/[0.05] bg-white/[0.01]">
                    <CardTitle className="text-lg font-semibold text-white/90 tracking-tight">Your Connected Agents</CardTitle>
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
                            >
                                <Key className="w-16 h-16 mx-auto mb-6 text-neutral-700 opacity-40 shadow-inner" />
                                <p className="text-neutral-400">No agents created yet. Create one to get an API key.</p>
                            </motion.div>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-white/[0.05] hover:bg-transparent">
                                    <TableHead className="text-neutral-400 font-medium py-4 px-6">Name</TableHead>
                                    <TableHead className="text-neutral-400 font-medium py-4 px-6">API Key</TableHead>
                                    <TableHead className="text-neutral-400 font-medium py-4 px-6">ID</TableHead>
                                    <TableHead className="text-neutral-400 font-medium py-4 px-6 text-right">Actions</TableHead>
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
                                        <TableCell className="font-mono text-sm text-indigo-400 break-all px-6 py-4 group-hover/row:text-indigo-300 transition-colors">
                                            <span className="bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">{agent.apiKey}</span>
                                        </TableCell>
                                        <TableCell className="text-neutral-500 text-xs font-mono px-6 py-4">
                                            {agent.id}
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
                }
            }}>
                <DialogContent className="sm:max-w-md bg-neutral-900 border-neutral-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">Create New Agent</DialogTitle>
                        <DialogDescription className="text-neutral-400">
                            Give your AI agent a name to generate a unique API key.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
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
                                className={`w-full bg-neutral-800 border ${nameError ? "border-red-500" : "border-neutral-700"} rounded-md px-3 py-2 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') createAgent();
                                }}
                                autoFocus
                            />
                            {nameError && (
                                <p className="text-red-400 text-xs mt-1.5 font-medium">{nameError}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsCreateModalOpen(false)} className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white">
                            Cancel
                        </Button>
                        <Button onClick={createAgent} className="bg-indigo-600 hover:bg-indigo-500 text-white border-transparent">
                            Create Agent
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Integration Modal */}
            <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
                <DialogContent className="sm:max-w-2xl bg-neutral-900 border-neutral-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            Connect {selectedAgent?.name}
                        </DialogTitle>
                        <DialogDescription className="text-neutral-400">
                            Copy and paste this code into your AI agent&apos;s codebase to secure it with GateAPI.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedAgent && (
                        <div className="mt-4">
                            <Tabs defaultValue="node" className="w-full">
                                <TabsList className="bg-neutral-800 border-neutral-700 w-full justify-start rounded-none border-b -mb-px px-0 h-auto">
                                    <TabsTrigger value="node" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-6 py-3 data-[state=active]:text-indigo-400">Node.js SDK</TabsTrigger>
                                    <TabsTrigger value="curl" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-indigo-500 rounded-none px-6 py-3 data-[state=active]:text-indigo-400">cURL (REST API)</TabsTrigger>
                                </TabsList>
                                <TabsContent value="node" className="pt-4 outline-none">
                                    <div className="relative group">
                                        <pre className="bg-[#0D0D0D] p-4 rounded-lg font-mono text-sm overflow-x-auto border border-neutral-800 text-indigo-200">
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
        </motion.div>
    );
}
