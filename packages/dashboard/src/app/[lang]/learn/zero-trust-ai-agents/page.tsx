// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import {
  ShieldCheck,
  Lock,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Layers,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Zero Trust for AI Agents: 2026 Playbook | SupraWall",
  description:
    "Apply zero trust principles to autonomous AI agents. Learn how to verify every tool call, enforce least-privilege, and implement deny-by-default policies for production agents.",
  keywords: [
    "zero trust AI agents",
    "zero trust agentic AI",
    "AI agent zero trust model",
    "zero trust LLM",
    "agentic trust framework",
  ],
  alternates: {
    canonical: "https://www.supra-wall.com/learn/zero-trust-ai-agents",
  },
  openGraph: {
    title: "Zero Trust for AI Agents: 2026 Playbook | SupraWall",
    description:
      "Apply zero trust principles to autonomous AI agents. Learn how to verify every tool call, enforce least-privilege, and implement deny-by-default policies for production agents.",
    url: "https://www.supra-wall.com/learn/zero-trust-ai-agents",
    siteName: "SupraWall",
    type: "article",
  },
};

export default function ZeroTrustAIAgentsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Zero Trust for AI Agents: 2026 Playbook",
    description:
      "Apply zero trust principles to autonomous AI agents. Learn how to verify every tool call, enforce least-privilege, and implement deny-by-default policies for production agents.",
    author: { "@type": "Organization", name: "SupraWall" },
    datePublished: "2026-01-01",
    genre: "Security Guide",
    keywords:
      "zero trust AI agents, zero trust agentic AI, AI agent zero trust model",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is zero trust for AI agents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Zero trust for AI agents means never granting implicit permissions to agent actions. Every tool call must be verified against an explicit allow policy before execution, regardless of which agent makes the request.",
        },
      },
      {
        "@type": "Question",
        name: "How does zero trust differ from traditional agent security?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Traditional approaches trust the agent to use good judgment. Zero trust assumes the agent (or its prompt) may be compromised and enforces all controls at the SDK level, independently of the LLM's output.",
        },
      },
      {
        "@type": "Question",
        name: "What is 'deny by default' for AI agents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Deny-by-default means agents cannot execute any tool call unless there is an explicit ALLOW policy. Contrast with allow-by-default where everything is permitted unless explicitly blocked.",
        },
      },
      {
        "@type": "Question",
        name: "How does least-privilege scoping work for multi-agent systems?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Each agent is assigned a specific tool scope — the minimum set of tools needed for its function. A summarization agent cannot access payment tools. A support agent cannot modify infrastructure. SupraWall enforces these boundaries regardless of what prompts request, preventing lateral movement if one agent is compromised.",
        },
      },
      {
        "@type": "Question",
        name: "What is the 'assume breach' principle for agents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Assume breach means designing controls as if every agent may be compromised via prompt injection or adversarial input. Security cannot depend on the agent behaving correctly — it must hold even when the agent is fully compromised. This is why explicit policies are essential, not prompt-based guidance.",
        },
      },
    ],
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
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
              Knowledge Hub • Security Architecture
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
              Zero <span className="text-emerald-500">Trust</span> for
              <br />
              AI Agents.
            </h1>
            <p className="text-xl text-neutral-300 border-l-8 border-emerald-600 pl-8 py-4 italic leading-relaxed">
              The 2026 playbook for applying zero trust architecture to
              autonomous AI agents — verify every tool call, enforce
              least-privilege, and build production systems that assume breach
              from day one.
            </p>
          </div>

          {/* TLDR Box */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8">
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              TL;DR
            </p>
            <ul className="space-y-3">
              {[
                "67% of enterprise AI deployments have zero runtime access controls — zero trust closes this gap.",
                "Every agent tool call must be evaluated against an explicit policy before execution — not after.",
                "Deny-by-default is the only safe default: if there is no ALLOW rule, the call is blocked.",
                "Zero trust and AI guardrails are complementary, not alternatives — you need both layers.",
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-neutral-300 text-sm leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 1 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <AlertTriangle className="w-7 h-7 text-emerald-500 shrink-0" />
              Why Zero Trust, Why Now
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The Cloud Security Alliance&apos;s{" "}
              <span className="text-white font-semibold">
                Agentic AI Trust Framework
              </span>{" "}
              released in early 2026 identified autonomous agents as the
              highest-priority emerging attack surface in enterprise AI. Unlike
              chatbots that output text, production agents execute actions:
              querying databases, calling APIs, writing files, sending emails,
              and invoking downstream agents. A single compromised agent can
              pivot across an entire infrastructure stack in seconds.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The scale of exposure is alarming. According to recent enterprise
              surveys,{" "}
              <span className="text-white font-semibold">
                67% of enterprise AI deployments have no runtime access controls
              </span>{" "}
              on their agents. Organizations are deploying production agents with
              the same trust model they use for human employees — assuming the
              AI will &quot;use good judgment.&quot; This approach fails for two critical
              reasons: agents can be manipulated via prompt injection, and their
              &quot;judgment&quot; is non-deterministic by design.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Zero trust was developed for network security to address exactly
              this problem: you cannot trust actors inside your perimeter just
              because they got in. Applied to AI agents, the principle is
              identical — never trust an agent&apos;s intent, always verify its
              actions.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Layers className="w-7 h-7 text-emerald-500 shrink-0" />
              The 3 Zero Trust Pillars for Agents
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Zero trust for AI agents maps cleanly onto three architectural
              pillars. Each addresses a distinct failure mode that traditional
              agent security ignores.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Verify Always",
                  desc: "Every tool call is evaluated against an explicit policy before execution. There are no implicit permissions, no trusted contexts, no exceptions. The LLM's stated intent is irrelevant — only the policy matters.",
                },
                {
                  title: "Least Privilege",
                  desc: "Each agent receives the minimum tool access necessary for its specific task. A summarization agent has no business calling your payment API. Scopes are per-agent and per-task, not per-deployment.",
                },
                {
                  title: "Assume Breach",
                  desc: "Design all controls assuming the agent is already compromised via prompt injection or adversarial input. Security cannot depend on the agent behaving correctly — it must hold even when it doesn't.",
                },
                {
                  title: "Explicit Deny-by-Default",
                  desc: "Any tool call without an explicit ALLOW policy is blocked. The default state is denied. This inverts the traditional agent model where everything is permitted unless explicitly restricted.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all"
                >
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-3">
                    Pillar {String(i + 1).padStart(2, "0")}
                  </p>
                  <p className="text-white font-black text-lg mb-3">
                    {card.title}
                  </p>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Terminal className="w-7 h-7 text-emerald-500 shrink-0" />
              Deny-by-Default Policy Architecture
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              A zero trust policy engine for agents operates on a simple
              decision tree: every incoming tool call is evaluated against the
              policy set, returning one of three outcomes:{" "}
              <span className="text-emerald-400 font-semibold">ALLOW</span>,{" "}
              <span className="text-red-400 font-semibold">DENY</span>, or{" "}
              <span className="text-yellow-400 font-semibold">
                REQUIRE_APPROVAL
              </span>
              . If no matching policy exists, the call is denied. Below is a
              SupraWall policy configuration implementing this architecture:
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <pre className="text-neutral-300 leading-relaxed">{`import suprawall

# Initialize with deny-by-default
sw = suprawall.Client(
    api_key="sw_live_...",
    default_policy="DENY"  # Nothing runs without an explicit ALLOW
)

# Define granular allow policies
policies = [
    {
        "agent_id": "data-analyst-v2",
        "tool": "database.query",
        "condition": "query_type == 'SELECT'",  # Read-only
        "action": "ALLOW"
    },
    {
        "agent_id": "data-analyst-v2",
        "tool": "database.write",
        "action": "REQUIRE_APPROVAL",  # Human must approve
        "approver": "data-team@company.com"
    },
    {
        "agent_id": "data-analyst-v2",
        "tool": "database.drop",
        "action": "DENY"  # Explicit deny (belt-and-suspenders)
    },
    {
        "agent_id": "data-analyst-v2",
        "tool": "filesystem.*",
        "action": "DENY"  # No filesystem access at all
    }
]

sw.apply_policies(policies)

# Wrap your LangChain agent
from langchain.agents import AgentExecutor
agent = sw.wrap(AgentExecutor(agent=llm_agent, tools=tools))`}</pre>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Lock className="w-7 h-7 text-emerald-500 shrink-0" />
              Least-Privilege Tool Scoping
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Least privilege for agents means defining explicit{" "}
              <span className="text-white font-semibold">tool scopes</span> at
              the agent level — not the application level. An agent that
              summarizes documents should never have the same tool access as an
              agent that manages infrastructure. SupraWall supports wildcard
              patterns for tool namespacing, making it practical to define
              scopes at scale:
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <pre className="text-neutral-300 leading-relaxed">{`# Scope configuration per agent role
agent_scopes = {
    # Document summarizer: read-only, no external calls
    "doc-summarizer": {
        "allow": ["storage.read.*", "llm.invoke"],
        "deny": ["storage.write.*", "http.*", "email.*", "db.*"]
    },

    # Customer support agent: limited CRM + email send
    "support-agent": {
        "allow": [
            "crm.read.customer",
            "crm.read.tickets",
            "email.send.customer_reply"
        ],
        "deny": [
            "crm.write.*",    # No CRM mutations
            "email.send.*",   # Override: only specific send allowed above
            "db.*",
            "http.external.*"
        ]
    },

    # Infrastructure agent: requires approval for destructive ops
    "infra-agent": {
        "allow": ["cloud.read.*", "cloud.metrics.*"],
        "require_approval": ["cloud.write.*", "cloud.delete.*"],
        "deny": ["cloud.billing.*", "iam.*"]
    }
}

sw.configure_scopes(agent_scopes)`}</pre>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Notice that the{" "}
              <span className="text-white font-semibold">deny rules</span> in
              each scope are explicit belt-and-suspenders entries. With
              deny-by-default, anything not in the allow list is already denied
              — but explicitly denying sensitive namespaces creates an auditable
              record of intent that satisfies compliance requirements under
              Articles 9 and 11 of the EU AI Act.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <ShieldCheck className="w-7 h-7 text-emerald-500 shrink-0" />
              Assume Breach: Agent Isolation Patterns
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              In a multi-agent swarm, assume that any individual agent may be
              compromised at any time. The architectural response is{" "}
              <span className="text-white font-semibold">agent isolation</span>:
              strict boundaries between agents with different tool scopes, no
              shared credentials, and no lateral tool access between agents
              unless explicitly permitted.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Separate by Function",
                  desc: "Never give a single agent both filesystem access AND external API access. Function isolation limits blast radius — a compromised agent can only affect its own scope.",
                },
                {
                  title: "No Shared Credentials",
                  desc: "Each agent uses its own API keys and database credentials. Never pass agent-level credentials through prompts or environment variables accessible to other agents.",
                },
                {
                  title: "Inter-Agent Trust Boundaries",
                  desc: "Agent A calling Agent B is a tool call that goes through the policy engine. Just because you trust Agent A doesn't mean Agent B should inherit its permissions.",
                },
                {
                  title: "Blast Radius Containment",
                  desc: "Design scope boundaries so that a fully compromised agent can cause the minimum possible harm. The question to ask: 'What's the worst this agent can do?' should have a bounded answer.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all"
                >
                  <p className="text-white font-black text-base mb-3">
                    {card.title}
                  </p>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Layers className="w-7 h-7 text-emerald-500 shrink-0" />
              Zero Trust vs AI Guardrails: What&apos;s the Difference?
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              These two concepts are frequently confused.{" "}
              <span className="text-white font-semibold">Zero trust</span> is an
              architectural principle — it describes a philosophy of access
              control.{" "}
              <span className="text-white font-semibold">AI guardrails</span>{" "}
              are the implementation — the technical mechanisms that enforce that
              philosophy. You need both.
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] pb-4 pr-6">
                      Dimension
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] pb-4 pr-6">
                      Zero Trust (Principle)
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] pb-4">
                      AI Guardrails (Implementation)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["What it is", "An architectural philosophy", "Technical enforcement mechanism"],
                    ["Focus", "Trust model design", "Action/output control"],
                    ["Scope", "Entire system design", "Specific control points"],
                    ["Without the other", "Philosophy without enforcement", "Enforcement without direction"],
                    ["Together", "—", "Zero trust AI governance"],
                  ].map(([dim, zt, ag], i) => (
                    <tr key={i}>
                      <td className="py-3 pr-6 text-white font-semibold text-xs">{dim}</td>
                      <td className="py-3 pr-6 text-neutral-400">{zt}</td>
                      <td className="py-3 text-neutral-400">{ag}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" />
              Implementing Zero Trust with SupraWall
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              SupraWall implements the zero trust model for agents in four
              steps. Each step maps directly to a zero trust pillar and can be
              completed in under 30 minutes for most production setups:
            </p>
            <div className="space-y-4">
              {[
                {
                  step: "01",
                  title: "Install & Initialize",
                  desc: "pip install suprawall-sdk. Initialize the client with your API key and set default_policy='DENY' to activate deny-by-default immediately.",
                },
                {
                  step: "02",
                  title: "Configure Policies",
                  desc: "Define ALLOW, DENY, and REQUIRE_APPROVAL policies per agent and tool. Start with a conservative policy set and loosen as needed — not the reverse.",
                },
                {
                  step: "03",
                  title: "Set Agent Scopes",
                  desc: "Assign tool scopes to each agent role using wildcards and explicit deny lists. Map these to your least-privilege design.",
                },
                {
                  step: "04",
                  title: "Enable Audit Logging",
                  desc: "Every policy decision is logged with full context: agent ID, tool called, policy matched, outcome, and timestamp. These logs satisfy EU AI Act Article 12 requirements.",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all flex gap-6"
                >
                  <span className="text-4xl font-black text-emerald-500/30 shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <p className="text-white font-black text-base mb-2">
                      {item.title}
                    </p>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 8: FAQ */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <HelpCircle className="w-7 h-7 text-emerald-500 shrink-0" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "What is zero trust for AI agents?",
                  a: "Zero trust for AI agents means never granting implicit permissions to agent actions. Every tool call must be verified against an explicit allow policy before execution, regardless of which agent makes the request.",
                },
                {
                  q: "How does zero trust differ from traditional agent security?",
                  a: "Traditional approaches trust the agent to use good judgment. Zero trust assumes the agent (or its prompt) may be compromised and enforces all controls at the SDK level, independently of the LLM's output.",
                },
                {
                  q: "What is 'deny by default' for AI agents?",
                  a: "Deny-by-default means agents cannot execute any tool call unless there is an explicit ALLOW policy. Contrast with allow-by-default where everything is permitted unless explicitly blocked.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8"
                >
                  <p className="text-white font-black mb-3">{faq.q}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="mt-24 p-16 rounded-[4rem] bg-emerald-600 text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white">
              Enforce It Now.
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/beta"
                className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all"
              >
                Start Free
              </Link>
              <Link
                href="/docs"
                className="px-10 py-4 bg-black/20 text-white border-2 border-white/20 font-black uppercase tracking-widest rounded-2xl hover:bg-black/40 transition-all"
              >
                View Docs
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.5em]">
          SupraWall © 2026 • Real-time Agent Governance
        </p>
      </footer>
    </div>
  );
}
