// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export interface Violation {
    article: string;
    severity: "critical" | "high" | "medium" | "low";
    title: string;
    description: string;
    lineNumber?: number;
    fix: string;
}

export interface AnalysisResult {
    violations: Violation[];
    score: number;
    framework: string;
}

export function analyzeAgentCode(code: string, framework: string): AnalysisResult {
    const violations: Violation[] = [];

    // --- Article 12: Audit Logging ---
    const hasLogging = /audit|log|track|record|monitor/i.test(code);
    const hasStructuredLogging = /auditLog|audit_log|logEvent|log_event|callback.*log/i.test(code);

    if (!hasLogging) {
        violations.push({
            article: "Article 12",
            severity: "critical",
            title: "No audit logging detected",
            description:
                "EU AI Act Article 12 requires that high-risk AI systems log all significant events during operation. Your agent has no visible logging mechanism.",
            fix: `// Add Supra-wall — automatic audit logging for every tool call\nimport { protect } from "suprawall";\nconst secured = protect(agent, { apiKey: "sw_..." });`,
        });
    } else if (!hasStructuredLogging) {
        violations.push({
            article: "Article 12",
            severity: "medium",
            title: "Unstructured logging only",
            description:
                "Basic logging detected but no structured audit trail. Article 12 requires tamper-evident, structured records with timestamps, agent identity, and decision rationale.",
            fix: `// Upgrade to structured audit logging\nimport { protect } from "suprawall";\nconst secured = protect(agent, { apiKey: "sw_..." });\n// Generates forensic-grade logs with integrity hashes`,
        });
    }

    // --- Article 14: Human Oversight ---
    const hasHumanApproval =
        /approval|human.*loop|confirm|require.*approval|REQUIRE_APPROVAL|human_in_the_loop/i.test(code);
    const hasDestructiveTools =
        /delete|drop|remove|send.*email|execute.*sql|transfer|payment|purchase|deploy|rm\s/i.test(
            code
        );

    if (hasDestructiveTools && !hasHumanApproval) {
        violations.push({
            article: "Article 14",
            severity: "critical",
            title: "Destructive actions without human oversight",
            description:
                "Your agent can execute destructive operations (delete, send, transfer, deploy) with no human approval gate. Article 14 requires human oversight for high-risk AI decisions.",
            fix: `// Add human approval gates for destructive tools\n{ toolPattern: "send_email|delete_*|transfer_*", action: "REQUIRE_APPROVAL" }`,
        });
    } else if (!hasHumanApproval) {
        violations.push({
            article: "Article 14",
            severity: "high",
            title: "No human oversight mechanism",
            description:
                "Article 14 of the EU AI Act requires that humans can intervene, override, and monitor high-risk AI system outputs. No approval or oversight mechanism found.",
            fix: `// Add human-in-the-loop oversight\nimport { protect } from "suprawall";\nconst secured = protect(agent, {\n  apiKey: "sw_...",\n  policies: [{ toolPattern: "*", action: "REQUIRE_APPROVAL" }]\n});`,
        });
    }

    // --- Article 9: Risk Management ---
    const hasRateLimit =
        /rate.*limit|max.*calls|budget|cost.*limit|maxIterations|max_iterations|loop.*detect/i.test(
            code
        );
    const hasErrorHandling = /try.*catch|error.*handl|fail.*safe|except/i.test(code);

    if (!hasRateLimit) {
        violations.push({
            article: "Article 9",
            severity: "high",
            title: "No rate limiting or cost controls",
            description:
                "Article 9 requires risk management measures. Your agent has no visible rate limiting, budget caps, or loop detection — a runaway agent could cause unlimited financial or operational damage.",
            fix: `// Add budget + loop protection\nconst secured = protect(agent, {\n  apiKey: "sw_...",\n  maxCostUsd: 10.00,\n  loopDetection: true,\n  maxIterations: 50\n});`,
        });
    }

    if (!hasErrorHandling) {
        violations.push({
            article: "Article 9",
            severity: "medium",
            title: "No error handling or fail-safe mechanisms",
            description:
                "Article 9 requires risk management including graceful failure. Your agent has no visible error handling, which means failures could cascade into undefined behavior.",
            fix: `// Wrap agent calls with error handling\ntry {\n  const result = await secured.run(task);\n} catch (e) {\n  // Supra-wall automatically logs and blocks on policy violations\n}`,
        });
    }

    // --- Prompt Injection Check ---
    const hasUserInput = /user.*input|message.*content|prompt.*inject|{.*input.*}|f".*{|f'.*{/i.test(code);
    const hasSanitization =
        /sanitize|escape|strip|clean|validate.*input|input.*validat/i.test(code);

    if (hasUserInput && !hasSanitization) {
        violations.push({
            article: "Article 9",
            severity: "high",
            title: "Potential prompt injection vulnerability",
            description:
                "User-controlled input is passed to the agent without visible sanitization. This creates a prompt injection attack surface — malicious users could override your agent's instructions.",
            fix: `// Supra-wall blocks prompt injection at runtime\nconst secured = protect(agent, {\n  apiKey: "sw_...",\n  blockPromptInjection: true\n});`,
        });
    }

    // --- Framework-specific checks ---
    if (framework === "langchain" || /langchain|LangChain/i.test(code)) {
        const hasCallbacks = /callbacks|CallbackHandler/i.test(code);
        if (!hasCallbacks) {
            violations.push({
                article: "Article 12",
                severity: "medium",
                title: "LangChain agent missing callback handlers",
                description:
                    "LangChain agents should use callback handlers for audit logging. No CallbackHandler detected.",
                fix: `// Use Supra-wall's LangChain integration\nimport { SupraWallCallbackHandler } from "@suprawall/langchain";\nconst handler = new SupraWallCallbackHandler({ apiKey: "sw_..." });\nconst chain = yourChain.withConfig({ callbacks: [handler] });`,
            });
        }
    }

    if (framework === "crewai" || /CrewAI|crewai|crew\.kickoff/i.test(code)) {
        const hasAgentMonitor = /verbose|step_callback|task_callback/i.test(code);
        if (!hasAgentMonitor) {
            violations.push({
                article: "Article 12",
                severity: "medium",
                title: "CrewAI agent missing step monitoring",
                description:
                    "CrewAI agents should monitor individual steps for compliance. No step_callback or verbose logging detected.",
                fix: `from suprawall.crewai import protect_crew\nsecured_crew = protect_crew(crew, api_key="sw_...")`,
            });
        }
    }

    // Compute score: start at 100, deduct per violation
    const deductions: Record<string, number> = {
        critical: 25,
        high: 15,
        medium: 8,
        low: 3,
    };
    const totalDeduction = violations.reduce(
        (sum, v) => sum + (deductions[v.severity] || 0),
        0
    );
    const score = Math.max(0, Math.min(100, 100 - totalDeduction));

    return { violations, score, framework };
}
