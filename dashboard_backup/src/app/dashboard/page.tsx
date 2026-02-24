"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Agent } from "@/types/database";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Key } from "lucide-react";

export default function AgentsPage() {
    const [user] = useAuthState(auth);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAgents = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(collection(db, "agents"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const agentsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
            setAgents(agentsList);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAgents();
    }, [user]);

    const generateApiKey = () => {
        return 'ga_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    };

    const createAgent = async () => {
        if (!user) return;
        const name = window.prompt("Enter a name for your new Agent (e.g. 'Browser Assistant'):");
        if (!name) return;

        try {
            const newAgent: Agent = {
                userId: user.uid,
                name,
                apiKey: generateApiKey(),
            };
            await addDoc(collection(db, "agents"), newAgent);
            fetchAgents();
        } catch (e) {
            console.error("Error creating agent", e);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Agents</h1>
                    <p className="text-neutral-400">Manage your connected AI agents and generate API keys.</p>
                </div>
                <Button onClick={createAgent} className="bg-indigo-600 hover:bg-indigo-700">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Agent
                </Button>
            </div>

            <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader>
                    <CardTitle className="text-lg">Your Connected Agents</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-neutral-500 py-6 text-center">Loading agents...</p>
                    ) : agents.length === 0 ? (
                        <div className="py-12 text-center text-neutral-500">
                            <Key className="w-12 h-12 mx-auto mb-4 text-neutral-600 opacity-50" />
                            <p>No agents created yet. Create one to get an API key.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                                    <TableHead className="text-neutral-400">Name</TableHead>
                                    <TableHead className="text-neutral-400">API Key</TableHead>
                                    <TableHead className="text-neutral-400">ID</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {agents.map((agent) => (
                                    <TableRow key={agent.id} className="border-neutral-800 hover:bg-neutral-800/50">
                                        <TableCell className="font-medium text-white">{agent.name}</TableCell>
                                        <TableCell className="font-mono text-sm text-indigo-400 break-all">{agent.apiKey}</TableCell>
                                        <TableCell className="text-neutral-500 text-xs font-mono">{agent.id}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
