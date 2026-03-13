import { Navbar } from "@/components/Navbar";
import { ArrowRight, Monitor, Shield, Zap, Search, Eye, CheckCircle2, FileText } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import OpenClawClient from "./OpenClawClient";

export const metadata: Metadata = {
    title: "OpenClaw Security Firewall | Autonomous Browser Protection",
    description: "Secure OpenClaw agents and autonomous browsers. Prevent session leakage and maintain EU AI Act compliance with the first browser-level agent firewall.",
    keywords: ["openclaw security firewall", "autonomous browser security", "secure web agents", "browser automation guardrails", "eu ai act web agents"],
};

export default function OpenClawIntegrationPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for OpenClaw",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "url": "https://www.suprawall.ai/integrations/openclaw",
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

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How do you secure autonomous browsers like OpenClaw?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SupraWall sits at the CDP (Chrome DevTools Protocol) level. We intercept click and type events before they reach the browser's execution engine, evaluating them against security policies to prevent unauthorized actions."
                }
            },
            {
                "@type": "Question",
                "name": "Can SupraWall prevent agents from clicking 'Delete' or 'Buy'?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Every DOM interaction is verified. If an agent attempts to click a button that leads to a sensitive state (like a purchase or deletion) without a matching policy permission, the action is blocked instantly."
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

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-12 space-y-10 relative z-10 text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase mx-auto">
                            Web Automation • OpenClaw Security
                        </div>

                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            Secure the <br />
                            <span className="text-emerald-500 text-7xl md:text-[10rem]">OpenClaw</span> <br />
                            Browser.
                        </h1>

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

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                Beyond Simple XPath Blocking
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6 font-medium leading-relaxed">
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

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                Session Data & Cookie Protection
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6 font-medium leading-relaxed">
                                Browsers are playgrounds for data leakage. An agent instructed to "Extract data" could
                                maliciously or accidentally scrape its own `localStorage` which might contain API keys or auth tokens.
                                SupraWall's sandbox ensures the agent only "sees" the part of the DOM it needs to perform its job, hiding sensitive headers and session data.
                            </p>

                            <div className="my-16 p-10 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 space-y-8">
                                <div className="flex items-center gap-4 text-emerald-400">
                                    <FileText className="w-8 h-8" />
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight">EU AI Act Compliance</h3>
                                </div>
                                <p className="text-neutral-300 font-medium italic">
                                    Web agents often handle PII (Personally Identifiable Information). Under the EU AI Act, this requires documented and automated <span className="text-emerald-400">Auditability (Article 12)</span> and session-level human-in-the-loop protocols. SupraWall provides the logging and approval framework for web automation compliance.
                                </p>
                            </div>

                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10">
                                Integration Guide
                            </h2>
                            <div className="space-y-4">
                                {[
                                    "Initialize the @suprawall/claw package",
                                    "Wrap your Playwright/Puppeteer browser instance",
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

                <OpenClawClient />

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
