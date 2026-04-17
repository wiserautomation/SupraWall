// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
    Shield, 
    ArrowLeft, 
    CheckCircle2, 
    AlertTriangle, 
    Info, 
    Book, 
    Terminal, 
    Globe, 
    ArrowRight,
    Lock,
    Scale,
    Activity,
    Users,
    Stethoscope,
    Building2,
    GraduationCap,
    Fingerprint,
    Gavel,
    PlaneTakeoff,
    Siren,
    ShieldCheck as LucideShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { POLICY_TEMPLATES } from "@/lib/policy-templates";

export default function SectorPlaybookPage({ params }: { params: Promise<{ sector: string }> }) {
    const { sector } = use(params);
    const router = useRouter();
    const template = POLICY_TEMPLATES.find(t => t.id.includes(sector));

    if (!template) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <AlertTriangle className="w-12 h-12 text-amber-500" />
                <h1 className="text-2xl font-black text-white uppercase italic">Sector Not Found</h1>
                <Button onClick={() => router.push("/dashboard/compliance")} variant="ghost" className="text-emerald-500 uppercase tracking-widest font-black">
                    Return to Hub
                </Button>
            </div>
        );
    }

    const icons: Record<string, any> = {
        "Human Resources": Building2,
        "Medical & Clinical": Stethoscope,
        "Education & Training": GraduationCap,
        "Utilities & Energy": Activity,
        "Biometric Systems": Fingerprint,
        "Public Safety": Siren,
        "Migration & Asylum": PlaneTakeoff,
        "Legal & Judicial": Gavel
    };

    const SectorIcon = icons[template.industry] || Book;

    return (
        <div className="space-y-12 pb-20">
            {/* ── Breadcrumb & Navigation ── */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => router.push("/dashboard/compliance")}
                    className="flex items-center gap-2 text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-3 h-3" />
                    Back to Hub
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">Sector Protocol:</span>
                    <Badge className="bg-white/5 text-white border-white/10 uppercase font-black text-[9px] tracking-widest px-3">
                        {template.id.toUpperCase()}
                    </Badge>
                </div>
            </div>

            {/* ── Hero Section ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                            <SectorIcon className="w-8 h-8 text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none">
                                {template.name}
                            </h1>
                            <p className="text-sm font-black text-emerald-500 uppercase tracking-[0.25em]">Annex III High-Risk Playbook</p>
                        </div>
                    </div>
                    <p className="text-lg text-neutral-300 font-medium leading-relaxed max-w-2xl">
                        {template.tagline}
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {template.articles.map(art => (
                            <Badge key={art} variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 px-4 py-1 text-[10px] font-black uppercase tracking-widest">
                                {art} Enforced
                            </Badge>
                        ))}
                    </div>
                </div>

                <Card className="bg-zinc-950/60 border-emerald-500/20 rounded-[2rem] p-8 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
                    <div className="space-y-6 relative">
                        <h4 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em] flex items-center gap-2">
                            <LucideShieldCheck className="w-3 h-3 text-emerald-500" /> Human Oversight Gate
                        </h4>
                        <div className="p-5 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                Deployment of this template requires active monitoring of the <span className="text-white font-bold">Cascade Risk Threshold</span>.
                            </p>
                            <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Safe Halt State</span>
                                <Badge className="bg-emerald-500/20 text-emerald-400 border-none font-black text-[9px] uppercase">Ready</Badge>
                            </div>
                        </div>
                        <Button 
                            onClick={() => router.push("/dashboard/policies")}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-[0.2em] text-[10px] h-12 rounded-xl"
                        >
                            Deploy to My Agent
                        </Button>
                    </div>
                </Card>
            </div>

            {/* ── The Protocol (Horizontal Tabs/Sections) ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Section 1: What it covers */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                        <span className="w-4 h-[1px] bg-emerald-500" />
                        01 Scope
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">What it covers</h3>
                    <div className="space-y-2">
                        {template.rules.map((rule, i) => (
                            <div key={i} className="flex gap-3 text-xs text-neutral-400 leading-relaxed p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-colors">
                                <div className="text-emerald-500/40 font-mono text-[10px] pt-0.5">{String(i+1).padStart(2, '0')}</div>
                                <span>{rule.description}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 2: Why it's High Risk */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-[0.3em]">
                        <span className="w-4 h-[1px] bg-rose-500" />
                        02 Hazards
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Why it's High Risk</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                        Under Annex III, AI systems in {template.industry} are categorized as high-risk due to their potential to significantly impact fundamental rights, safety, or democratic processes.
                    </p>
                    <ul className="space-y-4 pt-2">
                        {[
                            { title: "Fundamental Rights", desc: "Decisions affect employment, healthcare, or legal standing." },
                            { title: "Safety Hazard", desc: "Failure could result in physical harm or infrastructure collapse." },
                            { title: "Non-Transparent", desc: "Black-box decisions in this sector are legally prohibited." }
                        ].map(hazard => (
                           <li key={hazard.title} className="flex items-start gap-3">
                               <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                               <div>
                                   <p className="text-[11px] font-black text-white uppercase tracking-wider">{hazard.title}</p>
                                   <p className="text-[10px] text-neutral-500 mt-0.5">{hazard.desc}</p>
                               </div>
                           </li> 
                        ))}
                    </ul>
                </div>

                {/* Section 3: Enforcement Mechanism */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">
                        <span className="w-4 h-[1px] bg-blue-500" />
                        03 Enforcement
                    </div>
                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">Mechanisms</h3>
                    <div className="bg-black/60 border border-white/10 rounded-2xl p-6 font-mono text-[10px] text-emerald-400/70 space-y-4 overflow-hidden relative group">
                        <div className="absolute top-2 right-4 text-[8px] text-neutral-700 font-black uppercase tracking-widest">Runtime Logic</div>
                        <pre className="whitespace-pre-wrap leading-relaxed">
                            {`// Sector Protocol Enforcement\n`}
                            {`if (detected_action === "${template.industry}") {\n`}
                            {`  apply_overrides(id: "${template.id}");\n`}
                            {`  enforce_human_gate(article: "Art. 14");\n`}
                            {`  log_immutable_audit(mode: "immutability_locked");\n`}
                            {`}`}
                        </pre>
                        <div className="pt-4 border-t border-white/5 space-y-2">
                             {Object.entries(template.overrides).slice(0, 4).map(([key, val]) => (
                                 <div key={key} className="flex justify-between items-center text-[9px]">
                                     <span className="text-neutral-500 uppercase">{key.replace(/([A-Z])/g, ' $1')}</span>
                                     <span className="text-emerald-500">{String(val)}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Detailed Checklist ── */}
            <section className="space-y-8 pt-12 border-t border-white/10">
                <div className="text-center space-y-2">
                    <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Conformity Verification</h2>
                    <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Legal Checklist</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { title: "Risk Management", ref: "Art. 9", status: "Baseline Enforced" },
                        { title: "Data Governance", ref: "Art. 10", status: "Baseline Enforced" },
                        { title: "Technical Documentation", ref: "Art. 11", status: "Annex IV Required" },
                        { title: "Record Keeping", ref: "Art. 12", status: "6-Month Min." },
                        { title: "Transparency", ref: "Art. 13", status: "Labeling Active" },
                        { title: "Human Oversight", ref: "Art. 14", status: "STOP Button Ready" }
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/5 rounded-2xl hover:border-emerald-500/20 transition-all group">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">{item.ref}</span>
                                <h4 className="text-sm font-black text-white uppercase italic tracking-tight">{item.title}</h4>
                            </div>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                        </div>
                    ))}
                </div>
            </section>

             {/* ── CTA Banner ── */}
             <div className="bg-gradient-to-r from-emerald-600 to-blue-700 p-[1px] rounded-[2.5rem] mt-20">
                 <div className="bg-black/90 backdrop-blur-xl rounded-[2.4rem] p-12 text-center space-y-6 relative overflow-hidden">
                     <div className="absolute inset-0 bg-emerald-500/5 pointer-events-none" />
                     <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                         Ready for <span className="text-emerald-500">Annex III</span> Compliance?
                     </h3>
                     <p className="text-neutral-400 text-sm max-w-xl mx-auto leading-relaxed font-medium">
                         Apply this {template.name} protocol to your agent fleet today and lock in your regulatory readiness.
                     </p>
                     <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                         <Button 
                             onClick={() => router.push("/dashboard/policies")}
                             className="h-14 px-10 bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:scale-105 transition-all"
                         >
                             Activate Now
                         </Button>
                         <Button variant="ghost" className="h-14 px-10 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:bg-white/5">
                             Download Whitepaper
                         </Button>
                     </div>
                 </div>
             </div>
        </div>
    );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
