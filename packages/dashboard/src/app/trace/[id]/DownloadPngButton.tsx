// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

/**
 * Downloads the trace OG card as a PNG.
 * The image is the same one used for Twitter/OG previews — pre-rendered by /api/og/trace/[id].
 */
export default function DownloadPngButton({ traceId }: { traceId: string }) {
    return (
        <a
            href={`/api/og/trace/${traceId}`}
            download={`suprawall-trace-${traceId}.png`}
            className="flex-1 text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm px-4 py-2.5 rounded-lg transition-colors font-medium border border-zinc-700"
        >
            Download as PNG
        </a>
    );
}
