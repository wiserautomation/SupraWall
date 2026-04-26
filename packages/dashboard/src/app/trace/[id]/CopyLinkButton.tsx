// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";

/**
 * Client-side copy-link button for the public trace page.
 * Isolated so the parent page stays a server component.
 */
export default function CopyLinkButton({ url }: { url: string }) {
    const [copied, setCopied] = useState(false);

    const onCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard API may be blocked in some browsers; silent fallback.
        }
    };

    return (
        <button
            onClick={onCopy}
            className="flex-1 text-center bg-[#b8ff00]/10 hover:bg-[#b8ff00]/20 text-[#b8ff00] text-sm px-4 py-2.5 rounded-lg transition-colors font-medium border border-[#b8ff00]/20"
        >
            {copied ? "Copied" : "Copy link"}
        </button>
    );
}
