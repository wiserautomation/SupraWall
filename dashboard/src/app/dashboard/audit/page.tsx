"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, Shield, ShieldAlert, CheckCircle2, Clock } from "lucide-react";
import { Agent, AuditLog } from "@/types/database";
import { motion } from "framer-motion";

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
            const timeoutId = setTimeout(() => setLoading(false), 0);
            return () => clearTimeout(timeoutId);
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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            <div className="flex justify-between items-end mb-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">Audit Logs</h1>
                    <p className="text-neutral-400 text-sm">Real-time stream of agent execution attempts and authorization decisions.</p>
                </div>
            </div>

            <Card className="bg-black/40 backdrop-blur-xl border-white/[0.05] shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />

                <CardHeader className="border-b border-white/[0.05] flex flex-row items-center justify-between pb-4 bg-white/[0.01]">
                    <CardTitle className="text-lg flex items-center gap-2 font-semibold text-white/90 tracking-tight">
                        <Activity className="w-5 h-5 text-emerald-400" /> Live Feed
                    </CardTitle>
                    <div className="flex items-center text-xs text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full border border-green-400/20 shadow-sm shadow-green-400/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400 mr-2 animate-pulse" />
                        Connected
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <p className="text-neutral-500 py-24 text-center animate-pulse">Connecting to log stream...</p>
                    ) : logs.length === 0 ? (
                        <div className="py-24 text-center text-neutral-500 flex flex-col items-center justify-center">
                            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                                <Activity className="w-16 h-16 mb-6 text-neutral-700 opacity-40 shadow-inner" />
                                <p className="text-neutral-400">No agent activity intercepted yet.</p>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/[0.05] hover:bg-transparent">
                                        <TableHead className="text-neutral-400 font-medium px-6 py-4">Time</TableHead>
                                        <TableHead className="text-neutral-400 font-medium">Agent</TableHead>
                                        <TableHead className="text-neutral-400 font-medium">Tool Executed</TableHead>
                                        <TableHead className="text-neutral-400 font-medium">Arguments Payload</TableHead>
                                        <TableHead className="text-neutral-400 font-medium text-right px-6">Decision</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.map((log) => (
                                        <TableRow key={log.id} className="border-white/[0.02] hover:bg-white/[0.02] transition-colors group/row">
                                            <TableCell className="text-neutral-500 text-xs px-6 py-4 whitespace-nowrap font-mono">
                                                <span className="text-emerald-200/50">
                                                    {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'Now'}
                                                </span>
                                                <br />
                                                <span className="text-neutral-600/50">{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleDateString() : ''}</span>
                                            </TableCell>
                                            <TableCell className="font-medium text-white">{getAgentName(log.agentId)}</TableCell>
                                            <TableCell className="text-neutral-300 font-mono text-sm group-hover/row:text-white transition-colors">
                                                {log.toolName}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs max-w-sm truncate text-emerald-400/60 group-hover/row:text-emerald-300 transition-colors">
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
        </motion.div>
    );
}
