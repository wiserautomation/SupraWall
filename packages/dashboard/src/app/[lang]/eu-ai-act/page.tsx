import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { i18n, Locale } from "@/i18n/config";
import { SLUG_MAP } from "../../../i18n/slug-map";
import EuAiActClient from "./EuAiActClient";
import { QuickSummaryTable } from "@/components/QuickSummaryTable";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;
    const baseUrl = 'https://www.supra-wall.com';
    const isDefault = lang === i18n.defaultLocale;
    const internalSlug = 'eu-ai-act';

    // Build alternates for hreflang pointing to public aliases
    const languages: Record<string, string> = {};
    i18n.locales.forEach((l) => {
        const publicSlug = SLUG_MAP[internalSlug]?.[l] || internalSlug;
        languages[l] = `${baseUrl}/${l}/${publicSlug}`;
    });
    const defaultPublicSlug = SLUG_MAP[internalSlug]?.['en'] || internalSlug;
    languages['x-default'] = `${baseUrl}/en/${defaultPublicSlug}`;

    const currentPublicSlug = SLUG_MAP[internalSlug]?.[lang] || internalSlug;

    return {
        title: "EU AI Act Compliance Hub for AI Agents | SupraWall",
        description: "The definitive guide and solution hub for the EU AI Act specifically for autonomous agentic systems. Satisfy Articles 9, 11, 12, and 14 with deterministic SDK-level evidence.",
        keywords: [
            "EU AI Act AI agents GUIDE",
            "compliance platform autonomous systems",
            "AI Act risk assessment high-risk",
            "automated logging for ai act",
            "human oversight requirements agents",
            "suprawall eu ai act solution",
        ],
        alternates: {
            canonical: `${baseUrl}/${lang}/eu-ai-act`,
            languages,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title: "EU AI Act Compliance Hub | SupraWall Security",
            description: "Zero-trust compliance for the EU AI Act. Automated evidence trails and deterministic risk controls.",
            url: `${baseUrl}/${lang}/eu-ai-act`,
            siteName: "SupraWall",
            type: "website",
        },
    };
}

import { getDictionary } from "../../../i18n/getDictionary";

export default async function EuAiActHubPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = (await params) as { lang: Locale };
    const dictionary = await getDictionary(lang);
    
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "SupraWall EU AI Act Hub",
        "description": "Information and tools for complying with the EU AI Act in AI agentic applications.",
        "url": `https://www.supra-wall.com/${lang}/eu-ai-act`,
        "inLanguage": lang,
        "hasPart": [
            { "@type": "WebPage", "name": "Article 12: Automatic Logging", "url": `https://www.supra-wall.com/${lang}/eu-ai-act/article-12` },
            { "@type": "WebPage", "name": "Article 14: Human Oversight", "url": `https://www.supra-wall.com/${lang}/eu-ai-act/article-14` },
            { "@type": "WebPage", "name": "Compliance Checklist", "url": `https://www.supra-wall.com/${lang}/learn/eu-ai-act-compliance-ai-agents` }
        ]
    };

    const speakableSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "speakable": {
            "@type": "SpeakableSpecification",
            "cssSelector": [".quick-summary-table", ".answer-first-paragraph", ".article-mapping-table"]
        },
        "url": `https://www.supra-wall.com/${lang}/eu-ai-act`
    };

    const summaryRows = [
        { label: "Core Requirement", value: "Article 14 Human Oversight and Article 12 Automatic Logging for high-risk AI." },
        { label: "Compliance Solution", value: "SupraWall SDK-level interception for deterministic audit trails." },
        { label: "Enforcement Date", value: "August 2, 2026." },
        { label: "Penalty Risk", value: "Up to €30M or 6% of global turnover." },
        { label: "Target Systems", value: "Autonomous agents, LLM-driven tools, and agentic workflows." }
    ];

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            
            <div className="pt-32 pb-10 px-6 max-w-7xl mx-auto space-y-12">
                <p className="answer-first-paragraph text-2xl text-neutral-300 leading-snug font-medium border-l-8 border-blue-600 pl-8 py-4 italic text-left max-w-4xl">
                    EU AI Act compliance for AI agents is the process of implementing deterministic human oversight (Article 14) and automatic logging (Article 12) to mitigate the risks of autonomous systems. 
                    SupraWall provides the industry's first SDK-level security layer that satisfies these requirements by intercepting and validating every agent action before execution.
                </p>
                <div className="max-w-2xl">
                    <QuickSummaryTable rows={summaryRows} />
                </div>
            </div>

            <EuAiActClient dictionary={dictionary} lang={lang} />
        </div>
    );
}
