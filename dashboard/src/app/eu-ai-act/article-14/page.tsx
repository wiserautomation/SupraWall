"use client";

import { Navbar } from "@/components/Navbar";
import { Shield, CheckCircle2, ArrowRight, UserCheck, Eye, Scale } from "lucide-react";
import Link from "next/link";

export default function Article14Page() {
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
