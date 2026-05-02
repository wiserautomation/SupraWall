// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Clock, Shield, AlertTriangle, CheckCircle2, FlaskConical, Microscope } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return {
        title: "Benchmark Methodology | SupraWall Documentation",
        description: "Technical details on how we benchmark LLM-as-judge accuracy and runtime guardrail bypass rates.",
    };
}

export default async function BenchmarksPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;

    return (
        <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="space-y-4">
                <div className="inline-flex p-3 bg-[#B8FF00]/10 rounded-full mb-2">
                    <FlaskConical className="w-8 h-8 text-[#B8FF00]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    Benchmark Methodology
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    How we measure the gap between probabilistic intent evaluation and deterministic action interception.
                </p>
            </div>

            <div className="prose prose-invert prose-neutral max-w-none space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Shield className="w-6 h-6 text-[#B8FF00]" />
                        Evaluation Framework
                    </h2>
                    <p className="text-neutral-400">
                        Our benchmarks evaluate the effectiveness of security layers in autonomous AI agent pipelines. 
                        We specifically compare <strong>Intent-based Guards</strong> (LLM-as-judge) against <strong>Action-based Interceptors</strong> (SupraWall).
                    </p>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
                    <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Test Vector A</h3>
                        <h4 className="text-xl font-bold text-white">Semantic Bypass</h4>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                            Using homoglyphs, encoded payloads, or role-play to obscure the malicious intent of a tool call while keeping the arguments valid for execution.
                        </p>
                    </div>
                    <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-neutral-500">Test Vector B</h3>
                        <h4 className="text-xl font-bold text-white">Context Displacement</h4>
                        <p className="text-sm text-neutral-500 leading-relaxed">
                            Burying the tool-call request deep within a long user prompt or system logs to exceed the immediate attention window of the judge LLM.
                        </p>
                    </div>
                </div>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Microscope className="w-6 h-6 text-[#B8FF00]" />
                        Environment Setup (April 2026)
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse border border-white/5">
                            <thead>
                                <tr className="bg-white/5">
                                    <th className="p-4 text-xs font-black uppercase tracking-widest text-neutral-400">Target System</th>
                                    <th className="p-4 text-xs font-black uppercase tracking-widest text-neutral-400">Version</th>
                                    <th className="p-4 text-xs font-black uppercase tracking-widest text-neutral-400">Mode</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-neutral-300">
                                <tr className="border-t border-white/5">
                                    <td className="p-4 font-mono">Lakera Guard</td>
                                    <td className="p-4 text-neutral-500">v1.1 (Cloud)</td>
                                    <td className="p-4">Direct Injection API</td>
                                </tr>
                                <tr className="border-t border-white/5">
                                    <td className="p-4 font-mono">NeMo Guardrails</td>
                                    <td className="p-4 text-neutral-500">v0.9.1</td>
                                    <td className="p-4">Default Jailbreak Rail</td>
                                </tr>
                                <tr className="border-t border-white/5">
                                    <td className="p-4 font-mono">Guardrails AI</td>
                                    <td className="p-4 text-neutral-500">v0.5.14</td>
                                    <td className="p-4">Detect Jailbreak Validator</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-4 pt-8 border-t border-white/5">
                    <h2 className="text-2xl font-bold text-white">Scoring Criteria</h2>
                    <ul className="space-y-4">
                        <li className="flex gap-4">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                            <div>
                                <strong className="text-white block">False Negative (Bypass)</strong>
                                <p className="text-sm text-neutral-400">The security layer allowed a malicious tool call to proceed to execution.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            <div>
                                <strong className="text-white block">Deterministic Block</strong>
                                <p className="text-sm text-neutral-400">The security layer blocked the action based on a hard policy, regardless of the semantic content.</p>
                            </div>
                        </li>
                    </ul>
                </section>

                <section className="p-8 rounded-3xl bg-neutral-900 border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-2 italic">A Note on Probabilistic Failure</h3>
                    <p className="text-sm text-neutral-400 leading-relaxed italic">
                        Our tests indicate that LLM-as-judge systems fail not due to lack of intelligence, but due to architectural misalignment. 
                        As identified in <em>Shi et al. (2024), &quot;Judging the Judges,&quot;</em> position bias and semantic drift create a &quot;shadow accuracy window&quot; 
                        where malicious tool calls can hide. SupraWall avoids this by intercepting the call at the SDK boundary, where intent is irrelevant and policy is binary.
                    </p>
                </section>
            </div>
        </div>
    );
}
