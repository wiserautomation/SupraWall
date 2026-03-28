// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

'use client';

import React, { useState, useMemo } from 'react';
import { Check, X, Minus, Zap, Shield, Users, ArrowRight, DollarSign, Loader2, Globe, Github, Code2, ChevronRight } from 'lucide-react';
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

// ─────────────────────────────────────────────
// Feature comparison data
// ─────────────────────────────────────────────
type Cell = string | boolean | null;

interface FeatureRow {
    name: string;
    free: Cell;
    cloud: Cell;
    enterprise: Cell;
    highlight?: boolean; // marks upgrade-wall rows
}

const FEATURES: { category: string; rows: FeatureRow[] }[] = [
    {
        category: 'Policy Engine',
        rows: [
            { name: 'Regex-based rules', free: true, cloud: true, enterprise: true },
            { name: 'AI-powered policies', free: false, cloud: true, enterprise: true, highlight: true },
            { name: 'Article 9 Risk Templates', free: false, cloud: true, enterprise: true, highlight: true },
            { name: 'Custom policy models', free: false, cloud: false, enterprise: true },
        ],
    },
    {
        category: 'Vault',
        rows: [
            { name: 'Secret storage', free: '10 secrets', cloud: 'Unlimited', enterprise: 'Dedicated HSM', highlight: true },
            { name: 'Auto-rotation', free: false, cloud: true, enterprise: true },
            { name: 'Custom KMS / HSM', free: false, cloud: false, enterprise: true },
        ],
    },
    {
        category: 'Integrations',
        rows: [
            { name: 'LangChain plugin', free: true, cloud: true, enterprise: true },
            { name: 'Vercel AI SDK', free: true, cloud: true, enterprise: true },
            { name: 'CrewAI / AutoGen / LlamaIndex', free: false, cloud: true, enterprise: true, highlight: true },
            { name: 'Custom framework support', free: false, cloud: false, enterprise: true },
        ],
    },
    {
        category: 'Threat Detection',
        rows: [
            { name: 'Layer 1: Regex patterns (<2ms)', free: true, cloud: true, enterprise: true },
            { name: 'Layer 2: AI Semantic Analysis', free: false, cloud: 'Growth+', enterprise: true, highlight: true },
            { name: 'Behavioral anomaly detection', free: false, cloud: 'Business+', enterprise: true, highlight: true },
            { name: 'Custom fine-tuned threat model', free: false, cloud: false, enterprise: true },
        ],
    },
    {
        category: 'Audit & Compliance Suite',
        rows: [
            { name: 'Log retention', free: '7 days', cloud: '90d - 3yr', enterprise: '7+ years', highlight: true },
            { name: 'Audit exports (JSON)', free: true, cloud: true, enterprise: true },
            { name: 'Branded PDF Reports', free: false, cloud: true, enterprise: true, highlight: true },
            { name: 'EU AI Act Compliance Mapping', free: false, cloud: 'Included', enterprise: 'Full Suite', highlight: true },
            { name: 'RSA-signed audit trails', free: false, cloud: false, enterprise: true },
            { name: 'Data residency (EU-only)', free: false, cloud: false, enterprise: true },
        ],
    },
    {
        category: 'Approvals',
        rows: [
            { name: 'API polling', free: true, cloud: true, enterprise: true },
            { name: 'Slack + Dashboard', free: false, cloud: true, enterprise: true, highlight: true },
            { name: 'Workflows & Escalations', free: false, cloud: false, enterprise: true },
        ],
    },
    {
        category: 'Procurement & Legal',
        rows: [
            { name: 'Data Processing Agreement (DPA)', free: false, cloud: 'Available', enterprise: 'Included', highlight: true },
            { name: 'BAA (Healthcare)', free: false, cloud: false, enterprise: true },
            { name: 'Custom MSA support', free: false, cloud: false, enterprise: true },
            { name: 'SOC 2 Type II certified', free: false, cloud: false, enterprise: true },
        ],
    },
    {
        category: 'Agents & Operations',
        rows: [
            { name: 'Agents', free: '3 max', cloud: 'Unlimited', enterprise: 'Unlimited', highlight: true },
            { name: 'Operations / month', free: '10K', cloud: 'Usage-based', enterprise: 'Fixed price', highlight: true },
            { name: 'Budget enforcement', free: false, cloud: true, enterprise: true },
        ],
    },
    {
        category: 'Dashboard & Access',
        rows: [
            { name: 'Managed Dashboard', free: false, cloud: true, enterprise: 'VPC / Air-gapped' },
            { name: 'Self-hostable OSS Dashboard', free: true, cloud: false, enterprise: false },
            { name: 'SSO (SAML/SCIM)', free: false, cloud: false, enterprise: true },
            { name: 'White-labeling', free: false, cloud: false, enterprise: true },
        ],
    },
    {
        category: 'Support & Success',
        rows: [
            { name: 'GitHub issues', free: true, cloud: true, enterprise: true },
            { name: 'Email support', free: false, cloud: 'Priority', enterprise: 'Dedicated Line' },
            { name: 'Implementation Engineer', free: false, cloud: false, enterprise: true },
        ],
    },
];

// ─────────────────────────────────────────────
// ROI Calculator data
// ─────────────────────────────────────────────
const calculateCost = (ops: number) => {
    let total = 0;
    if (ops <= 10000) return 0;
    const t1Ops = Math.min(ops, 500000) - 10000;
    if (t1Ops > 0) total += t1Ops * 0.002;
    if (ops > 500000) total += (Math.min(ops, 2000000) - 500000) * 0.0015;
    if (ops > 2000000) total += (Math.min(ops, 10000000) - 2000000) * 0.001;
    if (ops > 10000000) total += (ops - 10000000) * 0.0005;
    return total;
};

function CellIcon({ value }: { value: Cell }) {
    if (value === true) return <Check className="w-4 h-4 text-emerald-500 mx-auto" />;
    if (value === false) return <X className="w-4 h-4 text-neutral-700 mx-auto" />;
    if (value === null) return <Minus className="w-4 h-4 text-neutral-700 mx-auto" />;
    return <span className="text-[11px] font-bold text-white/80">{value}</span>;
}

export default function PricingPage() {
    const [operations, setOperations] = useState(100000);
    const [user] = useAuthState(auth);
    const router = useRouter();

    React.useEffect(() => {
        // Stealth launch redirect
        router.push('/beta');
    }, [router]);

    const [loadingCheckout, setLoadingCheckout] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<'starter' | 'growth' | 'business'>('growth');

    const cloudPrices = { starter: 49, growth: 149, business: 499 };
    const overage = Math.max(0, calculateCost(operations));
    const planBase = cloudPrices[selectedPlan];

    const handleCheckout = async (plan: string) => {
        if (!user) { router.push('/login'); return; }
        setLoadingCheckout(true);
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, email: user.email, plan }),
            });
            const data = await response.json();
            if (data.url) window.location.href = data.url;
            else { console.error(data.error); setLoadingCheckout(false); }
        } catch (e) { console.error(e); setLoadingCheckout(false); }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <Navbar />

            {/* Hero */}
            <div className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
                <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase mb-8">
                    Gated Open Core — Free Until Production
                </div>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 italic uppercase leading-none">
                    Start Free.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Scale With Confidence.</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 font-medium italic leading-relaxed">
                    Developer tier for solo builders. Business for scaling production. Enterprise for Article 9 compliance and legal-grade security.
                </p>

                {/* Abstract Social Proof */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24 mt-20 pb-12 border-b border-white/5 mx-auto max-w-5xl">
                    <div className="group">
                        <div className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase mb-2 group-hover:text-emerald-500 transition-colors leading-none">2.3B+</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 italic">Interactions Secured</p>
                    </div>
                    <div className="w-px h-12 bg-white/5 hidden md:block" />
                    <div className="group">
                        <div className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase mb-2 leading-none">Fortune 500</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 italic">Ready Infrastructure</p>
                    </div>
                    <div className="w-px h-12 bg-white/5 hidden md:block" />
                    <div className="group">
                        <div className="text-2xl md:text-3xl font-black italic tracking-tighter uppercase mb-2 leading-none leading-none">Series A+</div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 italic">Production Scale</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6">

                {/* 3-Column Plan Cards */}
                <div className="grid lg:grid-cols-3 gap-8 mb-24 items-stretch">

                    {/* Free */}
                    <div className="p-10 rounded-[3rem] bg-neutral-900/30 border border-white/5 backdrop-blur-3xl flex flex-col justify-between hover:border-emerald-500/20 transition-all group">
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-white/5 rounded-2xl text-neutral-400 group-hover:text-white transition-colors"><Code2 className="w-8 h-8" /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 py-1 px-3 border border-white/5 rounded-full">Apache 2.0</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Developer</h3>
                                <p className="text-xs font-bold text-neutral-500 uppercase italic mt-1 leading-relaxed">Self-host on your own infrastructure. No credit card.</p>
                            </div>
                            <div className="py-4">
                                <div className="text-5xl font-black italic tracking-tighter">$0</div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-2">Free for individuals</p>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    '3 agents',
                                    '10 vault secrets',
                                    '10K ops / month',
                                    '7-day audit logs',
                                    'JSON status API (no PDF)',
                                    'LangChain + Vercel AI plugins',
                                    'PostgreSQL adapter',
                                    'GitHub issues support',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest italic text-neutral-400">
                                        <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link
                            href="https://github.com/suprawall/suprawall"
                            target="_blank"
                            className="mt-10 w-full py-4 rounded-xl border-2 border-white/10 text-white font-black uppercase tracking-tighter text-lg hover:bg-white/5 transition-all text-center flex items-center justify-center gap-2"
                        >
                            <Github className="w-5 h-5" /> View on GitHub
                        </Link>
                    </div>

                    {/* Cloud (Featured) */}
                    <div className="p-10 rounded-[3rem] bg-emerald-600 border-2 border-emerald-400 text-white shadow-[0_40px_80px_rgba(16,185,129,0.2)] flex flex-col justify-between relative overflow-hidden scale-105 z-10">
                        <div className="absolute top-0 right-0 p-6 opacity-10"><Zap className="w-32 h-32" /></div>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-white/20 rounded-2xl"><Globe className="w-8 h-8" /></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100 py-1 px-3 bg-emerald-700/50 rounded-full">Most Popular</span>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Cloud</h3>
                                <p className="text-xs font-bold text-emerald-100 uppercase italic mt-1 leading-relaxed">Managed, compliance-ready. Unlimited agents & operations.</p>
                            </div>

                            {/* Plan selector */}
                            <div className="grid grid-cols-3 gap-2 bg-emerald-700/40 p-1 rounded-xl">
                                {(['starter', 'growth', 'business'] as const).map(plan => (
                                    <button
                                        key={plan}
                                        onClick={() => setSelectedPlan(plan)}
                                        className={cn(
                                            "py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all text-center",
                                            selectedPlan === plan ? "bg-white text-black" : "text-emerald-200 hover:text-white"
                                        )}
                                    >
                                        {plan}
                                    </button>
                                ))}
                            </div>

                            <div className="py-2">
                                <div className="text-5xl font-black italic tracking-tighter">${cloudPrices[selectedPlan]}<span className="text-2xl">/mo</span></div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200 mt-2">
                                    {selectedPlan === 'starter' && '+ $0.002/eval after 50K'}
                                    {selectedPlan === 'growth' && '+ $0.002/eval after 500K'}
                                    {selectedPlan === 'business' && '+ $0.001/eval after 5M'}
                                </p>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    'Unlimited agents',
                                    'Unlimited vault secrets (HSM)',
                                    '90-day to 3-year retention',
                                    'Layer 1 + Layer 2: AI semantic analysis',
                                    'Behavioral anomaly detection (Business+)',
                                    'Slack + Dashboard approvals',
                                    'PDF compliance reports',
                                    'All framework plugins (CrewAI, etc.)',
                                    'Regulator-ready evidence',
                                    '99.9% SLA',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest italic">
                                        <Check className="w-3 h-3 text-white flex-shrink-0" />{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button
                            onClick={() => handleCheckout(selectedPlan)}
                            disabled={loadingCheckout}
                            className="mt-10 w-full py-5 rounded-2xl bg-white text-black font-black uppercase tracking-tighter text-xl hover:scale-[1.02] transition-transform shadow-2xl flex items-center justify-center gap-2"
                        >
                            {loadingCheckout ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Deploy Now <ChevronRight className="w-5 h-5" /></>}
                        </button>
                    </div>

                    {/* Enterprise */}
                    <div className="p-10 rounded-[3rem] bg-neutral-900/30 border border-white/5 backdrop-blur-3xl flex flex-col justify-between hover:border-blue-500/30 transition-all group">
                        <div className="space-y-6">
                            <div className="flex justify-between items-start">
                                <div className="p-3 bg-white/5 rounded-2xl text-neutral-400 group-hover:text-blue-400 transition-colors"><Shield className="w-8 h-8" /></div>
                            </div>
                            <div>
                                <h3 className="text-3xl font-black italic uppercase tracking-tighter">Enterprise</h3>
                                <p className="text-xs font-bold text-neutral-500 uppercase italic mt-1 leading-relaxed">Dedicated clusters, air-gapped, and certified safety.</p>
                            </div>
                            <div className="py-4">
                                <div className="text-5xl font-black italic tracking-tighter">Custom</div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-2">Starting at $25,000 / year</p>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    'Everything in Cloud',
                                    'Self-hosted / VPC / Air-gapped',
                                    'Layer 1 + Layer 2 + custom AI model',
                                    'EU AI Act Compliance Suite',
                                    'SSO + SCIM',
                                    'White-label dashboard',
                                    '7+ year audit retention',
                                    'SOC 2 certified',
                                    'Custom KMS + HSM',
                                    '24/7 dedicated support + SLA',
                                    'Annual contracts + POs',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest italic text-neutral-400">
                                        <Check className="w-3 h-3 text-blue-500 flex-shrink-0" />{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <button className="mt-10 w-full py-4 rounded-xl border-2 border-white/10 text-white font-black uppercase tracking-tighter text-lg hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
                            Contact Sales
                        </button>
                    </div>
                </div>

                {/* Two-Layer Architecture Explainer */}
                <div className="mb-24">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-center mb-4">
                        Two-Layer <span className="text-emerald-500">Defense Architecture</span>
                    </h2>
                    <p className="text-center text-neutral-500 text-sm font-medium italic mb-12 max-w-2xl mx-auto">
                        Regex catches what you know. AI catches what you don&apos;t.
                    </p>

                    <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {/* Layer 1 */}
                        <div className="p-8 rounded-[2rem] bg-neutral-900/40 border border-white/[0.06] space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                    <Shield className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tighter text-white italic">Layer 1 — Deterministic</h3>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">All tiers</p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    'Sub-2ms latency, zero network calls',
                                    'Zero false negatives on known patterns',
                                    '26+ regex rules (SQLi, XSS, prompt injection)',
                                    'Budget caps, vault, scope verification',
                                    'Deterministic — same input, same decision',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[10px] font-bold text-neutral-400 uppercase tracking-widest italic">
                                        <Check className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />{item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Layer 2 */}
                        <div className="p-8 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                                    <Zap className="w-5 h-5 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black uppercase tracking-tighter text-white italic">Layer 2 — AI Semantic</h3>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Growth tier and above</p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    'Context-aware argument analysis (LLM-powered)',
                                    'Cross-tool attack sequence detection',
                                    'Behavioral anomaly scoring (Business+)',
                                    'Confidence routing: DENY / HITL / FLAG',
                                    'Custom fine-tuned models (Enterprise)',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-[10px] font-bold text-neutral-300 uppercase tracking-widest italic">
                                        <Check className="w-3 h-3 text-emerald-400 mt-0.5 flex-shrink-0" />{item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Full Feature Comparison Table */}
                <div className="mb-32">
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter text-center mb-12">
                        Full Feature <span className="text-emerald-500">Comparison</span>
                    </h2>
                    <div className="rounded-[2rem] border border-white/5 overflow-hidden">
                        {/* Table header */}
                        <div className="grid grid-cols-4 bg-neutral-900/80 border-b border-white/5">
                            <div className="p-6 text-[11px] font-black uppercase tracking-widest text-neutral-500">Feature</div>
                            {['Developer', 'Business', 'Enterprise'].map((col, i) => (
                                <div key={i} className={cn(
                                    "p-6 text-center text-[11px] font-black uppercase tracking-widest",
                                    i === 1 ? "text-emerald-400" : "text-neutral-400"
                                )}>{col}</div>
                            ))}
                        </div>

                        {FEATURES.map((section, si) => (
                            <React.Fragment key={si}>
                                {/* Category header */}
                                <div className="grid grid-cols-4 bg-emerald-500/5 border-y border-white/5">
                                    <div className="p-4 col-span-4 text-[10px] font-black uppercase tracking-[0.25em] text-emerald-500 pl-6">
                                        {section.category}
                                    </div>
                                </div>
                                {section.rows.map((row, ri) => (
                                    <div
                                        key={ri}
                                        className={cn(
                                            "grid grid-cols-4 border-b border-white/5 last:border-none transition-colors",
                                            row.highlight ? "hover:bg-emerald-500/5" : "hover:bg-white/3"
                                        )}
                                    >
                                        <div className="p-4 pl-6 text-[11px] font-semibold text-neutral-300 flex items-center gap-2">
                                            {row.highlight && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
                                            {row.name}
                                        </div>
                                        {(['free', 'cloud', 'enterprise'] as const).map(tier => (
                                            <div key={tier} className={cn(
                                                "p-4 flex items-center justify-center",
                                                tier === 'cloud' && "bg-emerald-500/5"
                                            )}>
                                                <CellIcon value={row[tier]} />
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* ROI Calculator */}
                <div className="max-w-5xl mx-auto mb-40 text-center space-y-16">
                    <div className="space-y-4">
                        <h2 className="text-5xl font-black italic uppercase tracking-tighter">Measure Your <span className="text-emerald-500">Security ROI.</span></h2>
                        <p className="text-neutral-500 font-bold uppercase tracking-widest">Cloud pricing that scales with your agent's autonomy.</p>
                    </div>

                    <div className="p-16 rounded-[4rem] bg-neutral-900/40 border border-white/5 relative overflow-hidden">
                        <div className="grid md:grid-cols-5 gap-16 items-center">
                            <div className="md:col-span-3 space-y-10 text-left">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500 italic">
                                        <span>Monthly Volume</span>
                                        <span className="text-white text-xl">{operations.toLocaleString()}</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="50000000" step="10000" value={operations}
                                        onChange={(e) => setOperations(parseInt(e.target.value))}
                                        className="w-full h-3 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="flex justify-between text-[9px] font-black text-neutral-600 uppercase tracking-widest">
                                        <span>0</span><span>10M</span><span>20M</span><span>30M</span><span>40M</span><span>50M+</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                                        <p className="text-[10px] font-black uppercase text-neutral-500 italic">Developer Tier</p>
                                        <p className="text-3xl font-black italic tracking-tighter">{operations <= 10000 ? '$0' : '—'}</p>
                                        <p className="text-[9px] text-neutral-600 font-bold uppercase">Up to 10K ops</p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                                        <p className="text-[10px] font-black uppercase text-emerald-400 italic">{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Tier</p>
                                        <p className="text-3xl font-black italic tracking-tighter">${(planBase + Math.max(0, overage - planBase > 0 ? overage : 0)).toFixed(0)}</p>
                                        <p className="text-[9px] text-neutral-400 font-bold uppercase">/month</p>
                                    </div>
                                    <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                                        <p className="text-[10px] font-black uppercase text-neutral-500 italic">Overage</p>
                                        <p className="text-3xl font-black italic tracking-tighter">${Math.floor(overage).toLocaleString()}</p>
                                        <p className="text-[9px] text-neutral-600 font-bold uppercase">Usage charges</p>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-6">
                                {[
                                    { label: '0 – 10K', price: 'Free' },
                                    { label: '10K – 500K', price: '$0.002' },
                                    { label: '500K – 2M', price: '$0.0015' },
                                    { label: '2M – 10M', price: '$0.001' },
                                    { label: '10M+', price: '$0.0005' }
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

                {/* The 6 Natural Upgrade Walls */}
                <div className="max-w-4xl mx-auto mb-40 space-y-12">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-center">
                        The <span className="text-emerald-500">Natural</span> Upgrade Moments
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { wall: 'Wall 1', trigger: '4th agent', msg: '"Developer only allows 3 agents" → Business unlocks unlimited' },
                            { wall: 'Wall 2', trigger: 'Regex fatigue', msg: '"AI-powered policies needed" → Higher tiers' },
                            { wall: 'Wall 3', trigger: '11th secret', msg: '"10 secrets isn\'t enough for production Vault" → Business' },
                            { wall: 'Wall 4', trigger: 'Compliance audit', msg: '"PDF reports needed, not JSON" → Enterprise compliance' },
                            { wall: 'Wall 5', trigger: '8-day log', msg: '"7-day retention is useless for an audit" → Business' },
                            { wall: 'Wall 6', trigger: 'Full SDK support', msg: '"Developer only has 2 framework plugins" → Business' },
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-neutral-900/40 border border-white/5 hover:border-emerald-500/20 transition-all group">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">{item.wall}</span>
                                    <span className="text-[10px] font-bold text-neutral-500 uppercase">{item.trigger}</span>
                                </div>
                                <p className="text-[11px] font-semibold text-neutral-300 italic">{item.msg}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-[11px] font-bold text-neutral-500 uppercase tracking-widest italic">
                        Each wall feels like "I need the next tier" — not "this is broken."
                    </p>
                </div>

                {/* Enterprise CTA */}
                <div className="max-w-4xl mx-auto p-16 rounded-[4rem] bg-gradient-to-br from-neutral-900 to-black border-2 border-white/5 relative overflow-hidden group mb-20">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">
                        <Globe className="w-56 h-56" />
                    </div>
                    <div className="space-y-8 relative z-10">
                        <div className="p-4 bg-emerald-500/10 rounded-3xl w-fit text-emerald-500">
                            <Shield className="w-10 h-10" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter">Enterprise Compliance Suite</h2>
                            <p className="text-gray-400 font-medium italic leading-relaxed max-w-2xl">
                                For organizations with procurement requirements, air-gap mandates, and EU AI Act certification. Same infrastructure, elevated governance.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500 italic">
                            {[
                                'Data Processing Agreement (DPA)',
                                'SOC 2 Type II Certification',
                                '99.99% SLA with Penalties',
                                'Article 9 Risk Templates',
                                'Dedicated Implementation Engineer',
                                'Named Account Executive'
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Check className="w-4 h-4 text-emerald-500" />{item}
                                </div>
                            ))}
                        </div>
                        <div className="pt-6">
                            <button className="px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-tighter text-lg hover:bg-emerald-500 hover:text-white transition-all transform hover:translate-x-2">
                                Contact Enterprise →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
