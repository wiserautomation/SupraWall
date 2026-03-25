// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

'use client';

import React, { useState, useMemo } from 'react';
import { Check, Zap, Shield, Users, ArrowRight, DollarSign, Loader2, Gauge, Lock, FileText, Activity, Layers, Globe } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function PricingPage() {
    const [operations, setOperations] = useState(100000);
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [loadingCheckout, setLoadingCheckout] = useState(false);

    /**
     * Board-directed Pricing Model:
     * First 10k: $0
     * 10k - 500k: $0.002
     * 500k - 2M: $0.0015
     * 2M - 10M: $0.001
     * 10M+: $0.0005
     */
    const calculateCost = (ops: number) => {
        let total = 0;
        const freeTier = 10000;
        
        if (ops <= freeTier) return 0;

        // Tier 1: 10k to 500k
        const t1Limit = 500000;
        const t1Ops = Math.min(ops, t1Limit) - freeTier;
        if (t1Ops > 0) total += t1Ops * 0.002;

        // Tier 2: 500k to 2M
        const t2Limit = 2000000;
        if (ops > t1Limit) {
            const t2Ops = Math.min(ops, t2Limit) - t1Limit;
            total += t2Ops * 0.0015;
        }

        // Tier 3: 2M to 10M
        const t3Limit = 10000000;
        if (ops > t2Limit) {
            const t3Ops = Math.min(ops, t3Limit) - t2Limit;
            total += t3Ops * 0.001;
        }

        // Tier 4: 10M+
        if (ops > t3Limit) {
            const t4Ops = ops - t3Limit;
            total += t4Ops * 0.0005;
        }

        return total;
    };

    const cost = useMemo(() => calculateCost(operations), [operations]);

    const handleCheckout = async () => {
        if (!user) {
            router.push('/login');
            return;
        }
        setLoadingCheckout(true);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, email: user.email }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error(data.error);
                setLoadingCheckout(false);
            }
        } catch (e) {
            console.error(e);
            setLoadingCheckout(false);
        }
    };

    const archetypes = [
        { name: "Indie Dev", agents: 1, evals: "3,000", cost: "$0" },
        { name: "Startup", agents: 5, evals: "50,000", cost: "$80" },
        { name: "Growing Co", agents: 20, evals: "300,000", cost: "$580" },
        { name: "Scale-up", agents: 50, evals: "1,000,000", cost: "$1,480" },
        { name: "Mid-Market", agents: 200, evals: "5,000,000", cost: "$5,480" },
        { name: "Enterprise", agents: 1000, evals: "30,000,000", cost: "$15,480" },
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <Navbar />
            {/* 🚀 Hero Section */}
            <div className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase mb-8">
                    Gate Nothing. Meter Everything.
                </div>
                
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 italic uppercase leading-none">
                    One Product. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">All The Brakes.</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 font-medium italic">
                    You don't sell a car without brakes and call them a "premium add-on." SupraWall gives every developer the full security stack — Vault, PII, HITL, and Audit — with no feature gates.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-40">
                {/* 🎯 The Main Pricing Card */}
                <div className="grid lg:grid-cols-3 gap-12 mb-32 items-stretch">
                   
                    {/* Feature List Column (2/3 width on large) */}
                    <div className="lg:col-span-2 p-12 rounded-[3.5rem] bg-neutral-900/30 border border-white/5 backdrop-blur-3xl space-y-12">
                        <div className="grid md:grid-cols-2 gap-10">
                            {[
                                { title: "Secure Vault", icon: <Lock />, desc: "Zero-knowledge secret injection into tool calls." },
                                { title: "PII Scrubbing", icon: <Shield />, desc: "Deterministic redaction of sensitive data." },
                                { title: "HITL Approvals", icon: <Users />, desc: "Route high-risk actions to Slack or Dashboard." },
                                { title: "Article 12 Logs", icon: <FileText />, desc: "Immutable record-keeping for EU AI Act." },
                                { title: "Policy Engine", icon: <Gauge />, desc: "Unlimited deterministic security rules." },
                                { title: "Cost Controls", icon: <DollarSign />, desc: "Hard budget caps to prevent agent runaway." }
                            ].map((f, i) => (
                                <div key={i} className="flex gap-5 group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform flex-shrink-0">
                                        {f.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-black italic uppercase text-white mb-1">{f.title}</h4>
                                        <p className="text-sm text-gray-500 font-medium italic uppercase tracking-tight">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="h-px w-full bg-white/5" />
                        
                        <div className="bg-emerald-500/5 border border-emerald-500/10 p-8 rounded-3xl">
                            <p className="text-emerald-500 font-black uppercase text-xs tracking-widest mb-4">The Sam Altman Rule</p>
                            <p className="text-gray-400 italic font-medium leading-relaxed">
                                "Your features create a compounding security surface — each makes every other more valuable. Separate them and you degrade the product. We gate nothing."
                            </p>
                        </div>
                    </div>

                    {/* The CTA Column */}
                    <div className="p-12 rounded-[3.5rem] bg-emerald-600 border-2 border-emerald-400 text-white shadow-[0_40px_80px_rgba(16,185,129,0.3)] flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Zap className="w-40 h-40" />
                        </div>
                        
                        <div className="space-y-6 relative z-10">
                            <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Standard <br />Access</h3>
                            <div className="h-1 w-12 bg-white" />
                            <p className="text-sm font-black uppercase tracking-widest text-emerald-100 italic">Unlimited agents. Unlimited policies.</p>
                            
                            <div className="py-4">
                                <div className="text-6xl font-black italic tracking-tighter leading-none">$0.0028</div>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-200 mt-2">Starting price / policy evaluation</p>
                            </div>

                            <ul className="space-y-3">
                                {["All 6 security features", "Full Dashboard", "Every SDK integration", "Volume discounts build-in"].map((item, id) => (
                                    <li key={id} className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest italic">
                                        <Check className="w-4 h-4 text-white" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="pt-10 space-y-4">
                            <button 
                                onClick={handleCheckout} 
                                disabled={loadingCheckout}
                                className="w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-tighter text-xl hover:scale-[1.02] transition-transform shadow-2xl disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loadingCheckout ? <Loader2 className="w-6 h-6 animate-spin" /> : "Deploy Now"}
                            </button>
                            <p className="text-[10px] font-black uppercase text-center text-emerald-100 tracking-[0.2em]">Usage-based. Cancel anytime.</p>
                        </div>
                    </div>
                </div>

                {/* 💰 Cost Estimator Section */}
                <div className="max-w-5xl mx-auto mb-40 text-center space-y-16">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black italic uppercase tracking-tighter">Measure Your <span className="text-emerald-500">Security ROI.</span></h2>
                        <p className="text-neutral-500 font-bold uppercase tracking-widest">Pricing that scales with your agent's autonomy.</p>
                    </div>

                    <div className="p-16 rounded-[4rem] bg-neutral-900/40 border border-white/5 relative overflow-hidden">
                        <div className="grid md:grid-cols-5 gap-16 items-center">
                            
                            {/* Slider Side */}
                            <div className="md:col-span-3 space-y-10 text-left">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 italic">
                                        <span>Monthly Volume</span>
                                        <span className="text-white text-xl">{operations.toLocaleString()}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="50000000"
                                        step="10000"
                                        value={operations}
                                        onChange={(e) => setOperations(parseInt(e.target.value))}
                                        className="w-full h-3 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="flex justify-between text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                                        <span>0</span>
                                        <span>10M</span>
                                        <span>20M</span>
                                        <span>30M</span>
                                        <span>40M</span>
                                        <span>50M+</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                                        <p className="text-[10px] font-black uppercase text-neutral-500 italic">Estimated Bill</p>
                                        <p className="text-4xl font-black italic tracking-tighter">${Math.floor(cost).toLocaleString()}</p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                                        <p className="text-[10px] font-black uppercase text-neutral-500 italic">Evals / Month</p>
                                        <p className="text-4xl font-black italic tracking-tighter">{operations.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tiers Visual Side */}
                            <div className="md:col-span-2 space-y-6">
                                {[
                                    { label: "0 – 10K", price: "Free" },
                                    { label: "10K – 500K", price: "$0.002" },
                                    { label: "500K – 2M", price: "$0.0015" },
                                    { label: "2M – 10M", price: "$0.001" },
                                    { label: "10M+", price: "$0.0005" }
                                ].map((tier, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-neutral-900 border border-white/5 font-black uppercase text-[10px] tracking-widest group hover:border-emerald-500/30 transition-colors">
                                        <span className="text-neutral-500 group-hover:text-white transition-colors">{tier.label}</span>
                                        <span className="text-emerald-500 italic">{tier.price} <span className="text-[8px] opacity-40">/ eval</span></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 💼 Archetype Table */}
                <div className="max-w-4xl mx-auto mb-40 space-y-12">
                     <h3 className="text-3xl font-black italic uppercase tracking-tighter text-center">Projected Costs</h3>
                     <div className="overflow-x-auto rounded-[3rem] border border-white/5 bg-neutral-900/20">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead>
                                <tr>
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-neutral-500 italic">Organization</th>
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-neutral-500 italic">Avg. Agents</th>
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-neutral-500 italic">Evals / Mo</th>
                                    <th className="p-8 text-[11px] font-black uppercase tracking-[0.4em] text-emerald-500 italic">Est. Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {archetypes.map((row, i) => (
                                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-8 border-t border-white/5 font-black uppercase italic tracking-tighter">{row.name}</td>
                                        <td className="p-8 border-t border-white/5 text-neutral-400 font-bold">{row.agents}</td>
                                        <td className="p-8 border-t border-white/5 text-neutral-400 font-bold">{row.evals}</td>
                                        <td className="p-8 border-t border-white/5 text-white font-black italic">{row.cost} <span className="text-[10px] text-neutral-500 font-bold tracking-widest font-sans opacity-50">/MONTH</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>

                {/* 🏢 Enterprise Section */}
                <div className="max-w-4xl mx-auto p-16 rounded-[4rem] bg-gradient-to-br from-neutral-900 to-black border-2 border-white/5 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                        <Globe className="w-56 h-56" />
                     </div>
                     
                     <div className="space-y-8 relative z-10">
                        <div className="p-4 bg-emerald-500/10 rounded-3xl w-fit text-emerald-500">
                            <Layers className="w-10 h-10" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Enterprise Operational Layer</h2>
                            <p className="text-gray-400 font-medium italic leading-relaxed max-w-2xl">
                                For organizations with large-scale deployment and procurement requirements. Same product, different service level.
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 italic">
                            {["Annual Contracts & POs", "Single Sign-On (SAML/SSO)", "Sub-10ms SLA Guarantee", "Self-Hosted / Air-Gapped", "SIEM Export (Datadog/Splunk)", "Dedicated Support & CSM"].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Check className="w-4 h-4 text-emerald-500" />
                                    {item}
                                </div>
                            ))}
                        </div>

                        <div className="pt-6">
                            <button className="px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-tighter text-lg hover:bg-emerald-500 hover:text-white transition-all transform hover:translate-x-2">
                                Talk to Enterprise →
                            </button>
                        </div>
                     </div>
                </div>

            </div>
            <Footer />
        </div>
    );
}
