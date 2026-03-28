// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Navbar } from "@/components/Navbar";
import { 
    Shield, CheckCircle2, ArrowRight, FileText, Scale, 
    Lock, Activity, Globe, Zap, ListCheck 
} from "lucide-react";
import Link from "next/link";

export default function ComplianceLandingPage() {
    const articles = [
        {
            article: "Article 12",
            name: "Record-keeping",
            desc: "Automatic logging of events during the operation of high-risk AI systems.",
            feature: "Deterministic Audit Logs",
            href: "/eu-ai-act/article-12"
        },
        {
            article: "Article 14",
            name: "Human Oversight",
            desc: "Designing systems that can be effectively overseen by natural persons.",
            feature: "Human-in-the-loop Protocol",
            href: "/eu-ai-act/article-14"
        },
        {
            article: "Article 10",
            name: "Data Governance",
            desc: "Ensuring training and testing datasets are subject to appropriate governance.",
            feature: "Tool Access Control",
            href: "#"
        },
        {
            article: "Article 15",
            name: "Robustness & Security",
            desc: "Appropriate level of robustness, accuracy and cybersecurity.",
            feature: "Deterministic Shim Layer",
            href: "#"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar />
            
            <main className="pt-48 pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-32">
                    
                    {/* Hero Section */}
                    <section className="text-center space-y-12 max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-sm font-black text-emerald-400 uppercase tracking-widest animate-fade-in">
                            <Globe className="w-4 h-4 mr-2" /> Enterprise Ready
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.9]">
                            EU AI Act <br />
                            <span className="text-emerald-500 text-glow">Compliance.</span> <br />
                            Solved.
                        </h1>
                        <p className="text-xl md:text-2xl text-neutral-400 font-medium italic leading-relaxed">
                            SupraWall maps every autonomous agent tool call to specific regulatory requirements. 
                            Automate your compliance reporting and de-risk your AI transformation.
                        </p>
                    </section>

                    {/* Mapping Grid */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {articles.map((item, i) => (
                            <div key={i} className="group p-8 rounded-3xl bg-neutral-900/40 border border-white/5 hover:border-emerald-500/30 transition-all">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="space-y-4">
                                        <div className="text-emerald-500 font-black text-4xl italic tracking-tighter uppercase">{item.article}</div>
                                        <h3 className="text-2xl font-bold">{item.name}</h3>
                                    </div>
                                    <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-emerald-500/10 transition-colors">
                                        <Scale className="w-6 h-6 text-neutral-400 group-hover:text-emerald-500" />
                                    </div>
                                </div>
                                <p className="text-neutral-400 mb-8 leading-relaxed">
                                    {item.desc}
                                </p>
                                <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        <span className="text-sm font-bold text-white uppercase tracking-tight">{item.feature}</span>
                                    </div>
                                    {item.href !== "#" && (
                                        <Link href={item.href} className="text-emerald-500 font-bold uppercase text-xs flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                                            Deep Dive <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* Enterprise Comparison/Feature Table */}
                    <section className="space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight">Compliance Roadmap</h2>
                            <p className="text-neutral-500">How SupraWall ensures your AI agents remain within legal guardrails.</p>
                        </div>

                        <div className="overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/20 backdrop-blur-xl">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5 border-b border-white/10">
                                    <tr>
                                        <th className="p-6 text-sm font-black uppercase tracking-widest text-neutral-400">Framework Requisition</th>
                                        <th className="p-6 text-sm font-black uppercase tracking-widest text-neutral-400">SupraWall Control</th>
                                        <th className="p-6 text-sm font-black uppercase tracking-widest text-neutral-400">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {[
                                        { req: "Transparency (Art 4b)", control: "System Prompt Injection Guards", status: "Active" },
                                        { req: "Technical Documentation (Art 11)", control: "Auto-generated Compliance PDF", status: "Active" },
                                        { req: "Risk Management (Art 9)", control: "Deterministic Out-of-bounds Detection", status: "Active" },
                                        { req: "Conformity Assessment (Art 43)", control: "Validation Audit Trails", status: "Active" }
                                    ].map((row, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors">
                                            <td className="p-6 font-bold">{row.req}</td>
                                            <td className="p-6 text-neutral-400">{row.control}</td>
                                            <td className="p-6">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 uppercase">
                                                    {row.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Technical Integration CTA */}
                    <section className="relative p-1 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600 rounded-[3rem] overflow-hidden">
                        <div className="bg-black rounded-[2.9rem] p-12 md:p-20 flex flex-col items-center text-center space-y-10 relative overflow-hidden">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
                            
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-none max-w-4xl relative z-10">
                                Make Your Agents <br />
                                <span className="text-emerald-500">Legal-Proof</span> in One Line.
                            </h2>
                            <p className="text-xl text-neutral-400 max-w-2xl relative z-10">
                                Integrate SupraWall with any LLM framework and automate your Articles 12 & 14 requirements today.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-6 relative z-10">
                                <Link 
                                    href="/beta" 
                                    className="px-12 py-5 bg-white text-black font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105"
                                >
                                    Book Compliance Audit
                                </Link>
                                <Link 
                                    href="/docs" 
                                    className="px-12 py-5 border-2 border-white/10 text-white font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-white/5 transition-all"
                                >
                                    View Documentation
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}
