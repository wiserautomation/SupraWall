import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import LegalVerticalClient from "./LegalVerticalClient";

export const metadata: Metadata = {
    title: "AI Agent Security for Legal Teams | Privilege & Audits | SupraWall",
    description: "Secure autonomous agents in law firms and legal departments. Maintain attorney-client privilege, prevent data leaks, and generate immutable audit trails for every agentic action.",
    keywords: [
        "AI agents in legal firms",
        "attorney-client privilege AI security",
        "legal audit trails autonomous agents",
        "secure legal research agents",
        "AI agent governance for lawyers",
        "suprawall legal solution",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/use-cases/legal",
    },
    openGraph: {
        title: "Privilege Secured. Audits Automated. | Legal AI Security",
        description: "Standardize your legal agent security with deterministic SDK-level evidence. Zero-knowledge infrastructure for law teams.",
        url: "https://www.supra-wall.com/use-cases/legal",
        siteName: "SupraWall",
        type: "website",
    },
};

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar />
            <LegalVerticalClient />
        </div>
    );
}
