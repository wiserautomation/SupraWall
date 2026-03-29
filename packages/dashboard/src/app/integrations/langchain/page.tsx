// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { ArrowRight, Code2, Shield, Zap, Terminal, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import LangChainClient from "./LangChainClient";

export const metadata: Metadata = {
    title: "Security for LangChain Agents | EU AI Act Compliance | SupraWall",
    description: "Learn how to secure LangChain agents with runtime guardrails and ensure EU AI Act compliance (Articles 12 & 14) using SupraWall. Prevent prompt injection and rogue tool execution.",
    keywords: ["langchain agent security", "secure langchain agents", "langchain guardrails", "langchain prompt injection", "eu ai act langchain", "ai act compliance"],    alternates: {
        canonical: 'https://www.supra-wall.com/integrations/langchain',
    },

};

export default function LangChainIntegrationPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for LangChain",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "url": "https://www.supra-wall.com/integrations/langchain",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "description": "Enterprise security and runtime guardrails for LangChain agents and chains.",
        "sameAs": [
            "https://github.com/suprawall",
            "https://pypi.org/project/suprawall"
        ],
        "featureList": [
            "Tool Execution Policy",
            "Prompt Injection Prevention",
            "Real-time Audit Logs",
            "Human-in-the-loop Approvals"
        ]
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "How to secure LangChain agents",
        "description": "Step-by-step guide to securing your LangChain agents using SupraWall runtime guardrails.",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Install the SDK",
                "text": "Run 'pip install suprawall' for Python or 'npm install @suprawall/sdk' for Node.js."
            },
            {
                "@type": "HowToStep",
                "name": "Initialize the protector",
                "text": "Import the 'protect' helper from 'suprawall.langchain' in your Python script."
            },
            {
                "@type": "HowToStep",
                "name": "Wrap your agent",
                "text": "Wrap your LangChain AgentExecutor or Graph with the 'protect' helper to enable zero-trust interception."
            },
            {
                "@type": "HowToStep",
                "name": "Configure policies",
                "text": "Define tool-level ALLOW/DENY rules in the SupraWall dashboard for real-time enforcement."
            }
        ]
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How do I secure a LangChain agent?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can secure a LangChain agent by using a runtime security layer like SupraWall. It intercepts tool calls via callbacks to verify them against your security policies before execution."
                }
            },
            {
                "@type": "Question",
                "name": "Does SupraWall slow down LangChain performance?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No, SupraWall is designed for low-latency interception. Policies are evaluated locally or via an optimized edge firewall, ensuring near-zero impact on agent response times."
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-12 space-y-10 relative z-10 text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase mx-auto">
                            Infrastructure • LangChain Official
                        </div>

                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            Security for <br />
                            <span className="text-emerald-500 text-7xl md:text-[10rem]">LangChain</span> <br />
                            Agents
                        </h1>

                        <div className="max-w-3xl mx-auto">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                LangChain agent security is critical for production AI systems to prevent prompt injection and unauthorized shell access.
                                SupraWall provides a zero-trust runtime security layer that intercepts and validates every tool call against enterprise-grade policies,
                                ensuring your agents operate within safe boundaries.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 pt-8">
                            <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-2">
                                Secure My Agent <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-12">
                        <div className="max-w-4xl mx-auto prose prose-invert prose-emerald">

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10">
                                Global Callback Shield
                            </h2>
                            <p className="text-neutral-400 uppercase text-xs font-bold tracking-widest mb-6">
                                Standard integration across Python or Node.js
                            </p>
                            <div className="bg-neutral-900 rounded-3xl p-8 border border-white/5 font-mono text-emerald-400 shadow-2xl">
                                <p># Python</p>
                                <p className="mb-4 text-emerald-500">pip install <span className="text-white font-bold">suprawall</span></p>
                                <p className="text-neutral-500"># and wrap your executor</p>
                                <p className="text-emerald-300">from <span className="text-white">suprawall.langchain</span> import <span className="text-white">protect</span></p>
                                <p className="text-emerald-300">secured_agent = protect(agent_executor)</p>
                            </div>

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-8">
                                Tool Interception Architecture
                            </h2>
                            <p className="text-lg text-neutral-400 font-medium leading-relaxed italic">
                                SupraWall sits between the LLM and the environment. When an autonomous agent decides to use a tool,
                                our callback handler triggers, verifying the intent and payload before any compute is consumed.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-20">
                                <div className="p-10 rounded-[2.5rem] bg-white/[0.05] border border-white/5">
                                    <Terminal className="w-8 h-8 text-emerald-500 mb-4" />
                                    <h4 className="font-bold uppercase text-white tracking-widest text-sm mb-2">Bash & Python REPL</h4>
                                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-tight">Detects and blocks destructive `rm`, `chmod`, and data exfiltration commands.</p>
                                </div>
                                <div className="p-10 rounded-[2.5rem] bg-white/[0.05] border border-white/5">
                                    <Shield className="w-8 h-8 text-emerald-500 mb-4" />
                                    <h4 className="font-bold uppercase text-white tracking-widest text-sm mb-2">Database Connectors</h4>
                                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-tight">Enforces read-only policies or blocks DROP/TRUNCATE operations instantly.</p>
                                </div>
                            </div>

                            <div className="my-16 p-10 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 space-y-8">
                                <div className="flex items-center gap-4 text-emerald-400">
                                    <FileText className="w-8 h-8" />
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight">EU AI Act Compliance</h3>
                                </div>
                                <p className="text-neutral-300 font-medium italic">
                                    Large-scale LangChain deployments are subject to the EU AI Act's strict oversight rules. SupraWall automates your <span className="text-emerald-400">Logging (Article 12)</span> and <span className="text-emerald-400">Technical Documentation (Article 11)</span> requirements by providing a tamper-proof record of every autonomous tool execution and security decision.
                                </p>
                            </div>

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                LangChain-Specific Threat Monitoring
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6 font-medium leading-relaxed">
                                Autonomous agents are vulnerable to indirect prompt injection through search results or file reading.
                                SupraWall specifically monitors the <span className="text-white font-mono uppercase bg-white/5 px-2 py-1 rounded">AgentAction</span> payload
                                to verify the intent matches the assigned policy for the current user session, preventing malicious data from hijacking the agent loop.
                            </p>

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-20">
                                Multi-Tenant Policy Governance
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6 font-medium leading-relaxed">
                                Define your constraints in our visual dashboard or via code. Example policy for a LangChain financial agent:
                            </p>
                            <div className="bg-neutral-900 rounded-[2.5rem] p-12 border border-white/5 font-mono text-sm text-neutral-300 mt-8">
                                <pre className="text-emerald-400">{`{
  "tool": "plaid_transfer",
  "rule": "REQUIRE_APPROVAL",
  "condition": { "amount": "> 500" }
}`}</pre>
                            </div>

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10">
                                Production Security Checklist
                            </h2>
                            <div className="space-y-4">
                                {[
                                    "Enable Callback Handlers in AgentExecutor",
                                    "Configure Fail-Closed policy for network errors",
                                    "Set session-based budget limits",
                                    "Audit all 'shell' and 'google_search' tools",
                                    "Enable Slack/Telegram approvals for write-actions"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        <span className="text-sm font-bold uppercase tracking-tight text-neutral-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <LangChainClient />

                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-emerald-600 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Ready to secure <br />your swarm?
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1">
                                Start Building for Free
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
