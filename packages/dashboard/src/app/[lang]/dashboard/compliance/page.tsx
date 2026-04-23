// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { 
    Shield, 
    ShieldCheck, 
    Book, 
    ArrowRight, 
    CheckCircle2, 
    AlertTriangle, 
    Globe, 
    Lock, 
    Award,
    Zap,
    Users,
    Activity,
    FileText
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { POLICY_TEMPLATES } from "@/lib/policy-templates";
import { Agent } from "@/types/database";

export default function ComplianceHubPage() {
    const [user] = useAuthState(auth);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        const fetchAgents = async () => {
            try {
                const q = query(collection(db, "agents"), where("userId", "==", user.uid));
                const snap = await getDocs(q);
                const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Agent));
                setAgents(list);
            } catch (e) {
                console.error("Error fetching agents", e);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, [user]);

    const activeComplianceCount = agents.filter(a => a.complianceConfig).length;
    const overallScore = agents.length > 0 ? (activeComplianceCount / agents.length) * 100 : 0;

    return (
        <div className="space-y-12 pb-20">
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-10">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        <span className="text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase">Annex III Command Center</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none">
                        Compliance <span className="text-emerald-500">Hub</span>
                    </h1>
                    <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.3em] max-w-md">
                        Centralized governance for high-risk AI deployments across all sectors.
                    </p>
                </div>
                <div className="flex items-center gap-10">
                    <div className="text-right">
                        <p className="text-4xl font-black text-white italic tabular-nums leading-none">{agents.length}</p>
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] mt-1">Total Agents</p>
                    </div>
                    <div className="h-12 w-px bg-white/10 hidden md:block" />
                    <div className="text-right">
                        <p className="text-4xl font-black text-emerald-500 italic tabular-nums leading-none">{Math.round(overallScore)}%</p>
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] mt-1">Org Readiness</p>
                    </div>
                </div>
            </div>

            {/* ── Active Fleet Status ── */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Operational Readiness</h2>
                    <Link href="/dashboard/agents" className="text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:underline flex items-center gap-1">
                        View Fleet <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                         Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-32 bg-white/5 animate-pulse rounded-2xl border border-white/5" />
                        ))
                    ) : agents.length === 0 ? (
                        <div className="col-span-full py-12 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <p className="text-[11px] font-black text-neutral-500 uppercase tracking-widest">No agents deployed</p>
                        </div>
                    ) : (
                        agents.map(agent => (
                            <Card key={agent.id} className="bg-zinc-900/40 border-white/10 hover:border-emerald-500/30 transition-all duration-300 rounded-2xl group overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-sm font-black text-white uppercase italic truncate max-w-[150px]">{agent.name}</h3>
                                            <p className="text-[9px] font-mono text-neutral-500 mt-0.5 truncate uppercase tracking-tighter">{agent.id?.substring(0, 12)}</p>
                                        </div>
                                        {agent.complianceConfig ? (
                                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-black uppercase">
                                                Annex III Configured
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-neutral-500 border-white/10 text-[9px] font-black uppercase">
                                                Ungoverned
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    {agent.complianceConfig ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                                                <span className="text-[10px] font-black text-neutral-300 uppercase tracking-wider">
                                                    Sector: {agent.complianceConfig.sector}
                                                </span>
                                            </div>
                                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-500 w-[100%]" />
                                            </div>
                                            <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">All 13 Baseline Controls Active</p>
                                        </div>
                                    ) : (
                                        <Link href="/dashboard/policies" className="inline-flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:gap-3 transition-all">
                                            Apply Template <Zap className="w-3 h-3" />
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </section>

            {/* ── Exploration Hub (The Cluster) ── */}
            <section className="space-y-8">
                <div className="space-y-2">
                    <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">Exploration Hub</h2>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Sector Playbooks</h3>
                    <p className="text-xs text-neutral-400 max-w-xl leading-relaxed">
                        Deep-dives into the unique legal requirements and enforcement mechanisms for each Annex III high-risk category.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {POLICY_TEMPLATES.map((template) => (
                        <Link 
                            key={template.id} 
                            href={`/dashboard/compliance/${template.id.replace("eu-ai-act-", "")}`}
                            className="group"
                        >
                            <Card className="bg-zinc-900/60 border-white/10 group-hover:border-white/30 transition-all duration-500 rounded-3xl h-full overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-1.5 h-full opacity-20 group-hover:opacity-100 transition-all bg-current" style={{ color: `var(--${template.accentClass}-500)` }} />
                                <CardContent className="p-8 space-y-4">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors">
                                        <Book className="w-6 h-6 text-neutral-400 group-hover:text-white" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-white uppercase italic group-hover:text-emerald-400 transition-colors">{template.name}</h4>
                                        <p className="text-[10px] text-neutral-500 font-medium leading-relaxed group-hover:text-neutral-300 transition-colors">
                                            {template.tagline}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2">
                                        <span className="text-[9px] font-black text-neutral-600 uppercase tracking-widest">{template.articles[0]} compliant</span>
                                        <ArrowRight className="w-3 h-3 text-neutral-700 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Global Controls (Baseline) ── */}
            <section className="bg-zinc-950/40 border border-white/5 rounded-[2.5rem] p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/20 bg-blue-500/5">
                            <ShieldCheck className="w-3 h-3 text-blue-400" />
                            <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Shared Security Layer</span>
                        </div>
                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                            The Baseline <span className="text-neutral-500">Infrastructure</span>
                        </h3>
                        <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
                            While every sector has unique risks, SupraWall enforces 13 mandatory baseline controls for every agent. This ensures enterprise-wide parity across Article 14 (Oversight), Article 12 (Logging), and Article 9 (Risk Evaluation).
                        </p>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { name: "Risk Management", icon: Activity },
                                { name: "Data Governance", icon: Lock },
                                { name: "Technical Docs", icon: FileText },
                                { name: "Logging Engine", icon: Shield },
                                { name: "Transparency", icon: Globe },
                                { name: "Human Gate", icon: Users }
                            ].map((ctrl) => (
                                <div key={ctrl.name} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center">
                                        <ctrl.icon className="w-4 h-4 text-neutral-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest">{ctrl.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-black/60 border border-white/10 rounded-3xl p-8 space-y-8 relative">
                         <div className="space-y-4">
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Conformity Pipeline</p>
                            <div className="space-y-3">
                                {[
                                    { label: "Annex IV Technical Dossier", status: "Auto-Generating" },
                                    { label: "QMS (Quality Management)", status: "Active" },
                                    { label: "Declaration of Conformity", status: "Pending Decision" },
                                    { label: "EU Database Registration", status: "Manual Hook Required" }
                                ].map((step) => (
                                    <div key={step.label} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                        <span className="text-[11px] font-bold text-neutral-300">{step.label}</span>
                                        <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">{step.status}</span>
                                    </div>
                                ))}
                            </div>
                         </div>
                         <button className="w-full h-14 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] hover:bg-emerald-500 hover:text-white transition-all">
                             Generate Compliance Report
                         </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
