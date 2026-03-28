// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { ArrowRight, CreditCard, Shield, Zap, DollarSign, CheckCircle2, FileText, Lock } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import StripeClient from "./StripeClient";

export const metadata: Metadata = {
    title: "Security for Stripe AI Agents | Financial Data Guardrails | SupraWall",
    description: "Secure Stripe-enabled AI agents with deterministic financial guardrails. Prevent unauthorized refunds, set hard budget caps, and maintain EU AI Act Article 9 compliance.",
    keywords: ["stripe agent security", "secure stripe tools", "financial AI guardrails", "prevent unauthorized charges", "eu ai act financial agents"],
    alternates: {
        canonical: 'https://www.supra-wall.com/integrations/stripe',
    },
};

export default function StripeIntegrationPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for Stripe",
        "applicationCategory": "SecurityApplication",
        "url": "https://www.supra-wall.com/integrations/stripe",
        "author": { "@type": "Organization", "name": "SupraWall" },
        "description": "Enterprise-grade financial security guardrails for autonomous agents using the Stripe API."
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden text-center">
                <div className="max-w-7xl mx-auto space-y-20 relative z-10">
                    <div className="space-y-10">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase mx-auto">
                            Financial Ecosystem • Stripe Official
                        </div>

                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            Secure your <br />
                            <span className="text-blue-500 text-7xl md:text-[10rem]">Financial</span> <br />
                            Agents.
                        </h1>

                        <div className="max-w-3xl mx-auto pt-10 text-center">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                Stripe tool security is not a suggestion—it's a requirement for agents that handle money.
                                SupraWall provides a deterministic perimeter between the LLM and the Stripe API, enforcing
                                hard caps on transaction amounts and requiring human approval for sensitive financial actions.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 pt-10">
                            <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all flex items-center gap-2 shadow-2xl">
                                Secure My Stripe Flow <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto prose prose-invert prose-blue text-left space-y-20">
                        <section>
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mb-10 border-b border-white/10 pb-4">
                                Zero-Trust for Global Finance
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed font-medium italic">
                                Prompt injection is dangerous, but in a financial context, it can be catastrophic. 
                                Agents tasked with "managing customer subscriptions" could be manipulated into issuing mass refunds.
                                SupraWall blocks this at the runtime level. Any 'refund' action without a matching security policy is blocked BEFORE reaching Stripe.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                {[
                                    { title: "Amount Caps", desc: "Hard ceilings on charges per agent session.", icon: DollarSign },
                                    { title: "Refund Approval", desc: "Mandatory human-in-the-loop for reversals.", icon: Lock },
                                    { title: "Fraud Shimming", desc: "Real-time analysis of charge metadata intent.", icon: Shield },
                                    { title: "Compliance Reports", desc: "Detailed Article 12 audit logs for all transactions.", icon: FileText }
                                ].map((b, i) => (
                                    <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900 border border-white/5 space-y-4 hover:border-blue-500/30 transition-all">
                                        <b.icon className="w-8 h-8 text-blue-500 mb-2" />
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{b.title}</h3>
                                        <p className="text-neutral-500 text-xs leading-relaxed uppercase tracking-widest font-bold">{b.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="bg-blue-500/5 p-12 rounded-[3.5rem] border border-blue-500/20">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white mb-6">
                                EU AI Act Article 9 (Risk Management)
                            </h2>
                            <p className="text-neutral-300 font-medium italic">
                                For financial agents, Articles 9 and 14 of the EU AI Act require deterministic risk mitigation systems.
                                SupraWall automates this compliance by standing as your **independent technical oversight layer**,
                                ensuring you can prove to regulators exactly who approved which financial action and why.
                            </p>
                        </section>

                        <section className="space-y-10">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white text-center">
                                Integration Checklist
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Initialize Stripe Guard on Tool Definition",
                                    "Set Hard-Coded Transaction Limits",
                                    "Configure Wait-Time between charge attempts",
                                    "Enable Slack Approvals for Refund Actions",
                                    "Export Audit Logs to Compliance Dashboard"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm font-bold uppercase tracking-tight text-neutral-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>

                <StripeClient />

                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-indigo-600 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8 flex flex-col items-center">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none text-center">
                            Govern Your <br />Financial Swarm.
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
