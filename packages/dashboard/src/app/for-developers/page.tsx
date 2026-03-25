// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import ForDevelopersClient from "./ForDevelopersClient";

export const metadata: Metadata = {
    title: "AI Agent Security for Developers | SupraWall SDK",
    description: "Built by developers, for developers. Stop prompt injection, prevent secret leaks, and enforce tool call safety with one line of code. Integration-first agent governance.",
    keywords: [
        "AI agent security for developers",
        "secure agentic SDK python",
        "typescript ai agent security",
        "prevent agent command injection",
        "mcp server security guide",
        "suprawall developer portal",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/for-developers",
    },
    openGraph: {
        title: "Build Agents Safely. No Context Required.",
        description: "SupraWall is the security layer for modern AI engineering teams. Secure your agents with the SDK-level interceptor.",
        url: "https://www.supra-wall.com/for-developers",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function ForDevelopersPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar />
            <ForDevelopersClient />
        </div>
    );
}
