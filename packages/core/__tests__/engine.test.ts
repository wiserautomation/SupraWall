import { describe, it, expect } from 'vitest';
import { DeterministicEngine } from '../engine';
import { SupraWallPolicy } from '../types';

describe('DeterministicEngine', () => {
    const mockPolicy: SupraWallPolicy = {
        name: 'Test Policy',
        version: '1.0.0',
        rules: [
            {
                name: 'Block Bash',
                tool: 'bash',
                action: 'DENY',
                message: 'No bash allowed'
            },
            {
                name: 'Approve SSH',
                tool: 'ssh:*',
                action: 'REQUIRE_APPROVAL',
                message: 'Approval needed for SSH'
            },
            {
                name: 'Sensitive Data',
                tool: '*',
                action: 'DENY',
                condition: {
                    type: 'regex',
                    pattern: '\\d{3}-\\d{2}-\\d{4}'
                },
                message: 'PII detected'
            }
        ]
    };

    const engine = new DeterministicEngine([mockPolicy]);

    it('should correctly block a DENY tool', () => {
        const result = engine.evaluate({
            toolName: 'bash',
            arguments: { command: 'ls' }
        });
        expect(result.decision).toBe('DENY');
        expect(result.reason).toBe('No bash allowed');
    });

    it('should require approval for glob-matched tools', () => {
        const result = engine.evaluate({
            toolName: 'ssh:connect',
            arguments: { host: 'example.com' }
        });
        expect(result.decision).toBe('REQUIRE_APPROVAL');
        expect(result.reason).toBe('Approval needed for SSH');
    });

    it('should block based on regex conditions', () => {
        const result = engine.evaluate({
            toolName: 'any_tool',
            arguments: { text: 'My SSN is 000-00-0000' }
        });
        expect(result.decision).toBe('DENY');
        expect(result.reason).toBe('PII detected');
    });

    it('should allow tools that do not match any rule', () => {
        const result = engine.evaluate({
            toolName: 'safe_tool',
            arguments: { data: 'safe stuff' }
        });
        expect(result.decision).toBe('ALLOW');
    });

    it('should prioritize DENY over REQUIRE_APPROVAL', () => {
        const complexPolicy: SupraWallPolicy = {
            name: 'Complex Policy',
            version: '1.0.0',
            rules: [
                {
                    tool: 'multi_match',
                    action: 'REQUIRE_APPROVAL'
                },
                {
                    tool: 'multi_match',
                    action: 'DENY'
                }
            ]
        };
        const complexEngine = new DeterministicEngine([complexPolicy]);
        const result = complexEngine.evaluate({
            toolName: 'multi_match',
            arguments: {}
        });
        expect(result.decision).toBe('DENY');
    });
});
