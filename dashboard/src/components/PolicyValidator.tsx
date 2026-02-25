"use client";

import { useState } from "react";
import { Check, ShieldAlert, Zap, FileJson } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PolicyValidator() {
    const defaultJson = `{
  "agentId": "agent_123",
  "toolName": "os\\.run",
  "decision": "DENY",
  "environment": "production"
}`;

    const [json, setJson] = useState(defaultJson);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const validate = () => {
        try {
            const parsed = JSON.parse(json);
            const errs = [];

            if (!parsed.agentId) errs.push("Missing required field: agentId");
            if (!parsed.toolName) errs.push("Missing required field: toolName");
            if (!parsed.decision) {
                errs.push("Missing required field: decision");
            } else if (!["ALLOW", "DENY", "REQUIRE_APPROVAL"].includes(parsed.decision)) {
                errs.push("Invalid decision enum. Must be ALLOW, DENY, or REQUIRE_APPROVAL");
            }

            if (errs.length > 0) {
                setIsValid(false);
                setErrors(errs);
            } else {
                setIsValid(true);
                setErrors([]);
            }
        } catch (e) {
            setIsValid(false);
            setErrors(["Invalid JSON format"]);
        }
    };

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A0A0A] shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 bg-black/40 border-b border-white/5">
                <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm">
                    <FileJson className="w-4 h-4" /> AGPS JSON Validator
                </div>
                <button
                    onClick={validate}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1"
                >
                    <Zap className="w-3 h-3" /> Validate Syntax
                </button>
            </div>

            <div className="flex flex-col md:flex-row">
                <textarea
                    className="flex-1 min-h-[250px] bg-transparent text-indigo-300 font-mono text-sm p-4 focus:outline-none resize-none border-b md:border-b-0 md:border-r border-white/10"
                    value={json}
                    onChange={(e) => {
                        setJson(e.target.value);
                        setIsValid(null);
                    }}
                    spellCheck={false}
                />
                <div className="w-full md:w-64 bg-neutral-950 p-4 font-mono text-xs">
                    {isValid === null ? (
                        <div className="text-neutral-500 italic">Ready to validate JSON structure against AGPS v1.0.</div>
                    ) : isValid ? (
                        <div className="text-emerald-400 flex flex-col gap-2">
                            <Badge className="bg-emerald-500/20 text-emerald-500 border-none w-min"><Check className="w-3 h-3 mr-1" /> VALID</Badge>
                            <span>Schema is fully compliant with AgentGate Policy Spec!</span>
                        </div>
                    ) : (
                        <div className="text-rose-400 flex flex-col gap-2">
                            <Badge className="bg-rose-500/20 text-rose-500 border-none w-min"><ShieldAlert className="w-3 h-3 mr-1" /> INVALID</Badge>
                            <ul className="list-disc pl-4 space-y-1">
                                {errors.map((err, i) => <li key={i}>{err}</li>)}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
