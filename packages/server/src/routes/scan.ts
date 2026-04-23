// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Router, Request, Response } from "express";
import { logger } from "../logger";
import { gatekeeperAuth, AuthenticatedRequest } from "../auth";
import { rateLimit } from "../rate-limit";

const router = Router();
const scanRateLimit = rateLimit({ max: 30, windowMs: 60_000, message: "Scan rate limit exceeded." });

interface ScanFile {
    path: string;
    content: string;
}

interface ScanViolation {
    severity: "critical" | "high" | "medium" | "low";
    message: string;
    file: string;
    line?: number;
}

const SECRET_PATTERNS = [
    { name: "SupraWall Agent Key", regex: /sw_agent_[a-zA-Z0-9]{32,}/g, severity: "critical" as const },
    { name: "OpenAI API Key", regex: /sk-[a-zA-Z0-9]{32,}/g, severity: "critical" as const },
    { name: "GitHub Token", regex: /ghp_[a-zA-Z0-9]{36}/g, severity: "critical" as const },
];

const FRAMEWORK_PATTERNS = [
    { name: "LangChain", regex: /from\s+['"]langchain|@langchain\/core/i },
    { name: "CrewAI", regex: /from\s+crewai|import\s+crewai/i },
    { name: "AutoGen", regex: /from\s+autogen|import\s+autogen/i },
];

router.post("/", scanRateLimit, gatekeeperAuth, async (req: Request, res: Response) => {
    try {
        const { files } = req.body as { files: ScanFile[] };
        const violations: ScanViolation[] = [];

        if (!files || !Array.isArray(files)) {
            return res.status(400).json({ error: "Missing or invalid files array" });
        }

        for (const file of files) {
            const lines = file.content.split("\n");

            // 1. Check for Hardcoded Secrets
            for (const pattern of SECRET_PATTERNS) {
                const matches = file.content.matchAll(pattern.regex);
                for (const _ of matches) {
                    violations.push({
                        severity: pattern.severity,
                        message: `Potential hardcoded ${pattern.name} found. Move to environment variables or SupraWall Vault.`,
                        file: file.path
                    });
                }
            }

            // 2. Check for missing SupraWall Protection
            let hasFramework = false;
            let hasProtection = /from\s+['"]suprawall['"]|import\s+.*suprawall/i.test(file.content) || /protect\(/.test(file.content);

            for (const fw of FRAMEWORK_PATTERNS) {
                if (fw.regex.test(file.content)) {
                    hasFramework = true;
                    break;
                }
            }

            if (hasFramework && !hasProtection) {
                violations.push({
                    severity: "high",
                    message: "AI Agent detected but not protected by SupraWall. Wrap your agent with protect() to enable runtime security.",
                    file: file.path
                });
            }

            // 3. Dangerous Node.js/Python functions in Agent code
            const dangerousPatterns = [
                { regex: /eval\(|exec\(|spawn\(/, message: "Use of potentially dangerous execution functions (eval/exec/spawn) in agent logic.", severity: "medium" as const },
                { regex: /os\.system\(|subprocess\.run\(/, message: "Use of potentially dangerous system commands in Python agent logic.", severity: "medium" as const }
            ];

            for (const dp of dangerousPatterns) {
                if (dp.regex.test(file.content)) {
                    violations.push({
                        severity: dp.severity,
                        message: dp.message,
                        file: file.path
                    });
                }
            }
        }

        // Return the report
        res.json({
            status: violations.length > 0 ? "violations_found" : "clean",
            violations,
            reportUrl: "https://www.supra-wall.com/dashboard/scans" // Mock URL for now
        });

    } catch (e) {
        logger.error("Scan error:", { error: e });
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
