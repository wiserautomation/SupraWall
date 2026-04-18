// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { CodeBlock } from './CodeBlock';

interface TemplateActivationSnippetProps {
    slug: string;
    dictionary: any;
}

export function TemplateActivationSnippet({ slug, dictionary }: TemplateActivationSnippetProps) {
    const common = dictionary.complianceTemplates.common;
    
    const code = `import { useCompliance } from '@suprawall/sdk';

// One-line activation for Annex III ${slug} compliance
const agent = useCompliance({ 
  template: '${slug}' 
});`;

    return (
        <div className="activation-snippet my-12 space-y-4">
            <div className="flex items-center gap-x-2">
                <div className="h-px flex-auto bg-blue-500/20" />
                <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">{common.activationHeader}</h4>
                <div className="h-px flex-auto bg-blue-500/20" />
            </div>
            
            <div className="max-w-2xl mx-auto">
                <CodeBlock code={code} language="typescript" />
            </div>
        </div>
    );
}
