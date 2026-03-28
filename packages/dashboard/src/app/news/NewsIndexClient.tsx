// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { newsArticles, CATEGORIES, CATEGORY_COLORS, formatDate, type NewsCategory } from "./newsData";

export default function NewsIndexClient() {
    const [active, setActive] = useState<"ALL" | NewsCategory>("ALL");

    const filtered = newsArticles.filter(
        (a) => a.published && (active === "ALL" || a.category === active)
    );

    return (
        <div className="bg-black text-white">
            {/* Hero */}
            <section className="pt-40 pb-16 px-6">
                <div className="max-w-5xl mx-auto">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600 mb-4">
                        News
                    </p>
                    <h1 className="font-black uppercase italic text-5xl md:text-7xl text-white leading-none tracking-tighter mb-6">
                        AI Agent<br />Security News
                    </h1>
                    <p className="text-neutral-400 text-lg max-w-2xl">
                        Stay ahead of the threats, regulations, and frameworks shaping autonomous AI.
                        Updated weekly by the SupraWall Security Team.
                    </p>
                </div>
            </section>

            {/* Category filter */}
            <section className="pb-12 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActive(cat)}
                                className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest border transition-all ${
                                    active === cat
                                        ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                        : "bg-white/[0.05] border-white/10 text-neutral-500 hover:text-white hover:border-white/20"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Articles grid */}
            <section className="pb-32 px-6">
                <div className="max-w-5xl mx-auto">
                    {filtered.length === 0 ? (
                        <p className="text-neutral-600 text-sm">No articles in this category yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filtered.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/news/${article.slug}`}
                                    className="group flex flex-col justify-between p-6 bg-white/[0.05] border border-white/5 rounded-2xl hover:border-emerald-500/20 hover:bg-white/[0.04] transition-all"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${CATEGORY_COLORS[article.category]}`}>
                                                {article.category}
                                            </span>
                                            <time
                                                dateTime={article.date}
                                                className="text-[10px] font-medium text-neutral-600 uppercase tracking-widest"
                                            >
                                                {formatDate(article.date)}
                                            </time>
                                        </div>
                                        <h2 className="text-base font-black text-white leading-snug group-hover:text-emerald-400 transition-colors">
                                            {article.title}
                                        </h2>
                                        <p className="text-xs text-neutral-500 leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-emerald-600 group-hover:text-emerald-400 transition-colors">
                                        Read More <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="pb-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-3xl p-12 text-center">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3">
                            Stay Current
                        </p>
                        <h2 className="text-3xl font-black uppercase italic text-white mb-4">
                            Weekly AI Security Briefing
                        </h2>
                        <p className="text-neutral-400 text-sm max-w-md mx-auto mb-8">
                            Regulation updates, threat intel, and framework news — curated for teams shipping autonomous AI agents.
                        </p>
                        <Link
                            href="/beta"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-sm tracking-widest rounded-xl transition-colors"
                        >
                            Join Beta <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
