
"use client";

import { useState } from "react";
import { Sparkles, MessageSquare, ChevronDown, Copy, ExternalLink, Eye, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AskAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const getMarkdownContent = () => {
        const content = document.getElementById("docs-content");
        if (!content) return "Documentation content not found.";
        
        // Simple text extraction. For a better version, we could use turndown.
        // For now, we'll use innerText cleaned of some UI elements if necessary.
        return content.innerText;
    };

    const handleAsk = (platform: "ChatGPT" | "Claude") => {
        const rawMarkdownContent = getMarkdownContent();
        const promptText = `I have a question regarding this documentation:

${rawMarkdownContent}

My question is: `;

        const baseUrl = platform === "ChatGPT" 
            ? "https://chatgpt.com/?q=" 
            : "https://claude.ai/new?q=";
        
        const url = `${baseUrl}${encodeURIComponent(promptText)}`;
        window.open(url, "_blank");
        setIsOpen(false);
    };

    const handleCopy = () => {
        const rawMarkdownContent = getMarkdownContent();
        navigator.clipboard.writeText(rawMarkdownContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block text-left">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-neutral-900 border border-white/10 rounded-lg hover:border-emerald-500/50 hover:bg-neutral-800 transition-all text-xs font-semibold text-neutral-300 hover:text-white"
            >
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Ask AI
                <ChevronDown className="w-3 h-3 text-neutral-600 transition-transform duration-200" style={{ transform: isOpen ? 'rotate(-180deg)' : 'rotate(0deg)' }} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 mt-2 w-56 bg-neutral-900 border border-white/10 rounded-xl shadow-2xl z-40 overflow-hidden divide-y divide-white/5"
                        >
                            <div className="p-1 px-1.5">
                                <button
                                    onClick={() => handleAsk("ChatGPT")}
                                    className="w-full flex items-center justify-between gap-3 px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <MessageSquare className="w-4 h-4 text-emerald-500" />
                                        ChatGPT
                                    </div>
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40" />
                                </button>
                                <button
                                    onClick={() => handleAsk("Claude")}
                                    className="w-full flex items-center justify-between gap-3 px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                                >
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                        Claude
                                    </div>
                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-40" />
                                </button>
                            </div>
                            <div className="p-1 px-1.5">
                                <button
                                    onClick={handleCopy}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-neutral-500" />}
                                    {copied ? "Markdown Copied" : "Copy Markdown"}
                                </button>
                                <button
                                    onClick={() => alert(getMarkdownContent())}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                >
                                    <Eye className="w-4 h-4 text-neutral-500" />
                                    View as Markdown
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
