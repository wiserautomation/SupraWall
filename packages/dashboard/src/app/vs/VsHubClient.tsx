// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { 
    Zap, ShieldCheck, ArrowRight, Layers, 
    X, Check, Lock, ShieldAlert, Cpu, Globe
} from "lucide-react";
import Link from "next/link";
import { TagBadge } from "../HomeClient";

const VS_CARDS = [
    {
        title: "Lakera",
        href: "/vs/lakera",
        desc: "Probabilistic prompt-based guardrails vs SDK-level deterministic interception.",
        pill: "LLM Safety",
        pros: ["SDK Enforced", "Vault Integration", "Budget Circuit Breakers"]
    },
    {
        title: "Galileo",
        href: "/vs/galileo",
        desc: "Monitoring & Observability vs Real-time, SDK-enforced policy boundaries.",
        pill: "Observability",
        pros: ["Signed Audit Trail", "Interception API", "Human Oversight"]
    },
    {
        title: "NeMo Guardrails",
        href: "/vs/nemo-guardrails",
        desc: "Colang-based logic in the context window vs External binary enforcement.",
        pill: "Framework",
        pros: ["No Context Leak", "Zero Passivity", "Immutable Policy"]
    },
    {
        title: "Guardrails AI",
        href: "/vs/guardrails-ai",
        desc: "Structured output validation vs Total agentic runtime security.",
        pill: "Validation",
        pros: ["Action Shield", "Cost Control", "Art. 12 Logs"]
    },
    {
        title: "Portkey",
        href: "/vs/portkey",
        desc: "AI Gateways focused on traffic vs Security layers focused on agent actions.",
        pill: "Gateway",
        pros: ["Sub-ms Latency", "PII Scrubbing", "Local Execution"]
    },
    {
        title: "Straiker",
        href: "/vs/straiker",
        desc: "Automated agent testing vs Real-time agentic tool interception.",
        pill: "Testing",
        pros: ["Production Ready", "SDK Injection", "EU AI Act Ready"]
    }
];

export default function VsHubClient() {
    return (
        <main className="overflow-hidden bg-[#030303]">
            {/* 🚀 HERO */}
            <section className="relative pt-48 pb-32 px-6 border-b border-white/5">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] opacity-10 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-blue-500/20 blur-[180px] rounded-full" />
                </div>

                <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                    <TagBadge>The Deterministic Edge</TagBadge>
                    <div className="space-y-6">
                        <h1 className="text-6xl md:text-[90px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow">
                             Stop Guessing. <br />
                             <span className="text-blue-500 font-bold italic underline decoration-white/10 italic font-bold">Start Intercepting.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 max-w-4xl mx-auto leading-relaxed font-medium italic">
                             There are two ways to secure an AI agent: asking it to be safe (Probabilistic) or forcing it to be safe (Deterministic). SupraWall is the latter.
                        </p>
                    </div>
                </div>
            </section>

             {/* 🎯 COMPARISON GRID */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {VS_CARDS.map((art, i) => (
                        <div 
                             key={art.href} 
                             className="p-1.5 bg-neutral-900/40 border border-white/5 rounded-[4rem] group hover:border-blue-500/30 transition-all shadow-2xl overflow-hidden shadow-glow-blue-slow"
                        >
                            <div className="bg-black/40 rounded-[3.5rem] p-12 space-y-8 flex flex-col md:flex-row gap-10">
                                <div className="space-y-6 flex-1">
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 w-fit text-[10px] font-black uppercase tracking-widest">{art.pill}</div>
                                    <h3 className="text-4xl font-black italic uppercase italic tracking-tighter leading-none group-hover:text-blue-400 transition-colors uppercase italic">SupraWall vs. <br />{art.title}</h3>
                                    <p className="text-neutral-500 text-base font-bold italic tracking-tighter leading-relaxed uppercase opacity-80">{art.desc}</p>
                                    <Link href={art.href} className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-xs hover:gap-4 transition-all">
                                        DETAILED SHOWDOWN <ArrowRight className="w-4 h-4 text-blue-500" />
                                    </Link>
                                </div>

                                <div className="space-y-4 md:w-1/3">
                                     <div className="text-[10px] font-black uppercase italic tracking-widest bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg w-fit mb-4">Winner: SupraWall</div>
                                     {art.pros.map(pro => (
                                         <div key={pro} className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-tight italic">
                                            <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]"><Check className="w-2 h-2" /></div>
                                            {pro}
                                         </div>
                                     ))}
                                      <div className="flex items-center gap-2 text-[10px] font-bold text-rose-500/30 uppercase tracking-tight italic line-through">
                                            <div className="p-1 rounded-full bg-rose-500/5 text-rose-500/20"><X className="w-2 h-2" /></div>
                                            Probabilistic Vibes
                                      </div>
                                </div>
                            </div>
                        </div>
                   ))}
                </div>
            </section>

             {/* 🎯 HEAD-TO-HEAD TABLE */}
             <section className="py-24 px-6 bg-[#030303]">
                <div className="max-w-5xl mx-auto space-y-16">
                    <div className="text-center space-y-6">
                        <TagBadge>Direct Comparison</TagBadge>
                        <h2 className="text-5xl font-black italic uppercase tracking-tighter">Probabilistic vs. <span className="text-blue-500">Deterministic</span></h2>
                    </div>

                    <div className="bg-neutral-900/40 border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl shadow-glow-blue-slow">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-neutral-500 italic">Security Metric</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-white italic">Alternative Platforms</th>
                                    <th className="p-8 text-[10px] font-black uppercase tracking-widest text-blue-500 italic bg-blue-500/5">SupraWall SDK</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { metric: "Primary Defense", alt: "LLM Guardrails (Probabilistic)", supra: "SDK Interception (Deterministic)" },
                                    { metric: "Security Perimeter", alt: "Prompt Context Window", supra: "Binary Runtime Layer" },
                                    { metric: "Secret Protection", alt: "Zero (Agents access keys)", supra: "Vault Injection (Key-less agents)" },
                                    { metric: "Compliance Proof", alt: "Standard Logs", supra: "RSA-Signed Evidence Reports" },
                                    { metric: "Risk Of Override", alt: "High (Jailbreaking)", supra: "Zero (Bypassing logic impossible)" }
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-8 text-sm font-black italic text-neutral-400 uppercase tracking-tighter">{row.metric}</td>
                                        <td className="p-8 text-sm font-bold italic text-neutral-500 uppercase tracking-tighter">{row.alt}</td>
                                        <td className="p-8 text-sm font-black italic text-blue-400 uppercase tracking-tighter bg-blue-500/[0.02]">{row.supra}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
             </section>

             {/* 🎯 FAQ SECTION */}
             <section className="py-40 px-6 bg-black relative border-y border-white/5">
                <div className="max-w-4xl mx-auto space-y-16 relative z-10">
                    <div className="text-center space-y-6">
                        <TagBadge>Questions & Answers</TagBadge>
                        <h2 className="text-5xl font-black italic uppercase tracking-tighter">Still Unsure?</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { q: "Is SupraWall just another LLM Guardrail?", a: "No. Guardrails rely on asking the LLM to behave. SupraWall is an SDK-level interceptor that enforces hard rules regardless of what the LLM wants." },
                            { q: "Can I use SupraWall with LangChain?", a: "Yes. SupraWall integrates with one line of code into LangChain, CrewAI, and every major framework." },
                            { q: "Does it add latency to tool calls?", a: "Minimal. Policy checks are performed locally on your node, typically adding <10ms to the total tool execution time." },
                            { q: "Is there a free tier for developers?", a: "Yes. Our Community SDK is free for single-agent deployments and research use." }
                        ].map((item, i) => (
                            <details key={i} className="group p-8 rounded-[2rem] bg-neutral-900/40 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer">
                                <summary className="list-none flex justify-between items-center text-xl font-black italic uppercase tracking-tighter text-white group-open:text-blue-500 transition-colors">
                                    {item.q}
                                    <ArrowRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                                </summary>
                                <p className="mt-4 text-neutral-500 font-bold uppercase italic tracking-tight leading-relaxed">{item.a}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
