// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { CodeBlock } from "@/components/CodeBlock";
import Link from "next/link";
import { ArrowRight, Github, Zap } from "lucide-react";

export default function HermesGuide() {
    const installCode = `pip install suprawall-hermes`;

    const configCode = `# ~/.hermes/config.yaml
plugins:
  enabled:
    - suprawall-security`;

    const envCode = `export SUPRAWALL_API_KEY=sw_your_key_here
# Optional hardening
export SUPRAWALL_FAIL_MODE=fail-closed
export SUPRAWALL_MAX_COST_USD=5.00
export SUPRAWALL_LOOP_DETECTION=true`;

    const vaultCode = `# Hermes Agent will now use this tool to retrieve secrets:
# "Get my GITHUB_TOKEN from the vault"
# → calls suprawall_vault_get("GITHUB_TOKEN")
# → returns secret value without exposing it in the prompt`;

    const slashCode = `/suprawall status
# → 🛡️ Shield: ACTIVE | Budget: $0.42/$5.00 | Audited: 38 tool calls

/suprawall audit
# → Shows last 10 tool calls with timestamps and budget impact

/suprawall budget
# → Session spend: $0.42 / $5.00`;

    const envVarsCode = `SUPRAWALL_API_KEY=sw_...         # Required. Your SupraWall API key.
SUPRAWALL_FAIL_MODE=fail-closed  # fail-closed (default) | fail-open
SUPRAWALL_MAX_COST_USD=5.00      # Hard budget cap per Hermes session
SUPRAWALL_ALERT_USD=4.00         # Soft alert threshold
SUPRAWALL_MAX_ITERATIONS=100     # Circuit breaker: max tool calls
SUPRAWALL_LOOP_DETECTION=true    # Block identical consecutive tool calls
SUPRAWALL_TENANT_ID=my-team      # Tenant ID for vault and policies
SUPRAWALL_URL=https://...        # Override policy engine URL`;

    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-violet-500/20 text-violet-300 rounded-full text-xs font-semibold uppercase tracking-wider">Agent Plugin</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold uppercase tracking-wider">Python</span>
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold uppercase tracking-wider">Self-Hosted</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    Hermes Agent Integration
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    Install the SupraWall plugin to gate every Hermes tool call with deterministic ALLOW/DENY enforcement, PII scrubbing, and credential vault injection.
                </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 p-6 bg-violet-500/10 border border-violet-500/20 rounded-2xl items-center sm:justify-between">
                <div className="space-y-1">
                    <h3 className="text-white font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" /> 22,000+ GitHub stars</h3>
                    <p className="text-neutral-400 text-sm">Hermes is the fastest-growing self-hosted AI agent of 2026. Secure it in under 2 minutes.</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <a href="https://github.com/wiserautomation/SupraWall" target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-colors text-sm">
                        <Github className="w-4 h-4" /> Clone Repo
                    </a>
                    <Link href="/integrations/hermes" className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-violet-500/30 text-violet-300 hover:border-violet-500/60 font-medium rounded-xl transition-colors text-sm">
                        Integration Page
                    </Link>
                </div>
            </div>

            {/* STEP 1 */}
            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">1. Installation</h2>
                <p className="text-neutral-400 text-sm">Install the SupraWall Hermes plugin from PyPI. It depends on <code className="text-violet-300">suprawall-sdk</code> which is installed automatically.</p>
                <CodeBlock code={installCode} language="bash" />
            </div>

            {/* STEP 2 */}
            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">2. Enable the Plugin</h2>
                <p className="text-neutral-400 text-sm">Add <code className="text-violet-300">suprawall-security</code> to your Hermes config. For project-specific plugins, also set <code className="text-violet-300">HERMES_ENABLE_PROJECT_PLUGINS=true</code>.</p>
                <CodeBlock code={configCode} language="yaml" />
            </div>

            {/* STEP 3 */}
            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">3. Set Environment Variables</h2>
                <p className="text-neutral-400 text-sm">Only <code className="text-violet-300">SUPRAWALL_API_KEY</code> is required. All other variables are optional hardening configuration.</p>
                <CodeBlock code={envCode} language="bash" />
            </div>

            {/* VAULT */}
            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">4. Vault — Secure Credential Injection</h2>
                <p className="text-neutral-400 text-sm">
                    The plugin registers a <code className="text-violet-300">suprawall_vault_get</code> tool. Hermes can retrieve secrets by name without exposing them in prompts or tool arguments. Secrets are injected at runtime from the SupraWall vault and scrubbed from results after execution.
                </p>
                <CodeBlock code={vaultCode} language="bash" />
            </div>

            {/* SLASH COMMANDS */}
            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">5. Slash Commands</h2>
                <p className="text-neutral-400 text-sm">Available in Hermes CLI, Telegram gateway, and Discord sessions. Use these to monitor your agent security posture in real time.</p>
                <CodeBlock code={slashCode} language="bash" />
            </div>

            {/* CONFIG REFERENCE */}
            <div className="space-y-6 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">Full Configuration Reference</h2>
                <CodeBlock code={envVarsCode} language="bash" />
            </div>

            {/* HOOKS EXPLAINED */}
            <div className="space-y-4 pt-4">
                <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">How the Hooks Work</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        {
                            hook: "pre_tool_call",
                            color: "emerald",
                            desc: "Fires before every tool execution. Evaluates the planned call against your SupraWall policies. Returns {blocked: true} to veto the call, or null to allow it.",
                        },
                        {
                            hook: "post_tool_call",
                            color: "violet",
                            desc: "Fires after every tool execution. Scrubs PII from results, appends to the audit log, and records cost against your budget cap.",
                        },
                    ].map(({ hook, color, desc }) => (
                        <div key={hook} className={`p-6 rounded-2xl bg-${color}-500/5 border border-${color}-500/20`}>
                            <code className={`text-${color}-400 font-mono text-sm font-bold`}>{hook}</code>
                            <p className="text-neutral-400 text-sm mt-3 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* NEXT */}
            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <Link href="/docs/frameworks/langchain" className="text-neutral-400 hover:text-white transition-colors text-sm">← LangChain</Link>
                <Link href="/integrations/hermes" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors flex items-center gap-1 text-sm">
                    Integration Page <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}
