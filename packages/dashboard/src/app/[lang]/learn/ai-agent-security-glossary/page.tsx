// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { BookOpen, FileText } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Agent Security Glossary: 30+ Terms Defined",
  description:
    "The definitive glossary of AI agent security terminology. Definitions for agent runtime security, tool interception, prompt injection, HITL, guardrails, EU AI Act terms, and more.",
  keywords: [
    "AI agent security glossary",
    "AI agent security terms",
    "agent guardrails definition",
    "prompt injection definition",
    "EU AI Act glossary",
  ],
  alternates: {
    canonical: "https://www.supra-wall.com/learn/ai-agent-security-glossary",
  },
  openGraph: {
    title: "AI Agent Security Glossary: 30+ Terms Defined",
    description:
      "The definitive glossary of AI agent security terminology. Definitions for agent runtime security, tool interception, prompt injection, HITL, guardrails, EU AI Act terms, and more.",
    url: "https://www.supra-wall.com/learn/ai-agent-security-glossary",
    siteName: "SupraWall",
    type: "website",
  },
};

const terms = [
  {
    term: "Agent Firewall",
    definition:
      "A deterministic security layer positioned at the execution boundary between an autonomous agent and its environment. It intercepts every tool call before execution, evaluates it against a policy set, and returns ALLOW, DENY, or REQUIRE_APPROVAL. Unlike content filters, an agent firewall operates on structured tool call arguments — not LLM text output — making it effective even when the model is compromised via prompt injection.",
  },
  {
    term: "Agent Runtime Security (ARS)",
    definition:
      "The discipline of securing autonomous AI agents during their actual execution — after deployment and while actively processing tasks. ARS encompasses tool call interception, policy enforcement, audit logging, loop detection, budget controls, and human-in-the-loop mechanisms. It is distinct from model safety (training-time) and application security (network-layer), addressing the unique threat surface created by agents that execute real-world actions.",
  },
  {
    term: "Agent Scope",
    definition:
      "The explicit set of tools and capabilities an agent is permitted to access for a given task or deployment context. Defined per-agent-role, a scope is the operational implementation of the least-privilege principle. A well-defined scope prevents privilege escalation, limits blast radius on compromise, and creates a documented record of intended agent behavior for compliance purposes.",
  },
  {
    term: "Audit Trail",
    definition:
      "A complete, tamper-evident, chronological record of every tool call an agent attempted during a session — including the call arguments, the policy decision (ALLOW/DENY/REQUIRE_APPROVAL), the policy rule matched, outcome, latency, and timestamp. A comprehensive audit trail is required under EU AI Act Articles 12 and 17 for high-risk AI systems and is the primary evidence artifact for incident investigation.",
  },
  {
    term: "Budget Cap (Agent)",
    definition:
      "A stateful control that limits the total resource consumption (LLM API token cost, number of tool calls, external API credits) an agent may incur within a single session or time window. Budget caps are enforced by a stateful firewall that accumulates usage across all calls in the session. When the cap is reached, the firewall terminates the session and logs the event. Essential for preventing runaway cost from infinite loops or adversarial inputs.",
  },
  {
    term: "Callback Handler",
    definition:
      "A hook in an agent execution framework (e.g., LangChain's CallbackHandler) that fires at specific lifecycle events — tool call start, tool call end, LLM start, chain start, etc. SupraWall's interception layer is implemented as a callback handler, allowing it to intercept tool calls without modifying the agent's core logic. Callback handlers are the primary integration point for runtime governance in framework-based agents.",
  },
  {
    term: "Circuit Breaker (Agent)",
    definition:
      "A stateful control that automatically halts an agent's execution when a predefined threshold is exceeded — typically a maximum number of sequential tool calls of the same type, or a maximum total call count per session. Modeled after the circuit breaker pattern in distributed systems, it prevents infinite loops and runaway execution by cutting the tool call pathway after a configurable threshold, returning control to the application layer.",
  },
  {
    term: "Compliance Export",
    definition:
      "A structured export of audit logs, policy configurations, and session records formatted for use in regulatory conformity assessments. SupraWall's compliance export generates NDJSON and CSV artifacts aligned with EU AI Act Article 12 logging requirements, including agent identifier, action type, timestamp, policy version, and human oversight events. Intended for submission to notified bodies and internal compliance teams.",
  },
  {
    term: "Credential Injection",
    definition:
      "The secure practice of providing API keys and secrets to agents at runtime through a controlled vault or environment injection mechanism — never through the prompt, conversation history, or agent-accessible memory. Credential injection ensures secrets are scoped to the agent's session, rotated per-execution if needed, and never exposed in logs or LLM context windows where they could be extracted.",
  },
  {
    term: "Deny-by-Default",
    definition:
      "A security posture in which all agent tool calls are blocked unless there is an explicit ALLOW policy that matches the call. The inverse of allow-by-default (where everything runs unless explicitly blocked), deny-by-default prevents unauthorized actions even when policy coverage is incomplete. It is the recommended default for any production agent deployment and is a prerequisite for zero trust compliance.",
  },
  {
    term: "EU AI Act",
    definition:
      "Regulation (EU) 2024/1689, the world's first comprehensive legal framework for artificial intelligence, which entered into force in August 2024. It classifies AI systems by risk level (unacceptable, high, limited, minimal) and imposes obligations including risk management systems (Article 9), data governance, technical documentation, transparency, human oversight (Article 14), accuracy and robustness, and logging (Article 12). Autonomous AI agents operating in consequential domains are likely classified as high-risk systems.",
  },
  {
    term: "Execution Boundary",
    definition:
      "The interface between an autonomous agent's decision-making layer (the LLM) and the environment it acts upon (databases, APIs, filesystems, external services). The execution boundary is the correct enforcement point for security controls — intercepting calls here prevents any unauthorized action from reaching the environment, regardless of what the LLM decided. An agent firewall sits at the execution boundary.",
  },
  {
    term: "Guardrail",
    definition:
      "A technical control applied to an AI agent's inputs or outputs to constrain its behavior within defined boundaries. Guardrails encompass both content filters (scanning LLM output for policy violations) and structural controls (blocking tool calls at the execution boundary). The term is used broadly across the industry; in the context of agent runtime security, guardrails specifically refer to controls that prevent agents from taking unauthorized actions rather than just producing inappropriate text.",
  },
  {
    term: "High-Risk AI System",
    definition:
      "A classification under the EU AI Act for AI systems used in domains where failures have significant consequences for health, safety, or fundamental rights. Categories include biometric systems, critical infrastructure management, education and employment decisions, and law enforcement. AI agents autonomously making decisions in these domains are likely high-risk and subject to the full set of Article 9-17 obligations, including mandatory risk management, human oversight, and logging.",
  },
  {
    term: "Human-in-the-Loop (HITL)",
    definition:
      "An architectural pattern in which a human reviewer must approve an agent's proposed action before it is executed. In agent runtime security, HITL is implemented via REQUIRE_APPROVAL policies that pause the agent's execution at a specific tool call, notify a designated approver, and resume execution only after explicit human authorization. HITL is required by EU AI Act Article 14 for high-risk AI systems performing consequential actions.",
  },
  {
    term: "Indirect Prompt Injection",
    definition:
      "An attack in which malicious instructions are embedded in data the agent retrieves from the environment — web pages, documents, database records, API responses — rather than directly in the user prompt. The agent, treating the retrieved content as trusted context, follows the injected instructions. Indirect prompt injection is particularly dangerous for agents with broad tool access and is one of the primary threats that execution-boundary firewalls are designed to mitigate.",
  },
  {
    term: "Infinite Loop Detection",
    definition:
      "A stateful control that identifies and terminates agent execution when the agent appears to be executing the same tool calls repeatedly without making progress toward task completion. Typically implemented by tracking call counts per tool per session and comparing argument hashes to identify repetition. When a loop is detected, the circuit breaker fires and execution is halted, preventing runaway resource consumption and cost accumulation.",
  },
  {
    term: "Integrity Hash",
    definition:
      "A cryptographic hash of a policy document, audit log entry, or agent configuration that allows the original content to be verified as unmodified. In agent runtime security, integrity hashes are used to ensure that audit trails have not been tampered with after the fact — a requirement for regulatory admissibility. SupraWall generates SHA-256 hashes for each audit log batch and stores them separately to enable independent verification.",
  },
  {
    term: "Least Privilege (Agent)",
    definition:
      "The principle that each agent should be granted access only to the minimum set of tools, APIs, and data sources strictly necessary for its designated task. In practice, this means defining per-agent-role scopes with explicit allowlists rather than inheriting broad application-level permissions. Least privilege limits the blast radius of compromised agents — a fully manipulated agent can only take actions within its explicitly permitted scope.",
  },
  {
    term: "LLM Guardrails",
    definition:
      "Controls applied specifically at the language model layer — input filtering, output classification, content policy enforcement — to prevent models from generating harmful or policy-violating text. LLM guardrails are distinct from agent runtime guardrails: they operate on text tokens and are not able to intercept or block tool calls. See our research on why probabilistic LLM-as-judge guardrails fail for autonomous agents.",
  },
  {
    term: "LLM-as-Judge",
    definition:
      "A security pattern in which a secondary language model is used to evaluate the intent or output of a primary agent model. While effective for content safety, this approach is probabilistic and vulnerable to bypass patterns like context window displacement and confidence hijacking. In agentic workflows, relying on a judge for security creates an execution gap that can only be closed by deterministic interception. Read the full technical breakdown of LLM-as-judge failure modes.",
  },
  {
    term: "MCP (Model Context Protocol)",
    definition:
      "An open protocol developed by Anthropic that standardizes the interface between AI models and external tools, data sources, and capabilities. MCP defines a structured message format for tool calls, tool results, and resource access, enabling interoperability between different LLMs and tool implementations. MCP servers expose tool sets to agents; SupraWall can intercept MCP tool calls to enforce policies on any MCP-compliant agent.",
  },
  {
    term: "Multi-Agent Swarm",
    definition:
      "An architecture in which multiple specialized autonomous agents collaborate to complete complex tasks, with agents calling other agents as tools. Swarms introduce compound security risks: a compromised orchestrator agent can manipulate sub-agents, inter-agent trust boundaries can be exploited, and individual agent scopes do not automatically restrict swarm-level behavior. Each agent-to-agent call in a swarm should be treated as a tool call subject to policy enforcement.",
  },
  {
    term: "PII Scrubbing",
    definition:
      "The automated detection and redaction of personally identifiable information (name, email, phone number, national ID, financial account numbers) from agent inputs, outputs, and audit logs before they are stored or transmitted. PII scrubbing is a data minimization control required under GDPR and relevant to EU AI Act Article 10 data governance obligations. In agent systems, PII may appear in retrieved documents, API responses, or user prompts.",
  },
  {
    term: "Policy Engine",
    definition:
      "The component of an agent firewall or runtime governance system responsible for evaluating tool calls against a defined rule set and returning a policy decision (ALLOW, DENY, REQUIRE_APPROVAL). A policy engine processes structured inputs — tool name, arguments, agent identity, session state — and applies deterministic rules in priority order. SupraWall's policy engine evaluates rules in under 5ms, making it suitable for insertion into the synchronous tool call path.",
  },
  {
    term: "Prompt Injection",
    definition:
      "An attack in which malicious instructions embedded in user input or retrieved data override an agent's original system prompt, causing the agent to deviate from its intended behavior. Prompt injection exploits the fact that LLMs process all text in their context window as a single undifferentiated sequence — they cannot reliably distinguish between trusted instructions and untrusted data. Defense requires execution-boundary controls that enforce behavior independently of what the LLM was told.",
  },
  {
    term: "Rate Limiting (Agent)",
    definition:
      "A control that caps the frequency with which an agent can execute a specific tool or class of tools within a time window. Unlike budget caps (which track cumulative cost), rate limiting tracks call frequency — for example, a maximum of 10 external API calls per minute. Rate limiting prevents agents from overwhelming downstream services, hitting API quotas, or executing high-frequency attacks against protected resources.",
  },
  {
    term: "REQUIRE_APPROVAL",
    definition:
      "A policy action that pauses an agent's tool call execution and routes it to a designated human reviewer before proceeding. When a tool call matches a REQUIRE_APPROVAL policy, the agent's execution is suspended, the approver is notified via configured channels (Slack, email, dashboard), and execution resumes only if the human explicitly approves the action. Timeouts cause the call to be denied by default if no response is received within the configured window.",
  },
  {
    term: "Risk Score",
    definition:
      "A numeric value (typically 0–100 or a categorical LOW/MEDIUM/HIGH/CRITICAL classification) assigned to a tool call or agent session that represents the assessed potential for harm. Risk scores are computed from factors including tool destructiveness, argument sensitivity, call frequency anomalies, and session context. High-risk calls can trigger automatic REQUIRE_APPROVAL escalation or DENY decisions even when no explicit policy matches.",
  },
  {
    term: "Runtime Governance",
    definition:
      "The application of policy, monitoring, and control mechanisms to an AI agent's behavior during live execution — as opposed to design-time safety measures like prompt engineering or model fine-tuning. Runtime governance encompasses policy enforcement, audit logging, anomaly detection, human escalation workflows, and compliance reporting. It is the operational layer of the EU AI Act's Article 9 requirement for ongoing risk management throughout an AI system's lifecycle.",
  },
  {
    term: "Semantic Loop Detection",
    definition:
      "An advanced form of loop detection that identifies repetitive agent behavior even when the specific tool arguments vary across calls. Rather than matching exact argument values, semantic loop detection compares the intent or semantic content of tool calls — detecting, for example, that an agent is repeatedly querying different variations of the same database search without making progress. Typically implemented using argument embedding similarity or n-gram analysis of the call sequence.",
  },
  {
    term: "Session Isolation",
    definition:
      "The enforcement of strict boundaries between different agent sessions, ensuring that state, credentials, context, and audit records from one session cannot influence or be accessed by another. Session isolation prevents cross-session data leakage, ensures that budget caps and rate limits are accurately scoped, and guarantees that audit trails reflect the behavior of a single coherent execution context rather than a polluted shared state.",
  },
  {
    term: "Tool Call",
    definition:
      "The fundamental unit of action in an autonomous AI agent system — a structured request from the LLM to invoke a specific function or external capability, containing the tool name and a JSON object of arguments. Tool calls are how agents interact with the world: querying databases, calling APIs, writing files, sending messages. Every tool call is a potential security event that should be evaluated by a policy engine before execution.",
  },
  {
    term: "Tool Interception",
    definition:
      "The technical mechanism by which an agent firewall captures tool calls before they reach the underlying tool implementation. Interception is typically implemented by replacing tool functions with proxied versions that forward calls to the policy engine first. Tool interception is transparent to the agent framework — the agent's code does not need to be modified, and tool results are returned normally for allowed calls.",
  },
  {
    term: "Vault (Agent Secrets)",
    definition:
      "A secure, access-controlled storage system for API keys, database credentials, and other secrets used by agents at runtime. Agent vaults provide time-limited, per-session secret injection — the agent receives a credential for the duration of its task and the credential is revoked afterward. This prevents secrets from being stored in prompts, environment variables, or conversation history where they could be exfiltrated by a compromised agent.",
  },
  {
    term: "Zero Trust (AI Agents)",
    definition:
      "The application of the zero trust security model to autonomous AI agents: never implicitly trust an agent's intent or identity, and verify every tool call against an explicit policy before execution. Zero trust for agents treats each tool call as a potential security event regardless of the agent's stated purpose or previous behavior. It assumes that any agent may be compromised via prompt injection at any time and enforces controls at the execution boundary rather than at the trust perimeter.",
  },
];

export default function AIAgentSecurityGlossaryPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: terms.map((t) => ({
      "@type": "Question",
      name: `What is ${t.term}?`,
      acceptedAnswer: {
        "@type": "Answer",
        text: t.definition,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
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
              Knowledge Hub • Reference
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
              AI Agent Security
              <br />
              <span className="text-emerald-500">Glossary.</span>
            </h1>
            <p className="text-xl text-neutral-300 border-l-8 border-emerald-600 pl-8 py-4 italic leading-relaxed">
              35 terms defined for developers and compliance teams building and
              securing autonomous AI agent systems — from execution boundaries
              and prompt injection to EU AI Act obligations and zero trust
              architecture.
            </p>
          </div>

          {/* Intro */}
          <section className="space-y-4">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <BookOpen className="w-7 h-7 text-emerald-500 shrink-0" />
              Why Terminology Matters
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              AI agent security sits at the intersection of distributed systems
              engineering, machine learning, and regulatory compliance. Teams
              building production agents span multiple disciplines — engineers,
              security architects, legal counsel, compliance officers — each
              bringing their own vocabulary. Imprecise language creates security
              gaps: when an engineer says &quot;guardrail&quot; and a compliance officer
              hears &quot;content filter,&quot; the execution-boundary controls required
              by the EU AI Act may never get built.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              This glossary establishes precise definitions for the 35 most
              important terms in AI agent security. Each definition is written
              to be actionable: it describes not just what the term means but
              why it matters and how it relates to the controls you need to
              build. Terms are ordered alphabetically and structured as
              individual definition cards for fast reference.
            </p>
          </section>

          {/* Terms Grid */}
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {terms.map((item, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-white/5 rounded-2xl p-6"
                >
                  <p className="text-emerald-400 font-black text-sm uppercase tracking-wider mb-2">
                    {item.term}
                  </p>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {item.definition}
                    {item.term === "LLM Guardrails" && (
                      <Link href="/blog/llm-as-judge-fails-agent-security" className="ml-1 text-emerald-500 hover:underline"> [Research] </Link>
                    )}
                    {item.term === "LLM-as-Judge" && (
                      <Link href="/blog/llm-as-judge-fails-agent-security" className="ml-1 text-emerald-500 hover:underline"> [Technical Breakdown] </Link>
                    )}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Related Guides */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <FileText className="w-7 h-7 text-emerald-500 shrink-0" />
              Related Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  href: "/learn/what-is-agent-runtime-security",
                  title: "What is Agent Runtime Security?",
                  desc: "The foundational guide to securing agents at execution time. Start here if you are new to ARS.",
                },
                {
                  href: "/learn/what-are-ai-agent-guardrails",
                  title: "What Are AI Agent Guardrails?",
                  desc: "Deep-dive into the technical controls that constrain agent behavior in production systems.",
                },
                {
                  href: "/learn/eu-ai-act-compliance-ai-agents",
                  title: "EU AI Act Compliance for AI Agents",
                  desc: "How autonomous agents map to EU AI Act risk categories and what obligations apply.",
                },
                {
                  href: "/learn/ai-agent-firewall",
                  title: "AI Agent Firewall",
                  desc: "Why output filters are not enough — and how execution-boundary firewalls work.",
                },
              ].map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all block"
                >
                  <p className="text-white font-black mb-2">{link.title}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {link.desc}
                  </p>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.5em]">
          SupraWall © 2026 • Real-time Agent Governance
        </p>
      </footer>
    
            {/* Internal Linking Cluster */}
            <div className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-20 bg-black">
                <h2 className="text-3xl font-black italic text-white flex items-center gap-4 mb-8">
                    Explore Agent Security Clusters
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href={`/en/learn`} className="group p-6 rounded-[2rem] bg-neutral-900 border border-white/5 hover:border-emerald-500/30 transition-all">
                        <h4 className="text-sm font-black uppercase italic text-white group-hover:text-emerald-400 transition-colors">AI Agent Security Hub</h4>
                        <p className="text-xs text-neutral-500 mt-2 font-bold uppercase tracking-tight">Browse the complete library of agent guardrails.</p>
                    </Link>
                    <Link href={`/en/gdpr`} className="group p-6 rounded-[2rem] bg-neutral-900 border border-white/5 hover:border-purple-500/30 transition-all">
                        <h4 className="text-sm font-black uppercase italic text-white group-hover:text-purple-400 transition-colors">GDPR AI Compliance</h4>
                        <p className="text-xs text-neutral-500 mt-2 font-bold uppercase tracking-tight">Protect PII across all agent tool calls.</p>
                    </Link>
                    <Link href={`/en/for-compliance-officers`} className="group p-6 rounded-[2rem] bg-neutral-900 border border-white/5 hover:border-blue-500/30 transition-all">
                        <h4 className="text-sm font-black uppercase italic text-white group-hover:text-blue-400 transition-colors">EU AI Act Readiness</h4>
                        <p className="text-xs text-neutral-500 mt-2 font-bold uppercase tracking-tight">Automate Article 12 audit trails for agents.</p>
                    </Link>
                </div>
            </div>
        </div>
  );
}
