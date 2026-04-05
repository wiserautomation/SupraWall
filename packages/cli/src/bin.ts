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

dotenv.config();

const program = new Command();
const API_URL = process.env.SUPRAWALL_API_URL || 'https://www.supra-wall.com/api/v1';

function getApiKey() {
    const key = process.env.SUPRAWALL_API_KEY;
    if (!key) {
        console.error(chalk.red("Error: SUPRAWALL_API_KEY environment variable is required."));
        process.exit(1);
    }
    return key;
}

program
    .name('suprawall')
    .description('suprawall CLI - The powerful way to manage AI Agent Security')
    .version('1.0.0');

// Login Command
program
    .command('login')
    .description('Authenticate the CLI')
    .action(() => {
        console.log(chalk.blue('To authenticate, set the SUPRAWALL_API_KEY environment variable.'));
        console.log(chalk.gray('Example: export SUPRAWALL_API_KEY="sw_xxxx"'));
    });

// Agents Subcommands
const agents = program.command('agents').description('Manage AI agents');

agents
    .command('create')
    .description('Create a new agent')
    .requiredOption('--name <name>', 'Name of the agent')
    .action(async (options) => {
        try {
            const api = getApiKey();
            const res = await axios.post(`${API_URL}/agents`, { name: options.name }, {
                headers: { Authorization: `Bearer ${api}` }
            });
            console.log(chalk.green('✔ Agent created successfully!'));
            console.log(colorize(JSON.stringify(res.data, null, 2)));
        } catch (e: any) {
            console.error(chalk.red('Failed to create agent:'), e.response?.data || e.message);
        }
    });

// Policies Subcommands
const policies = program.command('policies').description('Manage security policies');

policies
    .command('create')
    .description('Create a new policy')
    .requiredOption('--agent <id>', 'Agent ID')
    .requiredOption('--tool <name>', 'Tool pattern (exact or regex)')
    .requiredOption('--action <action>', 'ALLOW | DENY | REQUIRE_APPROVAL')
    .action(async (options) => {
        try {
            const api = getApiKey();
            const res = await axios.post(`${API_URL}/agents/${options.agent}/policies`, {
                toolName: options.tool,
                decision: options.action
            }, {
                headers: { Authorization: `Bearer ${api}` }
            });
            console.log(chalk.green('✔ Policy published successfully!'));
            console.log(colorize(JSON.stringify(res.data, null, 2)));
        } catch (e: any) {
             console.error(chalk.red('Failed to create policy:'), e.response?.data || e.message);
        }
    });

// Logs Stream Command
program
    .command('logs')
    .description('Stream real-time audit logs')
    .requiredOption('--agent <id>', 'Agent ID')
    .option('-f, --follow', 'Follow the log stream (tail)')
    .action(async (options) => {
        const api = getApiKey();
        console.log(chalk.blue(`Tracking logs for agent: ${options.agent}...`));
        
        async function fetchLogs() {
            try {
                const res = await axios.get(`${API_URL}/agents/${options.agent}/logs?limit=10`, {
                    headers: { Authorization: `Bearer ${api}` }
                });
                
                if (res.data && Array.isArray(res.data.logs)) {
                    res.data.logs.forEach((log: any) => {
                         const color = log.decision === 'ALLOW' ? chalk.green : log.decision === 'DENY' ? chalk.red : chalk.yellow;
                         console.log(chalk.gray(new Date(log.timestamp).toISOString()), color(`[${log.decision}]`), chalk.white(log.toolName));
                    });
                }
            } catch (e: any) {
                console.error(chalk.red('[Logs Error]'), e.response?.data?.error || e.message);
            }
        }

        await fetchLogs();
        if (options.follow) {
            setInterval(fetchLogs, 2000);
        }
    });

// Local Policy Test Command
program
    .command('test')
    .description('Test a policy file locally without hitting the cloud API')
    .argument('<file>', 'Policy definitions JSON file (ex. policy.json)')
    .requiredOption('--tool <name>', 'Tool name attempting to execute')
    .option('--args <json>', 'Tool arguments context')
    .action((file, options) => {
        try {
            const filePath = path.resolve(process.cwd(), file);
            if (!fs.existsSync(filePath)) {
                console.error(chalk.red(`Error: File ${file} not found.`));
                process.exit(1);
            }
            const policies = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            console.log(chalk.blue(`Evaluating local policies against tool '${options.tool}'...`));
            
            let decision = "ALLOW";
            let matchedPolicy = null;

            // Normalize policy array if it's a single object
            const policyList = Array.isArray(policies) ? policies : (policies.policies || [policies]);

            for (const p of policyList) {
                // Case-insensitive key lookup
                const getVal = (keys: string[]) => {
                    const foundKey = Object.keys(p).find(k => keys.includes(k.toLowerCase()));
                    return foundKey ? p[foundKey] : undefined;
                };

                const toolPattern = getVal(['toolname', 'toolpattern', 'condition']);
                if (!toolPattern) continue;

                try {
                    const regexSource = toolPattern.includes('*') 
                        ? '^' + toolPattern.replace(/\*/g, '.*') + '$'
                        : toolPattern;
                    
                    const re = new RegExp(regexSource, 'i'); // Default to case-insensitive tool matching
                    if (re.test(options.tool)) {
                        const rawDecision = getVal(['ruletype', 'decision', 'action']) || "ALLOW";
                        const policyDecision = String(rawDecision).toUpperCase();
                        if (policyDecision === "DENY") {
                            decision = "DENY";
                            matchedPolicy = p;
                            break;
                        } else if (policyDecision === "REQUIRE_APPROVAL") {
                            decision = "REQUIRE_APPROVAL";
                            matchedPolicy = p;
                            break;
                        } else if (policyDecision === "ALLOW") {
                            decision = "ALLOW";
                            matchedPolicy = p;
                        }
                    }
                } catch (e) {
                    console.warn(chalk.yellow(`Warning: Skipping invalid tool pattern: ${toolPattern}`));
                }
            }
            
            if (decision === "DENY") {
                console.log(chalk.red(`❌ DENIED by local policy.`));
                if (matchedPolicy) console.log(chalk.gray(`Reason: ${matchedPolicy.description || "Blocking rule matched"}`));
            } else if (decision === "ALLOW") {
                console.log(chalk.green(`✔ ALLOWED by local policy.`));
            } else {
                console.log(chalk.yellow(`⚠ REQUIRES APPROVAL by local policy.`));
                if (matchedPolicy) console.log(chalk.gray(`Reason: ${matchedPolicy.description || "Human-in-the-loop required"}`));
            }

        } catch (e: any) {
            console.error(chalk.red("Execution failed:"), e.message);
        }
    });

// Dev Server Command
program
    .command('dev')
    .description('Starts a local, isolated development environment server')
    .option('-p, --port <port>', 'Port to run on', '4242')
    .action((options) => {
        console.log(chalk.cyan("Starting suprawall Local Dev Server..."));
        
        const app = express();
        app.use(express.json());
        app.use(cors());

        // In-memory SQLite for testing without dropping tables
        const db = new Database(':memory:');
        
        db.serialize(() => {
            db.run("CREATE TABLE policies (id TEXT, toolName TEXT, decision TEXT)");
            db.run("CREATE TABLE logs (id TEXT, decision TEXT, toolName TEXT, timestamp INTEGER, agentid TEXT)");
        });

        // Mock test suite evaluate endpoint
        app.post('/v1/evaluate', (req, res) => {
            const { toolName } = req.body;
            
            // Allow bypassing for sw_test keys automatically
            if (req.headers.authorization?.includes('sw_test_')) {
                db.run("INSERT INTO logs VALUES (?, ?, ?, ?, ?)", [Date.now().toString(), "ALLOW", toolName, Date.now(), "dev-agent"]);
                return res.json({ decision: "ALLOW", reason: "Test Mode By-Pass" });
            }

            db.get("SELECT decision FROM policies WHERE toolName = ?", [toolName], (err, row: any) => {
                if (row) {
                    db.run("INSERT INTO logs VALUES (?, ?, ?, ?, ?)", [Date.now().toString(), row.decision, toolName, Date.now(), "dev-agent"]);
                    res.json({ decision: row.decision, reason: `Action ${row.decision} by Local Dev Policy` });
                } else {
                    res.json({ decision: "ALLOW", reason: "Default Allow" });
                }
            });
        });

        app.get('/v1/agents/:id/logs', (req, res) => {
            const { id } = req.params;
            db.all("SELECT decision, toolName, timestamp FROM logs WHERE agentid = ? OR agentid = 'dev-agent' ORDER BY timestamp DESC LIMIT 10", [id], (err, rows) => {
                res.json({ logs: rows || [] });
            });
        });

        app.listen(options.port, () => {
            console.log(chalk.green(`✔ Local server listening on http://localhost:${options.port}`));
            console.log(chalk.gray(`Point SUPRAWALL_API_URL=http://localhost:${options.port}/v1 in your code to test offline.`));
            console.log(chalk.magenta(`Note: Keys starting with sw_test_* automatically bypass evaluation logic.`));
        });
    });

program.parse(process.argv);
