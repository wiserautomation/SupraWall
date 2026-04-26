import { Navbar } from "@/components/Navbar";
import { 
    Bug, 
    ShieldAlert, 
    Lock, 
    Zap, 
    ArrowRight,
    Activity,
    Shield,
    BookOpen,
    FileText,
    Target
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { QuickSummaryTable } from "@/components/QuickSummaryTable";

export const metadata: Metadata = {
    title: "OWASP LLM01: Prompt Injection - Deep Dive & Prevention",
    description: "OWASP LLM01 is the top risk for large language models. Learn how it affects autonomous AI agents and how to implement deterministic defenses.",
    keywords: ["OWASP LLM01", "prompt injection OWASP", "LLM security top 10", "preventing LLM01", "agentic prompt injection risks"],
    alternates: {
        canonical: "https://www.supra-wall.com/learn/owasp-llm01-prompt-injection",
    },
};

export default function OWASPLLM01Page() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: "OWASP LLM01: Prompt Injection Prevention for AI Agents",
        description: "A deep dive into the OWASP LLM01 vulnerability specifically for autonomous agentic applications.",
        author: { "@type": "Organization", "name": "SupraWall" },
        publisher: { "@type": "Organization", "name": "SupraWall" },
        datePublished: "2026-03-01",
    };

    const speakableSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".quick-summary-table", ".answer-first-paragraph"]
        },
        "url": "https://www.supra-wall.com/learn/owasp-llm01-prompt-injection"
    };

    const summaryRows = [
        { label: "OWASP Classification", value: "LLM01: Prompt Injection." },
        { label: "Vulnerability Level", value: "Critical / Top 1." },
        { label: "Attack Mechanism", value: "Input-driven instruction override." },
        { label: "Agentic Impact", value: "Unauthorized Tool Execution / Privilege Escalation." },
        { label: "Defense Strategy", value: "Deterministic Execution Guards (SupraWall)." }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-rose-500/30 font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-20">
                    <div className="space-y-8 text-left">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-rose-500/30 bg-rose-500/10 text-[10px] font-black text-rose-400 tracking-[0.2em] uppercase">
                            Security Standard • OWASP LLM Top 10
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
                            OWASP <br /><span className="text-rose-500 underline decoration-white/10">LLM01.</span>
                        </h1>
                        <div className="space-y-12">
                            <p className="answer-first-paragraph text-xl text-neutral-300 leading-snug font-medium border-l-8 border-rose-600 pl-8 py-4 italic">
                                OWASP LLM01 (Prompt Injection) is the primary vulnerability where external input overrides an LLM's system-level instructions. 
                                In agentic systems, this risk is magnified because the hijacked instructions can trigger external tool calls, leading to unauthorized data access or system manipulation.
                                SupraWall's platform directly mitigates LLM01 by decoupling instruction processing from action execution.
                            </p>
                            <QuickSummaryTable rows={summaryRows} />
                        </div>
                    </div>

                    <div className="space-y-12">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Beyond Simple Filters</h2>
                        <div className="p-8 rounded-[3rem] bg-neutral-900 border border-white/5 space-y-8">
                            <div className="flex gap-6 items-start">
                                <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-400"><Target className="w-8 h-8" /></div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Action-Centric Defense</h3>
                                    <p className="text-neutral-500 font-medium leading-relaxed italic uppercase tracking-tighter text-sm">
                                        OWASP recommends defensive coding and sanitization, but LLMs are stochastic. SupraWall adds a deterministic layer that validates the ACTION, not just the intent.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="p-4 bg-rose-500/10 rounded-2xl text-rose-400"><BookOpen className="w-8 h-8" /></div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">Full Standard Alignment</h3>
                                    <p className="text-neutral-500 font-medium leading-relaxed italic uppercase tracking-tighter text-sm">
                                        SupraWall helps you satisfy OWASP LLM Top 10 requirements for both LLM01 (Prompt Injection) and LLM02 (Insecure Output Handling) in autonomous systems.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-12 rounded-[4rem] bg-rose-950/20 border border-rose-500/20 text-center space-y-8">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
                            Align with <span className="text-rose-500 italic uppercase">Global Standards.</span>
                        </h2>
                        <p className="text-neutral-400 font-medium italic max-w-xl mx-auto">
                            Don't leave your agent security to chance. Implement the deterministic firewall that satisfies OWASP and enterprise security bars.
                        </p>
                        <Link href="/login" className="inline-flex items-center gap-4 px-12 py-6 bg-rose-600 text-white font-black text-2xl rounded-3xl hover:bg-rose-500 transition-all shadow-[0_0_80px_rgba(225,29,72,0.3)] tracking-tighter group italic uppercase italic">
                            Join the Private Beta <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
