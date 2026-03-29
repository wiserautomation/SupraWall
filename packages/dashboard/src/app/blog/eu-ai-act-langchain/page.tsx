// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { FileText } from "lucide-react";

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
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <Navbar />
            
            <main className="pt-40 pb-32 px-6">
                <div className="max-w-4xl mx-auto space-y-20">
                    <header className="space-y-8">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/20">
                            Compliance Guide • 2026
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-glow">
                             Making <span className="text-blue-500">LangChain</span> Ready for the <span className="text-emerald-500">EU AI Act</span>
                        </h1>
                        <p className="text-2xl text-neutral-400 font-medium italic mt-8 border-l-8 border-blue-600 pl-8 leading-snug">
                             How to implement Article 9, 12, and 14 compliance in under 5 minutes with a single middleware integration.
                        </p>
                    </header>

                    <article className="prose prose-invert prose-emerald max-w-none space-y-12">
                         <section className="space-y-6">
                             <p className="text-neutral-300 text-xl leading-relaxed font-medium pt-8">
                                 The EU AI Act requires human oversight (Article 14), audit logging (Article 12), and risk management (Article 9) for production AI agents. Most LangChain deployments have none of these. If your agent is touching customer data, sending emails, executing financial transactions, or interacting with any external system, you are likely already non-compliant.
                             </p>
                             <div className="p-8 rounded-3xl bg-rose-500/5 border border-rose-500/20">
                                  <p className="text-white font-black uppercase text-sm mb-2">The Risk</p>
                                  <p className="text-neutral-400 text-sm italic font-medium">"Fines can reach €30 million or 6% of global annual turnover. The system prompt is not a legal defense."</p>
                             </div>
                         </section>

                         <section className="space-y-8">
                             <h2 className="text-4xl font-black uppercase italic tracking-tight text-white border-b border-white/5 pb-4">The 3-Line Problem</h2>
                             <p className="text-neutral-400 text-lg leading-relaxed">Most LangChain agents in production look something like this:</p>
                             <div className="bg-neutral-900 rounded-[2.5rem] p-10 border border-white/5 font-mono text-xs leading-relaxed overflow-x-auto text-neutral-500">
                                 <pre>{`from langchain.agents import AgentExecutor
llm = ChatOpenAI(model="gpt-4o")
# Dangerous: No interceptor, no audit, no oversight
executor = AgentExecutor(agent=agent, tools=tools)`}</pre>
                             </div>
                             <p className="text-neutral-400 text-lg leading-relaxed">
                                 Clean, functional, and dangerously non-compliant. You have **no audit trail** (Article 12 violation), **no human oversight** (Article 14 violation), and **no policy engine** (Article 9 violation).
                             </p>
                         </section>

                         <section className="space-y-8">
                             <h2 className="text-4xl font-black uppercase italic tracking-tight text-white border-b border-white/5 pb-4">The 5-Minute Fix</h2>
                             <div className="bg-neutral-900 rounded-[2.5rem] p-10 border border-blue-500/30 font-mono text-xs leading-relaxed overflow-x-auto">
                                 <p className="text-blue-400 mb-4"># Step 1: Install the compliance middleware</p>
                                 <p className="text-white font-black">pip install <span className="text-blue-500">langchain-suprawall</span></p>
                                 <p className="text-blue-400 mt-8 mb-4"># Step 2: Wrap your executor with compliance parameters</p>
                                 <pre className="text-emerald-400">{`executor = AgentExecutor(
    agent=agent,
    tools=tools,
    middleware=[
        SuprawallMiddleware(
            api_key=os.environ["SUPRAWALL_API_KEY"],
            risk_level=RiskLevel.HIGH,     # Article 9
            require_human_oversight=True,  # Article 14
            audit_retention_days=730,      # Article 12
        ),
    ],
)`}</pre>
                             </div>
                         </section>

                         <section className="space-y-8 pt-12">
                             <h2 className="text-4xl font-black uppercase italic tracking-tight text-white border-b border-white/5 pb-4">What Happens in Production?</h2>
                             <p className="text-neutral-400 text-lg leading-relaxed">
                                 Let's trace exactly what happens when your agent tries to call a sensitive tool like <code>send_email</code> or <code>database_write</code>.
                             </p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                                  {[
                                      { step: "1", title: "Interception", desc: "SupraWall intercepts the call BEFORE execution. The tool does not run yet." },
                                      { step: "2", title: "Evaluation", desc: "Our engine classifies the risk. send_email is high-risk (PII exposure)." },
                                      { step: "3", title: "Escalation", desc: "SupraWall dispatches a Slack message to your compliance officer instantly." },
                                      { step: "4", title: "Resolution", desc: "Human clicks Approve. Tool executes. Every millisecond is audit-logged." }
                                  ].map((item, i) => (
                                      <div key={i} className="p-8 rounded-3xl bg-neutral-900 border border-white/5 space-y-2">
                                           <div className="text-emerald-500 font-black text-xl italic">{item.step}.</div>
                                           <p className="text-white font-black uppercase tracking-tight">{item.title}</p>
                                           <p className="text-neutral-500 text-sm font-medium">{item.desc}</p>
                                      </div>
                                  ))}
                             </div>
                         </section>
                    </article>

                    {/* Final CTA */}
                    <div className="p-20 rounded-[4rem] bg-blue-600 text-center space-y-10 group relative overflow-hidden">
                         <div className="relative z-10 space-y-6">
                             <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white leading-[0.85]">
                                  Get Audit-Ready<br />In Minutes.
                             </h2>
                             <Link href="/beta" className="inline-flex px-12 py-5 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-neutral-100 transition-all shadow-2xl">
                                  Download Compliance Report <FileText className="ml-2 w-4 h-4" />
                             </Link>
                         </div>
                         <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-transparent opacity-0 group-hover:opacity-20 transition-opacity" />
                    </div>
                </div>
            </main>
        </div>
    );
}
