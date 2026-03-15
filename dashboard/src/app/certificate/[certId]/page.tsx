import { getAdminDb } from "@/lib/firebase-admin";
import { Metadata } from "next";

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

export async function generateMetadata({
    params,
}: {
    params: Promise<{ certId: string }>;
}): Promise<Metadata> {
    const { certId } = await params;
    return {
        title: `EU AI Act Compliance Certificate ${certId} | Supra-wall`,
        description:
            "Verified EU AI Act compliance certificate issued by Supra-wall. Covers Article 9 risk management, Article 12 audit logging, and Article 14 human oversight.",
    };
}

export default async function CertificatePage({
    params,
}: {
    params: Promise<{ certId: string }>;
}) {
    const { certId } = await params;
    const adminDb = getAdminDb();
    const snap = await adminDb.collection("certificates").doc(certId).get();
    const cert = snap.data() as CertificateData | undefined;

    if (!cert) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-500">Certificate not found.</p>
            </div>
        );
    }

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
                    body { margin: 0; }
                    .no-print { display: none !important; }
                    .certificate { box-shadow: none !important; }
                }
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');
            `}</style>
            <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-8">
                {/* Print button */}
                <button
                    onClick={() => window.print()}
                    className="no-print fixed top-6 right-6 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-lg transition-colors"
                >
                    Download / Print PDF
                </button>

                {/* Certificate */}
                <div
                    className="certificate bg-white rounded-2xl shadow-2xl p-16 max-w-3xl w-full"
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
                    <div style={{ display: "flex", gap: 16, marginBottom: 32 }}>
                        {/* Score */}
                        <div style={{ flex: 1, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#059669", letterSpacing: "0.1em", textTransform: "uppercase" }}>Compliance Score</p>
                            <p style={{ fontSize: 48, fontWeight: 800, color: "#10b981", lineHeight: 1.1 }}>{cert.complianceScore}</p>
                            <p style={{ fontSize: 13, color: "#6b7280" }}>out of 100</p>
                        </div>

                        {/* Articles */}
                        <div style={{ flex: 2, background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px 24px" }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>Articles Covered</p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                {allArticles.map((article) => {
                                    const compliant = cert.articlesCompliant.includes(article);
                                    const labels: Record<string, string> = {
                                        "Article 9": "Risk Management Systems",
                                        "Article 12": "Record-Keeping & Audit Logging",
                                        "Article 14": "Human Oversight",
                                    };
                                    return (
                                        <div key={article} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                            {compliant ? (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#10b981"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fillRule="evenodd" clipRule="evenodd"/></svg>
                                            ) : (
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="#d1d5db"><circle cx="12" cy="12" r="9" /></svg>
                                            )}
                                            <span style={{ fontSize: 13, color: compliant ? "#0f172a" : "#9ca3af" }}>
                                                <strong>{article}</strong> — {labels[article]}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
                        {[
                            { label: "Agents Monitored", value: cert.agentCount },
                            { label: "Audit Events", value: cert.totalAuditEvents.toLocaleString() },
                            { label: "Issue Date", value: issueDate },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ flex: 1, textAlign: "center", padding: "12px 8px", background: "#f8fafc", borderRadius: 8 }}>
                                <p style={{ fontSize: 18, fontWeight: 700, color: "#0f172a" }}>{value}</p>
                                <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            borderTop: "1px solid #e2e8f0",
                            paddingTop: 20,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-end",
                        }}
                    >
                        <div>
                            <p style={{ fontSize: 10, color: "#9ca3af", marginBottom: 2 }}>Certificate ID</p>
                            <p style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", fontFamily: "monospace" }}>{cert.certId}</p>
                            <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 6 }}>
                                Verify at: suprawall.ai/share/compliance/{cert.userId}
                            </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                    background: "#f0fdf4",
                                    border: "1px solid #bbf7d0",
                                    borderRadius: 20,
                                    padding: "4px 12px",
                                }}
                            >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                                <span style={{ fontSize: 11, fontWeight: 600, color: "#059669" }}>VERIFIED</span>
                            </div>
                            <p style={{ fontSize: 10, color: "#9ca3af", marginTop: 6 }}>suprawall.ai</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
