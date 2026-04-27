// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
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
        { feature: "Cloud-Agnostic", suprawall: true, azure: false, note: "Azure AI Studio security is locked to Azure subscriptions. SupraWall works on any cloud or local VPC." },
        { feature: "RSA-Signed Audit Trail", suprawall: true, azure: "Logs only", note: "SupraWall satisfies EU AI Act Article 13/14 with cryptographically signed execution records." },
        { feature: "Air-Gapped Deployment", suprawall: true, azure: false, note: "Crucial for healthcare and defense sectors that cannot legally exit their private network." },
        { feature: "Framework Support", suprawall: "8+ SDKs", azure: "Partner-only", note: "SupraWall supports LangChain, CrewAI, AutoGen natively. Azure focuses on the model-hosting layer." },
        { feature: "SIEM Export", suprawall: true, azure: true, note: "Both export to Azure Sentinel / Defender; they are designed to work together." }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar lang={lang} dictionary={dictionary} />

            <main className="pt-32 pb-20 px-6">
                <div className="max-w-5xl mx-auto space-y-20">

                    {/* Hero Section */}
                    <div className="text-center space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center px-4 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase"
                        >
                            Infrastructure Comparison
                        </motion.div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none uppercase italic">
                            SupraWall vs <br />
                            <span className="text-blue-500 text-glow whitespace-nowrap">Azure AI Studio.</span>
                        </h1>
                        <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium">
                            The Secure Gateway for the Multi-Cloud Enterprise.
                        </p>
                    </div>

                    {/* Comparison Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-10 rounded-3xl bg-white/[0.05] border border-white/5 space-y-8 group transition-all hover:bg-white/[0.04]">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase italic text-neutral-500">Azure AI Studio</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed font-medium">
                                    A premier enterprise AI platform. It provides excellent security for Azure-native workloads but lacks the portability regulated industries often require.
                                </p>
                            </div>
                            <ul className="space-y-4 text-sm text-neutral-500 font-bold">
                                <li className="flex items-center gap-3"><Cloud className="w-4 h-4" /> Best for: Pure Azure Environments</li>
                                <li className="flex items-center gap-3"><Cloud className="w-4 h-4" /> Focus: Infrastructure Security</li>
                                <li className="flex items-center gap-3"><Cloud className="w-4 h-4" /> Ceiling: No On-Premises Option</li>
                            </ul>
                        </div>

                        <div className="p-10 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-8 shadow-[0_0_50px_rgba(16,185,129,0.05)]">
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black uppercase italic text-white flex items-center gap-3">
                                    SupraWall <Zap className="w-5 h-5 text-emerald-500 fill-emerald-500" />
                                </h3>
                                <p className="text-sm text-neutral-300 leading-relaxed font-medium">
                                    The Deterministic Security Standard. SupraWall separates the security policy from the infrastructure provider, enabling true multi-cloud portability and compliance.
                                </p>
                            </div>
                            <ul className="space-y-4 text-sm text-emerald-400 font-bold">
                                <li className="flex items-center gap-3"><Shield className="w-4 h-4" /> Best for: EU AI Act Article 9/13/14</li>
                                <li className="flex items-center gap-3"><Shield className="w-4 h-4" /> Focus: Tool-Call Boundary Interception</li>
                                <li className="flex items-center gap-3"><Shield className="w-4 h-4" /> Moat: Crytographically Signed Audit Trails</li>
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
                                        <th className="p-6 font-black uppercase tracking-widest text-neutral-500">Azure AI</th>
                                        <th className="p-6 font-black uppercase tracking-widest text-emerald-500">SupraWall</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {comparisonData.map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.05] transition-colors">
                                            <td className="p-6 font-bold text-neutral-300">{row.feature}</td>
                                            <td className="p-6">
                                                {row.azure === true ? <Check className="w-5 h-5 text-blue-500" /> : row.azure === false ? <X className="w-5 h-5 text-rose-900" /> : <span className="text-neutral-500 font-bold italic">{row.azure}</span>}
                                            </td>
                                            <td className="p-6">
                                                <div className="flex items-center gap-2">
                                                    {row.suprawall === true || row.suprawall === "8+ SDKs" ? <Check className="w-5 h-5 text-emerald-500" /> : <X className="w-5 h-5 text-rose-500" />}
                                                    <span className="font-bold text-emerald-500">{row.suprawall === "8+ SDKs" ? "(SDK-First)" : ""}</span>
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
                        <h3 className="text-3xl font-black uppercase italic">Azure Defender Ready</h3>
                        <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed font-medium">
                            SupraWall fuels <strong className="text-blue-500">Azure Security Center</strong> with deterministic tool-call data. Most enterprises use Azure for infrastructure and SupraWall for the specialized AI Act compliance layer that Microsoft's general-purpose tools don't cover.
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
