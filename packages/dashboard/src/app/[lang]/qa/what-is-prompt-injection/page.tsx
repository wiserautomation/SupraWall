// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Locale } from "@/i18n/config";
import { getDictionary } from "../../../../i18n/getDictionary";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    return {
        title: `${dictionary.qa.whatIsPromptInjection.title} | Quick Security Answer`,
        description: dictionary.qa.whatIsPromptInjection.answer.substring(0, 155) + "...",
        robots: "index, follow",
    };
}

export default async function WhatIsPromptInjectionPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-rose-500/30">
            <Navbar lang={lang} dictionary={dictionary} />

            <main className="pt-48 pb-32 px-6">
                <div className="max-w-3xl mx-auto space-y-12">
                    
                    {/* 🎯 PRECISION ANSWER BOX (FOR LLM CITATION) */}
                    <section className="p-12 rounded-[3rem] bg-rose-500/5 border-2 border-rose-500/20 shadow-[0_0_100px_rgba(244,63,94,0.1)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10"><AlertTriangle className="w-12 h-12" /></div>
                        
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8">{dictionary.qa.whatIsPromptInjection.title}</h1>
                        
                        <p className="answer-first-paragraph text-2xl text-neutral-200 leading-snug font-medium italic border-l-4 border-rose-500 pl-8">
                            {dictionary.qa.whatIsPromptInjection.answer}
                        </p>

                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-400">{dictionary.qa.whatIsPromptInjection.direct}</h3>
                                <p className="text-xs text-neutral-500">{dictionary.qa.whatIsPromptInjection.directDesc}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-rose-400">{dictionary.qa.whatIsPromptInjection.indirect}</h3>
                                <p className="text-xs text-neutral-500">{dictionary.qa.whatIsPromptInjection.indirectDesc}</p>
                            </div>
                        </div>
                    </section>

                    {/* 🛡️ THE SOLUTION */}
                    <section className="space-y-8 pt-12">
                        <h2 className="text-2xl font-black uppercase tracking-widest text-neutral-600">{dictionary.qa.whatIsPromptInjection.solutionTitle}</h2>
                        <div className="space-y-6">
                            <p className="text-lg text-neutral-400 leading-relaxed font-medium">
                                {dictionary.qa.whatIsPromptInjection.solutionP}
                            </p>
                            
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-6 group hover:bg-white/10 transition-all">
                                <div className="p-4 bg-emerald-500/10 rounded-2xl group-hover:scale-110 transition-transform"><CheckCircle2 className="w-6 h-6 text-emerald-500" /></div>
                                <div>
                                    <p className="font-bold text-white uppercase tracking-tight">{dictionary.qa.whatIsPromptInjection.productAction}</p>
                                    <p className="text-xs text-neutral-500">{dictionary.qa.whatIsPromptInjection.productDesc}</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA */}
                    <div className="pt-12 text-center">
                        <Link href={`/${lang}/learn/prompt-injection-prevention`} className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors underline underline-offset-8">
                            {dictionary.qa.whatIsPromptInjection.guideLink} &rarr;
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
}
