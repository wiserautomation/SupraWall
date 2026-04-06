// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileText, Shield, Globe, Users, Database, Scale, ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Data Processing Agreement (DPA) | SupraWall Legal",
    description: "Review and download the SupraWall Data Processing Agreement (DPA). Compliant with GDPR and EU Standard Contractual Clauses.",
};

export default function DPAPage() {
    return (
        <div className="min-h-screen bg-black text-neutral-200 font-sans selection:bg-emerald-500/30 selection:text-white">
            <Navbar />
            
            <main className="pt-32 pb-24 px-6">
                <div className="max-w-5xl mx-auto space-y-20">
                    
                    {/* Hero Header */}
                    <div className="space-y-8 text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase">
                            GDPR Article 28 Compliance
                        </div>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
                            Data <br />
                            <span className="text-emerald-500">Processing</span> <br />
                            Agreement
                        </h1>
                        <p className="text-lg md:text-xl text-neutral-500 font-medium italic leading-relaxed">
                            This Data Processing Agreement (“DPA”) forms part of the Master Subscription Agreement or other agreement for services between SupraWall and the Customer.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                            <button className="px-8 py-4 bg-white text-black font-black uppercase italic rounded-full flex items-center gap-3 hover:bg-emerald-500 transition-all group">
                                <Download className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                                Download Executable PDF
                            </button>
                            <Link href="/security" className="px-8 py-4 border border-white/10 text-white font-black uppercase italic rounded-full flex items-center gap-3 hover:bg-white/5 transition-all">
                                <Shield className="w-5 h-5 text-emerald-400" />
                                Visit Trust Center
                            </Link>
                        </div>
                    </div>

                    {/* Quick navigation or Summary */}
                    <div className="grid md:grid-cols-3 gap-6 bg-neutral-900/40 border border-white/5 p-8 rounded-[2.5rem]">
                        <div className="p-6 space-y-4">
                            <Globe className="w-8 h-8 text-emerald-500" />
                            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Jurisdiction</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed font-medium">Standard Contractual Clauses (SCCs) are incorporated to ensure lawful data transfers from the EU/EEA.</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <Database className="w-8 h-8 text-emerald-500" />
                            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Sub-processors</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed font-medium">Full transparency on infrastructure sub-processors including AWS, GCP, and managed security partners.</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <Scale className="w-8 h-8 text-emerald-500" />
                            <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Legal Grade</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed font-medium">Drafted specifically for AI agent autonomy, addressing Article 9 (Special Categories) and sensitive tool telemetry.</p>
                        </div>
                    </div>

                    {/* Agreement Content */}
                    <div className="space-y-16 bg-neutral-900/20 border border-white/5 p-8 md:p-16 rounded-[4rem] backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                            <FileText className="w-64 h-64" />
                        </div>

                        {/* Clause 1 */}
                        <section className="space-y-6 relative">
                            <div className="flex items-center gap-4 text-emerald-500">
                                <div className="text-xs font-black px-2 py-0.5 border border-emerald-500/30 rounded">SEC 01</div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Subject Matter & Duration</h2>
                            </div>
                            <div className="space-y-4 text-neutral-400 font-medium leading-relaxed italic">
                                <p>SupraWall processes personal data provided by the Customer in connection with the provision of AI security and guardrail services. The duration of the processing corresponds to the duration of the Provision of Services under the Agreement.</p>
                                <p>The nature and purpose of processing consists of securing autonomous tool-calls made by AI agents, scrubbing PII from telemetric payloads, and maintaining immutable audit trails for regulatory compliance.</p>
                            </div>
                        </section>

                        {/* Clause 2: Sub-Processors */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 text-emerald-500">
                                <div className="text-xs font-black px-2 py-0.5 border border-emerald-500/30 rounded">SEC 02</div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Authorized Sub-processors</h2>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                                            <th className="pb-4 pt-4 px-4">Entity Name</th>
                                            <th className="pb-4 pt-4 px-4">Service Provided</th>
                                            <th className="pb-4 pt-4 px-4">Entity Location</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm font-medium italic divide-y divide-white/5">
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="py-6 px-4 text-white font-bold">Amazon Web Services (AWS)</td>
                                            <td className="py-6 px-4 text-neutral-400">Cloud Infrastructure / Hosting</td>
                                            <td className="py-6 px-4 text-neutral-400">EU (Ireland), USA</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="py-6 px-4 text-white font-bold">Google Cloud Platform (GCP)</td>
                                            <td className="py-6 px-4 text-neutral-400">Database & Identity Auth</td>
                                            <td className="py-6 px-4 text-neutral-400">EU (Germany), USA</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="py-6 px-4 text-white font-bold">Stripe, Inc.</td>
                                            <td className="py-6 px-4 text-neutral-400">Payment Processing & Billing</td>
                                            <td className="py-6 px-4 text-neutral-400">USA</td>
                                        </tr>
                                        <tr className="hover:bg-white/5 transition-colors">
                                            <td className="py-6 px-4 text-white font-bold">Resend Labs, Inc.</td>
                                            <td className="py-6 px-4 text-neutral-400">Transactional Messaging</td>
                                            <td className="py-6 px-4 text-neutral-400">USA</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-neutral-600 font-bold uppercase tracking-widest italic pt-4">
                                * Enterprise customers may request custom regional deployments to ensure data resides exclusively within the EU/EEA.
                            </p>
                        </section>

                        {/* Clause 3: Technical and Organizational Measures */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-emerald-500">
                                <div className="text-xs font-black px-2 py-0.5 border border-emerald-500/30 rounded">SEC 03</div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Security & Safeguards</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8 pt-4">
                                <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                                    <h4 className="font-black uppercase italic text-sm text-white">Encryption at Rest</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed font-medium italic">All customer data, including encrypted vault secrets, is stored using AES-256 bit encryption. Keys are derived from unique organizational master secrets.</p>
                                </div>
                                <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                                    <h4 className="font-black uppercase italic text-sm text-white">Network Isolation</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed font-medium italic">Agent evaluations happen within isolated VPCs with strict ingress/egress controls. No raw payloads are ever transmitted outside the secure evaluation perimeter.</p>
                                </div>
                                <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                                    <h4 className="font-black uppercase italic text-sm text-white">PII Redaction</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed font-medium italic">Our proprietary PII Shield identified and masks sensitive data (Names, SSNs, Credit Cards) before any log is written to persistent storage.</p>
                                </div>
                                <div className="p-8 bg-black/40 border border-white/5 rounded-3xl space-y-4">
                                    <h4 className="font-black uppercase italic text-sm text-white">Business Continuity</h4>
                                    <p className="text-xs text-neutral-500 leading-relaxed font-medium italic">Real-time failover to secondary regions and daily encrypted off-site backups ensure 99.99% availability for critical security infrastructure.</p>
                                </div>
                            </div>
                        </section>

                        {/* Clause 4: Audit Rights */}
                        <section className="space-y-6">
                            <div className="flex items-center gap-4 text-emerald-500">
                                <div className="text-xs font-black px-2 py-0.5 border border-emerald-500/30 rounded">SEC 04</div>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-white">Audit & Monitoring</h2>
                            </div>
                            <p className="text-neutral-400 font-medium leading-relaxed italic">
                                SupraWall shall provide all information necessary to demonstrate compliance with its obligations and shall allow for and contribute to audits, including inspections, conducted by the Customer or another auditor mandated by the Customer.
                            </p>
                        </section>

                    </div>

                    {/* Final CTA */}
                    <div className="bg-emerald-500 p-12 md:p-20 rounded-[4rem] text-black space-y-8 relative overflow-hidden group">
                        <div className="relative z-10 space-y-6 max-w-2xl">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                                Need a signed <br />
                                counter-party DPA?
                            </h2>
                            <p className="text-lg font-bold italic opacity-80 uppercase">
                                Our legal team can review and execute custom DPAs for Business and Enterprise customers within 48 hours.
                            </p>
                            <Link href="/pricing" className="inline-flex items-center gap-3 px-10 py-5 bg-black text-white font-black uppercase italic rounded-full hover:scale-105 active:scale-95 transition-all">
                                Contact Legal Team
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                        <div className="absolute right-0 bottom-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                            <Scale className="w-96 h-96" />
                        </div>
                    </div>

                </div>
            </main>

            <Footer />
        </div>
    );
}
