// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import {
  AlertTriangle,
  Layers,
  Code2,
  Activity,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Set Token Limits for AI Agents (Prevent Runaway Costs) 2026",
  description:
    "AI agents with no token limits burn budgets and hit rate limits. Learn 3 methods to set hard token caps for LangChain, OpenAI Agents, and CrewAI — plus auto-termination when limits are hit. Free setup guide.",
  keywords: [
    "set AI agent token limits",
    "LangChain token budget",
    "Vercel AI SDK token cap",
    "CrewAI cost control",
    "LLM usage limits",
    "AI agent cost management",
  ],
  alternates: {
    canonical:
      "https://www.supra-wall.com/learn/how-to-set-token-limits-ai-agents",
  },
  openGraph: {
    title: "How to Set Token Limits for AI Agents (Prevent Runaway Costs) 2026",
    description:
      "AI agents with no token limits burn budgets and hit rate limits. Learn 3 methods to set hard token caps for LangChain, OpenAI Agents, and CrewAI — plus auto-termination when limits are hit. Free setup guide.",
    url: "https://www.supra-wall.com/learn/how-to-set-token-limits-ai-agents",
    siteName: "SupraWall",
    type: "article",
  },
};

export default function HowToSetTokenLimitsPage() {
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Set Token Limits for AI Agents",
    description:
      "A step-by-step guide to implementing hard token caps and budget limits on LangChain, CrewAI, AutoGen, and OpenAI Assistants API agents.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Install SupraWall",
        text: "Add the SupraWall SDK to your Python or TypeScript project to enable intercepting tool calls.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Configure Token Policy",
        text: "Define your security policy with specific daily_limit_usd or session_tokens thresholds.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Set Per-Agent Limits",
        text: "Apply your budget policy to individual agents using the protect() wrapper.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Test Enforcement",
        text: "Run a simulated loop to verify that SupraWall halts the agent exactly when the limit is reached.",
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "How to Set Token Limits for AI Agents (Python & TypeScript)",
    description:
      "Hard cap vs. soft limit: which token control strategy actually prevents runaway AI agent costs? Step-by-step implementation guide for LangChain, CrewAI, AutoGen.",
    author: { "@type": "Organization", name: "SupraWall" },
    datePublished: "2026-01-01",
    genre: "Technical Guide",
    keywords:
      "AI agent token limits, set token limit AI agent, LLM token budget, agent token cap",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What's the difference between max_tokens and a budget limit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "max_tokens limits a single LLM call's response length. A budget limit (daily_limit_usd) tracks cumulative spend across all calls in a session or day and halts when the threshold is reached.",
        },
      },
      {
        "@type": "Question",
        name: "Does SupraWall work with all LLM providers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. SupraWall's budget enforcement is provider-agnostic. It intercepts at the agent framework level (LangChain, CrewAI, AutoGen), not at the LLM API level.",
        },
      },
      {
        "@type": "Question",
        name: "What happens to the agent when it hits the budget?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "By default, SupraWall raises a BudgetExceeded exception, which terminates the agent gracefully. You can configure on_budget_exceeded to 'notify' (continue with warning), 'halt' (terminate), or 'require_approval' (pause pending human review).",
        },
      },
      {
        "@type": "Question",
        name: "Can I set different limits for different agent roles?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Define per-agent scopes: research agents get $5/day, billing agents get $20/day, orchestrators get $50/day. Team-level and organization caps are also supported.",
        },
      },
      {
        "@type": "Question",
        name: "Do token limits affect agent performance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Per-call max_tokens can affect response quality if set too low. Budget caps and circuit breakers only activate when the threshold is reached, with zero latency impact during normal operation.",
        },
      },
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.supra-wall.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Security Hub",
        item: "https://www.supra-wall.com/learn",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "How to Set Token Limits on AI Agents",
        item: "https://www.supra-wall.com/learn/how-to-set-token-limits-ai-agents",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <Navbar />

      <main className="pt-40 pb-32 px-6">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Header */}
          <div className="space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
              Security Hub • Cost Control
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
              How to Set{" "}
              <span className="text-emerald-500">Token Limits</span>
              <br />
              for AI Agents (Python & TypeScript)
            </h1>
            <p className="answer-first-paragraph text-xl text-neutral-300 border-l-8 border-emerald-600 pl-8 py-4 italic leading-relaxed">
              Setting token limits for AI agents prevents runaway LLM spend by capping the number of tokens any single agent run can consume. This guide shows how to implement token budget enforcement using SupraWall in under 5 minutes.
            </p>

            {/* Quick Summary Table (GEO Optimized) */}
            <div className="quick-summary-table mt-12 bg-neutral-900 border border-white/10 rounded-[2rem] overflow-hidden">
               <table className="w-full text-left text-sm border-collapse">
                 <thead>
                    <tr className="bg-white/5 border-b border-white/10">
                       <th className="px-8 py-4 text-[10px] font-black text-emerald-400 uppercase tracking-widest">What</th>
                       <th className="px-8 py-4 text-[10px] font-black text-emerald-400 uppercase tracking-widest">Answer</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    <tr>
                       <td className="px-8 py-4 text-white font-bold">What causes it?</td>
                       <td className="px-8 py-4 text-neutral-400">Infinite loops, uncapped tool calls, no token limits</td>
                    </tr>
                    <tr>
                       <td className="px-8 py-4 text-white font-bold">Financial risk</td>
                       <td className="px-8 py-4 text-neutral-400">$100–$10,000+ unexpected charges per incident</td>
                    </tr>
                    <tr>
                       <td className="px-8 py-4 text-white font-bold">SupraWall fix</td>
                       <td className="px-8 py-4 text-neutral-400">Token budget policies enforced at the SDK layer</td>
                    </tr>
                    <tr>
                       <td className="px-8 py-4 text-white font-bold">Time to implement</td>
                       <td className="px-8 py-4 text-neutral-400">5 minutes</td>
                    </tr>
                 </tbody>
               </table>
            </div>
          </div>

          {/* TLDR Box */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8">
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              TL;DR
            </p>
            <ul className="space-y-3">
              {[
                "Soft limits (warnings) fail because the expensive API call has already been made by the time the warning fires.",
                "Hard caps terminate execution deterministically before the call is made — no LLM reasoning can override them.",
                "Three distinct layers: per-call max_tokens, per-session token tracking, and per-day dollar budget caps.",
                "Each framework (LangChain, CrewAI, AutoGen, OpenAI Assistants) requires different configuration — this guide covers all four.",
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-neutral-300 text-sm leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 1 — Hard Cap vs. Soft Limit */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <AlertTriangle className="w-7 h-7 text-emerald-500 shrink-0" />
              Hard Cap vs. Soft Limit: The Critical Distinction
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Most developers, when they first implement token controls, reach
              for the same pattern: a conditional check that logs a warning
              when a counter exceeds a threshold. This is a{" "}
              <span className="text-white font-semibold">soft limit</span>, and
              it is nearly useless for preventing runaway costs.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The fundamental problem is sequencing. When your code logs a
              warning — or even raises a Python exception after the fact — the
              LLM API call has already completed. The tokens have been consumed.
              The money has been spent. The warning is a notification that
              something expensive just happened, not a prevention mechanism.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              In a looping agent context, this distinction is catastrophic. If
              your soft limit fires on call 101, you&apos;ve already paid for
              all 100 calls before it. And if your exception handling is
              imperfect — if the loop catches and swallows the exception — your
              soft limit may never actually stop anything.
            </p>

            {/* Callout box */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-[2.5rem] p-8 text-center">
              <p className="text-2xl font-black text-emerald-300 italic">
                &quot;A soft limit is a speed bump. A hard cap is a wall.&quot;
              </p>
            </div>

            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              <span className="text-white font-semibold">Hard caps</span>{" "}
              terminate execution deterministically. The enforcement happens at
              the interception layer, before the API call is dispatched. No
              amount of LLM reasoning, exception handling variation, or framework
              quirk can override a hard cap — because the call never reaches the
              API in the first place.
            </p>
          </section>

          {/* Section 2 — The Three Types */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Layers className="w-7 h-7 text-emerald-500 shrink-0" />
              The Three Types of Token Limits
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Effective token control requires all three layers working together.
              Each addresses a distinct failure mode. Implementing only one or
              two leaves meaningful gaps.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Layer 01",
                  title: "Per-Call Limits",
                  desc: "Max tokens for a single LLM invocation. Prevents any single call from being catastrophically expensive. Easiest to implement, weakest protection — doesn't catch accumulation across multiple calls.",
                  code: `llm = ChatOpenAI(\n  model="gpt-4o",\n  max_tokens=4096\n)`,
                  strength: "Easy",
                  protection: "Low",
                },
                {
                  label: "Layer 02",
                  title: "Per-Session Limits",
                  desc: "Total tokens for an entire agent session. Requires tracking across all calls in a session. Catches gradual context accumulation that per-call limits miss entirely.",
                  code: `# With SupraWall:\nprotect(agent, budget={\n  "session_tokens": 100_000\n})`,
                  strength: "Medium",
                  protection: "Medium",
                },
                {
                  label: "Layer 03",
                  title: "Per-Day Budget Caps",
                  desc: "Converts token count to dollar spend. The most powerful approach because it maps directly to actual cost regardless of model, call pattern, or context size variation.",
                  code: `protect(agent, budget={\n  "daily_limit_usd": 10\n})`,
                  strength: "Hard",
                  protection: "High",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all flex flex-col gap-4"
                >
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
                    {card.label}
                  </p>
                  <p className="text-white font-black text-base">{card.title}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed flex-1">
                    {card.desc}
                  </p>
                  <div className="bg-black/40 rounded-2xl p-4 font-mono text-xs text-neutral-300 overflow-x-auto">
                    <pre>{card.code}</pre>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.15em]">
                      Impl: {card.strength}
                    </span>
                    <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.15em]">
                      Protection: {card.protection}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3 — Implementation Guide by Framework */}
          <section className="space-y-8">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Code2 className="w-7 h-7 text-emerald-500 shrink-0" />
              Implementation Guide by Framework
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Every major agent framework handles token limits differently.
              Native controls are inconsistent — some count iterations, some
              count wall-clock time, and most don&apos;t track cumulative spend
              at all. The following configurations show the correct approach
              for each framework, combining native controls with SupraWall&apos;s
              budget layer.
            </p>

            {/* LangChain */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-emerald-500/30">01</span>
                <h3 className="text-xl font-black text-white">LangChain</h3>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed">
                LangChain&apos;s{" "}
                <span className="text-white font-mono text-sm">AgentExecutor</span>{" "}
                offers{" "}
                <span className="text-white font-mono text-sm">max_iterations</span>{" "}
                and{" "}
                <span className="text-white font-mono text-sm">max_execution_time</span>{" "}
                as native guardrails. These stop runaway loops at the step
                level, but they don&apos;t track token spend, don&apos;t
                distinguish between a cheap and an expensive iteration, and
                can&apos;t enforce a daily dollar budget. SupraWall adds the
                budget and circuit breaker layer on top of the native controls.
              </p>
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`from langchain.agents import AgentExecutor
from suprawall.langchain import protect

# Native: max_iterations stops loops but doesn't track spend
agent = AgentExecutor(
    agent=llm_agent,
    tools=tools,
    max_iterations=25,        # stops after 25 steps
    max_execution_time=120,   # stops after 120 seconds
)

# SupraWall: adds dollar budget + token tracking on top
secured = protect(agent, budget={
    "daily_limit_usd": 10,
    "session_tokens": 200_000,    # 200K tokens per session
    "circuit_breaker": {
        "max_identical_calls": 5,
        "window_seconds": 30,
    }
})`}</pre>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Note: the{" "}
                <span className="text-white font-mono text-sm">max_iterations</span>{" "}
                native control and the SupraWall budget are complementary, not
                redundant. Native controls catch step-count loops;
                SupraWall catches expensive-but-short sessions and context inflation.
              </p>
            </div>

            {/* CrewAI */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-emerald-500/30">02</span>
                <h3 className="text-xl font-black text-white">CrewAI</h3>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed">
                CrewAI has no native budget enforcement mechanism. Multi-agent
                crews can spawn multiple agents working in parallel, each
                billing independently, with no central cost tracking. The
                correct approach is to wrap the entire crew and define
                per-agent and crew-level budgets simultaneously.
              </p>
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`from suprawall.crewai import protect_crew

secured_crew = protect_crew(
    crew,
    budget={
        "per_agent_daily_usd": 5.00,    # $5/day per agent in the crew
        "crew_daily_usd": 20.00,        # $20/day for the entire crew
        "session_tokens_per_agent": 50_000,
    },
    on_budget_exceeded="notify_and_pause"  # sends webhook before halting
)`}</pre>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                The{" "}
                <span className="text-white font-mono text-sm">crew_daily_usd</span>{" "}
                cap acts as a ceiling across all agents combined.
                The{" "}
                <span className="text-white font-mono text-sm">per_agent_daily_usd</span>{" "}
                cap prevents any single agent from consuming the entire crew budget.
                Both must be exceeded before the hard stop fires — whichever is
                reached first takes precedence.
              </p>
            </div>

            {/* AutoGen */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-emerald-500/30">03</span>
                <h3 className="text-xl font-black text-white">AutoGen</h3>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed">
                AutoGen&apos;s native{" "}
                <span className="text-white font-mono text-sm">max_turns</span>{" "}
                parameter counts conversation turns, not tokens. This is
                particularly deceptive: a single turn can consume 100K tokens
                if the context is large, making turn-based limits an unreliable
                proxy for cost control. SupraWall replaces the default
                GroupChatManager with a token-aware variant.
              </p>
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`import autogen
from suprawall.autogen import SupraWallGroupChatManager

# Native: max_turns counts conversation turns, not tokens
# This is insufficient — a single turn can consume 100K tokens

# SupraWall: token-aware enforcement
manager = SupraWallGroupChatManager(
    groupchat=group_chat,
    budget={
        "session_tokens": 500_000,    # total tokens across all agents in session
        "daily_limit_usd": 25.00,
    }
)`}</pre>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                The{" "}
                <span className="text-white font-mono text-sm">session_tokens</span>{" "}
                limit here applies to the entire group chat session — all agents
                combined. This correctly models AutoGen&apos;s multi-agent cost
                structure where a single conversation involves multiple
                participants each consuming tokens simultaneously.
              </p>
            </div>

            {/* OpenAI Assistants API */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-emerald-500/30">04</span>
                <h3 className="text-xl font-black text-white">OpenAI Assistants API</h3>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed">
                The OpenAI Assistants API exposes{" "}
                <span className="text-white font-mono text-sm">max_prompt_tokens</span>{" "}
                and{" "}
                <span className="text-white font-mono text-sm">max_completion_tokens</span>{" "}
                at the run level. These correctly limit individual runs, but
                they don&apos;t aggregate across multiple runs within a single
                user session. A session that makes 20 runs each consuming
                10K tokens has consumed 200K tokens total — with no native
                mechanism to detect or halt that.
              </p>
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`# Native: max_prompt_tokens and max_completion_tokens at run level
# These don't aggregate across multiple runs in a session

# Correct approach with SupraWall session tracking:
from suprawall.openai import SecureAssistantSession

session = SecureAssistantSession(
    assistant_id="asst_...",
    budget={
        "session_tokens": 200_000,  # across all runs in this session
        "daily_limit_usd": 15.00,
    }
)
response = await session.run("Analyze Q4 results")
# Session tracks tokens cumulatively across all runs`}</pre>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                <span className="text-white font-semibold">SecureAssistantSession</span>{" "}
                maintains a cumulative token counter that persists across all
                runs within the session object&apos;s lifecycle. This correctly
                models how Assistants API costs actually accrue in production.
              </p>
            </div>
          </section>

          {/* Section 4 — Monitoring and Alerting */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Activity className="w-7 h-7 text-emerald-500 shrink-0" />
              Monitoring and Alerting
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Token limits without observability are incomplete. A hard cap that
              silently kills an agent in production — without notifying your
              on-call team — is nearly as bad as no cap at all. The correct
              configuration layers alerts at 50% and 80% of the budget before
              the hard 100% cutoff.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              This gives your team two intervention windows: one to investigate
              whether the spend is expected, and one final warning to take
              action before the agent halts. SupraWall supports webhook delivery
              to any target — Slack, PagerDuty, custom endpoints.
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <pre className="text-neutral-300 leading-relaxed">{`secured = protect(
    agent,
    budget={
        "daily_limit_usd": 100,
        "alerts": [
            {"threshold": 0.5, "channel": "slack",     "webhook": "https://hooks.slack.com/..."},
            {"threshold": 0.8, "channel": "pagerduty", "webhook": "https://events.pagerduty.com/..."},
            {"threshold": 1.0, "action": "halt"},   # hard cap at 100%
        ]
    }
)`}</pre>
            </div>

            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Each alert fires with a structured payload that includes the
              agent ID, current spend, daily limit, and session ID. This gives
              your team everything needed to locate and investigate the agent
              without manually querying API logs.
            </p>

            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <pre className="text-neutral-300 leading-relaxed">{`{
  "event": "budget_threshold_reached",
  "agent_id": "research-agent-v2",
  "threshold_pct": 80,
  "current_spend_usd": 80.00,
  "daily_limit_usd": 100.00,
  "session_id": "sess_xK7m9...",
  "timestamp": "2026-03-15T14:32:17Z"
}`}</pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "50% Alert — Investigate",
                  desc: "Half the daily budget consumed. Check whether this is expected traffic volume or an early sign of a loop. No action required unless patterns look abnormal.",
                },
                {
                  title: "80% Alert — Prepare to Intervene",
                  desc: "Budget is nearly exhausted. If this is unexpected, halt the agent manually before the hard cap fires. The 80% alert is your last human decision point.",
                },
                {
                  title: "100% Hard Cap — Auto-Halt",
                  desc: "SupraWall raises BudgetExceeded. Agent terminates gracefully. All subsequent tool calls are blocked until the budget resets at midnight UTC or is manually extended.",
                },
                {
                  title: "Incident Log",
                  desc: "Every budget event is logged with full context in the SupraWall audit trail: agent ID, session ID, total tokens consumed, total spend, and halt reason.",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all"
                >
                  <p className="text-white font-black text-base mb-3">{card.title}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Reference: Per-Framework Summary */}
          <section className="space-y-6">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">
              Quick Reference
            </p>
            <h2 className="text-2xl font-black italic text-white">
              Native vs. SupraWall Controls by Framework
            </h2>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[10px] font-black text-emerald-400 uppercase tracking-[0.15em] pb-4 pr-6">
                      Framework
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] pb-4 pr-6">
                      Native Token Control
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] pb-4 pr-6">
                      Tracks Cumulative Spend?
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] pb-4">
                      SupraWall Integration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["LangChain", "max_iterations, max_execution_time", "No", "protect() wrapper"],
                    ["CrewAI", "None", "No", "protect_crew() wrapper"],
                    ["AutoGen", "max_turns (turns only, not tokens)", "No", "SupraWallGroupChatManager"],
                    ["OpenAI Assistants", "max_prompt/completion_tokens (per run)", "No", "SecureAssistantSession"],
                  ].map(([framework, native, tracks, sw], i) => (
                    <tr key={i}>
                      <td className="py-3 pr-6 text-white font-semibold text-xs">{framework}</td>
                      <td className="py-3 pr-6 text-neutral-400 font-mono text-xs">{native}</td>
                      <td className={`py-3 pr-6 text-xs font-semibold ${tracks === "No" ? "text-rose-400" : "text-emerald-400"}`}>{tracks}</td>
                      <td className="py-3 text-emerald-300 font-mono text-xs">{sw}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Related Links */}
          <section className="space-y-4">
            <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
              Related Resources
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Budget Limits Feature", href: "/features/budget-limits" },
                { label: "AI Agent Runaway Costs", href: "/learn/ai-agent-runaway-costs" },
                { label: "Infinite Loop Detection", href: "/learn/ai-agent-infinite-loop-detection" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-5 py-2.5 bg-neutral-900 border border-white/10 rounded-2xl text-sm text-neutral-300 hover:border-emerald-500/30 hover:text-white transition-all font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <HelpCircle className="w-7 h-7 text-emerald-500 shrink-0" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "What's the difference between max_tokens and a budget limit?",
                  a: "max_tokens limits a single LLM call's response length. A budget limit (daily_limit_usd) tracks cumulative spend across all calls in a session or day and halts when the threshold is reached. They operate at entirely different granularities and you typically need both.",
                },
                {
                  q: "Does SupraWall work with all LLM providers?",
                  a: "Yes. SupraWall's budget enforcement is provider-agnostic. It intercepts at the agent framework level (LangChain, CrewAI, AutoGen), not at the LLM API level. This means it works with OpenAI, Anthropic, Google, Mistral, or any model your framework supports.",
                },
                {
                  q: "What happens to the agent when it hits the budget?",
                  a: "By default, SupraWall raises a BudgetExceeded exception, which terminates the agent gracefully. You can configure on_budget_exceeded to 'notify' (continue with warning), 'halt' (terminate), or 'require_approval' (pause pending human review). The agent state is preserved so you can resume after approval.",
                },
                {
                  q: "Can I set different limits for different agent roles?",
                  a: "Yes. Define per-agent scopes: research agents get $5/day, billing agents get $20/day, orchestrators get $50/day. Team-level and organization caps are also supported, allowing nested budget hierarchies where the most restrictive applicable limit always wins.",
                },
                {
                  q: "Do token limits affect agent performance?",
                  a: "Per-call max_tokens can affect response quality if set too low — the model may truncate reasoning or output. Budget caps and circuit breakers only activate when their threshold is reached, adding zero latency to normal operation. We recommend setting per-call max_tokens at 2× your expected response length to leave headroom without enabling unlimited context.",
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
              Set Hard Budget Caps on Your Agents.
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/features/budget-limits"
                className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all"
              >
                See Budget Limits
              </Link>
              <Link
                href="/login"
                className="px-10 py-4 bg-black/20 text-white border-2 border-white/20 font-black uppercase tracking-widest rounded-2xl hover:bg-black/40 transition-all"
              >
                Start Free
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
