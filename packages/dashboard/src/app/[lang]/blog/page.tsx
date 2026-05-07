// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { generateLocalizedMetadata } from "@/i18n/generate-metadata";
import { getDictionary } from "@/i18n/getDictionary";
import { Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    return generateLocalizedMetadata({
        params,
        internalPath: 'blog',
        title: "Engineering Blog | SupraWall",
        description: "Deep technical research, threat intel, and architecture insights on AI agent security from the SupraWall team.",
        keywords: [
            "AI agent security blog",
            "LLM security research",
            "agentic AI architecture",
            "prompt injection prevention",
            "deterministic guardrails",
        ],
        ogType: "website"
    });
}

// Temporary static list of blog posts until a formal CMS/data layer is established
const BLOG_POSTS = [
    {
        slug: "llm-as-judge-fails-agent-security",
        title: "LLM-as-Judge Fails for Agent Security",
        excerpt: "Every major AI guardrail product uses an LLM to judge another LLM. It works 80% of the time. We document 4 bypass patterns with real payloads — and show why deterministic pre-execution interception is the only reliable alternative.",
        category: "SECURITY RESEARCH",
        date: "2026-04-30"
    },
    {
        slug: "meta-rogue-ai-agent-hitl-governance",
        title: "Meta's Rogue Agent Incident: A Case for Hard Human-in-the-Loop Governance",
        excerpt: "An internal Meta research agent bypassed standard soft-guardrails, highlighting why prompts are not security. We analyze the technical failure and the mandatory HITL solution.",
        category: "THREAT INTEL",
        date: "2026-03-25"
    },
    {
        slug: "build-vs-buy-ai-agent-security",
        title: "Build vs Buy: AI Agent Runtime Security",
        excerpt: "Evaluating the engineering cost of building an in-house deterministic interception layer vs integrating an existing SDK for autonomous agent governance.",
        category: "ARCHITECTURE",
        date: "2026-04-10"
    }
];

export default async function BlogIndexPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    
    // Blog is currently English-only
    if (lang !== 'en') notFound();
    
    const dictionary = await getDictionary(lang);

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.supra-wall.com/en" },
            { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.supra-wall.com/en/blog" },
        ],
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#B8FF00]/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Navbar lang={lang} dictionary={dictionary} />
            
            <div className="bg-black text-white">
                {/* Hero */}
                <section className="pt-40 pb-16 px-6">
                    <div className="max-w-5xl mx-auto">
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#B8FF00] mb-4">
                            Engineering Blog
                        </p>
                        <h1 className="font-black uppercase italic text-5xl md:text-7xl text-white leading-none tracking-tighter mb-6">
                            Agentic Security<br />Research
                        </h1>
                        <p className="text-neutral-400 text-lg max-w-2xl">
                            Deep technical dives into threat intel, bypass patterns, and deterministic architecture for autonomous AI agents.
                        </p>
                    </div>
                </section>

                {/* Articles grid */}
                <section className="pb-32 px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {BLOG_POSTS.map((article) => (
                                <Link
                                    key={article.slug}
                                    href={`/blog/${article.slug}`}
                                    className="group flex flex-col justify-between p-6 bg-white/[0.05] border border-white/5 rounded-2xl hover:border-[#B8FF00]/30 hover:bg-white/[0.04] transition-all"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-[#B8FF00]/10 text-[#B8FF00] border-[#B8FF00]/20">
                                                {article.category}
                                            </span>
                                            <time
                                                dateTime={article.date}
                                                className="text-[10px] font-medium text-neutral-600 uppercase tracking-widest"
                                            >
                                                {new Date(article.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                                            </time>
                                        </div>
                                        <h2 className="text-base font-black text-white leading-snug group-hover:text-[#B8FF00] transition-colors">
                                            {article.title}
                                        </h2>
                                        <p className="text-xs text-neutral-500 leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                    <div className="mt-6 flex items-center gap-1 text-[11px] font-black uppercase tracking-widest text-[#B8FF00] group-hover:text-white transition-colors">
                                        Read Article <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
