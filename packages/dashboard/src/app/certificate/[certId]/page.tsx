// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { getAdminDb } from "@/lib/firebase-admin";
import { Metadata } from "next";
import CertificateClientView from "@/components/CertificateClientView";

export const dynamic = "force-dynamic";

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
    try {
        const { certId } = await params;
        const adminDb = getAdminDb();
        const snap = await adminDb.collection("certificates").doc(certId).get();
        const cert = snap.data() as any;

        if (!cert) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12 text-center">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 mb-2">Certificate Not Found</h1>
                        <p className="text-slate-500">The certificate ID <strong>{certId}</strong> does not exist in our registry.</p>
                    </div>
                </div>
            );
        }

        return <CertificateClientView cert={cert} />;
    } catch (err) {
        console.error("[CertificatePage] Fatal error:", err);
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-12 text-center">
                <div>
                    <h1 className="text-2xl font-black text-red-600 mb-2">System Error</h1>
                    <p className="text-slate-500 mb-6">We encountered a connectivity issue while verifying this certificate.</p>
                    <a 
                         href="."
                         className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 transition-colors inline-block"
                    >
                        Try Again
                    </a>
                </div>
            </div>
        );
    }
}
