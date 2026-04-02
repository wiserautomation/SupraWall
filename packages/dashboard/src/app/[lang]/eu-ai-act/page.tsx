import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { i18n, Locale } from "@/i18n/config";
import { SLUG_MAP } from "../../../i18n/slug-map";
import EuAiActClient from "./EuAiActClient";

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
            index: isDefault,
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

    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Navbar lang={lang} dictionary={dictionary} />
            <EuAiActClient dictionary={dictionary} />
        </div>
    );
}
