// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { CodePlayground } from "@/components/CodePlayground";
import { Terminal, Shield, Zap, Server, Code, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function VercelAIDocs() {
    const starterCode = `import { Client, secure_tools } from "@suprawall/sdk";
import { generateText } from "ai";

// 1. Initialize SupraWall with Deny-by-default
const sw = new Client({ 
  apiKey: process.env.SUPRAWALL_API_KEY, 
  defaultPolicy: "DENY" 
});

// 2. Secure your tools
const tools = {
  weather: {
    description: "Get current weather",
    parameters: z.object({ city: z.string() }),
    execute: async ({ city }) => { ... }
  }
};

const securedTools = secure_tools(tools, { client: sw });

// 3. Pass to your generateText call
const { text } = await generateText({
  model: openai("gpt-4o"),
  tools: securedTools,
  prompt: "What is the weather in London?",
});`;

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider">Framework Guide</span>
                    <span className="px-3 py-1 bg-neutral-500/20 text-neutral-300 rounded-full text-xs font-semibold uppercase tracking-wider">Next.js</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    Vercel AI SDK
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    Secure your React-based AI applications with tool-level middleware and streaming security headers.
                </p>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">1. Installation</h2>
                    <CodeBlock code="npm install @suprawall/sdk ai zod" language="bash" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">2. Middleware Setup</h2>
                    <p className="text-neutral-400 text-sm">
                        Use the <code className="text-emerald-400 font-mono">wrapTools</code> helper to inject SupraWall governance directly into your Vercel AI SDK tool definitions.
                    </p>
                    <CodeBlock 
                        language="typescript" 
                        code={starterCode} 
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">Client-Side Hooks</h2>
                    <p className="text-neutral-400 text-sm">
                        SupraWall also provides a React utility to listen for tool execution states and display approval prompts to the user.
                    </p>
                    <CodeBlock 
                        language="tsx" 
                        code={`"use client";
import { useSupraWall } from "suprawall/react";

export function ChatComponent() {
  const { status, approve } = useSupraWall();

  return (
    <div>
      {status === "PENDING_APPROVAL" && (
        <button onClick={approve}>Approve Action</button>
      )}
    </div>
  );
}`} 
                    />
                </section>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <Link href="/docs/frameworks/llamaindex" className="text-neutral-400 hover:text-white transition-colors text-sm">← LlamaIndex</Link>
                <Link href="/docs/frameworks/autogen" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center">AutoGen →</Link>
            </div>
        </div>
    );
}
