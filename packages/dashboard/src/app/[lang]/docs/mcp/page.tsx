// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { CodeBlock } from "@/components/CodeBlock";
import Link from "next/link";
import { ArrowRight, Puzzle, Info, ExternalLink, ShieldCheck } from "lucide-react";

export default function MCPGuide() {
    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider">Official Plugin</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold uppercase tracking-wider">Claude Desktop</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    Claude MCP Integration
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    Protect your Claude Desktop instance with SupraWall's Model Context Protocol (MCP) security layer.
                </p>
            </div>

            <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4 items-start">
                <Info className="w-6 h-6 text-amber-500 shrink-0 mt-1" />
                <div className="space-y-2">
                    <h4 className="text-amber-200 font-bold">Marketplace Status</h4>
                    <p className="text-neutral-300 text-sm leading-relaxed">
                        Our official entry is currently under review by the Anthropic team. While the PR is in review, you can install the plugin manually using the command below.
                    </p>
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">1. Installation</h2>
                <p className="text-neutral-400 text-sm italic">Open Claude Desktop and run the following command:</p>
                <CodeBlock code="/plugin marketplace add wiserautomation/suprawall-mcp-plugin" language="bash" />
            </div>

            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">2. Configuration</h2>
                <p className="text-neutral-400 text-sm">Once installed, you'll need to provide your SupraWall API key. You can find this in your <Link href="/dashboard" className="text-emerald-400 hover:underline">Dashboard</Link>.</p>
                <div className="p-6 bg-neutral-900 border border-white/5 rounded-xl space-y-4">
                    <div className="flex items-center gap-3 text-white font-semibold">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        Security Features Enabled
                    </div>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-neutral-400">
                        <li className="flex items-center gap-2">• Real-time Tool Audit</li>
                        <li className="flex items-center gap-2">• Human-in-the-loop Approvals</li>
                        <li className="flex items-center gap-2">• PII & Secret Redaction</li>
                        <li className="flex items-center gap-2">• Compliance Reporting</li>
                    </ul>
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">Technical Details</h2>
                <p className="text-neutral-400 text-sm">
                    SupraWall acts as a proxy between Claude and your tools. It uses the standard MCP lifecycle to intercept tool requests, evaluate them against your cloud-hosted policies, and either allow, deny, or pause for approval.
                </p>
                <a href="https://github.com/wiserautomation/SupraWall" target="_blank" className="inline-flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
                    View source on GitHub <ExternalLink className="w-4 h-4" />
                </a>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <Link href="/docs/quickstart" className="text-neutral-400 hover:text-white transition-colors text-sm">← Quickstart</Link>
                <Link href="/docs/frameworks/langchain" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center">LangChain Integration →</Link>
            </div>
        </div>
    );
}
