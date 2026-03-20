import { Navbar } from "@/components/Navbar";
import { ArrowRight, CheckCircle2, AlertTriangle, Code2, Shield, Clock, DollarSign, Wrench, Layers, FileText, Zap, Lock, BarChart3, Eye, Pause, Database, Activity } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "The 2026 AI Agent Security Checklist: 15 Controls Before You Deploy | SupraWall",
    description: "Deploy AI agents to production without the security gaps. This 15-point checklist covers runtime guardrails, credential protection, budget caps, audit logging, and EU AI Act compliance for autonomous agents.",
    keywords: ["AI agent security checklist", "AI agent deployment checklist", "agentic AI security", "AI agent production security", "secure AI agent deployment 2026"],
    alternates: {
        canonical: "https://www.supra-wall.com/blog/agentic-ai-security-checklist-2026",
    },
    openGraph: {
        title: "The 2026 AI Agent Security Checklist: 15 Controls Before You Deploy | SupraWall",
        description: "Deploy AI agents to production without the security gaps. This 15-point checklist covers runtime guardrails, credential protection, budget caps, audit logging, and EU AI Act compliance for autonomous agents.",
    },
    twitter: {
        card: "summary_large_image",
        title: "The 2026 AI Agent Security Checklist: 15 Controls Before You Deploy | SupraWall",
        description: "Deploy AI agents to production without the security gaps. This 15-point checklist covers runtime guardrails, credential protection, budget caps, audit logging, and EU AI Act compliance for autonomous agents.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function AgenticAISecurityChecklistPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": ["TechArticle", "FAQPage", "HowTo"],
        "headline": "The 2026 AI Agent Security Checklist: 15 Controls Before You Deploy",
        "description": "A production-ready security checklist with 15 critical controls for deploying autonomous AI agents: tool allowlists, credential isolation, budget enforcement, human-in-the-loop gates, audit logging, and more.",
        "genre": "Security Checklist",
        "author": {
            "@type": "Organization",
            "name": "SupraWall",
        },
        "publisher": {
            "@type": "Organization",
            "name": "SupraWall",
        },
        "keywords": "AI agent security checklist, agentic AI security, AI agent production security, secure AI agent deployment",
        "mainEntityOfPage": "https://www.supra-wall.com/blog/agentic-ai-security-checklist-2026",
        "mainEntity": {
            "@type": "HowTo",
            "name": "Deploy AI Agents Securely: 15-Point Security Checklist",
            "step": [
                { "@type": "HowToStep", "name": "Define Tool Call Allowlists", "text": "Create explicit allowlists defining exactly which tools and APIs each agent can call" },
                { "@type": "HowToStep", "name": "Isolate Credentials with a Vault", "text": "Never give agents raw API keys or passwords. Use a vault for scoped credential injection" },
                { "@type": "HowToStep", "name": "Enforce Budget Caps", "text": "Set hard spending limits per agent, per session, and per day with automatic halts" },
                { "@type": "HowToStep", "name": "Implement Human-in-the-Loop Gates", "text": "Require approval for high-risk actions with notification integrations" },
                { "@type": "HowToStep", "name": "Enable Immutable Audit Logging", "text": "Log every tool call with timestamp, input, and output in tamper-proof format" },
                { "@type": "HowToStep", "name": "Detect Infinite Loops", "text": "Implement circuit breakers for repetitive tool call patterns" },
                { "@type": "HowToStep", "name": "Scrub Sensitive Data (PII)", "text": "Strip PII from agent outputs and logs before persistence" },
                { "@type": "HowToStep", "name": "Defend Against Prompt Injection", "text": "Detect and block injection attempts in tool call parameters" },
                { "@type": "HowToStep", "name": "Validate Agent Outputs", "text": "Verify outputs match expected schemas before persistence" },
                { "@type": "HowToStep", "name": "Segment Network Access", "text": "Restrict agent network calls to approved endpoints only" },
                { "@type": "HowToStep", "name": "Set Rate Limits", "text": "Cap API calls per minute/hour to prevent abuse" },
                { "@type": "HowToStep", "name": "Isolate Sessions", "text": "Prevent cross-session data leakage between agent runs" },
                { "@type": "HowToStep", "name": "Generate EU AI Act Evidence", "text": "Automatically create compliance artifacts for Article 12/14" },
                { "@type": "HowToStep", "name": "Build Rollback Procedures", "text": "Design ability to undo agent actions when needed" },
                { "@type": "HowToStep", "name": "Prepare Incident Runbooks", "text": "Pre-define playbook for responding to security incidents" }
            ]
        },
        "faqPage": {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": "What is the most critical control in the AI agent security checklist?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Tool call allowlists are foundational. If an agent can call any API on any system, no amount of downstream guardrails will stop a compromised or adversarial agent. Define exactly what each agent can do before deployment."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Why is credential isolation so important for AI agents?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Agents that hold raw API keys or passwords are a single compromise away from complete credential exfiltration. A vault that injects scoped, short-lived credentials at runtime eliminates this attack surface entirely."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How do I prevent an AI agent from burning through my budget?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Set hard spending caps per agent, per session, and per day. When an agent reaches its budget threshold, the system automatically halts all tool calls. This is non-negotiable in production."
                    }
                },
                {
                    "@type": "Question",
                    "name": "What does EU AI Act compliance look like for AI agents?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Article 12 requires detailed logging of agent decisions and actions. Article 14 requires human oversight mechanisms for high-risk applications. Your logging and approval infrastructure must generate compliance evidence automatically."
                    }
                },
                {
                    "@type": "Question",
                    "name": "How can I detect if my AI agent is stuck in an infinite loop?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Monitor tool call patterns in real-time. If an agent repeatedly calls the same tool with the same parameters, it's in a loop. Circuit breakers halt execution and trigger alerts before the runaway agent becomes expensive."
                    }
                },
                {
                    "@type": "Question",
                    "name": "Should I implement all 15 controls or can I start with a subset?",
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "Start with the non-negotiable five: allowlists, credential isolation, budget caps, audit logging, and human-in-the-loop gates. These five controls stop 80% of real-world agent incidents. Add the remaining ten progressively based on your risk profile."
                    }
                }
            ]
        }
    };

    const checklistItems = [
        {
            number: 1,
            title: "Tool Call Allowlists",
            icon: Shield,
            why: "Without explicit allowlists, a compromised agent can call any API on your network. In 2024, a misconfigured SaaS agent was given access to the entire internal API surface. It called a billing API endpoint it shouldn't have known about and refunded $240K in customer transactions before the incident was caught 8 hours later.",
            how: "Define every tool, API endpoint, and function each agent can invoke. Use a deny-by-default policy: if a tool is not explicitly whitelisted, the agent cannot call it. Store these policies in a centralized policy engine that intercepts every tool call at runtime.",
            code: `// SupraWall Policy Definition
const policy = {
  agent_id: "sales-assistant-prod",
  allowed_tools: [
    { tool: "send_email", max_recipients: 5 },
    { tool: "query_crm", max_records: 100 },
    { tool: "create_ticket", allowed_fields: ["title", "priority", "description"] },
  ],
  denied_tools: ["delete_user", "access_billing", "modify_permissions"],
  default_action: "DENY"
};`
        },
        {
            number: 2,
            title: "Credential Isolation (Vault)",
            icon: Lock,
            why: "Agents that hold API keys are a single exploit away from exfiltration. A prompt injection in the agent's reasoning can cause it to print the key to logs. Or a malicious tool call can extract the credential. In 2023, a misconfigured LangChain agent logged its own system prompt, which included hardcoded database credentials. Those credentials were indexed by search engines.",
            how: "Use a secrets vault (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) to store all credentials. At runtime, inject scoped, short-lived credentials directly into tool calls. The agent never holds the raw credential. Use per-agent service accounts with minimum necessary permissions.",
            code: `// Agent receives short-lived, scoped token at runtime
const tool_result = await execute_tool({
  tool: "query_database",
  vault_token: "sv-rwR92.p8L2x2..."  // 30-min expiration
  vault_scope: "sales_database_read_only"
});

// Not this:
// password: "sk-prod-final-2024-xyz" // NEVER hardcode`
        },
        {
            number: 3,
            title: "Budget Enforcement",
            icon: DollarSign,
            why: "An agent in a loop calling expensive APIs can burn thousands per minute. In January 2025, a research lab's agent entered a loop calling GPT-4 Vision on images. It cost $47,000 in 45 minutes before the loop was discovered and halted manually.",
            how: "Set hard spending caps per agent, per session, and per day. Track real-time spend across all tool calls. When an agent reaches its budget threshold, immediately halt all subsequent tool calls and trigger an alert. This is a circuit breaker, not a soft limit.",
            code: `// Budget enforcement config
const budget_policy = {
  agent_id: "research-analyzer",
  daily_budget_cents: 500000,      // $5000/day hard cap
  per_session_budget_cents: 100000, // $1000/session hard cap
  per_call_budget_cents: 10000,     // $100 max per tool call
  enforcement: "HARD_HALT"          // Stops immediately when budget hit
};`
        },
        {
            number: 4,
            title: "Human-in-the-Loop Gates",
            icon: Eye,
            why: "Agents that can take high-risk actions without approval are a liability. A travel booking agent approved a $85,000 luxury hotel booking without human verification. A hiring assistant sent rejection emails to candidates with insulting language because it was never reviewed before sending.",
            how: "Define high-risk actions: financial transactions, user communication, data modification, external API calls. For these actions, require explicit human approval before execution. Integrate approval workflows with Slack, email, PagerDuty. Track approval/rejection audit trails.",
            code: `// Human approval gate
const action_policy = {
  high_risk_actions: [
    { action: "send_email", approval_required: true },
    { action: "process_payment", approval_required: true },
    { action: "modify_user_data", approval_required: true },
    { action: "query_crm", approval_required: false }
  ],
  approval_channels: ["slack", "email"],
  timeout_seconds: 900  // 15 min to approve, then auto-deny
};`
        },
        {
            number: 5,
            title: "Immutable Audit Logging",
            icon: FileText,
            why: "When incidents happen, you need a tamper-proof record of exactly what the agent did. Log entries that can be modified or deleted offer zero evidentiary value. In regulatory audits (SOC 2, ISO 27001), mutable logs are a critical finding.",
            how: "Log every tool call with timestamp, agent ID, tool name, input parameters, output, and result status. Use cryptographic chaining or append-only storage so logs cannot be retroactively modified. Include user context and session IDs. Export logs to immutable storage (S3 with object lock, Datadog, Splunk).",
            code: `// Immutable audit log entry
{
  "timestamp": "2026-03-20T14:32:15.234Z",
  "session_id": "sess-8f2e9d",
  "agent_id": "sales-bot-prod",
  "tool": "send_email",
  "input": { "recipient": "customer@example.com", "subject": "...", "body": "..." },
  "output": { "message_id": "msg-xyz", "status": "sent" },
  "status": "ALLOWED",
  "prior_hash": "b3a2f1c9...",  // Chained to previous entry
  "entry_hash": "e8d1a7f2..."
}`
        },
        {
            number: 6,
            title: "Infinite Loop Detection",
            icon: Pause,
            why: "An agent stuck in a loop calling the same tool repeatedly is one of the fastest ways to burn budget and degrade service. A retrieval-augmented generation (RAG) agent got stuck in a loop re-querying the same documents 847 times trying to find an answer that didn't exist.",
            how: "Track tool call patterns per session. If the same tool is called with identical or near-identical parameters more than N times in M seconds, trigger a circuit breaker. Options: halt execution, alert human, rollback to last known good state. Implement configurable thresholds based on agent type.",
            code: `// Loop detection config
const loop_detection = {
  enabled: true,
  detection_window_seconds: 60,
  max_repeated_calls: 5,      // Alert if same tool called 5x in 60s
  action_on_loop: "HALT_AND_ALERT",
  similarity_threshold: 0.95   // 95% parameter similarity = same call
};`
        },
        {
            number: 7,
            title: "PII Scrubbing",
            icon: Eye,
            why: "Agent outputs and logs often contain PII that was never intended to be logged. A customer support agent copied an entire customer record into logs, including passport numbers and addresses. These logs were accessible to 50+ employees and had been archived to cold storage for 3 years.",
            how: "Before logging any agent output, scan for PII patterns: emails, phone numbers, SSNs, credit card numbers, passport numbers, medical data. Redact or hash these values. Use regex patterns and ML-based PII detection. Maintain a list of data fields that are always PII (addresses, IDs, etc.).",
            code: `// PII scrubbing policy
const pii_scrubbing = {
  enabled: true,
  patterns: [
    /\b\d{3}-\d{2}-\d{4}\b/,        // SSN
    /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/,  // Credit card
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/,  // Email
    /\b\d{3}-\d{3}-\d{4}\b/,        // Phone
  ],
  sensitive_fields: ["address", "ssn", "passport", "driver_license"],
  action: "REDACT"  // Replace with [REDACTED]
};`
        },
        {
            number: 8,
            title: "Prompt Injection Defenses",
            icon: AlertTriangle,
            why: "Prompt injection in tool parameters can cause agents to misbehave. An attacker injected instructions into a knowledge base document. When the agent retrieved that document, it obeyed the injected instructions instead of its original goal.",
            how: "Detect injection patterns in tool call parameters before execution. Look for: system prompt markers, jailbreak phrases, instruction keywords, encoding attacks (base64, hex). Use both rule-based detection and ML models trained on injection datasets. Quarantine suspicious parameters for human review.",
            code: `// Prompt injection detection
const injection_defense = {
  enabled: true,
  detection_methods: ["pattern_matching", "ml_classifier"],
  blocked_patterns: [
    "ignore previous", "system prompt", "ignore instructions",
    "do the opposite", "override your", "disregard"
  ],
  encoded_attack_check: true,  // Detect base64, hex, unicode escapes
  action: "BLOCK_AND_LOG"
};`
        },
        {
            number: 9,
            title: "Output Validation",
            icon: CheckCircle2,
            why: "Agents can return malformed, incomplete, or malicious outputs. A scheduling agent returned invalid date formats that broke downstream systems. A content generator returned outputs exceeding size limits, crashing the API.",
            how: "Define expected output schemas for each tool. Before returning results to the agent or to downstream systems, validate outputs against the schema. Check data types, field presence, size limits, encoding. Reject invalid outputs and trigger an alert.",
            code: `// Output validation schema
const output_schema = {
  tool: "book_meeting",
  expected_output: {
    type: "object",
    properties: {
      meeting_id: { type: "string", pattern: "^mtg_[a-z0-9]{8}$" },
      scheduled_time: { type: "string", format: "iso8601" },
      status: { enum: ["confirmed", "pending", "failed"] }
    },
    required: ["meeting_id", "scheduled_time", "status"],
    maxProperties: 10
  }
};`
        },
        {
            number: 10,
            title: "Network Segmentation",
            icon: Layers,
            why: "An agent running with unrestricted network access can reach internal APIs, databases, and services it shouldn't. A chatbot agent was used to scan the internal network and discover unpatched services.",
            how: "Restrict agent network access to a whitelist of approved endpoints. Use network policies (security groups, network ACLs) or proxy rules to enforce this. Log all network calls made by agents. For external APIs, use allowlists and rate limits at the network level.",
            code: `// Network segmentation policy
const network_policy = {
  agent_id: "customer-support-bot",
  allowed_endpoints: [
    { url: "https://api.crm.internal/", methods: ["GET", "POST"] },
    { url: "https://api.stripe.com/", methods: ["POST"] },
  ],
  blocked_patterns: [
    "127.0.0.1",
    "10.0.0.0/8",  // Internal RFC1918
    "**/admin",
    "**/.env"
  ],
  proxy_enforcement: true
};`
        },
        {
            number: 11,
            title: "Rate Limiting",
            icon: Zap,
            why: "Without rate limits, a single misbehaving agent can overwhelm external APIs or internal systems. A RAG agent called the search API 10,000 times in 5 minutes, causing service degradation for all users.",
            how: "Implement rate limits per agent, per user, and globally. Set limits at both the application level and the API gateway. Use token bucket or sliding window algorithms. Different APIs may have different limits; apply the most restrictive per endpoint.",
            code: `// Rate limiting rules
const rate_limits = {
  per_agent: {
    calls_per_minute: 100,
    calls_per_hour: 5000
  },
  per_endpoint: {
    "stripe_api": { calls_per_minute: 10 },
    "crm_api": { calls_per_minute: 50 },
    "search_api": { calls_per_minute: 200 }
  },
  strategy: "TOKEN_BUCKET",
  enforcement: "SOFT_REJECT"  // Reject excess calls with 429
};`
        },
        {
            number: 12,
            title: "Session Isolation",
            icon: Database,
            why: "Data from one agent session can leak into another if sessions share memory or storage. A multi-tenant SaaS accidentally returned customer B's data in an agent response meant for customer A.",
            how: "Ensure each agent session has its own isolated context, memory, and temporary storage. Do not share state across sessions. Use separate database transactions for each session. Implement session timeouts and explicit cleanup. Verify isolation in multi-agent scenarios.",
            code: `// Session isolation
const session_context = {
  session_id: "sess-9x2m1k",
  user_id: "user-456",
  customer_id: "cust-789",
  memory: {},  // Isolated to this session
  storage_path: "/tmp/session-9x2m1k/",
  ttl_seconds: 3600,
  cleanup_on_exit: true,
  allowed_access: ["session-9x2m1k"]  // Can't access other sessions
};`
        },
        {
            number: 13,
            title: "EU AI Act Compliance Evidence",
            icon: Activity,
            why: "The EU AI Act (Articles 12–14) requires detailed documentation and logging of AI system decisions. Without automated compliance evidence, you cannot prove you meet the requirements. Non-compliance carries fines up to 6% of revenue.",
            how: "Automatically generate compliance artifacts: action logs, approval records, human override logs, model cards, risk assessments. Track every human-in-the-loop decision and agent action. Export evidence for audits in standardized formats. Update policies as regulations evolve.",
            code: `// EU AI Act compliance export
const compliance_export = {
  regulation: "EU_AI_ACT_2024",
  articles: ["12_transparency", "14_human_oversight"],
  period: "2026-Q1",
  export_data: {
    total_agent_actions: 145230,
    human_approved_actions: 8932,
    human_rejected_actions: 234,
    audit_log_entries: 145230,
    incident_count: 3,
    avg_decision_time_ms: 2340
  },
  certification: "compliance_evidence_q1_2026.pdf"
};`
        },
        {
            number: 14,
            title: "Rollback Procedures",
            icon: Wrench,
            why: "When an agent misbehaves and takes harmful actions (sends emails, modifies data, processes payments), you need the ability to undo those actions quickly. A calendar agent scheduled meetings for the wrong times. Without rollback, 200+ meetings had to be manually rescheduled.",
            how: "Design every high-risk action to be reversible. Before committing state changes, record the original state and the change. Implement rollback endpoints that undo agent actions. For irreversible actions (sending emails), implement approval gates to prevent them in the first place.",
            code: `// Rollback capability
const action_record = {
  action_id: "act-x8f2k1",
  tool: "send_email",
  state_before: { sent_count: 42, mailbox_size: "2.3GB" },
  state_after: { sent_count: 43, mailbox_size: "2.31GB" },
  reversible: true,
  rollback_endpoint: "/api/rollback/act-x8f2k1",
  rollback_deadline_seconds: 86400  // 24 hours to undo
};`
        },
        {
            number: 15,
            title: "Incident Response Runbook",
            icon: Clock,
            why: "When a production incident happens, your team's response time is critical. Without a pre-defined runbook, response is slow and error-prone. An agent credential leak in 2024 took 14 hours to respond to, even though the team knew the playbook conceptually.",
            how: "Document a step-by-step incident response playbook. Define escalation paths, notification channels, rollback procedures, communication templates, and post-mortem procedures. Practice the runbook quarterly. Test it with chaos engineering exercises.",
            code: `// Incident response runbook
const incident_runbook = {
  incident_type: "agent_credential_leak",
  severity: "P1",
  steps: [
    { order: 1, action: "halt_agent", delay_ms: 0 },
    { order: 2, action: "notify_slack", channel: "#security-incidents" },
    { order: 3, action: "rotate_credentials", services: ["crm", "stripe", "db"] },
    { order: 4, action: "export_audit_logs", destination: "s3://security-audit" },
    { order: 5, action: "post_mortem", template: "credential_compromise" }
  ],
  estimated_time_to_respond: 300  // seconds
};`
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <article className="max-w-4xl mx-auto space-y-12">

                    {/* Header */}
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                            Production Deployment • Security Checklist
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] uppercase italic">
                            The 2026 AI Agent<br />
                            Security <span className="text-emerald-500">Checklist</span>
                        </h1>

                        {/* Opening Pillar Paragraph */}
                        <div className="pt-6 border-l-4 border-emerald-500 pl-8">
                            <p className="text-lg md:text-xl text-neutral-300 leading-snug font-medium italic">
                                Before deploying any AI agent to production, teams must verify 15 critical security controls: tool call allowlists, credential isolation, budget enforcement, human-in-the-loop gates, audit logging, loop detection, PII scrubbing, prompt injection defenses, output validation, network segmentation, rate limiting, session isolation, compliance evidence, rollback procedures, and incident response runbooks. Missing even one of these controls has caused real-world incidents costing companies millions.
                            </p>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="prose prose-invert prose-emerald max-w-none space-y-16">

                        {/* Introduction Section */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                Why This Checklist Matters
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                AI agents are fundamentally different from traditional applications. They make autonomous decisions, call external APIs, and access systems with minimal human oversight. A single misconfigured agent can burn thousands in minutes, exfiltrate credentials, violate compliance regulations, or cause customer harm. This checklist distills the fifteen most critical controls that stand between you and a production incident.
                            </p>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Each control below includes: what could go wrong if you skip it (a real-world incident), how to implement it technically, and code examples for five key controls. The controls are prioritized: start with the first five (allowlists, vault, budget, human approval, audit logs) and then add the remaining ten based on your risk profile.
                            </p>
                        </section>

                        {/* Main Checklist */}
                        <section className="space-y-12">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                15 Critical Security Controls
                            </h2>

                            {checklistItems.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div key={idx} className="not-prose space-y-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/50 shrink-0 text-emerald-400 font-black text-sm">
                                                {item.number}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <Icon className="w-5 h-5 text-emerald-400" />
                                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tight">{item.title}</h3>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 ml-14">
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-widest text-rose-400 mb-2">Why It Matters</h4>
                                                <p className="text-neutral-400 text-sm leading-relaxed">{item.why}</p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2">How to Implement</h4>
                                                <p className="text-neutral-400 text-sm leading-relaxed">{item.how}</p>
                                            </div>

                                            {item.code && (
                                                <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                                                    <div className="text-[10px] font-mono text-neutral-600 uppercase mb-3">Code Example</div>
                                                    <pre className="font-mono text-xs leading-relaxed text-emerald-100/90 whitespace-pre-wrap overflow-x-auto">
{item.code}
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Inline links based on control type */}
                                            {item.number === 1 && (
                                                <p className="text-xs text-neutral-500 italic">
                                                    Learn more: <Link href="/learn/what-are-ai-agent-guardrails" className="text-emerald-400 hover:text-emerald-300">AI Agent Guardrails</Link> • <Link href="/features/vault" className="text-emerald-400 hover:text-emerald-300">SupraWall Vault</Link>
                                                </p>
                                            )}
                                            {item.number === 2 && (
                                                <p className="text-xs text-neutral-500 italic">
                                                    Learn more: <Link href="/learn/protect-api-keys-from-ai-agents" className="text-emerald-400 hover:text-emerald-300">Protecting API Keys</Link> • <Link href="/features/vault" className="text-emerald-400 hover:text-emerald-300">Credential Vault</Link>
                                                </p>
                                            )}
                                            {item.number === 3 && (
                                                <p className="text-xs text-neutral-500 italic">
                                                    Learn more: <Link href="/features/budget-limits" className="text-emerald-400 hover:text-emerald-300">Budget Enforcement</Link> • <Link href="/use-cases/cost-control" className="text-emerald-400 hover:text-emerald-300">Cost Control Guide</Link>
                                                </p>
                                            )}
                                            {item.number === 4 && (
                                                <p className="text-xs text-neutral-500 italic">
                                                    Learn more: <Link href="/learn/human-in-the-loop-ai-agents" className="text-emerald-400 hover:text-emerald-300">Human-in-the-Loop AI Agents</Link>
                                                </p>
                                            )}
                                            {item.number === 5 && (
                                                <p className="text-xs text-neutral-500 italic">
                                                    Learn more: <Link href="/learn/ai-agent-audit-trail-logging" className="text-emerald-400 hover:text-emerald-300">Audit Trail Logging</Link>
                                                </p>
                                            )}
                                            {item.number === 6 && (
                                                <p className="text-xs text-neutral-500 italic">
                                                    Learn more: <Link href="/learn/ai-agent-infinite-loop-detection" className="text-emerald-400 hover:text-emerald-300">Infinite Loop Detection</Link>
                                                </p>
                                            )}
                                            {item.number === 7 && (
                                                <p className="text-xs text-neutral-500 italic">
                                                    Learn more: <Link href="/learn/ai-agent-pii-protection" className="text-emerald-400 hover:text-emerald-300">PII Protection for AI Agents</Link>
                                                </p>
                                            )}
                                            {item.number === 8 && (
                                                <p className="text-xs text-neutral-500 italic">
                                                    Learn more: <Link href="/learn/prompt-injection-credential-theft" className="text-emerald-400 hover:text-emerald-300">Prompt Injection Defense</Link> • <Link href="/use-cases/prompt-injection" className="text-emerald-400 hover:text-emerald-300">Prompt Injection Use Case</Link>
                                                </p>
                                            )}
                                            {item.number === 13 && (
                                                <p className="text-xs text-neutral-500 italic">
                                                    Learn more: <Link href="/learn/eu-ai-act-compliance-ai-agents" className="text-emerald-400 hover:text-emerald-300">EU AI Act Compliance</Link>
                                                </p>
                                            )}
                                            {item.number === 15 && (
                                                <p className="text-xs text-neutral-500 italic">
                                                    Learn more: <Link href="/learn/ai-agent-security-best-practices" className="text-emerald-400 hover:text-emerald-300">AI Agent Security Best Practices</Link>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </section>

                        {/* Implementation Phases */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                Phased Implementation Strategy
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Do not try to implement all 15 controls at once. Use a phased approach:
                            </p>

                            <div className="not-prose space-y-6">
                                <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/20">
                                    <h4 className="text-lg font-black text-emerald-400 uppercase italic mb-3">Phase 1: Non-Negotiable (Week 1)</h4>
                                    <ul className="space-y-2 text-neutral-300 text-sm">
                                        <li>✓ Tool Call Allowlists (Control #1)</li>
                                        <li>✓ Credential Isolation (Control #2)</li>
                                        <li>✓ Budget Enforcement (Control #3)</li>
                                        <li>✓ Human-in-the-Loop Gates (Control #4)</li>
                                        <li>✓ Immutable Audit Logging (Control #5)</li>
                                    </ul>
                                    <p className="text-xs text-neutral-500 italic mt-4">These five controls stop 80% of real-world incidents. Do not deploy to production without them.</p>
                                </div>

                                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <h4 className="text-lg font-black text-white uppercase italic mb-3">Phase 2: High-Risk Coverage (Week 2–3)</h4>
                                    <ul className="space-y-2 text-neutral-300 text-sm">
                                        <li>✓ Infinite Loop Detection (Control #6)</li>
                                        <li>✓ PII Scrubbing (Control #7)</li>
                                        <li>✓ Prompt Injection Defenses (Control #8)</li>
                                        <li>✓ Network Segmentation (Control #10)</li>
                                    </ul>
                                    <p className="text-xs text-neutral-500 italic mt-4">Add these if your agents access external APIs, handle sensitive data, or accept user input.</p>
                                </div>

                                <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <h4 className="text-lg font-black text-white uppercase italic mb-3">Phase 3: Operational Excellence (Week 4+)</h4>
                                    <ul className="space-y-2 text-neutral-300 text-sm">
                                        <li>✓ Output Validation (Control #9)</li>
                                        <li>✓ Rate Limiting (Control #11)</li>
                                        <li>✓ Session Isolation (Control #12)</li>
                                        <li>✓ EU AI Act Evidence (Control #13)</li>
                                        <li>✓ Rollback Procedures (Control #14)</li>
                                        <li>✓ Incident Response Runbook (Control #15)</li>
                                    </ul>
                                    <p className="text-xs text-neutral-500 italic mt-4">Implement as you scale production deployments and approach regulatory audits.</p>
                                </div>
                            </div>
                        </section>

                        {/* Common Mistakes */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                Common Mistakes to Avoid
                            </h2>

                            <div className="not-prose space-y-6">
                                <div className="flex gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase italic mb-2">Mistake 1: Implementing Controls After an Incident</h4>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            Do not wait for an incident to implement controls. By then, the damage is already done. A finance company waited until after a $500K unauthorized wire transfer to implement approval gates. Implement all controls before production deployment.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase italic mb-2">Mistake 2: Soft Limits Instead of Hard Caps</h4>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            Budget enforcement must be a hard circuit breaker, not a warning. A soft limit that "suggests" the agent stop will be ignored by a misbehaving agent. Use hard caps: when the budget is hit, execution halts immediately.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase italic mb-2">Mistake 3: Mutable Audit Logs</h4>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            Logs that can be modified or deleted are useless for compliance and incident forensics. Use cryptographic chaining or append-only storage. In an SOC 2 audit, mutable logs are a finding. Make logs immutable from the start.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase italic mb-2">Mistake 4: Hardcoding Credentials into Agent Code</h4>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            Never give agents hardcoded API keys. Use a vault that injects scoped, short-lived credentials at runtime. If an agent is ever compromised, logged, or inspected, the hardcoded credential is exposed to everyone with access to logs.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                                    <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0 mt-1" />
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase italic mb-2">Mistake 5: Skipping Human Approval for "Low-Risk" Actions</h4>
                                        <p className="text-neutral-400 text-sm leading-relaxed">
                                            What seems low-risk in engineering can be high-risk in production. Sending a single email seemed low-risk until an agent sent insulting rejection emails to 5,000 job candidates. Require approval for: user communication, data modification, financial transactions, and external API calls.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Compliance */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                Regulatory Compliance & This Checklist
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                This checklist aligns with emerging AI regulations, particularly the EU AI Act (effective 2024–2026):
                            </p>

                            <div className="not-prose space-y-4">
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2">EU AI Act Article 12 (Transparency)</h4>
                                    <p className="text-neutral-400 text-sm">Covered by: Immutable Audit Logging (#5), EU AI Act Evidence (#13). Your logs and compliance exports provide the transparency Article 12 requires.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2">EU AI Act Article 14 (Human Oversight)</h4>
                                    <p className="text-neutral-400 text-sm">Covered by: Human-in-the-Loop Gates (#4), Audit Logging (#5). Your approval workflows and decision logs satisfy Article 14's oversight requirements.</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <h4 className="text-sm font-black uppercase tracking-widest text-emerald-400 mb-2">SOC 2 Type II (Operational Controls)</h4>
                                    <p className="text-neutral-400 text-sm">Covered by: All 15 controls. Audit logging, role-based access, incident response procedures, and compliance reporting align with SOC 2 requirements.</p>
                                </div>
                            </div>
                        </section>

                        {/* Automation */}
                        <section className="space-y-8">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white border-b border-white/10 pb-4">
                                Why You Need a Purpose-Built Platform
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                Implementing 15 security controls is theoretically possible in-house, but practically very difficult. Each control has its own implementation surface, testing requirements, and maintenance burden. Framework changes (LangChain updates, OpenAI API versions) can break shims. Regulatory updates require prompt action.
                            </p>
                            <p className="text-lg text-neutral-400 leading-relaxed">
                                A purpose-built AI agent security platform handles all 15 controls out of the box, updates them as frameworks and regulations evolve, and gives you incident response support when things go wrong. SupraWall is built to implement this exact checklist.
                            </p>

                            <div className="bg-neutral-900 rounded-[2rem] p-8 border border-white/5 relative group overflow-hidden">
                                <div className="absolute top-4 right-6 text-[10px] font-mono text-neutral-600 uppercase">Integration</div>
                                <div className="flex gap-2 mb-6">
                                    <div className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-md text-[10px] font-bold">PYTHON</div>
                                </div>
                                <pre className="font-mono text-sm leading-relaxed text-emerald-100/90 whitespace-pre-wrap">
{`from suprawall.langchain import protect

# One line of code.
# All 15 controls enabled.
secured_agent = protect(
  my_agent,
  policy="agentic_ai_security_checklist_2026"
)`}
                                </pre>
                            </div>
                        </section>

                        {/* Key Takeaways */}
                        <section className="space-y-8 bg-neutral-900/50 p-12 rounded-[3rem] border border-white/10">
                            <h2 className="text-3xl font-black uppercase italic tracking-tight text-white">
                                Key Takeaways
                            </h2>
                            <ul className="space-y-4 list-none p-0">
                                {[
                                    "The 15 controls in this checklist have prevented or mitigated real-world AI agent incidents costing millions. Implement them before deploying to production.",
                                    "Start with Phase 1 (allowlists, vault, budget, approval, logs) — these five controls stop 80% of incidents. Add Phase 2 and 3 controls based on your risk profile.",
                                    "Budget enforcement must be a hard circuit breaker, not a soft warning. When the budget is hit, the agent halts immediately.",
                                    "Credentials must never be hardcoded or held by agents. Use a vault that injects scoped, short-lived credentials at runtime only.",
                                    "Human approval gates are not optional for high-risk actions. Even seemingly 'low-risk' actions (sending emails, modifying data) can cause customer harm.",
                                    "Audit logs must be immutable and tamper-proof. Mutable logs are a critical finding in SOC 2 audits and offer zero evidentiary value in incidents.",
                                    "This checklist aligns with the EU AI Act (Articles 12–14) and SOC 2 Type II. Use it as your compliance baseline.",
                                    "Implementing all 15 controls in-house is possible but burdensome. A purpose-built platform handles them automatically, updates as regulations evolve, and provides incident response support.",
                                ].map((item, idx) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                        <span className="text-neutral-300 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Related Articles */}
                    <div className="pt-20 border-t border-white/10">
                        <h2 className="text-2xl font-black uppercase italic tracking-tight text-white mb-8">Related Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link href="/learn/what-are-ai-agent-guardrails" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Pillar Content</p>
                                <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">What Are AI Agent Guardrails?</h4>
                                <p className="text-sm text-neutral-500 mt-2 italic">Understanding the foundational concept of runtime controls and security guardrails.</p>
                            </Link>
                            <Link href="/learn/ai-agent-security-best-practices" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Pillar Content</p>
                                <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">AI Agent Security Best Practices</h4>
                                <p className="text-sm text-neutral-500 mt-2 italic">A complete playbook for securing autonomous agents in production environments.</p>
                            </Link>
                            <Link href="/features/vault" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Feature Guide</p>
                                <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">SupraWall Vault: Credential Protection</h4>
                                <p className="text-sm text-neutral-500 mt-2 italic">How to isolate credentials and inject scoped secrets at runtime.</p>
                            </Link>
                            <Link href="/features/budget-limits" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Feature Guide</p>
                                <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Budget Enforcement & Cost Control</h4>
                                <p className="text-sm text-neutral-500 mt-2 italic">Set hard spending caps and prevent runaway agent costs.</p>
                            </Link>
                            <Link href="/learn/eu-ai-act-compliance-ai-agents" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Compliance Guide</p>
                                <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">EU AI Act Compliance for AI Agents</h4>
                                <p className="text-sm text-neutral-500 mt-2 italic">How this checklist aligns with Articles 12–14 of the EU AI Act.</p>
                            </Link>
                            <Link href="/build-vs-buy-ai-agent-security" className="group p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-all">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Decision Guide</p>
                                <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">Build vs Buy: AI Agent Security</h4>
                                <p className="text-sm text-neutral-500 mt-2 italic">The hidden costs of building these 15 controls in-house.</p>
                            </Link>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="bg-emerald-600 rounded-[3rem] p-12 relative overflow-hidden text-center">
                        <h3 className="text-4xl font-black uppercase italic tracking-tighter text-white mb-4">Implement All 15 Controls<br />in One Integration</h3>
                        <p className="text-emerald-100 mb-8 max-w-md mx-auto">Deploy the 2026 AI Agent Security Checklist with SupraWall. One line of code. All critical controls. Production-ready in minutes.</p>
                        <Link href="/login" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all shadow-2xl">
                            Try SupraWall Free <ArrowRight className="w-5 h-5" />
                        </Link>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />
                    </div>

                </article>
            </main>
        </div>
    );
}
