'use client';

import React, { useState } from 'react';
import { Check, Zap, Shield, Users, ArrowRight, DollarSign } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function PricingPage() {
    const [operations, setOperations] = useState(100000);

    const calculateCost = (ops: number) => {
        if (ops <= 100000) return 0;
        return Math.ceil((ops - 100000) / 100000) * 10;
    };

    const cost = calculateCost(operations);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            {/* Hero Section */}
            <div className="relative pt-24 pb-16 px-6 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl pointer-events-none" />

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                    Enterprise security.<br />No enterprise paywalls.
                </h1>
                <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
                    We don't gate security features or tax your headcount. Get full SOC2-ready logging and unlimited seats on day one. Pay only for the compute you use.
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-6 pb-24">
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {/* Developer Card */}
                    <div className="relative group p-8 rounded-3xl bg-neutral-900/50 border border-neutral-800 hover:border-emerald-500/50 transition-all">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-semibold">Developer Hook</h3>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-bold">$0</span>
                            <span className="text-gray-500"> forever</span>
                        </div>

                        <ul className="space-y-4 mb-10 text-gray-400">
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>First 100,000 Guarded Operations / month</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>Unlimited Developers & Seats</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>Unlimited Environments</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>30-day Audit Log Retention</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>All Security Policies & Webhooks</span>
                            </li>
                        </ul>

                        <button className="w-full py-4 rounded-xl font-semibold bg-white text-black hover:bg-gray-200 transition-colors">
                            Start Building Free
                        </button>
                    </div>

                    {/* Production Card */}
                    <div className="relative group p-8 rounded-3xl bg-neutral-900 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)]">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-500 text-black text-xs font-bold uppercase tracking-widest">
                            Most Scalable
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-semibold">Production Scale</h3>
                        </div>

                        <div className="mb-8">
                            <span className="text-4xl font-bold">$10</span>
                            <span className="text-gray-500"> per additional 100k ops</span>
                        </div>

                        <ul className="space-y-4 mb-10 text-gray-400">
                            <li className="flex items-start gap-3 text-emerald-400/80">
                                <Check className="w-5 h-5 shrink-0 mt-0.5" />
                                <span>Everything in Developer</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>1-Year Audit Log Retention</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>High SLA & Priority Support</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>SOC2 Compliance Documentation</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span>Volume Discounts (&gt;10M ops)</span>
                            </li>
                        </ul>

                        <button className="relative w-full py-4 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors overflow-hidden group/btn">
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Add Payment Method <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                        </button>
                    </div>
                </div>

                {/* Cost Estimator Slider */}
                <div className="max-w-3xl mx-auto p-10 rounded-3xl bg-neutral-900/30 border border-neutral-800">
                    <h3 className="text-2xl font-bold mb-8 text-center">Estimate your monthly cost</h3>

                    <div className="mb-10">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Agent Operations</span>
                            <span className="text-3xl font-mono text-emerald-500 font-bold">
                                {operations.toLocaleString()}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="5000000"
                            step="50000"
                            value={operations}
                            onChange={(e) => setOperations(parseInt(e.target.value))}
                            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                        />
                        <div className="flex justify-between mt-2 text-xs text-gray-600 font-medium">
                            <span>0</span>
                            <span>1M</span>
                            <span>2M</span>
                            <span>3M</span>
                            <span>4M</span>
                            <span>5M+</span>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-neutral-800 flex flex-col items-center">
                        <div className="text-sm text-gray-500 uppercase tracking-widest mb-1">Estimated Total</div>
                        <div className="text-6xl font-bold">${cost.toLocaleString()} <span className="text-lg text-gray-600 font-normal">/ month</span></div>
                        <p className="mt-4 text-gray-400 text-sm italic">
                            * First 100,000 operations are totally free. No platform fee.
                        </p>
                    </div>
                </div>

                {/* Global Payouts Section (For Founders) */}
                <div className="mt-24 max-w-4xl mx-auto">
                    <div className="p-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-blue-500/20">
                        <div className="bg-black rounded-[22px] p-10">
                            <div className="flex items-center gap-4 mb-8 text-left">
                                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                                    <DollarSign className="w-8 h-8" />
                                </div>
                                <div className="text-left">
                                    <h2 className="text-3xl font-bold">Global Payouts</h2>
                                    <p className="text-gray-500">How European founders scale supra-wall.com globally.</p>
                                </div>
                            </div>

                            <div className="max-w-none text-gray-400 space-y-6 text-left">
                                <p className="text-lg text-white">
                                    You can charge your customers in <span className="text-emerald-400 font-bold">USD</span> globally, but have Stripe automatically convert and pay you out in <span className="text-blue-400 font-bold">EUR</span>.
                                </p>

                                <div className="grid md:grid-cols-2 gap-8 my-10">
                                    <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                                        <h4 className="text-white font-bold mb-2">Presentment Currency</h4>
                                        <p className="text-sm">What the customer sees and pays (e.g., $49 USD on your pricing page). Keep your pricing global with USD.</p>
                                    </div>
                                    <div className="p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800">
                                        <h4 className="text-white font-bold mb-2">Settlement Currency</h4>
                                        <p className="text-sm">The currency Stripe pays out to your bank account (e.g., EUR to your Revolut). Automatic at mid-market rates.</p>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mt-8 mb-4">How to set this up in Stripe</h3>
                                <ol className="list-decimal pl-5 space-y-4">
                                    <li>Go to your <span className="text-white">Stripe Dashboard &gt; Settings &gt; Bank accounts</span>.</li>
                                    <li>Ensure your <span className="text-emerald-500">EUR account (like Revolut)</span> is added.</li>
                                    <li>If you have a USD bank account connected, <span className="text-red-400 underline decoration-red-500/50">delete it from Stripe entirely</span>.</li>
                                    <li>Set your EUR account as the default payout account.</li>
                                </ol>

                                {/* Checklist Box */}
                                <div className="mt-12 p-8 rounded-3xl bg-neutral-900 border border-neutral-800">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <h4 className="text-lg font-bold text-white">The "Stripe Dashboard" Checklist</h4>
                                    </div>
                                    <ul className="space-y-6 text-sm">
                                        <li className="flex gap-4">
                                            <div className="w-5 h-5 rounded border border-neutral-700 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-gray-200">Log in to Stripe</p>
                                                <p className="text-gray-500 italic">Go to dashboard.stripe.com and log in as the account owner.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-4">
                                            <div className="w-5 h-5 rounded border border-neutral-700 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-gray-200">Navigate to Bank Settings</p>
                                                <p className="text-gray-500 italic">Click Settings gear &gt; Bank accounts and scheduling.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-4">
                                            <div className="w-5 h-5 rounded border border-neutral-700 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-gray-200">Add EUR Account</p>
                                                <p className="text-gray-500 italic">Add your Revolut IBAN and set currency to EUR.</p>
                                            </div>
                                        </li>
                                        <li className="flex gap-4">
                                            <div className="w-5 h-5 rounded border border-neutral-700 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold text-gray-200 text-red-400">Delete the USD Account (Crucial)</p>
                                                <p className="text-gray-500 italic">Remove any Wise or local USD accounts. This forces Stripe to convert all incoming USD to EUR.</p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                {/* Vercel Troubleshooting Section */}
                                <div className="mt-16 border-t border-neutral-800 pt-12 text-left">
                                    <h3 className="text-xl font-bold text-white mb-4">Troubleshooting: Cron Job not appearing?</h3>
                                    <p className="text-gray-500 mb-8">
                                        If you don't see the Cron Job in your Vercel Dashboard, it means Vercel didn't recognize the <code className="text-blue-400">vercel.json</code> file during your last deployment. Follow these steps to fix it:
                                    </p>

                                    <div className="space-y-10">
                                        <div className="relative pl-8 border-l border-neutral-800">
                                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-neutral-900 border-2 border-blue-500" />
                                            <h4 className="text-lg font-bold text-gray-200 mb-2">1. Check File Location</h4>
                                            <p className="text-sm text-gray-400 leading-relaxed">
                                                Ensure <code className="bg-neutral-900 px-2 py-1 rounded text-blue-400">vercel.json</code> is in the <strong>absolute root directory</strong> of your project (same folder as your <code className="text-gray-300">package.json</code> and <code className="text-gray-300">.git</code> folder).
                                            </p>
                                        </div>

                                        <div className="relative pl-8 border-l border-neutral-800">
                                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-neutral-900 border-2 border-blue-500" />
                                            <h4 className="text-lg font-bold text-gray-200 mb-2">2. Trigger a New Build</h4>
                                            <p className="text-sm text-gray-400 leading-relaxed mb-4">
                                                Vercel only parses the configuration during a fresh deployment. Push a new commit to trigger the build:
                                            </p>
                                            <div className="bg-neutral-900 p-4 rounded-xl font-mono text-xs text-blue-400 space-y-1 border border-neutral-800">
                                                <p>git add vercel.json</p>
                                                <p>git commit -m "Add cron job for Stripe"</p>
                                                <p>git push</p>
                                            </div>
                                        </div>

                                        <div className="relative pl-8 border-l border-neutral-800">
                                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-neutral-900 border-2 border-emerald-500" />
                                            <h4 className="text-lg font-bold text-gray-200 mb-2">3. Verify in Vercel Dashboard</h4>
                                            <ul className="text-sm text-gray-400 space-y-2 list-disc pl-4">
                                                <li>Go to your project in Vercel.</li>
                                                <li>Click <span className="text-white">Settings</span> (gear icon).</li>
                                                <li>Click <span className="text-white font-bold">Cron Jobs</span> in the sidebar.</li>
                                                <li>You should now see <code className="text-emerald-400">/api/stripe/report-usage</code> with a "Run" button.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-16 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                                    <h4 className="text-emerald-500 font-bold mb-2 italic">The Trade-off: 1% Conversion Fee</h4>
                                    <p className="text-sm leading-relaxed">
                                        While Stripe charges a 1% fee for this automatic conversion, most European founders find it essential. It removes the headcount and overhead needed to manage international wire thresholds, SWIFT wire problems, and complex USD accounting.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
