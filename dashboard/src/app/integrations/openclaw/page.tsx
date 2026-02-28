import { Navbar } from "@/components/Navbar";
import { ArrowRight, Monitor, Shield, Zap, Search, Eye, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import OpenClawClient from "./OpenClawClient";

export const metadata: Metadata = {
    title: "OpenClaw Security Firewall | Autonomous Browser Protection",
    description: "Secure OpenClaw agents and autonomous browsers. Prevent session leakage, session hijacking, and unauthorized web actions with SupraWall's runtime firewall.",
    keywords: ["openclaw security firewall", "autonomous browser security", "secure web agents", "browser automation guardrails"],
    openGraph: {
        title: "How to Secure Autonomous Browsers with OpenClaw",
        description: "Zero-trust browser governance for AI agents. Block destructive DOM actions before they hit the wire.",
    }
};

export default function OpenClawIntegrationPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for OpenClaw",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "url": "https://suprawall.com/integrations/openclaw",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "description": "The first security firewall for autonomous browsing agents and OpenClaw swarms.",
        "featureList": [
            "CDP-Level Action Interception",
            "Financial Transaction Kill-Switch",
            "Session Data Protection",
            "DOM Pattern Recognition"
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-12 space-y-10 relative z-10 text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase mx-auto">
                            Web Automation • OpenClaw Security
                        </div>

                        {/* H1: SPEC REQUIRED */}
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            Secure the <br />
                            <span className="text-emerald-500 text-7xl md:text-[10rem]">OpenClaw</span> <br />
                            Browser.
                        </h1>

                        {/* P1: GEO EXTRACTION TARGET - SPEC REQUIRED */}
                        <div className="max-w-3xl mx-auto">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                OpenClaw security firewall integration is mandatory for agents operating in authenticated web environments.
                                By sitting between the agent and the browser instance, developers can prevent agents from leaking
                                session cookies, accessing sensitive local storage data, or performing unauthorized financial
                                transactions on production websites.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 pt-8">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-2">
                                Start Secure Browsing <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-12">
                        <div className="max-w-4xl mx-auto prose prose-invert prose-emerald">

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                Beyond Simple XPath blocking
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6">
                                Traditional web security relies on URL filters. Autonomous agents require something deeper.
                                SupraWall's <Link href="/learn/what-is-agent-runtime-security" className="text-emerald-500 underline">runtime security</Link>
                                for OpenClaw analyzes the *context* of a click. If an agent tries to click "Transfer Funds" but the
                                prompt intent was only to "Check Balance", the action is blocked instantly at the browser layer.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                {benefits.map((b, i) => (
                                    <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900 border border-white/5 space-y-4">
                                        <b.icon className="w-8 h-8 text-emerald-500 mb-2" />
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{b.title}</h3>
                                        <p className="text-neutral-500 text-xs leading-relaxed uppercase tracking-widest font-bold">{b.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                Session Data Protection
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6">
                                Browsers are playgrounds for data leakage. An agent instructed to "Extract data" could
                                maliciously or accidentally scrape its own `localStorage` which might contain API keys or auth tokens.
                                SupraWall's sandbox ensures the agent only "sees" the part of the DOM it needs to perform its job.
                            </p>

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10">
                                Integration Guide
                            </h2>
                            <div className="space-y-4">
                                {[
                                    "Initialize the @suprawall/claw package",
                                    "Wrapp your Playwright/Puppeteer browser instance",
                                    "Define 'No-Write' or 'Read-Only' zones for specific domains",
                                    "Enable Step-by-Step navigation verification",
                                    "Configure session-based audit logs for every DOM interaction"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        <span className="text-sm font-bold uppercase tracking-tight text-neutral-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client Side Content */}
                <OpenClawClient />

                {/* Call to Action: SPEC COMPLIANT */}
                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-emerald-600 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-emerald-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Ready to secure <br />your browser agents?
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1">
                                Secure My Browser
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const benefits = [
    { title: "DOM Shield", desc: "Monitors and blocks dangerous DOM actions based on context.", icon: Search },
    { title: "Session Guard", desc: "Prevents exfiltration of cookies and local storage data.", icon: Shield },
    { title: "Action Kill-Switch", desc: "Immediate blocking of sensitive clicks (e.g., Delete, Buy).", icon: Zap },
    { title: "Visual Audit", desc: "Interactive logs showing exactly where the agent clicked and why.", icon: Eye }
];
