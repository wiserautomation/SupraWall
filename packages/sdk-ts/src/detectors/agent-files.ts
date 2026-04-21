// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import type { Language, Framework } from './framework';

export interface AgentFile {
    absolutePath: string;
    relativePath: string;
    language: Language;
    inferredFramework: Framework;
}

const EXCLUDED_DIRS = new Set([
    'node_modules', 'dist', 'build', '.next', 'venv', '__pycache__',
    '.turbo', '.vercel', 'coverage', '.git',
]);

const TS_JS_AGENT_PATTERNS: RegExp[] = [
    /agent/i,
    /crew/i,
    /bot/i,
    /assistant/i,
    /executor/i,
];

const PYTHON_AGENT_PATTERNS: RegExp[] = [
    /agent/i,
    /crew/i,
    /bot/i,
    /assistant/i,
    /graph/i,
];

const TS_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const PY_EXTENSIONS = new Set(['.py']);

function inferFrameworkFromContent(absolutePath: string, language: Language): Framework {
    let content: string;
    try {
        content = fs.readFileSync(absolutePath, 'utf8');
    } catch {
        return 'generic';
    }

    if (language === 'python') {
        if (/from\s+crewai\b|import\s+crewai\b/i.test(content)) return 'crewai';
        if (/from\s+autogen\b|import\s+autogen\b|from\s+pyautogen\b/i.test(content)) return 'autogen';
        if (/from\s+langchain\b|from\s+langchain_/i.test(content)) return 'langchain';
        if (/from\s+openai_agents\b|import\s+openai_agents\b/i.test(content)) return 'openai-agents';
        return 'generic';
    }

    // TypeScript / JavaScript
    if (/@langchain\/core|from\s+['"]langchain/i.test(content)) return 'langchain';
    if (/from\s+['"]ai['"]/i.test(content) && /createTool|generateText|streamText/i.test(content)) return 'vercel-ai';
    if (/from\s+['"]openai-agents['"]/i.test(content)) return 'openai-agents';
    return 'generic';
}

function walkDirectory(
    dirPath: string,
    projectRoot: string,
    results: AgentFile[],
    maxDepth: number,
    currentDepth: number
): void {
    if (currentDepth > maxDepth) return;

    let entries: fs.Dirent[];
    try {
        entries = fs.readdirSync(dirPath, { withFileTypes: true });
    } catch {
        return;
    }

    for (const entry of entries) {
        if (EXCLUDED_DIRS.has(entry.name)) continue;

        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            walkDirectory(fullPath, projectRoot, results, maxDepth, currentDepth + 1);
            continue;
        }

        if (!entry.isFile()) continue;

        const ext = path.extname(entry.name).toLowerCase();
        const baseName = path.basename(entry.name, ext).toLowerCase();

        if (TS_EXTENSIONS.has(ext)) {
            if (TS_JS_AGENT_PATTERNS.some(pattern => pattern.test(baseName))) {
                const language: Language = ext === '.ts' || ext === '.tsx' ? 'typescript' : 'javascript';
                results.push({
                    absolutePath: fullPath,
                    relativePath: path.relative(projectRoot, fullPath),
                    language,
                    inferredFramework: inferFrameworkFromContent(fullPath, language),
                });
            }
        } else if (PY_EXTENSIONS.has(ext)) {
            if (PYTHON_AGENT_PATTERNS.some(pattern => pattern.test(baseName))) {
                results.push({
                    absolutePath: fullPath,
                    relativePath: path.relative(projectRoot, fullPath),
                    language: 'python',
                    inferredFramework: inferFrameworkFromContent(fullPath, 'python'),
                });
            }
        }
    }
}

/**
 * Finds agent files in `projectRoot` up to 6 directories deep.
 * Excludes build artifacts, node_modules, venvs, and similar.
 * Returns an array of AgentFile descriptors, sorted by path depth (shallowest first).
 */
export function findAgentFiles(projectRoot: string): AgentFile[] {
    const results: AgentFile[] = [];
    walkDirectory(projectRoot, projectRoot, results, 6, 0);

    // Sort shallowest first so we offer the most likely candidate at the top
    results.sort((a, b) => {
        const depthA = a.relativePath.split(path.sep).length;
        const depthB = b.relativePath.split(path.sep).length;
        return depthA - depthB;
    });

    return results;
}
