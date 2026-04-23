// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface TemplateHeroProps {
    badge: string;
    title: string;
    description: string;
}

export function TemplateHero({ badge, title, description }: TemplateHeroProps) {
    return (
        <section className="relative overflow-hidden pt-20 pb-12 sm:pt-32 sm:pb-16">
            {/* Background pattern/gradient */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(59,130,246,0.1)_0%,transparent_100%)]" />
            
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <div className="flex items-center gap-x-3">
                        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs font-black uppercase tracking-widest text-blue-400 ring-1 ring-inset ring-blue-500/20">
                            {badge}
                        </span>
                        <div className="h-px flex-auto bg-neutral-800" />
                    </div>
                    
                    <h1 className="mt-8 text-4xl font-black tracking-tight text-white sm:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-500">
                        {title}
                    </h1>
                    
                    <p className="mt-6 text-lg leading-8 text-neutral-400 max-w-xl">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
}
