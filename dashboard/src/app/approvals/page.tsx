"use client";

import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc, serverTimestamp, orderBy } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, UserCheck, X, Clock, Eye, Check, AlertCircle, Terminal, MessageSquare, ArrowRight, Shield, Activity, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ApprovalRequest } from "@/types/database";

export default function ApprovalsPage() {
    const [user] = useAuthState(auth);
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "approvalRequests"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ApprovalRequest));
            setRequests(list);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleDecision = async (id: string, decision: 'approved' | 'denied', note?: string) => {
        setIsProcessing(id);
        try {
            const reqRef = doc(db, "approvalRequests", id);
            await updateDoc(reqRef, {
                status: decision,
                reviewedBy: user?.email || user?.uid,
                reviewNote: note || "",
                respondedAt: serverTimestamp()
            });
            setSelectedRequest(null);
        } catch (error) {
            console.error("Failed to update approval:", error);
        } finally {
            setIsProcessing(null);
        }
    };

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const historyRequests = requests.filter(r => r.status !== 'pending');

    return (
        <div className="min-h-screen bg-[#050505] text-white p-8">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="max-w-7xl mx-auto space-y-12"
            >
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Human-in-the-Loop</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic">
                            Governance <span className="text-emerald-500">Approvals</span>
                        </h1>
                        <p className="text-neutral-500 text-lg font-medium max-w-2xl">
                            Real-time intervention for sensitive tool execution. Secure your swarm with human oversight.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <Card className="bg-white/[0.03] border-white/[0.05] backdrop-blur-xl px-6 py-3 flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Pending</p>
                                <p className="text-3xl font-black text-white leading-none">{pendingRequests.length}</p>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <Shield className="w-8 h-8 text-emerald-500/50" />
                        </Card>
                    </div>
                </div>

                {/* Main Content Areas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                    {/* Left: Pending Actions List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                Live Intervention Queue
                            </h2>
                            {pendingRequests.length > 0 && (
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                                    Needs Review
                                </Badge>
                            )}
                        </div>

                        <AnimatePresence mode="popLayout">
                            {pendingRequests.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white/[0.02] border border-dashed border-white/10 rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-4"
                                >
                                    <div className="p-4 bg-white/5 rounded-full">
                                        <ShieldCheck className="w-10 h-10 text-neutral-700" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-xl tracking-tight">System Fully Governed</h3>
                                        <p className="text-neutral-500 text-sm">All agent actions are currently complying with static policies.</p>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingRequests.map((req, idx) => (
                                        <motion.div
                                            key={req.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="group relative bg-[#0a0a0a] border border-white/[0.05] hover:border-emerald-500/30 rounded-2xl p-6 transition-all shadow-2xl overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-3">
                                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">Pending</Badge>
                                            </div>

                                            <div className="flex items-start gap-5">
                                                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                                    <Terminal className="w-6 h-6 text-emerald-500" />
                                                </div>
                                                <div className="flex-1 space-y-3">
                                                    <div>
                                                        <h3 className="text-white font-black text-xl tracking-tight flex items-center gap-2">
                                                            {req.toolName}
                                                            <ArrowRight className="w-4 h-4 text-neutral-700" />
                                                            <span className="text-emerald-500/80">{req.agentName || "Agent"}</span>
                                                        </h3>
                                                        <p className="text-neutral-500 text-xs font-medium uppercase tracking-widest mt-1">
                                                            Requested {req.createdAt ? format(req.createdAt.toDate(), 'HH:mm:ss') : 'just now'} • Session: {req.sessionId?.slice(0, 8) || 'N/A'}
                                                        </p>
                                                    </div>

                                                    <div className="bg-black/50 rounded-xl p-4 font-mono text-xs text-neutral-400 border border-white/[0.03] max-h-32 overflow-hidden relative">
                                                        {req.arguments}
                                                        <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                                                    </div>

                                                    <div className="flex items-center gap-3 pt-2">
                                                        <Button
                                                            onClick={() => setSelectedRequest(req)}
                                                            variant="outline"
                                                            className="bg-white/5 border-white/10 hover:bg-white/10 text-white gap-2"
                                                        >
                                                            <Eye className="w-4 h-4" /> Inspect
                                                        </Button>
                                                        <div className="flex-1" />
                                                        <Button
                                                            onClick={() => handleDecision(req.id!, 'denied')}
                                                            variant="ghost"
                                                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 font-bold"
                                                            disabled={isProcessing === req.id}
                                                        >
                                                            <X className="w-4 h-4 mr-2" /> Deny
                                                        </Button>
                                                        <Button
                                                            onClick={() => handleDecision(req.id!, 'approved')}
                                                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] shadow-emerald-500/20 transition-all hover:scale-105"
                                                            disabled={isProcessing === req.id}
                                                        >
                                                            <Check className="w-4 h-4 mr-2" /> Approve
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right: History & Insights */}
                    <div className="space-y-6">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2 mb-4">
                            <Clock className="w-4 h-4 text-neutral-500" />
                            Recent Decisions
                        </h2>

                        <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden divide-y divide-white/[0.05]">
                            {historyRequests.length === 0 ? (
                                <div className="p-10 text-center text-neutral-600 text-xs italic">
                                    No historical decisions in this cycle.
                                </div>
                            ) : (
                                historyRequests.slice(0, 10).map((req) => (
                                    <div key={req.id} className="p-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors">
                                        <div className={`p-2 rounded-lg ${req.status === 'approved' ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                                            {req.status === 'approved' ? <UserCheck className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-red-500" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <p className="font-bold text-sm text-white">{req.toolName}</p>
                                                <p className="text-[10px] text-neutral-600">{req.respondedAt ? format(req.respondedAt.toDate(), 'MM/dd HH:mm') : ''}</p>
                                            </div>
                                            <p className="text-[10px] uppercase font-bold tracking-tighter text-neutral-500 mt-0.5">{req.agentName}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <Card className="bg-emerald-950/20 border-emerald-500/20 p-6 rounded-3xl space-y-4">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-emerald-500" />
                                <h3 className="font-black text-emerald-500 uppercase italic tracking-wider">Governance Tip</h3>
                            </div>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                Use <span className="text-white font-bold">conditional policies</span> to automate approvals for low-risk actions, while keeping human oversight for deletions and financial transactions.
                            </p>
                        </Card>
                    </div>
                </div>
            </motion.div>

            {/* Inspect Dialog */}
            <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
                <DialogContent className="max-w-3xl bg-[#0a0a0a] border border-white/10 text-white rounded-3xl shadow-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black uppercase italic italic tracking-tighter flex items-center gap-3">
                            <Fingerprint className="w-8 h-8 text-emerald-500" />
                            Tool Call <span className="text-emerald-500">Inspector</span>
                        </DialogTitle>
                        <DialogDescription className="text-neutral-500 font-medium">
                            Review the full context before authorizing execution.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedRequest && (
                        <div className="space-y-6 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
                                    <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Agent Identity</p>
                                    <p className="text-white font-bold">{selectedRequest.agentName}</p>
                                    <p className="text-xs text-neutral-600 font-mono mt-1">{selectedRequest.agentId}</p>
                                </div>
                                <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
                                    <p className="text-[10px] font-black uppercase text-neutral-500 tracking-widest mb-1">Tool Target</p>
                                    <p className="text-white font-bold underline decoration-emerald-500/50">{selectedRequest.toolName}</p>
                                    <p className="text-xs text-neutral-600 font-mono mt-1">v1.2.0-stable</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-neutral-500 tracking-widest flex items-center gap-2">
                                    <MessageSquare className="w-3 h-3 text-emerald-500" /> Payload (Arguments)
                                </label>
                                <div className="bg-black/80 rounded-2xl p-6 border border-white/10 max-h-96 overflow-auto custom-scrollbar">
                                    <pre className="text-emerald-500 font-mono text-sm leading-relaxed">
                                        {JSON.stringify(JSON.parse(selectedRequest.arguments), null, 2)}
                                    </pre>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <Button
                                    onClick={() => handleDecision(selectedRequest.id!, 'denied')}
                                    variant="outline"
                                    className="border-red-500/20 hover:bg-red-500/10 text-red-500 font-bold px-8 rounded-xl"
                                    disabled={isProcessing === selectedRequest.id}
                                >
                                    Block Execution
                                </Button>
                                <Button
                                    onClick={() => handleDecision(selectedRequest.id!, 'approved')}
                                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-10 rounded-xl transition-all shadow-xl shadow-emerald-600/20"
                                    disabled={isProcessing === selectedRequest.id}
                                >
                                    Authorize Tool Call
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
        </div>
    );
}
