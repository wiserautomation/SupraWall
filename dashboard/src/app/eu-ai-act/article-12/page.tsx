"use client";

import { Navbar } from "@/components/Navbar";
import { Shield, FileText, ArrowRight, Zap, ListCheck, Activity } from "lucide-react";
import Link from "next/link";

export default function Article12Page() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar />
            
            <main className="pt-32 pb-20 px-6">
                <article className="max-w-4xl mx-auto space-y-12">
                    {/* Header */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                            EU AI Act Compliance
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tighter uppercase italic">
                            Article 12: <span className="text-emerald-500 text-glow">Record-Keeping</span>
                        </h1>
                        <p className="text-xl text-neutral-400 font-medium leading-relaxed italic">
                            Ensuring traceability and accountability through automated logging and detailed record-keeping for AI systems.
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-12 border-y border-white/5">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <FileText className="text-emerald-500 w-6 h-6" />
                                Requirements
                            </h2>
                            <p className="text-neutral-400 leading-relaxed">
                                Article 12 mandates that high-risk AI systems automatically generate logs throughout their lifecycle to ensure traceability of the system's functioning and performance.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold flex items-center gap-3">
                                <Zap className="text-emerald-500 w-6 h-6" />
                                Our Solution
                            </h2>
                            <p className="text-neutral-400 leading-relaxed">
                                SupraWall's <strong>Deterministic Audit Logs</strong> capture 100% of tool interactions, input/output pairs, and policy decisions, providing an immutable record that meets Article 12 standards out-of-the-box.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <h3 className="text-3xl font-black uppercase italic tracking-tight">Technical Logging Requisites</h3>
                        <div className="space-y-6">
                            {[
                                {
                                    title: "Automatic Recording",
                                    desc: "Logging of events relative to the identification of situations that may result in the AI system presenting a risk."
                                },
                                {
                                    title: "Traceability & Forensics",
                                    desc: "Detailed timestamps and session identifiers to facilitate post-hoc analysis of autonomous actions."
                                },
                                {
                                    title: "Performance Monitoring",
                                    desc: "Continuous logging of system accuracy and reliability metrics to detect drift or failure."
                                }
                            ].map((item, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-neutral-900/50 border border-white/5 flex gap-6 group hover:border-emerald-500/30 transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-bold shrink-0">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-bold group-hover:text-emerald-400 transition-colors">{item.title}</h4>
                                        <p className="text-neutral-500 leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Features Detail */}
                    <div className="p-8 rounded-3xl border border-white/5 bg-neutral-900/30">
                        <h3 className="text-2xl font-bold mb-6">Article 12 Compliance Checklist</h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Start/End time of each system use",
                                "The reference database used",
                                "Input data for search criteria",
                                "Traceability of human intervention",
                                "Log retention management",
                                "Secure logging verification"
                            ].map((check, i) => (
                                <li key={i} className="flex items-center gap-3 text-neutral-400">
                                    <ListCheck className="text-emerald-500 w-5 h-5 shrink-0" />
                                    <span className="text-sm font-medium">{check}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CTA */}
                    <div className="p-12 rounded-[2.5rem] bg-gradient-to-br from-neutral-800 to-neutral-950 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group border border-white/10">
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none italic">
                                Compliance Automation
                            </h3>
                            <p className="text-neutral-400 font-medium">
                                Configure your Article 12 audit pipeline in under 5 minutes.
                            </p>
                        </div>
                        <Link 
                            href="/login" 
                            className="px-8 py-4 bg-emerald-500 text-black font-bold uppercase tracking-tighter rounded-xl hover:bg-emerald-400 transition-colors flex items-center gap-2 relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                        >
                            View Audit Demo <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </article>
            </main>
        </div>
    );
}
