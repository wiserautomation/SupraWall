// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { ArrowRight, Bot, Shield, Zap, Terminal, Code2, Layers, Cpu, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import AutoGenClient from "./AutoGenClient";

export const metadata: Metadata = {
    title: "Secure Microsoft AutoGen Agents | SupraWall Governance",
    description: "Enterprise security and runtime guardrails for Microsoft AutoGen loops. Prevent dangerous code execution, ensure data privacy, and maintain EU AI Act compliance.",
    keywords: ["autogen agent policy", "secure microsoft autogen", "autogen code execution security", "multi-agent security governance", "eu ai act autogen"],    alternates: {
        canonical: 'https://www.supra-wall.com/integrations/autogen',
    },

};

export default function AutoGenIntegrationPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for AutoGen",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "url": "https://www.supra-wall.com/integrations/autogen",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "description": "Runtime security and conversation auditing for Microsoft AutoGen multiple agent systems.",
        "featureList": [
            "Autonomous Code Interception",
            "Infinite Loop Detection",
            "Inter-Agent Message Auditing",
            "Token Usage Cap Enforcement"
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How do you secure code execution in Microsoft AutoGen?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SupraWall intercepts the code proposed by an AutoGen AssistantAgent before the UserProxy executes it. It applies regex filters and logic-based policies to ensure the agent doesn't run destructive commands."
                }
            },
            {
                "@type": "Question",
                "name": "Can SupraWall prevent infinite loops in AutoGen?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. SupraWall monitors the conversation turn count and content repetition. It acts as a circuit breaker, halting the orchestration if it detects an unproductive infinite loop that would otherwise waste tokens."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-12 space-y-10 relative z-10 text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-[10px] font-black text-purple-400 tracking-[0.2em] uppercase mx-auto">
                            Agentic Orchestration • Microsoft AutoGen Official
                        </div>

                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            Govern the <br />
                            <span className="text-purple-500 text-7xl md:text-[10rem]">AutoGen</span> <br />
                            Loop.
                        </h1>

                        <div className="max-w-3xl mx-auto">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                Microsoft AutoGen agent policy is a critical requirement for production multi-agent systems.
                                By adding a specialized security shim, developers can audit the high-frequency conversation loops between agents,
                                preventing emergent behavior like infinite "self-correction" loops and unauthorized code execution in the UserProxy.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 pt-8">
                            <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-2">
                                Secure My Agents <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-12">
                        <div className="max-w-4xl mx-auto prose prose-invert prose-purple">

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                Transparent Code Guard for AssistantAgents
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6 font-medium leading-relaxed">
                                AutoGen's greatest strength—its ability to write and run code—is also its greatest security risk.
                                SupraWall's <Link href="/learn/what-is-agent-runtime-security" className="text-purple-500 underline">runtime security protocol</Link>
                                intercepts the code output before the UserProxy can execute it, analyzing it for destructive patterns and potential
                                data exfiltration commands.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                {benefits.map((b, i) => (
                                    <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900 border border-white/5 space-y-4">
                                        <b.icon className="w-8 h-8 text-purple-500 mb-2" />
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{b.title}</h3>
                                        <p className="text-neutral-500 text-xs leading-relaxed uppercase tracking-widest font-bold">{b.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                Breaking the Infinite Error Loop
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6 font-medium leading-relaxed">
                                Multi-agent systems often get stuck in loops where agents pass errors back and forth (e.g., failed imports or syntax errors),
                                exhausting credit limits without making progress. SupraWall's governance engine monitors conversation
                                topological complexity and breaks these loops automatically to protect your budget.
                            </p>

                            <div className="my-16 p-10 rounded-[2.5rem] bg-purple-500/5 border border-purple-500/20 space-y-8">
                                <div className="flex items-center gap-4 text-purple-400">
                                    <FileText className="w-8 h-8" />
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight">EU AI Act Compliance</h3>
                                </div>
                                <p className="text-neutral-300 font-medium italic">
                                    Microsoft AutoGen's autonomous nature makes it "High-Risk" under the EU AI Act if used in enterprise decision-making. SupraWall provides the mandatory <span className="text-purple-400">Human Oversight (Article 14)</span> and <span className="text-purple-400">Risk Management (Article 9)</span> layers needed for certified compliance.
                                </p>
                            </div>

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10">
                                Integration Guide
                            </h2>
                            <div className="space-y-4">
                                {[
                                    "Initialize SupraWall SDK with AutoGen context",
                                    "Wrap the AssistantAgent and UserProxy executors",
                                    "Define script execution constraints (e.g., no internet for scripts)",
                                    "Configure maximum conversation turns before auto-termination",
                                    "Enable real-time Slack/Discord alerts for policy violations"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                                        <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                        <span className="text-sm font-bold uppercase tracking-tight text-neutral-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <AutoGenClient />

                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-purple-600 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Ready to secure <br />your agents?
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1">
                                Secure My Loop
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const benefits = [
    { title: "Code Guard", desc: "Hardened interception for autonomous script execution in the UserProxy.", icon: Code2 },
    { title: "Loop Detection", desc: "Heuristic monitoring to prevent costly infinite conversation loops.", icon: Zap },
    { title: "Audit Trail", desc: "Comprehensive logging of inter-agent messages for later forensic review.", icon: Bot },
    { title: "Role Policy", desc: "Assign different security contexts to agents based on their functional role.", icon: Layers }
];
