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
                {/* Step 1 — Get API key */}
                <Step
                    number={1}
                    title="Get your API key"
                    description="Create an account and copy your API key from the core dashboard."
                >
                    <div className="flex items-center gap-4 bg-emerald-500/5 border border-emerald-500/20
              rounded-2xl px-6 py-5 group/box hover:bg-emerald-500/10 transition-colors">
                        <Key className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-bold text-white uppercase tracking-wider">
                                Your API key is ready
                            </p>
                            <p className="text-xs text-neutral-500 mt-1 font-mono">
                                Prefix: <code className="text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">ag_live_...</code>
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

                {/* Step 2 — Install */}
                <Step
                    number={2}
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
                                    code={`pip install "suprawall[langchain]"   # LangChain\npip install "suprawall[openai]"      # OpenAI Agents\npip install "suprawall[all]"         # Full SDK`}
                                    language="bash"
                                />
                            </div>
                        </div>
                    )}
                    {activeTab === "MCP Server" && (
                        <CodeBlock code="npm install suprawall" language="bash" />
                    )}
                </Step>

                {/* Step 3 — Wrap your agent */}
                <Step
                    number={3}
                    title="Wrap your agent"
                    description="One line of code. Your agent works exactly the same — every tool call is now intercepted and policy-checked."
                >
                    {activeTab === "TypeScript" && (
                        <CodeBlock
                            language="typescript"
                            code={`import { protect } from "@suprawall/sdk";
    
    // 1. Any agent (LangChain, Vercel AI, etc.)
    const agent = createMyAgent();
    
    // 2. Wrap it with SupraWall (Zero-Config)
    const secured = protect(agent, {
      apiKey: "ag_your_key_here",
    });
    
    // 3. Every action is now governed
    await secured.invoke({ ... });`}
                        />
                    )}
                    {activeTab === "Python" && (
                        <div className="space-y-6">
                            <CodeBlock
                                language="python"
                                code={`from suprawall import secure
from crewai import Agent

# 🛡️ Secure your agent runtime with one line
@secure(api_key="ag_your_key_here")
def setup_agent():
    return Agent(role="Researcher", goal="Solve X", tools=[...])

agent = setup_agent()
agent.start()`}
                            />
                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                                <p className="text-sm font-bold text-emerald-400 mb-2 underline decoration-emerald-500/30 underline-offset-4">LangChain Wrapper</p>
                                <CodeBlock
                                    language="python"
                                    code={`from suprawall import secure

# Intercepts every tool call automatically
secured_agent = secure(my_langchain_agent, api_key="ag_...")
secured_agent.invoke({"input": "..."})`}
                                />
                            </div>
                        </div>
                    )}
                    {activeTab === "MCP Server" && (
                        <CodeBlock
                            language="typescript"
                            code={`import { createSupraWallMiddleware } from "suprawall";
    
    const gate = createSupraWallMiddleware({
      apiKey: "ag_your_key_here",
    });
    
    server.setRequestHandler(CallToolRequestSchema, async (req) => {
      // Middleware intercepts the request
      return gate(req.params.name, req.params.arguments, async () => {
        return myTargetHandler(req); // Your actual tool logic 
      });
    });`}
                        />
                    )}
                </Step>

                {/* Step 4 — Set policies */}
                <Step
                    number={4}
                    title="Enforce Policies"
                    description="Update governance in real-time from the dashboard. No code changes, no redeployment."
                >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            {
                                label: "ALLOW",
                                color: "bg-emerald-500/5 border-emerald-500/20",
                                textColor: "text-emerald-400",
                                desc: "Executes normally",
                                examples: ["read_file", "search_web"],
                            },
                            {
                                label: "DENY",
                                color: "bg-rose-500/5 border-rose-500/20",
                                textColor: "text-rose-400",
                                desc: "Blocked immediately",
                                examples: ["delete_*", "drop_db"],
                            },
                            {
                                label: "APPROVE",
                                color: "bg-amber-500/5 border-amber-500/20",
                                textColor: "text-amber-400",
                                desc: "Pause for human",
                                examples: ["send_email", "pay_user"],
                            },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className={`border rounded-2xl p-5 ${item.color} hover:bg-white/[0.05] transition-colors duration-300`}
                            >
                                <p className={`text-xs font-extrabold mb-1 tracking-widest ${item.textColor}`}>
                                    {item.label}
                                </p>
                                <p className="text-sm text-neutral-400 mb-4">{item.desc}</p>
                                <div className="flex flex-wrap gap-1">
                                    {item.examples.map(ex => (
                                        <code key={ex} className="text-[10px] font-mono text-neutral-500 bg-black/40 px-1.5 py-0.5 rounded border border-white/5">{ex}</code>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Step>
            </div>

            {/* Success Area */}
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
                    Your agent is now bulletproof.
                </h2>
                <p className="text-neutral-400 text-lg max-w-lg mx-auto relative z-10">
                    Every tool call is now policy-checked, audited, and logged. Deploy with confidence.
                </p>
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
