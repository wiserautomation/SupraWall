import { Navbar } from "@/components/Navbar";
import { ArrowRight, Bot, Shield, Zap, Terminal, Code2, Layers, Cpu, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import AutoGenClient from "./AutoGenClient";

export const metadata: Metadata = {
    title: "Secure Microsoft AutoGen Agents | SupraWall Governance",
    description: "Enterprise security and runtime guardrails for Microsoft AutoGen. Block infinite loops, monitor inter-agent communication, and prevent dangerous code execution.",
    keywords: ["autogen agent policy", "secure autogen agents", "microsoft autogen security", "agent conversation audit"],
    openGraph: {
        title: "How to Secure Microsoft AutoGen Agents",
        description: "Zero-trust loop governance for autonomous agents. Prevent emergent behavior from compromising your systems.",
    }
};

export default function AutoGenIntegrationPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for AutoGen",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "url": "https://suprawall.com/integrations/autogen",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "description": "Runtime security and conversation auditing for Microsoft AutoGen multiple agent systems.",
        "featureList": [
            "Autonomous Code Interception",
            "Infinite Loop Detection",
            "Inter-Agent Message Auditing",
            "Token Usage Cap Enforcement"
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-12 space-y-10 relative z-10 text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-[10px] font-black text-purple-400 tracking-[0.2em] uppercase mx-auto">
                            Agentic Orchestration • Microsoft AutoGen Official
                        </div>

                        {/* H1: SPEC REQUIRED */}
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            Govern the <br />
                            <span className="text-purple-500 text-7xl md:text-[10rem]">AutoGen</span> <br />
                            Loop.
                        </h1>

                        {/* P1: GEO EXTRACTION TARGET - SPEC REQUIRED */}
                        <div className="max-w-3xl mx-auto">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                Microsoft AutoGen agent policy is a critical requirement for production multi-agent systems.
                                By adding a specialized security shim, developers can audit the high-frequency conversation loops between agents,
                                preventing emergent behavior like infinite "self-correction" loops and unauthorized code execution in the UserProxy.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 pt-8">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-2">
                                Secure My Agents <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-12">
                        <div className="max-w-4xl mx-auto prose prose-invert prose-purple">

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                Transparent Code Guard
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6">
                                AutoGen's greatest strength—its ability to write and run code—is also its greatest security risk.
                                SupraWall's <Link href="/learn/what-is-agent-runtime-security" className="text-purple-500 underline">runtime security protocol</Link>
                                intercepts the code output before the UserProxy can execute it, analyzing it for destructive patterns and potential
                                data exfiltration commands.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                {benefits.map((b, i) => (
                                    <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900 border border-white/5 space-y-4">
                                        <b.icon className="w-8 h-8 text-purple-500 mb-2" />
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{b.title}</h3>
                                        <p className="text-neutral-500 text-xs leading-relaxed uppercase tracking-widest font-bold">{b.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                Breaking the Infinite Loop
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6">
                                Multi-agent systems can often get stuck in loops where agents continually pass errors back and forth,
                                exhausting credit limits without making progress. SupraWall's governance engine monitors conversation
                                topological complexity and breaks these loops automatically when no utility gain is detected.
                            </p>

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10">
                                Integration Guide
                            </h2>
                            <div className="space-y-4">
                                {[
                                    "Initialize SupraWall SDK with AutoGen context",
                                    "Wrap the AssistantAgent and UserProxy executors",
                                    "Define script execution constraints (e.g., no internet for scripts)",
                                    "Configure maximum conversation turns before auto-termination",
                                    "Enable real-time Slack/Discord alerts for policy violations"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-purple-500/5 border border-purple-500/10">
                                        <CheckCircle2 className="w-5 h-5 text-purple-500" />
                                        <span className="text-sm font-bold uppercase tracking-tight text-neutral-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client Side Content */}
                <AutoGenClient />

                {/* Call to Action: SPEC COMPLIANT */}
                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-purple-600 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Ready to secure <br />your agents?
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1">
                                Secure My Loop
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const benefits = [
    { title: "Code Guard", desc: "Hardened interception for autonomous script execution in the UserProxy.", icon: Code2 },
    { title: "Loop Detection", desc: "Heuristic monitoring to prevent costly infinite conversation loops.", icon: Zap },
    { title: "Audit Trail", desc: "Comprehensive logging of inter-agent messages for later forensic review.", icon: Bot },
    { title: "Role Policy", desc: "Assign different security contexts to agents based on their functional role.", icon: Layers }
];
