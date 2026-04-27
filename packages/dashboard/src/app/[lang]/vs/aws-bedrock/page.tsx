// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0


import { getLocalizedPath } from "@/i18n/slug-map";
import { Footer } from "@/components/Footer";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";
import { Navbar } from "@/components/Navbar";
import { Check, X, Shield, Zap, Info, ArrowRight, BarChart2, AlertCircle, Globe, Cloud, Lock } from "lucide-react";
import Link from "next/link";

export default async function vsPage({ params }: { params: Promise<{ lang: string }> }) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    const comparisonData = [
        { feature: "Multi-Cloud Portability", suprawall: true, bedrock: false, note: "Bedrock security (Guardrails) only works on AWS. SupraWall works on AWS, Azure, GCP, and On-Prem." },
        { feature: "Framework-Native", suprawall: true, bedrock: "Partial", note: "SupraWall integrates directly into LangChain & CrewAI; Bedrock is a separate API layer." },
        { feature: "Air-Gapped / VPC", suprawall: true, bedrock: false, note: "SupraWall can run in isolated environments where cloud traffic is prohibited." },
        { feature: "EU AI Act Articles 9/13/14", suprawall: "Full Suite", bedrock: "Logs only", note: "SupraWall includes specific Article 9 risk templates and human-in-the-loop Article 14 workflows." },
        { feature: "Deterministic Enforcement", suprawall: true, bedrock: true, note: "Both offer deterministic blocking, but SupraWall is closer to the execution boundary." }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar lang={lang} dictionary={dictionary} />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-20">

                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <div
                            className="inline-flex items-center px-4 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/5 text-[10px] font-black text-orange-400 tracking-[0.2em] uppercase"
                        >
                            Infrastructure Comparison
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase italic">
                            SupraWall vs <br />
                            <span className="text-orange-500 text-glow whitespace-nowrap">AWS Bedrock.</span>
                        </h1>
                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
                            Cloud-Native vs Cloud-Agnostic Agent Security.
                        </p>
                    </div>

                    {/* Comparison Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-10 rounded-3xl bg-white/[0.05] border border-white/5 space-y-8 group transition-all hover:bg-white/[0.04]">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase italic text-neutral-500">AWS Bedrock</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                                    A powerful managed service for building generative AI apps. Its native security features are excellent for Bedrock-hosted models but create deep vendor lock-in.
                                </p>
                            </div>
                            <ul className="space-y-4 text-sm text-neutral-500 font-bold">
                                <li className="flex items-center gap-3"><Cloud className="w-4 h-4" /> Best for: AWS-Only Deployments</li>
                                <li className="flex items-center gap-3"><Cloud className="w-4 h-4" /> Focus: Infrastructure Security</li>
                                <li className="flex items-center gap-3"><Cloud className="w-4 h-4" /> Ceiling: No Multi-Cloud Support</li>
                            </ul>
                        </div>

                        <div className="p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-8 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase italic text-white flex items-center gap-3">
                                    SupraWall <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                                </h3>
                                <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                                    The Multi-Cloud Security Standard. SupraWall secures your agents regardless of whether they run on AWS, Azure, on-premises, or in an air-gapped hospital.
                                </p>
                            </div>
                            <ul className="space-y-4 text-sm text-emerald-400 font-bold">
                                <li className="flex items-center gap-3"><Globe className="w-4 h-4" /> Best for: Regulated & Multi-Cloud Teams</li>
                                <li className="flex items-center gap-3"><Globe className="w-4 h-4" /> Focus: Framework-Layer Ownership</li>
                                <li className="flex items-center gap-3"><Globe className="w-4 h-4" /> Moat: Air-Gap & VPC Capable</li>
                            </ul>
                        </div>
                    </div>

                    {/* Technical Table */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <BarChart2 className="w-6 h-6 text-emerald-500" />
                            <h2 className="text-2xl font-black uppercase tracking-tight">Technical Breakdown</h2>
                        </div>
                        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.01]">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.05]">
                                        <th className="p-6 font-black uppercase tracking-widest text-neutral-500">Feature</th>
                                        <th className="p-6 font-black uppercase tracking-widest text-neutral-500">AWS Bedrock</th>
                                        <th className="p-6 font-black uppercase tracking-widest text-emerald-500">SupraWall</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.05] transition-colors">
                                            <td className="p-6 font-bold text-neutral-300">{row.feature}</td>
                                            <td className="p-6">
                                                {row.bedrock === true ? <Check className="w-5 h-5 text-orange-500" /> : row.bedrock === false ? <X className="w-5 h-5 text-rose-900" /> : <span className="text-neutral-500 font-bold italic">{row.bedrock}</span>}
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    {row.suprawall === true || row.suprawall === "Full Suite" ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-rose-500" />}
                                                    <span className="font-bold text-emerald-500">{row.suprawall === "Full Suite" ? "(Included)" : ""}</span>
                                                </div>
                                                <p className="text-[10px] text-neutral-600 mt-2 font-medium">{row.note}</p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Verdict Block */}
                    <div className="p-12 rounded-[40px] bg-neutral-900 border border-white/5 text-center space-y-6">
                        <h3 className="text-3xl font-black uppercase italic">Complement, Don't Compete</h3>
                        <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed font-medium">
                            SupraWall integrates with <strong className="text-white text-glow">AWS Security Hub</strong>. You don't have to choose between AWS infrastructure and SupraWall security. Use Bedrock for compute, and SupraWall for the cross-platform, framework-layer audit trail your compliance team needs.
                        </p>
                        <div className="pt-4 flex justify-center">
                            <Link href={getLocalizedPath("/login", lang)} className="px-10 py-5 bg-white text-black font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-emerald-500 hover:text-white transition-all transform hover:scale-105">
                                Start Your Implementation
                            </Link>
                        </div>
                    </div>

                </div>
            </main>

            <Footer lang={lang} dictionary={dictionary} />
        </div>
    );
}
