// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { Terminal, Shield, Zap, Search, Eye, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OpenClawDocs() {
    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider">Integration Guide</span>
                    <span className="px-3 py-1 bg-neutral-500/20 text-neutral-300 rounded-full text-xs font-semibold uppercase tracking-wider">Browser</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    OpenClaw (Browser)
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    Secure autonomous browsing agents and prevent session leakage with browser-level firewalling.
                </p>
            </div>

            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-emerald-400" /> CDP-Level Protection
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                    SupraWall sits at the Chrome DevTools Protocol (CDP) level. We intercept click and type events before they reach the browser's execution engine.
                </p>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">1. Installation</h2>
                    <CodeBlock code="npm install @suprawall/claw" language="bash" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">2. Secure Initialization</h2>
                    <p className="text-neutral-400 text-sm">
                        Wrap your Playwright or Puppeteer browser instance to enable real-time DOM action auditing.
                    </p>
                    <CodeBlock 
                        language="typescript" 
                        code={`import { protectBrowser } from "@suprawall/claw";
import { chromium } from "playwright";

const browser = await chromium.launch();
const page = await browser.newPage();

// Attach the SupraWall Firewall
const securedPage = await protectBrowser(page, {
    apiKey: process.env.SUPRAWALL_API_KEY,
    rules: [
        { domain: "github.com", mode: "READ_ONLY" },
        { domain: "stripe.com", mode: "APPROVE_ACTIONS" }
    ]
});

// Dangerous actions are now policy-checked
await securedPage.click('button:has-text("Delete")'); // Blocks if policy is DENY`} 
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">Key Security Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: "DOM Shield", desc: "Monitors and blocks dangerous DOM actions based on context.", icon: Search },
                            { title: "Session Guard", desc: "Prevents exfiltration of cookies and local storage data.", icon: Shield },
                            { title: "Action Kill-Switch", desc: "Immediate blocking of sensitive clicks (e.g., Delete, Buy).", icon: Zap },
                            { title: "Visual Audit", desc: "Interactive logs showing exactly where the agent clicked and why.", icon: Eye }
                        ].map((b, i) => (
                            <div key={i} className="p-5 rounded-xl bg-neutral-900 border border-white/5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <b.icon className="w-5 h-5 text-emerald-400" />
                                    <h4 className="font-bold text-white">{b.title}</h4>
                                </div>
                                <p className="text-xs text-neutral-500 leading-relaxed">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <Link href="/docs/mcp" className="text-neutral-400 hover:text-white transition-colors text-sm">← Claude (MCP)</Link>
                <Link href="/docs/frameworks/langchain" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center">LangChain →</Link>
            </div>
        </div>
    );
}
