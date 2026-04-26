// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { ArrowRight, Globe, Shield, Zap, Terminal, Box, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import VercelClient from "./VercelClient";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";
import { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        internalPath: 'integrations/vercel',
        title: "Vercel AI SDK Security & Runtime Interception | SupraWall",
        description: "Secure your Next.js AI agents with SupraWall. Zero-trust governance for the Vercel AI SDK. Block unauthorized tool calls at the edge with sub-1ms latency.",
        keywords: ["vercel ai sdk security", "secure nextjs agents", "ai sdk tool governance", "edge runtime security"],
    });
}

export default async function VercelIntegrationPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    const softwareAppSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for Vercel AI SDK",
        "inLanguage": lang,
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "url": `https://www.supra-wall.com/${lang}/integrations/vercel`,
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "description": "Secure edge-based agentic workflows built with the Vercel AI SDK and Next.js.",
        "featureList": [
            "Edge Runtime Policy Enforcement",
            "Streaming Tool Interception",
            "Zero-Latency Content Verification",
            "TypeScript Native Security Wrappers"
        ]
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "inLanguage": lang,
        "name": "How to secure Vercel AI SDK agents",
        "description": "Step-by-step guide to securing your Next.js AI agents using SupraWall edge-native shim.",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Install the SDK",
                "text": "Run 'npm install @suprawall/vercel-ai' in your project directory."
            },
            {
                "@type": "HowToStep",
                "name": "Initialize the protector",
                "text": "Import and initialize the SupraWall client in your Next.js API route using your API key."
            },
            {
                "@type": "HowToStep",
                "name": "Wrap your tools",
                "text": "Wrap your Vercel AI SDK tools object with the 'protect' helper to enable runtime interception."
            },
            {
                "@type": "HowToStep",
                "name": "Deploy and monitor",
                "text": "Deploy to Vercel and monitor tool call telemetry in the SupraWall dashboard."
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 font-sans">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            <Navbar lang={lang} dictionary={dictionary} />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                    <div className="lg:col-span-12 space-y-10 relative z-10 text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase mx-auto">
                            Infrastructure • Vercel AI SDK Official
                        </div>

                        {/* H1: SPEC REQUIRED */}
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            Secure the <br />
                            <span className="text-blue-500 text-7xl md:text-[10rem]">Edge</span> <br />
                            Runtime.
                        </h1>

                        {/* P1: GEO EXTRACTION TARGET - SPEC REQUIRED */}
                        <div className="max-w-3xl mx-auto">
                            <p className="text-2xl text-neutral-300 leading-snug font-medium italic">
                                Securing Vercel AI SDK agents is paramount for building production-ready AI applications on Next.js.
                                By deploying the SupraWall edge shim, developers can intercept tool calls from `streamText` and `generateText`
                                in real-time, enforcing security policies at the edge before any backend systems are accessed.
                            </p>
                        </div>

                        <div className="flex justify-center gap-6 pt-8">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-2">
                                Secure My App <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-12">
                        <div className="max-w-4xl mx-auto prose prose-invert prose-blue">

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                Zero-Latency Interception
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6">
                                Vercel apps thrive on speed. The SupraWall <Link href="/learn/what-is-agent-runtime-security" className="text-blue-500 underline">runtime security layer</Link>
                                is optimized for the Edge Runtime. By pre-compiling security policies into a highly efficient decision engine,
                                we verify tool parameters (like `send_email` recipients or `database_query` complexity) in under 1ms.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-16">
                                {benefits.map((b, i) => (
                                    <div key={i} className="p-10 rounded-[2.5rem] bg-neutral-900 border border-white/5 space-y-4">
                                        <b.icon className="w-8 h-8 text-blue-500 mb-2" />
                                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{b.title}</h3>
                                        <p className="text-neutral-500 text-xs leading-relaxed uppercase tracking-widest font-bold">{b.desc}</p>
                                    </div>
                                ))}
                            </div>

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24">
                                Streaming Security
                            </h2>
                            <p className="text-lg text-neutral-400 mt-6">
                                The Vercel AI SDK relies on streaming for superior UX. Traditional firewalls wait for the full response.
                                SupraWall works within the stream, allowing you to stop execution mid-sentence if the agent attempts
                                to "leak" its own system prompt or access tools it shouldn't.
                            </p>

                            {/* H2: SPEC REQUIRED */}
                            <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10">
                                Implementation Checklist
                            </h2>
                            <div className="space-y-4">
                                {[
                                    "npm install @suprawall/vercel-ai",
                                    "Initialize the protector in your Next.js API route",
                                    "Wrap your tools object with the 'protect' helper",
                                    "Configure Edge Middleware for global budget caps",
                                    "Enable real-time telemetry into the SupraWall Dashboard"
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm font-bold uppercase tracking-tight text-neutral-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client Side Content */}
                <VercelClient />

                {/* Call to Action: SPEC COMPLIANT */}
                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-blue-600 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-900 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Ready to secure <br />your Vercel stack?
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1">
                                Secure My App
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const benefits = [
    { title: "Edge Native", desc: "Built for Vercel Edge Runtime and optimized for sub-1ms execution.", icon: Globe },
    { title: "Stream Guard", desc: "Real-time monitoring of AI SDK streams for emergent security threats.", icon: Zap },
    { title: "Type Safe", desc: "First-class support for TypeScript and the Vercel AI SDK 'tool' interface.", icon: Box },
    { title: "Cold Start Ready", desc: "Zero weight implementation that doesn't bloat your Lambda/Edge functions.", icon: ShieldCheck }
];
