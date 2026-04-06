// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { Terminal, Copy, Check, Zap, Shield, Code, Cpu, BookOpen } from "lucide-react";
import { useState } from "react";

export default function TypeScriptDocsPage() {
    const [copied, setCopied] = useState<string | null>(null);

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const CodeBlock = ({ code, id, language = "typescript" }: { code: string, id: string, language?: string }) => (
        <div className="relative group mt-4 mb-6">
            <div className="absolute top-4 right-4 z-10">
                <button
                    onClick={() => copyToClipboard(code, id)}
                    className="p-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                >
                    {copied === id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-neutral-400" />}
                </button>
            </div>
            <pre className="p-6 rounded-xl bg-[#0a0a0a] border border-white/5 overflow-x-auto font-mono text-sm leading-relaxed text-neutral-300">
                <code>{code}</code>
            </pre>
        </div>
    );

    return (
        <div className="max-w-4xl pb-20">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                    <Terminal className="w-6 h-6 text-emerald-500" />
                </div>
                <span className="text-emerald-500 font-mono text-sm font-semibold tracking-wider uppercase">SDK Reference</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
                TypeScript / Node.js SDK
            </h1>

            <p className="text-xl text-neutral-400 mb-12 leading-relaxed max-w-2xl">
                The official SupraWall TypeScript library for securing AI agents in Node.js and Edge environments. 
                Built for performance, type safety, and seamless integration with Vercel AI SDK and LangChain.js.
            </p>

            {/* Installation */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-500" /> Installation
                </h2>
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-200 text-sm mb-4">
                    <strong>Note:</strong> Requires Node.js 18+ or any modern Edge runtime.
                </div>
                <CodeBlock 
                    id="install"
                    language="bash"
                    code="npm install @suprawall/sdk"
                />
            </section>

            {/* Quickstart */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" /> Quickstart
                </h2>
                <p className="text-neutral-400 mb-4">
                    Initialize the <code className="text-emerald-400">SupraWall</code> client and wrap your agentic functions to enable deterministic runtime enforcement.
                </p>
                <CodeBlock 
                    id="quickstart"
                    code={`import { SupraWall } from "@suprawall/sdk";

// 1. Initialize with your API Key
const supra = new SupraWall({
  apiKey: process.env.SUPRAWALL_API_KEY
});

// 2. Protect any tool or function
const protectedTool = supra.protect(async (params) => {
  // Your tool logic here
  return { success: true };
});

// 3. Executing the tool triggers policy evaluation
const result = await protectedTool.run({ amount: 500, target: "account_A" });`}
                />
            </section>

            {/* Frameworks */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-10 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-emerald-500" /> Framework Integrations
                </h2>

                <div className="grid gap-8">
                    <div className="p-8 rounded-2xl bg-white/[0.05] border border-white/5">
                        <h3 className="text-lg font-semibold mb-4 text-white">Vercel AI SDK</h3>
                        <p className="text-neutral-400 text-sm mb-6">
                            SupraWall integrates directly with Vercel&apos;s <code className="text-emerald-400">generateText</code> and <code className="text-emerald-400">streamText</code> tool execution pipelines.
                        </p>
                        <CodeBlock 
                            id="vercel"
                            code={`import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { SupraWall } from "@suprawall/sdk";

const supra = new SupraWall({ apiKey: "ag_..." });

const { text } = await generateText({
  model: openai("gpt-4o"),
  tools: supra.wrapTools({
    transferFunds: {
      description: "Transfer money between accounts",
      execute: async ({ amount }) => ({ success: true }),
    }
  }),
  prompt: "Transfer 500 dollars."
});`}
                        />
                    </div>

                    <div className="p-8 rounded-2xl bg-white/[0.05] border border-white/5">
                        <h3 className="text-lg font-semibold mb-4 text-white">LangChain.js</h3>
                        <p className="text-neutral-400 text-sm mb-6">
                            Protect any LangChain <code className="text-emerald-400">Runnable</code> or <code className="text-emerald-400">StructuredTool</code>.
                        </p>
                        <CodeBlock 
                            id="langchain"
                            code={`import { SupraWall } from "@suprawall/sdk";
import { ChatOpenAI } from "@langchain/openai";

const supra = new SupraWall({ apiKey: "ag_..." });
const model = new ChatOpenAI({ modelName: "gpt-4o" });

// Wrap tools for LangChain execution
const tools = supra.wrapLangChainTools([myTool, myOtherTool]);

const response = await model.invoke(prompt, { tools });`}
                        />
                    </div>
                </div>
            </section>

            {/* Vault Injection */}
            <section className="mb-16">
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-500" /> Zero-Trust Vault
                </h2>
                <p className="text-neutral-400 mb-6">
                    Ensure your agents never see plaintext secrets. Inject credentials directly into tool calls at the runtime layer.
                </p>
                <CodeBlock 
                    id="vault"
                    code={`// Use vault tokens in your prompt or tool arguments
const result = await supra.protect(myTool).run({
  token: "$SUPRAWALL_VAULT_STRIPE_KEY", // Resolved by SDK, never seen by LLM
  userId: "user_789"
});`}
                />
            </section>

            {/* Advanced Usage */}
            <section>
                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" /> Advanced Configuration
                </h2>
                <CodeBlock 
                    id="advanced"
                    code={`const supra = new SupraWall({
  apiKey: "ag_...",
  environment: "production",
  timeout: 3000, // 3s timeout for policy evaluation
  failOpen: false, // Set to true to allow actions if SupraWall is unreachable
  debug: false
});`}
                />
            </section>

            {/* Support Footer */}
            <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h4 className="text-white font-semibold mb-1">TypeScript Questions?</h4>
                    <p className="text-neutral-400 text-sm">Join our developer community for implementation advice and best practices.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-sm hover:bg-white/10 transition">
                        Community Forum
                    </button>
                    <button className="px-6 py-2 rounded-lg bg-emerald-500 text-black text-sm font-semibold hover:bg-emerald-400 transition">
                        Chat with DevRel
                    </button>
                </div>
            </div>
        </div>
    );
}
