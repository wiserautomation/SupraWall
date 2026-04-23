// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { sendGAEvent } from "@next/third-parties/google";
import {
    ArrowRight, Lock, Activity, CheckCircle2,
    Shield, Database, Code2, AlertTriangle,
    Users, DollarSign,
    Zap, Layers, Triangle, Coins, FileText,
    LayoutDashboard, Cpu, Network, Github
} from "lucide-react";
import Link from "next/link";
import { SwarmVisualization, TechTabs, TagBadge, AttackDemo, LiveSavings, ThreatCardsGrid, ICPEntryPoints, ComplianceTemplatesSection } from "./HomeClient";

export default function LandingPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "SupraWall",
        "url": "https://www.supra-wall.com",
        "description": "Deterministic security and EU AI Act compliance for autonomous AI agents. Vault, Budget Limits, Policy Engine, PII Shield, Audit Trail, and Prompt Injection Protection.",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "author": {
            "@type": "Organization",
            "name": "SupraWall"
        },
        "featureList": [
            "Credential Vault — Zero-knowledge secret injection",
            "Budget Limits — Hard caps and circuit breakers",
            "Policy Engine — Deterministic ALLOW/BLOCK rules",
            "PII Shield — Automatic outbound data scrubbing",
            "Audit Trail — EU AI Act evidence reports",
            "Prompt Injection Shield — SDK-level enforcement",
            "AI Semantic Analysis — LLM-powered contextual threat detection"
        ]
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How does SupraWall secure AI agents?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SupraWall acts as a deterministic firewall that intercepts every tool call your agent attempts to execute. It evaluates these calls against hard-coded security policies to prevent unauthorized actions like data exfiltration or system deletions."
                }
            },
            {
                "@type": "Question",
                "name": "What seven threats does SupraWall protect against?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SupraWall protects against credential theft (Vault), runaway costs (Budget Limits), unauthorized actions (Policy Engine), data leakage (PII Shield), missing audit trails (Compliance Reports), prompt injection attacks (Injection Shield), and context-dependent attacks (AI Semantic Layer)."
                }
            },
            {
                "@type": "Question",
                "name": "What is SupraWall's two-layer defense architecture?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "SupraWall runs deterministic regex rules first (Layer 1, <2ms) to catch known threats with zero false negatives. Calls that pass Layer 1 are optionally analyzed by an AI semantic layer (Layer 2) that detects context-dependent attacks, unusual argument combinations, and behavioral anomalies. Layer 2 is available on Team tier and above."
                }
            },
            {
                "@type": "Question",
                "name": "Does SupraWall help with EU AI Act compliance?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, SupraWall specifically targets Articles 9, 11, 12, and 14 of the EU AI Act by providing deterministic risk management, automatic logging, technical documentation, and human-in-the-loop oversight controls."
                }
            },
            {
                "@type": "Question",
                "name": "Is SupraWall available on AWS Marketplace?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, SupraWall is an official AWS Marketplace Guardrail provider. You can subscribe via SaaS or deploy via Container (VPC/EKS) with integrated AWS billing and entitlements."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#000000] text-neutral-200 font-sans selection:bg-emerald-500/30 selection:text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Navbar />

            <main className="overflow-hidden">

                {/* 🚀 HERO — Keep headline, fix subheadline */}
                <section className="relative pt-48 pb-32 px-6">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] opacity-20 pointer-events-none">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-emerald-600/30 blur-[180px] rounded-full" />
                    </div>

                    <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-12 relative z-10">
                        <div className="animate-fade-in inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase">
                            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 mr-3 animate-pulse"></span>
                            Open-Source Agent Security Platform
                        </div>

                        <div className="space-y-8">
                            <h1 className="text-6xl md:text-[90px] font-black tracking-tighter text-white leading-[0.85] uppercase italic text-glow filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                Protected in 30 seconds. <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Enterprise-ready</span> <br />
                                <span className="underline decoration-emerald-800">when you are.</span>
                            </h1>

                            {/* NEW SUBHEADLINE — Lists all 6 capabilities */}
                            <p className="text-xl md:text-2xl text-neutral-400 max-w-5xl mx-auto leading-relaxed font-medium mt-6">
                                <span className="text-white font-bold">Vault</span> credentials.{' '}
                                <span className="text-white font-bold">Cap</span> budgets.{' '}
                                <span className="text-white font-bold">Block</span> unauthorized actions.{' '}
                                <span className="text-white font-bold">Scrub</span> PII.{' '}
                                <span className="text-white font-bold">Generate</span> audit trails.{' '}
                                <span className="text-white font-bold">Stop</span> prompt injections.{' '}
                                <span className="text-white font-bold">Analyze</span> context with AI.{' '}
                                <br className="hidden md:block" />
                                <span className="text-emerald-400 italic">Open source. One command. Seven threats neutralized.</span>
                            </p>

                            {/* THE COMMAND - The new primary CTA */}
                            <div className="flex flex-col items-center gap-4 pt-10 pb-4 w-full">
                                <div 
                                    className="group relative flex items-center justify-between w-full max-w-2xl px-8 py-6 bg-[#0a0a0a] border-2 border-white/20 rounded-3xl shadow-[0_20px_100px_rgba(16,185,129,0.3)] hover:border-emerald-500 transition-all font-mono text-emerald-400 text-2xl md:text-3xl cursor-copy transform hover:scale-[1.02]" 
                                    onClick={() => navigator.clipboard.writeText('npx suprawall init')}
                                    title="Click to copy"
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-neutral-500 select-none">❯</span>
                                        <span className="text-white font-bold tracking-tight">npx suprawall init</span>
                                    </div>
                                    <span className="text-xs text-neutral-400 uppercase tracking-[0.3em] font-sans font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">Copy</span>
                                </div>
                                <p className="text-xs md:text-sm text-neutral-400 uppercase tracking-[0.2em] font-bold mt-2">
                                    No account required · Works with LangChain, CrewAI, AutoGen, MCP
                                </p>
                            </div>

                            {/* SECONDARY CTA */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 pt-6">
                                <Link
                                    id="cta-deploy-cloud"
                                    href="/login"
                                    onClick={() => sendGAEvent('event', 'hero_cta_click', { type: 'deploy_cloud' })}
                                    className="px-10 py-5 bg-white text-black font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-emerald-500 hover:text-white transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] flex items-center gap-3"
                                >
                                    Get Beta Access <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link
                                    id="cta-star-github"
                                    href="https://github.com/wiserautomation/SupraWall"
                                    target="_blank"
                                    onClick={() => sendGAEvent('event', 'hero_cta_click', { type: 'star_github' })}
                                    className="px-10 py-5 border-2 border-white/10 text-white font-black uppercase tracking-tighter text-xl rounded-2xl hover:bg-white/5 transition-all flex items-center gap-3"
                                >
                                    <Github className="w-5 h-5" /> Star on GitHub
                                </Link>
                            </div>
              </div>

                        <div className="pt-12 flex flex-col items-center gap-6">
                            <div className="flex flex-wrap items-center justify-center gap-8 opacity-80 transition-all">
                                <div className="flex items-center gap-2">
                                     <Users className="w-4 h-4 text-emerald-500" />
                                     <span className="text-[10px] font-black uppercase tracking-widest text-white">Private Beta — 47 Teams Waiting</span>
                                </div>
                                <div className="flex items-center gap-2">
                                     <Activity className="w-4 h-4 text-blue-500" />
                                     <span className="text-[10px] font-black uppercase tracking-widest text-white">Design Partners: Fintech & HealthTech</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Apache 2.0</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">EU AI Act Ready</span>
                                </div>
                            </div>
                            <p className="text-[11px] font-medium text-neutral-500 uppercase tracking-[0.3em] text-center max-w-2xl px-6 leading-relaxed">
                                Securely used with <span className="text-white">LangChain, CrewAI, AutoGen, and Vercel AI</span> in production environments worldwide.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 🚨 PROBLEM BAR — All 6 threats */}
                <section className="py-6 bg-rose-950/20 border-y border-rose-500/20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="flex items-center gap-4 text-rose-400">
                            <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
                            <p className="text-xs font-black uppercase tracking-widest"><span className="text-white">CREDENTIAL THEFT</span> — Agents see your API keys in plaintext</p>
                        </div>
                        <div className="flex items-center gap-4 text-rose-400">
                            <DollarSign className="w-5 h-5 flex-shrink-0 animate-pulse" />
                            <p className="text-xs font-black uppercase tracking-widest"><span className="text-white">RUNAWAY COSTS</span> — $4,000 overnight from infinite loops</p>
                        </div>
                        <div className="flex items-center gap-4 text-rose-400">
                            <FileText className="w-5 h-5 flex-shrink-0 animate-pulse" />
                            <p className="text-xs font-black uppercase tracking-widest"><span className="text-white">EU AI ACT</span> — Zero evidence for auditors</p>
                        </div>
                    </div>
                </section>

                {/* 💰 LIVE SAVINGS WIDGET */}
                <section className="bg-black border-b border-white/5">
                    <div className="max-w-7xl mx-auto px-6">
                        <LiveSavings />
                    </div>
                </section>

                {/* 🎯 SIX THREAT CARDS — The centerpiece */}
                <section id="threats" className="py-40 px-6 bg-black relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-emerald-500/[0.03] blur-[150px] rounded-full pointer-events-none" />
                    
                    <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                        <div className="text-center space-y-6">
                            <TagBadge>6 Threats. 6 Solutions. 1 Platform.</TagBadge>
                            <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase text-glow">
                                Every Threat Your Agent <br />
                                <span className="text-emerald-500 font-bold">Doesn&apos;t Know It Has.</span>
                            </h2>
                            <p className="text-xl text-neutral-500 font-medium max-w-3xl mx-auto italic">
                                Hover to see the fix. Click to see the full solution. Each is an independent reason you need SupraWall.
                            </p>
                        </div>

                        <ThreatCardsGrid />
                    </div>
                </section>

                {/* 🔥 LIVE ATTACK DEMO */}
                <section className="py-40 px-6 bg-[#030303] border-y border-white/5">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-8">
                            <TagBadge>Live Interception</TagBadge>
                            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.8] uppercase text-glow">
                                Watch an Attack <br />
                                <span className="text-emerald-500 font-bold">Get Stopped.</span>
                            </h2>
                            <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic">
                                A hidden prompt injection in a search result tries to exfiltrate your environment variables. SupraWall intercepts the tool call, blocks the exfiltration, and logs the attempt — all in <span className="text-white font-bold">1.2ms</span>.
                            </p>
                            <p className="text-lg text-neutral-500 font-medium leading-relaxed">
                                This is <span className="text-white font-bold">deterministic</span> security. Not &ldquo;advisory&rdquo;. Not &ldquo;best-effort&rdquo;. The policy engine operates <span className="text-white font-bold">outside the LLM context</span> — no prompt can override it.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="absolute -inset-10 bg-emerald-500/5 blur-[80px] rounded-full" />
                            <AttackDemo />
                        </div>
                    </div>
                </section>

                {/* 🏷️ COMPLIANCE TEMPLATES — Proof point */}
                <ComplianceTemplatesSection />

                {/* ⚙️ HOW IT WORKS */}
                <section id="how-it-works" className="py-40 px-6 bg-black">
                    <div className="max-w-7xl mx-auto space-y-24">
                        <div className="text-center space-y-4">
                            <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter">How SupraWall <span className="text-emerald-500 font-bold">Shields</span> Your Swarm.</h3>
                            <p className="text-xl text-neutral-500 font-bold uppercase tracking-widest">A deterministic middle-layer for the agentic future.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {[
                                { step: "01", title: "Intercept", desc: "Every tool call your agent fires is caught by SupraWall before it hits your database, API, or filesystem.", icon: <Network className="w-8 h-8" /> },
                                { step: "02", title: "Evaluate", desc: "Checks the payload against your hard-coded policy engine. ALLOW, BLOCK, or REQUIRE_APPROVAL — outside the LLM context.", icon: <Shield className="w-8 h-8" /> },
                                { step: "03", title: "Enforce", desc: "Blocked calls return a structured error back to your agent, forcing it to self-correct. You get a signed audit log.", icon: <Zap className="w-8 h-8" /> }
                            ].map((s, idx) => (
                                <div key={idx} className="p-12 rounded-[3.5rem] bg-neutral-900/40 border border-white/5 space-y-8 hover:border-emerald-500/30 transition-all group">
                                    <div className="flex items-center justify-between">
                                        <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
                                            {s.icon}
                                        </div>
                                        <span className="text-4xl font-black text-white/10 italic leading-none">{s.step}</span>
                                    </div>
                                    <h4 className="text-3xl font-black italic uppercase text-white">{s.title}</h4>
                                    <p className="text-neutral-500 font-bold leading-relaxed italic uppercase tracking-tight text-xs">{s.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="pt-20">
                            <TechTabs />
                        </div>
                    </div>
                </section>

                {/* 👤 ICP ENTRY POINTS */}
                <section className="py-40 px-6 bg-[#030303] border-y border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/[0.03] blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                        <div className="text-center space-y-6">
                            <TagBadge>Built for Your Role</TagBadge>
                            <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
                                Different Pain. <br />
                                <span className="text-emerald-500 font-bold">Same Platform.</span>
                            </h2>
                            <p className="text-xl text-neutral-500 font-medium max-w-3xl mx-auto">
                                Whether you&apos;re writing the code, managing the team, or proving compliance — SupraWall is your first stop.
                            </p>
                        </div>

                        <ICPEntryPoints />
                    </div>
                </section>

                {/* 🏆 GRAND SLAM: 6-IN-1 COMPARISON */}
                <section className="py-40 px-6 bg-black relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />
                    <div className="max-w-7xl mx-auto space-y-24 relative z-10">
                        <div className="text-center space-y-6">
                            <TagBadge>The Grand Slam Offer</TagBadge>
                            <h2 className="text-6xl md:text-[10rem] font-black italic tracking-tighter leading-[0.8] uppercase text-glow">
                                Replace 6 tools <br />
                                <span className="text-emerald-500 underline decoration-white/10 font-bold italic">with 1 line of code.</span>
                            </h2>
                            <p className="text-2xl text-neutral-400 font-bold uppercase tracking-widest italic max-w-4xl mx-auto">
                                Every other tool handles one piece. You need six tools, six integrations, six invoices, and six dashboards. <br />
                                <span className="text-white">Or you need SupraWall.</span>
                            </p>
                        </div>

                        <div className="overflow-x-auto rounded-[3.5rem] border border-white/5 bg-neutral-900/20 backdrop-blur-3xl p-1 md:p-8">
                            <table className="w-full text-left border-separate border-spacing-0">
                                <thead>
                                    <tr>
                                        <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-neutral-500 italic">Core Capability</th>
                                        <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-neutral-500 italic text-center">Legacy Fragmented Stack</th>
                                        <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500 italic text-center bg-emerald-500/5 rounded-t-[2.5rem]">SupraWall Unified Stack</th>
                                    </tr>
                                </thead>
                                <tbody className="text-lg font-bold">
                                    {[
                                        { cap: "Credential Vault", stack: "HashiCorp Vault ($$$)", supra: "✅ Included" },
                                        { cap: "Budget Controls", stack: "Custom scripts", supra: "✅ Included" },
                                        { cap: "Policy Engine", stack: "Guardrails AI (Self-host)", supra: "✅ Included" },
                                        { cap: "PII Shield", stack: "Microsoft Presidio (DIY)", supra: "✅ Included" },
                                        { cap: "Audit Trail", stack: "Credo AI ($$$$/mo)", supra: "✅ Included" },
                                        { cap: "Injection Shield", stack: "Lakera ($?/mo)", supra: "✅ Included" }
                                    ].map((row, i) => (
                                        <tr key={i} className="group">
                                            <td className="p-8 border-t border-white/5 text-white/80 group-hover:text-white transition-colors uppercase italic tracking-tighter">{row.cap}</td>
                                            <td className="p-8 border-t border-white/5 text-neutral-500 text-center uppercase text-sm font-black italic line-through opacity-40">{row.stack}</td>
                                            <td className={`p-8 border-t border-white/5 text-emerald-500 text-center font-black italic tracking-widest bg-emerald-500/5 ${i === 5 ? 'rounded-b-[2.5rem]' : ''}`}>
                                                {row.supra}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="p-10 text-neutral-500 text-xs font-black uppercase tracking-[0.2em] italic">The Integration Tax</td>
                                        <td className="p-10 text-rose-500 text-center text-xl font-black italic uppercase tracking-tighter">6 integrations, 6 bills, 6 dashboards</td>
                                        <td className="p-10 bg-emerald-600 text-white text-center text-2xl font-black italic uppercase tracking-tighter rounded-[2.5rem] shadow-[0_20px_50px_rgba(5,150,105,0.3)] border-2 border-emerald-400/50 scale-105">
                                            1 line of code, 1 dashboard, pay per op.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* 📊 EU AI ACT COMPLIANCE */}
                <section className="py-40 px-6 bg-gradient-to-b from-black to-[#050505]">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className="space-y-10 order-2 lg:order-1">
                            <div className="h-[400px] rounded-[3rem] bg-[#0A0A0A] border-2 border-white/10 p-12 relative overflow-hidden group shadow-2xl">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <FileText className="w-64 h-64" />
                                </div>
                                <div className="space-y-6 relative z-10">
                                    <div className="flex items-center gap-3 text-emerald-500">
                                        <Shield className="w-8 h-8" />
                                        <span className="font-black uppercase tracking-widest">Agent Action Log v1.0</span>
                                    </div>
                                    <div className="h-px w-full bg-white/10" />
                                    <h5 className="text-3xl font-black italic uppercase leading-none text-white">EU AI Act <br />Evidence Export</h5>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                            <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Article 09 - Risk Mgmt</span>
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                            <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Article 12 - Automatic Logging</span>
                                            <CheckCircle2 className="w-4 h-4 text-amber-500" />
                                        </div>
                                        <div className="flex items-center justify-between p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                            <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">Article 14 - Human Oversight</span>
                                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-8 order-1 lg:order-2">
                            <TagBadge>EU AI Act Compliance</TagBadge>
                            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.85] uppercase text-glow">
                                Stop dreading <br />
                                <span className="text-emerald-500 italic">the audit.</span>
                            </h2>
                            <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic">
                                SupraWall doesn&apos;t just protect your agents — it documents that protection in the format regulators expect. Every policy decision is signed, timestamped, and exportable for legal review.
                            </p>
                            <ul className="space-y-4 pt-4">
                                {[
                                    { art: "Art. 9", label: "Risk management system" },
                                    { art: "Art. 12", label: "Automatic Record-Keeping" },
                                    { art: "Art. 14", label: "Human oversight controls" }
                                ].map((a, i) => (
                                    <li key={i} className="flex items-center gap-4 text-xl font-bold uppercase italic group">
                                        <span className="text-emerald-500 font-black group-hover:translate-x-1 transition-transform">{a.art} —</span>
                                        <span className="text-white">{a.label}</span>
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500/50" />
                                    </li>
                                ))}
                            </ul>
                            <Link href="/login" className="inline-flex items-center gap-3 text-emerald-500 font-black uppercase tracking-widest text-sm hover:text-emerald-400 transition-colors pt-4">
                                See Audit Trail Features <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 🔧 TECH ECOSYSTEM */}
                <section className="py-20 border-y border-white/5 bg-[#020202]">
                    <div className="max-w-7xl mx-auto px-6 space-y-12">
                        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.5em] text-center italic">One command to secure any stack</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-10 items-center justify-center opacity-40 hover:opacity-100 transition-opacity">
                            {['Python', 'TypeScript', 'LangChain', 'CrewAI', 'AutoGen', 'Vercel AI', 'AWS Marketplace', 'MCP'].map((tech) => (
                                <div key={tech} className="text-sm font-black text-white italic text-center uppercase tracking-widest">{tech}</div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 💰 PRICING PREVIEW */}
                <section id="pricing" className="py-40 px-6 bg-black relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="max-w-7xl mx-auto space-y-24 relative z-10">
                        <div className="text-center space-y-6">
                            <h3 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">Free to start. <br />Professional in <span className="text-emerald-500">scale.</span></h3>
                            <div className="inline-flex flex-col items-center">
                                <p className="text-2xl text-neutral-500 font-black italic uppercase tracking-tighter">Pay per evaluation. Never per feature.</p>
                                <div className="h-0.5 w-32 bg-emerald-500 mt-2" />
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            <div className="space-y-4">
                                {[
                                    { label: "0 – 10K / Month", price: "Always Free", highlight: true },
                                    { label: "10K – 500K", price: "$0.002 / eval" },
                                    { label: "500K – 2M", price: "$0.0015 / eval" },
                                    { label: "2M – 10M", price: "$0.001 / eval" },
                                    { label: "10M+", price: "$0.0005 / eval" }
                                ].map((tier, i) => (
                                    <div key={i} className={`flex justify-between items-center p-8 rounded-[2rem] border transition-all group ${tier.highlight ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-neutral-900/30 border-white/5 hover:border-emerald-500/30'}`}>
                                        <span className={`text-lg font-black italic uppercase tracking-tighter ${tier.highlight ? 'text-white' : 'text-neutral-500 group-hover:text-white'}`}>{tier.label}</span>
                                        <span className={`text-xl font-black italic ${tier.highlight ? 'text-emerald-400' : 'text-emerald-500'}`}>{tier.price}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-12 rounded-[3.5rem] bg-neutral-900 border border-white/5 space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-3xl font-black italic uppercase tracking-tighter">Everything Included.</h4>
                                    <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs leading-relaxed italic">
                                        We don&apos;t gate security. Whether you&apos;re running 1 agent or 1,000, you get full access to all six pillars from day one.
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    {["Credential Vault", "Budget Limits", "Policy Engine", "PII Shield", "Audit Trail", "Injection Shield"].map((f, i) => (
                                        <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                            <CheckCircle2 className="w-4 h-4" />
                                            {f}
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-8 border-t border-white/5 space-y-6">
                                    <Link
                                        href="/login"
                                        className="w-full py-6 bg-emerald-600 text-white text-center font-black uppercase tracking-tighter text-2xl rounded-2xl hover:bg-emerald-500 transition-all block"
                                    >
                                        Calculate Your ROI →
                                    </Link>
                                    
                                    <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-colors">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-1">Corporate & Enterprise</p>
                                            <p className="text-white font-black uppercase italic text-lg leading-none">Operational Layer</p>
                                            <p className="text-neutral-500 text-[10px] mt-2 font-bold uppercase tracking-widest">SSO • SLA • Self-Hosted • support</p>
                                        </div>
                                        <Link href="/login" className="p-4 bg-blue-500/10 rounded-xl text-blue-500 hover:scale-110 transition-transform">
                                            <ArrowRight className="w-6 h-6" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 🎯 FINAL CTA */}
                <section className="py-48 px-6 bg-black relative text-center">
                    <div className="absolute inset-0 bg-emerald-500/10 blur-[150px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] pointer-events-none" />
                    <div className="max-w-4xl mx-auto space-y-12 relative z-10">
                        <TagBadge>Join the Guardians</TagBadge>
                        <h2 className="text-7xl md:text-[9rem] font-black uppercase italic leading-[0.8] tracking-tighter text-glow">
                            Is Your Agent <br />
                            <span className="text-emerald-500 underline decoration-white/20 font-bold italic">SAFE?</span>
                        </h2>
                        <p className="text-2xl text-neutral-400 font-medium leading-relaxed italic max-w-2xl mx-auto">
                            Vault your credentials. Cap your budgets. Block unauthorized actions. Generate audit trails. All in one command. Forever free for indie developers.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                            <Link 
                                href="/login" 
                                onClick={() => sendGAEvent('event', 'final_cta_click', { type: 'unlock_api_key' })}
                                className="px-16 py-8 bg-emerald-600 text-white font-black text-3xl rounded-[2.5rem] hover:bg-emerald-500 transition-all shadow-[0_0_100px_rgba(16,185,129,0.3)] animate-pulse tracking-tighter flex items-center gap-4 group"
                            >
                                JOIN THE WAITLIST <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform" />
                            </Link>
                            <Link href="/docs" className="text-white font-black uppercase tracking-[0.3em] text-sm hover:text-emerald-400 transition-colors underline decoration-white/10 underline-offset-8">
                                READ THE DOCS
                            </Link>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </div>
    );
}
