// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

// EU AI Act compliance policy templates for high-risk AI deployments.
// Each template is a ready-made rule pack that maps to specific articles.

export interface PolicyTemplateRule {
    toolName: string;
    condition: string;
    ruleType: "DENY" | "REQUIRE_APPROVAL";
    priority: number;
    description: string;
    article: string;
}

export interface PolicyTemplate {
    id: string;
    name: string;
    industry: string;
    tagline: string;
    articles: string[];
    accentClass: string; // Tailwind color variant identifier
    rules: PolicyTemplateRule[];
}

export const POLICY_TEMPLATES: PolicyTemplate[] = [
    {
        id: "eu-ai-act-banking",
        name: "Banking & Finance",
        industry: "Financial Services",
        tagline: "Risk controls for AI used in credit scoring, lending, and financial transactions.",
        articles: ["Art. 9", "Art. 14", "Art. 10"],
        accentClass: "blue",
        rules: [
            {
                toolName: "*",
                condition: "(transfer|wire|payment|transaction).*(amount|usd|eur|gbp)",
                ruleType: "REQUIRE_APPROVAL",
                priority: 10,
                description: "Human approval required for financial transfer operations",
                article: "Art. 14",
            },
            {
                toolName: "database",
                condition: "(DELETE|DROP|TRUNCATE).*(account|customer|transaction)",
                ruleType: "DENY",
                priority: 1,
                description: "Block irreversible database operations on financial records",
                article: "Art. 9",
            },
            {
                toolName: "*",
                condition: "(credit.?score|creditworthiness|credit.?rating)",
                ruleType: "REQUIRE_APPROVAL",
                priority: 20,
                description: "Credit scoring decisions require human oversight before execution",
                article: "Art. 14",
            },
            {
                toolName: "*",
                condition: "bulk.*(export|download).*(customer|account|portfolio)",
                ruleType: "DENY",
                priority: 5,
                description: "Prevent bulk export of customer financial data",
                article: "Art. 10",
            },
            {
                toolName: "*",
                condition: "(loan.approval|loan.rejection|mortgage.decision)",
                ruleType: "REQUIRE_APPROVAL",
                priority: 15,
                description: "Lending decisions must have human review before execution",
                article: "Art. 14",
            },
        ],
    },
    {
        id: "eu-ai-act-healthcare",
        name: "Healthcare",
        industry: "Medical & Clinical",
        tagline: "Guardrails for AI in medical diagnosis, patient records, and clinical decisions.",
        articles: ["Art. 9", "Art. 14", "Art. 10"],
        accentClass: "rose",
        rules: [
            {
                toolName: "*",
                condition: "(patient|ehr|medical.record|health.record).*(write|update|modify|create)",
                ruleType: "REQUIRE_APPROVAL",
                priority: 10,
                description: "Medical record modifications require clinician approval",
                article: "Art. 14",
            },
            {
                toolName: "database",
                condition: "DELETE.*(patient|health|clinical|medical)",
                ruleType: "DENY",
                priority: 1,
                description: "Block deletion of patient health records",
                article: "Art. 9",
            },
            {
                toolName: "*",
                condition: "(dosage|prescription|medic[ai]tion|drug.order)",
                ruleType: "REQUIRE_APPROVAL",
                priority: 5,
                description: "Medication and prescription actions require physician sign-off",
                article: "Art. 14",
            },
            {
                toolName: "*",
                condition: "(send|share|transmit|export).*patient",
                ruleType: "DENY",
                priority: 3,
                description: "Block unauthorised sharing of patient data outside the system",
                article: "Art. 10",
            },
            {
                toolName: "*",
                condition: "(diagnos[ei]|treatment.plan|clinical.decision)",
                ruleType: "REQUIRE_APPROVAL",
                priority: 15,
                description: "Clinical decisions must be reviewed by a qualified professional",
                article: "Art. 14",
            },
        ],
    },
    {
        id: "eu-ai-act-hr",
        name: "HR & Employment",
        industry: "Human Resources",
        tagline: "Safeguards for AI in hiring, performance reviews, and employment decisions.",
        articles: ["Art. 9", "Art. 14", "Art. 13"],
        accentClass: "violet",
        rules: [
            {
                toolName: "*",
                condition: "(hire|reject|shortlist).*(candidate|applicant|employee)",
                ruleType: "REQUIRE_APPROVAL",
                priority: 10,
                description: "Hiring and rejection decisions require human sign-off",
                article: "Art. 14",
            },
            {
                toolName: "*",
                condition: "(terminate|dismiss|layoff|fire|redundanc)",
                ruleType: "DENY",
                priority: 1,
                description: "Automated employee termination is blocked — requires human authority",
                article: "Art. 9",
            },
            {
                toolName: "*",
                condition: "(salary|compensation|bonus|pay.?rise|pay.?increase)",
                ruleType: "REQUIRE_APPROVAL",
                priority: 15,
                description: "Compensation changes require HR manager approval",
                article: "Art. 14",
            },
            {
                toolName: "*",
                condition: "(performance.review|appraisal|evaluation).*(submit|publish|final)",
                ruleType: "REQUIRE_APPROVAL",
                priority: 20,
                description: "Performance evaluations must be reviewed before publishing",
                article: "Art. 14",
            },
            {
                toolName: "database",
                condition: "bulk.*(export|download).*(employ|staff|personnel|hr)",
                ruleType: "DENY",
                priority: 5,
                description: "Prevent bulk export of HR and employee personal data",
                article: "Art. 10",
            },
        ],
    },
];
