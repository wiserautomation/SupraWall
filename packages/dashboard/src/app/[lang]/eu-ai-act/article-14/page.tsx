// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Navbar } from "@/components/Navbar";
import { Shield, CheckCircle2, ArrowRight, UserCheck, Eye, Scale } from "lucide-react";
import Link from "next/link";

export default function Article14Page() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What does EU AI Act Article 14 require for human oversight?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Article 14 requires high-risk AI systems to be designed so that natural persons can effectively oversee them during use. This includes the ability to understand system capabilities, monitor operations, interpret outputs, and intervene or halt the system at any time.",
                },
            },
            {
                "@type": "Question",
                name: "How do you implement human-in-the-loop for AI agents?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "SupraWall implements human-in-the-loop by intercepting high-risk tool calls with a REQUIRE_APPROVAL policy. When an agent attempts a sensitive action, execution pauses and a human reviewer receives a notification with full context to approve or deny the action.",
                },
            },
            {
                "@type": "Question",
                name: "What is automation bias and how does Article 14 address it?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Automation bias is the tendency for humans to over-rely on AI system outputs. Article 14 requires systems to provide tools that help overseers correctly interpret outputs and maintain appropriate skepticism, preventing blind trust in autonomous agent decisions.",
                },
            },
            {
                "@type": "Question",
                name: "Can AI agents operate autonomously under the EU AI Act?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "High-risk AI agents can operate autonomously for low-risk actions, but Article 14 requires human oversight mechanisms for significant decisions. SupraWall enables this with tiered policies: ALLOW for routine actions, REQUIRE_APPROVAL for high-risk ones.",
                },
            },
            {
                "@type": "Question",
                name: "What is the stop button requirement in Article 14?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Article 14 requires the capability to intervene in or interrupt AI system operation through a stop mechanism. For AI agents, this means an immediate kill-switch that halts all agent actions, revokes active tool permissions, and logs the intervention.",
                },
            },
        ],
    };

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "EU AI Act Article 14: Human Oversight Requirements for AI Agents",
        description: "Complete guide to implementing human oversight for autonomous AI agents under EU AI Act Article 14.",
        author: { "@type": "Organization", name: "SupraWall" },
        publisher: { "@type": "Organization", name: "SupraWall" },
        mainEntityOfPage: "https://www.supra-wall.com/eu-ai-act/article-14",
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />
            
            <main className="pt-32 pb-20 px-6">
                <article className="max-w-4xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            EU AI Act Compliance
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
                            Article 14: <span className="text-emerald-500 text-glow">Human Oversight</span>
                        </h1>
                        <p className="text-xl text-neutral-400 font-medium leading-relaxed italic">
                            Implementing high-level human clinical and technical oversight for autonomous AI systems under the European AI Act.
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-y border-white/5">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <UserCheck className="text-emerald-500 w-6 h-6" />
                                Requirements
                            </h2>
                            <p className="text-neutral-400 leading-relaxed">
                                Article 14 requires that high-risk AI systems be designed and developed in such a way that they can be effectively overseen by natural persons during the period in which the AI system is in use.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Shield className="text-emerald-500 w-6 h-6" />
                                Our Solution
                            </h2>
                            <p className="text-neutral-400 leading-relaxed">
                                SupraWall's <strong>Human-in-the-Loop Protocol</strong> provides a deterministic bridge between autonomous agents and human controllers, ensuring every high-risk tool execution requires explicit authorization.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-3xl font-black uppercase italic tracking-tight">Key Provisions of Article 14</h3>
                        <div className="space-y-6">
                            {[
                                {
                                    title: "Preventing Automation Bias",
                                    desc: "Tools to help overseers correctly interpret the system's output and avoid over-reliance on automated decisions."
                                },
                                {
                                    title: "Emergency Intervention",
                                    desc: "Capability to intervene in the operation of the AI system or interrupt the system through a 'stop' button or similar procedure."
                                },
                                {
                                    title: "Operational Control",
                                    desc: "Ensuring overseers fully understand the capacities and limitations of the high-risk AI system."
                                }
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 flex gap-6 group hover:border-emerald-500/30 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold shrink-0">
                                        {i + 1}
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">{item.title}</h4>
                                        <p className="text-neutral-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="space-y-8">
                        <h2 className="text-3xl font-black uppercase italic tracking-tight">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {faqSchema.mainEntity.map((faq: any, i: number) => (
                                <details key={i} className="group p-6 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-emerald-500/20 transition-colors">
                                    <summary className="text-lg font-bold text-white cursor-pointer list-none flex items-center justify-between">
                                        {faq.name}
                                        <span className="text-emerald-500 group-open:rotate-45 transition-transform text-2xl">+</span>
                                    </summary>
                                    <p className="mt-4 text-neutral-400 leading-relaxed">{faq.acceptedAnswer.text}</p>
                                </details>
                            ))}
                        </div>
                    </div>

                    {/* Related Articles */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase italic tracking-tight">Related Articles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link href="/learn/human-in-the-loop-ai-agents" className="group p-6 rounded-2xl bg-white/[0.05] border border-white/5 hover:border-emerald-500/30 transition-all">
                                <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Human-in-the-Loop for AI Agents</h4>
                                <p className="text-sm text-neutral-500 mt-2">Complete implementation guide for HITL agent workflows.</p>
                            </Link>
                            <Link href="/eu-ai-act/article-12" className="group p-6 rounded-2xl bg-white/[0.05] border border-white/5 hover:border-emerald-500/30 transition-all">
                                <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Article 12: Record-Keeping</h4>
                                <p className="text-sm text-neutral-500 mt-2">Automated audit logging for EU AI Act compliance.</p>
                            </Link>
                            <Link href="/learn/eu-ai-act-compliance-ai-agents" className="group p-6 rounded-2xl bg-white/[0.05] border border-white/5 hover:border-emerald-500/30 transition-all">
                                <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">EU AI Act Compliance for AI Agents</h4>
                                <p className="text-sm text-neutral-500 mt-2">Full compliance guide covering Articles 9, 12, and 14.</p>
                            </Link>
                            <Link href="/learn/eu-ai-act-august-2026-deadline" className="group p-6 rounded-2xl bg-white/[0.05] border border-white/5 hover:border-emerald-500/30 transition-all">
                                <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">EU AI Act August 2026 Deadline</h4>
                                <p className="text-sm text-neutral-500 mt-2">5-month compliance roadmap for the August 2 deadline.</p>
                            </Link>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="p-12 rounded-[2.5rem] bg-gradient-to-br from-emerald-600 to-emerald-800 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic">
                                Ready for Compliance?
                            </h3>
                            <p className="text-emerald-100/80 font-medium">
                                Download our technical whitepaper on Article 14 implementation.
                            </p>
                        </div>
                        <Link 
                            href="/login" 
                            className="px-8 py-4 bg-white text-black font-black uppercase tracking-tighter rounded-xl hover:scale-105 transition-transform flex items-center gap-2 relative z-10"
                        >
                            Get Started <ArrowRight className="w-5 h-5" />
                        </Link>
                        {/* Background Decoration */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                    </div>
                </article>
            </main>
        </div>
    );
}
