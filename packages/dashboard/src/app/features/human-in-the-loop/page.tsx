// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import HitlClient from "./HitlClient";

export const metadata: Metadata = {
    title: "AI Agent Human-in-the-Loop (HITL) | Manual Oversight | SupraWall",
    description: "Don't let agents make high-stakes decisions alone. SupraWall HITL enforces manual approval gates for sensitive tool calls, satisfying EU AI Act Article 14.",
    keywords: [
        "AI agent human-in-the-loop",
        "HITL for LLM tools",
        "manual approval ai agents",
        "prevent rogue agent actions",
        "EU AI Act Article 14 software",
        "agentic human oversight",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/features/human-in-the-loop",
    },
    openGraph: {
        title: "Agents Hallucinate. Humans Approve.",
        description: "Move critical agent policies from the prompt to the human feedback loop. One-line approval gates for AI tools.",
        url: "https://www.supra-wall.com/features/human-in-the-loop",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function HitlPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-rose-500/30">
            <Navbar />
            <HitlClient />
        </div>
    );
}
