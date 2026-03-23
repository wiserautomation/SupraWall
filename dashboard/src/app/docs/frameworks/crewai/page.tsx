"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { Shield, Zap, Users, Layout, Terminal, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function CrewAIDocs() {
    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider">Framework Guide</span>
                    <span className="px-3 py-1 bg-neutral-500/20 text-neutral-300 rounded-full text-xs font-semibold uppercase tracking-wider">Python</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    CrewAI Integration
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    Enforce policy-based permissions for hierarchical task execution and multi-agent roles.
                </p>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">1. Installation</h2>
                    <CodeBlock code="pip install suprawall crewai" language="bash" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">2. Securing a Crew Task</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                        SupraWall integrates with CrewAI's task lifecycle. Initialize the global client and wrap your agent or crew.
                    </p>
                    <CodeBlock 
                        language="python" 
                        code={`from crewai import Agent, Task, Crew
from suprawall import Client, secure_agent
import os

# 1. Initialize SupraWall with Deny-by-default
sw = Client(api_key=os.environ.get("SUPRAWALL_API_KEY"), default_policy="DENY")

# 2. Define your research agent
research_agent = Agent(
    role="Researcher", 
    goal="Search the web", 
    tools=[search_tool]
)

# 🛡️ Secure the agent (or the whole crew)
# Every tool call attempted by research_agent is now gated by SupraWall.
secured_agent = secure_agent(research_agent, client=sw)

# 3. Use in your task
task = Task(
    description="Find the latest AI news.",
    agent=secured_agent
)

crew = Crew(agents=[secured_agent], tasks=[task])
crew.kickoff()`} 
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">Task-Level Governance</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { title: "Role Permissions", desc: "Restrict specific tools to certain agent roles.", icon: Users },
                            { title: "Task Sandboxing", desc: "Ensure destructive tools are only used in designated safe tasks.", icon: Shield },
                            { title: "Audit Trail", desc: "Full history of which agent executed which tool and why.", icon: Terminal },
                            { title: "Custom Flows", desc: "Inject approval steps for high-stakes tasks automatically.", icon: Layout }
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
                <Link href="/docs/frameworks/autogen" className="text-neutral-400 hover:text-white transition-colors text-sm">← AutoGen</Link>
                <Link href="/docs/examples" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center">Policy Examples →</Link>
            </div>
        </div>
    );
}
