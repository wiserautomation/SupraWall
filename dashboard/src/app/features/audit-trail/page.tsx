import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import AuditTrailClient from "./AuditTrailClient";

export const metadata: Metadata = {
    title: "AI Agent Audit Trail | EU AI Act Compliance Logs | SupraWall",
    description: "Every policy decision, every tool call, every blocked action. SupraWall generates immutable, signed audit trails for autonomous AI agents to satisfy EU AI Act Articles 9, 11, 12, and 14.",
    keywords: [
        "AI agent audit logs",
        "EU AI Act compliance reports",
        "agentic observability",
        "human oversight logs AI",
        "signed security logs LLM",
        "AI governance evidence",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/features/audit-trail",
    },
    openGraph: {
        title: "Stop Dread the Audit. Export the Evidence.",
        description: "One-click compliance reports for autonomous AI agents. Deterministic evidence of oversight and risk management.",
        url: "https://www.supra-wall.com/features/audit-trail",
        siteName: "SupraWall",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Stop Dread the Audit. Export the Evidence.",
        description: "Autonomous agents don't have to be black boxes. Generate signed audit trails for every tool call with SupraWall.",
    },
    robots: "index, follow",
};

export default function AuditTrailPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar />
            <AuditTrailClient />
        </div>
    );
}
