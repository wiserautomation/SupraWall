// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { ArrowRight, Bot, Shield, Zap, Terminal, CheckCircle2, FileText, Lock } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import ClaudeClient from "./ClaudeClient";

export const metadata: Metadata = {
    title: "Security for Claude 3.5 Sonnet | Computer Use Guardrails | SupraWall",
    description: "Secure Claude with Anthropic Computer Use security. Prevent unauthorized clicks and type actions in autonomous desktop environments. EU AI Act compliant Article 14.",
    keywords: ["claude 3.5 sonnet security", "claude computer use guardrails", "anthropic agent security", "secure claude tool use", "eu ai act Claude"],
    alternates: {
        canonical: 'https://www.supra-wall.com/integrations/claude',
    },
};

export default function ClaudeIntegrationPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for Claude",
        "applicationCategory": "SecurityApplication",
        "url": "https://www.supra-wall.com/integrations/claude",
        "author": { "@type": "Organization", "name": "SupraWall" },
        "description": "The security layer for Anthropic Claude agents, specifically designed for Computer Use and high-trust tool execution swarms."
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-orange-500/30 font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden text-center">
                <div className="max-w-7xl mx-auto space-y-20 relative z-10">
                    <div className="space-y-10">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-[10px] font-black text-orange-400 tracking-[0.2em] uppercase mx-auto">
                            Model Ecosystem • Anthropic Optimized
                        </div>

                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            Secure the <br />
                            <span className="text-orange-500 text-7xl md:text-[10rem]">Claude</span> <br />
                            Computer.
                        </h1>

                        <div className="max-w-3xl mx-auto pt-10 text-center">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                Claude 3.5 Sonnet is the most capable model for autonomous desktop control.
                                SupraWall's specialized integration provides the security perimeter needed for high-trust computer use,
                                intercepting action sequences and validating OS-level intents before they are executed.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 pt-10">
                            <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all flex items-center gap-2 shadow-2xl">
                                Secure My Claude Agent <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto prose prose-invert prose-orange text-left space-y-20">
                        <section>
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mb-10 border-b border-white/10 pb-4">
                                Computer Use Governance
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed font-medium italic">
                                Anthropic's 'Computer Use' allows Claude to click and type on your machine. 
                                Without an independent security layer, a hijacked prompt could tell Claude to "delete the system partition" or "transfer files to a remote server".
                                SupraWall provides the **independent observer** that validates every OS action against a deterministic policy.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                {[
                                    { title: "OS Intention Interceptor", desc: "Monitors Claude's click/type plans before execution.", icon: Terminal },
                                    { title: "Network Gating", desc: "Prevents exfiltration in scripts during computer use.", icon: Lock },
                                    { title: "Human Review", desc: "Pause Claude before critical OS-level decisions.", icon: Shield },
                                    { title: "Auditability Trace", desc: "Detailed Article 12 compliance for autonomous desktop actions.", icon: FileText }
                                ].map((b, i) => (
                                    <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900 border border-white/5 space-y-4 hover:border-orange-500/30 transition-all">
                                        <b.icon className="w-8 h-8 text-orange-500 mb-2" />
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{b.title}</h3>
                                        <p className="text-neutral-500 text-xs leading-relaxed uppercase tracking-widest font-bold">{b.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-orange-500/5 p-12 rounded-[3.5rem] border border-orange-500/20">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white mb-6">
                                EU AI Act Compliance
                            </h2>
                            <p className="text-neutral-300 font-medium italic">
                                Claude's computer use feature is a textbook case of 'high-risk' AI capability under the EU AI Act. 
                                Articles 9, 11, and 14 mandate that such systems have **independent risk management and human oversight**.
                                SupraWall automates these regulatory requirements for your Anthropic-powered applications.
                            </p>
                        </section>

                        <section className="space-y-10">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white text-center">
                                Claude Integration Checklist
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Configure Claude Security Shim globally",
                                    "Define Allowed/Denied Domain and File Paths",
                                    "Enable Real-time Action Telemetry",
                                    "Set Human Approval for OS-Level Write commands",
                                    "Automate Compliance Evidence Export"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                                        <CheckCircle2 className="w-5 h-5 text-orange-500" />
                                        <span className="text-sm font-bold uppercase tracking-tight text-neutral-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <ClaudeClient />

                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-orange-600 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8 flex flex-col items-center">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none text-center">
                            Govern Your <br />Claude Swarm.
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">
                                Secure My App
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
