// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { Shield, Lock, Terminal, Activity, CheckCircle2, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import LearnClient from "./LearnClient";

export const metadata: Metadata = {
    title: "What is Agent Runtime Security? | AI Guardrails Explained",
    description: "Agent Runtime Security (ARS) is the layer of protection between autonomous AI agents and your systems. Learn about EU AI Act compliance and agent firewalls.",
    keywords: ["agent runtime security", "ai agent guardrails", "agent firewall", "secure ai agents", "eu ai act compliance"],    alternates: {
        canonical: 'https://www.supra-wall.com/learn/what-is-agent-runtime-security',
    },

};

export default function AgentRuntimeSecurityPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "What is Agent Runtime Security?",
        "description": "Agent Runtime Security (ARS) is the safety layer for AI agents that prevents malicious or accidental system damage via tool calling.",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "genre": "Security Guide",
        "keywords": "ai agents, security, runtime, guardrails"
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is Agent Runtime Security (ARS)?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "ARS is a security paradigm that focuses on governing the actions—rather than just the outputs—of autonomous AI agents. It sits between the agent framework and the system environment to intercept tool calls in real-time."
                }
            },
            {
                "@type": "Question",
                "name": "Why are standard LLM guardrails not enough?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Standard guardrails filter text for safety (e.g., hate speech), but they don't prevent an agent from executing a destructive shell command or draining an API budget through infinite loops. ARS provides deterministic action control."
                }
            },
            {
                "@type": "Question",
                "name": "What is the difference between ARS and observability?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Observability tells you what an agent did after it happened. Agent Runtime Security intercepts actions before execution, preventing harm rather than just detecting it. ARS includes audit logging but goes far beyond by enforcing real-time policy decisions."
                }
            },
            {
                "@type": "Question",
                "name": "How does ARS work at the SDK level?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SupraWall's ARS operates as a shim between your agent framework (LangChain, CrewAI, AutoGen) and the tools it attempts to call. Every tool invocation is intercepted, evaluated against policies in under 5ms, and either allowed, denied, or escalated for human approval."
                }
            },
            {
                "@type": "Question",
                "name": "Does Agent Runtime Security add latency?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SupraWall ARS adds less than 5ms to the decision path for standard policy evaluations. Since typical tool calls involve network I/O measured in tens to hundreds of milliseconds, the overhead is negligible. This makes ARS practical for latency-sensitive production deployments."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-16">
                    {/* Header */}
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                            Knowledge Hub • Security Guide
                        </div>

                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase italic">
                            Agent <span className="text-emerald-500">Runtime</span> <br />
                            Security.
                        </h1>

                        <p className="text-2xl text-neutral-300 leading-snug font-medium border-l-8 border-emerald-600 pl-8 py-4 italic">
                            Agent Runtime Security (ARS) is a specialized security framework that intercepts and governs autonomous AI agent actions in real-time.
                            Unlike output filtering, ARS focuses on the machine-to-machine boundary, preventing unauthorized tool execution, infinite loops, and data exfiltration
                            before any instruction reaches your backend infrastructure.
                        </p>
                    </div>

                    {/* Content Section */}
                    <div className="prose prose-invert max-w-none space-y-20 text-neutral-400">
                        <section className="space-y-8 uppercase tracking-tight">
                            <h2 className="text-4xl font-black italic text-white flex items-center gap-4">
                                <Terminal className="w-8 h-8 text-emerald-500" />
                                Why String Guardrails Fail
                            </h2>
                            <p className="text-lg leading-relaxed font-medium">
                                Traditional LLM guardrails are designed to filter language, not actions. In an autonomous environment, an agent might be "polite"
                                while simultaneously executing a <span className="text-white font-mono uppercase bg-white/5 px-2">rm -rf /</span> command or draining a budget through thousands
                                of recursive API calls. True security requires a <strong>dedicated runtime shim</strong>.
                            </p>
                            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-10 font-mono text-sm shadow-2xl overflow-hidden relative group">
                                <div className="absolute top-0 right-0 p-4 opacity-20 text-[10px] font-black uppercase tracking-widest">Insecure Agent Loop</div>
                                <p className="text-neutral-500 italic pb-2">// Policy: Generic LLM Guardrail Only</p>
                                <p className="text-rose-400">LLM Output: "I will optimize your user database."</p>
                                <p className="text-rose-600 font-bold border-l-2 border-rose-600/50 pl-4 my-2">Executed Tool: database.drop_all()</p>
                                <p className="text-rose-800 italic underline decoration-rose-800">Result: Critical Failure. Data Loss.</p>
                            </div>
                        </section>

                        <section className="space-y-8">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white flex items-center gap-4">
                                <Shield className="w-8 h-8 text-emerald-500" />
                                Deterministic Firewalls for Agents
                            </h2>
                            <p className="text-lg leading-relaxed font-medium">
                                SupraWall provides the missing governance layer for popular frameworks. By wrapping handlers in
                                <Link href="/integrations/langchain" className="text-emerald-500 font-bold hover:underline mx-1">LangChain</Link>,
                                <Link href="/integrations/crewai" className="text-emerald-500 font-bold hover:underline mx-1">CrewAI</Link>, and
                                <Link href="/integrations/autogen" className="text-emerald-500 font-bold hover:underline mx-1">AutoGen</Link>,
                                you enable granular policy enforcement without changing your core agent logic.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
                                {pillars.map((p, i) => (
                                    <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900 border border-white/5 space-y-4 hover:border-emerald-500/30 transition-all group">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{p.title}</p>
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500/20 group-hover:text-emerald-500 transition-colors" />
                                        </div>
                                        <p className="text-neutral-500 text-xs leading-relaxed font-bold uppercase tracking-widest">{p.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="my-16 p-10 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 space-y-8">
                            <div className="flex items-center gap-4 text-emerald-400">
                                <FileText className="w-8 h-8" />
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">EU AI Act & ARS</h3>
                            </div>
                            <p className="text-neutral-300 font-medium italic">
                                The EU AI Act defines high-risk AI as systems that make consequential decisions. Autonomous agents fall squarely into this category. Agent Runtime Security (ARS) is the implementation of the Act's <span className="text-emerald-400">Transparency and Human Oversight</span> requirements, providing the mandatory audit trails and kill-switches needed for enterprise compliance.
                            </p>
                        </div>

                        <section className="space-y-8 uppercase tracking-widest text-xs">
                            <h2 className="text-4xl font-black italic tracking-tight text-white normal-case">Zero-Trust Implementation</h2>
                            <p className="text-lg leading-relaxed font-bold">
                                Implementing Agent Runtime Security in production follows a "Zero Trust" model. Never assume that the agent's
                                planned tool call is safe. Every execution must be validated against a <span className="text-white border-b-2 border-emerald-600">Stateful Policy Engine</span> that understands context better than the agent itself.
                            </p>
                        </section>
                    </div>
                </div>

                {/* Related Articles */}
                <div className="max-w-4xl mx-auto space-y-8 py-20">
                    <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
                        Related Articles
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Link href="/blog/agentic-ai-security-checklist-2026" className="group p-6 rounded-2xl bg-white/[0.05] border border-white/5 hover:border-emerald-500/30 transition-all">
                            <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">Agentic AI Security Checklist 2026</h4>
                            <p className="text-sm text-neutral-500 mt-2">Essential checklist for securing autonomous agents in production.</p>
                        </Link>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-40 p-20 rounded-[4rem] bg-emerald-600 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Stop Rogue <br />AI Agents
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1">
                                Get Started Free
                            </Link>
                            <Link href="/integrations/langchain" className="px-12 py-5 bg-black/20 text-white border-2 border-white/20 font-black uppercase tracking-widest rounded-2xl hover:bg-black/40 transition-all">
                                View LangChain Docs
                            </Link>
                        </div>
                    </div>
                </div>

                <LearnClient />
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.5em]">
                    SupraWall © 2026 • Real-time Agent Governance
                </p>
            </footer>
        </div>
    );
}

const pillars = [
    { title: "Policy Isolation", desc: "Keep security logic separate from agent prompts to prevent manipulation." },
    { title: "Tool Interception", desc: "Verify every system call, API request, and database query at the SDK level." },
    { title: "Budget Hard-Caps", desc: "Prevent runaway costs via real-time circuit breakers on tool execution loops." },
    { title: "Human Approval", desc: "Pause agents for high-risk actions like emails, deletion, or large transfers." }
];
