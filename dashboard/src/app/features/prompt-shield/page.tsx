import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import PromptShieldClient from "./PromptShieldClient";

export const metadata: Metadata = {
    title: "AI Prompt Injection Shield | SDK-Level Protection | SupraWall",
    description: "System prompts aren't safety. Indirect prompt injection via search results or emails can override your instructions. SupraWall Prompt Shield enforces security at the SDK level, where no prompt can reach.",
    keywords: [
        "prompt injection prevention",
        "indirect injection defense",
        "AI agent jailbreak protection",
        "LLM instruction bypass",
        "zero-trust prompt engineering",
        "secure agentic framework",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/features/prompt-shield",
    },
    openGraph: {
        title: "Instructions aren't safety. Code is.",
        description: "Move critical agent policies from the prompt to the SDK. Deterministic protection against indirect prompt injection.",
        url: "https://www.supra-wall.com/features/prompt-shield",
        siteName: "SupraWall",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Instructions aren't safety. Code is.",
        description: "Stop prompt injection attacks before they trigger tool calls. SupraWall enforces deterministic security rules regardless of the LLM context.",
    },
    robots: "index, follow",
};

export default function PromptShieldPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-rose-500/30">
            <Navbar />
            <PromptShieldClient />
        </div>
    );
}
