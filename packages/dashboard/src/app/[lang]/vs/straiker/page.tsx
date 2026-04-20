// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { Metadata } from "next";
import StraikerClient from "./StraikerClient";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Check, X } from "lucide-react";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        title: "SupraWall vs Straiker | Developer-First Agent Security",
        description: "SupraWall vs Straiker: self-serve one-line integration vs enterprise sales-led. Compare runtime security features, developer experience, vault support, and EU AI Act compliance.",
        keywords: [
            "suprawall vs straiker",
            "straiker alternative",
            "agent runtime security comparison",
            "straiker guardrails comparison",
        ],
        internalPath: "vs/straiker"
    });
}

export default function vsStraikerPage() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "How is SupraWall different from Straiker?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "SupraWall is developer-first with self-serve onboarding and one-line framework integrations. Straiker targets enterprise buyers with a sales-led model. SupraWall also includes a built-in secret vault and MCP server security that Straiker doesn't offer.",
                },
            },
            {
                "@type": "Question",
                name: "Is Straiker open source?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "No. Straiker is a closed-source commercial product. SupraWall publishes its Agent Governance Protocol Specification (AGPS) as an open standard.",
                },
            },
            {
                "@type": "Question",
                name: "Which is easier to get started with?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "SupraWall: pip install suprawall-sdk, wrap your agent, start enforcing policies in under 5 minutes. Straiker requires a sales conversation before you can test it.",
                },
            },
        ],
    };

    const comparisonData = [
        {
            feature: "Developer Self-Serve",
            suprawall: true,
            straiker: false,
            note: "Straiker requires enterprise sales engagement to get started.",
        },
        {
            feature: "One-Line Integration",
            suprawall: true,
            straiker: false,
            note: "SupraWall: pip install suprawall-sdk + protect(agent). Straiker requires custom instrumentation.",
        },
        {
            feature: "Framework-Native SDKs",
            suprawall: "LangChain, CrewAI, AutoGen, PydanticAI",
            straiker: "Limited",
            note: "SupraWall has maintained native integrations per framework.",
        },
        {
            feature: "Built-in Secret Vault",
            suprawall: true,
            straiker: false,
            note: "Straiker has no native vault — you manage credentials yourself.",
        },
        {
            feature: "Human-in-the-Loop",
            suprawall: true,
            straiker: true,
            note: "Both support HITL; SupraWall integrates with Slack natively.",
        },
        {
            feature: "EU AI Act Compliance",
            suprawall: true,
            straiker: true,
            note: "Both address EU AI Act; SupraWall provides downloadable PDF evidence exports.",
        },
        {
            feature: "Pricing Transparency",
            suprawall: true,
            straiker: false,
            note: "SupraWall publishes pricing; Straiker is quote-only.",
        },
        {
            feature: "Open Protocol (AGPS)",
            suprawall: true,
            straiker: false,
            note: "SupraWall publishes the Agent Governance Protocol Specification.",
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto space-y-20">

                    {/* Hero Section */}
                    <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-1000">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase mx-auto">
                            Head-to-Head Comparison
                        </div>

                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            SupraWall vs <br />
                            <span className="text-neutral-500">Straiker</span>
                        </h1>

                        <div className="max-w-3xl mx-auto">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                Straiker needs a sales call. SupraWall needs five minutes. Both enforce agent security at runtime,
                                but only one is built for developers who ship fast — with native LangChain, CrewAI, AutoGen and
                                PydanticAI integrations, a built-in secret vault, and transparent public pricing.
                            </p>
                        </div>
                    </div>

                    {/* Comparison Table */}
                    <div className="space-y-8 mt-24">
                        <div className="flex items-center gap-3">
                            <BarChart3 className="w-8 h-8 text-emerald-500" />
                            <h2 className="text-4xl font-black uppercase italic tracking-tight">Technical Breakdown</h2>
                        </div>
                        <div className="overflow-x-auto rounded-[2.5rem] border border-white/5 bg-white/[0.01] p-1">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.05]">
                                        <th className="p-8 font-black uppercase tracking-widest text-neutral-500">Feature</th>
                                        <th className="p-8 font-black uppercase tracking-widest text-neutral-500">Straiker</th>
                                        <th className="p-8 font-black uppercase tracking-widest text-emerald-500">SupraWall</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.05] transition-colors group">
                                            <td className="p-8 font-bold text-neutral-300 text-lg uppercase italic tracking-tighter">{row.feature}</td>
                                            <td className="p-8">
                                                {row.straiker === true ? (
                                                    <Check className="w-6 h-6 text-emerald-500" />
                                                ) : row.straiker === false ? (
                                                    <X className="w-6 h-6 text-rose-900" />
                                                ) : (
                                                    <span className="text-neutral-500 font-bold">{row.straiker}</span>
                                                )}
                                            </td>
                                            <td className="p-8 bg-emerald-500/[0.02]">
                                                {row.suprawall === true ? (
                                                    <Check className="w-6 h-6 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
                                                ) : row.suprawall === false ? (
                                                    <X className="w-6 h-6 text-rose-500" />
                                                ) : (
                                                    <span className="text-emerald-500 font-black text-lg">{row.suprawall}</span>
                                                )}
                                                <p className="text-[10px] text-neutral-500 mt-2 font-bold uppercase tracking-widest leading-relaxed">{row.note}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="lg:col-span-12">
                        <div className="max-w-4xl mx-auto prose prose-invert prose-emerald">

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-12">
                                Why developer experience is a security feature
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6 leading-relaxed">
                                When security tooling requires a sales call before you can test it, developers route around it.
                                SupraWall's{" "}
                                <Link href="/learn/what-is-agent-runtime-security" className="text-emerald-500 underline">
                                    SDK-level interception
                                </Link>{" "}
                                is harder to bypass than application-layer guardrails because it hooks directly into framework
                                callbacks — below the layer where developers typically write custom instrumentation. One decorator.
                                Zero proxies. Full policy enforcement from day one.
                            </p>

                            <div className="bg-neutral-900 rounded-[2.5rem] p-12 border border-white/5 mt-16 space-y-6">
                                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white">The Verdict</h3>
                                <p className="text-neutral-400 leading-relaxed font-medium">
                                    If your procurement process demands enterprise contracts and custom integrations,{" "}
                                    <strong className="text-white">Straiker</strong> may fit your buying motion. If your team
                                    ships code and wants runtime agent security running in production this week — with a
                                    built-in vault, open AGPS protocol, Slack-native HITL approvals, and transparent pricing —
                                    choose <strong className="text-emerald-500 uppercase italic">SupraWall</strong>.
                                </p>
                                <div className="pt-6">
                                    <Link
                                        href="/beta"
                                        className="px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all flex items-center gap-2 w-fit"
                                    >
                                        Start Free in 5 Minutes <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Architectural Visualization + FAQ */}
                    <StraikerClient />

                </div>
            </main>
        </div>
    );
}
