import { CodeBlock } from "@/components/CodeBlock";
import { Sparkles, Bot, Terminal, Shield, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function AIAssistantGuide() {
    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2">
                        <Sparkles className="w-3 h-3" /> Agent Optimized
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                    AI Assistant Guide
                </h1>
                <p className="text-xl text-neutral-400 max-w-3xl leading-relaxed">
                    This guide is designed for AI coding assistants (like Antigravity, Claude, or Cursor) to help them integrate SupraWall into your codebase accurately on the first try.
                </p>
            </div>

            {/* Why use this? */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                    <Bot className="w-6 h-6 text-violet-400" />
                    <h3 className="text-lg font-bold text-white">Zero Guesswork</h3>
                    <p className="text-sm text-neutral-400">Eliminate hallucinations by providing the assistant with exact SDK signatures and initialization patterns.</p>
                </div>
                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
                    <Shield className="w-6 h-6 text-emerald-400" />
                    <h3 className="text-lg font-bold text-white">Secure by Default</h3>
                    <p className="text-sm text-neutral-400">Ensures the assistant configures a "Deny-by-default" posture according to security best practices.</p>
                </div>
            </div>

            {/* Master Prompt Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-white tracking-wide">The Master Integration Prompt</h2>
                    <span className="text-xs text-neutral-500 font-mono">Vibe Coding Optimized</span>
                </div>
                <p className="text-neutral-400">Copy this prompt and paste it into your AI assistant's chat to begin the integration.</p>
                
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/20 to-emerald-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative bg-black/60 border border-white/10 rounded-2xl p-8 space-y-4 backdrop-blur-xl">
                        <div className="text-sm text-neutral-300 font-mono leading-relaxed space-y-4">
                            <p>Act as a Senior AI Integration Engineer. Your task is to install and configure SupraWall to secure my AI agent.</p>
                            
                            <p>1. **Install SDK:** Run `pip install suprawall` (Python) or `npm install suprawall` (Node).</p>
                            
                            <p>2. **Environment:** Load `SUPRAWALL_API_KEY` from environment variables.</p>
                            
                            <p>3. **Initialization:** Create `suprawall_client.py` using this exact boilerplate:</p>
                            <pre className="bg-white/5 p-4 rounded-lg mt-2 overflow-x-auto text-emerald-400/90">
{`from suprawall import Client, secure_agent
import os

client = Client(
    api_key=os.environ.get("SUPRAWALL_API_KEY"),
    default_policy="DENY"
)`}
                            </pre>
                            
                            <p>4. **Integration:** Find the main Agent Executor and wrap it using `secure_agent(my_agent, client=client)`.</p>
                            
                            <p>5. **Verification:** Create a test script that tries to execute a blocked tool (e.g., `db.drop_table`) to verify protection.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expected Code Shape */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-white tracking-wide">Expected Code Shape</h2>
                <p className="text-neutral-400">Encourage your assistant to follow this clean separation of concerns.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-emerald-400" /> Directory Structure
                        </h4>
                        <pre className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-xs leading-relaxed text-neutral-400">
{`project-root/
├── .env                  # API Key here
├── main.py               # Main agent logic
├── suprawall_client.py   # Client init & policy
└── test_security.py      # Verification script`}
                        </pre>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Shield className="w-4 h-4 text-emerald-400" /> Recommended Boilerplate
                        </h4>
                        <CodeBlock 
                            language="python"
                            code={`# suprawall_client.py
from suprawall import Client, secure_agent
import os

client = Client(
    api_key=os.environ.get("SUPRAWALL_API_KEY"),
    default_policy="DENY"
)

def secure(agent):
    return secure_agent(agent, client=client)`}
                        />
                    </div>
                </div>
            </section>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-12 border-t border-white/10">
                <Link href="/docs/quickstart" className="text-neutral-400 hover:text-white transition-colors text-sm">← Quickstart</Link>
                <Link href="/docs/frameworks/langchain" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center">LangChain Integration →</Link>
            </div>
        </div>
    );
}
