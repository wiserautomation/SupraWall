// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from "lucide-react";

interface ComplianceStatus {
    overall: "COMPLIANT" | "ATTENTION_NEEDED" | "NOT_CONFIGURED";
    checks: Record<string, {
        status: "pass" | "partial" | "fail";
        detail: string;
    }>;
}

export function ContinuousComplianceMonitor() {
    const [user] = useAuthState(auth);
    const [status, setStatus] = useState<ComplianceStatus | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchStatus = async () => {
            try {
                const idToken = await user.getIdToken();
                const res = await fetch(`/api/v1/compliance/status?tenantId=${user.uid}`, {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStatus(data);
                }
            } catch (e) {
                console.error("Failed to load compliance status", e);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
    }, [user]);

    if (!user) return null;

    return (
        <Card className="bg-black/80 backdrop-blur-xl border-emerald-500/10 hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div>
                   <CardTitle className="text-sm font-black uppercase tracking-widest text-emerald-400">Continuous Monitor</CardTitle>
                   <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest mt-0.5">Live Compliance Scorecard</p>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-500 opacity-50 group-hover:opacity-100 transition-opacity" />
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="h-20 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                ) : status ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl border ${
                                status.overall === "COMPLIANT" ? "bg-emerald-500/10 border-emerald-500/20" : 
                                status.overall === "ATTENTION_NEEDED" ? "bg-amber-500/10 border-amber-500/20" : 
                                "bg-red-500/10 border-red-500/20"
                            }`}>
                                <p className="text-[10px] uppercase font-black tracking-widest text-neutral-500 mb-1 leading-none">Status</p>
                                <span className={`text-xl font-black italic tracking-tighter ${
                                    status.overall === "COMPLIANT" ? "text-emerald-400" : 
                                    status.overall === "ATTENTION_NEEDED" ? "text-amber-400" : 
                                    "text-red-400"
                                }`}>
                                    {status.overall === "COMPLIANT" ? "VERIFIED" : 
                                     status.overall === "ATTENTION_NEEDED" ? "CAUTION" : 
                                     "CRITICAL"}
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 flex-1">
                                {Object.entries(status.checks).slice(0, 3).map(([key, check]) => (
                                    <div key={key} className="p-2 border border-white/5 rounded-xl bg-white/[0.02] flex flex-col items-center justify-center">
                                       {check.status === "pass" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mb-1" /> :
                                        check.status === "partial" ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mb-1" /> :
                                        <XCircle className="w-3.5 h-3.5 text-red-500 mb-1" />}
                                       <span className="text-[8px] font-black uppercase tracking-tighter text-neutral-500 text-center leading-none">
                                           {key.split(/(?=[A-Z])/).join(" ")}
                                       </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-white/[0.05]">
                           <div className="flex items-center justify-between">
                              <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Verification Active · v4.1.2</span>
                              <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80">Regulator-Ready</span>
                           </div>
                        </div>
                    </div>
                ) : (
                    <div className="h-20 flex items-center justify-center text-[10px] text-neutral-600 font-bold uppercase">No status data</div>
                )}
            </CardContent>
        </Card>
    );
}
