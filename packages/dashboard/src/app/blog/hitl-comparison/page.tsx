// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
    title: "Comparing Human-in-the-Loop Frameworks for AI Agents | SupraWall Blog",
    description: "An engineering deep dive into the top Human-in-the-Loop (HITL) frameworks for autonomous agents. Compare deterministic intercepts vs probabilistic prompt gates.",
    keywords: [
        "human in the loop ai",
        "hitl framework",
        "agentic human oversight",
        "mcp hitl",
        "langchain approval gate",
    ],
};

export default function HitlComparisonBlog() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-rose-500/30">
            <Navbar />
            
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto space-y-12">
                <header className="space-y-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-widest border border-rose-500/20">
                        Engineering Deep Dive
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-glow">
                        The <span className="text-rose-500">Human-in-the-Loop</span> Showdown
                    </h1>
                    <p className="text-neutral-400 text-lg md:text-xl font-medium italic">
                        Why building custom approval gates in your orchestration code is an anti-pattern, and what to use instead for production fleets.
                    </p>
                </header>

                <article className="prose prose-invert prose-rose max-w-none text-neutral-300">
                    <h2 className="text-3xl font-bold text-white uppercase italic tracking-tighter mt-12 mb-6">The Custom Gateway Anti-Pattern</h2>
                    <p>
                        Every engineering team building autonomous agents eventually realizes the need to approve <code>stripe_refund()</code> or <code>drop_table()</code> manually. The first instinct is to build an inline approval gate directly into the orchestrator logic.
                    </p>
                    <p>
                        This fails for three reasons:
                        <ol>
                            <li><strong>State Management:</strong> Pausing <code>async</code> orchestration loops requires persisting execution state across webhook boundaries.</li>
                            <li><strong>Hardcoded Logic:</strong> Rule definitions get messy and fragmented across your codebase.</li>
                            <li><strong>The Audit Gap:</strong> Hand-rolled approval gates almost never produce cryptographically verifiable, immutably timestamped compliance logs.</li>
                        </ol>
                    </p>
                    
                    <h3 className="text-2xl font-bold text-white uppercase mt-8 mb-4">Framework Level: LangChain & LangGraph</h3>
                    <p>
                        LangGraph has a mechanism called breakpoints. You can pause the entire graph state before executing a node.
                        While incredibly powerful for complex orchestration, it tightly couples your security posture to LangChain orchestration. If you move to CrewAI or Vercel AI, you lose your approval gates.
                    </p>

                    <h3 className="text-2xl font-bold text-white uppercase mt-12 mb-4">The Binary Interception Layer (SupraWall)</h3>
                    <p>
                        SupraWall approaches HITL fundamentally differently. We intercept the <strong>tool call binary</strong> before it executes, completely agnostic to the framework (LangChain, AutoGen, pure SDK).
                    </p>
                    <p>
                        When SupraWall encounters a high-risk tool call, it returns a <code>REQUIRE_APPROVAL</code> signal to your framework, automatically pauses the execution, generates a dashboard notification for the compliance team, and persists the payload. Once clicked, the execution resumes and an immutable audit log is generated containing the approver's identity.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                        <div className="p-6 border border-rose-500/30 bg-rose-500/5 rounded-2xl">
                            <h4 className="text-rose-400 font-bold uppercase tracking-wider mb-2">Orchestration Breakpoints</h4>
                            <ul className="list-disc list-inside text-sm text-neutral-400">
                                <li>Coupled to LangGraph/Framework</li>
                                <li>Requires complex async persistence</li>
                                <li>Weak audit trail guarantees</li>
                            </ul>
                        </div>
                        <div className="p-6 border border-emerald-500/30 bg-emerald-500/5 rounded-2xl">
                            <h4 className="text-emerald-400 font-bold uppercase tracking-wider mb-2">Deterministic Intercept</h4>
                            <ul className="list-disc list-inside text-sm text-neutral-400">
                                <li>Framework agnostic</li>
                                <li>Built-in dashboard UI / notifications</li>
                                <li>EU AI Act Article 14 compliant</li>
                            </ul>
                        </div>
                    </div>
                </article>
            </main>
        </div>
    );
}
