"use client";

import { useState } from "react";
import { Check, Copy, Terminal, Zap, Shield, Key } from "lucide-react";

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);

    return (
        <div className="relative group">
            <div className="bg-gray-900 rounded-xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b
          border-gray-700">
                    <span className="text-xs text-gray-400 font-mono">{language}</span>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(code);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        className="flex items-center gap-1.5 text-xs text-gray-400
              hover:text-white transition-colors"
                    >
                        {copied
                            ? <><Check className="w-3 h-3 text-green-400" /><span className="text-green-400">Copied</span></>
                            : <><Copy className="w-3 h-3" />Copy</>
                        }
                    </button>
                </div>
                <pre className="px-4 py-4 text-sm text-green-400 font-mono overflow-x-auto
          leading-relaxed whitespace-pre">
                    {code}
                </pre>
            </div>
        </div>
    );
}

function Step({
    number,
    title,
    description,
    children,
}: {
    number: number;
    title: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex gap-6">
            <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold
          flex items-center justify-center">
                    {number}
                </div>
                {/* Connector line */}
                <div className="w-px h-full bg-gray-200 mx-auto mt-2" />
            </div>
            <div className="flex-1 pb-10">
                <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
                {description && (
                    <p className="text-sm text-gray-500 mb-4">{description}</p>
                )}
                {children}
            </div>
        </div>
    );
}

const TABS = ["JavaScript / TypeScript", "Python", "MCP Server"] as const;
type Tab = typeof TABS[number];

export default function QuickstartPage() {
    const [activeTab, setActiveTab] = useState<Tab>("JavaScript / TypeScript");

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

            {/* Header */}
            <div className="text-center space-y-3">
                <div className="inline-flex p-3 bg-indigo-50 rounded-full">
                    <Zap className="w-7 h-7 text-indigo-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">
                    5-Minute Quickstart
                </h1>
                <p className="text-gray-500 max-w-lg mx-auto">
                    Secure your AI agent with one install command and fewer than
                    5 lines of code. No infrastructure, no YAML, no DevOps.
                </p>
            </div>

            {/* Language tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                ? "bg-white shadow text-gray-900"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Step 1 — Get API key */}
            <Step
                number={1}
                title="Get your free API key"
                description="Create an account and copy your API key from the dashboard."
            >
                <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200
          rounded-xl px-4 py-3">
                    <Key className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-medium text-indigo-800">
                            Your API key is on the home page
                        </p>
                        <p className="text-xs text-indigo-600 mt-0.5">
                            Format: <code className="bg-indigo-100 px-1 rounded">ag_xxxxxxxxxxxxxxxx</code>
                        </p>
                    </div>
                    <a
                        href="/"
                        className="ml-auto text-xs font-medium text-indigo-600 hover:text-indigo-800
              underline whitespace-nowrap"
                    >
                        Go to dashboard →
                    </a>
                </div>
            </Step>

            {/* Step 2 — Install */}
            <Step
                number={2}
                title="Install the SDK"
            >
                {activeTab === "JavaScript / TypeScript" && (
                    <CodeBlock code="npm install agentgate" language="bash" />
                )}
                {activeTab === "Python" && (
                    <div className="space-y-3">
                        <CodeBlock code="pip install agentgate" language="bash" />
                        <p className="text-xs text-gray-500">
                            With framework extras:
                        </p>
                        <CodeBlock
                            code={`pip install "agentgate[langchain]"   # LangChain\npip install "agentgate[openai]"      # OpenAI Agents SDK\npip install "agentgate[all]"         # Everything`}
                            language="bash"
                        />
                    </div>
                )}
                {activeTab === "MCP Server" && (
                    <CodeBlock code="npm install agentgate" language="bash" />
                )}
            </Step>

            {/* Step 3 — Wrap your agent */}
            <Step
                number={3}
                title="Wrap your agent"
                description="One line of code. Your agent works exactly the same — every tool call is now policy-checked."
            >
                {activeTab === "JavaScript / TypeScript" && (
                    <CodeBlock
                        language="typescript"
                        code={`import { withAgentGate } from "agentgate";

// Your existing agent — unchanged
const myAgent = createMyAgent();

// Wrap it — that's it
const secured = withAgentGate(myAgent, {
  apiKey: "ag_your_key_here",
});

// Use exactly as before — security is transparent
await secured.executeTool("send_email", { to: "user@example.com" });
// ↑ This call is now checked against your policies before executing`}
                    />
                )}
                {activeTab === "Python" && (
                    <div className="space-y-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Generic agent
                        </p>
                        <CodeBlock
                            language="python"
                            code={`from agentgate import with_agent_gate, AgentGateOptions

secured = with_agent_gate(my_agent, AgentGateOptions(
    api_key="ag_your_key_here"
))

# Use exactly as before
result = secured.run("delete_file", {"path": "/etc/passwd"})`}
                        />
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-4">
                            LangChain
                        </p>
                        <CodeBlock
                            language="python"
                            code={`from agentgate import AgentGateLangChainCallback, AgentGateOptions
from langchain.agents import AgentExecutor

callback = AgentGateLangChainCallback(
    AgentGateOptions(api_key="ag_your_key_here")
)

agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    callbacks=[callback],   # ← this one line adds full security
)`}
                        />
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-4">
                            OpenAI Agents SDK
                        </p>
                        <CodeBlock
                            language="python"
                            code={`from agentgate import wrap_openai_agent, AgentGateOptions
from agents import Agent, Runner

secured = wrap_openai_agent(agent, AgentGateOptions(
    api_key="ag_your_key_here"
))

result = await Runner.run(secured, "Delete all logs")`}
                        />
                    </div>
                )}
                {activeTab === "MCP Server" && (
                    <CodeBlock
                        language="typescript"
                        code={`import { createAgentGateMiddleware } from "agentgate";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const gate = createAgentGateMiddleware({
  apiKey: "ag_your_key_here",
});

// Add to your MCP server's tool handler
server.setRequestHandler(CallToolRequestSchema, async (req) => {
  return gate(
    req.params.name,
    req.params.arguments,
    () => myToolHandler(req)   // your existing handler
  );
});`}
                    />
                )}
            </Step>

            {/* Step 4 — Set policies */}
            <Step
                number={4}
                title="Set your policies"
                description="Define which tools are allowed, denied, or require human approval. No code changes needed — update policies in the dashboard."
            >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                        {
                            label: "ALLOW",
                            color: "bg-green-50 border-green-200",
                            textColor: "text-green-800",
                            desc: "Tool executes normally",
                            example: "read_file, search_web",
                        },
                        {
                            label: "DENY",
                            color: "bg-red-50 border-red-200",
                            textColor: "text-red-800",
                            desc: "Tool is blocked immediately",
                            example: "delete_*, drop_database",
                        },
                        {
                            label: "REQUIRE APPROVAL",
                            color: "bg-yellow-50 border-yellow-200",
                            textColor: "text-yellow-800",
                            desc: "Paused until you approve",
                            example: "send_email, publish_post",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className={`border rounded-xl p-4 ${item.color}`}
                        >
                            <p className={`text-xs font-bold mb-1 ${item.textColor}`}>
                                {item.label}
                            </p>
                            <p className="text-xs text-gray-600 mb-2">{item.desc}</p>
                            <code className="text-xs text-gray-500 font-mono">{item.example}</code>
                        </div>
                    ))}
                </div>
            </Step>

            {/* Step 5 — Production */}
            <Step
                number={5}
                title="Go to production"
                description="One config change makes AgentGate block actions even if it's temporarily unreachable."
            >
                {activeTab === "JavaScript / TypeScript" && (
                    <CodeBlock
                        language="typescript"
                        code={`const secured = withAgentGate(myAgent, {
  apiKey: process.env.AGENTGATE_API_KEY!,
  onNetworkError: "fail-closed",  // block if AgentGate unreachable
});`}
                    />
                )}
                {activeTab === "Python" && (
                    <CodeBlock
                        language="python"
                        code={`import os

secured = with_agent_gate(agent, AgentGateOptions(
    api_key=os.environ["AGENTGATE_API_KEY"],
    on_network_error="fail-closed",  # block if AgentGate unreachable
))`}
                    />
                )}
                {activeTab === "MCP Server" && (
                    <CodeBlock
                        language="typescript"
                        code={`const gate = createAgentGateMiddleware({
  apiKey: process.env.AGENTGATE_API_KEY!,
  onNetworkError: "fail-closed",  // block if AgentGate unreachable
});`}
                    />
                )}

                <div className="mt-4 flex items-start gap-3 bg-gray-50 border border-gray-200
          rounded-xl p-4">
                    <Shield className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-gray-600 space-y-1">
                        <p>
                            <span className="font-semibold text-gray-800">fail-open</span>
                            {" "}— allows actions when AgentGate is unreachable. Good for development.
                        </p>
                        <p>
                            <span className="font-semibold text-gray-800">fail-closed</span>
                            {" "}— blocks actions when AgentGate is unreachable. Required for production.
                        </p>
                    </div>
                </div>
            </Step>

            {/* Done */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border
        border-indigo-100 rounded-2xl p-8 text-center space-y-4">
                <div className="inline-flex p-3 bg-white rounded-full shadow-sm">
                    <Check className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                    Your agent is secured.
                </h2>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                    Every tool call is now intercepted, policy-checked, and logged.
                    Update policies anytime from the dashboard — no code changes, no redeployment.
                </p>
                <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <a href="/">
                        <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium
              rounded-lg hover:bg-indigo-700 transition-colors">
                            View Dashboard
                        </button>
                    </a>
                    <a href="/connect">
                        <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium
              rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            Set Up Connect
                        </button>
                    </a>
                    <a
                        href="https://github.com/wiserautomation/agentgate"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <button className="px-4 py-2 bg-white text-gray-700 text-sm font-medium
              rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                            View on GitHub
                        </button>
                    </a>
                </div>
            </div>

            {/* FAQ */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900">Common questions</h2>
                {[
                    {
                        q: "Does AgentGate add latency?",
                        a: "Policy evaluation averages under 10ms. For most agents this is imperceptible. Use fail-open mode in development if latency is a concern.",
                    },
                    {
                        q: "What happens if AgentGate is down?",
                        a: "With fail-open (default for dev): your agent continues normally. With fail-closed (recommended for production): actions are blocked until AgentGate is reachable. You choose per environment.",
                    },
                    {
                        q: "Does it work with my existing agent framework?",
                        a: "Yes. AgentGate works with LangChain, OpenAI Agents SDK, CrewAI, AutoGen, raw MCP servers, and any custom agent with a tool execution method.",
                    },
                    {
                        q: "Can I use AgentGate for my customers' agents?",
                        a: "Yes — that's AgentGate Connect. Issue sub-keys (agc_ prefix) to your customers. Their agents are governed by your platform policies. See the Connect section in the sidebar.",
                    },
                    {
                        q: "Is my agent's data sent to AgentGate?",
                        a: "Only the tool name and arguments are sent for policy evaluation. Sensitive fields (password, token, secret, apiKey) are automatically redacted in audit logs.",
                    },
                    {
                        q: "How do I update policies without redeploying?",
                        a: "Set your rules in the dashboard. They take effect on the next agent call — no code changes, no redeployment needed.",
                    },
                ].map((item) => (
                    <details
                        key={item.q}
                        className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
                    >
                        <summary className="flex items-center justify-between px-5 py-4 cursor-pointer
              hover:bg-gray-50 transition-colors list-none">
                            <span className="text-sm font-medium text-gray-800">{item.q}</span>
                            <span className="text-gray-400 group-open:rotate-180 transition-transform
                duration-200 flex-shrink-0 ml-4">
                                ▾
                            </span>
                        </summary>
                        <div className="px-5 pb-4">
                            <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
                        </div>
                    </details>
                ))}
            </div>

        </div>
    );
}
