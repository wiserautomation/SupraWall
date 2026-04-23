// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import ForComplianceClient from "./ForComplianceClient";

export const metadata: Metadata = {
    title: "AI Compliance & Risk Management | EU AI Act & GDPR | SupraWall",
    description: "The official compliance platform for autonomous AI agents. Satisfy EU AI Act Articles 9, 11, 12, and 14 with immutable audit trails and automated risk management.",
    keywords: [
        "AI compliance for agents",
        "EU AI Act risk assessment",
        "GDPR data scrubbing for agents",
        "audit trails for autonomous AI",
        "compliance officer AI security",
        "suprawall compliance evidence",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/for-compliance-officers",
    },
    openGraph: {
        title: "Stop the Audit Dread. Export Evidence Today.",
        description: "SupraWall is the choice for compliance officers securing AI agents. Automated evidence trails and deterministic risk controls.",
        url: "https://www.supra-wall.com/for-compliance-officers",
        siteName: "SupraWall",
        type: "website",
    },
};

import { getDictionary } from "../../../i18n/getDictionary";
import { Locale } from "@/i18n/config";

export default async function ForCompliancePage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar lang={lang} dictionary={dictionary} />
            <ForComplianceClient dictionary={dictionary} />
        </div>
    );
}
