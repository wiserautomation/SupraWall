"use client";

import { Award, Download, Linkedin, Copy, Check, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface CertificateData {
    certId: string;
    orgName: string;
    issueDate: string;
    complianceScore: number;
    articlesCompliant: string[];
    totalAuditEvents: number;
    agentCount: number;
    verificationUrl: string;
    userId: string;
}

export default function CertificateClientView({ cert }: { cert: CertificateData }) {
    const allArticles = ["Article 9", "Article 12", "Article 14"];
    const issueDate = new Date(cert.issueDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <>
            <style>{`
                @media print {
                    body { margin: 0; background: white !important; }
                    .no-print { display: none !important; }
                    .certificate { box-shadow: none !important; border: 2px solid #e2e8f0 !important; }
                }
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');
            `}</style>
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-8">
                {/* Print button */}
                <button
                    onClick={() => window.print()}
                    className="no-print fixed top-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg transition-colors flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Download / Print PDF
                </button>

                {/* Certificate */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="certificate bg-white rounded-2xl shadow-2xl p-16 max-w-3xl w-full relative"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                >
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 mb-6">
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    background: "linear-gradient(135deg, #10b981, #059669)",
                                    borderRadius: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                            </div>
                            <span style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px" }}>
                                Supra-wall
                            </span>
                        </div>
                        <div
                            style={{
                                width: "100%",
                                height: 2,
                                background: "linear-gradient(90deg, transparent, #10b981, transparent)",
                                marginBottom: 24,
                            }}
                        />
                        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", color: "#6b7280", textTransform: "uppercase", marginBottom: 8 }}>
                            Certificate of Compliance
                        </p>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>
                            EU AI Act Compliance
                        </h1>
                        <p style={{ fontSize: 13, color: "#6b7280" }}>Verified by Supra-wall Governance Platform</p>
                    </div>

                    {/* Org name */}
                    <div className="text-center mb-10">
                        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 6 }}>This certifies that</p>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 700, color: "#0f172a" }}>
                            {cert.orgName}
                        </h2>
                        <p style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>
                            has demonstrated compliance with the EU Artificial Intelligence Act
                        </p>
                    </div>

                    {/* Score + Articles */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* Score */}
                        <div className="col-span-1 bg-emerald-50 border border-emerald-100 rounded-xl p-5 text-center">
                            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Compliance Score</p>
                            <p className="text-5xl font-black text-emerald-500 mt-1 leading-none">{cert.complianceScore}</p>
                            <p className="text-xs text-neutral-500 mt-1 italic">out of 100</p>
                        </div>

                        {/* Articles */}
                        <div className="col-span-1 md:col-span-2 bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Articles Covered</p>
                            <div className="flex flex-col gap-2">
                                {allArticles.map((article) => {
                                    const compliant = cert.articlesCompliant?.includes(article);
                                    const labels: Record<string, string> = {
                                        "Article 9": "Risk Management",
                                        "Article 12": "Audit Logging",
                                        "Article 14": "Human Oversight",
                                    };
                                    return (
                                        <div key={article} className="flex items-center gap-3">
                                            {compliant ? (
                                                <Check className="w-4 h-4 text-emerald-500" />
                                            ) : (
                                                <div className="w-4 h-4 rounded-full border border-slate-300" />
                                            )}
                                            <span className={`text-xs ${compliant ? "text-slate-900 font-semibold" : "text-slate-400"}`}>
                                                {article} — {labels[article]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {[
                            { label: "Agents", value: cert.agentCount },
                            { label: "Audit Events", value: cert.totalAuditEvents?.toLocaleString() || "0" },
                            { label: "Issue Date", value: issueDate },
                        ].map(({ label, value }) => (
                            <div key={label} className="text-center p-3 bg-slate-50 rounded-lg">
                                <p className="text-sm font-bold text-slate-900">{value}</p>
                                <p className="text-[9px] text-slate-400 uppercase font-bold mt-1">{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-100 pt-6 flex justify-between items-end">
                        <div>
                            <p className="text-[10px] text-slate-400 mb-1">Certificate ID</p>
                            <p className="text-[11px] font-mono font-bold text-slate-600">{cert.certId}</p>
                            <p className="text-[10px] text-slate-400 mt-4">
                                Verify at: supra-wall.com/share/compliance/{cert.userId}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] font-bold text-emerald-600">VERIFIED</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">supra-wall.com</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
