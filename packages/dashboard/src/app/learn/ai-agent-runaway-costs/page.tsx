// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import {
  AlertTriangle,
  Terminal,
  DollarSign,
  Shield,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Agent Runaway Costs: Prevention Guide 2026 | SupraWall",
  description:
    "AI agents with no budget limits can burn thousands overnight through infinite loops and recursive calls. Real incidents, root causes, and how to set hard caps.",
  keywords: [
    "AI agent runaway costs",
    "AI agent cost control",
    "LLM runaway costs",
    "prevent AI agent overspending",
    "AI agent overnight bill",
    "agent token budget",
  ],
  alternates: {
    canonical: "https://www.supra-wall.com/learn/ai-agent-runaway-costs",
  },
  openGraph: {
    title: "AI Agent Runaway Costs: Real Incidents and How to Prevent Them",
    description:
      "AI agents with no budget limits can burn thousands overnight through infinite loops and recursive calls. Real incidents, root causes, and how to set hard caps.",
    url: "https://www.supra-wall.com/learn/ai-agent-runaway-costs",
    siteName: "SupraWall",
    type: "article",
  },
};

export default function AIAgentRunawayCostsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "AI Agent Runaway Costs: Prevention Guide 2026",
    description:
      "AI agents with no budget limits can burn thousands overnight through infinite loops and recursive calls. Real incidents, root causes, and how to set hard caps.",
    author: { "@type": "Organization", name: "SupraWall" },
    datePublished: "2026-01-01",
    genre: "Incident Report & Prevention Guide",
    keywords:
      "AI agent runaway costs, AI agent cost control, LLM runaway costs, prevent AI agent overspending",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an AI agent runaway cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "When an agent enters an infinite loop or recursive pattern with no stopping mechanism, each tool call incurs an API cost. At scale, this compounds to thousands of dollars before a human notices.",
        },
      },
      {
        "@type": "Question",
        name: "How do I set a hard daily limit on my AI agent?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use SDK-level budget enforcement. SupraWall's budget config: protect(agent, budget={'daily_limit_usd': 10}). This blocks all tool calls once the agent has accumulated $10 in API costs for the day.",
        },
      },
      {
        "@type": "Question",
        name: "What is a circuit breaker for AI agents?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A circuit breaker detects repetitive tool call patterns (the same tool called with identical arguments multiple times in a short window) and halts the agent before costs escalate. It's the agent equivalent of a thermal shutoff.",
        },
      },
      {
        "@type": "Question",
        name: "Will API provider rate limits protect me?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Only partially. Rate limits apply at the account or organization level — they don't distinguish between your production agent and a rogue loop. They also limit all traffic, not just the looping agent.",
        },
      },
      {
        "@type": "Question",
        name: "How do I know if my agent is currently in a loop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Monitor your audit logs for repeated identical tool calls with the same parameters within a short time window. SupraWall flags these automatically and can halt the agent or notify your team.",
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
        name: "AI Agent Runaway Costs",
        item: "https://www.supra-wall.com/learn/ai-agent-runaway-costs",
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
              AI Agent{" "}
              <span className="text-rose-500">Runaway</span>
              <br />
              Costs.
            </h1>
            <p className="text-xl text-neutral-300 border-l-8 border-emerald-600 pl-8 py-4 italic leading-relaxed">
              AI agent runaway costs occur when autonomous agents enter infinite
              tool loops, recursive spawning chains, or hallucinated repetition
              cycles with no hard stopping mechanism. Without budget enforcement,
              a single misbehaving agent can accumulate thousands of dollars in
              API charges overnight — often with no alerts, no circuit breakers,
              and no human in the loop.
            </p>
          </div>

          {/* TLDR Box */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8">
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              TL;DR
            </p>
            <ul className="space-y-3">
              {[
                "Agents with no max_iterations or budget caps can generate thousands of API calls in hours — entirely undetected.",
                "The four root causes are: infinite tool loops, recursive agent spawning, context window inflation, and hallucinated repetition.",
                "Application-level counters are fragile. API provider rate limits are blunt. SDK-level budget enforcement is the only reliable protection.",
                "A single looping GPT-4o agent can cost $500+ per incident. Ten agents looping simultaneously: $5,000.",
              ].map((point, i) => (
                <li key={i} className="flex items-start gap-3 text-neutral-300 text-sm leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 1 — The $4,000 Wake-Up Call */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <AlertTriangle className="w-7 h-7 text-rose-500 shrink-0" />
              The $4,000 Wake-Up Call
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              It was a Friday afternoon deployment. A developer shipped a{" "}
              <span className="text-white font-semibold">LangChain research agent</span>{" "}
              to do competitive analysis over the weekend. The setup looked
              reasonable: a{" "}
              <span className="text-white font-semibold">web_search</span> tool
              and a <span className="text-white font-semibold">summarize</span>{" "}
              tool, chained together to gather and digest market intelligence.
              No one would need to babysit it. That was the point.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The first sign of trouble was invisible. One of the search results
              returned a{" "}
              <span className="text-rose-400 font-semibold">429 rate limit error</span>.
              The LLM, interpreting the error as a signal that the task was
              incomplete, did what it was designed to do: it tried again. It
              got another 429. It tried again. The loop had started, and there
              was nothing to stop it.
            </p>
            <div className="bg-neutral-900 border border-rose-500/20 rounded-[2.5rem] p-8 space-y-4">
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">
                Incident Timeline
              </p>
              <div className="space-y-3">
                {[
                  { time: "Friday 6:00 PM", event: "Agent deployed. First search executes successfully." },
                  { time: "Friday 7:14 PM", event: "429 rate limit error encountered. Retry loop begins." },
                  { time: "Friday Midnight", event: "8,400 API calls accumulated. Zero alerts fired." },
                  { time: "Saturday 3:00 AM", event: "47,000 API calls. Context window inflating on each retry." },
                  { time: "Monday 9:00 AM", event: "847,000 API calls. $3,847 in OpenAI charges. Account suspended." },
                  { time: "Monday 9:03 AM", event: "Developer discovers the outage when GPT-4 returns 402 Payment Required." },
                ].map((row, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <span className="text-rose-400 font-black text-xs shrink-0 w-40">{row.time}</span>
                    <span className="text-neutral-300 text-sm">{row.event}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Nobody configured alerts. Nobody set limits. The circuit breaker
              existed as a comment in the backlog:{" "}
              <span className="text-neutral-200 font-mono text-sm bg-neutral-900 px-2 py-1 rounded-lg">
                // TODO: add max_iterations
              </span>
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The agent wasn&apos;t hacked. It did exactly what it was designed to
              do: try until it succeeds. There was just nothing to tell it to
              stop.
            </p>
          </section>

          {/* Section 2 — The Four Root Causes */}
          <section className="space-y-8">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Terminal className="w-7 h-7 text-emerald-500 shrink-0" />
              The Four Root Causes
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Runaway costs don&apos;t happen randomly. They follow predictable
              structural patterns that emerge from how LLM-based agents interpret
              errors and manage state. Understanding these patterns is the first
              step to preventing them.
            </p>

            {/* Root Cause 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-emerald-500/30">01</span>
                <h3 className="text-xl font-black text-white">Infinite Tool Loops</h3>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed">
                The most common root cause. The LLM interprets every error response
                as a signal that the task is incomplete and that it should retry.
                No native LangChain or CrewAI mechanism prevents this by default —
                the{" "}
                <span className="text-white font-mono text-sm">max_iterations</span>{" "}
                parameter exists but defaults to{" "}
                <span className="text-white font-mono text-sm">None</span> in many
                configurations, meaning the agent will loop indefinitely until the
                process is killed or the account is suspended.
              </p>
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`# LangChain agent with no max_iterations (or max_iterations=None)
agent = AgentExecutor(agent=llm_agent, tools=tools, max_iterations=None)
# Tool returns: {"error": "rate_limit_exceeded", "retry_after": 60}
# LLM decides: "I should retry this call"
# Repeats 10,000 times`}</pre>
              </div>
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl px-6 py-4">
                <p className="text-rose-300 text-sm">
                  <span className="font-black">Cost estimate:</span> GPT-4o at $0.005/1K tokens,
                  2,000 tokens per retry:{" "}
                  <span className="font-black text-rose-400">
                    $0.01 per call × 10,000 calls = $100
                  </span>
                </p>
              </div>
            </div>

            {/* Root Cause 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-emerald-500/30">02</span>
                <h3 className="text-xl font-black text-white">Recursive Agent Spawning</h3>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed">
                Multi-agent orchestrators like AutoGen allow agents to spawn
                sub-agents to handle sub-tasks. Without a depth limit, this creates
                an exponential tree of concurrent agents — each one making its own
                API calls and billing independently. At depth 5 with a branching
                factor of 3, you have 243 agents running simultaneously.
              </p>
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`# AutoGen orchestrator spawns sub-agents that each spawn more sub-agents
# With no depth limit, this creates an exponential tree
orchestrator.spawn_subagent("handle_subtask_1")  # spawns 3 more
# Each of those spawns 3 more = 9 agents
# Each of those spawns 3 more = 27 agents
# Depth 5 = 243 concurrent agents, all billing simultaneously`}</pre>
              </div>
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl px-6 py-4">
                <p className="text-rose-300 text-sm">
                  <span className="font-black">Cost estimate:</span>{" "}
                  <span className="font-black text-rose-400">
                    243 agents × 50 calls each × $0.01 = $121.50 in one exponential burst
                  </span>
                </p>
              </div>
            </div>

            {/* Root Cause 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-emerald-500/30">03</span>
                <h3 className="text-xl font-black text-white">Context Window Inflation</h3>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed">
                Each round-trip in an agent session appends the full tool result
                to the conversation context. This means that the cost per call
                grows with every iteration — early calls appear cheap, masking
                the escalating cost until it&apos;s too late to intervene. The
                100th call can cost 50× more than the first.
              </p>
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`# Each round-trip appends the full tool result to the context
# Round   1:   2,000 tokens  → cost: $0.01
# Round   5:  10,000 tokens  → cost: $0.05
# Round  20:  40,000 tokens  → cost: $0.20
# Round 100: 200,000 tokens  → cost: $1.00 per call
# 1,000 round-trips at average 50K tokens = $250`}</pre>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Context inflation is insidious because early calls are cheap,
                masking the escalating cost until it&apos;s too late.
              </p>
            </div>

            {/* Root Cause 4 */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-black text-emerald-500/30">04</span>
                <h3 className="text-xl font-black text-white">Hallucinated Repetition</h3>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed">
                The LLM completes its task, but in subsequent turns it
                &quot;forgets&quot; or doubts completion and re-invokes the same
                tool chain from scratch. This is not a loop in the traditional
                sense — the agent doesn&apos;t receive an error. It simply
                second-guesses itself and starts over, multiplying the cost by
                the number of repetitions.
              </p>
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`# Agent completes task, but LLM "forgets" or doubts completion
# Reinvokes the same tool chain from scratch
result = agent.run("Generate monthly report for all 500 customers")
# Agent completes reports 1-500
# LLM in next turn: "I should verify these were sent correctly"
# Agent regenerates reports 1-500 again
# Repeat 10 times = 10× the expected cost`}</pre>
              </div>
            </div>
          </section>

          {/* Section 3 — The Math Nobody Does Before Shipping */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <DollarSign className="w-7 h-7 text-emerald-500 shrink-0" />
              The Math Nobody Does Before Shipping
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Most teams ship agents without ever calculating the cost floor of
              normal operation — let alone the cost ceiling of a runaway
              scenario. Here is the arithmetic that should happen before every
              production deployment.
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <pre className="text-neutral-300 leading-relaxed">{`Baseline agent:
  - Tool calls per session:  50
  - Tokens per call:        2,000 (input + output)
  - Model: GPT-4o at $0.005/1K tokens

Cost per session = 50 × (2,000/1,000) × $0.005 = $0.50

Normal operation (100 sessions/day, 30 agents):
  Monthly cost = 100 × 30 × $0.50 × 30 = $45,000 ← already significant

Loop scenario (agent retries 1,000× instead of stopping once):
  Single incident cost = 1,000 × $0.50 = $500 per agent per incident
  10 agents looping simultaneously = $5,000 per incident`}</pre>
            </div>

            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The table below shows how runaway multipliers scale across the
              major frontier models. These figures use the per-token rates as of
              early 2026 and assume 2,000 tokens per agent call. Use this as a
              reference when calculating your exposure.
            </p>

            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 overflow-x-auto">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-6">
                Cost by Loop Multiplier and Model (2,000 tokens/call baseline)
              </p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[10px] font-black text-emerald-400 uppercase tracking-[0.15em] pb-4 pr-6">
                      Agent Scenario
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] pb-4 pr-6">
                      GPT-4o
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] pb-4 pr-6">
                      Claude Sonnet 4
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] pb-4 pr-6">
                      Claude Opus 4
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.15em] pb-4">
                      GPT-4o-mini
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["Normal session (1×)", "$0.01", "$0.006", "$0.03", "$0.0006"],
                    ["100× loop", "$1.00", "$0.60", "$3.00", "$0.06"],
                    ["1,000× loop", "$10.00", "$6.00", "$30.00", "$0.60"],
                    ["10,000× loop", "$100.00", "$60.00", "$300.00", "$6.00"],
                    ["Worst case (100K× loop)", "$1,000.00", "$600.00", "$3,000.00", "$60.00"],
                  ].map(([scenario, gpt4o, sonnet, opus, mini], i) => (
                    <tr key={i}>
                      <td className="py-3 pr-6 text-white font-semibold text-xs">{scenario}</td>
                      <td className="py-3 pr-6 text-neutral-400 font-mono">{gpt4o}</td>
                      <td className="py-3 pr-6 text-neutral-400 font-mono">{sonnet}</td>
                      <td className="py-3 pr-6 text-neutral-400 font-mono">{opus}</td>
                      <td className="py-3 text-neutral-400 font-mono">{mini}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-neutral-400 text-sm leading-relaxed">
              A single Claude Opus 4 agent in a worst-case 100K-loop scenario
              costs $3,000 — from a single misbehaving session. At 10 concurrent
              agents, that&apos;s $30,000 from a single overnight incident.
            </p>
          </section>

          {/* Section 4 — Three Prevention Strategies */}
          <section className="space-y-8">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Shield className="w-7 h-7 text-emerald-500 shrink-0" />
              Three Prevention Strategies
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              There are three architectural levels at which you can attempt to
              prevent runaway costs. They are ordered from weakest to strongest.
              Only one provides reliable protection.
            </p>

            {/* Strategy 1 */}
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] border border-neutral-700 rounded-full px-3 py-1">
                  Strategy 01 — Weak
                </span>
              </div>
              <h3 className="text-xl font-black text-white">Application-Level Counters</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                The most common approach: each developer manually adds a call
                counter to each tool function and raises an exception when the
                limit is reached. This is fragile by design — it requires every
                developer to implement it correctly every time, it doesn&apos;t
                catch context inflation, can&apos;t be centrally enforced, and
                is trivially bypassed by refactors.
              </p>
              <div className="font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`# Common but fragile approach
call_count = 0
MAX_CALLS = 100

def my_tool(args):
    global call_count
    call_count += 1
    if call_count > MAX_CALLS:
        raise RuntimeError("Max calls exceeded")
    return do_actual_work(args)`}</pre>
              </div>
              <ul className="space-y-2">
                {[
                  "Requires every developer to implement correctly — drift is inevitable",
                  "Does not catch context window inflation across calls",
                  "Cannot be centrally audited or enforced across teams",
                  "Counter resets if the process restarts (e.g., during a crash recovery loop)",
                ].map((problem, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-400 text-sm">
                    <span className="text-rose-500 mt-0.5 shrink-0">✗</span>
                    {problem}
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategy 2 */}
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] border border-neutral-700 rounded-full px-3 py-1">
                  Strategy 02 — Medium
                </span>
              </div>
              <h3 className="text-xl font-black text-white">API Provider Rate Limits</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                OpenAI and Anthropic both offer account-level rate limits and
                monthly spend caps in their billing dashboards. Setting these
                is better than nothing, but it comes with a critical flaw: the
                limits apply globally across your entire organization. When a
                single rogue agent triggers the org-level rate limit, every
                other agent in production — including your critical customer-facing
                workflows — gets throttled or blocked simultaneously.
              </p>
              <ul className="space-y-2">
                {[
                  "Applies globally — one bad agent degrades all production traffic",
                  "Does not isolate by agent, session, or user",
                  "Monthly caps don't prevent a single overnight incident from causing damage",
                  "No granularity: you can't give a research agent $5/day while giving a billing agent $50/day",
                ].map((problem, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-400 text-sm">
                    <span className="text-yellow-500 mt-0.5 shrink-0">~</span>
                    {problem}
                  </li>
                ))}
              </ul>
            </div>

            {/* Strategy 3 */}
            <div className="bg-neutral-900 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] border border-emerald-500/30 rounded-full px-3 py-1">
                  Strategy 03 — Strong
                </span>
              </div>
              <h3 className="text-xl font-black text-white">SDK-Level Budget Enforcement</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                The only approach that provides reliable, per-agent, pre-call
                enforcement. SupraWall wraps your agent at the SDK level and
                intercepts every tool call before it reaches the LLM API. If
                the budget would be exceeded, the call is blocked before it is
                made — not detected after the fact. This is the difference
                between a wall and an alarm.
              </p>
              <div className="font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`from suprawall import protect

secured = protect(
    agent,
    budget={
        "daily_limit_usd": 10,        # Hard stop at $10/day per agent
        "session_tokens": 500_000,    # Max tokens per session
        "circuit_breaker": {
            "max_identical_calls": 10,  # Catch loops
            "window_seconds": 60,
        }
    },
    on_budget_exceeded="halt",    # "halt" | "notify" | "require_approval"
)
# When limit is reached: SupraWall raises BudgetExceeded
# Agent halts gracefully, incident is logged, team notified`}</pre>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Why this is the right level: the enforcement happens{" "}
                <span className="text-white font-semibold">before</span> the
                API call is made. Budget overruns are prevented, not just
                detected after the fact. Each agent gets its own independent
                budget — a rogue agent cannot affect other agents&apos; quotas.
              </p>
              <ul className="space-y-2">
                {[
                  "Per-agent isolation — one rogue agent cannot affect production traffic",
                  "Pre-call enforcement — the expensive API call is never made",
                  "Circuit breaker catches loop patterns before they compound",
                  "Configurable response: halt, notify, or require human approval",
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-400 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Section 5 — Incident Response Checklist */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" />
              Incident Response Checklist
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              If you&apos;re reading this because an agent is running right now
              and you&apos;re watching your bill climb in real time, follow this
              checklist in order. Speed matters — every minute of delay is
              additional API spend.
            </p>
            <div className="space-y-4">
              {[
                {
                  n: "01",
                  title: "Set an account-level hard limit immediately",
                  desc: "Go to OpenAI or Anthropic billing → Usage Limits → set a hard daily/monthly cap. This is your emergency brake while you investigate.",
                },
                {
                  n: "02",
                  title: "Identify the agent and session via audit logs",
                  desc: "Filter by agentId and timestamp of the spend spike. If you don't have structured audit logs, check your API request logs for the source IP or API key that is generating the volume.",
                },
                {
                  n: "03",
                  title: "Terminate the agent process and revoke its API key",
                  desc: "Kill the process if it's still running. Immediately rotate or revoke the API key the agent is using. Generate a new key for future deployments — do not reuse the compromised key.",
                },
                {
                  n: "04",
                  title: "Audit all downstream side effects",
                  desc: "Emails sent. Database writes. Charges processed. Webhooks called. The API bill is often not the worst part — side effects from 847,000 repeated tool calls can be catastrophic.",
                },
                {
                  n: "05",
                  title: "Calculate total blast radius",
                  desc: "API costs + downstream charges + human investigation time + any customer impact. Document this number — it will be the most persuasive argument for budget enforcement going forward.",
                },
                {
                  n: "06",
                  title: "Implement budget limits before redeploying",
                  desc: "Do not redeploy the agent without SDK-level budget enforcement in place. See Strategy 3 above. This is not optional for the next deployment.",
                },
                {
                  n: "07",
                  title: "Add alerting at 50% and 80% of daily budget",
                  desc: "Configure alerts that fire before the hard cap is reached. A 50% alert gives you time to investigate manually. An 80% alert is your final warning before the hard stop.",
                },
              ].map((item) => (
                <div
                  key={item.n}
                  className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 hover:border-emerald-500/30 transition-all flex gap-6"
                >
                  <span className="text-4xl font-black text-emerald-500/30 shrink-0">
                    {item.n}
                  </span>
                  <div>
                    <p className="text-white font-black text-base mb-2">{item.title}</p>
                    <p className="text-neutral-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
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
                { label: "Infinite Loop Detection", href: "/learn/ai-agent-infinite-loop-detection" },
                { label: "Prevent Agent Infinite Loops", href: "/blog/prevent-agent-infinite-loops" },
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
                  q: "What is an AI agent runaway cost?",
                  a: "When an agent enters an infinite loop or recursive pattern with no stopping mechanism, each tool call incurs an API cost. At scale, this compounds to thousands of dollars before a human notices.",
                },
                {
                  q: "How do I set a hard daily limit on my AI agent?",
                  a: "Use SDK-level budget enforcement. SupraWall's budget config: protect(agent, budget={'daily_limit_usd': 10}). This blocks all tool calls once the agent has accumulated $10 in API costs for the day.",
                },
                {
                  q: "What is a circuit breaker for AI agents?",
                  a: "A circuit breaker detects repetitive tool call patterns — the same tool called with identical arguments multiple times in a short window — and halts the agent before costs escalate. It's the agent equivalent of a thermal shutoff.",
                },
                {
                  q: "Will API provider rate limits protect me?",
                  a: "Only partially. Rate limits apply at the account or organization level — they don't distinguish between your production agent and a rogue loop. They also limit all traffic, not just the looping agent. When one rogue agent hits the org-level limit, all other production agents are blocked too.",
                },
                {
                  q: "How do I know if my agent is currently in a loop?",
                  a: "Monitor your audit logs for repeated identical tool calls with the same parameters within a short time window. SupraWall flags these automatically and can halt the agent or notify your team before costs compound.",
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
              Set Budget Limits Before Your Next Deployment.
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/features/budget-limits"
                className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all"
              >
                See Budget Limits
              </Link>
              <Link
                href="/beta"
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
    </div>
  );
}
