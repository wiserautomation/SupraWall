// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { ArrowRight, Code2, Shield, Zap, Paperclip, Terminal, CheckCircle2, FileText, Globe } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";
import { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        internalPath: 'integrations/paperclip',
        title: "Security for Paperclip AI Agents | Credential Vault | SupraWall",
        description: "Secure your Paperclip agent fleets with role-based policies and a hardware-grade credential vault. Prevent raw API key leakage and rogue tool execution.",
        keywords: ["paperclip security", "secure paperclip", "ai agent vault", "agentic tool policy", "multi-agent security"],
    });
}

export default async function PaperclipIntegrationPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    const softwareAppSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for Paperclip",
        "inLanguage": lang,
        "applicationCategory": "SecurityApplication",
        "url": `https://www.supra-wall.com/${lang}/integrations/paperclip`,
        "author": { "@type": "Organization", "name": "SupraWall" },
        "description": "Enterprise security and automated credential vault for Paperclip AI agent fleets."
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
            <Navbar lang={lang} dictionary={dictionary} />

            <main className="pt-40 pb-32 px-6">
                <div className="max-w-7xl mx-auto space-y-24">
                    
                    {/* Hero */}
                    <div className="text-center space-y-10 group">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase">
                            Fleet Governance • Paperclip
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            Secure <br />
                            <span className="text-emerald-500 group-hover:text-emerald-400 transition-colors">Paperclip</span> <br />
                            Fleets
                        </h1>
                        <p className="text-2xl text-neutral-400 max-w-3xl mx-auto font-medium italic">
                            Zero-trust credential vault for autonomous agent companies. No more raw API keys in environment variables.
                        </p>
                    </div>

                    {/* Quick Install */}
                    <div className="max-w-4xl mx-auto space-y-8">
                         <div className="flex items-center gap-4 border-l-4 border-emerald-500 pl-6 h-12">
                             <h2 className="text-3xl font-black uppercase italic">One-Line Install</h2>
                         </div>
                         <div className="bg-neutral-900 rounded-[2.5rem] p-4 flex flex-col md:flex-row items-stretch md:items-center gap-4">
                             <div className="flex-1 p-6 bg-black rounded-3xl border border-white/5 font-mono text-emerald-400">
                                 paperclipai plugin install <span className="text-white">suprawall-vault</span>
                             </div>
                             <div className="flex gap-4">
                                 <Link href="https://github.com/wiserautomation/SupraWall" prefetch={false} rel="noopener noreferrer" target="_blank" className="p-6 bg-white text-black rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all flex items-center gap-2">
                                     GitHub <ArrowRight className="w-4 h-4" />
                                 </Link>
                                 <Link href="https://docs.supra-wall.com/paperclip" className="p-6 bg-white/5 border border-white/10 text-white rounded-3xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center gap-2">
                                     Guide
                                 </Link>
                             </div>
                         </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
                         {[
                             { title: "Vault Injection", desc: "Credentials are never stored in your repo. SupraWall injects them at the millisecond of execution and revokes them immediately after.", icon: Zap },
                             { title: "Role Isolation", desc: "Marketing agents get LinkedIn/Twitter; Engineering gets Submodule/Vercel. One compromised agent cannot leak the whole company.", icon: Shield },
                             { title: "Fleet Audit", desc: "Every credential access across your entire multi-agent company is logged in an immutable, tamper-proof audit trail.", icon: FileText }
                         ].map((f, i) => (
                             <div key={i} className="p-10 rounded-[3rem] bg-neutral-900 border border-white/5 space-y-4 hover:border-emerald-500/20 transition-all">
                                 <f.icon className="w-8 h-8 text-emerald-500" />
                                 <h4 className="text-white font-black uppercase tracking-tight text-lg italic">{f.title}</h4>
                                 <p className="text-neutral-500 font-medium leading-relaxed">{f.desc}</p>
                             </div>
                         ))}
                    </div>

                    {/* How it works */}
                    <div className="max-w-4xl mx-auto space-y-12 bg-neutral-900/50 p-16 rounded-[4rem] border border-white/5">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl font-black uppercase italic">Enterprise Lifecycle</h2>
                            <p className="text-neutral-500 font-bold uppercase tracking-tight">SupraWall syncs with the Paperclip hiring cycle automatically.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500 w-fit">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black uppercase italic">Agent Hired</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">SupraWall's webhook receives the 'agent.hired' event and automatically provisions a scoped policy based on the agent's role (CEO, Marketing, Finance).</p>
                            </div>
                            <div className="space-y-4">
                                <div className="p-3 bg-rose-500/10 rounded-xl text-rose-500 w-fit">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black uppercase italic">Agent Fired</h3>
                                <p className="text-neutral-500 text-sm leading-relaxed">When an agent is removed from your Paperclip org, SupraWall immediately revokes all issued tokens and wipes any cached credentials from the agent context.</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-20 p-20 rounded-[4rem] bg-emerald-600 text-center space-y-10 group">
                         <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-[0.85] group-hover:scale-105 transition-transform duration-700">
                             Secure Your <br />Company Today.
                         </h2>
                         <Link href="/activate" className="inline-flex px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all shadow-2xl">
                             Activate SupraWall Account
                         </Link>
                    </div>

                </div>
            </main>

            <footer className="py-20 border-t border-white/5 text-center">
                 <p className="text-neutral-800 text-[10px] font-black uppercase tracking-[0.5em]">
                    SupraWall × Paperclip • 2026
                 </p>
            </footer>
        </div>
    );
}
