"use client";

import { motion } from "framer-motion";
import { Check, X, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function StraikerClient() {
    const faqs = [
        {
            q: "How is SupraWall different from Straiker?",
            a: "SupraWall is developer-first with self-serve onboarding and one-line framework integrations. Straiker targets enterprise buyers with a sales-led model. SupraWall also includes a built-in secret vault and MCP server security that Straiker doesn't offer.",
        },
        {
            q: "Is Straiker open source?",
            a: "No. Straiker is a closed-source commercial product. SupraWall publishes its Agent Governance Protocol Specification (AGPS) as an open standard.",
        },
        {
            q: "Which is easier to get started with?",
            a: "SupraWall: pip install suprawall, wrap your agent, start enforcing policies in under 5 minutes. Straiker requires a sales conversation before you can test it.",
        },
    ];

    return (
        <div className="mt-20 space-y-20">
            {/* Integration Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Straiker side */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-500 font-black text-sm">
                            ST
                        </div>
                        <h3 className="font-black uppercase tracking-tight text-neutral-500">Straiker Onboarding</h3>
                    </div>
                    <div className="space-y-4 font-mono text-[10px] text-neutral-500">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">Visit website</div>
                        <div className="text-center italic">↓</div>
                        <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 text-center text-rose-400 font-bold">
                            "Contact Sales" gated
                        </div>
                        <div className="text-center italic text-neutral-700">Schedule demo call...</div>
                        <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 text-center text-rose-400 font-bold">
                            Custom instrumentation required
                        </div>
                        <div className="text-center italic text-neutral-700">Weeks later...</div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">Finally enforcing policies</div>
                    </div>
                    <p className="text-xs text-neutral-600 italic">
                        Enterprise sales motion means developers can't evaluate the product until procurement approves it.
                    </p>
                </div>

                {/* SupraWall side */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black text-sm">
                            SW
                        </div>
                        <h3 className="font-black uppercase tracking-tight text-white italic">SupraWall Onboarding</h3>
                    </div>
                    <div className="space-y-4 font-mono text-[10px] text-neutral-300">
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center text-emerald-400 font-bold">
                            pip install suprawall
                        </div>
                        <div className="text-center italic text-emerald-900 leading-none">One command...</div>
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center text-emerald-400 font-bold">
                            protect(agent) — one decorator
                        </div>
                        <div className="text-center italic text-emerald-900 leading-none">Zero config...</div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">Policies enforced in production</div>
                    </div>
                    <p className="text-xs text-emerald-500/60 italic">
                        Self-serve. No sales call. No custom instrumentation. Enforce policies in under 5 minutes.
                    </p>
                </div>
            </div>

            {/* Differentiation Cards */}
            <div className="space-y-6">
                <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">Key Differences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            title: "How do you get started?",
                            straiker: "Enterprise sales call required before testing",
                            suprawall: "Self-serve — pip install and protect() in minutes",
                        },
                        {
                            title: "Integration depth",
                            straiker: "Application-layer guardrails, easier to bypass",
                            suprawall: "SDK-level interception — hooks directly into framework callbacks",
                        },
                        {
                            title: "Framework support",
                            straiker: "Limited integrations, custom instrumentation needed",
                            suprawall: "Native LangChain, CrewAI, AutoGen, PydanticAI support",
                        },
                        {
                            title: "Protocol openness",
                            straiker: "Closed-source, no open standards",
                            suprawall: "AGPS open protocol — vendor-neutral governance spec",
                        },
                    ].map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-white/[0.05] border border-white/5 rounded-2xl p-8 space-y-5 hover:bg-white/[0.04] transition-colors"
                        >
                            <h4 className="text-xs font-black uppercase tracking-widest text-emerald-500">{card.title}</h4>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <X className="w-4 h-4 text-rose-900 mt-0.5 shrink-0" />
                                    <p className="text-sm text-neutral-500 font-medium">{card.straiker}</p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                    <p className="text-sm text-white font-bold">{card.suprawall}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* FAQ Section */}
            <div className="space-y-8">
                <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/[0.05] border border-white/5 rounded-2xl p-8 space-y-3 hover:bg-white/[0.04] transition-colors"
                        >
                            <h3 className="text-base font-black text-white">{faq.q}</h3>
                            <p className="text-sm text-neutral-400 leading-relaxed font-medium">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="text-center space-y-6 py-12">
                <p className="text-neutral-500 text-sm font-bold uppercase tracking-widest">
                    No sales call needed. Just secure agents.
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all"
                >
                    Start Free in 5 Minutes <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
