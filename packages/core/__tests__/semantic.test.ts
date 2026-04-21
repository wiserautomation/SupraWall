// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { describe, it, expect, vi } from 'vitest';
import { analyzeCall, SemanticAnalysisRequest } from './semantic';

describe('SemanticEngine', () => {
    const mockPool = {
        query: vi.fn().mockResolvedValue({ rows: [] })
    };
    
    const mockLogger = {
        warn: vi.fn(),
        error: vi.fn()
    };
    
    const mockEnv = {
        SUPRAWALL_DENY_THRESHOLD: '0.8',
        SUPRAWALL_APPROVAL_THRESHOLD: '0.5',
        SUPRAWALL_SEMANTIC_LLM_KEY: 'test-key'
    };

    it('should correctly classify a high-risk tool call', async () => {
        // Mock fetch for LLM call
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                choices: [{ message: { content: JSON.stringify({ score: 0.9, reasoning: "Suspicious pattern" }) } }]
            })
        });

        const req: SemanticAnalysisRequest = {
            tenantId: 't1',
            agentId: 'a1',
            toolName: 'read_file',
            args: { path: '/etc/passwd' },
            argsString: JSON.stringify({ path: '/etc/passwd' }),
            semanticLayer: 'static'
        };

        const result = await analyzeCall(mockPool as any, mockEnv as any, mockLogger as any, req);
        
        expect(result.decision).toBe('DENY');
        expect(result.semanticScore).toBe(0.9);
        expect(result.confidence).toBe('high');
    });

    it('should fall back to safe on LLM timeout', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("Timeout"));

        const req: SemanticAnalysisRequest = {
            tenantId: 't1',
            agentId: 'a1',
            toolName: 'generic',
            args: {},
            argsString: '{}',
            semanticLayer: 'static'
        };

        const result = await analyzeCall(mockPool as any, mockEnv as any, mockLogger as any, req);
        
        expect(result.decision).toBe(null);
        expect(result.semanticScore).toBe(0);
    });

    it('should incorporate behavioral anomaly score when layer is behavioral', async () => {
        // Mock LLM score = 0.5, Anomaly score = 1.0
        // Combined = 0.5 * 0.7 + 1.0 * 0.3 = 0.35 + 0.3 = 0.65
        
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                choices: [{ message: { content: JSON.stringify({ score: 0.5, reasoning: "Medium risk" }) } }]
            })
        });

        // Mock DB for anomaly check (total_samples >= 10 and large deviation)
        mockPool.query.mockResolvedValueOnce({
            rows: [{ avg_args_length: 5, total_samples: 20, common_arg_patterns: [] }]
        });

        const req: SemanticAnalysisRequest = {
            tenantId: 't1',
            agentId: 'a1',
            toolName: 'write_file',
            args: { content: 'a'.repeat(100) },
            argsString: JSON.stringify({ content: 'a'.repeat(100) }),
            semanticLayer: 'behavioral'
        };

        const result = await analyzeCall(mockPool as any, mockEnv as any, mockLogger as any, req);
        
        expect(result.anomalyScore).toBeGreaterThan(0);
        expect(result.decision).toBe('REQUIRE_APPROVAL'); // 0.65 >= 0.5
    });
});
