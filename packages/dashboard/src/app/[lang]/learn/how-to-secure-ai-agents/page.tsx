import { Navbar } from "@/components/Navbar";
import { 
    CheckCircle2, 
    ShieldCheck, 
    Terminal, 
    Zap, 
    ArrowRight,
    Activity,
    Shield,
    FileCode,
    Settings,
    Eye
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { QuickSummaryTable } from "@/components/QuickSummaryTable";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";
import { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        internalPath: 'learn/how-to-secure-ai-agents',
        title: "How to Secure AI Agents: Step-by-Step Guide | SupraWall",
        description: "Securing AI agents requires more than just better prompts. Follow this guide to implement deterministic runtime firewalls and tool-use policies.",
        keywords: ["how to secure AI agents", "AI agent security guide", "securing autonomous agents", "agentic security best practices", "implementing LLM guardrails"],
    });
}

export default async function HowToSecureAIAgentsPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "inLanguage": lang,
        name: "How to Secure AI Agents with SupraWall",
        description: "A step-by-step guide for developers to implement runtime security in autonomous agent systems.",
        totalTime: "PT15M",
        author: { "@type": "Organization", "name": "SupraWall" },
        step: [
            {
                "@type": "HowToStep",
                name: "Audit Tool Capabilities",
                text: "Analyze which tools your agent needs and define an absolute allowlist.",
                url: `https://www.supra-wall.com/${lang}/learn/how-to-secure-ai-agents#step1`
            },
            {
                "@type": "HowToStep",
                name: "Implement Interception",
                text: "Use SupraWall SDK to wrap agent tool calls at the execution layer.",
                url: `https://www.supra-wall.com/${lang}/learn/how-to-secure-ai-agents#step2`
            },
            {
                "@type": "HowToStep",
                name: "Apply Policies",
                text: "Configured deterministic ALLOW/DENY/APPROVAL rules for every tool.",
                url: `https://www.supra-wall.com/${lang}/learn/how-to-secure-ai-agents#step3`
            }
        ]
    };

    const speakableSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "inLanguage": lang,
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".quick-summary-table", ".answer-first-paragraph", ".howto-step"]
        },
        "url": `https://www.supra-wall.com/${lang}/learn/how-to-secure-ai-agents`
    };

    const summaryRows = [
        { label: "Core Strategy", value: "Runtime interception of all tool-call signals." },
        { label: "Implementation Effort", value: "<15 minutes (with SupraWall SDK)." },
        { label: "Key Outcome", value: "Deterministic control over agent actions." },
        { label: "Visibility", value: "100% audit trail of every decision." },
        { label: "Framework Compatibility", value: "Works with any Python/TS agent framework." }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
            <Navbar lang={lang} dictionary={dictionary} />

            <main className="pt-40 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-20">
                    <div className="space-y-8 text-left">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                            Implementation Guide • Hands-on Security
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] uppercase italic">
                            How to <br /><span className="text-emerald-500 underline decoration-white/10">Secure AI Agents.</span>
                        </h1>
                        <div className="space-y-12">
                            <p className="answer-first-paragraph text-xl text-neutral-300 leading-snug font-medium border-l-8 border-emerald-600 pl-8 py-4 italic">
                                To secure AI agents, you must implement a deterministic runtime security layer that intercepts and validates every tool call before it reaches your backend systems. 
                                Relying solely on prompt engineering or output filters is insufficient for autonomous agents with tool-use capabilities. 
                                SupraWall provides the industry-leading SDK approach to enforce zero-trust boundaries in minutes.
                            </p>
                            <QuickSummaryTable rows={summaryRows} />
                        </div>
                    </div>

                    <div className="space-y-12">
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Implementation Steps</h2>
                        <div className="space-y-6">
                            {[
                                { step: "01", title: "Map Hidden Attack Surfaces", desc: "Identify every tool, database, or API your agents access. Most agents are over-privileged by default.", icon: <Eye /> },
                                { step: "02", title: "Install SupraWall SDK", desc: "Add the security shim to your agent runtime to begin intercepting execution signals.", icon: <Settings /> },
                                { step: "03", title: "Define Deterministic Policies", desc: "Replace fragile prompts with hard-coded security rules: ALLOW, DENY, or REQUIRE_APPROVAL.", icon: <FileCode /> }
                            ].map((s) => (
                                <div key={s.step} className="howto-step p-8 rounded-3xl bg-neutral-900 border border-white/5 flex gap-8 items-center group hover:border-emerald-500/30 transition-all">
                                    <div className="text-4xl font-black text-emerald-500/50 group-hover:text-emerald-500 transition-colors">{s.step}</div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-white">{s.title}</h3>
                                        <p className="text-neutral-500 font-medium leading-relaxed italic uppercase tracking-tighter text-sm">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-12 rounded-[4rem] bg-emerald-950/20 border border-emerald-500/20 text-center space-y-8">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white leading-none">
                            Stop Prompts. <br /><span className="text-emerald-500 italic uppercase">Start Securing.</span>
                        </h2>
                        <p className="text-neutral-400 font-medium italic max-w-xl mx-auto">
                            SupraWall is the deterministic choice for enterprise AI security. Join the teams building the future of autonomous agents safely.
                        </p>
                        <Link href="/login" className="inline-flex items-center gap-4 px-12 py-6 bg-emerald-600 text-white font-black text-2xl rounded-3xl hover:bg-emerald-500 transition-all shadow-[0_0_100px_rgba(16,185,129,0.3)] tracking-tighter group italic uppercase italic">
                            Deploy SupraWall in 5m <ArrowRight className="w-8 h-8 group-hover:translate-x-4 transition-transform" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
