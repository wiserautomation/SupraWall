// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';
import chalk from 'chalk';

import { detectEnvironment, type DetectedEnvironment, type Language } from '../detectors/framework';
import { findAgentFiles, type AgentFile } from '../detectors/agent-files';
import { injectIntoTypeScriptFile } from '../injectors/typescript';
import { injectIntoPythonFile } from '../injectors/python';
import {
    printBanner,
    printSuccessScreen,
    printStep,
    printStepDone,
    printStepSkipped,
    printError,
    printInfo,
} from '../ui/banner';

// ─── Constants ────────────────────────────────────────────────────────────────

const DASHBOARD_URL = 'https://www.supra-wall.com/dashboard';
const SIGNUP_URL = 'https://www.supra-wall.com/signup';
const CLOUD_EVAL_URL = 'https://www.supra-wall.com/api/v1/evaluate';
const LOCAL_EVAL_URL = 'http://localhost:4242/v1/evaluate';

const DEFAULT_POLICY_JSON = JSON.stringify(
    {
        $schema: 'https://www.supra-wall.com/schemas/config.json',
        mode: 'self-hosted',
        defaultPolicy: 'DENY',
        guardrails: {
            maxIterations: 50,
            loopDetection: true,
            loopThreshold: 3,
        },
        auditLog: {
            enabled: true,
            output: './suprawall-audit.log',
        },
        policies: [
            {
                name: 'default-deny-unknown',
                toolPattern: '*',
                decision: 'DENY',
                description: 'Block all unknown tools by default (EU AI Act Article 12 compliant)',
            },
        ],
    },
    null,
    2
);

// ─── Utilities ────────────────────────────────────────────────────────────────

function prompt(question: string): Promise<string> {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

function promptYesNo(question: string, defaultYes = true): Promise<boolean> {
    const hint = defaultYes ? chalk.gray('(Y/n)') : chalk.gray('(y/N)');
    return prompt(`${chalk.cyan('?')} ${question} ${hint} `).then(raw => {
        if (!raw) return defaultYes;
        return raw.toLowerCase().startsWith('y');
    });
}

function promptSelect(question: string, options: string[]): Promise<number> {
    return new Promise(resolve => {
        console.log(`${chalk.cyan('?')} ${question}`);
        options.forEach((opt, i) => {
            const prefix = i === 0 ? chalk.cyan('  ❯') : '   ';
            console.log(`${prefix} ${opt}`);
        });
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        rl.question(chalk.gray('\n  Enter 1 or 2 (default 1): '), raw => {
            rl.close();
            const n = parseInt(raw, 10);
            if (isNaN(n) || n < 1 || n > options.length) resolve(0);
            else resolve(n - 1);
        });
    });
}

function getInstallCommand(pm: string, pkg: string): string {
    switch (pm) {
        case 'pnpm': return `pnpm add ${pkg}`;
        case 'yarn': return `yarn add ${pkg}`;
        default: return `npm install ${pkg} --save`;
    }
}

function tryOpenBrowser(url: string): void {
    const commands: Record<string, string> = {
        darwin: `open "${url}"`,
        linux: `xdg-open "${url}"`,
        win32: `start "${url}"`,
    };
    const cmd = commands[process.platform];
    if (!cmd) return;
    try {
        execSync(cmd, { stdio: 'ignore' });
    } catch {
        // Non-fatal: user can open manually
    }
}

// ─── .env helpers ─────────────────────────────────────────────────────────────

/**
 * Reads an existing .env file if present. Returns a key→value map.
 * Lines that don't match VAR=value are preserved verbatim.
 */
function parseEnvFile(filePath: string): Map<string, string> {
    const map = new Map<string, string>();
    if (!fs.existsSync(filePath)) return map;
    const lines = fs.readFileSync(filePath, 'utf8').split('\n');
    for (const line of lines) {
        const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
        if (m) map.set(m[1], m[2]);
    }
    return map;
}

/**
 * Writes key→value pairs to .env, merging with any existing entries.
 * Never truncates existing keys not in `updates`.
 */
function writeEnvFile(filePath: string, updates: Record<string, string>): void {
    const existing = parseEnvFile(filePath);
    for (const [k, v] of Object.entries(updates)) {
        existing.set(k, v);
    }
    const lines = Array.from(existing.entries()).map(([k, v]) => `${k}=${v}`);
    fs.writeFileSync(filePath, lines.join('\n') + '\n', 'utf8');
}

// ─── Install helpers ──────────────────────────────────────────────────────────

function installNodeSdk(packageManager: string, projectRoot: string): boolean {
    const cmd = getInstallCommand(packageManager, '@suprawall/sdk');
    printStep(`Installing SDK (${cmd})`);
    try {
        execSync(cmd, { cwd: projectRoot, stdio: 'pipe' });
        printStepDone();
        return true;
    } catch (e: any) {
        process.stdout.write(' ' + chalk.yellow('(already installed or install failed — continuing)') + '\n');
        return false;
    }
}

function installPythonSdk(projectRoot: string): boolean {
    printStep('Installing SDK (pip install suprawall-sdk)');
    try {
        execSync('pip install suprawall-sdk', { cwd: projectRoot, stdio: 'pipe' });
        printStepDone();
        return true;
    } catch {
        // Try pip3
        try {
            execSync('pip3 install suprawall-sdk', { cwd: projectRoot, stdio: 'pipe' });
            printStepDone();
            return true;
        } catch {
            process.stdout.write(' ' + chalk.yellow('(skipped — install manually: pip install suprawall-sdk)') + '\n');
            return false;
        }
    }
}

// ─── Main init flow ───────────────────────────────────────────────────────────

export async function runInit(projectRoot: string): Promise<void> {
    printBanner();

    // ── Step 1: Detect environment ────────────────────────────────────────────
    const env = detectEnvironment(projectRoot);
    const agentFiles = findAgentFiles(projectRoot);

    if (env) {
        console.log(
            chalk.gray('  Detected: ') +
            chalk.white(env.frameworkDisplayName) +
            chalk.gray(` (${env.language})`)
        );
    } else {
        console.log(chalk.gray('  No AI framework detected — running generic setup.'));
    }

    // ── Step 2: Select agent file to wrap ─────────────────────────────────────
    let targetAgentFile: AgentFile | null = null;
    let wrapAgent = false;

    if (agentFiles.length > 0) {
        const first = agentFiles[0];
        wrapAgent = await promptYesNo(
            `Detected: ${chalk.cyan(first.relativePath)} — secure it?`,
            true
        );
        if (wrapAgent) {
            targetAgentFile = first;
            if (agentFiles.length > 1) {
                printInfo(`Found ${agentFiles.length - 1} more agent file(s). You can re-run to wrap them.`);
            }
        }
    } else if (env) {
        printInfo('No agent files detected. SDK will be installed and you can wrap manually.');
    }

    // ── Step 3: Cloud or self-hosted? ─────────────────────────────────────────
    const existingKey = process.env['SUPRAWALL_API_KEY'];
    let mode: 'cloud' | 'self-hosted';
    let apiKey: string | null = existingKey ?? null;

    if (existingKey) {
        console.log(chalk.gray(`\n  Found existing SUPRAWALL_API_KEY — using cloud mode.\n`));
        mode = 'cloud';
    } else {
        const choice = await promptSelect(
            'How do you want to run SupraWall?',
            [
                'Cloud (free account — EU AI Act audit reports)',
                'Self-hosted (no account needed)',
            ]
        );
        mode = choice === 0 ? 'cloud' : 'self-hosted';
    }

    if (mode === 'cloud' && !apiKey) {
        const rawKey = await prompt(
            `\n${chalk.cyan('?')} Paste your SupraWall API key ${chalk.gray('(or press Enter to create a free account)')}: `
        );

        if (!rawKey) {
            console.log(chalk.gray('\n  Opening supra-wall.com/signup in your browser...'));
            tryOpenBrowser(SIGNUP_URL);
            console.log(
                chalk.yellow('\n  After signing up, re-run: ') +
                chalk.bold('npx suprawall init\n')
            );
            process.exit(0);
        }

        apiKey = rawKey;
    }

    // ── Step 4: Determine language (use detected or infer from target file) ────
    const language: Language =
        targetAgentFile?.language ??
        env?.language ??
        'typescript';

    const packageManager = env?.packageManager ?? 'npm';

    console.log('');

    // ── Step 5: Install SDK ───────────────────────────────────────────────────
    const successItems: Array<{ label: string }> = [];

    if (language === 'python') {
        installPythonSdk(projectRoot);
        successItems.push({ label: 'SDK installed (suprawall-sdk)' });
    } else {
        installNodeSdk(packageManager, projectRoot);
        successItems.push({ label: 'SDK installed (@suprawall/sdk)' });
    }

    // ── Step 6: Write .env ────────────────────────────────────────────────────
    const envPath = path.join(projectRoot, '.env');
    const envUpdates: Record<string, string> = {};

    if (mode === 'cloud' && apiKey) {
        printStep('Updating .env with SUPRAWALL_API_KEY');
        envUpdates['SUPRAWALL_API_KEY'] = apiKey;
        writeEnvFile(envPath, envUpdates);
        printStepDone();
        successItems.push({ label: '.env updated with SUPRAWALL_API_KEY' });

        // Ensure .env is in .gitignore
        guardGitignore(projectRoot);
    } else if (mode === 'self-hosted') {
        printStep('Writing suprawall.config.json (self-hosted policy)');
        const configPath = path.join(projectRoot, 'suprawall.config.json');
        if (!fs.existsSync(configPath)) {
            fs.writeFileSync(configPath, DEFAULT_POLICY_JSON, 'utf8');
            printStepDone();
            successItems.push({ label: 'suprawall.config.json created (self-hosted mode)' });
        } else {
            printStepSkipped('suprawall.config.json already exists');
        }
    }

    // ── Step 7: Inject wrapper into agent file ────────────────────────────────
    if (wrapAgent && targetAgentFile) {
        printStep(`Wrapping ${chalk.cyan(targetAgentFile.relativePath)} with protect()`);

        let result;
        if (targetAgentFile.language === 'python') {
            result = injectIntoPythonFile(targetAgentFile.absolutePath, mode);
        } else {
            result = injectIntoTypeScriptFile(targetAgentFile.absolutePath, mode);
        }

        if (result.alreadyWrapped) {
            printStepSkipped('already wrapped');
        } else if (result.success) {
            printStepDone();
            successItems.push({ label: `${targetAgentFile.relativePath} wrapped with protect()` });
        } else {
            process.stdout.write(' ' + chalk.yellow(`(could not auto-inject: ${result.error})`) + '\n');
            printInfo(`Add manually:\n    import { protect } from '@suprawall/sdk';\n    const secured = protect(yourAgent, { apiKey: process.env.SUPRAWALL_API_KEY! });`);
        }
    }

    // ── Step 8: Write default policy item into success list ───────────────────
    successItems.push({ label: 'Default policy: DENY unknown tools' });
    successItems.push({ label: 'Audit logging: active' });

    // ── Step 9: Print success screen ─────────────────────────────────────────
    printSuccessScreen(
        successItems,
        mode,
        env?.frameworkDisplayName ?? null,
        targetAgentFile?.relativePath ?? null
    );

    // ── Step 10: Open dashboard (cloud only) ──────────────────────────────────
    if (mode === 'cloud') {
        console.log(chalk.gray('  Opening your dashboard...'));
        tryOpenBrowser(DASHBOARD_URL);
    }
}

// ─── Guard helpers ────────────────────────────────────────────────────────────

/**
 * Ensures `.env` is in `.gitignore` to prevent accidental secret commits.
 */
function guardGitignore(projectRoot: string): void {
    const gitignorePath = path.join(projectRoot, '.gitignore');
    if (!fs.existsSync(gitignorePath)) return;

    const content = fs.readFileSync(gitignorePath, 'utf8');
    const lines = content.split('\n').map(l => l.trim());
    if (!lines.includes('.env') && !lines.includes('.env*')) {
        fs.appendFileSync(gitignorePath, '\n.env\n', 'utf8');
    }
}
