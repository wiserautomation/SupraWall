// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { newsArticles, getArticle, formatDate, CATEGORY_COLORS } from "../newsData";

interface Props {
    params: { slug: string };
}

export function generateStaticParams() {
    return newsArticles
        .filter((a) => a.published)
        .map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
    const article = getArticle(params.slug);
    if (!article) return { title: "Not Found" };

    return {
        title: `${article.title} | SupraWall News`,
        description: article.excerpt,
        keywords: [
            "AI agent security",
            article.category.toLowerCase(),
            "SupraWall",
            "agentic AI",
        ],
        alternates: {
            canonical: `https://www.supra-wall.com/news/${article.slug}`,
        },
        openGraph: {
            title: article.title,
            description: article.excerpt,
            url: `https://www.supra-wall.com/news/${article.slug}`,
            siteName: "SupraWall",
            type: "article",
            publishedTime: article.date,
            authors: ["SupraWall Security Team"],
        },
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.excerpt,
        },
        robots: "index, follow",
    };
}

export default function NewsArticlePage({ params }: Props) {
    const article = getArticle(params.slug);
    if (!article) notFound();

    const newsArticleSchema = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        headline: article.title,
        description: article.excerpt,
        datePublished: article.date,
        dateModified: article.date,
        articleSection: article.category,
        keywords: `AI agent security, ${article.category.toLowerCase()}, SupraWall`,
        author: {
            "@type": "Organization",
            name: "SupraWall Security Team",
            url: "https://www.supra-wall.com",
        },
        publisher: {
            "@type": "Organization",
            name: "SupraWall",
            url: "https://www.supra-wall.com",
            logo: {
                "@type": "ImageObject",
                url: "https://www.supra-wall.com/logo.png",
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://www.supra-wall.com/news/${article.slug}`,
        },
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.supra-wall.com" },
            { "@type": "ListItem", position: 2, name: "News", item: "https://www.supra-wall.com/news" },
            { "@type": "ListItem", position: 3, name: article.category, item: `https://www.supra-wall.com/news` },
            { "@type": "ListItem", position: 4, name: article.title, item: `https://www.supra-wall.com/news/${article.slug}` },
        ],
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Navbar />

            <main className="pt-40 pb-32 px-6">
                <article className="max-w-3xl mx-auto">

                    {/* Back link */}
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-neutral-600 hover:text-white transition-colors mb-12"
                    >
                        <ArrowLeft className="w-3 h-3" /> All News
                    </Link>

                    {/* Breadcrumb (for humans) */}
                    <nav className="flex items-center gap-2 text-[10px] font-medium text-neutral-600 mb-8" aria-label="Breadcrumb">
                        <Link href="/" className="hover:text-neutral-400 transition-colors">Home</Link>
                        <span>/</span>
                        <Link href="/news" className="hover:text-neutral-400 transition-colors">News</Link>
                        <span>/</span>
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${CATEGORY_COLORS[article.category]}`}>
                            {article.category}
                        </span>
                    </nav>

                    {/* Meta row */}
                    <div className="flex items-center gap-4 flex-wrap mb-6">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${CATEGORY_COLORS[article.category]}`}>
                            {article.category}
                        </span>
                        <time
                            dateTime={article.date}
                            className="text-xs font-medium text-neutral-500"
                        >
                            {formatDate(article.date)}
                        </time>
                        <span className="flex items-center gap-1 text-xs text-neutral-600">
                            <Clock className="w-3 h-3" />
                            {article.readingTime} min read
                        </span>
                        <span className="text-xs text-neutral-600">
                            By SupraWall Security Team
                        </span>
                    </div>

                    {/* Headline */}
                    <h1 className="font-black uppercase italic text-4xl md:text-5xl text-white leading-tight tracking-tight mb-8">
                        {article.title}
                    </h1>

                    {/* Deck / excerpt */}
                    {/* Quick Summary Table - GEO Optimized */}
                    {article.summaryTable && (
                        <div className="mb-12 overflow-hidden bg-white/[0.02] border border-white/10 rounded-2xl">
                             <div className="px-6 py-4 border-b border-white/10 bg-white/[0.03]">
                                <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Quick Summary & Benchmarks</h2>
                             </div>
                             <div className="grid grid-cols-1 sm:grid-cols-2">
                                {article.summaryTable.map((item, idx) => (
                                    <div key={idx} className="px-6 py-4 border-b sm:border-r border-white/5 flex flex-col gap-1 last:border-b-0">
                                        <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">{item.key}</span>
                                        <span className="text-sm font-black text-white">{item.value}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {/* Body */}
                    <div className="space-y-6 text-neutral-300 leading-relaxed text-[15px]">
                        {article.body.paragraphs.map((p, i) => (
                            <p key={i}>
                                {p.split("[SOURCE NEEDED]").map((part, index, array) => (
                                    <span key={index}>
                                        {part}
                                        {index < array.length - 1 && (
                                            <span className="text-[9px] font-black text-emerald-500/40 hover:text-emerald-500 cursor-help transition-colors mx-0.5 group/source inline-block align-top mt-1" title="SupraWall Security Verification Pending">
                                                [SOURCE NEEDED]
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </p>
                        ))}
                    </div>

                    {/* Definitions - GEO Optimized */}
                    {article.definitions && (
                        <div className="mt-16 pt-12 border-t border-white/5">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-6">Key Terms & Definitions</h2>
                            <dl className="space-y-6">
                                {article.definitions.map((def, idx) => (
                                    <div key={idx} className="space-y-1">
                                        <dt className="text-sm font-black text-emerald-500 uppercase tracking-tight">{def.term}</dt>
                                        <dd className="text-sm text-neutral-400 leading-relaxed">{def.definition}</dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    )}

                    {/* FAQ - GEO Optimized */}
                    {article.faq && (
                        <div className="mt-16 pt-12 border-t border-white/5">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-6">Common Questions</h2>
                            <div className="space-y-8">
                                {article.faq.map((item, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <h3 className="text-base font-black text-white italic">{item.question}</h3>
                                        <p className="text-sm text-neutral-400 leading-relaxed">{item.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sources - GEO Optimized */}
                    {article.sources && (
                        <div className="mt-16 pt-6 opacity-40 hover:opacity-100 transition-opacity">
                            <p className="text-[9px] font-black uppercase tracking-widest text-neutral-600 mb-3">Primary Evidence & Citations</p>
                            <ul className="space-y-2">
                                {article.sources.map((s, idx) => (
                                    <li key={idx} className="text-[10px] flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-neutral-600" />
                                        {s.url ? (
                                            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-neutral-500 hover:text-emerald-500 transition-colors pointer-events-auto">
                                                {s.name} <span className="text-[8px] opacity-50 underline ml-1">↗</span>
                                            </a>
                                        ) : (
                                            <span className="text-neutral-500">{s.name}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* SupraWall angle callout */}
                    <div className="mt-12 p-6 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3">
                            What This Means for SupraWall Users
                        </p>
                        <p className="text-sm text-emerald-200 leading-relaxed">
                            {article.supraWallAngle}
                        </p>
                    </div>

                    {/* Related articles */}
                    <div className="mt-12">
                        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600 mb-4">
                            Related Reading
                        </p>
                        <div className="space-y-3">
                            {article.relatedLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="flex items-center justify-between p-4 bg-white/[0.05] border border-white/5 rounded-xl hover:border-white/10 hover:bg-white/[0.04] transition-all group"
                                >
                                    <span className="text-sm font-medium text-neutral-400 group-hover:text-white transition-colors">
                                        {link.label}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="mt-16 p-10 bg-white/[0.05] border border-white/5 rounded-3xl text-center">
                        <h2 className="text-2xl font-black uppercase italic text-white mb-3">
                            Protect Your AI Agents
                        </h2>
                        <p className="text-neutral-500 text-sm mb-6 max-w-md mx-auto">
                            Stay ahead of emerging threats. SupraWall enforces security policies at the SDK level — before threats reach your infrastructure.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                href="/beta"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-colors"
                            >
                                Start Free <ArrowRight className="w-3 h-3" />
                            </Link>
                            <Link
                                href="/news"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white/10 hover:border-white/20 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-colors"
                            >
                                More News
                            </Link>
                        </div>
                    </div>

                </article>
            </main>

            <footer className="py-16 border-t border-white/5 text-center">
                <p className="text-neutral-700 text-[10px] font-black uppercase tracking-[0.5em]">
                    SupraWall © 2026 • Real-time Agent Governance
                </p>
            </footer>
        </div>
    );
}
