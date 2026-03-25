// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { Shield, Zap, Server, MessageSquare, Terminal, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function AutoGenDocs() {
    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider">Framework Guide</span>
                    <span className="px-3 py-1 bg-neutral-500/20 text-neutral-300 rounded-full text-xs font-semibold uppercase tracking-wider">Python</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    Microsoft AutoGen
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    Secure multi-agent conversations and tool execution handoffs in AutoGen workflows.
                </p>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">1. Installation</h2>
                    <CodeBlock code="pip install suprawall pyautogen" language="bash" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">2. Securing the Conversation</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                        Wrap your AutoGen UserProxyAgent to monitor and intercept tools before they are executed in the local environment.
                    </p>
                    <CodeBlock 
                        language="python" 
                        code={`import autogen
from suprawall import Client, secure_agent
import os

# 1. Initialize SupraWall with Deny-by-default
sw = Client(api_key=os.environ.get("SUPRAWALL_API_KEY"), default_policy="DENY")

# 2. Setup your AutoGen agents
assistant = autogen.AssistantAgent("assistant", llm_config=...)
user_proxy = autogen.UserProxyAgent("user_proxy", ...)

# 🛡️ Secure the user proxy
# Every tool call attempted by user_proxy is now gated by SupraWall.
secured_proxy = secure_agent(user_proxy, client=sw)

# 3. Execute conversation
secured_proxy.initiate_chat(assistant, message="Analyze data.")`} 
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">Multi-Agent Security Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: "Handoff Analysis", desc: "Monitors tool calls as they pass between agents.", icon: MessageSquare },
                            { title: "Docker Sandbox Support", desc: "Integrates with AutoGen's Docker-based tool execution.", icon: Server },
                            { title: "Intent Verification", desc: "Cross-checks LLM intent against the active security policy.", icon: Shield },
                            { title: "Live Handoff Logs", desc: "Real-time visibility into agent-to-agent tool requests.", icon: Terminal }
                        ].map((b, i) => (
                            <div key={i} className="p-5 rounded-xl bg-neutral-900 border border-white/5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <b.icon className="w-5 h-5 text-emerald-400" />
                                    <h4 className="font-bold text-white">{b.title}</h4>
                                </div>
                                <p className="text-xs text-neutral-500 leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <Link href="/docs/frameworks/vercel-ai" className="text-neutral-400 hover:text-white transition-colors text-sm">← Vercel AI SDK</Link>
                <Link href="/docs/frameworks/crewai" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center">CrewAI →</Link>
            </div>
        </div>
    );
}
