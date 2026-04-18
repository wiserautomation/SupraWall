// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from 'react';
import Link from 'next/link';
import { TemplateHero } from '@/components/TemplateHero';
import { sectorTemplates } from '@/data/compliance-matrix';

interface TemplatesHubClientProps {
    dictionary: any;
    lang: string;
}

export default function TemplatesHubClient({ dictionary, lang }: TemplatesHubClientProps) {
    const hub = (dictionary as any).complianceTemplates?.hub || { hero: { badge: '', title: '', emphasis: '', description: '' }, grid: { title: '', subtitle: '' } };
    const sectorsDict = (dictionary as any).complianceTemplates?.sectors || {};

    return (
        <main className="pb-24">
            <TemplateHero 
                badge={hub.hero.badge}
                title={`${hub.hero.title} ${hub.hero.emphasis}`}
                description={hub.hero.description}
            />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-12">
                <div className="border-b border-white/10 pb-12">
                    <h2 className="text-3xl font-black text-white tracking-tight">{hub.grid.title}</h2>
                    <p className="mt-4 text-lg text-neutral-400 max-w-3xl">{hub.grid.subtitle}</p>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {sectorTemplates.map((template) => {
                        const localized = sectorsDict[template.slug];
                        if (!localized) return null;

                        return (
                            <Link 
                                key={template.slug}
                                href={`/${lang}/compliance-templates/${template.slug}`}
                                className="group relative flex flex-col items-start justify-between rounded-3xl border border-white/5 bg-neutral-900/40 p-8 transition-all hover:bg-neutral-900/60 hover:ring-1 hover:ring-blue-500/50"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-xl font-black text-blue-400 border border-blue-500/20">
                                            {template.annexIIICategory}
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                            {localized.badge}
                                        </span>
                                    </div>
                                    
                                    <h3 className="text-xl font-black text-white tracking-tight group-hover:text-blue-400 transition-colors">
                                        {localized.title}
                                    </h3>
                                    
                                    <p className="text-sm leading-6 text-neutral-400 line-clamp-3">
                                        {localized.opening}
                                    </p>
                                </div>
                                
                                <div className="mt-8 flex w-full items-center justify-between">
                                    <span className="text-xs font-black uppercase tracking-widest text-blue-500">
                                        View Blueprint
                                    </span>
                                    <svg className="h-4 w-4 text-blue-500 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                                
                                {/* Hover background effect */}
                                <div className="absolute -inset-px -z-10 rounded-3xl bg-gradient-to-br from-blue-500/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
