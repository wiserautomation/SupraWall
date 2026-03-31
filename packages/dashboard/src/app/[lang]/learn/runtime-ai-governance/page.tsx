// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import {
  ShieldCheck,
  Activity,
  FileText,
  Users,
  CheckCircle2,
  Terminal,
  HelpCircle,
  Layers,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Runtime AI Governance: The New Security Category | SupraWall",
  description:
    "Runtime AI governance is the emerging practice of enforcing policies on AI agents in real time — not after the fact. Learn why it's becoming the default enterprise requirement.",
  keywords: [
    "runtime AI governance",
    "AI governance platform",
    "agentic AI governance",
    "AI agent compliance",
    "autonomous AI oversight",
  ],
  alternates: {
    canonical: "https://www.supra-wall.com/learn/runtime-ai-governance",
  },
  openGraph: {
    title: "Runtime AI Governance: The New Security Category | SupraWall",
    description:
      "Runtime AI governance is the emerging practice of enforcing policies on AI agents in real time — not after the fact. Learn why it's becoming the default enterprise requirement.",
    url: "https://www.supra-wall.com/learn/runtime-ai-governance",
    siteName: "SupraWall",
    type: "article",
  },
};

export default function RuntimeAIGovernancePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Runtime AI Governance: The New Security Category",
    description:
      "Runtime AI governance is the emerging practice of enforcing policies on AI agents in real time — not after the fact.",
    author: { "@type": "Organization", name: "SupraWall" },
    datePublished: "2026-01-01",
    genre: "Security Guide",
    keywords:
      "runtime AI governance, AI governance platform, agentic AI governance, AI agent compliance",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is runtime AI governance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Runtime AI governance is the practice of evaluating and enforcing policies on AI agent actions as they happen, in real-time, before execution. It differs from post-hoc observability in that it can prevent harm, not just detect it.",
        },
      },
      {
        "@type": "Question",
        name: "How is runtime governance different from AI safety?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "AI safety focuses on model alignment and output quality. Runtime governance focuses on operational controls: what actions are permitted, who approves them, how they're logged, and whether regulatory requirements are met.",
        },
      },
      {
        "@type": "Question",
        name: "Is runtime governance required by the EU AI Act?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Article 14 requires human oversight mechanisms that can intervene in real-time. Article 12 requires automatic logging. Both require systems that can act during operation, not just after.",
        },
      },
      {
        "@type": "Question",
        name: "What are the 4 pillars of runtime AI governance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The four pillars are: (1) Policy Enforcement — evaluating each action before execution, (2) Audit Logging — creating immutable records of all decisions, (3) Human Oversight — enabling real-time intervention and approval workflows, and (4) Compliance Evidence — automatically generating regulatory documentation.",
        },
      },
      {
        "@type": "Question",
        name: "How does runtime governance reduce the governance gap?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Organizations deploy agents much faster than they build governance frameworks. Runtime governance closes this gap by providing ready-made enforcement, logging, and oversight controls that can be deployed in parallel with agent development, not months after.",
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
              Knowledge Hub • AI Governance
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
              Runtime AI
              <br />
              <span className="text-emerald-500">Governance.</span>
            </h1>
            <p className="text-xl text-neutral-300 border-l-8 border-emerald-600 pl-8 py-4 italic leading-relaxed">
              Runtime AI governance is the emerging security category that
              enforces policies on autonomous AI agents in real time — before
              actions execute, not after incidents occur. It&apos;s becoming the
              default enterprise requirement for any organization deploying
              production agents.
            </p>
          </div>

          {/* TLDR Box */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8">
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              TL;DR
            </p>
            <ul className="space-y-3">
              {[
                "Only 20% of organizations have mature AI governance — the governance gap is the defining security risk of 2026.",
                "Runtime governance is enforcement, not observation. It determines what agents can do before they do it.",
                "The EU AI Act (Articles 12 and 14) mandates runtime logging and real-time human oversight capability.",
                "The 4 pillars: policy enforcement, audit logging, human oversight, and compliance evidence generation.",
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
              The Governance Gap in Agentic AI
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Deloitte&apos;s 2026 AI Governance Survey found that only{" "}
              <span className="text-white font-semibold">
                20% of organizations have mature AI governance frameworks
              </span>{" "}
              in place. More striking: organizations are three times more likely
              to have deployed production AI than to have governance controls
              over that AI. This gap — between deployment velocity and
              governance maturity — is the defining enterprise security risk of
              2026.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The gap exists because the tooling categories have evolved
              asymmetrically. AI development frameworks — LangChain, CrewAI,
              AutoGen, LlamaIndex — have matured rapidly and made it
              straightforward to deploy capable agents. But the governance
              tooling to control what those agents are{" "}
              <span className="text-white font-semibold">allowed to do</span>{" "}
              in production has lagged behind by years.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The result is a growing class of production agents that have broad
              tool access, no runtime controls, and no audit trail. When
              something goes wrong — and it will — organizations have no
              forensic record, no intervention capability, and no compliance
              evidence to present to regulators.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <ShieldCheck className="w-7 h-7 text-emerald-500 shrink-0" />
              What Runtime Governance Actually Means
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Runtime AI governance is frequently confused with adjacent
              categories. Let&apos;s be precise about what it is and is not:
            </p>
            <div className="space-y-3">
              {[
                { label: "Not dashboards", desc: "Dashboards visualize what happened. Runtime governance determines what can happen." },
                { label: "Not post-hoc analysis", desc: "Analyzing agent logs after an incident is valuable but cannot undo the damage. Runtime governance prevents it." },
                { label: "Not model fine-tuning", desc: "Fine-tuning changes how a model behaves probabilistically. Runtime governance creates deterministic enforcement that holds regardless of model behavior." },
                { label: "Not prompt engineering", desc: "Prompts guide; they do not enforce. An agent can be instructed to behave safely while being manipulated into doing otherwise. Runtime governance cannot be bypassed via prompt injection." },
              ].map((item, i) => (
                <div key={i} className="bg-neutral-900 border border-white/5 rounded-2xl p-6 flex gap-4">
                  <span className="text-red-400 font-black text-sm shrink-0">{item.label}.</span>
                  <span className="text-neutral-400 text-sm leading-relaxed">{item.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Runtime governance is the{" "}
              <span className="text-white font-semibold">
                enforcement layer between the agent and the world
              </span>
              . Every tool call, API invocation, file write, and database query
              passes through it. The governance layer evaluates the call against
              policies, makes a deterministic decision, logs the outcome, and
              either permits execution, blocks it, or escalates to a human
              approver.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Layers className="w-7 h-7 text-emerald-500 shrink-0" />
              The 4 Pillars of Runtime AI Governance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
                  title: "Policy Enforcement",
                  desc: "Every agent action is evaluated against an explicit policy set before execution. Policies define what each agent is allowed to do, under what conditions, and with what constraints. The default is deny.",
                },
                {
                  icon: <FileText className="w-5 h-5 text-emerald-500" />,
                  title: "Audit Logging",
                  desc: "Every policy decision is written to an immutable audit log: agent ID, tool called, policy matched, decision, timestamp, and full context. These logs are tamper-evident and exportable for compliance.",
                },
                {
                  icon: <Users className="w-5 h-5 text-emerald-500" />,
                  title: "Human Oversight",
                  desc: "High-risk actions trigger approval workflows. A human reviewer receives context about the pending action and approves or rejects it. The agent is paused until a decision is made — or times out and is denied.",
                },
                {
                  icon: <Activity className="w-5 h-5 text-emerald-500" />,
                  title: "Compliance Evidence",
                  desc: "The governance stack produces structured evidence for regulatory requirements: EU AI Act Article 12 log exports, Article 14 oversight records, and per-incident forensic reports. This is not a manual process — it's generated automatically.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {card.icon}
                    <p className="text-white font-black">{card.title}</p>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Activity className="w-7 h-7 text-emerald-500 shrink-0" />
              How Runtime Governance Differs from Observability
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Observability and runtime governance are{" "}
              <span className="text-white font-semibold">complementary</span>,
              not interchangeable. Many organizations confuse logging with
              governance. The distinction is temporal and operational:
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] pb-4 pr-6">Dimension</th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] pb-4 pr-6">Observability</th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] pb-4">Runtime Governance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["When it operates", "After execution", "Before execution"],
                    ["Primary question", "What did the agent do?", "What is the agent allowed to do?"],
                    ["Can prevent harm?", "No", "Yes"],
                    ["Compliance value", "Forensic evidence", "Active compliance enforcement"],
                    ["Regulatory requirement", "Nice to have", "Mandated by EU AI Act Art. 12 & 14"],
                    ["Human involvement", "Manual review of logs", "Real-time approval workflows"],
                  ].map(([dim, obs, gov], i) => (
                    <tr key={i}>
                      <td className="py-3 pr-6 text-white font-semibold text-xs">{dim}</td>
                      <td className="py-3 pr-6 text-neutral-400">{obs}</td>
                      <td className="py-3 text-neutral-400">{gov}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Users className="w-7 h-7 text-emerald-500 shrink-0" />
              The CTO/CISO Case for Runtime Governance
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The business case for runtime AI governance operates on four
              independent justifications — any one of which is sufficient to
              mandate it:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Liability Reduction",
                  desc: "When an agent causes harm — data loss, unauthorized transactions, compliance violations — the question isn't whether you had an AI. It's whether you had controls. Runtime governance is documented evidence of reasonable care.",
                },
                {
                  title: "Compliance Checkbox",
                  desc: "The EU AI Act is now enforced. ISO 42001 is being adopted. NIST AI RMF is being referenced in contracts. Runtime governance is the control that satisfies all three simultaneously.",
                },
                {
                  title: "Incident Response",
                  desc: "When an agent incident occurs, you need to know exactly what happened, what was allowed, and when. Runtime governance gives you a forensic-grade audit trail that observability platforms cannot produce.",
                },
                {
                  title: "Audit Readiness",
                  desc: "Enterprise customers, insurers, and regulators increasingly ask: 'How do you control your AI agents?' Runtime governance provides a documented, demonstrable answer — not a policy document, but a running system.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all"
                >
                  <p className="text-white font-black mb-3">{card.title}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <FileText className="w-7 h-7 text-emerald-500 shrink-0" />
              Runtime Governance and the EU AI Act
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The EU AI Act&apos;s requirements for high-risk AI systems map
              directly onto the 4 pillars of runtime AI governance. This is not
              a coincidence — the Act was drafted with autonomous systems in
              mind. Here is the explicit mapping:
            </p>
            <div className="space-y-4">
              {[
                {
                  article: "Article 9 — Risk Management",
                  pillar: "Policy Enforcement",
                  detail: "Requires continuous risk management throughout the AI system lifecycle. Runtime policy enforcement is the operational implementation of Article 9: every tool call is a risk decision, evaluated in real time.",
                },
                {
                  article: "Article 11 — Technical Documentation",
                  pillar: "Compliance Evidence",
                  detail: "Requires documentation of the AI system's capabilities, limitations, and controls. SupraWall auto-generates Article 11 documentation from your policy configuration and audit logs.",
                },
                {
                  article: "Article 12 — Record-Keeping",
                  pillar: "Audit Logging",
                  detail: "Requires automatic logging of events throughout operation. Runtime governance produces Article 12-compliant logs: timestamped, tamper-evident, exportable, with full decision context.",
                },
                {
                  article: "Article 14 — Human Oversight",
                  pillar: "Human Oversight Workflows",
                  detail: "Requires that humans can understand, oversee, and intervene in real time. SupraWall's approval queues are the direct implementation: agents pause, humans decide, actions proceed or are blocked.",
                },
              ].map((item, i) => (
                <div key={i} className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all">
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">{item.article}</span>
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded-full">{item.pillar}</span>
                  </div>
                  <p className="text-neutral-400 text-sm leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Terminal className="w-7 h-7 text-emerald-500 shrink-0" />
              Building a Runtime Governance Stack
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              A production runtime governance stack has five layers. Each layer
              has a distinct responsibility. The SupraWall SDK shim operates at
              layer 2 — between your agent framework and everything downstream:
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <pre className="text-neutral-300 leading-relaxed">{`
┌─────────────────────────────────────────────────────┐
│              YOUR AGENT FRAMEWORK                   │
│         (LangChain / CrewAI / AutoGen)              │
└────────────────────┬────────────────────────────────┘
                     │  every tool call passes through here
                     ▼
┌─────────────────────────────────────────────────────┐
│           SUPRAWALL SDK SHIM                        │
│   intercept → evaluate → decide → log               │
│                                                     │
│   ┌─────────────────────────────────────────────┐  │
│   │           POLICY ENGINE                     │  │
│   │  ALLOW / DENY / REQUIRE_APPROVAL            │  │
│   └─────────────────────────────────────────────┘  │
└──────┬──────────────────────────────┬───────────────┘
       │ ALLOW                        │ REQUIRE_APPROVAL
       ▼                              ▼
┌──────────────┐              ┌───────────────────────┐
│  EXECUTION   │              │   HUMAN APPROVAL       │
│  (tools run) │              │   QUEUE                │
└──────┬───────┘              └──────────┬────────────┘
       │                                 │ approved/rejected
       ▼                                 ▼
┌─────────────────────────────────────────────────────┐
│              AUDIT LOG                              │
│   (immutable, timestamped, compliance-ready)        │
└─────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────┐
│          COMPLIANCE DASHBOARD                       │
│   EU AI Act exports / ISO 42001 / incident reports  │
└─────────────────────────────────────────────────────┘
`}</pre>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The critical property of this architecture: the policy engine is{" "}
              <span className="text-white font-semibold">
                outside the agent&apos;s control
              </span>
              . The agent cannot modify its own policies, suppress its own logs,
              or bypass the approval queue — regardless of what instructions it
              receives via prompt injection.
            </p>
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
                  q: "What is runtime AI governance?",
                  a: "Runtime AI governance is the practice of evaluating and enforcing policies on AI agent actions as they happen, in real-time, before execution. It differs from post-hoc observability in that it can prevent harm, not just detect it.",
                },
                {
                  q: "How is runtime governance different from AI safety?",
                  a: "AI safety focuses on model alignment and output quality. Runtime governance focuses on operational controls: what actions are permitted, who approves them, how they're logged, and whether regulatory requirements are met.",
                },
                {
                  q: "Is runtime governance required by the EU AI Act?",
                  a: "Yes. Article 14 requires human oversight mechanisms that can intervene in real-time. Article 12 requires automatic logging. Both require systems that can act during operation, not just after.",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8"
                >
                  <p className="text-white font-black mb-3">{faq.q}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">{faq.a}</p>
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
