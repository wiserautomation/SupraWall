import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
    title: "EU AI Act Compliance for LangChain Agents | SupraWall Blog",
    description: "Learn how to achieve Article 9, 12, and 14 EU AI Act compliance for your LangChain autonomous agents using SupraWall's deterministic security layer.",
    keywords: [
        "eu ai act langchain",
        "langchain security",
        "langchain compliance",
        "human in the loop langchain",
        "ai agent security",
    ],
};

export default function EuAiActLangchainBlog() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Navbar />
            
            <main className="pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto space-y-12">
                <header className="space-y-6">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest border border-blue-500/20">
                        Compliance Guide
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase leading-none text-glow">
                        Making <span className="text-blue-500">LangChain</span> Ready for the <span className="text-emerald-500">EU AI Act</span>
                    </h1>
                    <p className="text-neutral-400 text-lg md:text-xl font-medium italic">
                        By August 2026, autonomous agents without deterministic safety controls will face massive fines. Here's how to shield your LangChain deployment.
                    </p>
                </header>

                <article className="prose prose-invert prose-emerald max-w-none text-neutral-300">
                    <h2 className="text-3xl font-bold text-white uppercase italic tracking-tighter mt-12 mb-6">The System Prompt is Not a Legal Defense</h2>
                    <p>
                        "You must not execute harmful commands" is a suggestion to a probabilistic model, not a security control. When the EU AI Act takes full effect, relying on system prompts to govern enterprise agents will not pass audit.
                    </p>
                    
                    <h3 className="text-2xl font-bold text-white uppercase mt-8 mb-4">Article 9: Risk Management</h3>
                    <p>
                        Article 9 requires technical measures to mitigate risk. SupraWall solves this natively in LangChain by intercepting every <code>tool.invoke()</code> call. If an agent tries to trigger a high-risk tool outside defined policies, the SDK blocks it deterministically.
                    </p>
                    <pre className="bg-neutral-900 border border-white/10 rounded-xl p-4 mt-4 overflow-x-auto">
                        <code className="text-emerald-400 font-mono text-sm">
{`from langchain_suprawall import SupraWallToolWrapper

secured_tool = SupraWallToolWrapper(tool=bash_tool, api_key="sw_...")
# SupraWall evaluates every execution deterministically.`}
                        </code>
                    </pre>

                    <h3 className="text-2xl font-bold text-white uppercase mt-12 mb-4">Article 14: Human Oversight</h3>
                    <p>
                        High-risk agentic actions require a "Human in the Loop" (HITL). SupraWall implements this by returning a <code>REQUIRE_APPROVAL</code> decision from the policy engine. The agent flow pauses instantly until a human manually clears the action via the dashboard.
                    </p>
                    
                    <div className="mt-16 p-8 bg-blue-500/5 border border-blue-500/20 rounded-3xl">
                        <h4 className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-4">Next Steps</h4>
                        <p className="text-white italic">
                            Don't wait for your agent to execute a rogue API call or for the auditors to knock. Drop the <code>langchain-suprawall</code> package into your project today and achieve zero-trust compliance in under 5 minutes.
                        </p>
                    </div>
                </article>
            </main>
        </div>
    );
}
