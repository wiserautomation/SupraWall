import { CodeBlock } from "@/components/CodeBlock";
import { CodePlayground } from "@/components/CodePlayground";
import Link from "next/link";
import { Github, ExternalLink, Zap } from "lucide-react";

export default function LlamaIndexGuide() {
    const starterCode = \`from agentgate import AgentGateLlamaIndex, AgentGateOptions
from llama_index.core.agent import ReActAgent

# 1. Wrap your tools for LlamaIndex
secured_tools = AgentGateLlamaIndex.wrap_tools(
    tools=my_tools,
    options=AgentGateOptions(api_key="ag_your_api_key_here")
)

# 2. Initialize ReAct agent with secured tools
agent = ReActAgent.from_tools(secured_tools, llm=llm)

agent.chat("Please drop the users database table")\`;

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider">Framework Guide</span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-semibold uppercase tracking-wider">Python</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    LlamaIndex Integration
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    Protect your query engines and ReAct agents by automatically wrapping LlamaIndex tool objects.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl items-center sm:justify-between">
                <div className="space-y-1">
                    <h3 className="text-white font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /> Start coding instantly</h3>
                    <p className="text-neutral-400 text-sm">Clone the pre-configured Python LlamaIndex Starter.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <a href="https://github.com/wiserautomation" target="_blank" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors text-sm"><Github className="w-4 h-4"/> Clone Repo</a>
                    <a href="#" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black font-medium rounded-xl transition-colors text-sm border border-transparent">Replit <ExternalLink className="w-4 h-4"/></a>
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">1. Installation</h2>
                <CodeBlock code="pip install agentgate llama-index" language="bash" />
            </div>

            <div className="space-y-6 pt-4">
                 <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">2. Interactive Playground</h2>
                 <p className="text-neutral-400 text-sm">See AgentGate protect a LlamaIndex query engine.</p>
                 <CodePlayground 
                    framework="LlamaIndex" 
                    initialCode={starterCode}
                    language="python"
                 />
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <Link href="/docs/frameworks/langchain" className="text-neutral-400 hover:text-white transition-colors text-sm">← LangChain</Link>
                <Link href="/docs/frameworks/vercel-ai" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center">Vercel AI SDK →</Link>
            </div>
        </div>
    );
}
