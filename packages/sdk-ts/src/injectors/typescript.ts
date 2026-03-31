// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

export interface InjectionResult {
    success: boolean;
    alreadyWrapped: boolean;
    modifiedContent?: string;
    error?: string;
}

const SUPRAWALL_IMPORT = `import { protect } from 'suprawall';`;
const SUPRAWALL_IMPORT_DQ = `import { protect } from "suprawall";`;

const KEY_SOURCE_CLOUD = `process.env.SUPRAWALL_API_KEY!`;
const KEY_SOURCE_SELF = `process.env.SUPRAWALL_API_KEY || 'sw_local'`;

/**
 * Checks if the file already has a SupraWall import or protect() call.
 */
function isAlreadyWrapped(content: string): boolean {
    return (
        content.includes("from 'suprawall'") ||
        content.includes('from "suprawall"') ||
        content.includes('protect(') ||
        content.includes('withSupraWall(') ||
        content.includes('secure_agent(')
    );
}

/**
 * Finds the position of the last import statement in the file.
 * Returns -1 if no imports found.
 */
function findLastImportLineIndex(lines: string[]): number {
    let lastImportIdx = -1;
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trimStart();
        if (trimmed.startsWith('import ')) {
            lastImportIdx = i;
        }
    }
    return lastImportIdx;
}

/**
 * Attempts to find the primary agent export pattern and inject the wrapper.
 *
 * Patterns handled (in priority order):
 *  1. `export default agentVar;`
 *  2. `export default new AgentClass(...);`
 *  3. `const agent = new/create...` followed later by `export default agent`
 *  4. No export found — appends a commented example
 */
function injectProtectCall(
    lines: string[],
    apiKeySource: string
): { lines: string[]; injected: boolean } {
    const PROTECT_SNIPPET = (varName: string) =>
        `const _securedAgent = protect(${varName}, { apiKey: ${apiKeySource} });`;
    const EXPORT_SECURED = `export default _securedAgent;`;

    // Pattern 1 & 2: `export default <something>;`
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trimStart();
        if (!trimmed.startsWith('export default ')) continue;

        // Pattern 1: `export default agentVarName;`
        const varMatch = trimmed.match(/^export default ([a-zA-Z_$][a-zA-Z0-9_$]*);\s*$/);
        if (varMatch) {
            const varName = varMatch[1];
            // Replace `export default varName;` with protect wrapper + new export
            const newLines = [...lines];
            newLines.splice(i, 1,
                PROTECT_SNIPPET(varName),
                EXPORT_SECURED,
            );
            return { lines: newLines, injected: true };
        }

        // Pattern 2: `export default new Something(...)` — wrap the whole expression
        const exprMatch = trimmed.match(/^export default (.+);?\s*$/);
        if (exprMatch) {
            const expr = exprMatch[1].replace(/;$/, '');
            const newLines = [...lines];
            newLines.splice(i, 1,
                `const _rawAgent = ${expr};`,
                PROTECT_SNIPPET('_rawAgent'),
                EXPORT_SECURED,
            );
            return { lines: newLines, injected: true };
        }
    }

    // Pattern 3: no export default found, but we can append a block at the end
    return { lines, injected: false };
}

/**
 * Surgically injects SupraWall protection into a TypeScript or JavaScript agent file.
 *
 * Strategy:
 *  1. Check if already wrapped — if so, no-op.
 *  2. Add `import { protect } from 'suprawall'` after the last existing import.
 *  3. Find the agent's export and wrap it with `protect()`.
 *  4. If no wrappable export is found, append a commented example block.
 */
export function injectIntoTypeScriptFile(
    absolutePath: string,
    mode: 'cloud' | 'self-hosted'
): InjectionResult {
    let content: string;
    try {
        content = fs.readFileSync(absolutePath, 'utf8');
    } catch (e: any) {
        return { success: false, alreadyWrapped: false, error: `Cannot read file: ${e.message}` };
    }

    if (isAlreadyWrapped(content)) {
        return { success: true, alreadyWrapped: true };
    }

    const apiKeySource = mode === 'cloud' ? KEY_SOURCE_CLOUD : KEY_SOURCE_SELF;
    let lines = content.split('\n');

    // Step 1: Add import after last existing import
    const lastImportIdx = findLastImportLineIndex(lines);
    const supraImportLine = SUPRAWALL_IMPORT;

    if (lastImportIdx >= 0) {
        lines = [
            ...lines.slice(0, lastImportIdx + 1),
            supraImportLine,
            ...lines.slice(lastImportIdx + 1),
        ];
    } else {
        // No existing imports, prepend
        lines = [supraImportLine, '', ...lines];
    }

    // Step 2: Inject protect() call around the agent export
    const { lines: injectedLines, injected } = injectProtectCall(lines, apiKeySource);

    if (!injected) {
        // Graceful fallback: append a commented block the user can fill in
        injectedLines.push('');
        injectedLines.push('// TODO: Wrap your agent with SupraWall:');
        injectedLines.push(`// const securedAgent = protect(yourAgent, { apiKey: ${apiKeySource} });`);
        injectedLines.push('// export default securedAgent;');
    }

    const modifiedContent = injectedLines.join('\n');

    try {
        fs.writeFileSync(absolutePath, modifiedContent, 'utf8');
    } catch (e: any) {
        return { success: false, alreadyWrapped: false, error: `Cannot write file: ${e.message}` };
    }

    return { success: true, alreadyWrapped: false, modifiedContent };
}
