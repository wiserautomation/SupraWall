import { Navbar } from "@/components/Navbar";
import { ArrowRight, Shield, Zap, Terminal, CheckCircle2, Box, Cpu, Lock, Database, FileText } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Security for PydanticAI Agents | SupraWall Guide",
    description: "Secure PydanticAI agents with runtime tool governance. Prevent rogue tool calls, ensure data integrity, and maintain EU AI Act risk compliance.",
    keywords: ["pydanticai security", "pydanticai guardrails", "secure pydantic agents", "agent runtime security pydanticai", "eu ai act compliance pydanticai"],    alternates: {
        canonical: 'https://www.supra-wall.com/integrations/pydanticai',
    },

};

export default function PydanticAIIntegrationPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for PydanticAI",
        "description": "Enterprise-grade runtime security shim for PydanticAI autonomous agents.",
        "applicationCategory": "SecurityApplication",
        "url": "https://www.supra-wall.com/integrations/pydanticai",
        "author": { "@type": "Organization", "name": "SupraWall" },
        "featureList": [
            "Typed Tool Interception",
            "Real-time Audit Logs",
            "Circuit Breakers",
            "Human-in-the-loop"
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Is PydanticAI's type safety enough for security?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. While PydanticAI ensures types are correct, it doesn't verify if a tool call should happen. SupraWall provides the runtime governance layer to verify permission and context before execution."
                }
            },
            {
                "@type": "Question",
                "name": "How does SupraWall integrate with PydanticAI tools?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SupraWall wraps the tool execution context. When an agent attempts a tool call, the shim intercepts the payload, validates it against your security policies, and only then allows execution."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <article className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20">
                    <div className="lg:col-span-12 text-center mb-10 space-y-6">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                            Infrastructure • PydanticAI Ready
                        </div>
                        <h1 className="text-6xl md:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase italic">
                            Secure <br />
                            <span className="text-emerald-500">PydanticAI</span>
                        </h1>

                        <div className="max-w-3xl mx-auto pt-10">
                            <p className="text-xl md:text-2xl text-neutral-300 leading-snug font-medium italic">
                                PydanticAI security requires type-safe runtime governance that validates agent tool calls against execution boundaries without breaking the developer workflow.
                                SupraWall shims the execution context of PydanticAI agents to provide real-time interception, enabling teams to enforce security policies and audit autonomous behavior at the runtime level.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 pt-8">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-2">
                                Start Building <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-8 lg:col-start-3 prose prose-invert prose-emerald max-w-none space-y-20">

                        <section>
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mb-10 border-b border-white/10 pb-4">
                                Type Safety is not Execution Safety
                            </h2>
                            <p className="text-lg text-neutral-400 leading-relaxed font-medium italic">
                                PydanticAI is praised for its type safety, but type safety is not security.
                                A well-typed `delete_user(user_id: str)` call is still destructive if the agent decides to trigger it maliciously or via indirect prompt injection.
                                SupraWall provides the <strong>governance layer</strong> that sits between PydanticAI's internal tool dispatcher and your environment.
                            </p>
                        </section>

                        <section className="space-y-8">
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mb-6">
                                Quick Implementation
                            </h2>
                            <div className="bg-neutral-900 rounded-[2.5rem] p-10 border border-white/5 font-mono text-emerald-400 shadow-2xl">
                                <p className="mb-4 text-neutral-500"># Install the official integration package</p>
                                <p className="text-white font-bold mb-6">pip install suprawall-python</p>
                                <p className="text-neutral-500"># Secure your agent executor</p>
                                <p className="text-emerald-300">from <span className="text-white">pydantic_ai</span> import <span className="text-white">Agent</span></p>
                                <p className="text-emerald-300">from <span className="text-white">suprawall.pydantic_ai</span> import <span className="text-white">Guard</span></p>
                                <br />
                                <p className="text-emerald-300">my_agent = Agent(...)</p>
                                <p className="text-white font-bold"># Wrap it for runtime interception</p>
                                <p className="text-emerald-300">secured_agent = Guard(my_agent, policy_id="finance_v1")</p>
                            </div>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all">
                                <Shield className="w-12 h-12 text-emerald-500 mb-6" />
                                <h3 className="text-xl font-bold uppercase text-white tracking-widest mb-4 italic">Injection Blocking</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed uppercase tracking-tight font-bold">
                                    SupraWall monitors PydanticAI's tool calling patterns specifically looking for indirect prompt injection vectors in RAG-provided data.
                                </p>
                            </div>
                            <div className="p-10 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all">
                                <Box className="w-12 h-12 text-emerald-500 mb-6" />
                                <h3 className="text-xl font-bold uppercase text-white tracking-widest mb-4 italic">Type-Safe Audits</h3>
                                <p className="text-sm text-neutral-500 leading-relaxed uppercase tracking-tight font-bold">
                                    Because PydanticAI uses strongly-typed models, SupraWall logs audit data with full JSON schema compliance, making it easy to analyze failures.
                                </p>
                            </div>
                        </section>

                        <div className="my-16 p-10 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 space-y-8">
                            <div className="flex items-center gap-4 text-emerald-400">
                                <FileText className="w-8 h-8" />
                                <h3 className="text-2xl font-black uppercase italic tracking-tight">EU AI Act Compliance</h3>
                            </div>
                            <p className="text-neutral-300 font-medium italic">
                                For developers using PydanticAI in financial or regulated sectors, SupraWall fulfills the requirement for <span className="text-emerald-400">Deterministic Governance (Article 14)</span>. We ensure that every 'high-risk' tool call is checked against a non-LLM policy engine before execution.
                            </p>
                        </div>

                        <section>
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mb-10">
                                Deterministic Policy Enforcement
                            </h2>
                            <p className="text-lg text-neutral-400 mb-10 font-medium leading-relaxed">
                                In production, an agent shouldn't be allowed to execute tools like <code className="text-emerald-400">db_execute</code> or <code className="text-emerald-400">send_api_request</code> without a boundary verification.
                                SupraWall's integration follows the <Link href="/spec" className="text-emerald-400 underline decoration-emerald-500/30">AGPS Spec</Link> to intercept these calls before they hit your infrastructure.
                            </p>

                            <div className="bg-neutral-900/50 p-12 rounded-[3.5rem] border border-white/10 space-y-6">
                                <h4 className="text-xl font-bold text-white uppercase tracking-tighter">Native Features:</h4>
                                <ul className="space-y-4 list-none p-0 m-0">
                                    {[
                                        "Real-time interception of 'FunctionTool' calls.",
                                        "Validation against runtime budget caps to prevent $500 billing surprises.",
                                        "Automatic 'Fail-Closed' behavior if the security shim is disconnected.",
                                        "Seamless integration with PydanticAI's 'RunContext' for dependency injection."
                                    ].map((item, idx) => (
                                        <li key={idx} className="flex gap-4 items-start text-neutral-300 font-bold uppercase text-xs tracking-widest">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>

                        <section className="pt-10 border-t border-white/5 flex flex-col md:flex-row gap-10">
                            <Link href="/blog/prevent-agent-infinite-loops" className="flex-1 group p-8 rounded-3xl bg-neutral-900/40 border border-white/5 hover:border-emerald-500/20 transition-all">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-2">Internal Report</p>
                                <h4 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors italic uppercase">Stopping Infinite Loops</h4>
                                <p className="text-xs text-neutral-500 mt-2 italic">How to prevent recursive tool calls in your PydanticAI swarm.</p>
                            </Link>
                            <Link href="/learn/what-is-agent-runtime-security" className="flex-1 group p-8 rounded-3xl bg-neutral-900/40 border border-white/5 hover:border-emerald-500/20 transition-all">
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-2">Theoretical Base</p>
                                <h4 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors italic uppercase">Understanding ARS</h4>
                                <p className="text-xs text-neutral-500 mt-2 italic">The missing layer between your LLM and your environment.</p>
                            </Link>
                        </section>

                    </div>
                </article>

                <div className="max-w-7xl mx-auto mt-40 p-24 rounded-[5rem] bg-emerald-600 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-900 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 text-center space-y-10">
                        <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Govern Your <br /> Pydantic Swarm
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/login" className="px-12 py-5 bg-black text-white font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">
                                Configure My Shim
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
