// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { CheckCircle2, Shield, ShieldAlert, Clock, ArrowRight, Zap, Terminal } from "lucide-react";
import Link from "next/link";

export default function PolicyExamplesDocs() {
    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="space-y-4">
                <div className="inline-flex p-3 bg-emerald-500/10 rounded-full mb-2">
                    <Shield className="w-8 h-8 text-emerald-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    Policy Pattern Examples
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    Learn how to write effective security policies for your agents. From simple allow-lists to complex human-in-the-loop workflows.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-4">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <h3 className="text-xl font-bold text-white">Trust-but-Verify</h3>
                    </div>
                    <p className="text-neutral-400 text-sm">Allow safe read operations, but require approval for any destructive file modifications.</p>
                    <CodeBlock language="json" code={`{
  "rules": [
    { "tool": "file.read.*", "action": "ALLOW" },
    { "tool": "file.write.*", "action": "APPROVE" },
    { "tool": "file.delete", "action": "DENY" }
  ]
}`} />
                </div>

                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-4">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-6 h-6 text-rose-400" />
                        <h3 className="text-xl font-bold text-white">Hard-Blocked API</h3>
                    </div>
                    <p className="text-neutral-400 text-sm">Ensures that the agent can never access internal billing or user management systems via tool calling.</p>
                    <CodeBlock language="json" code={`{
  "rules": [
    { "tool": "internal.api.*", "action": "DENY" },
    { "tool": "aws.billing.get", "action": "DENY" }
  ]
}`} />
                </div>
            </div>

            <div className="space-y-8 pt-6 border-t border-white/5">
                <h2 className="text-2xl font-bold text-white tracking-wide">Common Use Cases</h2>
                <div className="space-y-4">
                    <div className="p-5 border border-white/5 rounded-xl bg-neutral-900 group">
                        <h4 className="font-bold text-white flex items-center gap-2 mb-2"><Zap className="w-4 h-4 text-emerald-500" /> E-commerce Support</h4>
                        <p className="text-sm text-neutral-400 mb-4">Allow checking order status, but require approval for processing refunds over $50.</p>
                        <CodeBlock language="json" code={`{
  "rules": [
    { "tool": "orders.get", "action": "ALLOW" },
    { "tool": "orders.refund", "condition": "args.amount > 50", "action": "APPROVE" },
    { "tool": "orders.refund", "action": "ALLOW" }
  ]
}`} />
                    </div>

                    <div className="p-5 border border-white/5 rounded-xl bg-neutral-900 group">
                        <h4 className="font-bold text-white flex items-center gap-2 mb-2"><Terminal className="w-4 h-4 text-neutral-400" /> DevOps Automation</h4>
                        <p className="text-sm text-neutral-400 mb-4">Allow listing resources and logs, but hard-block any infrastructure deletion commands.</p>
                        <CodeBlock language="json" code={`{
  "rules": [
    { "tool": "k8s.get.*", "action": "ALLOW" },
    { "tool": "k8s.logs", "action": "ALLOW" },
    { "tool": "k8s.delete.*", "action": "DENY" }
  ]
}`} />
                    </div>
                </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <Link href="/docs/frameworks/crewai" className="text-neutral-400 hover:text-white transition-colors text-sm">← CrewAI</Link>
                <Link href="/dashboard" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center">Open Dashboard <ArrowRight className="w-4 h-4 ml-1" /></Link>
            </div>
        </div>
    );
}
