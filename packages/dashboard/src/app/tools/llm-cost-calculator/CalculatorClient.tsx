// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Info,
} from "lucide-react";

// ── Model pricing (per 1K tokens, blended input/output estimate) ──
const MODEL_PRICES: Record<string, { label: string; price: number }> = {
  "gpt-4o": { label: "GPT-4o", price: 0.005 },
  "gpt-4o-mini": { label: "GPT-4o Mini", price: 0.0003 },
  "claude-opus-4": { label: "Claude Opus 4", price: 0.015 },
  "claude-sonnet-4": { label: "Claude Sonnet 4", price: 0.003 },
  "llama-3-70b": { label: "Llama 3 70B", price: 0.0009 },
};

const LOOP_MULTIPLIERS: Record<string, { label: string; value: number; desc: string }> = {
  low: {
    label: "Low (1×)",
    value: 1,
    desc: "Agent has circuit breakers enabled. Loops are caught within seconds.",
  },
  medium: {
    label: "Medium (10×)",
    value: 10,
    desc: "Historical average for unprotected production incidents. Agent runs a loop for ~10 minutes before someone notices.",
  },
  high: {
    label: "High (100×)",
    value: 100,
    desc: "Catastrophic overnight loop. Agent runs undetected for hours — the classic $4,000 incident.",
  },
};

function fmt(n: number): string {
  if (n >= 10000) return `$${(n / 1000).toFixed(1)}K`;
  if (n >= 1000) return `$${(n / 1000).toFixed(2)}K`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  return `$${n.toFixed(4)}`;
}

function fmtShort(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 10000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

// ── Tooltip component ──
function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="ml-1 text-neutral-600 hover:text-emerald-400 transition-colors"
        aria-label="More information"
        type="button"
      >
        <Info className="w-3 h-3" />
      </button>
      {show && (
        <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-neutral-800 border border-white/10 rounded-xl p-3 text-[11px] text-neutral-300 leading-relaxed z-50 shadow-xl pointer-events-none">
          {text}
        </span>
      )}
    </span>
  );
}

// ── FAQ Accordion ──
const FAQS = [
  {
    q: "How accurate is the LLM cost calculator?",
    a: "The calculator uses current published per-token pricing from OpenAI, Anthropic, and Meta. Blended input/output estimates are used. Actual costs may vary by 10-20% depending on your input/output ratio.",
  },
  {
    q: "What is the loop risk multiplier?",
    a: "It represents how many times more expensive an incident would be if your agent entered an infinite loop. Low (1x) = agent with circuit breakers. Medium (10x) = typical unprotected production incident. High (100x) = catastrophic overnight loop scenario.",
  },
  {
    q: "What does 'recommended daily cap' mean?",
    a: "It's your normal daily cost plus a 20% safety buffer, designed to allow for legitimate traffic spikes while blocking runaway loops. If your agent normally costs $8/day, the recommended cap is $9.60.",
  },
  {
    q: "Why does the annual savings calculation seem so large?",
    a: "Because worst-case loop incidents are catastrophically expensive. One $500 loop incident per month × 12 months = $6,000/year. Preventing that with a $10/month cap saves $5,880/year per agent.",
  },
  {
    q: "Can I set the exact cap calculated here in SupraWall?",
    a: "Yes. Take your recommended daily cap value and use it in protect(agent, budget={'daily_limit_usd': YOUR_VALUE}).",
  },
];

export default function CalculatorClient() {
  // ── Inputs ──
  const [agents, setAgents] = useState(3);
  const [model, setModel] = useState("gpt-4o");
  const [callsPerSession, setCallsPerSession] = useState(20);
  const [sessionsPerDay, setSessionsPerDay] = useState(50);
  const [tokensPerCall, setTokensPerCall] = useState(4000);
  const [loopRisk, setLoopRisk] = useState("medium");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ── Calculations ──
  const modelPrice = MODEL_PRICES[model]?.price ?? 0.005;
  const loopMultiplier = LOOP_MULTIPLIERS[loopRisk]?.value ?? 10;

  const costPerCall = (tokensPerCall / 1000) * modelPrice;
  const dailyCost = agents * sessionsPerDay * callsPerSession * costPerCall;
  const monthlyCost = dailyCost * 30;
  const loopCost = dailyCost * loopMultiplier;
  const recommendedCap = dailyCost * 1.2;
  const annualSavings = (loopCost - recommendedCap) * 12;

  // ── Code snippet with live values ──
  const codeSnippet = `from suprawall import protect

secured = protect(agent, budget={
    "daily_limit_usd": ${recommendedCap.toFixed(2)},    # your recommended cap
    "circuit_breaker": {
        "strategy": "combined",
        "max_identical_calls": 10,
        "window_seconds": 60,
    },
    "on_budget_exceeded": "halt",
})`;

  return (
    <main className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-emerald-500/4 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-emerald-500/3 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
            Free Tool • No Sign-up Required
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
            LLM{" "}
            <span className="text-emerald-500">Cost Calculator</span>
            <br />
            for AI Agents.
          </h1>
          <p className="text-xl text-neutral-400 leading-relaxed font-medium max-w-2xl">
            Estimate your monthly token spend, calculate what an infinite loop
            would actually cost, and set the right budget limit before you
            deploy. Pricing updated for 2026.
          </p>
        </div>
      </section>

      {/* ── CALCULATOR WIDGET ── */}
      <section className="py-8 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-neutral-900 border border-white/5 rounded-[3rem] p-10 space-y-8">
            <h2 className="text-3xl font-black tracking-tight text-white italic text-center">
              Calculate Your Agent Costs
            </h2>

            {/* ── INPUTS ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

              {/* Agents */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                    Number of Agents
                  </label>
                  <span className="text-emerald-400 font-black text-sm">
                    {agents}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={agents}
                  onChange={(e) => setAgents(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2"
                />
                <div className="flex justify-between text-[10px] text-neutral-700 font-mono">
                  <span>1</span>
                  <span>100</span>
                </div>
              </div>

              {/* Model */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest block">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
                >
                  {Object.entries(MODEL_PRICES).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label} — ${val.price}/1K tokens
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-neutral-700 italic">
                  Blended input/output estimate
                </p>
              </div>

              {/* Tool calls per session */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                    Tool Calls per Session
                  </label>
                  <span className="text-emerald-400 font-black text-sm">
                    {callsPerSession}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={200}
                  value={callsPerSession}
                  onChange={(e) => setCallsPerSession(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2"
                />
                <div className="flex justify-between text-[10px] text-neutral-700 font-mono">
                  <span>1</span>
                  <span>200</span>
                </div>
              </div>

              {/* Sessions per day */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                    Sessions per Day
                  </label>
                  <span className="text-emerald-400 font-black text-sm">
                    {sessionsPerDay.toLocaleString()}
                  </span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={100000}
                  value={sessionsPerDay}
                  onChange={(e) =>
                    setSessionsPerDay(Math.max(1, Number(e.target.value)))
                  }
                  className="w-full bg-neutral-900 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              {/* Tokens per call */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                    Avg Tokens per Call
                  </label>
                  <span className="text-emerald-400 font-black text-sm">
                    {tokensPerCall.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={100000}
                  step={500}
                  value={tokensPerCall}
                  onChange={(e) => setTokensPerCall(Number(e.target.value))}
                  className="w-full accent-emerald-500 h-2"
                />
                <div className="flex justify-between text-[10px] text-neutral-700 font-mono">
                  <span>500</span>
                  <span>100K</span>
                </div>
              </div>

              {/* Loop risk multiplier */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                    Loop Risk Multiplier
                  </label>
                  <Tooltip text="How many times more expensive an incident would be if your agent entered an infinite loop. Low = protected agent. Medium = typical unprotected incident. High = catastrophic overnight loop." />
                </div>
                <select
                  value={loopRisk}
                  onChange={(e) => setLoopRisk(e.target.value)}
                  className="w-full bg-neutral-900 border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-500/50"
                >
                  {Object.entries(LOOP_MULTIPLIERS).map(([key, val]) => (
                    <option key={key} value={key}>
                      {val.label}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-neutral-600 italic leading-relaxed">
                  {LOOP_MULTIPLIERS[loopRisk]?.desc}
                </p>
              </div>
            </div>

            {/* ── OUTPUTS ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* Normal daily */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-2">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                  Normal Daily Cost
                </p>
                <p className="text-3xl font-black text-white">{fmt(dailyCost)}</p>
                <p className="text-xs text-neutral-600">
                  {agents} agent{agents !== 1 ? "s" : ""} ×{" "}
                  {sessionsPerDay.toLocaleString()} sessions
                </p>
              </div>

              {/* Normal monthly */}
              <div className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-2">
                <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                  Normal Monthly Cost
                </p>
                <p className="text-3xl font-black text-white">
                  {fmt(monthlyCost)}
                </p>
                <p className="text-xs text-neutral-600">30-day estimate</p>
              </div>

              {/* Worst-case loop cost */}
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 space-y-2">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
                  Worst-Case Loop Cost
                </p>
                <p className="text-3xl font-black text-rose-400">
                  {fmtShort(loopCost)}
                </p>
                <p className="text-xs text-rose-300/60">
                  {LOOP_MULTIPLIERS[loopRisk]?.value}× daily spend
                </p>
              </div>

              {/* Recommended daily cap */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 space-y-2">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  Recommended Daily Cap
                </p>
                <p className="text-3xl font-black text-emerald-400">
                  {fmt(recommendedCap)}
                </p>
                <p className="text-xs text-emerald-300/60">
                  Normal daily × 1.2 (20% buffer)
                </p>
              </div>

              {/* Annual savings */}
              <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 space-y-2 sm:col-span-2 lg:col-span-2">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  Annual Savings with Budget Limits
                </p>
                <p className="text-3xl font-black text-emerald-400">
                  {annualSavings > 0 ? fmtShort(annualSavings) : "$0.00"}
                </p>
                <p className="text-xs text-emerald-300/60">
                  (Worst-case loop cost − recommended cap) × 12 months. Savings
                  are zero when loop risk is set to Low because circuit breakers
                  are already active.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center pt-2">
              <Link
                href="/features/budget-limits"
                className="inline-flex items-center gap-2 px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_40px_rgba(16,185,129,0.15)]"
              >
                Implement These Limits <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SUPPORTING COPY ── */}
      <section className="py-32 px-6 bg-neutral-950/50">
        <div className="max-w-4xl mx-auto space-y-24">

          {/* Section 1 — How to Read Your Results */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black italic text-white">
              How to Read Your Results
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The calculator produces five outputs. Four are straightforward
              arithmetic — the one that requires explanation is the{" "}
              <span className="text-white font-semibold">
                loop risk multiplier
              </span>
              . Here is what each setting means in practice and when to use it.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-900 border border-emerald-500/20 rounded-[2rem] p-8 space-y-4">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  Low — 1×
                </p>
                <h3 className="text-white font-black text-lg">
                  Protected Agent
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  Your agent has SupraWall circuit breakers deployed. Loops are
                  caught within seconds — the agent might make 5-10 redundant
                  calls before the breaker trips, but the cost impact is
                  negligible. Use this setting to calculate your baseline
                  operating cost. The &quot;worst-case loop cost&quot; at 1× is
                  effectively your normal daily cost.
                </p>
              </div>
              <div className="bg-neutral-900 border border-amber-500/20 rounded-[2rem] p-8 space-y-4">
                <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                  Medium — 10×
                </p>
                <h3 className="text-white font-black text-lg">
                  Historical Average
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  This is the observed average cost multiplier for production
                  loop incidents reported in 2024-2025. An unprotected agent
                  typically runs a loop for 10-30 minutes before a developer
                  notices the spike in their billing dashboard and manually
                  kills it. That window produces roughly 10× normal daily
                  spend. Use this to calculate realistic risk exposure for
                  agents without protection.
                </p>
              </div>
              <div className="bg-neutral-900 border border-rose-500/20 rounded-[2rem] p-8 space-y-4">
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
                  High — 100×
                </p>
                <h3 className="text-white font-black text-lg">
                  Catastrophic Overnight
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  An agent that loops overnight — from midnight until a
                  developer arrives at 9AM — produces roughly 100× its normal
                  daily spend. This is the classic &quot;$4,000 bill&quot; scenario.
                  It happens when agents run unmonitored in production without
                  budget limits or alerting configured. Use this to justify the
                  business case for circuit breakers to your team or finance
                  department.
                </p>
              </div>
            </div>
            <p className="text-neutral-400 text-base leading-relaxed">
              The{" "}
              <span className="text-white font-semibold">
                normal daily cost
              </span>{" "}
              and{" "}
              <span className="text-white font-semibold">normal monthly cost</span>{" "}
              outputs assume no loops occur. They represent your expected
              operating cost under normal conditions. If your actual spend is
              consistently higher than the normal daily estimate, you may already
              have a low-level loop running — an agent that is retrying a failing
              tool call 2-3× per session instead of once.
            </p>
          </div>

          {/* Section 2 — What Recommended Daily Cap Means */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black italic text-white">
              What &quot;Recommended Daily Cap&quot; Means
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The recommended daily cap is your calculated normal daily cost
              multiplied by 1.2 — a 20% safety buffer. This is not an arbitrary
              number. It reflects two practical realities of production agent
              traffic.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              First, legitimate traffic spikes are real. If your agent normally
              handles 50 sessions per day, it may handle 55 on a busy day, or 60
              when a marketing campaign drives extra traffic. A cap set at
              exactly your normal daily cost would trip the circuit breaker on
              those legitimate spikes, causing false positive halts and degrading
              your service. A 20% buffer absorbs normal variance without letting
              runaway loops through.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Second, the cost of a false positive (agent halts unnecessarily)
              is much lower than the cost of a false negative (loop runs
              unchecked). At a 20% buffer, you have zero false positives from
              normal traffic variance in the vast majority of production
              deployments. And any cost that exceeds 120% of your baseline is,
              by definition, anomalous — worth investigating whether it is
              legitimate or a loop.
            </p>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                Example
              </p>
              <p className="text-neutral-300 text-base leading-relaxed">
                Your agent normally costs{" "}
                <span className="text-white font-semibold">$8.00/day</span>. The
                recommended cap is{" "}
                <span className="text-emerald-400 font-black">$9.60/day</span>{" "}
                (8.00 × 1.2). A legitimate traffic spike to 55 sessions costs
                ~$8.80 — well within the cap. An infinite loop running for 10
                minutes costs ~$80.00 — immediately blocked at $9.60 before it
                can compound. The circuit breaker saved $70.40 on that single
                incident.
              </p>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              For high-variance workloads — agents with unpredictable session
              counts, or agents that handle large documents with variable token
              counts — consider increasing the buffer to 1.5× or 2×. For
              agents with highly predictable traffic, 1.1× is sufficient.
            </p>
          </div>

          {/* Section 3 — How to Implement Your Cap */}
          <div className="space-y-8">
            <h2 className="text-3xl font-black italic text-white">
              How to Implement Your Cap
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Take the recommended daily cap value from the calculator above and
              plug it directly into the SupraWall{" "}
              <span className="text-white font-semibold">protect()</span>{" "}
              wrapper. The configuration below uses your current calculated
              values and will be enforced at the SDK level — no agent can bypass
              it regardless of its prompt instructions.
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] overflow-hidden">
              <div className="flex items-center gap-3 px-8 py-5 border-b border-white/5">
                <div className="w-3 h-3 rounded-full bg-rose-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                <span className="ml-2 text-[10px] text-neutral-500 font-mono uppercase tracking-widest">
                  Python — live values from your calculator
                </span>
              </div>
              <div className="p-8 overflow-x-auto">
                <pre className="font-mono text-sm text-emerald-100/80 leading-relaxed">
                  {codeSnippet}
                </pre>
              </div>
            </div>
            <p className="text-neutral-400 text-base leading-relaxed">
              The{" "}
              <span className="text-white font-semibold">daily_limit_usd</span>{" "}
              field sets a hard dollar cap per agent per day. When the cap is
              reached, SupraWall raises a{" "}
              <span className="text-emerald-400 font-mono text-sm">
                BudgetExceeded
              </span>{" "}
              error and blocks all further tool calls until midnight UTC. The
              circuit breaker configuration provides a second layer of
              protection: it will halt the agent if it detects loop patterns
              before the dollar cap is hit. See the{" "}
              <Link
                href="/features/budget-limits"
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
              >
                Budget Limits documentation
              </Link>{" "}
              for the full configuration reference.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">
              Frequently Asked{" "}
              <span className="text-emerald-500">Questions</span>
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className="bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-emerald-500/20 transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-8 py-6 text-left"
                >
                  <span className="text-white font-bold pr-4">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-500 shrink-0 transition-transform ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-8 pb-6 text-neutral-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-emerald-600 rounded-[3rem] p-16 md:p-24 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-800 opacity-0 hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
            <div className="relative z-10 space-y-8">
              <p className="text-[10px] font-black text-emerald-200 uppercase tracking-[0.4em]">
                You have the numbers. Now enforce them.
              </p>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                Set your cap.
                <br />
                Ship safely.
              </h2>
              <p className="text-emerald-100/80 text-lg font-medium italic max-w-md mx-auto">
                Free tier includes 10,000 operations. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/features/budget-limits"
                  className="inline-flex items-center gap-2 px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all shadow-2xl"
                >
                  Implement Budget Limits <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 px-12 py-5 bg-black/20 text-white border-2 border-white/20 font-black uppercase tracking-widest rounded-2xl hover:bg-black/40 transition-all"
                >
                  Read the Docs
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERNAL LINKS ── */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-8 text-center">
            Related
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: "/features/budget-limits",
                label: "Budget Limits",
                desc: "Hard caps for every agent",
              },
              {
                href: "/learn/ai-agent-infinite-loop-detection",
                label: "Loop Detection Guide",
                desc: "How circuit breakers work",
              },
              {
                href: "/learn/ai-agent-runaway-costs",
                label: "Runaway Costs",
                desc: "Real incident case studies",
              },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="p-6 bg-neutral-900/40 border border-white/5 rounded-2xl hover:border-emerald-500/30 transition-all group"
              >
                <p className="text-white font-black group-hover:text-emerald-400 transition-colors">
                  {l.label}
                </p>
                <p className="text-neutral-500 text-xs mt-1 italic">{l.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-16 border-t border-white/5 text-center">
        <p className="text-neutral-700 text-[10px] font-black uppercase tracking-[0.5em]">
          SupraWall © 2026 • Real-time Agent Governance
        </p>
      </footer>
    </main>
  );
}
