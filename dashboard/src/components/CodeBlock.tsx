"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);

    return (
        <div className="relative group">
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-white/10">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <span className="text-xs text-gray-400 font-mono">{language}</span>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(code);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        {copied
                            ? <><Check className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400">Copied</span></>
                            : <><Copy className="w-3 h-3" />Copy</>
                        }
                    </button>
                </div>
                <pre className="px-4 py-4 text-sm text-emerald-400 font-mono overflow-x-auto leading-relaxed whitespace-pre">
                    {code}
                </pre>
            </div>
        </div>
    );
}
