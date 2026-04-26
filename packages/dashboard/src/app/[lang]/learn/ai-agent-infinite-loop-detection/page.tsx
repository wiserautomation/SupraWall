// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import {
  RefreshCw,
  Activity,
  Zap,
  Shield,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Agent Infinite Loop Detection & Circuit Breakers",
  description:
    "AI agents loop silently until you get a $4,000 bill. Learn how to detect repetitive tool call patterns, implement circuit breakers, and halt runaway agents.",
  keywords: [
    "AI agent infinite loop",
    "detect AI agent loop",
    "LLM infinite loop prevention",
    "agent circuit breaker pattern",
    "AI agent loop detection",
    "recursive agent calls",
  ],
  alternates: {
    canonical:
      "https://www.supra-wall.com/learn/ai-agent-infinite-loop-detection",
  },
  openGraph: {
    title: "AI Agent Infinite Loop Detection: The Circuit Breaker Pattern",
    description:
      "AI agents loop silently until you get a $4,000 bill. Learn how to detect repetitive tool call patterns, implement circuit breakers, and halt runaway agents.",
    url: "https://www.supra-wall.com/learn/ai-agent-infinite-loop-detection",
    siteName: "SupraWall",
    type: "article",
  },
};

export default function AIAgentInfiniteLoopDetectionPage() {
  const techArticleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "AI Agent Infinite Loop Detection: The Circuit Breaker Pattern",
    description:
      "AI agents loop silently until you get a $4,000 bill. Learn how to detect repetitive tool call patterns, implement circuit breakers, and halt runaway agents.",
    author: { "@type": "Organization", name: "SupraWall" },
    datePublished: "2026-01-01",
    genre: "Technical Deep-Dive",
    keywords:
      "AI agent infinite loop, detect AI agent loop, LLM infinite loop prevention, agent circuit breaker pattern",
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Detect and Stop AI Agent Infinite Loops",
    step: [
      {
        "@type": "HowToStep",
        name: "Identify loop type",
        text: "Determine which loop type you are dealing with: string match (exact repetition), semantic similarity (near-identical repetition), or frequency-based (behavioral loops regardless of content).",
      },
      {
        "@type": "HowToStep",
        name: "Implement a circuit breaker with CLOSED/OPEN/HALF-OPEN states",
        text: "Build or configure a circuit breaker that transitions from CLOSED (normal) to OPEN (blocked) when a failure threshold is exceeded, and to HALF-OPEN (testing recovery) after a timeout.",
      },
      {
        "@type": "HowToStep",
        name: "Configure graceful degradation behavior",
        text: "Decide what happens when the circuit trips: halt gracefully, notify and pause for human approval, or degrade by skipping the looping tool and continuing with reduced capabilities.",
      },
      {
        "@type": "HowToStep",
        name: "Write tests that trigger the circuit breaker",
        text: "Use a pytest fixture with a tool that always returns an error, configure a low threshold, and assert CircuitBreakerTripped is raised within the expected number of calls.",
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an AI agent circuit breaker?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A circuit breaker monitors tool call patterns and trips to the OPEN state (blocking all calls) when a loop is detected. It prevents runaway cost escalation by catching infinite loops within seconds rather than hours.",
        },
      },
      {
        "@type": "Question",
        name: "How is this different from LangChain's max_iterations?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "max_iterations counts total steps regardless of repetition. A circuit breaker specifically detects repetitive patterns — it will trip after 5 identical calls in 60 seconds even if max_iterations is set to 1,000.",
        },
      },
      {
        "@type": "Question",
        name: "Can I tune the sensitivity of loop detection?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. max_identical_calls (default: 10), window_seconds (default: 60), and semantic_threshold (default: 0.95) are all configurable. For agents that legitimately retry failing calls, increase the threshold.",
        },
      },
      {
        "@type": "Question",
        name: "What happens to in-progress work when the circuit breaks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "SupraWall returns a structured CircuitBreakerTripped exception to the agent, which can be caught to save partial results before halting.",
        },
      },
      {
        "@type": "Question",
        name: "How do I test that my loop detection works before deploying?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Write a pytest fixture with a tool that always returns an error, configure the circuit breaker with a low threshold (3-5 calls), and assert CircuitBreakerTripped is raised within the expected number of calls.",
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
        name: "AI Agent Infinite Loop Detection",
        item: "https://www.supra-wall.com/learn/ai-agent-infinite-loop-detection",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(techArticleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
              Security Hub • Circuit Breakers
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
              AI Agent Infinite
              <br />
              <span className="text-emerald-500">Loop Detection.</span>
            </h1>
            <p className="text-xl text-neutral-300 border-l-8 border-emerald-600 pl-8 py-4 italic leading-relaxed">
              AI agent infinite loop detection is the practice of identifying
              repetitive or recursive tool call patterns in real time and
              triggering a circuit breaker before costs escalate. Unlike simple
              iteration counters, proper loop detection uses pattern matching,
              semantic similarity, and frequency analysis to catch all three
              major loop types: exact repetition, near-identical repetition, and
              behavioral loops.
            </p>
          </div>

          {/* TL;DR Box */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8">
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              TL;DR
            </p>
            <ul className="space-y-3">
              {[
                "Agents loop for four distinct reasons — each requires a different detection strategy.",
                "String-match detection catches exact repetition in O(1) time using call hashing.",
                "Semantic similarity detection catches near-identical loops using cosine distance between embeddings.",
                "Frequency analysis catches behavioral loops regardless of call content.",
                "A three-state circuit breaker (CLOSED → OPEN → HALF-OPEN) provides the cleanest architectural response.",
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

          {/* Section 1 — Why Agents Loop */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <RefreshCw className="w-7 h-7 text-emerald-500 shrink-0" />
              Why Agents Loop
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Infinite loops in AI agents are not the result of buggy logic in
              the conventional sense. They emerge from the intersection of LLM
              non-determinism and tool call architecture. There are four
              documented causes, each with a distinct failure signature.
            </p>

            {/* Cause 1 */}
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-emerald-500/20 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">
                  Cause 01
                </span>
              </div>
              <h3 className="text-white font-black text-xl">
                Erroneous Error Interpretation
              </h3>
              <p className="text-neutral-400 text-base leading-relaxed">
                When a tool returns an error, the LLM interprets the error
                message as a signal that the task failed and should be retried.
                It has no built-in understanding of transient vs. permanent
                errors, and no mechanism to prevent retrying immediately. A
                rate-limit error is particularly dangerous: the API will keep
                returning 429 for 60 seconds, and the agent will keep calling
                it, generating 1,000 identical calls before the window expires.
              </p>
              <div className="bg-black/40 border border-white/5 rounded-[1.5rem] p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`# Tool returns HTTP 429 (rate limit)
tool_result = {"error": "rate_limit_exceeded", "message": "Too many requests", "retry_after": 60}
# LLM interprets: "The task failed, I should try again"
# No built-in mechanism prevents retrying immediately
# Result: 1,000 identical calls in 60 seconds`}</pre>
              </div>
            </div>

            {/* Cause 2 */}
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-emerald-500/20 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em]">
                  Cause 02
                </span>
              </div>
              <h3 className="text-white font-black text-xl">
                Hallucinated Incompletion
              </h3>
              <p className="text-neutral-400 text-base leading-relaxed">
                After completing a long task, the LLM may hallucinate that it
                did not actually finish. This is more likely with tasks
                involving large datasets or multi-step processes where the agent
                cannot easily verify its own output. The result is a full
                restart from scratch — consuming the same resources as the
                original run — repeated until the budget is exhausted. This is a primary driver of <Link href="/learn/ai-agent-runaway-costs" className="text-emerald-500 underline decoration-emerald-500/30 hover:decoration-emerald-500 transition-all font-bold">AI agent runaway costs</Link> in enterprise production environments.
              </p>
              <div className="bg-black/40 border border-white/5 rounded-[1.5rem] p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`# Agent completes a report generation task
# LLM internal reasoning: "Did I actually send all 500 reports?
#   I'm not sure. Let me check by running the task again."
# Runs the full task again from scratch
# Repeats until budget is exhausted`}</pre>
              </div>
            </div>

            {/* Cause 3 */}
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-emerald-500/20 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">
                  Cause 03
                </span>
              </div>
              <h3 className="text-white font-black text-xl">
                Tool Dependency Cycle
              </h3>
              <p className="text-neutral-400 text-base leading-relaxed">
                Circular dependencies between tools create infinite recursion at
                the infrastructure level, not the LLM level. Tool A needs
                output from Tool B to run, and Tool B needs output from Tool A
                to initialize. Unlike the other loop types, this one is
                deterministic — it will always loop given the same dependency
                graph, regardless of LLM behavior.
              </p>
              <div className="bg-black/40 border border-white/5 rounded-[1.5rem] p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`# Tool A needs output from Tool B
# Tool B needs output from Tool A to initialize
def tool_a(context):
    b_result = tool_b(context)  # Tool A calls Tool B
    return process(b_result)

def tool_b(context):
    a_result = tool_a(context)  # Tool B calls Tool A
    return transform(a_result)  # → infinite recursion`}</pre>
              </div>
            </div>

            {/* Cause 4 */}
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-emerald-500/20 transition-all">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">
                  Cause 04
                </span>
              </div>
              <h3 className="text-white font-black text-xl">
                Recursive Agent Spawning
              </h3>
              <p className="text-neutral-400 text-base leading-relaxed">
                In multi-agent systems, orchestrator agents that spawn
                sub-agents can create exponential growth if there is no depth
                limit. Each sub-agent spawns its own sub-agents, and the tree
                grows geometrically. By depth 5 with a branching factor of 3,
                you have 243 simultaneous agents — each consuming tokens and
                making tool calls in parallel. This is the most expensive loop
                type because the cost compounds multiplicatively.
              </p>
              <div className="bg-black/40 border border-white/5 rounded-[1.5rem] p-6 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`# Orchestrator spawns sub-agents that each spawn more sub-agents
# With no depth limit, this creates an exponential tree
# Depth 1: 3 agents, Depth 2: 9, Depth 3: 27, Depth 5: 243 simultaneous agents`}</pre>
              </div>
            </div>
          </section>

          {/* Section 2 — Three Detection Strategies */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Activity className="w-7 h-7 text-emerald-500 shrink-0" />
              Three Detection Strategies
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              No single detection strategy catches all loop types. A production
              circuit breaker combines all three, applying each in sequence from
              fastest to slowest. String-match is O(1) and runs first;
              frequency analysis is O(n) over the time window; semantic
              similarity is the most expensive and runs last.
            </p>

            {/* Strategy 1 */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  Strategy 1
                </span>
                <h3 className="text-white font-black text-lg">
                  String-Match Detection
                </h3>
                <span className="text-neutral-600 text-xs italic">
                  Fast · catches exact loops
                </span>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed">
                Hash each tool call (name + serialized arguments) and maintain a
                rolling window of recent call hashes. If the same hash appears
                more than the threshold within the window, a loop is confirmed.
                This is the most efficient strategy: O(1) lookup per call, zero
                external dependencies, and zero false negatives for exact
                repetition.
              </p>
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`from collections import deque
import hashlib

class StringMatchDetector:
    def __init__(self, window_size=10, threshold=3):
        self.call_history = deque(maxlen=window_size)
        self.threshold = threshold

    def check(self, tool_name: str, args: dict) -> bool:
        call_hash = hashlib.md5(
            f"{tool_name}:{json.dumps(args, sort_keys=True)}".encode()
        ).hexdigest()

        identical_count = self.call_history.count(call_hash)
        self.call_history.append(call_hash)

        if identical_count >= self.threshold:
            raise LoopDetected(f"Tool '{tool_name}' called {identical_count+1}x with identical args")
        return True`}</pre>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">
                    Catches
                  </p>
                  <p className="text-neutral-300 text-sm">
                    Exact repetition — the most common loop type (Cause 1 and
                    Cause 2)
                  </p>
                </div>
                <div className="bg-rose-500/5 border border-rose-500/15 rounded-2xl p-4">
                  <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-2">
                    Misses
                  </p>
                  <p className="text-neutral-300 text-sm">
                    Near-identical calls with minor argument variation (e.g.,
                    incrementing page numbers)
                  </p>
                </div>
              </div>
            </div>

            {/* Strategy 2 */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest">
                  Strategy 2
                </span>
                <h3 className="text-white font-black text-lg">
                  Semantic Similarity Detection
                </h3>
                <span className="text-neutral-600 text-xs italic">
                  Slower · catches near-identical loops
                </span>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed">
                Embed each call as a vector using a lightweight sentence
                transformer model. Compare the new embedding against recent
                embeddings using cosine similarity. If any previous call is
                above the similarity threshold, the calls are semantically
                equivalent — a near-identical loop is detected. This catches the
                hard cases that string-match misses: search queries with slightly
                different phrasing, API calls with minor parameter variations,
                and reformulated research tasks.
              </p>
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`from sentence_transformers import SentenceTransformer
import numpy as np

class SemanticLoopDetector:
    def __init__(self, threshold=0.95, window=5):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.recent_embeddings = deque(maxlen=window)
        self.threshold = threshold

    def check(self, tool_name: str, args: dict) -> bool:
        call_text = f"{tool_name}: {json.dumps(args)}"
        embedding = self.model.encode(call_text)

        for prev_embedding in self.recent_embeddings:
            similarity = np.dot(embedding, prev_embedding)  # cosine similarity
            if similarity > self.threshold:
                raise SemanticLoopDetected(f"Semantically similar call detected (similarity: {similarity:.3f})")

        self.recent_embeddings.append(embedding)
        return True`}</pre>
              </div>
              <p className="text-neutral-500 text-sm italic">
                Example: catches &quot;search for &apos;AI security&apos;&quot; followed by
                &quot;search for &apos;AI security tools&apos;&quot; — same intent, different
                string, same loop.
              </p>
            </div>

            {/* Strategy 3 */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-400 uppercase tracking-widest">
                  Strategy 3
                </span>
                <h3 className="text-white font-black text-lg">
                  Frequency Analysis
                </h3>
                <span className="text-neutral-600 text-xs italic">
                  Content-agnostic · catches behavioral loops
                </span>
              </div>
              <p className="text-neutral-400 text-base leading-relaxed">
                Track how many times each tool is called within a sliding time
                window. If any tool exceeds the frequency threshold, halt
                regardless of whether the individual calls are identical or
                semantically similar. This strategy catches behavioral loops
                that neither string-match nor semantic similarity can detect:
                an agent that cycles through 50 different search queries is
                running a behavioral loop even though no two queries are the
                same.
              </p>
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
                <pre className="text-neutral-300 leading-relaxed">{`from collections import defaultdict
import time

class FrequencyDetector:
    def __init__(self, max_calls_per_window=20, window_seconds=60):
        self.call_counts = defaultdict(list)
        self.max_calls = max_calls_per_window
        self.window = window_seconds

    def check(self, tool_name: str) -> bool:
        now = time.time()
        # Remove calls outside the window
        self.call_counts[tool_name] = [
            t for t in self.call_counts[tool_name]
            if now - t < self.window
        ]
        self.call_counts[tool_name].append(now)

        if len(self.call_counts[tool_name]) > self.max_calls:
            raise FrequencyLoopDetected(
                f"Tool '{tool_name}' called {len(self.call_counts[tool_name])}x "
                f"in {self.window}s (max: {self.max_calls})"
            )
        return True`}</pre>
              </div>
            </div>
          </section>

          {/* Section 3 — The Circuit Breaker Pattern */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Zap className="w-7 h-7 text-emerald-500 shrink-0" />
              The Circuit Breaker Pattern
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The circuit breaker is a formal software design pattern originally
              developed for distributed systems to prevent cascade failures. When
              applied to AI agents, it provides the architectural response layer
              on top of loop detection: the detectors identify that a loop is
              happening; the circuit breaker decides what to do about it. The
              pattern operates across three states:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  state: "CLOSED",
                  color: "emerald",
                  desc: "Normal operation. All tool calls pass through. Failures are counted within the window. When failure count reaches the threshold, the breaker trips.",
                },
                {
                  state: "OPEN",
                  color: "rose",
                  desc: "Tripped. All tool calls are immediately rejected without execution. The agent receives a CircuitBreakerOpen error. After the timeout expires, transitions to HALF-OPEN.",
                },
                {
                  state: "HALF-OPEN",
                  color: "amber",
                  desc: "Recovery testing. A single test call is allowed through. If it succeeds, the breaker resets to CLOSED. If it fails, it returns to OPEN.",
                },
              ].map((s) => (
                <div
                  key={s.state}
                  className={`bg-neutral-900 border border-${s.color}-500/20 rounded-[2rem] p-6 space-y-3`}
                >
                  <p
                    className={`text-[10px] font-black text-${s.color}-400 uppercase tracking-[0.2em]`}
                  >
                    State
                  </p>
                  <p className="text-white font-black text-lg">{s.state}</p>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* State diagram */}
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <pre className="text-neutral-300 leading-relaxed">{`                    failure_count >= threshold
    CLOSED ────────────────────────────────────► OPEN
      ▲                                            │
      │                                            │ timeout expires
      │                                            ▼
      │         success                        HALF-OPEN
      └────────────────────────────────────────────┘
                                      (test call succeeds)`}</pre>
            </div>

            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Here is a complete Python implementation from scratch:
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <pre className="text-neutral-300 leading-relaxed">{`import time
from enum import Enum
from functools import wraps

class CircuitState(Enum):
    CLOSED = "closed"       # Normal operation
    OPEN = "open"           # Tripped, blocking all calls
    HALF_OPEN = "half_open" # Testing recovery

class AgentCircuitBreaker:
    def __init__(self, failure_threshold=10, timeout=60, window=60):
        self.state = CircuitState.CLOSED
        self.failure_count = 0
        self.last_failure_time = None
        self.failure_threshold = failure_threshold
        self.timeout = timeout      # seconds before trying HALF_OPEN
        self.window = window        # seconds to count failures in

    def call(self, func, *args, **kwargs):
        if self.state == CircuitState.OPEN:
            if time.time() - self.last_failure_time > self.timeout:
                self.state = CircuitState.HALF_OPEN
            else:
                raise CircuitBreakerOpen("Circuit breaker is OPEN — agent halted")

        try:
            result = func(*args, **kwargs)
            if self.state == CircuitState.HALF_OPEN:
                self._reset()  # Recovery succeeded
            return result
        except Exception as e:
            self._record_failure()
            raise

    def _record_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN

    def _reset(self):
        self.state = CircuitState.CLOSED
        self.failure_count = 0`}</pre>
            </div>

            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The SupraWall{" "}
              <span className="text-white font-semibold">protect()</span>{" "}
              wrapper replaces all of the above with a single configuration
              block. It combines all three detection strategies and handles the
              state machine internally:
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <pre className="text-neutral-300 leading-relaxed">{`from suprawall import protect

secured = protect(agent, budget={
    "circuit_breaker": {
        "strategy": "combined",          # uses all three detection strategies
        "max_identical_calls": 10,       # string-match threshold
        "semantic_threshold": 0.95,      # cosine similarity threshold
        "max_tool_frequency": 20,        # calls per minute per tool
        "window_seconds": 60,
        "recovery_timeout": 300,         # 5 minutes before HALF_OPEN
    }
})`}</pre>
            </div>
          </section>

          {/* Section 4 — Graceful Degradation */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Shield className="w-7 h-7 text-emerald-500 shrink-0" />
              Graceful Degradation
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              When the circuit trips, you have three choices for what happens
              next. The right choice depends on the criticality of the task and
              how much human oversight you want in the loop. These are ranked
              from most to least conservative.
            </p>
            <div className="space-y-4">
              {/* Option 1 */}
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-emerald-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    Option 1 — Recommended
                  </span>
                </div>
                <h3 className="text-white font-black text-lg">
                  Halt Gracefully
                </h3>
                <p className="text-neutral-400 text-base leading-relaxed">
                  Raise a structured exception and return a status object to the
                  orchestrator. The agent receives enough context to log partial
                  results, report the incident, and halt cleanly. This is the
                  safest option and the correct default for production systems
                  where a partial result is better than a corrupt one.
                </p>
                <div className="bg-black/40 border border-white/5 rounded-[1.5rem] p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-neutral-300 leading-relaxed">{`on_circuit_break = "halt"
# Agent receives: {"status": "halted", "reason": "circuit_breaker", "incident_id": "..."}`}</pre>
                </div>
              </div>

              {/* Option 2 */}
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-amber-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-400 uppercase tracking-widest">
                    Option 2
                  </span>
                </div>
                <h3 className="text-white font-black text-lg">
                  Notify and Pause
                </h3>
                <p className="text-neutral-400 text-base leading-relaxed">
                  Send a webhook notification and pause the agent until a human
                  approves resumption. This is the right choice for
                  business-critical agents where you cannot afford to lose
                  partial progress, but also cannot afford to let a runaway loop
                  continue unchecked. The human reviews the loop evidence and
                  either approves a resume or confirms the halt.
                </p>
                <div className="bg-black/40 border border-white/5 rounded-[1.5rem] p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-neutral-300 leading-relaxed">{`on_circuit_break = {
    "action": "pause",
    "notify": "https://hooks.slack.com/...",
    "resume_after_approval": True
}`}</pre>
                </div>
              </div>

              {/* Option 3 */}
              <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 space-y-4 hover:border-purple-500/20 transition-all">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black text-purple-400 uppercase tracking-widest">
                    Option 3
                  </span>
                </div>
                <h3 className="text-white font-black text-lg">
                  Degrade Gracefully
                </h3>
                <p className="text-neutral-400 text-base leading-relaxed">
                  Skip the problematic tool and continue executing the agent
                  with reduced capabilities. This is the least conservative
                  option and should only be used when the looping tool is
                  optional for task completion. For example, if a web search
                  tool is looping, the agent can continue generating a response
                  from its training knowledge without search augmentation.
                </p>
                <div className="bg-black/40 border border-white/5 rounded-[1.5rem] p-6 font-mono text-sm overflow-x-auto">
                  <pre className="text-neutral-300 leading-relaxed">{`on_circuit_break = {
    "action": "degrade",
    "skip_tool": True,   # skip the problematic tool
    "continue_without": ["web_search"]  # proceed without this tool
}`}</pre>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5 — Testing Loop Detection */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <CheckCircle2 className="w-7 h-7 text-emerald-500 shrink-0" />
              Testing Loop Detection
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Loop detection should be tested before deploying to production.
              The testing strategy is straightforward: create a fixture with a
              tool that deterministically triggers the circuit breaker, configure
              a low threshold, and assert that the breaker trips within the
              expected number of calls. This pattern works for all three
              detection strategies.
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <pre className="text-neutral-300 leading-relaxed">{`import pytest
from unittest.mock import patch
from suprawall import protect
from suprawall.exceptions import CircuitBreakerTripped

@pytest.fixture
def looping_tool():
    """Tool that always returns an error, simulating a stuck retry loop"""
    call_count = {"n": 0}
    def tool(query: str) -> str:
        call_count["n"] += 1
        return {"error": "rate_limit_exceeded", "attempt": call_count["n"]}
    return tool, call_count

def test_circuit_breaker_triggers(looping_tool):
    tool_fn, call_count = looping_tool

    secured = protect(
        agent_with_tool(tool_fn),
        budget={"circuit_breaker": {"max_identical_calls": 5, "window_seconds": 30}}
    )

    with pytest.raises(CircuitBreakerTripped) as exc_info:
        secured.invoke({"input": "Run the search that will loop"})

    assert call_count["n"] <= 6, f"Circuit breaker should have triggered before call {call_count['n']}"
    assert "circuit_breaker" in str(exc_info.value).lower()`}</pre>
            </div>
            <p className="text-neutral-400 text-base leading-relaxed">
              Write one test per detection strategy using different fixture
              types: an exact-repeat fixture for string-match detection, a
              semantically-similar fixture for semantic detection, and a
              rapid-fire fixture (calls made in a tight loop) for frequency
              detection. All three tests should be part of your CI pipeline and
              must pass before every production deployment.
            </p>
          </section>

          {/* Section 6 — FAQ */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <HelpCircle className="w-7 h-7 text-emerald-500 shrink-0" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "What is an AI agent circuit breaker?",
                  a: "A circuit breaker monitors tool call patterns and trips to the OPEN state (blocking all calls) when a loop is detected. It prevents runaway cost escalation by catching infinite loops within seconds rather than hours.",
                },
                {
                  q: "How is this different from LangChain's max_iterations?",
                  a: "max_iterations counts total steps regardless of repetition. A circuit breaker specifically detects repetitive patterns — it will trip after 5 identical calls in 60 seconds even if max_iterations is set to 1,000.",
                },
                {
                  q: "Can I tune the sensitivity of loop detection?",
                  a: "Yes. max_identical_calls (default: 10), window_seconds (default: 60), and semantic_threshold (default: 0.95) are all configurable. For agents that legitimately retry failing calls, increase the threshold.",
                },
                {
                  q: "What happens to in-progress work when the circuit breaks?",
                  a: "SupraWall returns a structured CircuitBreakerTripped exception to the agent, which can be caught to save partial results before halting.",
                },
                {
                  q: "How do I test that my loop detection works before deploying?",
                  a: "Write a pytest fixture with a tool that always returns an error, configure the circuit breaker with a low threshold (3-5 calls), and assert CircuitBreakerTripped is raised within the expected number of calls.",
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

          {/* Related Links */}
          <section className="space-y-6">
            <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest">
              Related
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  href: "/features/budget-limits",
                  label: "Budget Limits",
                  desc: "Hard dollar caps per agent",
                },
                {
                  href: "/learn/ai-agent-runaway-costs",
                  label: "Runaway Costs",
                  desc: "How costs escalate in production",
                },
                {
                  href: "/blog/prevent-agent-infinite-loops",
                  label: "Loop Prevention Guide",
                  desc: "End-to-end prevention playbook",
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
                  <p className="text-neutral-500 text-xs mt-1 italic">
                    {l.desc}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="mt-24 p-16 rounded-[4rem] bg-emerald-600 text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white">
              Deploy Circuit Breakers
              <br />
              on Your Agents.
            </h2>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/features/budget-limits"
                className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all"
              >
                Deploy Circuit Breakers on Your Agents
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
