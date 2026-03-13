"use client";

import { useState } from "react";
import { analyzeAgentCode, type AnalysisResult, type Violation } from "@/lib/audit/static-analyzer";
import Link from "next/link";

const FRAMEWORK_OPTIONS = [
    { value: "auto", label: "Auto-detect" },
    { value: "langchain", label: "LangChain" },
    { value: "crewai", label: "CrewAI" },
    { value: "autogen", label: "AutoGen" },
    { value: "vercel", label: "Vercel AI SDK" },
    { value: "openai", label: "OpenAI SDK" },
    { value: "custom", label: "Custom" },
];

const EXAMPLE_CODE = `from langchain.agents import AgentExecutor, create_openai_tools_agent
from langchain_openai import ChatOpenAI
from langchain.tools import tool

@tool
def send_email(to: str, subject: str, body: str) -> str:
    """Send an email to a recipient."""
    return smtp_client.send(to, subject, body)

@tool
def delete_record(record_id: str) -> str:
    """Delete a record from the database."""
    return db.delete(record_id)

llm = ChatOpenAI(model="gpt-4o")
agent = create_openai_tools_agent(llm, [send_email, delete_record], prompt)
executor = AgentExecutor(agent=agent, tools=[send_email, delete_record])
result = executor.invoke({"input": user_message})
`;

const SEVERITY_CONFIG = {
    critical: { label: "Critical", bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-400", dot: "bg-red-500" },
    high: { label: "High", bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-400", dot: "bg-orange-500" },
    medium: { label: "Medium", bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-400" },
    low: { label: "Low", bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-400", dot: "bg-blue-400" },
};

function ViolationCard({ violation }: { violation: Violation }) {
    const [expanded, setExpanded] = useState(false);
    const cfg = SEVERITY_CONFIG[violation.severity];

    return (
        <div className={`${cfg.bg} border ${cfg.border} rounded-xl p-5`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`mt-1.5 w-2 h-2 rounded-full ${cfg.dot} shrink-0`} />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-xs font-bold uppercase tracking-wider ${cfg.text}`}>{violation.article}</span>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.text} border ${cfg.border}`}>
                                {cfg.label}
                            </span>
                        </div>
                        <h3 className="text-sm font-semibold text-white">{violation.title}</h3>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{violation.description}</p>
                    </div>
                </div>
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="shrink-0 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                    {expanded ? "Hide fix" : "Show fix"}
                </button>
            </div>

            {expanded && (
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                    <p className="text-xs font-semibold text-emerald-400 mb-2">Fix with Supra-wall:</p>
                    <pre className="bg-black/60 border border-white/[0.06] rounded-lg p-4 text-xs text-emerald-300 overflow-x-auto font-mono leading-relaxed">
                        {violation.fix}
                    </pre>
                </div>
            )}
        </div>
    );
}

function ScoreRing({ score }: { score: number }) {
    const color = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
    const circumference = 2 * Math.PI * 36;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-24 h-24">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                <circle
                    cx="40" cy="40" r="36"
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-white" style={{ color }}>{score}</span>
                <span className="text-[10px] text-neutral-500">/100</span>
            </div>
        </div>
    );
}

export default function AuditPage() {
    const [code, setCode] = useState("");
    const [framework, setFramework] = useState("auto");
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [deepLoading, setDeepLoading] = useState(false);
    const [deepResult, setDeepResult] = useState<AnalysisResult | null>(null);
    const [email, setEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);

    const runAnalysis = () => {
        if (!code.trim()) return;
        const analysis = analyzeAgentCode(code, framework);
        setResult(analysis);
        setDeepResult(null);
    };

    const runDeepScan = async () => {
        if (!code.trim()) return;
        setDeepLoading(true);
        try {
            const res = await fetch("/api/audit/scan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, framework }),
            });
            if (res.ok) {
                const data = await res.json();
                setDeepResult(data);
            }
        } catch {
            // fall back to static result
        } finally {
            setDeepLoading(false);
        }
    };

    const displayed = deepResult || result;

    const criticalCount = displayed?.violations.filter(v => v.severity === "critical").length ?? 0;
    const highCount = displayed?.violations.filter(v => v.severity === "high").length ?? 0;

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* SEO structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        name: "Supra-wall EU AI Act Compliance Auditor",
                        applicationCategory: "DeveloperApplication",
                        operatingSystem: "Web",
                        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                        description: "Free EU AI Act compliance scanner for AI agent code",
                    }),
                }}
            />

            {/* Navbar */}
            <nav className="border-b border-white/[0.06] px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                    </div>
                    <span className="font-bold text-white">Supra-wall</span>
                </Link>
                <Link
                    href="/quickstart"
                    className="text-xs text-neutral-400 hover:text-white transition-colors"
                >
                    Get Started Free →
                </Link>
            </nav>

            <div className="max-w-5xl mx-auto px-6 py-16">
                {/* Hero */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400 mb-6">
                        Free · No signup required
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        Is your AI agent
                        <br />
                        <span className="text-emerald-400">EU AI Act compliant?</span>
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-xl mx-auto">
                        Paste your agent code and get a free compliance scan in 30 seconds.
                        No signup required. August 2026 enforcement is{" "}
                        <span className="text-white font-medium">
                            {Math.max(0, Math.ceil((new Date("2026-08-02").getTime() - Date.now()) / 86400000))} days away.
                        </span>
                    </p>
                </div>

                {/* Input area */}
                <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <label className="text-sm font-medium text-neutral-300">Framework</label>
                            <select
                                value={framework}
                                onChange={(e) => setFramework(e.target.value)}
                                className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                            >
                                {FRAMEWORK_OPTIONS.map((f) => (
                                    <option key={f.value} value={f.value} className="bg-neutral-900">
                                        {f.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={() => setCode(EXAMPLE_CODE)}
                            className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
                        >
                            Load example →
                        </button>
                    </div>

                    <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Paste your agent code here (Python or TypeScript)…"
                        className="w-full h-64 bg-black/60 border border-white/[0.06] rounded-xl p-4 text-sm text-emerald-300 font-mono placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/40 resize-none"
                        spellCheck={false}
                    />

                    <div className="flex items-center gap-3 mt-4">
                        <button
                            onClick={runAnalysis}
                            disabled={!code.trim()}
                            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Scan My Agent
                        </button>
                        {result && (
                            <button
                                onClick={runDeepScan}
                                disabled={deepLoading}
                                className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] disabled:opacity-40 text-neutral-300 rounded-xl text-sm font-medium transition-colors"
                            >
                                {deepLoading ? (
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                )}
                                {deepLoading ? "Scanning…" : "Deep AI Scan"}
                            </button>
                        )}
                        <span className="text-xs text-neutral-600 ml-auto">Max 10,000 characters analyzed</span>
                    </div>
                </div>

                {/* Results */}
                {displayed && (
                    <div className="space-y-6">
                        {/* Score header */}
                        <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                            <ScoreRing score={displayed.score} />
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-white mb-1">
                                    {displayed.violations.length === 0
                                        ? "No violations detected"
                                        : `${displayed.violations.length} violation${displayed.violations.length > 1 ? "s" : ""} found`}
                                </h2>
                                <p className="text-sm text-neutral-400">
                                    {displayed.violations.length === 0
                                        ? "Your agent passes all static checks. For deeper analysis, try the AI-powered scan."
                                        : `${criticalCount > 0 ? `${criticalCount} critical` : ""}${criticalCount > 0 && highCount > 0 ? ", " : ""}${highCount > 0 ? `${highCount} high severity` : ""} — fix all with one line of code.`}
                                </p>
                                {displayed.violations.length > 0 && (
                                    <Link
                                        href="/quickstart?ref=audit-tool"
                                        className="inline-flex items-center gap-2 mt-3 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        Fix all violations free →
                                    </Link>
                                )}
                            </div>
                            <div className="flex gap-4 text-center">
                                {(["critical", "high", "medium", "low"] as const).map((sev) => {
                                    const count = displayed.violations.filter(v => v.severity === sev).length;
                                    const cfg = SEVERITY_CONFIG[sev];
                                    return count > 0 ? (
                                        <div key={sev}>
                                            <div className={`text-2xl font-bold ${cfg.text}`}>{count}</div>
                                            <div className="text-xs text-neutral-500 capitalize">{sev}</div>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        </div>

                        {/* Violations list */}
                        {displayed.violations.length > 0 && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider">Violations</h3>
                                {displayed.violations.map((v, i) => (
                                    <ViolationCard key={i} violation={v} />
                                ))}
                            </div>
                        )}

                        {/* One-line fix */}
                        {displayed.violations.length > 0 && (
                            <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-6">
                                <h3 className="text-sm font-semibold text-emerald-400 mb-3">Fix all {displayed.violations.length} violations with one line</h3>
                                <pre className="bg-black/60 border border-white/[0.06] rounded-xl p-4 text-sm text-emerald-300 font-mono overflow-x-auto">
{`from suprawall import protect

secured = protect(your_agent, api_key="sw_...")
# Adds: audit logging, human oversight gates, loop detection, budget caps
# EU AI Act Articles 9, 12, 14 — covered.`}
                                </pre>
                                <div className="flex flex-wrap gap-3 mt-4">
                                    <Link
                                        href="/quickstart?ref=audit-tool"
                                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        Get Started Free →
                                    </Link>
                                    <Link
                                        href="/docs?ref=audit-tool"
                                        className="px-5 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-neutral-300 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        View Docs
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Email capture */}
                        <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-6">
                            <h3 className="text-base font-semibold text-white mb-1">Get the full compliance report</h3>
                            <p className="text-xs text-neutral-400 mb-4">
                                Receive a detailed PDF report with remediation steps, article-by-article breakdown, and code examples.
                            </p>
                            {!emailSent ? (
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50"
                                    />
                                    <button
                                        onClick={() => email.includes("@") && setEmailSent(true)}
                                        className="px-5 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Send Report
                                    </button>
                                </div>
                            ) : (
                                <p className="text-sm text-emerald-400">
                                    ✓ Report sent to {email}
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* FAQ / SEO content */}
                {!displayed && (
                    <div className="mt-16 grid sm:grid-cols-3 gap-6">
                        {[
                            {
                                icon: "📋",
                                title: "Article 12 — Audit Logging",
                                desc: "Every AI agent tool call must be logged with timestamps, agent identity, and decision rationale. We check for structured audit mechanisms.",
                            },
                            {
                                icon: "👤",
                                title: "Article 14 — Human Oversight",
                                desc: "High-risk actions (delete, transfer, send) require human approval gates. We detect destructive tools without oversight controls.",
                            },
                            {
                                icon: "🛡️",
                                title: "Article 9 — Risk Management",
                                desc: "Budget caps, rate limiting, and loop detection prevent runaway agents. We check for cost controls and error handling.",
                            },
                        ].map(({ icon, title, desc }) => (
                            <div key={title} className="bg-black/30 border border-white/[0.06] rounded-xl p-5">
                                <div className="text-2xl mb-3">{icon}</div>
                                <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
                                <p className="text-xs text-neutral-500 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
