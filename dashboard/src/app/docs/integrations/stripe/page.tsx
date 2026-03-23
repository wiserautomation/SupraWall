"use client";

import { CodeBlock } from "@/components/CodeBlock";
import { Shield, Zap, Search, Eye, BadgeDollarSign, Lock, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function StripeDocs() {
    return (
        <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500 pb-20">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold uppercase tracking-wider">Integration Guide</span>
                    <span className="px-3 py-1 bg-neutral-500/20 text-neutral-300 rounded-full text-xs font-semibold uppercase tracking-wider">FinTech</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                    Stripe App Marketplace
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl leading-relaxed">
                    Audit agent costs, protect API keys, and automate budget enforcement directly from your Stripe Dashboard.
                </p>
            </div>

            <div className="p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                <h3 className="text-white font-bold flex items-center gap-2 mb-2">
                    <BadgeDollarSign className="w-5 h-5 text-blue-400" /> Wallet-First Security
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                    SupraWall for Stripe allows you to monitor metered billing events and detect rogue agent loops before they drain your balance.
                </p>
            </div>

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">1. Installation</h2>
                    <p className="text-neutral-400 text-sm">
                        Install the SupraWall app from the <Link href="https://marketplace.stripe.com" className="text-blue-400 hover:underline">Stripe App Marketplace</Link>.
                    </p>
                    <CodeBlock code="stripe apps start --app-id com.suprawall.app" language="bash" />
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">2. Core Features</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-xl bg-neutral-900 border border-white/5 space-y-3">
                            <div className="flex items-center gap-3 text-blue-400">
                                <RefreshCcw className="w-5 h-5" />
                                <h4 className="font-bold text-white uppercase tracking-tighter">Usage Audit</h4>
                            </div>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                                Statistical analysis (StdDev) of your metered billing to identify cost spikes and rogue loops.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-neutral-900 border border-white/5 space-y-3">
                            <div className="flex items-center gap-3 text-emerald-400">
                                <Lock className="w-5 h-5" />
                                <h4 className="font-bold text-white uppercase tracking-tighter">Secure Vault</h4>
                            </div>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                                Wrap Restricted API Keys (RAKs) in SupraWall. Agents use vault tokens, not raw keys.
                            </p>
                        </div>
                        <div className="p-5 rounded-xl bg-neutral-900 border border-white/5 space-y-3">
                            <div className="flex items-center gap-3 text-rose-400">
                                <Shield className="w-5 h-5" />
                                <h4 className="font-bold text-white uppercase tracking-tighter">Budget Control</h4>
                            </div>
                            <p className="text-xs text-neutral-500 leading-relaxed">
                                Automated safety switch: Revoke agent permissions instantly when customer payments fail.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide border-b border-white/10 pb-2">3. Security Architecture</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                        The SupraWall Stripe App operates in a secure, sandboxed iframe within the Stripe Dashboard. It uses **Stripe Connect (OAuth)** to securely access billing data without ever seeing your primary secret keys.
                    </p>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-white/5">
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-xs text-neutral-300">
                                <Search className="w-3 h-3 text-blue-400" />
                                <b>Read-only access</b> to Billing Meter events.
                            </li>
                            <li className="flex items-center gap-2 text-xs text-neutral-300">
                                <Shield className="w-3 h-3 text-emerald-400" />
                                <b>Zero-knowledge storage</b> for Restricted API Keys.
                            </li>
                            <li className="flex items-center gap-2 text-xs text-neutral-300">
                                <Zap className="w-3 h-3 text-rose-400" />
                                <b>Real-time webhooks</b> for automated budget enforcement.
                            </li>
                        </ul>
                    </div>
                </section>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-white/10">
                <Link href="/docs/integrations/openclaw" className="text-neutral-400 hover:text-white transition-colors text-sm">← OpenClaw</Link>
                <Link href="/stripe" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center">Value Overview →</Link>
            </div>
        </div>
    );
}
