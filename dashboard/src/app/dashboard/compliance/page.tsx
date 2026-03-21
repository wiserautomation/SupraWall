"use client";

import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Shield, CheckCircle2, AlertTriangle, XCircle, Download,
    FileText, Settings, ExternalLink, RefreshCw, Award, Linkedin, Copy, Check
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const API_URL = process.env.NEXT_PUBLIC_SUPRAWALL_API_URL || "http://localhost:3000";

type CheckStatus = "pass" | "partial" | "fail";

interface ComplianceCheck {
    status: CheckStatus;
    detail: string;
}

interface ComplianceStatus {
    overall: "COMPLIANT" | "ATTENTION_NEEDED" | "NOT_CONFIGURED";
    checks: {
        humanOversight: ComplianceCheck;
        auditLogging: ComplianceCheck;
        riskControls: ComplianceCheck;
        recordKeeping: ComplianceCheck;
        dataGovernance: ComplianceCheck;
        incidentLogging: ComplianceCheck;
    };
    lastChecked: string;
}

const CHECKLIST_META = [
    {
        key: "humanOversight" as const,
        article: "Article 14",
        name: "Human Oversight",
        description: "REQUIRE_APPROVAL policies enforce human review before sensitive tool executions.",
        link: "/dashboard/policies",
        linkLabel: "Configure Policies",
    },
    {
        key: "auditLogging" as const,
        article: "Article 12",
        name: "Audit Logging",
        description: "All AI agent tool calls are recorded with timestamps, agent identity, tool name, and decision.",
        link: "/dashboard/audit",
        linkLabel: "View Audit Logs",
    },
    {
        key: "riskControls" as const,
        article: "Article 9",
        name: "Risk Management Controls",
        description: "DENY policies block dangerous or unauthorized tool calls before execution.",
        link: "/dashboard/policies",
        linkLabel: "Configure Policies",
    },
    {
        key: "recordKeeping" as const,
        article: "Article 11",
        name: "Record Keeping",
        description: "Audit logs are retained with sufficient history for regulatory review.",
        link: "/dashboard/audit",
        linkLabel: "View Audit Logs",
    },
    {
        key: "dataGovernance" as const,
        article: "Article 10",
        name: "Data Governance",
        description: "Tool call arguments are logged with full fidelity. Self-hosting ensures data residency compliance.",
        link: "/dashboard/settings",
        linkLabel: "Settings",
    },
    {
        key: "incidentLogging" as const,
        article: "Article 73",
        name: "Incident Logging",
        description: "DENY decisions are logged. Dedicated incident workflow coming soon.",
        link: "/dashboard/audit",
        linkLabel: "View Audit Logs",
    },
];

function StatusBadge({ status }: { status: CheckStatus }) {
    if (status === "pass") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active
            </span>
        );
    }
    if (status === "partial") {
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5" /> Partial
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <XCircle className="w-3.5 h-3.5" /> Not Configured
        </span>
    );
}

function OverallBadge({ overall }: { overall: ComplianceStatus["overall"] }) {
    if (overall === "COMPLIANT") {
        return (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4" /> COMPLIANT
            </span>
        );
    }
    if (overall === "ATTENTION_NEEDED") {
        return (
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-4 h-4" /> ATTENTION NEEDED
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-red-500/10 text-red-400 border border-red-500/30">
            <XCircle className="w-4 h-4" /> NOT CONFIGURED
        </span>
    );
}

interface CertificateData {
    certId: string;
    orgName: string;
    issueDate: string;
    complianceScore: number;
    articlesCompliant: string[];
    certificateUrl: string;
    verificationUrl: string;
    userId: string;
}

export default function CompliancePage() {
    const [user] = useAuthState(auth);
    const [status, setStatus] = useState<ComplianceStatus | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [certLoading, setCertLoading] = useState(false);
    const [certificate, setCertificate] = useState<CertificateData | null>(null);
    const [copied, setCopied] = useState(false);
    const [certError, setCertError] = useState<string | null>(null);

    const fetchStatus = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/v1/compliance/status`);
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
            const data = await res.json();
            setStatus(data);
        } catch (e) {
            setError(
                e instanceof Error
                    ? e.message
                    : "Failed to fetch compliance status. Ensure NEXT_PUBLIC_SUPRAWALL_API_URL is set and the suprawall server is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchStatus();
    }, [user]);

    const generateCertificate = async () => {
        if (!user) return;
        setCertLoading(true);
        setCertError(null);
        try {
            const res = await fetch("/api/compliance/certificate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.uid }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || "Failed to generate certificate");
            setCertificate(data.certificate);
        } catch (e) {
            console.error(e);
            setCertError(e instanceof Error ? e.message : "Certificate generation failed. Please try again.");
        } finally {
            setCertLoading(false);
        }
    };

    const copyVerificationUrl = async () => {
        if (!certificate) return;
        await navigator.clipboard.writeText(certificate.verificationUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadReport = () => {
        const url = new URL(`${API_URL}/v1/compliance/report`);
        const from = new Date(Date.now() - 30 * 86_400_000).toISOString().split("T")[0];
        const to = new Date().toISOString().split("T")[0];
        url.searchParams.set("from", from);
        url.searchParams.set("to", to);
        window.open(url.toString(), "_blank");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-8"
        >
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                            <Shield className="w-6 h-6 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                                EU AI Act Compliance
                            </h1>
                            <p className="text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] mt-1">
                                Real-time compliance readiness across EU AI Act requirements.
                            </p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={fetchStatus}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 bg-black/60 hover:bg-white/[0.05] border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-[10px] font-black uppercase tracking-wider text-neutral-400 hover:text-white transition-all disabled:opacity-50"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Overall Status Card */}
            <Card className="bg-black/60 backdrop-blur-xl border-emerald-500/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent" />
                <CardContent className="p-6">
                    {loading ? (
                        <div className="flex items-center gap-3 text-neutral-400 animate-pulse">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Checking compliance status...</span>
                        </div>
                    ) : error ? (
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-amber-400">Could not reach suprawall server</p>
                                <p className="text-xs text-neutral-400 mt-1">{error}</p>
                                <p className="text-xs text-neutral-600 mt-1">
                                    Set <code className="text-emerald-400/80">NEXT_PUBLIC_SUPRAWALL_API_URL</code> in your <code className="text-emerald-400/80">.env.local</code>
                                </p>
                            </div>
                        </div>
                    ) : status ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400">Overall Status</p>
                                <OverallBadge overall={status.overall} />
                            </div>
                            <p className="text-xs text-neutral-600">
                                Last checked: {new Date(status.lastChecked).toLocaleString()}
                            </p>
                        </div>
                    ) : null}
                </CardContent>
            </Card>

            {/* Checklist */}
            {status && (
                <div>
                    <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.25em] mb-4">
                        Requirement Checklist
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {CHECKLIST_META.map((item, i) => {
                            const check = status.checks[item.key];
                            return (
                                <motion.div
                                    key={item.key}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.06 }}
                                >
                                    <Card className="bg-black/60 backdrop-blur-xl border-white/10 hover:border-emerald-500/20 transition-all duration-300 h-full relative overflow-hidden group">
                                        <CardContent className="p-5 flex flex-col gap-3">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/60">
                                                        {item.article}
                                                    </span>
                                                    <h3 className="text-sm font-black text-white uppercase italic tracking-tight mt-0.5">
                                                        {item.name}
                                                    </h3>
                                                </div>
                                                <StatusBadge status={check.status} />
                                            </div>
                                            <p className="text-xs text-neutral-400 leading-relaxed">
                                                {item.description}
                                            </p>
                                            <p className="text-xs text-neutral-400 italic">{check.detail}</p>
                                            <Link
                                                href={item.link}
                                                className="inline-flex items-center gap-1 text-xs text-emerald-400/70 hover:text-emerald-400 transition-colors mt-auto"
                                            >
                                                {item.linkLabel}
                                                <ExternalLink className="w-3 h-3" />
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Compliance Certificate */}
            <div>
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                    Compliance Certificate
                </h2>
                <Card className="bg-black/60 backdrop-blur-xl border-emerald-500/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />
                    <CardContent className="p-6">
                        {!certificate ? (
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-sm font-black text-white uppercase italic tracking-tight mb-1">Generate EU AI Act Certificate</h3>
                                        <p className="text-xs text-neutral-400">
                                            Create a shareable compliance certificate. Share on LinkedIn to drive brand awareness.
                                        </p>
                                    </div>
                                    <button
                                        onClick={generateCertificate}
                                        disabled={certLoading}
                                        className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors"
                                    >
                                        <Award className="w-4 h-4" />
                                        {certLoading ? "Generating…" : "Generate Certificate"}
                                    </button>
                                </div>
                                {certError && (
                                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                                        <p className="text-xs text-red-400">{certError}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                        <Award className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">Certificate Generated</p>
                                        <p className="text-xs text-neutral-400">ID: {certificate.certId} · Score: {certificate.complianceScore}/100</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <a
                                        href={certificate.certificateUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded-lg text-xs font-medium text-white transition-colors"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        View &amp; Print Certificate
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certificate.verificationUrl)}&text=${encodeURIComponent(`Our AI agents are now EU AI Act compliant ✅\n\nArticle 14 human oversight, Article 12 audit logging, and Article 9 risk management — all verified by Supra-wall.\n\nWith August 2026 enforcement approaching, compliance isn't optional.\n\n#EUAIAct #AICompliance #AIAgentSecurity`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-[#0a66c2]/20 hover:bg-[#0a66c2]/30 border border-[#0a66c2]/30 rounded-lg text-xs font-medium text-[#70a9e8] transition-colors"
                                    >
                                        <Linkedin className="w-3.5 h-3.5" />
                                        Share on LinkedIn
                                    </a>
                                    <button
                                        onClick={copyVerificationUrl}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] rounded-lg text-xs font-medium text-neutral-300 transition-colors"
                                    >
                                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                        {copied ? "Copied!" : "Copy Verification URL"}
                                    </button>
                                    <button
                                        onClick={() => setCertificate(null)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.06] rounded-lg text-xs font-medium text-neutral-400 transition-colors"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        Regenerate
                                    </button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-4">
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0 }}
                        onClick={downloadReport}
                        className="flex items-center gap-3 p-4 bg-black/30 hover:bg-white/[0.04] border border-white/10 hover:border-emerald-500/20 rounded-xl text-left transition-all duration-300 group"
                    >
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg group-hover:bg-emerald-500/15 transition-colors">
                            <Download className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">Download Compliance Report</p>
                            <p className="text-xs text-neutral-400 mt-0.5">PDF for auditors (last 30 days)</p>
                        </div>
                    </motion.button>

                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.06 }}
                    >
                        <Link
                            href="/dashboard/policies"
                            className="flex items-center gap-3 p-4 bg-black/30 hover:bg-white/[0.04] border border-white/10 hover:border-white/[0.1] rounded-xl text-left transition-all duration-300 group h-full"
                        >
                            <div className="p-2 bg-white/[0.04] border border-white/[0.06] rounded-lg group-hover:bg-white/[0.07] transition-colors">
                                <Settings className="w-5 h-5 text-neutral-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">Configure Policies</p>
                                <p className="text-xs text-neutral-400 mt-0.5">Set DENY and approval rules</p>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12 }}
                    >
                        <Link
                            href="/dashboard/audit"
                            className="flex items-center gap-3 p-4 bg-black/30 hover:bg-white/[0.04] border border-white/10 hover:border-white/[0.1] rounded-xl text-left transition-all duration-300 group h-full"
                        >
                            <div className="p-2 bg-white/[0.04] border border-white/[0.06] rounded-lg group-hover:bg-white/[0.07] transition-colors">
                                <FileText className="w-5 h-5 text-neutral-300" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">View Full Audit Log</p>
                                <p className="text-xs text-neutral-400 mt-0.5">Browse forensic event stream</p>
                            </div>
                        </Link>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
