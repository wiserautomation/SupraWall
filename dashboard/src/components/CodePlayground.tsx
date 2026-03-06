"use client";

import { useState } from "react";
import { Play, Copy, Terminal, ExternalLink, Shield, ShieldCheck, ShieldAlert, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CodePlayground({
    initialCode,
    framework,
    language = "typescript"
}: {
    initialCode: string;
    framework: string;
    language?: string;
}) {
    const [code, setCode] = useState(initialCode);
    const [output, setOutput] = useState<{ type: string; decision?: string; text: string }[]>([]);
    const [policyMode, setPolicyMode] = useState<"ALLOW" | "DENY" | "REQUIRE_APPROVAL">("ALLOW");
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = () => {
        setIsRunning(true);
        // Simulate execution based on policy
        setTimeout(() => {
            const logs: { type: string; decision?: string; text: string }[] = [
                { type: "sys", text: `[Initialization] AgentGate attached to ${framework} agent.` },
                { type: "sys", text: `[Attempt] Executing tool call: os.run("ls -la")` },
            ];

            if (policyMode === "ALLOW") {
                logs.push({ type: "decision", decision: "ALLOW", text: "Policy check passed: Tool 'os.run' allowed by rule '.*'" });
                logs.push({ type: "out", text: "total 42\ndrwxr-xr-x 1 user group 4096 .." });
            } else if (policyMode === "DENY") {
                logs.push({ type: "decision", decision: "DENY", text: "Policy check failed: Tool 'os.run' explicitly denied" });
                logs.push({ type: "err", text: "Error: AgentGate blocked execution of 'os.run'" });
            } else {
                logs.push({ type: "decision", decision: "REQUIRE_APPROVAL", text: "Policy check paused: Tool 'os.run' requires human approval" });
                logs.push({ type: "sys", text: "Agent execution paused waiting for dashboard approval." });
            }

            setOutput(logs);
            setIsRunning(false);
        }, 800);
    };

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0A0A] shadow-2xl flex flex-col md:flex-row">
            <div className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-white/10">
                <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        </div>
                        <span className="text-xs text-neutral-400 font-mono hidden sm:inline-block">editor.ts</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1"><Copy className="w-3 h-3" /> Copy</button>
                    </div>
                </div>
                <div className="p-4 bg-black/20 overflow-x-auto">
                    <pre className="text-sm font-mono text-emerald-300">
                        {code}
                    </pre>
                </div>
            </div>

            <div className="w-full md:w-80 flex flex-col bg-neutral-950">
                <div className="p-4 border-b border-white/5 space-y-3">
                    <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Active Policy Demo</div>
                    <div className="flex gap-2">
                        <button onClick={() => setPolicyMode("ALLOW")} className={`text-[10px] px-2 py-1 rounded-sm border ${policyMode === "ALLOW" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "border-white/10 text-neutral-500"}`}>ALLOW</button>
                        <button onClick={() => setPolicyMode("DENY")} className={`text-[10px] px-2 py-1 rounded-sm border ${policyMode === "DENY" ? "bg-rose-500/20 text-rose-400 border-rose-500/50" : "border-white/10 text-neutral-500"}`}>DENY</button>
                        <button onClick={() => setPolicyMode("REQUIRE_APPROVAL")} className={`text-[10px] px-2 py-1 rounded-sm border ${policyMode === "REQUIRE_APPROVAL" ? "bg-amber-500/20 text-amber-500 border-amber-500/50" : "border-white/10 text-neutral-500"}`}>APPROVAL</button>
                    </div>
                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className="w-full mt-2 py-2 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-sm font-medium transition-all"
                    >
                        {isRunning ? <Terminal className="w-4 h-4 animate-bounce" /> : <Play className="w-4 h-4" />}
                        {isRunning ? "Executing..." : "Run with AgentGate"}
                    </button>
                </div>
                <div className="flex-1 p-4 font-mono text-xs overflow-y-auto space-y-2 h-48 md:h-auto">
                    {output.length === 0 ? (
                        <div className="text-neutral-600 italic">Console ready. Select a policy and hit run.</div>
                    ) : (
                        output.map((log, i) => (
                            <div key={i} className={`flex flex-col gap-1 ${log.type === "sys" ? "text-neutral-400" : log.type === "err" ? "text-rose-400" : "text-emerald-400"}`}>
                                {log.decision && (
                                    <span>
                                        {log.decision === "ALLOW" && <Badge className="bg-emerald-500/20 text-emerald-500 border-none scale-90 origin-left"><ShieldCheck className="w-3 h-3 mr-1" /> ALLOW</Badge>}
                                        {log.decision === "DENY" && <Badge className="bg-rose-500/20 text-rose-500 border-none scale-90 origin-left"><ShieldAlert className="w-3 h-3 mr-1" /> DENY</Badge>}
                                        {log.decision === "REQUIRE_APPROVAL" && <Badge className="bg-amber-500/20 text-amber-500 border-none scale-90 origin-left"><Clock className="w-3 h-3 mr-1" /> OVERRIDE REQ</Badge>}
                                    </span>
                                )}
                                <span>{">"} {log.text}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
