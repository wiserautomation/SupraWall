// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

'use client';

import React, { useState } from 'react';
import { Check, X, Zap, Shield, Users, Globe, Github, Code2, ChevronRight, Loader2, DollarSign } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

const TIER_DATA = [
    {
        name: 'Open Source',
        id: 'open_source',
        price: '0',
        description: 'Self-host for local development and individuals.',
        cta: 'View on GitHub',
        href: 'https://github.com/suprawall/suprawall',
        icon: Github,
        color: 'neutral',
        features: [
            '5,000 evaluations / month',
            '2 registered agents',
            '3 vault secrets',
            '3-day audit logs',
            'Regex-based policies',
            'LangChain plugin',
            '1 seat',
            'GitHub community support'
        ]
    },
    {
        name: 'Developer',
        id: 'developer',
        price: '39',
        description: 'For solo builders ready to move to the cloud.',
        cta: 'Deploy to Cloud',
        icon: Code2,
        color: 'emerald',
        features: [
            '25,000 evaluations / month',
            '5 registered agents',
            '15 vault secrets',
            '30-day audit logs',
            'Managed dashboard',
            'Full Regex engine',
            'Overage: $0.003 / eval',
            'Email support (48h SLA)'
        ]
    },
    {
        name: 'Team',
        id: 'team',
        price: '79',
        description: 'For teams scaling AI security infrastructure.',
        featured: true,
        cta: 'Upgrade Team',
        icon: Users,
        color: 'emerald',
        features: [
            '250,000 evaluations / month',
            '25 agents \u00b7 3 seats',
            '100 vault secrets',
            '90-day audit logs',
            'AI-powered policies (LLM)',
            'ML threat detection',
            'EU AI Act templates',
            'Overage: $0.002 / eval'
        ]
    },
    {
        name: 'Business',
        id: 'business',
        price: '249',
        description: 'Professional grade security for growth companies.',
        cta: 'Scale Now',
        icon: Zap,
        color: 'emerald',
        features: [
            '2,000,000 evaluations / month',
            'Unlimited agents \u00b7 10 seats',
            'Unlimited vault secrets',
            '1-year audit logs',
            'SSO (SAML/SCIM)',
            'ML threat detection',
            'Branded PDF reports',
            'Overage: $0.001 / eval'
        ]
    },
    {
        name: 'Enterprise',
        id: 'enterprise',
        price: 'Custom',
        description: 'Air-gapped compliance and dedicated support.',
        cta: 'Contact Sales',
        icon: Shield,
        color: 'blue',
        features: [
            'Unlimited evaluations',
            'Unlimited seats & organizations',
            '7-year log retention',
            'VPC / Air-gapped / Private Cloud',
            'EU AI Act Article 9 Suite',
            'Implementation Engineer',
            'Dedicated Account Manager',
            'RSA-signed audit trails'
        ]
    }
];

export default function PricingPage() {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [loadingCheckout, setLoadingCheckout] = useState<string | null>(null);

    const handleCheckout = async (planId: string) => {
        if (planId === 'open_source') return;
        if (planId === 'enterprise') { window.location.href = 'mailto:sales@supra-wall.com'; return; }
        
        if (!user) { router.push('/beta'); return; }
        setLoadingCheckout(planId);
        
        try {
            const response = await fetch('/api/stripe/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, email: user.email, plan: planId }),
            });
            const data = await response.json();
            if (data.url) window.location.href = data.url;
            else { console.error(data.error); setLoadingCheckout(null); }
        } catch (e) {
            console.error(e);
            setLoadingCheckout(null);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 font-sans">
            <Navbar />

            {/* Hero */}
            <div className="relative pt-32 pb-20 px-6 text-center">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 italic uppercase leading-none">
                    Security That <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Scales With You.</span>
                </h1>
                <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-medium italic">
                    Start with Zero Trust on Open Source. Scale to legal-grade compliance on Enterprise.
                </p>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 pb-40">
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {TIER_DATA.map((tier) => {
                        const Icon = tier.icon;
                        const isFeatured = tier.featured;
                        const isEnterprise = tier.price === 'Custom';
                        
                        return (
                            <div 
                                key={tier.id}
                                className={`flex flex-col p-8 rounded-[2.5rem] transition-all duration-500 border ${
                                    isFeatured 
                                    ? 'bg-emerald-600 border-emerald-400 shadow-[0_30px_60px_rgba(16,185,129,0.25)] scale-105 z-10' 
                                    : 'bg-neutral-950 border-white/10 hover:border-white/20'
                                }`}
                            >
                                <div className="space-y-6 flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className={`p-3 rounded-2xl ${isFeatured ? 'bg-white/20' : 'bg-white/5 text-neutral-400'}`}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase tracking-tighter">{tier.name}</h3>
                                        <p className={`text-[10px] font-bold uppercase italic mt-1 ${isFeatured ? 'text-emerald-100' : 'text-neutral-500'}`}>
                                            {tier.description}
                                        </p>
                                    </div>

                                    <div className="py-2">
                                        <div className="text-4xl font-black italic tracking-tighter">
                                            {!isEnterprise && <span className="text-xl mr-1">$</span>}
                                            {tier.price}
                                            {!isEnterprise && <span className="text-sm">/mo</span>}
                                        </div>
                                    </div>

                                    <ul className="space-y-3">
                                        {tier.features.map((feat, i) => (
                                            <li key={i} className="flex items-start gap-2.5 text-[9px] font-black uppercase tracking-widest italic">
                                                <Check className={`w-3 h-3 flex-shrink-0 mt-0.5 ${isFeatured ? 'text-white' : 'text-emerald-500'}`} />
                                                <span className={isFeatured ? 'text-emerald-50' : 'text-neutral-400'}>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button
                                    onClick={() => handleCheckout(tier.id)}
                                    disabled={loadingCheckout === tier.id}
                                    className={`mt-10 w-full py-4 rounded-xl font-black uppercase tracking-tighter text-sm transition-all flex items-center justify-center gap-2 ${
                                        isFeatured 
                                        ? 'bg-white text-black hover:bg-emerald-50 shadow-xl' 
                                        : 'border-2 border-white/10 text-white hover:bg-white/5'
                                    }`}
                                >
                                    {loadingCheckout === tier.id ? <Loader2 className="w-4 h-4 animate-spin" /> : tier.cta}
                                </button>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-40 max-w-4xl mx-auto text-center space-y-8 bg-neutral-900/30 p-16 rounded-[4rem] border border-white/5">
                    <Globe className="w-16 h-16 text-emerald-500 mx-auto opacity-50" />
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter">Global Audit-Grade Compliance</h2>
                    <p className="text-neutral-500 font-medium italic">
                        Every evaluation on SupraWall Cloud generates a cryptographically signed audit log, ready for regulator inspecton or external compliance audits.
                    </p>
                    <div className="flex flex-wrap justify-center gap-10 pt-8 opacity-40 grayscale">
                        <span className="text-xl font-black italic">EU AI ACT</span>
                        <span className="text-xl font-black italic">SOC 2 TYPE II</span>
                        <span className="text-xl font-black italic">ISO 27001</span>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
