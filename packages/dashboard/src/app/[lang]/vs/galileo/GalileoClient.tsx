// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { motion } from "framer-motion";
import { Check, X, Eye, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GalileoClient() {
    const faqs = [
        {
            q: "How is SupraWall different from Galileo?",
            a: "Galileo is an observability platform for debugging agent behavior. SupraWall is a runtime security firewall that prevents unauthorized actions before they happen. They serve complementary purposes.",
        },
        {
            q: "Can I use SupraWall and Galileo together?",
            a: "Yes. Use Galileo for evaluation and behavioral tracing; use SupraWall for enforcement, policy control, and EU AI Act compliance.",
        },
        {
            q: "Does Galileo block tool calls?",
            a: "No. Galileo monitors and evaluates agent actions but does not intercept or block them. If you need enforcement, you need SupraWall.",
        },
    ];

    return (
        <div className="mt-20 space-y-20">
            {/* Architectural Comparison */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Galileo side */}
                <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-900 border border-white/10 flex items-center justify-center">
                            <Eye className="w-5 h-5 text-neutral-500" />
                        </div>
                        <h3 className="font-black uppercase tracking-tight text-neutral-500">Galileo Approach</h3>
                    </div>
                    <div className="space-y-4 font-mono text-[10px] text-neutral-500">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">Agent executes tool call</div>
                        <div className="text-center italic">↓ after execution ↓</div>
                        <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 text-center text-amber-400 font-bold">
                            Galileo traces &amp; evaluates (post-hoc)
                        </div>
                        <div className="text-center italic text-neutral-700">Flags issues in hindsight...</div>
                        <div className="p-3 bg-rose-500/10 rounded-lg border border-rose-500/20 text-center text-rose-400 font-bold">
                            Damage already done
                        </div>
                    </div>
                    <p className="text-xs text-neutral-600 italic">
                        Observability is forensic. By the time Galileo flags a problem, the tool call has already executed.
                    </p>
                </div>

                {/* SupraWall side */}
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-3xl p-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black font-black">
                            <Shield className="w-5 h-5" />
                        </div>
                        <h3 className="font-black uppercase tracking-tight text-white italic">SupraWall Approach</h3>
                    </div>
                    <div className="space-y-4 font-mono text-[10px] text-neutral-300">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 text-center">Agent attempts tool call</div>
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center text-emerald-500 font-bold">
                            SupraWall intercepts (pre-execution)
                        </div>
                        <div className="text-center italic text-emerald-900 leading-none">
                            Evaluates against ALLOW / DENY policy...
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-center text-emerald-400 font-bold">
                            BLOCKED or approved before execution
                        </div>
                    </div>
                    <p className="text-xs text-emerald-500/60 italic">
                        Enforcement happens before the action. No damage. No post-mortem. Just prevention.
                    </p>
                </div>
            </div>

            {/* Differentiation Cards */}
            <div className="space-y-6">
                <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">Key Differences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                        {
                            title: "When does it act?",
                            galileo: "After execution — identifies what went wrong",
                            suprawall: "Before execution — prevents it from happening",
                        },
                        {
                            title: "Primary purpose",
                            galileo: "Developer tooling and debugging",
                            suprawall: "Security and compliance governance",
                        },
                        {
                            title: "Policy engine",
                            galileo: "No policy engine — evaluation metrics only",
                            suprawall: "Full ALLOW / DENY / REQUIRE_APPROVAL engine",
                        },
                        {
                            title: "Credentials & secrets",
                            galileo: "No vault or secret management",
                            suprawall: "Built-in vault with per-agent secret injection",
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
                                    <p className="text-sm text-neutral-500 font-medium">{card.galileo}</p>
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
                    Ready to enforce, not just observe?
                </p>
                <Link
                    href="/login"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-500 text-black font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 transition-all"
                >
                    Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
}
