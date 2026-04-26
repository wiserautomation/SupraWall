// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";

/**
 * Reports a trace as abusive/fake. Calls POST /api/v1/traces/[id]/flag.
 * One click only — disabled after submission to prevent double-reporting.
 */
export default function FlagButton({ traceId }: { traceId: string }) {
    const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

    const onFlag = async () => {
        setState("sending");
        try {
            const res = await fetch(`/api/v1/traces/${traceId}/flag`, { method: "POST" });
            setState(res.ok ? "done" : "error");
        } catch {
            setState("error");
        }
    };

    if (state === "done") {
        return (
            <span className="text-xs text-zinc-500 mt-3 block">
                Reported — the SupraWall team will review this trace.
            </span>
        );
    }

    return (
        <button
            onClick={onFlag}
            disabled={state === "sending"}
            className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors disabled:opacity-50 mt-3 block"
        >
            {state === "sending" ? "Reporting…" : state === "error" ? "Failed — try again" : "Report this trace"}
        </button>
    );
}
