// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

// ---------------------------------------------------------------------------
// Layer 2: AI Semantic Analysis Engine
// ---------------------------------------------------------------------------
// Single entry point: analyzeCall(). Encapsulates LLM-based contextual
// threat detection with configurable thresholds and graceful degradation.
// ---------------------------------------------------------------------------

import { pool } from "./db";
import { logger } from "./logger";
import { computeAnomalyScore } from "./behavioral";
import type { SemanticLayerMode } from "./tier-config";

// ── Types ──

export interface SemanticAnalysisRequest {
    tenantId: string;
    agentId: string;
    toolName: string;
    args: unknown;
    argsString: string;
    delegationChain?: string[];
    semanticLayer: SemanticLayerMode;
    customEndpoint?: string;
}

export interface SemanticAnalysisResult {
    semanticScore: number;        // 0.0 (safe) – 1.0 (threat)
    anomalyScore: number | null;  // null when behavioral is disabled
    confidence: 'high' | 'medium' | 'low';
    decision: 'DENY' | 'REQUIRE_APPROVAL' | 'FLAG' | null;
    reasoning: string;
    latencyMs: number;
    modelUsed: string;
}

// ── Configurable Thresholds (env-overridable) ──

function loadThresholds() {
    return {
        denyAbove: parseFloat(process.env.SUPRAWALL_DENY_THRESHOLD || '0.85'),
        approvalAbove: parseFloat(process.env.SUPRAWALL_APPROVAL_THRESHOLD || '0.60'),
        flagAbove: parseFloat(process.env.SUPRAWALL_FLAG_THRESHOLD || '0.35'),
    };
}

// ── Main Entry Point ──

export async function analyzeCall(
    req: SemanticAnalysisRequest
): Promise<SemanticAnalysisResult> {
    const start = Date.now();
    const thresholds = loadThresholds();

    // 1. Build the analysis prompt
    const prompt = buildAnalysisPrompt(req);

    // 2. Call LLM (standard or custom endpoint)
    let llmResult: { score: number; reasoning: string; model: string };

    if (req.customEndpoint) {
        llmResult = await callCustomEndpoint(req.tenantId, req.customEndpoint, prompt);
    } else {
        llmResult = await callStandardLLM(prompt);
    }

    // 3. Behavioral anomaly scoring (business+ only)
    let anomalyScore: number | null = null;
    if (req.semanticLayer === 'behavioral' || req.semanticLayer === 'custom') {
        anomalyScore = await computeAnomalyScore(req);
    }

    // 4. Combine scores — semantic 70%, anomaly 30%
    const combinedScore = anomalyScore !== null
        ? clampScore(llmResult.score * 0.7 + anomalyScore * 0.3)
        : clampScore(llmResult.score);

    // 5. Determine decision based on thresholds
    let decision: SemanticAnalysisResult['decision'] = null;
    let confidence: SemanticAnalysisResult['confidence'] = 'low';

    if (combinedScore >= thresholds.denyAbove) {
        decision = 'DENY';
        confidence = 'high';
    } else if (combinedScore >= thresholds.approvalAbove) {
        decision = 'REQUIRE_APPROVAL';
        confidence = 'medium';
    } else if (combinedScore >= thresholds.flagAbove) {
        decision = 'FLAG';
        confidence = 'low';
    }

    const latencyMs = Date.now() - start;

    // 6. Log to Postgres (non-blocking, never fails the request)
    logSemanticAnalysis(req, combinedScore, anomalyScore, confidence, decision, llmResult, latencyMs);

    return {
        semanticScore: combinedScore,
        anomalyScore,
        confidence,
        decision,
        reasoning: llmResult.reasoning,
        latencyMs,
        modelUsed: llmResult.model,
    };
}

// ── Prompt Construction ──

function buildAnalysisPrompt(req: SemanticAnalysisRequest): string {
    const truncatedArgs = req.argsString.length > 2000
        ? req.argsString.slice(0, 2000) + '...[truncated]'
        : req.argsString;

    return `You are a security analyst evaluating an AI agent tool call for potential threats.
Assess the threat level on a scale of 0.0 (completely safe) to 1.0 (definitely malicious).

Consider:
- Is the combination of tool + arguments suspicious?
- Could this be part of a multi-step attack (exfiltration, privilege escalation)?
- Are the arguments unusually formatted, encoded, or obfuscated?
- Does the delegation chain suggest unauthorized escalation?

Tool: ${req.toolName}
Arguments: ${truncatedArgs}
Delegation Chain: ${JSON.stringify(req.delegationChain || [])}

Respond ONLY with JSON: { "score": <float 0-1>, "reasoning": "<one sentence>" }`;
}

// ── Standard LLM Call (gpt-4o-mini via OpenAI) ──

async function callStandardLLM(
    prompt: string
): Promise<{ score: number; reasoning: string; model: string }> {
    const apiKey = process.env.SUPRAWALL_SEMANTIC_LLM_KEY;
    const model = process.env.SUPRAWALL_SEMANTIC_MODEL || 'gpt-4o-mini';
    const timeoutMs = parseInt(process.env.SUPRAWALL_SEMANTIC_TIMEOUT_MS || '300', 10);

    if (!apiKey) {
        return { score: 0, reasoning: 'Layer 2 not configured (no LLM key)', model: 'none' };
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0,
                max_tokens: 100,
                response_format: { type: 'json_object' },
            }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
            logger.warn('[Semantic] LLM returned non-OK', { status: res.status });
            return { score: 0, reasoning: 'LLM error — defaulting safe', model };
        }

        const data = await res.json() as {
            choices: Array<{ message: { content: string } }>;
        };
        const content = JSON.parse(data.choices[0].message.content) as {
            score?: number;
            reasoning?: string;
        };

        return {
            score: clampScore(content.score ?? 0),
            reasoning: content.reasoning || '',
            model,
        };
    } catch (err) {
        clearTimeout(timeout);
        logger.warn('[Semantic] LLM call failed/timed out', { error: err });
        return { score: 0, reasoning: 'Layer 2 timeout — defaulting safe', model };
    }
}

// ── Custom Endpoint (Enterprise) ──

async function callCustomEndpoint(
    tenantId: string,
    endpoint: string,
    prompt: string
): Promise<{ score: number; reasoning: string; model: string }> {
    // Fetch auth header and max latency from custom_model_endpoints
    let authHeader: string | null = null;
    let maxLatencyMs = 500;
    let modelName = 'custom';

    try {
        const epResult = await pool.query(
            'SELECT auth_header, max_latency_ms, model_name FROM custom_model_endpoints WHERE tenant_id = $1 AND enabled = true',
            [tenantId]
        );
        if (epResult.rows.length > 0) {
            authHeader = epResult.rows[0].auth_header;
            maxLatencyMs = epResult.rows[0].max_latency_ms || 500;
            modelName = epResult.rows[0].model_name || 'custom';
        }
    } catch {
        // Fall through to standard call pattern
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), maxLatencyMs);

    try {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        };
        if (authHeader) {
            headers['Authorization'] = authHeader;
        }

        const res = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                prompt,
                model: modelName,
            }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!res.ok) {
            logger.warn('[Semantic] Custom endpoint returned non-OK', { status: res.status, endpoint });
            return { score: 0, reasoning: 'Custom endpoint error — defaulting safe', model: modelName };
        }

        const data = await res.json() as { score?: number; reasoning?: string };
        return {
            score: clampScore(data.score ?? 0),
            reasoning: data.reasoning || '',
            model: modelName,
        };
    } catch (err) {
        clearTimeout(timeout);
        logger.warn('[Semantic] Custom endpoint failed/timed out', { error: err, endpoint });
        return { score: 0, reasoning: 'Custom endpoint timeout — defaulting safe', model: modelName };
    }
}

// ── Helpers ──

function clampScore(score: number): number {
    return Math.min(1, Math.max(0, score));
}

function logSemanticAnalysis(
    req: SemanticAnalysisRequest,
    combinedScore: number,
    anomalyScore: number | null,
    confidence: string,
    decision: string | null,
    llmResult: { reasoning: string; model: string },
    latencyMs: number
): void {
    pool.query(
        `INSERT INTO semantic_analysis_log
         (tenant_id, agent_id, tool_name, semantic_score, anomaly_score,
          confidence, decision_override, reasoning, model_used, latency_ms, parameters)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
            req.tenantId, req.agentId, req.toolName,
            combinedScore, anomalyScore,
            confidence, decision, llmResult.reasoning,
            llmResult.model, latencyMs,
            JSON.stringify(req.args),
        ]
    ).catch((err: unknown) => logger.error('[Semantic] Failed to log analysis', { error: err }));
}
