// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import BudgetClient from "./BudgetClient";

export const metadata: Metadata = {
    title: "AI Agent Budget Limits | Hard Token & Cost Caps | SupraWall",
    description: "Set hard spending caps on AI agents. SupraWall enforces $10/day limits, detects infinite loops, and kills runaway agents before they drain your API budget overnight.",
    keywords: [
        "AI agent budget limits",
        "AI agent token limit",
        "LLM cost control",
        "AI agent spending cap",
        "prevent AI agent runaway costs",
        "agent budget cap",
        "token budget management",
        "AI API cost limit",
    ],
    alternates: {
        canonical: "https://www.supra-wall.com/features/budget-limits",
    },
    openGraph: {
        title: "Your Agent Burned $4,000 Overnight. Budget Limits Would Have Stopped It at $10.",
        description: "Deterministic budget enforcement for AI agents. Set per-agent spending caps, per-session token limits, and circuit breakers that kill infinite loops before they kill your budget.",
        url: "https://www.supra-wall.com/features/budget-limits",
        siteName: "SupraWall",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Your Agent Burned $4,000 Overnight. Budget Limits Would Have Stopped It at $10.",
        description: "Deterministic budget enforcement for AI agents. Set hard caps that no LLM can talk its way around.",
    },
    robots: "index, follow",
};

export default function BudgetLimitsPage() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "SupraWall Budget Limits",
        applicationCategory: "SecurityApplication",
        description: "Deterministic budget enforcement for AI agents. Set hard spending caps per agent, per session, or per day. Circuit breakers detect infinite loops and kill runaway agents before they drain API budgets.",
        url: "https://www.supra-wall.com/features/budget-limits",
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "How do SupraWall budget limits work?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "You set a dollar or token cap (e.g., $10/day per agent). SupraWall tracks every tool call's token consumption in real time. When the cap is reached, all further API executions are deterministically blocked — no exceptions, no overrides.",
                },
            },
            {
                "@type": "Question",
                name: "Can I set different budgets for different agents?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Each agent gets its own budget scope. Your billing-bot might get $50/day while your research-agent gets $5/day. Team-level and organization-level caps are also supported.",
                },
            },
            {
                "@type": "Question",
                name: "What happens when an agent hits its budget?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "SupraWall returns a structured BudgetExceeded error to the agent, which forces it to self-correct or halt gracefully. You receive a webhook notification. The agent cannot circumvent the cap.",
                },
            },
            {
                "@type": "Question",
                name: "How does infinite loop detection work?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "SupraWall analyzes tool call patterns in real time. If it detects N identical or near-identical calls within a time window (configurable), it triggers the circuit breaker and halts the agent. Default: 10 identical calls in 60 seconds.",
                },
            },
            {
                "@type": "Question",
                name: "Does this work with streaming APIs and extended thinking?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Token counting works with streaming responses, extended thinking windows (Claude), and multi-turn conversations. Both input and output tokens are tracked.",
                },
            },
            {
                "@type": "Question",
                name: "Can budget limits help with EU AI Act compliance?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes. Budget enforcement is part of your risk management system (Article 9). SupraWall logs every budget decision for audit export, demonstrating you have systematic controls over AI agent resource consumption.",
                },
            },
        ],
    };

    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: "How to Set Budget Limits on AI Agents",
        step: [
            { "@type": "HowToStep", text: "Define per-agent budgets in your SupraWall policy file or dashboard." },
            { "@type": "HowToStep", text: "Configure circuit breaker thresholds for loop detection." },
            { "@type": "HowToStep", text: "Deploy — SupraWall enforces limits at 1.2ms latency per interception." },
        ],
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.supra-wall.com" },
            { "@type": "ListItem", position: 2, name: "Features", item: "https://www.supra-wall.com/features" },
            { "@type": "ListItem", position: 3, name: "Budget Limits", item: "https://www.supra-wall.com/features/budget-limits" },
        ],
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
            <Navbar />
            <BudgetClient />
        </div>
    );
}
