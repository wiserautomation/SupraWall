// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import {
  ShieldCheck,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Users,
  Clock,
  Mail,
  MessageSquare,
  LayoutDashboard,
  CreditCard,
  Trash2,
  Send,
  Server,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Human-in-the-Loop for AI Agents: Implementation Guide | SupraWall",
  description:
    "Learn how to implement human-in-the-loop (HITL) controls for autonomous AI agents. Pause agents on high-risk actions, route approvals via Slack or email, and satisfy EU AI Act Article 14.",
  keywords: [
    "human in the loop AI agents",
    "HITL AI agents",
    "human oversight AI",
    "agent approval workflow",
    "EU AI Act Article 14",
  ],
  alternates: {
    canonical: "https://www.supra-wall.com/learn/human-in-the-loop-ai-agents",
  },
  openGraph: {
    title: "Human-in-the-Loop for AI Agents: Implementation Guide | SupraWall",
    description:
      "Learn how to implement human-in-the-loop (HITL) controls for autonomous AI agents. Pause agents on high-risk actions, route approvals via Slack or email, and satisfy EU AI Act Article 14.",
    url: "https://www.supra-wall.com/learn/human-in-the-loop-ai-agents",
    siteName: "SupraWall",
    type: "article",
  },
};

export default function HumanInTheLoopAIAgentsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Human-in-the-Loop for AI Agents: Implementation Guide",
    description:
      "Learn how to implement human-in-the-loop (HITL) controls for autonomous AI agents. Pause agents on high-risk actions, route approvals via Slack or email, and satisfy EU AI Act Article 14.",
    author: { "@type": "Organization", name: "SupraWall" },
    datePublished: "2026-01-01",
    genre: "Implementation Guide",
    keywords:
      "human in the loop AI agents, HITL AI agents, human oversight AI, agent approval workflow, EU AI Act Article 14",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is human-in-the-loop for AI agents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Human-in-the-loop (HITL) for AI agents is the mechanism that pauses autonomous execution and routes high-stakes actions to a human reviewer before the agent proceeds. Rather than blocking all agent actions, a HITL system uses risk-based policies to identify which specific actions require human approval and which can execute autonomously.",
        },
      },
      {
        "@type": "Question",
        name: "Does EU AI Act Article 14 require human-in-the-loop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Article 14 of the EU AI Act requires high-risk AI systems to allow for effective oversight by natural persons. This includes the ability to decide not to use the AI system, to override its output, and to intervene in its operation. HITL approval workflows are the primary technical implementation of this requirement for autonomous agents.",
        },
      },
      {
        "@type": "Question",
        name: "What happens if an approval request expires before a human responds?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SupraWall HITL requests have a configurable TTL (time-to-live). If the TTL expires before a reviewer approves or denies the request, the action is automatically denied and the agent receives a timeout response. The agent can then choose to retry, escalate, or fail gracefully depending on its error handling logic. This prevents stale approvals from being applied to a context that has already changed.",
        },
      },
      {
        "@type": "Question",
        name: "Which actions should require human approval?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The four high-priority categories are: (1) Financial transactions, especially large amounts; (2) Data deletion — which is irreversible; (3) External communication — emails, messages to external parties; and (4) Infrastructure changes. SupraWall lets you define REQUIRE_APPROVAL policies for each category with different TTLs and approver channels.",
        },
      },
      {
        "@type": "Question",
        name: "Can approval requests be routed to different channels?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. SupraWall supports three approval channels: the dashboard for centralized AI operations teams, Slack for engineering teams who live in Slack, and email for executive approvers. Different policies can route to different channels based on action category and risk level, ensuring approvals reach the right people.",
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
              Knowledge Hub • Human Oversight
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
              Human-in-the-
              <span className="text-emerald-500">Loop</span>
              <br />
              AI Agents.
            </h1>
            <p className="text-xl text-neutral-300 border-l-8 border-emerald-600 pl-8 py-4 italic leading-relaxed">
              Human-in-the-loop (HITL) for AI agents is the mechanism that pauses autonomous
              execution and routes high-stakes actions to a human reviewer before proceeding.
              SupraWall implements HITL via a policy-driven approval workflow that integrates
              with Slack, email, and the dashboard — satisfying EU AI Act Article 14 with
              under 200ms added latency on non-approval paths.
            </p>
          </div>

          {/* TL;DR */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8">
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              TL;DR
            </p>
            <ul className="space-y-3">
              {[
                "HITL is required under EU AI Act Article 14 for high-risk AI systems — technical oversight controls must be demonstrable, not just documented.",
                "Not all actions need human review — use risk-based policies to target approvals at high-stakes categories only, keeping agents fast on routine tasks.",
                "Approval requests should expire automatically to prevent stale decisions — a 15-minute-old approval may be irrelevant to the current agent context.",
                "SupraWall HITL adds under 200ms to the decision path on non-approval paths, meaning routine tool calls are not penalized by the oversight layer.",
              ].map((point, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-neutral-300 text-sm leading-relaxed"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 1: Why Agents Need Oversight */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <AlertTriangle className="w-7 h-7 text-emerald-500 shrink-0" />
              Why Agents Need Human Oversight
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The failure mode that keeps AI safety researchers awake at night is not the
              dramatic science-fiction scenario — it is the mundane one. A production agent
              given broad permissions and a high-level objective will, on a long enough timeline,
              encounter an ambiguous situation where its best interpretation of the task leads to
              a catastrophically bad outcome.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Consider a real scenario that multiple organizations have experienced in 2025-2026:{" "}
              <span className="text-white font-semibold">
                an email agent tasked with &ldquo;clearing the backlog&rdquo; sends 10,000 automated
                messages to customers
              </span>{" "}
              without any human review because no one explicitly told it that &ldquo;backlog&rdquo; meant
              the internal support queue rather than the entire unread inbox. There was no malice,
              no prompt injection, no security failure — just an LLM interpreting an instruction
              differently than the human intended, with no checkpoint to catch the divergence
              before execution.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The categories of failure are consistent across incidents:{" "}
              <span className="text-white font-semibold">irreversibility</span> (deleted records,
              sent emails, executed payments cannot be undone),{" "}
              <span className="text-white font-semibold">scale amplification</span> (an agent
              can make 10,000 API calls before a human notices, where a human would have noticed
              after 3), and{" "}
              <span className="text-white font-semibold">context loss</span> (the agent&apos;s
              understanding of the task may drift from human intent over a long-running session).
              HITL controls are the circuit breaker for all three.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The goal is not to require human approval for everything — that defeats the purpose
              of autonomous agents. The goal is to identify the specific action categories where
              the cost of an error is high enough that human judgment is worth the latency, and
              enforce approval exactly there. Everything else runs at full autonomous speed.
            </p>
          </section>

          {/* Section 2: When to Require Approval */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <ShieldCheck className="w-7 h-7 text-emerald-500 shrink-0" />
              When to Require Approval
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The four categories below represent the near-universal consensus across security
              frameworks, EU AI Act guidance, and real-world incident analysis. Any agent action
              that falls into one of these categories should have a{" "}
              <code className="text-emerald-400 text-sm bg-neutral-900 px-2 py-0.5 rounded-lg">
                REQUIRE_APPROVAL
              </code>{" "}
              policy as the safe default.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <CreditCard className="w-5 h-5 text-emerald-500" />,
                  title: "Financial Transactions",
                  desc: "Any tool call that initiates a payment, refund, credit, subscription change, or budget allocation. Dollar thresholds can be used to allow small transactions autonomously (e.g., under $50) while requiring approval for larger amounts.",
                },
                {
                  icon: <Trash2 className="w-5 h-5 text-emerald-500" />,
                  title: "Data Deletion",
                  desc: "Deletion of database records, files, accounts, or configurations. The irreversibility of deletion makes it the highest-priority category for HITL controls. Soft-delete patterns can reduce urgency but don't eliminate it.",
                },
                {
                  icon: <Send className="w-5 h-5 text-emerald-500" />,
                  title: "External Communication",
                  desc: "Sending emails, Slack messages, SMS, or API calls to external parties. The reputational and legal risk of an agent communicating incorrectly on behalf of your organization requires human review on all external communications.",
                },
                {
                  icon: <Server className="w-5 h-5 text-emerald-500" />,
                  title: "Infrastructure Changes",
                  desc: "Scaling resources, deploying code, modifying IAM policies, changing DNS records, or any cloud operation that affects production system availability. Infrastructure mistakes have cascading effects that can be expensive and slow to reverse.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all"
                >
                  <div className="mb-3">{card.icon}</div>
                  <p className="text-white font-black text-base mb-3">{card.title}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: The Approval Workflow */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Terminal className="w-7 h-7 text-emerald-500 shrink-0" />
              The Approval Workflow
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              When an agent attempts a tool call covered by a{" "}
              <code className="text-emerald-400 text-sm bg-neutral-900 px-2 py-0.5 rounded-lg">
                REQUIRE_APPROVAL
              </code>{" "}
              policy, SupraWall pauses execution, creates an approval request, routes it to the
              configured reviewer channel, and holds the agent in a suspended state until a
              decision is made. The agent receives either a resumption signal (approved) or a
              deny response that it can handle in its error logic.
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <p className="text-neutral-500 text-[10px] uppercase tracking-[0.15em] mb-4 font-sans font-black">
                Policy Configuration
              </p>
              <pre className="text-neutral-300 leading-relaxed">{`import suprawall

sw = suprawall.Client(api_key="sw_live_...")

# Define HITL policies by action category
policies = [
    # All Stripe charges require approval
    {
        "agent_id": "billing-agent",
        "tool": "stripe.charge",
        "action": "REQUIRE_APPROVAL",
        "approver_channel": "slack",
        "approver_slack": "#billing-approvals",
        "ttl_seconds": 900,  # 15 minutes or auto-deny
        "context_fields": ["amount", "customer_id", "description"],
    },
    # Bulk email requires approval; single replies are allowed
    {
        "agent_id": "support-agent",
        "tool": "email.send_bulk",
        "action": "REQUIRE_APPROVAL",
        "approver_channel": "email",
        "approver_email": "comms-review@company.com",
        "ttl_seconds": 3600,  # 1 hour
        "context_fields": ["recipient_count", "subject", "preview"],
    },
    # Infrastructure mutations require approval from infra team
    {
        "agent_id": "infra-agent",
        "tool": "aws.*",
        "condition": "action_type in ['create', 'delete', 'modify']",
        "action": "REQUIRE_APPROVAL",
        "approver_channel": "dashboard",
        "approver_group": "infra-team",
        "ttl_seconds": 1800,
    },
]

sw.apply_policies(policies)`}</pre>
            </div>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <p className="text-neutral-500 text-[10px] uppercase tracking-[0.15em] mb-4 font-sans font-black">
                Agent Behavior When HITL Triggers
              </p>
              <pre className="text-neutral-300 leading-relaxed">{`from suprawall.exceptions import ApprovalRequired, ApprovalDenied, ApprovalExpired

try:
    # This triggers the REQUIRE_APPROVAL policy
    result = await agent.execute("charge customer $2,400 for annual plan renewal")

except ApprovalRequired as e:
    # Approval request has been sent — agent is suspended
    print(f"Approval pending: {e.request_id}")
    print(f"Routed to: {e.channel} ({e.approver})")
    print(f"Expires in: {e.ttl_seconds}s")
    # Agent state is preserved — execution resumes automatically if approved

except ApprovalDenied as e:
    # Human reviewer denied the action
    print(f"Action denied by {e.reviewer}: {e.reason}")
    # Handle gracefully — log, escalate, or inform user

except ApprovalExpired as e:
    # TTL expired before reviewer responded — auto-denied
    print(f"Approval request expired after {e.ttl_seconds}s")
    # Safe default: treat as denial`}</pre>
            </div>
          </section>

          {/* Section 4: Approval Channels */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Users className="w-7 h-7 text-emerald-500 shrink-0" />
              Approval Channels
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Where approvals are routed determines whether HITL controls actually work in
              practice. A system that emails approvals to an inbox that reviewers check weekly is
              not a real oversight mechanism. SupraWall supports three channels, each designed for
              different organizational workflows and response time requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <LayoutDashboard className="w-6 h-6 text-emerald-500" />,
                  title: "Dashboard",
                  desc: "Real-time approval queue in the SupraWall dashboard. Reviewers see the full action context, agent state, and policy match. One-click approve or deny with optional comment. Best for teams with a dedicated AI operations function.",
                },
                {
                  icon: <MessageSquare className="w-6 h-6 text-emerald-500" />,
                  title: "Slack",
                  desc: "Approval requests are posted to a designated Slack channel with action details and approve/deny buttons. Responses are processed in under 2 seconds. Best for engineering and ops teams who live in Slack. Supports thread-based discussion before decision.",
                },
                {
                  icon: <Mail className="w-6 h-6 text-emerald-500" />,
                  title: "Email",
                  desc: "Approval requests sent via email with a one-click approval/deny link that expires with the TTL. Best for executive approvers who need context-rich notifications. Supports mobile response. Not recommended as the sole channel for time-sensitive actions.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all"
                >
                  <div className="mb-4">{card.icon}</div>
                  <p className="text-white font-black text-base mb-3">{card.title}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: EU AI Act Article 14 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <ShieldCheck className="w-7 h-7 text-emerald-500 shrink-0" />
              EU AI Act Article 14: Human Oversight
            </h2>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                EU AI Act Article 14 — Human Oversight Requirement
              </p>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Article 14 of the EU AI Act requires that high-risk AI systems be designed and
                developed in such a way that they can be effectively overseen by natural persons
                during the period of use. This means the oversight capability must be{" "}
                <em>built into the system</em>, not bolted on as a post-hoc monitoring dashboard.
              </p>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Article 14(4) specifies that the oversight measures must enable persons to{" "}
                <em>&quot;decide not to use the AI system in a specific situation,&quot;</em>{" "}
                to{" "}
                <em>&quot;override the output of the AI system,&quot;</em>{" "}
                and to{" "}
                <em>&quot;intervene in the operation of the AI system.&quot;</em>{" "}
                A HITL approval workflow directly implements all three requirements: the reviewer
                can deny an action (decide not to use), can modify the action parameters before
                approval (override output), and can pause the agent (intervene in operation).
              </p>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Article 14(5) adds that where fully automated monitoring is not possible, the
                system must enable humans to exercise oversight based on understandable information.
                SupraWall&apos;s approval requests include the full action context — parameters, risk
                score, policy match reason, and agent session history — in a human-readable format
                specifically designed to enable informed decisions under time pressure.
              </p>
              <p className="text-neutral-300 text-sm leading-relaxed">
                SupraWall generates a compliance evidence package that maps each HITL configuration
                to Article 14 requirements, with approval logs and TTL configurations documented
                for inclusion in technical documentation required under Article 11.
              </p>
            </div>
          </section>

          {/* Section 6: Approval Expiry */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Clock className="w-7 h-7 text-emerald-500 shrink-0" />
              Approval Expiry and Auto-Deny
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              One of the most commonly overlooked aspects of HITL design is{" "}
              <span className="text-white font-semibold">approval TTL</span>. An approval system
              without expiry has a critical failure mode: a reviewer approves an action hours or
              days after it was requested, by which point the agent&apos;s context has changed, the
              business conditions have changed, or the action is no longer appropriate — but it
              executes anyway because the approval is technically valid.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              SupraWall enforces TTLs at the policy level. When a TTL expires before a decision
              is made, the request is automatically denied and the agent receives an{" "}
              <code className="text-emerald-400 text-sm bg-neutral-900 px-2 py-0.5 rounded-lg">
                ApprovalExpired
              </code>{" "}
              exception. The safe default is always denial — an agent waiting indefinitely for
              approval should not be allowed to proceed just because no one got to the queue.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              TTL recommendations by action category:
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] pb-4 pr-6">
                      Action Category
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] pb-4 pr-6">
                      Recommended TTL
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] pb-4">
                      Rationale
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["Financial (small, &lt;$500)", "15 minutes", "Context changes quickly; low TTL forces timely review"],
                    ["Financial (large, &gt;$500)", "60 minutes", "Higher stakes warrant more review time but not indefinitely"],
                    ["Data Deletion", "30 minutes", "Irreversibility demands fast response; longer creates risk"],
                    ["External Communication", "60 minutes", "Content may still be relevant; reviewer needs context time"],
                    ["Infrastructure Changes", "30 minutes", "Infrastructure state changes rapidly; stale approvals dangerous"],
                    ["Bulk Operations (any)", "15 minutes", "Volume amplification makes staleness extremely dangerous"],
                  ].map(([cat, ttl, rationale], i) => (
                    <tr key={i}>
                      <td className="py-3 pr-6 text-white font-semibold text-xs" dangerouslySetInnerHTML={{ __html: cat }} />
                      <td className="py-3 pr-6 text-emerald-400 font-mono text-xs">{ttl}</td>
                      <td className="py-3 text-neutral-400 text-xs">{rationale}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 7: Implementation Steps */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Terminal className="w-7 h-7 text-emerald-500 shrink-0" />
              Implementing HITL in 4 Steps
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: "01",
                  title: "Identify High-Risk Actions",
                  desc: "Audit your agent's tool set and classify each tool call by risk category. Use the four categories above (financial, deletion, external communication, infrastructure) as a starting framework. Map each tool to a risk level.",
                },
                {
                  step: "02",
                  title: "Define REQUIRE_APPROVAL Policies",
                  desc: "For each high-risk tool, create a REQUIRE_APPROVAL policy with an appropriate approver channel and TTL. Start conservative — it is easier to loosen oversight than to explain a breach to regulators.",
                },
                {
                  step: "03",
                  title: "Configure Approval Channels",
                  desc: "Connect SupraWall to your Slack workspace, email system, or configure the dashboard queue. Assign specific reviewers or groups to each policy. Test the approval flow end-to-end before deploying to production.",
                },
                {
                  step: "04",
                  title: "Add Exception Handling",
                  desc: "Update your agent code to handle ApprovalRequired, ApprovalDenied, and ApprovalExpired exceptions gracefully. The agent should communicate status to end users, log outcomes, and fail safely when approvals are denied.",
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
                    <p className="text-white font-black text-base mb-2">{item.title}</p>
                    <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <HelpCircle className="w-7 h-7 text-emerald-500 shrink-0" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "What is human-in-the-loop for AI agents?",
                  a: "Human-in-the-loop (HITL) for AI agents is the mechanism that pauses autonomous execution and routes high-stakes actions to a human reviewer before the agent proceeds. Rather than blocking all agent actions, a HITL system uses risk-based policies to identify which specific actions require human approval and which can execute autonomously.",
                },
                {
                  q: "Does EU AI Act Article 14 require human-in-the-loop?",
                  a: "Yes. Article 14 of the EU AI Act requires high-risk AI systems to allow for effective oversight by natural persons. This includes the ability to decide not to use the AI system, to override its output, and to intervene in its operation. HITL approval workflows are the primary technical implementation of this requirement for autonomous agents.",
                },
                {
                  q: "What happens if an approval request expires before a human responds?",
                  a: "SupraWall HITL requests have a configurable TTL (time-to-live). If the TTL expires before a reviewer approves or denies the request, the action is automatically denied and the agent receives a timeout response. The agent can then choose to retry, escalate, or fail gracefully depending on its error handling logic. This prevents stale approvals from being applied to a context that has already changed.",
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

          {/* Related Links */}
          <section className="space-y-4">
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em]">
              Related Resources
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/integrations/langchain"
                className="px-6 py-3 bg-neutral-900 border border-white/5 rounded-2xl text-sm text-neutral-300 hover:border-emerald-500/30 hover:text-white transition-all font-medium"
              >
                LangChain Integration →
              </Link>
              <Link
                href="/learn/eu-ai-act-article-14-human-oversight"
                className="px-6 py-3 bg-neutral-900 border border-white/5 rounded-2xl text-sm text-neutral-300 hover:border-emerald-500/30 hover:text-white transition-all font-medium"
              >
                EU AI Act Article 14 Deep Dive →
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-24 p-16 rounded-[4rem] bg-emerald-600 text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white">
              Add Oversight Now.
            </h2>
            <p className="text-emerald-100 text-lg max-w-xl mx-auto">
              Stop your agents from taking irreversible actions without review. Deploy HITL
              policies in under 30 minutes and satisfy Article 14 with a documented evidence
              trail.
            </p>
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
