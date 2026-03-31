// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import CompetitorVsClient from "./CompetitorVsClient";

export const metadata: Metadata = {
    title: "SupraWall vs. Jozu | Model Security vs. Agent Runtime Protection",
    description: "Compare SupraWall and Jozu.kit. While Jozu focuses on model-level vulnerabilities, SupraWall provides the SDK-level deterministic layer for autonomous agent tool calls.",
    keywords: [
        "SupraWall vs Jozu",
        "Jozu.kit comparison",
        "model security vs agent safety",
        "AI runtime security tool",
        "deterministic agentic SDK",
        "best jozu alternative",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/vs/jozu",
    },
    openGraph: {
        title: "Models are Static. Agents are Dynamic. | SupraWall vs Jozu",
        description: "Static model scanning is not enough for autonomous agents. Compare the runtime interception of SupraWall.",
        url: "https://www.supra-wall.com/vs/jozu",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function JozuVsPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar />
            <CompetitorVsClient competitor="Jozu" focus="Model Scanning" />
        </div>
    );
}
