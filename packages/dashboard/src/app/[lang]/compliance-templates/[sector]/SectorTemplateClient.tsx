// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import React from 'react';
import { TemplateConfig, getBySector } from '@/data/compliance-matrix';
import { TemplateHero } from '@/components/TemplateHero';
import { SectorSummaryTable } from '@/components/SectorSummaryTable';
import { BuildVsBuyTable } from '@/components/BuildVsBuyTable';
import { TemplateActivationSnippet } from '@/components/TemplateActivationSnippet';

interface SectorTemplateClientProps {
    template: TemplateConfig;
    dictionary: any;
    lang: string;
}

export default function SectorTemplateClient({ template, dictionary, lang }: SectorTemplateClientProps) {
    const localized = (dictionary as any).complianceTemplates?.sectors?.[template.slug] || {};
    const common = (dictionary as any).complianceTemplates?.common || {};
    
    // Filter the matrix for sector-specific requirements
    const sectorRequirements = getBySector(template.slug).filter(entry => 
        entry.regulation === 'EU_AI_ACT'
    );

    return (
        <main className="pb-24">
            <TemplateHero 
                badge={localized.badge}
                title={localized.title}
                description={localized.opening}
            />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-24">
                {/* Requirements Table */}
                <section>
                    <div className="flex items-center gap-x-4 mb-8">
                        <h2 className="text-2xl font-black text-white tracking-tight italic py-1 px-4 border-l-4 border-blue-500 bg-blue-500/5">
                            {common.reqHeader} Mapping
                        </h2>
                    </div>
                    <SectorSummaryTable 
                        entries={sectorRequirements} 
                        dictionary={dictionary} 
                    />
                </section>

                {/* Build vs. Buy Section */}
                <section>
                    <BuildVsBuyTable 
                        config={template} 
                        dictionary={dictionary} 
                    />
                </section>

                {/* FAQ Section (GEO Target) */}
                {localized.faq && localized.faq.length > 0 && (
                    <section className="max-w-4xl">
                        <div className="mb-12">
                            <h2 className="text-2xl font-black text-white tracking-tight">Technical FAQ</h2>
                            <p className="mt-2 text-neutral-400">Common regulatory hurdles for ${localized.title}.</p>
                        </div>
                        <div className="space-y-8">
                            {localized.faq.map((item: any, i: number) => (
                                <div key={i} className="rounded-2xl border border-white/5 bg-neutral-900/20 p-8">
                                    <h4 className="text-lg font-bold text-white mb-3 flex items-start gap-x-3">
                                        <span className="text-blue-500 font-black">Q:</span>
                                        {item.q}
                                    </h4>
                                    <p className="text-neutral-400 leading-relaxed flex items-start gap-x-3">
                                        <span className="text-emerald-500 font-black">A:</span>
                                        {item.a}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Implementation Snippet */}
                <section className="border-t border-white/5 pt-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-black text-white tracking-tight">Deploy This Blueprint</h2>
                        <p className="mt-4 text-neutral-400">Activate all 13 baseline controls and sector logic in one line.</p>
                    </div>
                    <TemplateActivationSnippet 
                        slug={template.slug} 
                        dictionary={dictionary} 
                    />
                </section>
            </div>
            
            {/* Schema.org JSON-LD for FAQ and Speakable */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": localized.faq?.map((f: any) => ({
                            "@type": "Question",
                            "name": f.q,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": f.a
                            }
                        }))
                    })
                }}
            />
        </main>
    );
}
