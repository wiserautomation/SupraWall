// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';

export type Language = 'typescript' | 'javascript' | 'python';
export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'pip';
export type Framework = 'langchain' | 'crewai' | 'autogen' | 'vercel-ai' | 'openai-agents' | 'generic';

export interface DetectedEnvironment {
    framework: Framework;
    language: Language;
    packageManager: PackageManager;
    frameworkDisplayName: string;
}

interface FrameworkSignal {
    framework: Framework;
    displayName: string;
    packageJsonKeys: string[];
    requirementsTxtPatterns: RegExp[];
}

const FRAMEWORK_SIGNALS: FrameworkSignal[] = [
    {
        framework: 'langchain',
        displayName: 'LangChain',
        packageJsonKeys: ['@langchain/core', 'langchain', '@langchain/openai', '@langchain/anthropic'],
        requirementsTxtPatterns: [/^langchain[>=<\s]/mi, /^langchain$/mi],
    },
    {
        framework: 'vercel-ai',
        displayName: 'Vercel AI SDK',
        packageJsonKeys: ['ai'],
        requirementsTxtPatterns: [],
    },
    {
        framework: 'openai-agents',
        displayName: 'OpenAI Agents SDK',
        packageJsonKeys: ['openai-agents', '@openai/agents'],
        requirementsTxtPatterns: [/^openai-agents[>=<\s]/mi, /^openai-agents$/mi],
    },
    {
        framework: 'crewai',
        displayName: 'CrewAI',
        packageJsonKeys: [],
        requirementsTxtPatterns: [/^crewai[>=<\s]/mi, /^crewai$/mi],
    },
    {
        framework: 'autogen',
        displayName: 'AutoGen',
        packageJsonKeys: [],
        requirementsTxtPatterns: [/^autogen[>=<\s]/mi, /^pyautogen[>=<\s]/mi, /^ag2[>=<\s]/mi],
    },
];

function detectPackageManager(projectRoot: string): PackageManager {
    if (fs.existsSync(path.join(projectRoot, 'pnpm-lock.yaml'))) return 'pnpm';
    if (fs.existsSync(path.join(projectRoot, 'yarn.lock'))) return 'yarn';
    return 'npm';
}

function detectFromPackageJson(projectRoot: string): { framework: Framework; displayName: string; language: Language } | null {
    const pkgPath = path.join(projectRoot, 'package.json');
    if (!fs.existsSync(pkgPath)) return null;

    let pkg: { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
    try {
        pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    } catch {
        return null;
    }

    const allDeps = {
        ...(pkg.dependencies ?? {}),
        ...(pkg.devDependencies ?? {}),
    };
    const depKeys = Object.keys(allDeps);

    for (const signal of FRAMEWORK_SIGNALS) {
        if (signal.packageJsonKeys.some(key => depKeys.includes(key))) {
            // Check if TypeScript is present
            const language: Language = depKeys.includes('typescript') || depKeys.includes('ts-node')
                ? 'typescript'
                : 'javascript';
            return { framework: signal.framework, displayName: signal.displayName, language };
        }
    }

    return null;
}

function detectFromRequirementsTxt(projectRoot: string): { framework: Framework; displayName: string } | null {
    const requirementsFiles = ['requirements.txt', 'requirements-dev.txt', 'pyproject.toml'];

    for (const filename of requirementsFiles) {
        const filePath = path.join(projectRoot, filename);
        if (!fs.existsSync(filePath)) continue;

        let content: string;
        try {
            content = fs.readFileSync(filePath, 'utf8');
        } catch {
            continue;
        }

        for (const signal of FRAMEWORK_SIGNALS) {
            if (signal.requirementsTxtPatterns.some(pattern => pattern.test(content))) {
                return { framework: signal.framework, displayName: signal.displayName };
            }
        }
    }

    return null;
}

function detectLanguage(projectRoot: string): Language {
    if (
        fs.existsSync(path.join(projectRoot, 'package.json')) ||
        fs.existsSync(path.join(projectRoot, 'tsconfig.json'))
    ) {
        const pkgPath = path.join(projectRoot, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                const allDeps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
                return Object.keys(allDeps).includes('typescript') || fs.existsSync(path.join(projectRoot, 'tsconfig.json'))
                    ? 'typescript'
                    : 'javascript';
            } catch {
                return 'javascript';
            }
        }
        return 'typescript';
    }

    if (
        fs.existsSync(path.join(projectRoot, 'requirements.txt')) ||
        fs.existsSync(path.join(projectRoot, 'pyproject.toml')) ||
        fs.existsSync(path.join(projectRoot, 'setup.py'))
    ) {
        return 'python';
    }

    return 'typescript';
}

/**
 * Auto-detects the AI framework and language used in the project at `projectRoot`.
 * Returns a complete DetectedEnvironment or null if nothing can be identified.
 */
export function detectEnvironment(projectRoot: string): DetectedEnvironment | null {
    const pkgResult = detectFromPackageJson(projectRoot);
    if (pkgResult) {
        return {
            framework: pkgResult.framework,
            frameworkDisplayName: pkgResult.displayName,
            language: pkgResult.language,
            packageManager: detectPackageManager(projectRoot),
        };
    }

    const pyResult = detectFromRequirementsTxt(projectRoot);
    if (pyResult) {
        return {
            framework: pyResult.framework,
            frameworkDisplayName: pyResult.displayName,
            language: 'python',
            packageManager: 'pip',
        };
    }

    // Fallback: detect language only, no specific framework
    const language = detectLanguage(projectRoot);
    if (language === 'python') {
        return {
            framework: 'generic',
            frameworkDisplayName: 'Generic Python Agent',
            language: 'python',
            packageManager: 'pip',
        };
    }

    if (fs.existsSync(path.join(projectRoot, 'package.json'))) {
        return {
            framework: 'generic',
            frameworkDisplayName: 'Generic TypeScript/JavaScript Agent',
            language,
            packageManager: detectPackageManager(projectRoot),
        };
    }

    return null;
}
