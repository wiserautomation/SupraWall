// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import * as core from '@actions/core';
import * as github from '@actions/github';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

async function run() {
  try {
    const apiKey = core.getInput('api-key', { required: true });
    const policyFile = core.getInput('policy-file');
    const failOn = core.getInput('fail-on');
    const agentPath = core.getInput('agent-path');

    core.info(`🚀 Starting SupraWall Security Scan in ${agentPath}...`);

    // 1. Detect and Collect Files
    const filesToScan: { path: string; content: string }[] = [];
    const absoluteAgentPath = path.resolve(process.cwd(), agentPath);

    function walk(dir: string) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.relative(process.cwd(), fullPath);

        if (entry.isDirectory()) {
          if (['node_modules', '.git', 'dist', 'build', 'venv', '__pycache__'].includes(entry.name)) continue;
          walk(fullPath);
        } else if (entry.isFile()) {
            const ext = path.extname(entry.name).toLowerCase();
            if (['.ts', '.js', '.py', '.tsx', '.jsx'].includes(ext)) {
                const content = fs.readFileSync(fullPath, 'utf8');
                filesToScan.push({ path: relPath, content });
            }
        }
      }
    }

    if (fs.existsSync(absoluteAgentPath)) {
        walk(absoluteAgentPath);
    } else {
        core.setFailed(`Agent path ${agentPath} does not exist.`);
        return;
    }

    core.info(`🔍 Found ${filesToScan.length} files to scan.`);

    // 2. Load Policy if exists
    let policyContent = null;
    const absolutePolicyPath = path.resolve(process.cwd(), policyFile);
    if (fs.existsSync(absolutePolicyPath)) {
        policyContent = JSON.parse(fs.readFileSync(absolutePolicyPath, 'utf8'));
        core.info(`📝 Using policy from ${policyFile}`);
    }

    // 3. POST to SupraWall API
    core.info('📡 Sending data to SupraWall API (api.supra-wall.com)...');
    
    try {
        const response = await axios.post('https://api.supra-wall.com/v1/scan', {
            files: filesToScan,
            policy: policyContent
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const { status, violations, reportUrl } = response.data;

        // 4. Handle Violations
        if (violations && violations.length > 0) {
            core.warning(`⚠️ Found ${violations.length} security violations.`);
            
            for (const v of violations) {
                const annotation = {
                    title: `SupraWall Violation: ${v.severity.toUpperCase()}`,
                    file: v.file,
                    startLine: v.line || 1
                };

                const msg = `[${v.severity.toUpperCase()}] ${v.message}`;
                
                if (v.severity === 'critical' || v.severity === 'high') {
                    core.error(msg, annotation);
                } else {
                    core.warning(msg, annotation);
                }
            }

            core.setOutput('violations', violations.length);
            core.setOutput('report-url', reportUrl);

            // 5. Enforce fail-on
            const severityScale = { 'low': 0, 'medium': 1, 'high': 2, 'critical': 3 };
            const threshold = severityScale[failOn as keyof typeof severityScale] ?? 2; // Default to 'high'

            const highSeverityViolations = violations.filter((v: any) => {
                const sev = severityScale[v.severity as keyof typeof severityScale] ?? 0;
                return sev >= threshold;
            });

            if (highSeverityViolations.length > 0) {
                core.setFailed(`❌ Scan failed with ${highSeverityViolations.length} violations at or above depth '${failOn}'.`);
            } else {
                core.info('✅ Scan passed (violations within threshold).');
            }
        } else {
            core.info('✅ No security violations found. Your agents are secure!');
            core.setOutput('violations', 0);
            core.setOutput('report-url', reportUrl);
        }

    } catch (apiErr: any) {
        if (apiErr.response) {
            core.error(`API Error: ${apiErr.response.status} - ${JSON.stringify(apiErr.response.data)}`);
            core.setFailed(`SupraWall API rejected the scan request.`);
        } else {
            core.error(`Network Error: ${apiErr.message}`);
            core.setFailed(`Could not connect to SupraWall API.`);
        }
    }

  } catch (error: any) {
    core.setFailed(error.message);
  }
}

run();
