// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import { Sparkles, Brain, Wand2, Loader2, Play, CheckCircle2, BadgeCheck, ShieldAlert, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";

export default function AiSecurityArchitect({ agentId, tenantId, onApplied }: { agentId: string; tenantId: string; onApplied: () => void }) {
    const [description, setDescription] = useState("");
    const [assessing, setAssessing] = useState(false);
    const [assessment, setAssessment] = useState<any>(null);
    const [applying, setApplying] = useState(false);

    const handleAssess = async () => {
        if (!description.trim()) return;
        setAssessing(true);
        try {
            const res = await fetch(`/api/v1/agents/${agentId}/assess`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description })
            });
            if (res.ok) {
                const data = await res.json();
                setAssessment(data);
            }
        } catch (e) {
            console.error("Failed to assess agent security:", e);
        } finally {
            setAssessing(false);
        }
    };

    const handleApply = async () => {
        if (!assessment) return;
        setApplying(true);
        try {
            // Apply Guardrails
            await fetch(`/api/v1/agents/${agentId}/guardrails`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(assessment.guardrails)
            });

            // Apply Suggested Policies
            if (assessment.suggestedPolicies && assessment.suggestedPolicies.length > 0) {
                for (const p of assessment.suggestedPolicies) {
                    await fetch(`/api/v1/policies`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            tenantId,
                            agentId,
                            name: `AI: ${p.toolName} Guard`,
                            toolName: p.toolName,
                            ruleType: p.ruleType,
                            condition: p.condition,
                            description: p.description || p.condition
                        })
                    });
                }
            }
            
            onApplied();
            setAssessment(null);
            setDescription("");
        } catch (e) {
            console.error("Failed to apply AI recommendations:", e);
        } finally {
            setApplying(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-violet-900/20 to-emerald-900/10 border border-violet-500/20 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden group shadow-[0_0_80px_rgba(139,92,246,0.05)]">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 group-hover:rotate-12 transition-all duration-700">
                <Brain className="w-64 h-64 text-violet-400" />
            </div>

            <div className="flex items-center gap-4 relative z-10">
                <div className="p-4 bg-violet-600/20 rounded-2xl">
                    <Sparkles className="w-8 h-8 text-violet-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-black uppercase tracking-tighter text-white italic">AI Security Architect</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 opacity-80">Autonomous Guardrail & Policy Recommendation</p>
                </div>
            </div>

            <div className="space-y-4 relative z-10">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 ml-1">Describe what this agent does</Label>
                <div className="relative">
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., 'This agent handles financial reports, accesses my SQL database for sales data, and can send email summaries to the C-suite.'"
                        className="w-full bg-black/40 border border-white/10 text-white rounded-[2rem] p-6 text-sm min-h-[120px] focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all outline-none leading-relaxed placeholder:text-neutral-700 font-medium"
                    />
                    <div className="absolute bottom-4 right-4 text-[9px] font-black text-neutral-600 uppercase tracking-widest px-3 py-1 bg-black/40 rounded-full border border-white/5">
                        Gemini 2.0 Enabled
                    </div>
                </div>

                {!assessment && (
                    <Button 
                        onClick={handleAssess} 
                        disabled={assessing || !description.trim()}
                        className="w-full h-16 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-violet-900/20 transition-all transform hover:scale-[1.01] active:scale-[0.98]"
                    >
                        {assessing ? (
                            <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Analyzing Agent Surface Area...</>
                        ) : (
                            <><Wand2 className="w-5 h-5 mr-3" /> Generate Security Assessment</>
                        )}
                    </Button>
                )}
            </div>

            <AnimatePresence>
                {assessment && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        className="space-y-6 pt-6 border-t border-white/5 relative z-10"
                    >
                        <div className="bg-white/5 rounded-3xl p-6 space-y-4">
                            <div className="flex items-center gap-2 text-violet-400">
                                <Brain className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Assessment Strategy</span>
                            </div>
                            <p className="text-sm font-medium leading-relaxed text-neutral-200">
                                {assessment.assessment}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Security Guardrails</span>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[11px] font-bold">
                                        <span className="text-neutral-400">Budget Limit</span>
                                        <span className="text-emerald-400 font-mono italic">${assessment.guardrails.budget.limitUsd} / {assessment.guardrails.budget.resetPeriod}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {assessment.guardrails.piiScrubbing.enabled && (
                                            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-[8px] font-black uppercase tracking-widest">PII Shield</Badge>
                                        )}
                                        {assessment.guardrails.blockedTools.map((t: string) => (
                                            <Badge key={t} className="bg-rose-500/10 text-rose-400 border-rose-500/20 text-[8px] font-black uppercase tracking-widest italic">{t}</Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-5 space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Suggested Policies</span>
                                <div className="space-y-2">
                                    {assessment.suggestedPolicies.map((p: any, i: number) => (
                                        <div key={i} className="flex flex-col gap-0.5">
                                            <span className="text-[10px] font-black text-white italic">{p.toolName} : {p.ruleType}</span>
                                            <span className="text-[9px] text-neutral-500 line-clamp-1 italic">{p.condition}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button 
                                onClick={handleApply}
                                disabled={applying}
                                className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg transition-all"
                            >
                                {applying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Applying Controls...</> : "Apply Recommendations"}
                            </Button>
                            <Button 
                                variant="outline"
                                onClick={() => setAssessment(null)}
                                className="h-14 bg-white/5 border-white/10 text-white px-8 rounded-2xl uppercase font-black text-[10px] tracking-widest"
                            >
                                Discard
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
