#!/usr/bin/env node
// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Command } from 'commander';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import colorize from 'json-colorizer';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { Database } from 'sqlite3';
import { DeterministicEngine, EvaluateRequest, SupraWallPolicy } from '@suprawall/core';

dotenv.config();

const program = new Command();
const API_URL = process.env.SUPRAWALL_API_URL || 'https://www.supra-wall.com/api/v1';

// Dynamic import for YAML support to avoid hard dependency if not installed
let yaml: any = null;
try {
    yaml = require('js-yaml');
} catch (e) {
    // YAML support will be unavailable
}

function getApiKey() {
    return process.env.SUPRAWALL_API_KEY;
}

program
    .name('suprawall')
    .description('suprawall CLI - The powerful way to manage AI Agent Security')
    .version('1.0.0');

// ... (login, agents, policies, logs commands stay similar but updated for new logic)

// validate Command (Renamed from 'test')
program
    .command('validate')
    .description('Validate a policy file locally or against the cloud API')
    .argument('<file>', 'Policy definitions file (.json or .yaml)')
    .option('--tool <name>', 'Tool name to test against')
    .option('--args <json>', 'Tool arguments context as JSON string')
    .option('--dry-run', 'Run validation without failing the process exit code')
    .option('--remote', 'Include Layer 2 (Semantic) cloud validation (requires API key)')
    .action(async (file, options) => {
        try {
            const filePath = path.resolve(process.cwd(), file);
            if (!fs.existsSync(filePath)) {
                console.error(chalk.red(`Error: File ${file} not found.`));
                process.exit(1);
            }

            const content = fs.readFileSync(filePath, 'utf8');
            let policy: SupraWallPolicy;

            const ext = path.extname(file).toLowerCase();
            if (ext === '.yaml' || ext === '.yml') {
                if (!yaml) {
                    console.error(chalk.red("Error: YAML support requires 'js-yaml'. Please run 'npm install js-yaml' in the CLI package."));
                    process.exit(1);
                }
                policy = yaml.load(content) as SupraWallPolicy;
            } else {
                policy = JSON.parse(content);
            }

            console.log(chalk.blue(`🛡️  SupraWall: Validating policy '${policy.name}' (v${policy.version})`));

            const engine = new DeterministicEngine([policy]);
            const request: EvaluateRequest = {
                toolName: options.tool || 'test:tool',
                arguments: options.args ? JSON.parse(options.args) : {}
            };

            // Layer 1: Deterministic evaluation
            const result = engine.evaluate(request);

            console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
            console.log(chalk.white('Layer 1 (Deterministic):'), result.decision === 'ALLOW' ? chalk.green(result.decision) : result.decision === 'DENY' ? chalk.red(result.decision) : chalk.yellow(result.decision));
            console.log(chalk.gray(`Reason: ${result.reason}`));

            let finalDecision = result.decision;

            // Layer 2: Optional Remote Semantic evaluation
            const apiKey = getApiKey();
            if (options.remote || (apiKey && !options.tool)) {
                if (!apiKey) {
                    console.warn(chalk.yellow('⚠ Skipping Layer 2: SUPRAWALL_API_KEY not found.'));
                } else {
                    console.log(chalk.white('Layer 2 (Semantic):'), chalk.gray('Requesting cloud analysis...'));
                    try {
                        const cloudRes = await axios.post(`${API_URL}/evaluate`, request, {
                            headers: { 'X-API-Key': apiKey }
                        });
                        const cloudDecision = cloudRes.data.decision;
                        console.log(chalk.white('Layer 2 (Semantic):'), cloudDecision === 'ALLOW' ? chalk.green(cloudDecision) : chalk.red(cloudDecision));
                        
                        // Priority logic: DENY wins, then REQUIRE_APPROVAL, then ALLOW
                        if (cloudDecision === 'DENY') finalDecision = 'DENY';
                        else if (cloudDecision === 'REQUIRE_APPROVAL' && finalDecision === 'ALLOW') finalDecision = 'REQUIRE_APPROVAL';
                    } catch (e: any) {
                        console.error(chalk.red('Layer 2 Error:'), e.response?.data?.error || e.message);
                    }
                }
            }

            console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
            
            if (finalDecision === "DENY") {
                console.log(chalk.red(`❌ VALIDATION FAILED.`));
                if (!options.dryRun) process.exit(1);
            } else if (finalDecision === "ALLOW") {
                console.log(chalk.green(`✅ VALIDATION PASSED.`));
            } else {
                console.log(chalk.yellow(`⚠ ATTENTION: Human approval required.`));
            }

        } catch (e: any) {
            console.error(chalk.red("Validation failed:"), e.message);
            process.exit(1);
        }
    });

// Dev Server Command
program
    .command('dev')
    .description('Starts a local, isolated development environment server')
    .option('-p, --port <port>', 'Port to run on', '4242')
    .action((options) => {
        // ... (dev server implementation can now use DeterministicEngine too)
        console.log(chalk.cyan("Starting suprawall Local Dev Server..."));
        
        const app = express();
        app.use(express.json());
        app.use(cors());

        app.post('/v1/evaluate', (req, res) => {
            const { toolName, arguments: args } = req.body;
            
            // In a real dev scenario, we might load a default local policy file if it exists
            const localPolicyPath = path.resolve(process.cwd(), 'suprawall.policy.json');
            let engine = new DeterministicEngine();
            
            if (fs.existsSync(localPolicyPath)) {
                try {
                    const policy = JSON.parse(fs.readFileSync(localPolicyPath, 'utf8'));
                    engine = new DeterministicEngine([policy]);
                } catch (e) {}
            }

            const result = engine.evaluate({ toolName, arguments: args || {} });
            res.json(result);
        });

        app.listen(options.port, () => {
            console.log(chalk.green(`✔ Local server listening on http://localhost:${options.port}`));
        });
    });

program.parse(process.argv);
