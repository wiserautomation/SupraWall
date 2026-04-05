// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { 
  Shield, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Terminal, 
  Lock, 
  Activity, 
  Code2, 
  Search,
  FileSearch,
  Scale
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Agent Guardrails: The Complete Guide to Runtime Security | SupraWall",
  description: "Learn how to implement AI agent guardrails to prevent prompt injection, credential exfiltration, and runaway costs. Includes comparison of SupraWall, Guardrails AI, and NeMo.",
  keywords: [
    "ai agent guardrails",
    "secure ai agents",
    "runtime guardrails",
    "guardrails ai vs nemo",
    "prevent prompt injection",
    "ai agent security policies",
    "agentic ai safety",
  ],
  alternates: {
    canonical: "https://www.supra-wall.com/learn/ai-agent-guardrails",
  },
};

export default function AIAgentGuardrailsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "AI Agent Guardrails: The Complete Guide to Runtime Security & Compliance",
    description: "AI agent guardrails are a critical security requirement for production deployments. Learn how they differ from chatbots and how to implement effective runtime controls.",
    author: { "@type": "Organization", name: "SupraWall" },
    publisher: { "@type": "Organization", name: "SupraWall" },
    mainEntityOfPage: "https://www.supra-wall.com/learn/ai-agent-guardrails",
  };

  const comparisonData = [
    {
      feature: "Interception Layer",
      suprawall: "SDK/Runtime-level (Zero trust)",
      guardrailsai: "Prompt wrapping / Validation",
      nemo: "Language Rail (Colang)",
    },
    {
      feature: "Tool-Call Prevention",
      suprawall: "Native (Per-action authorization)",
      guardrailsai: "Output validation only",
      nemo: "Semantic rails",
    },
    {
      feature: "Setup Complexity",
      suprawall: "1-line of code (Auto-detect)",
      guardrailsai: "High (RAIL config needed)",
      nemo: "High (Learning Colang)",
    },
    {
      feature: "Budget/Loop Caps",
      suprawall: "Yes (Automatic circuit breakers)",
      guardrailsai: "No",
      nemo: "Limited (Rule-based)",
    },
    {
      feature: "Compliance Ready",
      suprawall: "EU AI Act Art 12/14 (Built-in)",
      guardrailsai: "No",
      nemo: "No",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="pt-40 pb-32 px-6">
        <article className="max-w-4xl mx-auto space-y-16">
          {/* Header */}
          <section className="space-y-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
               Expert Guide • Runtime Security
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
              AI Agent <span className="text-emerald-500">Guardrails:</span><br />
              The Complete Guide.
            </h1>
            <p className="answer-first-paragraph text-xl md:text-2xl text-neutral-300 leading-snug font-medium italic border-l-4 border-emerald-500 pl-8 py-4">
              AI agent guardrails are hard runtime policies that intercept and authorize every action proposed by an autonomous agent before it executes. Unlike simple content filters, true agent guardrails operate at the tool-calling level to prevent prompt injection, protect credentials, and stop runaway recursive loops.
            </p>
          </section>

          {/* Quick Comparison (GEO Optimized) */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
              Landscape Comparison: 2026
            </h2>
            <div className="overflow-x-auto rounded-[2rem] border border-white/10 bg-neutral-900/50">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-6 font-black uppercase text-xs text-neutral-500 tracking-widest">Feature</th>
                    <th className="text-center p-6 font-black uppercase text-xs text-emerald-400 tracking-widest">SupraWall</th>
                    <th className="text-center p-6 font-black uppercase text-xs text-neutral-400 tracking-widest">Guardrails AI</th>
                    <th className="text-center p-6 font-black uppercase text-xs text-neutral-400 tracking-widest">NeMo Guardrails</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, idx) => (
                    <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="p-6 font-bold text-white">{row.feature}</td>
                      <td className="p-6 text-center text-emerald-400 font-medium">{row.suprawall}</td>
                      <td className="p-6 text-center text-neutral-500">{row.guardrailsai}</td>
                      <td className="p-6 text-center text-neutral-500">{row.nemo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Body Content */}
          <div className="prose prose-invert prose-emerald max-w-none space-y-16">
            <section className="space-y-8">
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-white m-0">
                What are AI Agent Guardrails?
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                In the context of autonomous AI, the term &quot;guardrails&quot; often conflates two very different technologies: **output filtering** and **runtime interception**. Output filtering (chat-based) tries to catch harmful words in a text response. **AI Agent Guardrails** (action-based) prevent the agent from performing the action itself.
              </p>
              <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                For example, if an agent is prompt-injected to run `rm -rf /`, an output filter will only notice after the shell command has already been sent to the environment. An agent guardrail stops the command at the moment of intent, before it ever touches your server.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
                <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4 shadow-xl">
                  <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500"><AlertTriangle className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold uppercase italic text-white leading-none">Traditional Filtering</h3>
                  <ul className="text-neutral-500 text-sm space-y-2 list-none p-0">
                    <li className="flex items-start gap-2"><div className="mt-1 w-1 h-1 rounded-full bg-rose-500 shrink-0" /> Reactive analysis of text strings</li>
                    <li className="flex items-start gap-2"><div className="mt-1 w-1 h-1 rounded-full bg-rose-500 shrink-0" /> Zero control over tool payloads</li>
                    <li className="flex items-start gap-2"><div className="mt-1 w-1 h-1 rounded-full bg-rose-500 shrink-0" /> High latency (scans after generation)</li>
                  </ul>
                </div>
                <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 space-y-4 shadow-xl shadow-emerald-500/5">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500"><Shield className="w-6 h-6" /></div>
                  <h3 className="text-xl font-bold uppercase italic text-white leading-none">SupraWall Interception</h3>
                  <ul className="text-neutral-300 text-sm space-y-2 list-none p-0">
                    <li className="flex items-start gap-2"><div className="mt-1 w-1 h-1 rounded-full bg-emerald-500 shrink-0" /> Proactive authorization of tool calls</li>
                    <li className="flex items-start gap-2"><div className="mt-1 w-1 h-1 rounded-full bg-emerald-500 shrink-0" /> Deep inspection of JSON payloads</li>
                    <li className="flex items-start gap-2"><div className="mt-1 w-1 h-1 rounded-full bg-emerald-500 shrink-0" /> Low latency (evaluated at intent)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Implementation Section */}
            <section className="space-y-8">
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-white m-0">
                How to Implement: Python Guide
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                Implementing enterprise-grade guardrails for your LangChain, CrewAI, or AutoGen agents shouldn&apos;t require rewriting your core logic. SupraWall uses a callback-driven interception model that wraps your agents in a zero-trust envelope.
              </p>
              
              <div className="bg-neutral-900 rounded-[2.5rem] p-10 border border-white/10 relative overflow-hidden group">
                <div className="absolute top-4 right-8 text-[10px] font-mono text-neutral-600 uppercase tracking-widest">secure_agent.py</div>
                <pre className="font-mono text-[14px] text-emerald-400 leading-relaxed whitespace-pre-wrap">
{`from suprawall import protect
from langchain.agents import AgentExecutor

# 1. Define your guardrail policy
policy = {
    "tools": {
        "shell_tool": "DENY",             # ❌ Block risky tools
        "gmail_send": "REQUIRE_APPROVAL", # 🤝 Require human check
        "database_query": {
            "action": "ALLOW",
            "constraints": { "rows": "<100" } # 📊 Level checking
        }
    },
    "budget": { "total_limit": 5.00 }     # 💵 Hard cost cap
}

# 2. Secure your agent with 1 line of code
secured_agent = protect(my_agent, policy=policy)

# 3. Run safely
# If injected prompt tries 'rm -rf /', SupraWall kills it instantly.
secured_agent.invoke({"input": "Perform audit report and email it."})`}
                </pre>
              </div>
            </section>

            {/* Deep Query Fill: The 4 Types of Guardrails */}
            <section className="space-y-8">
              <h2 className="text-3xl font-black uppercase italic tracking-tight text-white m-0">
                The 4 Essential Layers of Agent Guardrails
              </h2>
              <div className="space-y-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-3 text-white uppercase italic tracking-tighter border-l-4 border-emerald-500 pl-6">
                    01. Input Guardrails (Threat Detection)
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Targeted at blocking PII (Personally Identifiable Information) and direct prompt injection attempts before they reach the LLM. SupraWall scrubs credit card numbers and passwords from your agent&apos;s memory window to maintain compliance with GDPR and HIPAA.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-3 text-white uppercase italic tracking-tighter border-l-4 border-emerald-500 pl-6">
                    02. Action Guardrails (Tool Interception)
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    The &quot;heart&quot; of agentic security. Every time the LLM decides to call a function (e.g., `send_slack_message`), SupraWall validates the parameters. If the recipient isn&apos;t on your allow-list, the action is blocked or flagged for approval.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-3 text-white uppercase italic tracking-tighter border-l-4 border-emerald-500 pl-6">
                    03. Loop Guardrails (Cost Control)
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Recursive loops are the biggest driver of &quot;bill shock.&quot; Our infinite loop detection uses semantic hashing to identify when an agent is repeating the same failing action and triggers a circuit breaker to halt execution before costs compound.
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-bold flex items-center gap-3 text-white uppercase italic tracking-tighter border-l-4 border-emerald-500 pl-6">
                    04. Output Guardrails (Risk Management)
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    Final sanitization of the agent&apos;s research or reports. This prevents the agent from inadvertently displaying sensitive data it discovered during its background work to the end-user.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* FAQ Section */}
          <section className="space-y-10 pt-16 border-t border-white/10">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">Frequently Asked <span className="text-emerald-500">Security Questions</span></h2>
            <div className="space-y-4">
              {[
                { 
                  q: "How do AI agent guardrails differ from LLM safety filters?", 
                  a: "LLM safety filters (like LlamaGuard) check text for toxicity. AI agent guardrails (like SupraWall) authorize tool-calls and API access in real-time. Safety filters protect against words; guardrails protect against actions." 
                },
                { 
                  q: "Can guardrails prevent indirect prompt injection?", 
                  a: "Yes. By enforcing 'Deny-by-Default' policies on high-risk tools like code execution or cross-domain webhooks, guardrails ensure that even if a hijacked prompt instructs an agent to exfiltrate data, the technical execution path is blocked." 
                },
                { 
                  q: "What is the performance overhead of adding guardrails?", 
                  a: "SupraWall's runtime interceptor adds <15ms of latency to tool calls. This is negligible compared to the 2,000ms+ typically required for an LLM to generate the tool-call intent itself." 
                }
              ].map((faq, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all cursor-default">
                  <h4 className="text-lg font-black text-white uppercase italic mb-3 group-hover:text-emerald-400 transition-colors">{faq.q}</h4>
                  <p className="text-neutral-500 text-sm leading-relaxed leading-none">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="p-12 md:p-20 rounded-[3rem] bg-emerald-600 relative overflow-hidden text-center group">
             <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
             <div className="relative z-10 space-y-8">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                  Secure your <br />agents today.
                </h2>
                <div className="flex justify-center gap-6">
                  <Link href="/beta" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1">
                    Start Protection for Free
                  </Link>
                </div>
             </div>
          </div>

        </article>
      </main>
    </div>
  );
}
