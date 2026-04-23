// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Locale } from "@/i18n/config";
import { getDictionary } from "../../../../i18n/getDictionary";
import { FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    return {
        title: `${dictionary.qa.howToComplyArticle12.title} | Quick Answer`,
        description: dictionary.qa.howToComplyArticle12.answer.substring(0, 155) + "...",
        robots: "index, follow",
    };
}

export default async function HowToComplyArticle12Page({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <Navbar lang={lang} dictionary={dictionary} />

            <main className="pt-48 pb-32 px-6">
                <div className="max-w-3xl mx-auto space-y-12">
                    
                    {/* 🎯 PRECISION ANSWER BOX */}
                    <section className="p-12 rounded-[3rem] bg-blue-500/5 border-2 border-blue-500/20 shadow-[0_0_100px_rgba(59,130,246,0.1)] relative">
                        <div className="absolute top-0 right-0 p-6 opacity-10"><FileText className="w-12 h-12" /></div>
                        
                        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8">{dictionary.qa.howToComplyArticle12.title}</h1>
                        
                        <p className="answer-first-paragraph text-2xl text-neutral-200 leading-snug font-medium italic border-l-4 border-blue-500 pl-8">
                            {dictionary.qa.howToComplyArticle12.answer}
                        </p>
                    </section>

                    {/* 📋 COMPLIANCE STEPS */}
                    <section className="space-y-8 pt-12">
                        <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-600">{dictionary.qa.howToComplyArticle12.checklistTitle}</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {[
                                { title: dictionary.qa.howToComplyArticle12.step1Title, desc: dictionary.qa.howToComplyArticle12.step1Desc },
                                { title: dictionary.qa.howToComplyArticle12.step2Title, desc: dictionary.qa.howToComplyArticle12.step2Desc },
                                { title: dictionary.qa.howToComplyArticle12.step3Title, desc: dictionary.qa.howToComplyArticle12.step3Desc }
                            ].map((step, i) => (
                                <div key={i} className="flex gap-6 p-8 rounded-3xl bg-white/[0.02] border border-white/5 items-start">
                                     <div className="p-2 bg-emerald-500/10 rounded-lg"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                                     <div>
                                        <p className="font-bold text-white uppercase text-sm tracking-tight">{step.title}</p>
                                        <p className="text-xs text-neutral-500 leading-relaxed font-medium">{step.desc}</p>
                                     </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 🛡️ SUPRAWALL SOLUTION */}
                    <div className="my-16 p-10 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/20 space-y-8">
                         <div className="flex items-center gap-4 text-blue-400">
                             <FileText className="w-8 h-8" />
                             <h3 className="text-2xl font-black uppercase italic tracking-tight">{dictionary.qa.howToComplyArticle12.solutionTitle}</h3>
                         </div>
                         <p className="text-neutral-400 font-medium italic leading-relaxed">
                             {dictionary.qa.howToComplyArticle12.solutionP}
                         </p>
                    </div>

                    {/* CTA */}
                    <div className="pt-12 text-center">
                        <Link href={`/${lang}/eu-ai-act/article-12`} className="text-xs font-black uppercase tracking-[0.3em] text-neutral-500 hover:text-white transition-colors underline underline-offset-8">
                            {dictionary.qa.howToComplyArticle12.guideLink} &rarr;
                        </Link>
                    </div>

                </div>
            </main>
        </div>
    );
}
