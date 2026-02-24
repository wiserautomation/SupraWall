"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { Agent, AuditLog } from "@/types/database";

export default function AuditPage() {
    const [user] = useAuthState(auth);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch agents first to know which logs to show/link
    useEffect(() => {
        if (!user) return;
        const fetchAgents = async () => {
            const q = query(collection(db, "agents"), where("userId", "==", user.uid));
            const snap = await getDocs(q);
            setAgents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent)));
        };
        fetchAgents();
    }, [user]);

    // Listen to audit logs real-time
    useEffect(() => {
        if (!user || agents.length === 0) {
            setLoading(false);
            return;
        }

        // In a prod environment we'd use 'in' query for agentIds but it has a limit of 10.
        // Given MVP constraints and Firestore rules we set up, we'll watch the logs collection.
        // If the rule `allow read: if isOwnerOfAgent(resource.data.agentId)` is used, we'd need
        // a more specific query here, or a Cloud Function to copy log events to a `/users/{uid}/logs` collection
        // for easy listener. For MVP, we'll query for the first agent's logs if multiple, or just 
        // a simple listener if our rules allow it. Actually, `onSnapshot` on a collection where rules
        // only permit reading *some* documents will fail.
        // We MUST query by `agentId == ...` to satisfy the rules or use an `in` clause up to 10 agents.

        const agentIds = agents.map(a => a.id).slice(0, 10); // Firestore max `in` clause is 10

        if (agentIds.length === 0) return;

        const qLogs = query(
            collection(db, "audit_logs"),
            where("agentId", "in", agentIds),
            orderBy("timestamp", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(qLogs, (snapshot) => {
            const logsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AuditLog));
            setLogs(logsData);
            setLoading(false);
        }, (error) => {
            console.error("Error listening to logs:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, agents]);

    const getAgentName = (id: string) => agents.find(a => a.id === id)?.name || "Unknown Agent";

    const getDecisionIcon = (decision: string) => {
        switch (decision) {
            case "ALLOW": return <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />;
            case "DENY": return <ShieldAlert className="w-4 h-4 text-red-500 mr-2" />;
            case "REQUIRE_APPROVAL": return <Clock className="w-4 h-4 text-yellow-500 mr-2" />;
            default: return null;
        }
    };

    const getDecisionStyle = (decision: string) => {
        switch (decision) {
            case "ALLOW": return "text-green-500 bg-green-500/10 border-green-500/20";
            case "DENY": return "text-red-500 bg-red-500/10 border-red-500/20";
            case "REQUIRE_APPROVAL": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
            default: return "";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Audit Logs</h1>
                    <p className="text-neutral-400">Real-time stream of agent execution attempts and authorization decisions.</p>
                </div>
            </div>

            <Card className="bg-neutral-900 border-neutral-800">
                <CardHeader className="border-b border-neutral-800 flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" /> Live Feed
                    </CardTitle>
                    <div className="flex items-center text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse" />
                        Connected
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <p className="text-neutral-500 py-12 text-center">Connecting to log stream...</p>
                    ) : logs.length === 0 ? (
                        <div className="py-16 text-center text-neutral-500 flex flex-col items-center justify-center">
                            <Activity className="w-12 h-12 mb-4 opacity-20" />
                            <p>No agent activity intercepted yet.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-neutral-800 hover:bg-neutral-800/50">
                                        <TableHead className="text-neutral-400 px-6 py-4">Time</TableHead>
                                        <TableHead className="text-neutral-400">Agent</TableHead>
                                        <TableHead className="text-neutral-400">Tool Executed</TableHead>
                                        <TableHead className="text-neutral-400">Arguments Payload</TableHead>
                                        <TableHead className="text-neutral-400 text-right px-6">Decision</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map((log) => (
                                        <TableRow key={log.id} className="border-neutral-800 hover:bg-neutral-800/50 transition-colors">
                                            <TableCell className="text-neutral-500 text-xs px-6 py-4 whitespace-nowrap font-mono">
                                                {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Now'}
                                                <br />
                                                <span className="text-neutral-700">{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleDateString() : ''}</span>
                                            </TableCell>
                                            <TableCell className="font-medium text-white">{getAgentName(log.agentId)}</TableCell>
                                            <TableCell className="text-neutral-300 font-mono text-sm">{log.toolName}</TableCell>
                                            <TableCell className="font-mono text-xs max-w-sm truncate text-indigo-300/80">
                                                {log.arguments}
                                            </TableCell>
                                            <TableCell className="text-right px-6">
                                                <div className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${getDecisionStyle(log.decision)}`}>
                                                    {getDecisionIcon(log.decision)}
                                                    {log.decision}
                                                </div>
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
    );
}
