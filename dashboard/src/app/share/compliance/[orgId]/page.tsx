import { getAdminDb } from "@/lib/firebase-admin";
import { Metadata } from "next";
import Link from "next/link";

interface CertData {
    certId: string;
    orgName: string;
    issueDate: string;
    complianceScore: number;
    articlesCompliant: string[];
    totalAuditEvents: number;
    agentCount: number;
    createdAt: { toDate: () => Date } | Date | string;
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ orgId: string }>;
}): Promise<Metadata> {
    const { orgId } = await params;
    const adminDb = getAdminDb();

    // Get the latest certificate for this org
    const certsSnap = await adminDb
        .collection("certificates")
        .where("userId", "==", orgId)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

    const cert = certsSnap.docs[0]?.data() as CertData | undefined;
    const orgName = cert?.orgName || "This Organization";

    return {
        title: `${orgName} — EU AI Act Compliance Verified | Supra-wall`,
        description: `${orgName}'s AI agents have been verified as EU AI Act compliant by Supra-wall. Real-time compliance status: Article 9 risk management, Article 12 audit logging, Article 14 human oversight.`,
        openGraph: {
            title: `${orgName} — EU AI Act Compliance Certificate`,
            description: "Verified by Supra-wall — AI agent security & compliance platform",
            images: ["/og-certificate.png"],
        },
    };
}

export default async function VerificationPage({
    params,
}: {
    params: Promise<{ orgId: string }>;
}) {
    const { orgId } = await params;
    const adminDb = getAdminDb();

    // Get latest certificate for this org
    const certsSnap = await adminDb
        .collection("certificates")
        .where("userId", "==", orgId)
        .orderBy("createdAt", "desc")
        .limit(1)
        .get();

    const cert = certsSnap.docs[0]?.data() as CertData | undefined;

    const allArticles = [
        { id: "Article 9", name: "Risk Management Systems" },
        { id: "Article 12", name: "Record-Keeping & Audit Logging" },
        { id: "Article 14", name: "Human Oversight" },
    ];

    if (!cert) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-3">No Certificate Found</h1>
                    <p className="text-neutral-400 mb-8 text-sm">
                        No compliance certificate has been issued for this organization yet.
                    </p>
                    <Link
                        href="/?ref=certificate-verify"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition-colors"
                    >
                        Secure your agents with Supra-wall →
                    </Link>
                </div>
            </div>
        );
    }

    const issuedDate = new Date(cert.issueDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const isCompliant = cert.complianceScore >= 67;

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* SEO structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Certification",
                        name: "EU AI Act Compliance Certificate",
                        issuedBy: { "@type": "Organization", name: "Supra-wall" },
                        about: { "@type": "Organization", name: cert.orgName },
                        dateCreated: cert.issueDate,
                    }),
                }}
            />

            <div className="max-w-2xl mx-auto px-6 py-16">
                {/* Verified badge */}
                <div className="text-center mb-10">
                    <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold border mb-6 ${
                        isCompliant
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    }`}>
                        {isCompliant ? (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        )}
                        {isCompliant ? "EU AI ACT COMPLIANT" : "PARTIAL COMPLIANCE"}
                    </div>

                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">{cert.orgName}</h1>
                    <p className="text-neutral-400 text-sm">
                        Compliance verified by Supra-wall · Issued {issuedDate}
                    </p>
                </div>

                {/* Score card */}
                <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-1">Compliance Score</p>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-extrabold text-white">{cert.complianceScore}</span>
                                <span className="text-neutral-500 text-xl mb-1">/100</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-neutral-500 mb-1">{cert.agentCount} agent{cert.agentCount !== 1 ? "s" : ""} monitored</p>
                            <p className="text-xs text-neutral-500">{cert.totalAuditEvents.toLocaleString()} audit events</p>
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${isCompliant ? "bg-emerald-500" : "bg-amber-500"}`}
                            style={{ width: `${cert.complianceScore}%` }}
                        />
                    </div>
                </div>

                {/* Articles */}
                <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-6 mb-6">
                    <p className="text-xs text-neutral-500 uppercase tracking-wider font-semibold mb-4">EU AI Act Coverage</p>
                    <div className="space-y-3">
                        {allArticles.map(({ id, name }) => {
                            const compliant = cert.articlesCompliant.includes(id);
                            return (
                                <div key={id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${compliant ? "bg-emerald-500/15" : "bg-white/[0.04]"}`}>
                                            {compliant ? (
                                                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><polyline points="20 6 9 17 4 12" /></svg>
                                            ) : (
                                                <svg className="w-3.5 h-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="5" y1="12" x2="19" y2="12" /></svg>
                                            )}
                                        </div>
                                        <div>
                                            <span className={`text-sm font-medium ${compliant ? "text-white" : "text-neutral-500"}`}>{id}</span>
                                            <span className="text-neutral-500 text-xs ml-2">{name}</span>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                                        compliant
                                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                            : "bg-white/[0.04] text-neutral-500 border border-white/[0.06]"
                                    }`}>
                                        {compliant ? "Verified" : "Not configured"}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Certificate ID */}
                <div className="bg-black/40 border border-white/[0.06] rounded-2xl p-4 mb-8">
                    <p className="text-xs text-neutral-500 mb-1">Certificate ID</p>
                    <p className="text-sm font-mono text-neutral-300">{cert.certId}</p>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <p className="text-neutral-500 text-sm mb-4">Want EU AI Act compliance for your AI agents?</p>
                    <Link
                        href="/?ref=certificate-verify"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-colors"
                    >
                        Get Started Free with Supra-wall
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                    </Link>
                    <p className="text-xs text-neutral-600 mt-3">supra-wall.com</p>
                </div>
            </div>
        </div>
    );
}
