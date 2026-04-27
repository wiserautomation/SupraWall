// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import {
  ShieldCheck,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  FileText,
  HelpCircle,
  Hash,
  Link2,
  ListOrdered,
  Gauge,
  Lock,
  Database,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Agent Audit Trail & Logging | EU AI Act Article 12",
  description:
    "Build a tamper-proof audit trail for autonomous AI agents. Log every tool call, policy decision, and agent action for EU AI Act Article 12 compliance and forensic investigation.",
  keywords: [
    "AI agent audit trail",
    "agent audit logging",
    "EU AI Act Article 12",
    "AI agent compliance logging",
    "tamper proof AI logs",
  ],
  alternates: {
    canonical:
      "https://www.supra-wall.com/learn/ai-agent-audit-trail-logging",
  },
  openGraph: {
    title: "AI Agent Audit Trail & Logging | EU AI Act Article 12",
    description:
      "Build a tamper-proof audit trail for autonomous AI agents. Log every tool call, policy decision, and agent action for EU AI Act Article 12 compliance and forensic investigation.",
    url: "https://www.supra-wall.com/learn/ai-agent-audit-trail-logging",
    siteName: "SupraWall",
    type: "article",
  },
};

export default function AIAgentAuditTrailLoggingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "AI Agent Audit Trail & Logging | EU AI Act Article 12",
    description:
      "Build a tamper-proof audit trail for autonomous AI agents. Log every tool call, policy decision, and agent action for EU AI Act Article 12 compliance and forensic investigation.",
    author: { "@type": "Organization", name: "SupraWall" },
    datePublished: "2026-01-01",
    genre: "Compliance Guide",
    keywords:
      "AI agent audit trail, agent audit logging, EU AI Act Article 12, AI agent compliance logging, tamper proof AI logs",
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does EU AI Act Article 12 require for audit logging?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Article 12 of the EU AI Act requires high-risk AI systems to have logging capabilities that enable automatic recording of events throughout the system's lifetime. Logs must capture the period of each use, the reference database against which input data was checked, data that has led to the AI system giving a certain result, and any human oversight measures applied. For autonomous agents, this means logging every tool call, policy decision, and the context that led to each action.",
        },
      },
      {
        "@type": "Question",
        name: "What makes an AI agent audit log tamper-proof?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Tamper-proof audit logs use cryptographic chaining — each log entry contains a hash of the previous entry, creating a chain where modifying any historical entry invalidates all subsequent hashes. This makes retroactive tampering detectable. SupraWall additionally stores audit logs in append-only storage with cryptographic integrity verification, and can export to immutable storage services like AWS S3 with Object Lock or Google Cloud Storage with retention policies.",
        },
      },
      {
        "@type": "Question",
        name: "How long should AI agent audit logs be retained?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The EU AI Act does not specify a retention period in Article 12, but Article 18 requires providers of high-risk AI systems to keep documentation for at least 10 years after the system is placed on the market. For audit logs specifically, legal guidance generally recommends at minimum 3 years to cover typical statute of limitations periods for regulatory investigations. SupraWall supports configurable retention policies with automatic archival to cold storage.",
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
              Knowledge Hub • Compliance Logging
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
              AI Agent <span className="text-emerald-500">Audit</span> Trail
              <br />
              &amp; Logging.
            </h1>
            <p className="text-xl text-neutral-300 border-l-8 border-emerald-600 pl-8 py-4 italic leading-relaxed">
              An AI agent audit trail is a tamper-proof chronological record of every tool call,
              policy decision, and agent action. SupraWall generates structured audit logs that
              satisfy EU AI Act Article 12 technical documentation requirements and support
              forensic investigation of incidents — with risk scores, session IDs, and cost
              attribution on every entry.
            </p>
          </div>

          {/* TL;DR */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8">
            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
              TL;DR
            </p>
            <ul className="space-y-3">
              {[
                "Article 12 of the EU AI Act mandates logging capabilities for high-risk AI systems — logs must be automatic, comprehensive, and retained for the system's operational lifetime.",
                "Logs must capture what the agent did, not just what it said — tool call arguments, policy decisions, and outcomes matter more than LLM output text.",
                "Tamper-proofing requires cryptographic chaining or immutable storage — a log that can be edited is legally worthless in a regulatory investigation.",
                "SupraWall generates logs with risk scores, session IDs, cost attribution, and integrity hashes on every entry — structured for both compliance submission and forensic investigation.",
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

          {/* Section 1: What Regulators Need */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <FileText className="w-7 h-7 text-emerald-500 shrink-0" />
              What Regulators Actually Need
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Most engineering teams approach audit logging from the wrong direction. They ask{" "}
              <em>&quot;what should we log?&quot;</em> and answer it by logging whatever is convenient
              — typically LLM inputs and outputs, maybe some timestamps. This produces logs that
              satisfy developers and satisfy no one else.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Regulators investigating an AI incident ask a different set of questions:{" "}
              <span className="text-white font-semibold">
                What did the agent do? What policy governed that action? Why was the action
                permitted or denied? Who was responsible? What was the cost? Can we verify
                these logs have not been altered?
              </span>{" "}
              These questions have nothing to do with LLM output text and everything to do with
              the agent&apos;s actions in the world.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Article 12 of the EU AI Act specifies that logging capabilities must enable{" "}
              <em>&quot;automatic recording of events throughout the lifetime of the AI system.&quot;</em>{" "}
              For the specific case of autonomous agents, the regulation&apos;s guidance makes clear
              that &ldquo;events&rdquo; include:{" "}
              <span className="text-white font-semibold">
                input data, the AI system&apos;s output, the period of use, and any human oversight
                measures applied
              </span>
              . For agents, &ldquo;output&rdquo; means tool calls executed, not text generated — the
              distinction is critical.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The technical documentation required under Article 11 must include a description
              of the logging system and demonstrate that it is capable of producing the evidence
              required for a conformity assessment. An audit log that is missing key fields,
              is not tamper-proof, or only covers a subset of agent actions will fail this
              assessment. The cost of getting logging wrong is not a warning — it is a
              prohibition on placing the system on the EU market.
            </p>
          </section>

          {/* Section 2: Anatomy of an Audit Log */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Terminal className="w-7 h-7 text-emerald-500 shrink-0" />
              The Anatomy of an Agent Audit Log
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              A complete agent audit log entry is not a print statement or a simple key-value
              record. It is a structured document that captures the full context of a single
              decision point in the agent&apos;s execution. Below is the canonical SupraWall audit
              log entry format, with annotations for each field:
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <p className="text-neutral-500 text-[10px] uppercase tracking-[0.15em] mb-4 font-sans font-black">
                SupraWall Audit Log Entry — JSON Format
              </p>
              <pre className="text-neutral-300 leading-relaxed">{`{
  // Identity & Context
  "logId":          "log_01J8XK2M3N4P5Q6R7S8T9U0V1W",
  "sessionId":      "sess_01J8XK2M3N4P5Q6R7S8T9U0V1W",  // Ties all events in one agent run
  "agentId":        "billing-agent",
  "agentVersion":   "2.3.1",
  "userId":         "user_7f2a9c",                         // Who invoked the agent
  "organizationId": "org_acme_corp",

  // Action Details
  "toolName":       "stripe.charge",
  "toolVersion":    "stripe-python@8.1.0",
  "arguments": {
    "amount":       2400,
    "currency":     "usd",
    "customer_id":  "cus_NffrFeUfNV2Hib",
    "description":  "Annual plan renewal"
    // Note: no secrets, no PII beyond what's operationally required
  },

  // Policy Decision
  "decision":       "ALLOW",            // ALLOW | DENY | REQUIRE_APPROVAL | APPROVED | DENIED
  "policyId":       "pol_stripe_charge_allow",
  "reason":         "Tool within agent scope; amount $2,400 below $5,000 auto-approve threshold",
  "policyVersion":  "v4",

  // Risk Assessment
  "riskScore":      42,                 // 0-100; computed by SupraWall risk engine
  "riskFactors": [
    "financial_transaction",
    "external_api_call",
    "customer_data_access"
  ],
  "riskLevel":      "MEDIUM",           // LOW | MEDIUM | HIGH | CRITICAL

  // Cost Attribution
  "cost_usd":       0.0031,             // LLM inference cost for this decision step
  "tokens_used":    847,
  "model":          "gpt-4o",

  // Timing
  "timestamp":      "2026-03-19T14:32:07.412Z",
  "latency_ms":     187,                // End-to-end decision + execution latency

  // Result
  "outcome":        "SUCCESS",          // SUCCESS | FAILURE | TIMEOUT | CANCELLED
  "responseCode":   200,
  "responseBytes":  1240,

  // Tamper-Proof Chain
  "sequenceNumber": 47,                 // Monotonically increasing within session
  "previousHash":   "sha256:a3f4b2c1d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5",
  "integrityHash":  "sha256:b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5"
  // integrityHash = SHA256(all fields above + previousHash)
}`}</pre>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The key insight is that a complete audit entry captures the{" "}
              <span className="text-white font-semibold">decision</span> as much as the action.
              Knowing that the agent called{" "}
              <code className="text-emerald-400 text-sm bg-neutral-900 px-2 py-0.5 rounded-lg">
                stripe.charge
              </code>{" "}
              is useful; knowing that it was allowed by policy{" "}
              <code className="text-emerald-400 text-sm bg-neutral-900 px-2 py-0.5 rounded-lg">
                pol_stripe_charge_allow
              </code>{" "}
              version 4, with a risk score of 42, at 14:32:07 UTC, is what regulators and
              forensic investigators actually need.
            </p>
          </section>

          {/* Section 3: Risk Scoring */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Gauge className="w-7 h-7 text-emerald-500 shrink-0" />
              Risk Scoring
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Every action in the SupraWall audit trail carries a{" "}
              <span className="text-white font-semibold">risk score</span> between 0 and 100,
              computed by the SupraWall risk engine at the time of the policy decision. The risk
              score is not a post-hoc annotation — it is part of the policy evaluation and
              influences which policy branch is applied.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The risk engine evaluates each tool call across four dimensions:
            </p>
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] pb-4 pr-6">
                      Dimension
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] pb-4 pr-6">
                      Weight
                    </th>
                    <th className="text-left text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] pb-4">
                      Examples
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ["Action Reversibility", "40%", "Deletion (+40), Write (+20), Read (+0)"],
                    ["Scope of Impact", "25%", "External API (+25), Internal DB (+15), Read-only (+0)"],
                    ["Data Sensitivity", "20%", "PII/Financial (+20), Business Data (+10), Public (+0)"],
                    ["Volume / Scale", "15%", "Bulk (>100 records) (+15), Multi-record (+8), Single (+0)"],
                  ].map(([dim, weight, examples], i) => (
                    <tr key={i}>
                      <td className="py-3 pr-6 text-white font-semibold text-xs">{dim}</td>
                      <td className="py-3 pr-6 text-emerald-400 font-mono text-xs">{weight}</td>
                      <td className="py-3 text-neutral-400 text-xs">{examples}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Risk scores map to risk levels: 0–24 is LOW, 25–49 is MEDIUM, 50–74 is HIGH, and
              75–100 is CRITICAL. Policy rules can reference risk levels directly, making it
              possible to write policies like &ldquo;require approval for all CRITICAL actions
              regardless of tool&rdquo; — a powerful catch-all that catches novel attack vectors
              that haven&apos;t been explicitly anticipated in the tool-level policy set.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              In the audit trail, risk scores serve a second purpose beyond real-time policy
              enforcement: they make incident reconstruction significantly faster. During a
              forensic investigation, analysts can immediately filter the audit trail to HIGH
              and CRITICAL events, rather than reviewing thousands of low-risk read operations.
              The median incident investigation time drops from hours to minutes when risk
              scores are present.
            </p>
          </section>

          {/* Section 4: Forensic Fields */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <AlertTriangle className="w-7 h-7 text-emerald-500 shrink-0" />
              Forensic Fields
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Four fields in the SupraWall audit log exist specifically for forensic and
              compliance use cases. They are not operationally useful during normal agent
              execution — their value surfaces only during an investigation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: <Hash className="w-5 h-5 text-emerald-500" />,
                  title: "Integrity Hash",
                  desc: "A SHA-256 hash of the entire log entry, computed at write time. Comparing the stored hash against a recomputation of the entry immediately reveals if any field has been modified after the fact. This is the primary tamper-detection mechanism.",
                },
                {
                  icon: <Link2 className="w-5 h-5 text-emerald-500" />,
                  title: "Previous Hash Chain",
                  desc: "Each entry's integrityHash is computed using the previousHash of the preceding entry. This creates a cryptographic chain — modifying any historical entry changes its hash, which cascades through all subsequent entries, making retroactive alteration detectable across the entire log history.",
                },
                {
                  icon: <ListOrdered className="w-5 h-5 text-emerald-500" />,
                  title: "Sequence Number",
                  desc: "A monotonically increasing integer within each session. Gaps in the sequence number indicate that log entries have been deleted. Combined with the hash chain, sequence numbers make it impossible to silently remove entries from the middle of a session log.",
                },
                {
                  icon: <Gauge className="w-5 h-5 text-emerald-500" />,
                  title: "Risk Factors",
                  desc: "The specific risk factors that contributed to the risk score for this entry. During investigation, risk factors explain why the system considered an action high-risk and whether the policy response was proportionate. These are the 'working shown' field of the risk score.",
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

          {/* Section 5: Tamper-Proof Storage */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Lock className="w-7 h-7 text-emerald-500 shrink-0" />
              Tamper-Proof Storage
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Cryptographic chaining at the log entry level provides tamper detection — it tells
              you if a log has been modified. But detection alone is not sufficient for
              compliance purposes. Regulators also require that the system{" "}
              <span className="text-white font-semibold">prevents</span> tampering, or at
              minimum makes tampering unambiguously attributable. This requires immutable storage
              at the infrastructure level.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              SupraWall supports three storage backends designed for tamper-proof compliance
              archival:
            </p>
            <div className="space-y-4">
              {[
                {
                  step: "01",
                  title: "AWS S3 with Object Lock (WORM)",
                  desc: "Write-Once-Read-Many storage with Governance or Compliance mode locking. Compliance mode prevents deletion even by root users for the duration of the retention period. This is the gold standard for regulatory archival in AWS environments.",
                },
                {
                  step: "02",
                  title: "Google Cloud Storage with Retention Policies",
                  desc: "Bucket-level retention policies prevent object deletion or modification before the retention period expires. Combined with bucket lock, the retention policy itself cannot be shortened, providing verifiable long-term immutability.",
                },
                {
                  step: "03",
                  title: "SupraWall Hosted Audit Store",
                  desc: "SupraWall's managed audit store uses append-only storage with cryptographic anchoring to a public blockchain checkpoint every 24 hours. The checkpoint hash can be independently verified to prove the log state at any historical point in time.",
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
            <div className="bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 font-mono text-sm overflow-x-auto">
              <p className="text-neutral-500 text-[10px] uppercase tracking-[0.15em] mb-4 font-sans font-black">
                Configuring Tamper-Proof Audit Storage
              </p>
              <pre className="text-neutral-300 leading-relaxed">{`import suprawall

sw = suprawall.Client(api_key="sw_live_...")

# Configure immutable audit log archival
sw.audit.configure(
    # Primary storage: SupraWall hosted (append-only + blockchain anchoring)
    primary="suprawall_hosted",

    # Archive to AWS S3 with Object Lock for long-term retention
    archive={
        "backend": "s3",
        "bucket": "acme-ai-audit-logs",
        "region": "eu-west-1",
        "object_lock": True,
        "retention_days": 1095,     # 3 years
        "retention_mode": "COMPLIANCE",
    },

    # Export format for compliance submissions
    export_format="json_ld",        # Linked Data format for regulatory submissions

    # Cryptographic anchoring interval
    blockchain_checkpoint_hours=24,

    # Alert if log integrity verification fails
    integrity_alert_channel="slack",
    integrity_alert_slack="#security-alerts",
)

# Verify integrity of historical logs on demand
result = sw.audit.verify_integrity(
    session_id="sess_01J8XK2M3N4P5Q6R7S8T9U0V1W",
    from_sequence=1,
    to_sequence=47
)

print(f"Verified {result.entries_checked} entries")
print(f"Integrity: {result.status}")  # VALID or TAMPERED
print(f"Last checkpoint: {result.blockchain_anchor}")`}</pre>
            </div>
          </section>

          {/* Section 6: EU AI Act Article 12 */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <ShieldCheck className="w-7 h-7 text-emerald-500 shrink-0" />
              EU AI Act Article 12 Compliance
            </h2>
            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-4">
              <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                EU AI Act Article 12 — Logging Requirements
              </p>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Article 12(1) requires that high-risk AI systems have &ldquo;capabilities enabling
                the automatic recording of events throughout the lifetime of the AI system.&rdquo;
                The SupraWall audit trail satisfies this requirement through automatic instrumentation
                at the SDK level — no manual logging calls are required in agent code.
              </p>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Article 12(2) specifies that logging capabilities shall ensure traceability of
                the AI system&apos;s functioning throughout its lifetime. The hash chain and sequence
                numbers in SupraWall audit logs provide cryptographic traceability — a continuous
                verifiable record from the first agent action to the most recent.
              </p>
              <p className="text-neutral-300 text-sm leading-relaxed">
                Article 12(3) adds specific requirements for certain biometric and critical
                infrastructure AI systems, including logging of the reference database used,
                input data, and operating periods. For general autonomous agent deployments,
                the SupraWall log format&apos;s{" "}
                <code className="text-emerald-400 text-xs">arguments</code>,{" "}
                <code className="text-emerald-400 text-xs">sessionId</code>,{" "}
                <code className="text-emerald-400 text-xs">timestamp</code>, and{" "}
                <code className="text-emerald-400 text-xs">agentVersion</code> fields map
                directly to these requirements.
              </p>
              <p className="text-neutral-300 text-sm leading-relaxed">
                SupraWall generates a compliance evidence report that cross-references each
                log field against the specific Article 12 sub-requirement it satisfies, formatted
                for direct inclusion in the technical documentation required under Article 11.
                This report can be generated on-demand for conformity assessments and audit
                requests.
              </p>
            </div>
          </section>

          {/* Section 7: Cost Attribution */}
          <section className="space-y-6">
            <h2 className="text-3xl font-black italic text-white flex items-center gap-4">
              <Database className="w-7 h-7 text-emerald-500 shrink-0" />
              Cost Attribution and Operational Intelligence
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Beyond compliance, the SupraWall audit trail serves as the primary source of
              operational intelligence for agent deployments. The{" "}
              <code className="text-emerald-400 text-sm bg-neutral-900 px-2 py-0.5 rounded-lg">
                cost_usd
              </code>{" "}
              and{" "}
              <code className="text-emerald-400 text-sm bg-neutral-900 px-2 py-0.5 rounded-lg">
                tokens_used
              </code>{" "}
              fields on every entry enable per-session, per-agent, per-user, and per-task cost
              attribution — answering the question that every engineering leader asks: &ldquo;how much
              are our agents actually costing us, broken down by what they&apos;re doing?&rdquo;
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              The latency field enables performance regression detection — if a specific tool
              call or policy evaluation starts taking significantly longer than its historical
              average, the audit trail surfaces this before it becomes a user-facing incident.
              Combined with the sequence number, you can reconstruct the exact execution timeline
              of any agent session down to the millisecond.
            </p>
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              Session-level aggregates are computed automatically by SupraWall and available via
              the API: total cost, total tokens, total actions, action breakdown by risk level,
              policy hit rate, approval rate, and denial rate. These aggregates power the
              SupraWall dashboard&apos;s governance reporting view, which is the primary interface
              for AI governance teams conducting ongoing oversight.
            </p>
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
                  q: "What does EU AI Act Article 12 require for audit logging?",
                  a: "Article 12 of the EU AI Act requires high-risk AI systems to have logging capabilities that enable automatic recording of events throughout the system's lifetime. Logs must capture the period of each use, the reference database against which input data was checked, data that has led to the AI system giving a certain result, and any human oversight measures applied. For autonomous agents, this means logging every tool call, policy decision, and the context that led to each action.",
                },
                {
                  q: "What makes an AI agent audit log tamper-proof?",
                  a: "Tamper-proof audit logs use cryptographic chaining — each log entry contains a hash of the previous entry, creating a chain where modifying any historical entry invalidates all subsequent hashes. This makes retroactive tampering detectable. SupraWall additionally stores audit logs in append-only storage with cryptographic integrity verification, and can export to immutable storage services like AWS S3 with Object Lock or Google Cloud Storage with retention policies.",
                },
                {
                  q: "How long should AI agent audit logs be retained?",
                  a: "The EU AI Act does not specify a retention period in Article 12, but Article 18 requires providers of high-risk AI systems to keep documentation for at least 10 years after the system is placed on the market. For audit logs specifically, legal guidance generally recommends at minimum 3 years to cover typical statute of limitations periods for regulatory investigations. SupraWall supports configurable retention policies with automatic archival to cold storage.",
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
                href="/learn/eu-ai-act-compliance-ai-agents"
                className="px-6 py-3 bg-neutral-900 border border-white/5 rounded-2xl text-sm text-neutral-300 hover:border-emerald-500/30 hover:text-white transition-all font-medium"
              >
                EU AI Act Compliance Guide →
              </Link>
              <Link
                href="/learn/what-is-agent-runtime-security"
                className="px-6 py-3 bg-neutral-900 border border-white/5 rounded-2xl text-sm text-neutral-300 hover:border-emerald-500/30 hover:text-white transition-all font-medium"
              >
                Agent Runtime Security →
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="mt-24 p-16 rounded-[4rem] bg-emerald-600 text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-white">
              Start Logging Now.
            </h2>
            <p className="text-emerald-100 text-lg max-w-xl mx-auto">
              Get tamper-proof, Article-12-ready audit logs for every agent action in your
              fleet. No code changes to your agent logic — just wrap and deploy.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                href="/login"
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
