"use client";

import { motion } from "framer-motion";
import { Shield, BrickWall, CheckCircle2, AlertCircle, Terminal, FileCode, ExternalLink, ArrowRight } from "lucide-react";
import { useState } from "react";

export function SpecClient() {
    const [jsonInput, setJsonInput] = useState(`{
  "version": "1.0",
  "policy": {
    "toolName": "bash",
    "action": "DENY",
    "condition": "rm -rf /"
  }
}`);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    const validateJson = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            if (!parsed.version) throw new Error("Missing 'version' field");
            if (!parsed.policy) throw new Error("Missing 'policy' object");
            if (!parsed.policy.toolName) throw new Error("Missing 'policy.toolName'");
            if (!["ALLOW", "DENY", "REQUIRE_APPROVAL"].includes(parsed.policy.action)) {
                throw new Error("Invalid action. Must be ALLOW, DENY, or REQUIRE_APPROVAL");
            }
            setIsValid(true);
            setErrorMessage("");
        } catch (e: any) {
            setIsValid(false);
            setErrorMessage(e.message);
        }
    };

    return (
        <div className="space-y-12 pb-20 max-w-5xl mx-auto">
            <div className="space-y-4">
                <div className="inline-flex p-3 bg-emerald-500/10 rounded-full mb-2">
                    <BrickWall className="w-8 h-8 text-emerald-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white uppercase italic">
                    SupraWall Policy Spec (AGPS)
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed italic">
                    The open standard for AI agent governance. AGPS defines a unified JSON format for intercepting tool calls and enforcing security boundaries.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
                {/* VALIDATOR SIDE */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2 uppercase tracking-tight">
                            <Terminal className="w-5 h-5 text-emerald-400" /> Policy Validator
                        </h3>
                        <span className="text-xs text-neutral-500 font-mono">v1.0.0-draft</span>
                    </div>
                    <div className="relative group">
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="w-full h-80 bg-[#0D0D0D] border border-white/10 rounded-3xl p-8 font-mono text-sm text-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none transition-all shadow-2xl"
                            spellCheck={false}
                        />
                        <button
                            onClick={validateJson}
                            className="absolute bottom-6 right-6 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-lg transition-transform active:scale-95"
                        >
                            Validate Spec
                        </button>
                    </div>

                    {isValid === true && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400 font-bold uppercase text-[10px] tracking-widest">
                            <CheckCircle2 className="w-5 h-5" />
                            <span>Valid AGPS Policy! Ready for deployment.</span>
                        </motion.div>
                    )}

                    {isValid === false && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 font-bold uppercase text-[10px] tracking-widest">
                            <AlertCircle className="w-5 h-5" />
                            <span>Invalid Spec: {errorMessage}</span>
                        </motion.div>
                    )}
                </div>

                {/* THE SPEC SIDE */}
                <div className="space-y-8">
                    <div className="p-8 bg-neutral-900/50 border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                        <h4 className="text-white font-black uppercase text-xs tracking-widest mb-4">Why an Open Standard?</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed italic">
                            AI agents are becoming autonomous. Without a standard way to describe what they can and cannot do, security becomes fragmented and proprietary. AGPS ensures that your security policies are portable across any provider.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-black uppercase text-xs tracking-widest flex items-center gap-2">Core Objects</h4>
                        <div className="space-y-4">
                            {[
                                { title: "version", desc: "Required. Currently '1.0'. Manages spec schema compatibility." },
                                { title: "toolName", desc: "The ID of the tool being intercepted (e.g. 'search', 'email_send', '*')." },
                                { title: "action", desc: "ALLOW, DENY, or REQUIRE_APPROVAL." },
                                { title: "condition", desc: "Optional RegEx or LLM-based filter for tool arguments." },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 hover:bg-white/[0.02] rounded-2xl transition-colors border border-transparent hover:border-white/5">
                                    <div className="font-mono text-sm text-emerald-400 shrink-0 font-bold">{item.title}</div>
                                    <div className="text-sm text-neutral-500 font-medium">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <a href="https://github.com/wiserautomation" target="_blank" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-black uppercase text-[10px] tracking-widest transition-colors group">
                            Read full draft on GitHub <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>

            {/* CALL TO ACTION */}
            <section className="bg-white text-black rounded-[3rem] p-12 md:p-16 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-none">Ready to <br />integrate?</h2>
                        <p className="text-neutral-600 font-bold max-w-sm">Download the reference library or start securing agents in the cloud with our production API.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-10 py-5 bg-black text-white font-black rounded-2xl hover:bg-neutral-800 transition-all uppercase tracking-widest text-sm flex items-center gap-3 shadow-2xl">
                            Go to Console <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full" />
            </section>
        </div>
    );
}
