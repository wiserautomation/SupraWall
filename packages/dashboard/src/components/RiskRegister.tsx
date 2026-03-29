// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon, ShieldAlert, ArrowRight } from "lucide-react";

interface ThreatEvent {
    id: string;
    event_type: string;
    severity: string;
    details: string;
    timestamp: string;
    agentid: string;
}

export function RiskRegister() {
    const [user] = useAuthState(auth);
    const [threats, setThreats] = useState<ThreatEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchThreats = async () => {
            try {
                const idToken = await user.getIdToken();
                const res = await fetch(`/api/v1/threat?tenantId=${user.uid}&limit=10`, {
                    headers: { 'Authorization': `Bearer ${idToken}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setThreats(data.rows || []);
                }
            } catch (e) {
                console.error("Failed to load generic threats", e);
            } finally {
                setLoading(false);
            }
        };
        fetchThreats();
    }, [user]);

    return (
        <Card className="bg-black/60 backdrop-blur-xl border-red-500/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
            <CardHeader className="pb-3 border-b border-white/[0.05]">
                <CardTitle className="flex items-center gap-2 text-sm font-bold text-neutral-300">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    Risk Register (Top Blocked Threats)
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <div className="p-4 text-xs text-neutral-500">Loading risk register...</div>
                ) : threats.length === 0 ? (
                    <div className="p-6 flex flex-col items-center justify-center text-center">
                        <AlertOctagon className="w-8 h-8 text-neutral-700 mb-2" />
                        <p className="text-sm font-medium text-neutral-400">No threats detected yet.</p>
                        <p className="text-xs text-neutral-600 mt-1">SupraWall is actively monitoring your agents.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/[0.05]">
                        {threats.map((threat) => {
                            let detailsObj: any = {};
                            try { detailsObj = JSON.parse(threat.details); } catch (e) {}

                            return (
                                <div key={threat.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                                    <div className="space-y-1 w-2/3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black uppercase text-red-500 tracking-wider">
                                                {threat.event_type.replace(/_/g, " ")}
                                            </span>
                                            <span className="text-[10px] text-neutral-500 font-mono">
                                                Agent {threat.agentid.substring(0, 8)}
                                            </span>
                                        </div>
                                        <p className="text-xs text-neutral-300 font-mono truncate">
                                            Matched: {detailsObj.pattern || "Suspicious behavior"}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-neutral-500">
                                            {new Date(threat.timestamp).toLocaleString()}
                                        </p>
                                        <div className="inline-flex mt-1 items-center gap-1 text-[10px] font-bold text-red-500/80 uppercase">
                                            Severity: {threat.severity}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
