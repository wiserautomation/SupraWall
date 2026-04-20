// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { CodeBlock } from "@/components/CodeBlock";
import { CodePlayground } from "@/components/CodePlayground";
import Link from "next/link";
import { ArrowRight, Github, ExternalLink, Zap } from "lucide-react";

export default function LangchainGuide() {
    const starterCode = `import { SupraWallLangChainCallback, SupraWallOptions } from "@suprawall/sdk";
import { AgentExecutor } from "langchain/agents";

// 1. Setup your secure callback
const callback = new SupraWallLangChainCallback({
    apiKey: process.env.SUPRAWALL_API_KEY
});

// 2. Attach to your executor
const agentExecutor = new AgentExecutor({
    agent,
    tools,
    callbacks: [callback] // <-- Everything is now governed
});

await agentExecutor.invoke({ input: "List all files in the secret folder" });`;

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider">Framework Guide</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold uppercase tracking-wider">TypeScript</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    LangChain Integration
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    Secure your LangChain runnables and agents effortlessly by attaching the SupraWall callback handler.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl items-center sm:justify-between">
                <div className="space-y-1">
                    <h3 className="text-white font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /> Start coding instantly</h3>
                    <p className="text-neutral-400 text-sm">Clone the pre-configured TypeScript Starter repository.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <a href="https://github.com/wiserautomation/SupraWall" target="_blank" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors text-sm"><Github className="w-4 h-4" /> Clone Repo</a>
                    <a href="/docs/api" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-neutral-800 hover:border-neutral-700 text-white font-medium rounded-xl transition-colors text-sm">REST API</a>
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">1. Installation</h2>
                <CodeBlock code="npm install @suprawall/sdk langchain @langchain/core" language="bash" />
            </div>

            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">2. Interactive Playground</h2>
                <p className="text-neutral-400 text-sm">See how SupraWall dynamically governs a LangChain agent below. Change the active policy to test the response.</p>
                <CodePlayground
                    framework="LangChain"
                    initialCode={starterCode}
                    language="typescript"
                />
            </div>

            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">Full Runnable Example (Python)</h2>
                <p className="text-neutral-400 text-sm">Save this as `secure_agent.py`. It initializes a SupraWall client with deny-by-default and wraps a standard LangChain agent.</p>
                <CodeBlock language="python" code={`from suprawall import Client, secure_agent
from langchain_openai import ChatOpenAI
from langchain.agents import create_openai_functions_agent, AgentExecutor
from langchain import hub
import os

# 1. Initialize SupraWall with Deny-by-default
# This ensures zero trust: all tools are blocked unless explicitly allowed in dashboard.
sw = Client(api_key=os.environ.get("SUPRAWALL_API_KEY"), default_policy="DENY")

# 2. Setup your standard LangChain Agent
llm = ChatOpenAI(model="gpt-4", temperature=0)
prompt = hub.pull("hwchase17/openai-functions-agent")
tools = [...] # Your agent tools here
agent = create_openai_functions_agent(llm, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools)

# 3. 🛡️ Secure the executor with one line
# Every tool call attempted by agent_executor is now gated by SupraWall.
secured_agent = secure_agent(agent_executor, client=sw)

# 4. Invoke as usual
# If the agent tries to use a blocked tool, SupraWall will intercept and block it.
try:
    response = secured_agent.invoke({"input": "Perform a sensitive operation"})
    print(response["output"])
except Exception as e:
    print(f"SupraWall Security Block: {e}")`} />
            </div>

            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">TypeScript Implementation</h2>
                <p className="text-neutral-400 text-sm">Use the `@suprawall/sdk` for Node.js environments.</p>
                <CodeBlock language="typescript" code={`import { Client, secure_agent } from "@suprawall/sdk";
import { AgentExecutor } from "langchain/agents";

const sw = new Client({ 
    apiKey: process.env.SUPRAWALL_API_KEY, 
    defaultPolicy: "DENY" 
});

const secured = secure_agent(myAgentExecutor, { client: sw });
await secured.invoke({ input: "..." });`} />
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <Link href="/docs/quickstart" className="text-neutral-400 hover:text-white transition-colors text-sm">← Quickstart</Link>
                <Link href="/docs/frameworks/llamaindex" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center">LlamaIndex →</Link>
            </div>
        </div>
    );
}
