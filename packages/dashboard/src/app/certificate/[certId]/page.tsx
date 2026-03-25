// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { getAdminDb } from "@/lib/firebase-admin";
import { Metadata } from "next";
import CertificateClientView from "@/components/CertificateClientView";

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
    const cert = snap.data() as any;

    if (!cert) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <p className="text-gray-500">Certificate not found.</p>
            </div>
        );
    }

    return <CertificateClientView cert={cert} />;
}
