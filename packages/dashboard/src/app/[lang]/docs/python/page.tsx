// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Terminal, Copy, Check, Zap, Shield, Code, Cpu, BookOpen } from "lucide-react";
import { useState } from "react";

export default function PythonDocsPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const CodeBlock = ({ code, id, language = "python" }: { code: string, id: string, language?: string }) => (
        <div className="relative group mt-4 mb-6">
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => copyToClipboard(code, id)}
                    className="p-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                    {copied === id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-neutral-400" />}
                </button>
            </div>
            <pre className="p-6 rounded-xl bg-[#0a0a0a] border border-white/5 overflow-x-auto font-mono text-sm leading-relaxed text-neutral-300">
                <code>{code}</code>
            </pre>
        </div>
    );

    return (
        <div className="max-w-4xl pb-20">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Terminal className="w-6 h-6 text-emerald-500" />
                </div>
                <span className="text-emerald-500 font-mono text-sm font-semibold tracking-wider uppercase">SDK Reference</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
                Python SDK
            </h1>

            <p className="text-xl text-neutral-400 mb-12 leading-relaxed max-w-2xl">
                The official SupraWall Python library for securing AI agents. Implement 
                Enterprise-grade guardrails, vault injection, and live monitoring with a single line of code.
            </p>

            {/* Installation */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-500" /> Installation
                </h2>
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-200 text-sm mb-4">
                    <strong>Note:</strong> Requires Python 3.9+
                </div>
                <CodeBlock 
                    id="install"
                    language="bash"
                    code="pip install suprawall-sdk"
                />
            </section>

            {/* Quickstart */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" /> Quickstart
                </h2>
                <p className="text-neutral-400 mb-4">
                    The simplest way to use SupraWall is via the <code className="text-emerald-400">SupraWall</code> convenience class. It automatically handles authentication and middleware configuration.
                </p>
                <CodeBlock 
                    id="quickstart"
                    code={`from suprawall import SupraWall

# 1. Initialize with your API Key
supra = SupraWall("ag_your_api_key")

# 2. Protect any agent or function
agent = supra.protect(my_agent)

# 3. Running the agent automatically triggers policy evaluation
response = agent.invoke("Transfer $500 to my savings account")`}
                />
            </section>

            {/* Frameworks */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-10 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-emerald-500" /> Framework Integrations
                </h2>

                <div className="grid gap-8">
                    <div className="p-8 rounded-2xl bg-white/[0.05] border border-white/5">
                        <h3 className="text-lg font-semibold mb-4 text-white">LangChain</h3>
                        <p className="text-neutral-400 text-sm mb-6">
                            SupraWall wraps any <code className="text-emerald-400">Runnable</code> and injects security checks into the executive loop.
                        </p>
                        <CodeBlock 
                            id="langchain"
                            code={`from langchain_openai import ChatOpenAI
from suprawall import SupraWall

supra = SupraWall("ag_...")
llm = ChatOpenAI(model="gpt-4o")

# Wrap the chain
chain = supra.protect(llm | my_prompt | my_tools)

chain.invoke("Delete all files") # Blocked by SupraWall locally or in cloud`}
                        />
                    </div>

                    <div className="p-8 rounded-2xl bg-white/[0.05] border border-white/5">
                        <h3 className="text-lg font-semibold mb-4 text-white">CrewAI</h3>
                        <p className="text-neutral-400 text-sm mb-6">
                            Protect entire Crews or individual Agents to ensure task completion follows your organizational policies.
                        </p>
                        <CodeBlock 
                            id="crewai"
                            code={`from crewai import Agent, Crew
from suprawall import SupraWall

supra = SupraWall("ag_...")

# Secure the entire crew
crew = supra.protect(Crew(
    agents=[researcher, writer],
    tasks=[task1, task2]
))

crew.kickoff()`}
                        />
                    </div>
                </div>
            </section>

            {/* Policy Enforcement — Token Limits & PII */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" /> Runtime Enforcement
                </h2>
                <p className="text-neutral-400 mb-6">
                    Define deterministic policies for <code className="text-emerald-400">token_limits</code>, <code className="text-emerald-400">budget_caps</code>, 
                    and <code className="text-emerald-400">pii_scrubbing</code>.
                </p>
                <div className="space-y-6">
                    <div className="p-8 rounded-2xl bg-white/[0.05] border border-white/5">
                        <h3 className="text-lg font-semibold mb-4 text-white">Token & Budget Limits</h3>
                        <CodeBlock 
                            id="token-limits"
                            code={`# Set per-call and monthly token limits for LLM agents
supra.enforce("token_limit", { 
    max_tokens: 4000, 
    monthly_budget_usd: 50.0 
})

# Automatic circuit breaker for infinite loops
supra.enforce("loop_detection", { threshold: 5, action: "BLOCK" })`}
                        />
                    </div>

                    <div className="p-8 rounded-2xl bg-white/[0.05] border border-white/5">
                        <h3 className="text-lg font-semibold mb-4 text-white">PII Scrubbing & Redaction</h3>
                        <CodeBlock 
                            id="pii-scrubbing"
                            code={`# Redact sensitive data from outbound tool calls
supra.redact("email", "phone", "ssn")

# Use custom regex for proprietary secret patterns
supra.redact(pattern=r"sk-prod-[a-zA-Z0-9]{32}")`}
                        />
                    </div>
                </div>
            </section>

            {/* Vault Injection */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" /> Vault & Zero-Trust
                </h2>
                <p className="text-neutral-400 mb-6">
                    Suprawall Python SDK's vault injection prevents secret exfiltration from LLM context windows. 
                    Tokens like <code className="text-emerald-400">$SUPRAWALL_VAULT_...</code> are resolved just-in-time.
                </p>
                <CodeBlock 
                    id="vault"
                    code={`from suprawall import SupraWall
supra = SupraWall("ag_...")

# Resolve secrets at the edge for zero-knowledge tool execution
result = supra.protect(my_tool).run({
    "api_key": "$SUPRAWALL_VAULT_SENDGRID_KEY",
    "recipient": "user@example.com"
})`}
                />
            </section>

            {/* Advanced Usage */}
            <section>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" /> Advanced Options
                </h2>
                <CodeBlock 
                    id="advanced"
                    code={`from suprawall import SupraWall, SupraWallOptions

options = SupraWallOptions(
    api_key="ag_...",
    environment="production",
    timeout=5.0, # Fail-fast for low latency
    fail_open=False # Strict security: block if SupraWall Cloud is unreachable
)

supra = SupraWall(options=options)`}
                />
            </section>

            {/* Support Footer */}
            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h4 className="text-white font-semibold mb-1">Need help with Python?</h4>
                    <p className="text-neutral-400 text-sm">Our team of security engineers is available for implementation reviews.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition">
                        Join Discord
                    </button>
                    <button className="px-6 py-2 rounded-lg bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 transition">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
}
