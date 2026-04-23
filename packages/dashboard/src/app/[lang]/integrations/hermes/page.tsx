// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Navbar } from "@/components/Navbar";
import { ArrowRight, Shield, Zap, Terminal, CheckCircle2, Lock } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import { QuickSummaryTable } from "@/components/QuickSummaryTable";
import { HowToSchema } from "@/components/HowToSchema";

export const metadata: Metadata = {
    title: "Security for Hermes Agent | SupraWall",
    description: "Protect self-hosted Hermes Agent with deterministic ALLOW/DENY gating, PII scrubbing, credential vault, and budget caps — installed in one command.",
    keywords: ["hermes agent security", "nous research security", "hermes plugin suprawall", "autonomous agent security"],
    alternates: { canonical: "https://www.supra-wall.com/integrations/hermes" },
};

export default function HermesIntegrationPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "SupraWall for Hermes Agent",
        "applicationCategory": "SecurityApplication",
        "operatingSystem": "Any",
        "url": "https://www.supra-wall.com/integrations/hermes",
        "author": { "@type": "Organization", "name": "SupraWall" },
        "description": "Runtime security plugin for Hermes Agent. Intercepts every tool call with ALLOW/DENY policy enforcement, PII scrubbing, vault credential injection, and budget caps.",
    };

    const howToSteps = [
        { name: "Install the plugin", text: "Run pip install suprawall-hermes." },
        { name: "Enable in config", text: "Add suprawall-security to plugins.enabled in ~/.hermes/config.yaml." },
        { name: "Set API key", text: "Export SUPRAWALL_API_KEY=sw_your_key." },
        { name: "Restart Hermes", text: "Restart Hermes Agent. All tool calls are now gated." },
    ];

    const summaryRows = [
        { label: "What is it?", value: "A runtime security plugin for Hermes Agent (by Nous Research)." },
        { label: "Integration method", value: "Native Hermes plugin via pre_tool_call and post_tool_call hooks." },
        { label: "Install command", value: "pip install suprawall-hermes" },
        { label: "Fail mode", value: "Fail-closed by default. Blocks all tool calls if SupraWall is unreachable." },
        { label: "Setup time", value: "Under 2 minutes. One environment variable required." },
    ];

    const capabilities = [
        ["Pre-execution ALLOW/DENY", "pre_tool_call hook", "✅ Live"],
        ["Audit trails", "post_tool_call hook → JSONL", "✅ Live"],
        ["PII scrubbing", "post_tool_call result wrapper", "✅ Live"],
        ["Vault credential injection", "suprawall_vault_get tool", "✅ Live"],
        ["Budget caps", "BudgetTracker + post_tool_call", "✅ Live"],
        ["HITL approvals", "/suprawall command + dashboard", "✅ Live"],
        ["Bundled security skill", "suprawall:security-policy", "✅ Live"],
        ["Full inline interception", "Pre-execution hook (issue #7344)", "🔜 Upstream"],
    ];

    const checklist = [
        "Set SUPRAWALL_FAIL_MODE=fail-closed in production",
        "Configure SUPRAWALL_MAX_COST_USD to cap runaway agent spend",
        "Enable SUPRAWALL_LOOP_DETECTION to stop infinite tool loops",
        "Use suprawall_vault_get for all credentials — never pass keys in prompts",
        "Review /suprawall audit daily for unexpected tool call patterns",
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-violet-500/30 font-sans">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <HowToSchema name="How to secure Hermes Agent with SupraWall" description="Step-by-step guide to installing the SupraWall security plugin for Hermes Agent." steps={howToSteps} />
            <Navbar />

            <main className="pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* HERO */}
                    <div className="space-y-10 relative z-10 text-center mb-20">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-[10px] font-black text-violet-400 tracking-[0.2em] uppercase">
                            Self-Hosted Agent • Nous Research
                        </div>
                        <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase italic">
                            Security for <br />
                            <span className="text-violet-500 text-7xl md:text-[10rem]">Hermes</span> <br />
                            Agent
                        </h1>
                        <div className="max-w-4xl mx-auto space-y-12">
                            <p className="answer-first-paragraph text-2xl text-neutral-300 leading-snug font-medium border-l-8 border-violet-600 pl-8 py-4 italic text-left">
                                Hermes Agent gives your AI access to terminals, browsers, databases, and 40+ live tools.
                                SupraWall wraps every tool call with a deterministic ALLOW/DENY gate, PII scrubber, and credential vault —
                                all from a single plugin install. Your agent can&apos;t exfiltrate data, blow your budget, or go rogue without you knowing.
                            </p>
                            <QuickSummaryTable rows={summaryRows} />
                        </div>
                        <div className="flex justify-center gap-6 pt-8">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-200 transition-all flex items-center gap-2">
                                Secure My Agent <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/docs/frameworks/hermes" className="px-12 py-5 bg-violet-600/20 border border-violet-500/30 text-violet-400 font-black uppercase tracking-widest rounded-2xl hover:bg-violet-600/30 transition-all flex items-center gap-2">
                                Read the Docs <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        {/* INSTALL */}
                        <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10">One-Command Install</h2>
                        <p className="text-neutral-400 uppercase text-xs font-bold tracking-widest mb-6">Works on any Hermes Agent v0.3.0+ deployment</p>
                        <div className="bg-neutral-900 rounded-3xl p-8 border border-white/5 font-mono text-violet-400 shadow-2xl space-y-1">
                            <p className="text-neutral-500"># 1. Install the plugin</p>
                            <p>pip install <span className="text-white font-bold">suprawall-hermes</span></p>
                            <p className="text-neutral-500 mt-4"># 2. Enable in ~/.hermes/config.yaml</p>
                            <p className="text-white">plugins:</p>
                            <p className="text-white pl-4">enabled:</p>
                            <p className="pl-8">- <span className="text-white font-bold">suprawall-security</span></p>
                            <p className="text-neutral-500 mt-4"># 3. Set your key and restart</p>
                            <p>export <span className="text-white font-bold">SUPRAWALL_API_KEY</span>=sw_your_key_here</p>
                        </div>

                        {/* HOOKS */}
                        <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-8">Hook Architecture</h2>
                        <p className="text-lg text-neutral-400 font-medium leading-relaxed italic">
                            SupraWall registers two hooks directly into the Hermes plugin system. Every tool call passes through{" "}
                            <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">pre_tool_call</span> before execution and{" "}
                            <span className="text-white font-mono bg-white/5 px-2 py-0.5 rounded">post_tool_call</span> after.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 mb-20">
                            {[
                                { icon: Shield, title: "Pre-Execution Gate", desc: "Every tool call is evaluated against your ALLOW/DENY policies before any compute is consumed." },
                                { icon: Terminal, title: "Terminal & Browser Tools", desc: "Blocks destructive shell commands and credential-exfiltration attempts before they execute." },
                                { icon: Lock, title: "Credential Vault", desc: "Hermes calls suprawall_vault_get to retrieve secrets. API keys never appear in tool arguments." },
                                { icon: Zap, title: "PII Scrubbing", desc: "Emails, SSNs, and credit card numbers are redacted locally from tool results before reaching the LLM." },
                            ].map(({ icon: Icon, title, desc }, i) => (
                                <div key={i} className="p-10 rounded-[2.5rem] bg-white/[0.05] border border-white/5">
                                    <Icon className="w-8 h-8 text-violet-500 mb-4" />
                                    <h4 className="font-bold uppercase text-white tracking-widest text-sm mb-2">{title}</h4>
                                    <p className="text-xs text-neutral-500 font-bold uppercase tracking-tight">{desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* CAPABILITY TABLE */}
                        <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10">Integration Surface</h2>
                        <div className="overflow-x-auto rounded-3xl border border-white/5">
                            <table className="w-full text-sm font-bold text-left">
                                <thead>
                                    <tr className="border-b border-white/5 bg-white/[0.03]">
                                        <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-neutral-500">Capability</th>
                                        <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-neutral-500">Integration Method</th>
                                        <th className="px-6 py-4 uppercase tracking-widest text-[10px] text-neutral-500">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {capabilities.map(([cap, method, status], i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 text-white uppercase tracking-tight text-xs">{cap}</td>
                                            <td className="px-6 py-4 text-neutral-400 font-mono text-xs">{method}</td>
                                            <td className="px-6 py-4 text-xs">{status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* SLASH COMMANDS */}
                        <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-8">Slash Commands</h2>
                        <div className="bg-neutral-900 rounded-3xl p-8 border border-white/5 font-mono text-sm space-y-3">
                            <p className="text-neutral-500"># Check shield status</p>
                            <p className="text-violet-400">/suprawall <span className="text-white">status</span></p>
                            <p className="text-neutral-400 text-xs pl-2">→ Shield: ACTIVE | Budget: $0.42/$5.00 | Audited: 38 tool calls</p>
                            <p className="text-neutral-500 mt-4"># View last 10 tool calls</p>
                            <p className="text-violet-400">/suprawall <span className="text-white">audit</span></p>
                            <p className="text-neutral-500 mt-4"># Check current spend</p>
                            <p className="text-violet-400">/suprawall <span className="text-white">budget</span></p>
                        </div>

                        {/* CHECKLIST */}
                        <h2 className="text-4xl font-black uppercase italic tracking-tight text-white mt-24 mb-10">Production Security Checklist</h2>
                        <div className="space-y-4">
                            {checklist.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-violet-500/5 border border-violet-500/10">
                                    <CheckCircle2 className="w-5 h-5 text-violet-500 shrink-0" />
                                    <span className="text-sm font-bold uppercase tracking-tight text-neutral-200">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="max-w-7xl mx-auto mt-40 p-20 rounded-[4rem] bg-violet-600 relative overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-violet-800 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-none">
                            Hermes has the tools. <br />SupraWall has the rules.
                        </h2>
                        <div className="flex justify-center gap-6">
                            <Link href="/login" className="px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all transform hover:-translate-y-1">
                                Start for Free
                            </Link>
                            <Link href="/docs/frameworks/hermes" className="px-12 py-5 border border-white/30 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 transition-all">
                                Read the Docs
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
