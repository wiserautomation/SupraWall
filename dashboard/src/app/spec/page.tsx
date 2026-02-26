"use client";

import { motion } from "framer-motion";
import { Shield, CheckCircle2, AlertCircle, Terminal, FileCode, ExternalLink, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function SpecPage() {
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
                <div className="inline-flex p-3 bg-indigo-500/10 rounded-full mb-2">
                    <Shield className="w-8 h-8 text-indigo-400" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                    AgentGate Policy Spec (AGPS)
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    The open standard for AI agent governance. AGPS defines a unified JSON format for intercepting tool calls and enforcing security boundaries.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
                {/* VALIDATOR SIDE */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-indigo-400" /> Policy Validator
                        </h3>
                        <span className="text-xs text-neutral-500 font-mono">v1.0.0-draft</span>
                    </div>
                    <div className="relative group">
                        <textarea
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                            className="w-full h-80 bg-[#0D0D0D] border border-white/10 rounded-xl p-6 font-mono text-sm text-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
                            spellCheck={false}
                        />
                        <button
                            onClick={validateJson}
                            className="absolute bottom-4 right-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-lg transition-transform active:scale-95"
                        >
                            Validate Spec
                        </button>
                    </div>

                    {isValid === true && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-emerald-400">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-medium">Valid AGPS Policy! Ready for deployment.</span>
                        </motion.div>
                    )}

                    {isValid === false && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                            <AlertCircle className="w-5 h-5" />
                            <span className="text-sm font-medium">Invalid Spec: {errorMessage}</span>
                        </motion.div>
                    )}
                </div>

                {/* THE SPEC SIDE */}
                <div className="space-y-8">
                    <div className="p-6 bg-neutral-900/50 border border-white/5 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500" />
                        <h4 className="text-white font-bold mb-2">Why an Open Standard?</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed">
                            AI agents are becoming autonomous. Without a standard way to describe what they can and cannot do, security becomes fragmented and proprietary. AGPS ensures that your security policies are portable across any provider.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-white font-bold flex items-center gap-2">Core Objects</h4>
                        <div className="space-y-3">
                            {[
                                { title: "version", desc: "Required. Currently '1.0'. Manages spec schema compatibility." },
                                { title: "toolName", desc: "The ID of the tool being intercepted (e.g. 'search', 'email_send', '*')." },
                                { title: "action", desc: "ALLOW, DENY, or REQUIRE_APPROVAL." },
                                { title: "condition", desc: "Optional RegEx or LLM-based filter for tool arguments." },
                            ].map((item, idx) => (
                                <div key={idx} className="flex gap-4 p-4 hover:bg-white/[0.02] rounded-xl transition-colors">
                                    <div className="font-mono text-sm text-indigo-400 shrink-0">{item.title}</div>
                                    <div className="text-sm text-neutral-500">{item.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4">
                        <a href="https://github.com/wiserautomation" target="_blank" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                            Read full draft on GitHub <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>

            {/* CALL TO ACTION */}
            <section className="bg-indigo-600 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Ready to integrate?</h2>
                        <p className="text-indigo-100 opacity-80">Download the reference library or start securing agents in the cloud.</p>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-neutral-100 transition-colors flex items-center gap-2">
                            Go to Console <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 blur-3xl rounded-full" />
            </section>
        </div>
    );
}
