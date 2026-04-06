// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { ArrowRight, Database, Shield, Zap, Terminal, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import LlamaIndexClient from "./LlamaIndexClient";

export const metadata: Metadata = {
    title: "Security for LlamaIndex | Data-Aware Agent Governance | SupraWall",
    description: "Learn how to secure LlamaIndex agents and query engines. Runtime guardrails for RAG systems, preventing prompt injection and data leakage (EU AI Act Articles 11 & 12).",
    keywords: ["llamaindex security", "secure llamaindex agents", "rag guardrails", "llamaindex tool governance", "eu ai act RAG", "ai act compliance"],
    alternates: {
        canonical: 'https://www.supra-wall.com/integrations/llamaindex',
    },
};

export default function LlamaIndexIntegrationPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for LlamaIndex",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "url": "https://www.supra-wall.com/integrations/llamaindex",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "description": "Deterministic security and runtime guardrails for LlamaIndex RAG applications and agents.",
        "featureList": [
            "Data Retrieval Validation",
            "Tool Execution Governance",
            "Real-time RAG Visibility",
            "Human-in-the-loop Database Controls"
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden text-center">
                <div className="max-w-7xl mx-auto space-y-20 relative z-10">
                    <div className="space-y-10">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-[10px] font-black text-cyan-400 tracking-[0.2em] uppercase mx-auto">
                            Data Infrastructure • LlamaIndex Ecosystem
                        </div>

                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            Secure your <br />
                            <span className="text-cyan-500 text-7xl md:text-[10rem]">LlamaIndex</span> <br />
                            Data Swarm
                        </h1>

                        <div className="max-w-3xl mx-auto">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                LlamaIndex security starts with verifying data-aware tool calls at the runtime level.
                                SupraWall protects your RAG systems from prompt-injected data sources and unauthorized
                                tool execution, ensuring your indices stay private and your agents stay safe.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 pt-8">
                            <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-2 transform hover:scale-105 shadow-2xl">
                                Secure My Index <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto prose prose-invert prose-cyan text-left">
                        <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10">
                            RAG-Specific Security Layer
                        </h2>
                        <p className="text-lg text-neutral-400 leading-relaxed font-medium italic">
                            Unlike traditional LlamaIndex deployments that execute all retrieved tool calls blindly,
                            SupraWall sits as a shim between the agent and the environment. Every retrieval result
                            is scanned, and every tool execution is validated against your core security perimeter.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                            {[
                                { title: "Query Engine Guard", desc: "Monitors and intercepts SQL, Vector, and Summary queries.", icon: Database },
                                { title: "Tool Interceptor", desc: "Global shim for all LlamaIndex tool and function calls.", icon: Shield },
                                { title: "PII Scrubbing", desc: "Automatically redacts sensitive data from retrieval outputs.", icon: Terminal },
                                { title: "Token Caps", desc: "Enforce deterministic budget limits across large RAG clusters.", icon: Zap }
                            ].map((b, i) => (
                                <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900 border border-white/5 space-y-4 hover:border-cyan-500/30 transition-all">
                                    <b.icon className="w-8 h-8 text-cyan-500 mb-2" />
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{b.title}</h3>
                                    <p className="text-neutral-500 text-xs leading-relaxed uppercase tracking-widest font-bold">{b.desc}</p>
                                </div>
                            ))}
                        </div>

                        <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                            EU AI Act Compliance (RAG)
                        </h2>
                        <p className="text-lg text-neutral-400 mt-6 leading-relaxed">
                            Deploying LlamaIndex in production requires technical documentation (Article 11) and 
                            automatic logging (Article 12). SupraWall automates these requirements by providing 
                            tamper-proof audit logs for every data retrieval and tool execution session.
                        </p>

                        <div className="my-16 p-10 rounded-[2.5rem] bg-cyan-500/5 border border-cyan-500/20 flex items-start gap-8">
                            <div className="p-4 bg-cyan-500/10 rounded-2xl"><FileText className="w-8 h-8 text-cyan-400" /></div>
                            <p className="text-neutral-300 font-medium italic leading-relaxed">
                                SupraWall's <span className="text-cyan-400 italic font-bold uppercase">Technical Evidence Export</span> fulfills Article 11 mandates by generating a full risk-assessment log of every high-stakes autonomous tool call.
                            </p>
                        </div>

                        <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10 text-center">
                            Integration Checklist
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                "Enable LlamaIndex Callback Tracking",
                                "Set Budget Limits for Large Batch Jobs",
                                "Configure PII Redaction for Retrievals",
                                "Audit all Data Connectors / Read-Only",
                                "Enable Human-in-the-loop for Writes"
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500" />
                                    <span className="text-sm font-bold uppercase tracking-tight text-neutral-200">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <LlamaIndexClient />

                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-cyan-600 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8 text-center flex flex-col items-center">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Govern Your <br />Data Engine.
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1">
                                Secure My App
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
