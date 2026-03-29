// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { 
    Shield, 
    FileText, 
    Lock, 
    CheckCircle2, 
    Clock, 
    Database, 
    Scale,
    AlertCircle,
    ArrowRight
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "EU AI Act Audit Trail Requirements for AI Agents (Article 12)",
    description: "Technical guide to Article 12 of the EU AI Act. Learn the mandatory logging and traceability requirements for high-risk autonomous AI systems.",
    keywords: ["eu ai act audit trail", "article 12 ai act logging", "ai agent traceability", "high-risk ai audit requirements", "tamper-evident ai logs"],
    alternates: {
        canonical: "https://www.supra-wall.com/learn/eu-ai-act-audit-trail",
    },
};

export default function EuAiActAuditTrailPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "EU AI Act Audit Trail Requirements for AI Agents (Article 12)",
        description: "Technical guide to Article 12 of the EU AI Act. Learn the mandatory logging and traceability requirements for high-risk autonomous AI systems.",
        author: {
            "@type": "Organization",
            name: "SupraWall",
        },
        datePublished: "2026-03-29",
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-24">
                    
                    {/* Hero */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                            Article 12 • Traceability
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
                            EU AI Act <br />
                            <span className="text-emerald-500">Audit Trails.</span>
                        </h1>
                        <p className="text-2xl font-black tracking-tighter uppercase italic text-neutral-500 mt-2">
                            Mandatory Logging for High-Risk Agents
                        </p>
                    </div>

                    {/* Article 12 Summary */}
                    <div className="bg-neutral-900 border border-white/5 rounded-[3rem] p-12 space-y-8">
                        <h2 className="text-3xl font-black italic uppercase tracking-tight flex items-center gap-4">
                            <Scale className="w-8 h-8 text-emerald-500" />
                            Understanding Article 12
                        </h2>
                        <p className="text-neutral-400 text-lg leading-relaxed font-medium">
                            Article 12 of the EU AI Act mandates that high-risk AI systems must be designed and developed with capabilities enabling the **automatic recording of events ('logs')** while the system is operating. For autonomous agents, this isn't just about console logs—it's about a verifiable record of every decision and action taken by the model.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { title: "Traceability", desc: "Logs must enable the tracking of the system's operation and results during its entire lifecycle." },
                                { title: "Auditability", desc: "Competent authorities must be able to use these logs to verify compliance with legal requirements." }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 p-8 rounded-3xl space-y-3">
                                    <p className="text-white font-black uppercase text-sm">{item.title}</p>
                                    <p className="text-neutral-500 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Key Requirements List */}
                    <section className="space-y-10">
                        <h2 className="text-4xl font-black italic uppercase tracking-tight">The Article 12 Checklist</h2>
                        <div className="space-y-4">
                            {[
                                {
                                    requirement: "Recording of identification and duration",
                                    detail: "Record each period of use and the identity of the person/agent responsible."
                                },
                                {
                                    requirement: "Recording of input data",
                                    detail: "Log the prompt or data context that triggered the decision process."
                                },
                                {
                                    requirement: "Recording of output data",
                                    detail: "Log the specific tool calls and responses returned by the system."
                                },
                                {
                                    requirement: "Tamper-resistance",
                                    detail: "Logs must be stored in a way that prevents retroactive modification or deletion."
                                }
                            ].map((check, i) => (
                                <div key={i} className="flex gap-6 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/20 transition-all">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-1" />
                                    <div className="space-y-1">
                                        <p className="text-white font-black uppercase tracking-tight">{check.requirement}</p>
                                        <p className="text-neutral-500 font-medium leading-relaxed">{check.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Technical Implementation Section */}
                    <div className="space-y-10">
                        <h2 className="text-4xl font-black italic uppercase tracking-tight text-right">Technical Implementation</h2>
                        <div className="p-10 rounded-[3rem] bg-neutral-900 border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.05)] space-y-10">
                            <p className="text-neutral-300 text-lg leading-relaxed font-medium italic border-l-4 border-emerald-500 pl-8 py-2">
                                For most LangChain or Vercel AI SDK deployments, developers rely on local logging (console.log) or simple database rows. These do not satisfy Article 12's requirement for a tamper-evident chain of custody.
                            </p>
                            
                            <div className="space-y-6">
                                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">SupraWall Cryptographic Audit Log</p>
                                <div className="bg-black rounded-2xl p-8 font-mono text-sm leading-relaxed overflow-x-auto text-emerald-400/80">
                                    <pre>{`{
  "event_id": "evt_8f29c...",
  "timestamp": "2026-03-29T09:15:01Z",
  "agent_id": "support-bot-v2",
  "action": "DATABASE_FETCH",
  "arguments": { "query": "SELECT * FROM users WHERE..." },
  "policy_evaluation": "ALLOW",
  "context": "Customer requested PII check",
  "integrity_hash": "sha256:d8a1c9e3..." // Verifiable signature
}`}</pre>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Critical Warning */}
                    <div className="p-12 rounded-[3.5rem] bg-rose-500/5 border border-rose-500/20 flex flex-col md:flex-row items-center gap-10">
                        <AlertCircle className="w-16 h-16 text-rose-500 flex-shrink-0" />
                        <div className="space-y-4">
                            <h3 className="text-xl font-black uppercase text-white">The Compliance Gap</h3>
                            <p className="text-neutral-400 font-medium leading-relaxed">
                                Simply storing logs in your own PostgreSQL database is often insufficient for Article 12 audits because the data can be manually altered by anyone with DB access. SupraWall provides a **Cryptographically Signed Audit Rail** that proves to auditors exactly what happened, when, and by whom.
                            </p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-24 p-16 rounded-[4rem] bg-emerald-600 text-center space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white leading-[0.9]">
                            Get Audit-Ready<br />In Minutes.
                        </h2>
                        <p className="text-emerald-100 font-medium text-lg max-w-xl mx-auto italic">
                            SupraWall satisfies Articles 9, 12, and 14 of the EU AI Act out of the box. No manual logging infrastructure required.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                            <Link
                                href="/beta"
                                className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-3xl hover:bg-neutral-100 transition-all shadow-2xl"
                            >
                                Start Compliance Audit <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-800 text-[10px] font-black uppercase tracking-[0.5em]">
                    Enterprise Compliance Architecture • 2026
                </p>
            </footer>
        </div>
    );
}
