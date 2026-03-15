"use client";

import { useState } from "react";
import { Check, Shield, ShieldAlert, Zap, FileJson, Search, Activity, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function PolicyValidator() {
    const [json, setJson] = useState(() => JSON.stringify({
        agentId: "agent_research_01",
        toolName: "system_shell",
        arguments: "rm -rf /",
        context: "Executing cleanup script"
    }, null, 2));

    const [result, setResult] = useState<any>(null);
    const [isValidating, setIsValidating] = useState(false);

    const validate = () => {
        setIsValidating(true);
        setTimeout(() => {
            try {
                const data = JSON.parse(json);
                const isRisky = data.arguments?.toString().includes('rm') || data.toolName?.includes('shell');
                
                setResult({
                    status: isRisky ? 'DENY' : 'ALLOW',
                    score: isRisky ? 94 : 12,
                    reason: isRisky ? "High-risk command detected in restricted environment." : "Action within safety constraints.",
                    policyId: "pol_strict_001"
                });
            } catch (e) {
                setResult({
                    status: 'ERROR',
                    score: 0,
                    reason: "Invalid JSON payload.",
                    policyId: "N/A"
                });
            }
            setIsValidating(false);
        }, 1200);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Payload Input (JSON)</label>
                    <Badge variant="outline" className="text-[8px] border-emerald-500/20 text-emerald-500 bg-emerald-500/5 font-black uppercase">Real-time Simulation</Badge>
                </div>
                <div className="relative group">
                    <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <textarea 
                        value={json}
                        onChange={(e) => setJson(e.target.value)}
                        className="w-full h-64 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 font-mono text-xs text-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none relative z-10 custom-scrollbar"
                    />
                </div>
                <Button 
                    onClick={validate}
                    disabled={isValidating}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-wider text-xs h-12 rounded-xl shadow-lg shadow-emerald-500/10 transition-all"
                >
                    {isValidating ? (
                        <>
                            <Activity className="w-4 h-4 mr-2 animate-spin" />
                            Analyzing Intent...
                        </>
                    ) : (
                        <>
                            <Search className="w-4 h-4 mr-2" />
                            Run Governance Check
                        </>
                    )}
                </Button>
            </div>

            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Simulation Results</label>
                </div>
                
                <div className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    
                    {!result && !isValidating && (
                        <div className="space-y-4 opacity-40">
                            <Shield className="w-12 h-12 mx-auto text-neutral-600" />
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">Awaiting Analysis</p>
                        </div>
                    )}

                    {isValidating && (
                        <div className="space-y-6">
                            <div className="relative">
                                <div className="w-20 h-20 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                                <Lock className="absolute inset-0 m-auto w-6 h-6 text-emerald-500 animate-pulse" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Intercepting Call...</p>
                        </div>
                    )}

                    {result && !isValidating && (
                        <div className="w-full space-y-8 animate-in zoom-in-95 fade-in duration-300">
                            <div className="flex flex-col items-center gap-4">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center border-4 shadow-2xl relative ${result.status === 'ALLOW' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'}`}>
                                    {result.status === 'ALLOW' ? <Shield className="w-8 h-8" /> : <ShieldAlert className="w-8 h-8" />}
                                    <div className={`absolute -bottom-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${result.status === 'ALLOW' ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-black'}`}>
                                        {result.status}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{result.status === 'ALLOW' ? 'Safe Action' : 'Policy Block'}</p>
                                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Risk Score: {result.score}/100</p>
                                </div>
                            </div>

                            <div className={`p-4 rounded-2xl border text-left ${result.status === 'ALLOW' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
                                <div className="flex gap-3">
                                    <div className={`p-1.5 rounded-lg h-fit ${result.status === 'ALLOW' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        <Activity className="w-4 h-4" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Reasoning</p>
                                        <p className="text-xs text-neutral-300 font-medium leading-relaxed">{result.reason}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center gap-6">
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest mb-1">Impact</p>
                                    <p className="text-xs font-black text-white">LOW</p>
                                </div>
                                <div className="w-[1px] h-8 bg-white/5" />
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest mb-1">Latency</p>
                                    <p className="text-xs font-black text-white">4ms</p>
                                </div>
                                <div className="w-[1px] h-8 bg-white/5" />
                                <div className="text-center">
                                    <p className="text-[8px] font-black text-neutral-600 uppercase tracking-widest mb-1">Policy</p>
                                    <p className="text-xs font-black text-white">{result.policyId}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
