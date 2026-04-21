// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

export interface PythonInjectionResult {
    success: boolean;
    alreadyWrapped: boolean;
    modifiedContent?: string;
    error?: string;
}

const SUPRAWALL_IMPORT = `from suprawall import secure_agent`;
const OS_IMPORT = `import os`;

/**
 * Checks if the file already imports or uses SupraWall.
 */
function isAlreadyWrapped(content: string): boolean {
    return (
        content.includes('from suprawall') ||
        content.includes('import suprawall') ||
        content.includes('secure_agent(') ||
        content.includes('with_suprawall(') ||
        content.includes('protect(')
    );
}

/**
 * Finds the index of the last import line in the Python file.
 * Handles both `import X` and `from X import Y` forms.
 * Returns -1 if no imports found.
 */
function findLastPythonImportIndex(lines: string[]): number {
    let lastIdx = -1;
    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trimStart();
        if (trimmed.startsWith('import ') || trimmed.startsWith('from ')) {
            lastIdx = i;
        }
    }
    return lastIdx;
}

/**
 * Checks if `import os` is already present in the file.
 */
function hasOsImport(lines: string[]): boolean {
    return lines.some(line => /^import os\s*$/.test(line.trim()));
}

/**
 * Finds the first assignment to a variable that looks like an agent.
 * Returns the index of that line and the variable name, or null.
 *
 * Matches patterns like:
 *   agent = Agent(...)
 *   my_agent = create_agent(...)
 *   crew = Crew(...)
 *   executor = AgentExecutor(...)
 */
function findFirstAgentAssignment(lines: string[]): { index: number; varName: string } | null {
    const AGENT_PATTERNS = /^([a-z_][a-z0-9_]*)\s*=\s*(Agent|Crew|AgentExecutor|create_agent|build_agent|ConversableAgent|AssistantAgent)\s*\(/i;

    for (let i = 0; i < lines.length; i++) {
        const trimmed = lines[i].trimStart();
        const m = AGENT_PATTERNS.exec(trimmed);
        if (m) {
            return { index: i, varName: m[1] };
        }
    }
    return null;
}

/**
 * Finds the end of a possibly multi-line assignment block starting at `startIndex`.
 * Simple heuristic: scan forward until parentheses are balanced.
 */
function findAssignmentEndIndex(lines: string[], startIndex: number): number {
    let depth = 0;
    let started = false;

    for (let i = startIndex; i < lines.length; i++) {
        for (const char of lines[i]) {
            if (char === '(') { depth++; started = true; }
            if (char === ')') { depth--; }
        }
        if (started && depth <= 0) return i;
    }
    return startIndex;
}

/**
 * Surgically injects SupraWall protection into a Python agent file.
 *
 * Strategy:
 *  1. Check if already wrapped — if so, no-op.
 *  2. Add `from suprawall import secure_agent` + `import os` after the last import.
 *  3. Find the first agent-like assignment and inject a wrap line after it.
 *  4. If no agent assignment found, append a TODO comment at the end.
 */
export function injectIntoPythonFile(
    absolutePath: string,
    mode: 'cloud' | 'self-hosted'
): PythonInjectionResult {
    let content: string;
    try {
        content = fs.readFileSync(absolutePath, 'utf8');
    } catch (e: any) {
        return { success: false, alreadyWrapped: false, error: `Cannot read file: ${e.message}` };
    }

    if (isAlreadyWrapped(content)) {
        return { success: true, alreadyWrapped: true };
    }

    const apiKeyExpr = mode === 'cloud'
        ? `api_key=os.environ["SUPRAWALL_API_KEY"]`
        : `api_key=os.environ.get("SUPRAWALL_API_KEY", "sw_local")`;

    let lines = content.split('\n');

    // Step 1: Add imports after last existing import
    const lastImportIdx = findLastPythonImportIndex(lines);
    const newImports: string[] = [];
    if (!hasOsImport(lines)) newImports.push(OS_IMPORT);
    newImports.push(SUPRAWALL_IMPORT);

    if (lastImportIdx >= 0) {
        lines = [
            ...lines.slice(0, lastImportIdx + 1),
            ...newImports,
            ...lines.slice(lastImportIdx + 1),
        ];
    } else {
        // No imports at all — prepend
        lines = [...newImports, '', ...lines];
    }

    // Step 2: Find first agent assignment and inject wrapper after it
    const assignment = findFirstAgentAssignment(lines);

    if (assignment) {
        const endIdx = findAssignmentEndIndex(lines, assignment.index);
        const wrapLine = `${assignment.varName} = secure_agent(${assignment.varName}, ${apiKeyExpr})`;
        lines = [
            ...lines.slice(0, endIdx + 1),
            wrapLine,
            ...lines.slice(endIdx + 1),
        ];
    } else {
        // Graceful fallback
        lines.push('');
        lines.push('# TODO: Wrap your agent with SupraWall:');
        lines.push(`# your_agent = secure_agent(your_agent, ${apiKeyExpr})`);
    }

    const modifiedContent = lines.join('\n');

    try {
        fs.writeFileSync(absolutePath, modifiedContent, 'utf8');
    } catch (e: any) {
        return { success: false, alreadyWrapped: false, error: `Cannot write file: ${e.message}` };
    }

    return { success: true, alreadyWrapped: false, modifiedContent };
}
