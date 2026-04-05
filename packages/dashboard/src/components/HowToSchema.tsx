// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface HowToStep {
    name: string;
    text: string;
    url?: string;
    image?: string;
}

interface HowToSchemaProps {
    name: string;
    description: string;
    steps: HowToStep[];
    totalTime?: string; // PT5M
}

/**
 * HowToSchema component for injecting Google-friendly step-by-step rich results.
 * Usage: Place this inside a page to boost visibility for "How to [Action]" queries.
 */
export function HowToSchema({ name, description, steps, totalTime = "PT5M" }: HowToSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": name,
        "description": description,
        "totalTime": totalTime,
        "step": steps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.name,
            "itemListElement": [
                {
                    "@type": "HowToDirection",
                    "text": step.text
                }
            ],
            ...(step.url && { "url": step.url }),
            ...(step.image && { "image": step.image })
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
