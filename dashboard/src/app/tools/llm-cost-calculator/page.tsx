import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import CalculatorClient from "./CalculatorClient";

export const metadata: Metadata = {
    title: "LLM Cost Calculator | Real-Time AI Agent Cost Estimator | SupraWall",
    description: "Calculate your real AI agent costs before they surprise you. Enter your agents, model, call volume, and token usage — get daily/monthly cost estimates plus worst-case loop scenarios.",
    keywords: [
        "LLM cost calculator",
        "AI agent cost estimator",
        "GPT-4 cost calculator",
        "Claude API cost",
        "AI agent budget calculator",
        "LLM token cost",
        "AI API pricing calculator",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/tools/llm-cost-calculator",
    },
    openGraph: {
        title: "LLM Cost Calculator — Know Your AI Costs Before They Surprise You",
        description: "Real-time cost estimates for GPT-4o, Claude, and Llama. Includes worst-case loop scenario and recommended budget cap.",
        url: "https://www.supra-wall.com/tools/llm-cost-calculator",
        siteName: "SupraWall",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "LLM Cost Calculator — Real AI Agent Cost Estimator",
        description: "Calculate GPT-4o, Claude, and Llama costs. Includes worst-case loop multiplier.",
    },
    robots: "index, follow",
};

export default function LlmCostCalculatorPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "LLM Cost Calculator",
        description: "Interactive calculator for estimating AI agent API costs across GPT-4o, Claude Sonnet, Claude Opus, GPT-4o-mini, and Llama 3. Includes daily/monthly projections and worst-case loop scenarios.",
        url: "https://www.supra-wall.com/tools/llm-cost-calculator",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "How accurate is this LLM cost calculator?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "The calculator uses published per-token pricing from Anthropic, OpenAI, and Together AI as of March 2026. Actual costs may vary based on caching, batching, and provider pricing changes.",
                },
            },
            {
                "@type": "Question",
                name: "What is the 'worst-case loop' scenario?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "If an agent enters an infinite loop, it can make hundreds of identical calls in minutes. The worst-case loop estimate shows your maximum possible loss if a loop runs unchecked for one hour.",
                },
            },
            {
                "@type": "Question",
                name: "What should I set as my budget cap?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "The calculator recommends 1.2× your expected daily cost as a starting cap. This absorbs normal variance while catching loops and runaway behavior early.",
                },
            },
            {
                "@type": "Question",
                name: "Does this calculator include extended thinking tokens?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Not by default. Extended thinking can add 10-50k tokens per call for Claude models. Add 20% to your estimate if using extended thinking.",
                },
            },
        ],
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.supra-wall.com" },
            { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.supra-wall.com/tools" },
            { "@type": "ListItem", position: 3, name: "LLM Cost Calculator", item: "https://www.supra-wall.com/tools/llm-cost-calculator" },
        ],
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <Navbar />
            <CalculatorClient />
        </div>
    );
}
