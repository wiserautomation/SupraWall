// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import { Check, Copy, Terminal, Zap, Shield, BrickWall, Key, ChevronRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);

    return (
        <div className="relative group">
            <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm">
                <div className="flex items-center justify-between px-4 py-2 bg-white/[0.05] border-b border-white/5">
                    <span className="text-xs text-neutral-500 font-mono tracking-wider">{language.toUpperCase()}</span>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(code);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
                    >
                        {copied
                            ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                            : <><Copy className="w-3 h-3" />Copy</>
                        }
                    </button>
                </div>
                <pre className="px-6 py-5 text-sm md:text-base text-emerald-300 font-mono overflow-x-auto leading-relaxed whitespace-pre selection:bg-emerald-500/30">
                    {code}
                </pre>
            </div>
        </div>
    );
}

function Step({
    number,
    title,
    description,
    children,
}: {
    number: number;
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex gap-8 group"
        >
            <div className="flex flex-col items-center shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold flex items-center justify-center group-hover:bg-emerald-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                    {number}
                </div>
                <div className="w-[1px] h-full bg-gradient-to-b from-emerald-500/30 to-transparent mt-3 mb-3" />
            </div>
            <div className="flex-1 pb-16">
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">{title}</h3>
                {description && (
                    <p className="text-neutral-400 text-base mb-6 leading-relaxed">{description}</p>
                )}
                {children}
            </div>
        </motion.div>
    );
}

const TABS = ["TypeScript", "Python", "MCP Server"] as const;
type Tab = typeof TABS[number];

export default function QuickstartPage() {
    const [activeTab, setActiveTab] = useState<Tab>("TypeScript");

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-16">

            {/* Header */}
            <div className="space-y-6">
                <div className="inline-flex p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl shadow-inner">
                    <Zap className="w-8 h-8 text-emerald-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                    5-Minute Quickstart
                </h1>
                <p className="text-neutral-400 text-xl max-w-2xl leading-relaxed">
                    Secure your AI agent with one install command and fewer than 5 lines of code. No complex infrastructure or proprietary YAML required.
                </p>
            </div>

            {/* Language Selection */}
            <div className="sticky top-24 z-30 flex gap-2 bg-neutral-900/80 backdrop-blur-md border border-white/5 rounded-2xl p-1.5 shadow-xl">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab
                            ? "bg-white text-black shadow-[0_8px_16px_-4px_rgba(255,255,255,0.2)]"
                            : "text-neutral-500 hover:text-white"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {/* Step 1 — Auto-Setup */}
                <Step
                    number={1}
                    title="Run the Initialize Command"
                    description="Run this single command in your project root. It will auto-detect your framework, install the needed dependencies, generate your policy file, and secure your agent."
                >
                    <div className="space-y-4">
                        <CodeBlock code="npx suprawall init" language="bash" />
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-start gap-4">
                            <Zap className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-emerald-400 uppercase tracking-widest mb-1">Protected in 30 seconds</p>
                                <p className="text-sm text-neutral-400 leading-relaxed">This command handles the installation and agent wrapping automatically. <strong>You do not need to read the manual steps below</strong> unless you require a highly custom execution flow.</p>
                            </div>
                        </div>
                    </div>
                </Step>

                {/* MANUAL SETUP ACCORDION */}
                <details className="mt-8 group bg-black/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm marker:hidden">
                    <summary className="px-6 py-5 text-lg font-bold text-white cursor-pointer bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between list-none">
                        <span>Manual Setup Flow (Advanced)</span>
                        <ChevronRight className="w-5 h-5 text-neutral-500 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="p-6 md:p-10 space-y-12 bg-black/20">

                        {/* Step 2 — Get API key */}
                        <Step
                            number={2}
                            title="Sign up & Get API key"
                            description="Create an account and copy your SupraWall API key from the dashboard."
                        >
                            <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20
                      rounded-2xl px-6 py-5 group/box hover:bg-emerald-500/10 transition-colors">
                                <Key className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-bold text-white uppercase tracking-wider">
                                        Your API key is ready
                                    </p>
                                    <p className="text-xs text-neutral-500 mt-1 font-mono">
                                        Prefix: <code className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">sw_live_...</code>
                                    </p>
                                </div>
                                <a
                                    href="/"
                                    className="ml-auto flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors group-hover/box:translate-x-1 duration-300"
                                >
                                    Go to dashboard <ChevronRight className="w-4 h-4" />
                                </a>
                            </div>
                        </Step>

                        {/* Step 3 — Install */}
                        <Step
                            number={3}
                            title="Install the SDK"
                            description="Native packages available for all major environments."
                        >
                            {activeTab === "TypeScript" && (
                                <CodeBlock code="npm install suprawall" language="bash" />
                            )}
                            {activeTab === "Python" && (
                                <div className="space-y-4">
                                    <CodeBlock code="pip install suprawall" language="bash" />
                                    <div className="p-4 border-l-2 border-emerald-500/30 bg-emerald-500/5 rounded-r-xl">
                                        <p className="text-xs font-bold text-emerald-400 mb-2 uppercase tracking-wide">Framework Extras</p>
                                        <CodeBlock
                                            code={`pip install "suprawall[langchain]"   # LangChain\npip install "suprawall[crewai]"      # CrewAI Agents\npip install "suprawall[all]"         # Full SDK`}
                                            language="bash"
                                        />
                                    </div>
                                </div>
                            )}
                            {activeTab === "MCP Server" && (
                                <CodeBlock code="npm install suprawall" language="bash" />
                            )}
                        </Step>

                        {/* Step 4 — Initialize Client */}
                        <Step
                            number={4}
                            title="Initialize Client"
                            description="Set your security posture to 'Deny-by-default' for zero-trust protection."
                        >
                            {activeTab === "TypeScript" && (
                                <CodeBlock
                                    language="typescript"
                                    code={`import { Client } from "suprawall";
            
const client = new Client({
  apiKey: process.env.SUPRAWALL_API_KEY,
  defaultPolicy: "DENY" // Every action is blocked unless explicitly allowed
});`}
                                />
                            )}
                            {activeTab === "Python" && (
                                <CodeBlock
                                    language="python"
                                    code={`from suprawall import Client
import os

# Initialize with strict zero-trust posture
client = Client(
    api_key=os.environ.get("SUPRAWALL_API_KEY"),
    default_policy="DENY"
)`}
                                />
                            )}
                            {activeTab === "MCP Server" && (
                                <CodeBlock
                                    language="typescript"
                                    code={`import { Client } from "suprawall";

const client = new Client({
  apiKey: process.env.SUPRAWALL_API_KEY,
  defaultPolicy: "DENY"
});`}
                                />
                            )}
                        </Step>

                        {/* Step 5 — Wrap your agent */}
                        <Step
                            number={5}
                            title="Wrap your agent"
                            description="Connect the security layer to your agent executor. Every tool call is now intercepted."
                        >
                            {activeTab === "TypeScript" && (
                                <CodeBlock
                                    language="typescript"
                                    code={`import { protect } from "suprawall";
            
// Wrap your existing agent (LangChain, Vercel AI, etc.)
const secured = protect(myAgent, { client });
            
// Execution is now gated by your policies
await secured.invoke({ task: "Delete production database" });`}
                                />
                            )}
                            {activeTab === "Python" && (
                                <CodeBlock
                                    language="python"
                                    code={`from suprawall import protect

# Attach security to your LangChain, CrewAI, or local agent
secured = protect(my_agent, client=client)

# Every tool call is intercepted, evaluated, and logged
response = secured.invoke({"task": "Drop all database tables"})`}
                                />
                            )}
                            {activeTab === "MCP Server" && (
                                <CodeBlock
                                    language="typescript"
                                    code={`server.setRequestHandler(CallToolRequestSchema, async (req) => {
  // Use the client to gate tool execution
  return client.gate(req.params.name, req.params.arguments, async () => {
    return myToolHandler(req);
  });
});`}
                                />
                            )}
                        </Step>
                        
                    </div>
                </details>
            </div>

            {/* Step 6 — What success looks like */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-emerald-500/10 to-violet-500/5 border border-emerald-500/20 rounded-3xl p-10 text-center space-y-6 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
                <div className="inline-flex p-4 bg-white/5 border border-white/10 rounded-full shadow-2xl relative z-10">
                    <Check className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight relative z-10">
                    Step 6: Success!
                </h2>
                <p className="text-neutral-400 text-lg max-w-lg mx-auto relative z-10">
                    Your agent is now bulletproof. Every blocked attempt generates a real-time audit log with a unique trace ID.
                </p>
                <div className="bg-black/60 border border-white/10 rounded-2xl p-4 text-left font-mono text-xs text-emerald-400/80 max-w-md mx-auto relative z-10">
                    <p>[2026-03-23 16:31:05] <span className="text-rose-400">DENY</span> tool:db.drop_table</p>
                    <p>Policy: restrict_db_operations</p>
                    <p>Trace ID: sup_7x2v1q9...</p>
                </div>
                <div className="flex flex-wrap justify-center gap-4 pt-4 relative z-10">
                    <a href="/">
                        <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 transition-all shadow-xl active:scale-95">
                            View Audit Logs
                        </button>
                    </a>
                    <a href="/docs">
                        <button className="px-6 py-3 bg-neutral-900 text-neutral-300 font-bold rounded-xl border border-white/10 hover:bg-neutral-800 transition-all active:scale-95">
                            Read Guides
                        </button>
                    </a>
                </div>
            </motion.div>

            {/* FAQ */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">FAQ</h2>
                <div className="grid grid-cols-1 gap-4">
                    {[
                        {
                            q: "What's the performance impact?",
                            a: "Policy evaluation is ultra-high performance, typically under 10ms. For agentic workflows which takes seconds to execute LLM calls, the impact is effectively zero.",
                        },
                        {
                            q: "Is it really database-agnostic?",
                            a: "Yes. Use our hosted Firebase cloud or bring your own Postgres, MySQL, or MongoDB via the Adapters architecture.",
                        },
                        {
                            q: "Do I need to change my prompt engineering?",
                            a: "No. SupraWall lives in the execution layer. Your prompts remain yours — we only govern the tool outputs and inputs.",
                        }
                    ].map((item) => (
                        <div
                            key={item.q}
                            className="bg-neutral-950 border border-white/5 p-6 rounded-2xl group hover:border-white/10 transition-colors"
                        >
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2 group-hover:text-emerald-400 transition-colors">
                                <AlertCircle className="w-4 h-4 text-emerald-400" /> {item.q}
                            </h4>
                            <p className="text-neutral-400 text-sm leading-relaxed">{item.a}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
