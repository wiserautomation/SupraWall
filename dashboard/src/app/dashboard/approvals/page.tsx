"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { collection, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Check, 
    X, 
    Shield, 
    Clock, 
    Terminal, 
    UserCheck, 
    AlertCircle, 
    ArrowRight,
    Loader2,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

interface ApprovalRequest {
    id: string;
    agentid: string;
    toolname: string;
    parameters: any;
    status: "pending" | "approved" | "denied";
    createdat: string;
    metadata?: any;
}


export default function ApprovalsPage() {
    const [user] = useAuthState(auth);
    const [requests, setRequests] = useState<ApprovalRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        if (!user) return;
        setLoading(true);

        const q = query(
            collection(db, "approvalRequests"),
            where("userId", "==", user.uid),
            where("status", "==", "pending")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Handle various property naming conventions if needed
                agentid: doc.data().agentId || doc.data().agentid,
                toolname: doc.data().toolName || doc.data().toolname,
                createdat: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdat
            })) as ApprovalRequest[];
            
            setRequests(list);
            setLoading(false);
        }, (error) => {
            console.error("Approval sync failed:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const handleAction = async (id: string, decision: "approved" | "denied") => {
        setProcessingId(id);
        try {
            const res = await fetch(`/api/approvals/${id}/respond`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    decision,
                    reviewNote: decision === "approved" ? "Approved via Dashboard" : "Denied via Dashboard",
                    reviewedBy: user?.email || user?.uid
                })
            });

            if (res.ok) {
                // Optimistically remove from list
                setRequests(prev => prev.filter(r => r.id !== id));
            }
        } catch (error) {
            console.error("Error updating approval status:", error);
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8 max-w-5xl mx-auto"
        >
            {/* Header */}
            <div className="flex justify-between items-end mb-8 border-b border-white/[0.05] pb-8">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[9px] font-black tracking-[0.2em] text-blue-400 uppercase">Human-in-the-Loop</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">Approval Queue</h1>
                    <p className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.2em]">High-risk actions awaiting human intervention.</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-black text-white italic">{requests.length}</p>
                    <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Pending Decisions</p>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Scanning the wire...</p>
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-black/40 backdrop-blur-3xl border border-white/[0.05] rounded-3xl p-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                        <UserCheck className="w-8 h-8 text-emerald-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Queue Clear</h3>
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mt-2">All agents operating within safety thresholds.</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {requests.map((req) => (
                            <motion.div
                                key={req.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="group relative"
                            >
                                <Card className="bg-black/60 backdrop-blur-xl border-white/[0.05] hover:border-blue-500/30 transition-all duration-500 overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/40 group-hover:bg-blue-500 transition-colors" />
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row gap-6 justify-between">
                                            <div className="space-y-4 flex-grow">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                                        <Terminal className="w-4 h-4 text-blue-400" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-black text-white uppercase tracking-tight text-sm">{req.toolname}</h3>
                                                            <Badge variant="outline" className="text-[8px] bg-white/5 border-white/10 uppercase tracking-widest px-1.5 py-0">Pending</Badge>
                                                        </div>
                                                        <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {formatDistanceToNow(new Date(req.createdat), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">Execution Context</p>
                                                    <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-xs overflow-x-auto">
                                                        <pre className="text-neutral-300">
                                                            {JSON.stringify(req.parameters, null, 2)}
                                                        </pre>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <div className="space-y-1">
                                                        <p className="text-[9px] font-black text-neutral-600 uppercase tracking-widest flex items-center gap-1">
                                                            <Shield className="w-3 h-3" />
                                                            Origin Agent
                                                        </p>
                                                        <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[9px] font-mono text-neutral-400">{req.agentid}</span>
                                                    </div>
                                                </div>
                                                
                                                {req.metadata?.matchedRule && (
                                                    <div className="flex items-start gap-2 p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
                                                        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                                                        <p className="text-xs text-amber-200/80">
                                                            <span className="font-bold uppercase text-[9px] tracking-widest block mb-1">Trigger Reason:</span>
                                                            Policy Match: {req.metadata.matchedRule}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex md:flex-col gap-2 justify-end">
                                                <Button 
                                                    onClick={() => handleAction(req.id, "denied")} 
                                                    disabled={processingId === req.id}
                                                    variant="outline" 
                                                    className="border-rose-500/20 bg-rose-500/5 text-rose-400 hover:bg-rose-500 hover:text-white transition-all font-black uppercase tracking-wider text-[10px] h-12 flex-grow md:w-32"
                                                >
                                                    {processingId === req.id ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <X className="w-3 h-3 mr-2" />}
                                                    Reject
                                                </Button>
                                                <Button 
                                                    onClick={() => handleAction(req.id, "approved")}
                                                    disabled={processingId === req.id}
                                                    className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 transition-all font-black uppercase tracking-wider text-[10px] h-12 flex-grow md:w-32"
                                                >
                                                    {processingId === req.id ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Check className="w-3 h-3 mr-2" />}
                                                    Approve
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                    
                                    {/* Security Watermark */}
                                    <div className="absolute -bottom-4 -right-4 opacity-[0.03] pointer-events-none">
                                        <Shield className="w-32 h-32 text-white" />
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Governance Legend */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/[0.05]">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Check className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Approve</p>
                    </div>
                    <p className="text-[9px] text-neutral-500 leading-relaxed uppercase tracking-wider">
                        Action proceeds with currently defined arguments. Agent resumes immediately.
                    </p>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                            <X className="w-4 h-4 text-rose-500" />
                        </div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Deny</p>
                    </div>
                    <p className="text-[9px] text-neutral-500 leading-relaxed uppercase tracking-wider">
                        Interrupts agent execution flow. Agent receives a security block error.
                    </p>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <Lock className="w-4 h-4 text-purple-500" />
                        </div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Vault Integration</p>
                    </div>
                    <p className="text-[9px] text-neutral-500 leading-relaxed uppercase tracking-wider">
                        Approvals may bypass scrubbing if explicitly requested by policy override.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
