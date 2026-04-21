#!/usr/bin/env node
// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Command } from 'commander';
import chalk from 'chalk';
import path from 'path';
import { verifyConnection } from './index';
import type { SupraWallOptions } from './index';

const program = new Command();

program
    .name('suprawall')
    .description('SupraWall CLI — The Compliance OS for AI Agents')
    .version('1.1.0');

// ─── init ─────────────────────────────────────────────────────────────────────

program
    .command('init')
    .description('Initialize SupraWall in your project (interactive setup)')
    .option('--dir <path>', 'Project root directory', process.cwd())
    .action(async (options: { dir: string }) => {
        // Lazy import to keep startup fast when running `suprawall test`
        const { runInit } = await import('./commands/init');
        const projectRoot = path.resolve(options.dir);
        try {
            await runInit(projectRoot);
        } catch (err: any) {
            // Keep the error message readable — don't dump a full stack to the user
            console.error(chalk.red(`\n  ✖ Unexpected error: ${err?.message ?? String(err)}\n`));
            process.exit(1);
        }
    });

// ─── test (pre-existing, preserved) ──────────────────────────────────────────

program
    .command('test')
    .description('Verify your SupraWall API key and connection')
    .requiredOption('--api-key <key>', 'Your SupraWall API key (or set SUPRAWALL_API_KEY env var)')
    .option('--url <url>', 'Override the evaluation endpoint', 'https://www.supra-wall.com/api/v1/evaluate')
    .action(async (options: { apiKey: string; url: string }) => {
        const apiKey = options.apiKey || process.env['SUPRAWALL_API_KEY'] || '';
        if (!apiKey) {
            console.error(chalk.red('  ✖ Missing API key. Use --api-key or set SUPRAWALL_API_KEY.'));
            process.exit(1);
        }

        const sdkOptions: SupraWallOptions = {
            apiKey,
            cloudFunctionUrl: options.url,
            logger: { warn: () => {}, error: () => {}, log: () => {} },
        };

        console.log(chalk.gray(`\n  Testing connection to SupraWall Control Plane...`));
        console.log(chalk.gray(`  URL: ${options.url}\n`));

        const status = await verifyConnection(sdkOptions);

        if (status.status === 'ACTIVE') {
            console.log(chalk.green(`  ✔ Connection:`) + chalk.white(`     OK (${status.latencyMs}ms latency)`));
            console.log(chalk.green(`  ✔ Authentication:`) + chalk.white(`  API key valid (Agent: ${status.agentName || status.agentId || 'unknown'})`));
            console.log(chalk.green(`  ✔ Policy Engine:`) + chalk.white(`   ${status.policiesLoaded ?? 0} policies active`));
            console.log(chalk.green(`  ✔ Vault:`) + chalk.white(`           ${status.vaultSecretsAvailable ?? 0} secrets accessible`));
            console.log(chalk.green(`  ✔ Threat Intel:`) + chalk.white(`    Detection ${status.threatDetection || 'active'}`));
            console.log(chalk.hex('#6366f1')(`\n  🟢 SupraWall is fully operational. Your agents are protected.\n`));
        } else {
            console.error(chalk.red(`  ✖ Connection failed: ${status.error}`));
            console.error(chalk.yellow(`\n  ⚠ SupraWall is NOT operational. Check your configuration.\n`));
            process.exit(1);
        }
    });

program.parse(process.argv);
