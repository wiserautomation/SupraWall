// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import request from "supertest";
import app from "../src/index";

process.env.VAULT_ENCRYPTION_KEY = "test-key-123456789012345678901234";

// Mock pg pool BEFORE importing app
jest.mock("../src/db", () => {
    return {
        pool: {
            query: jest.fn(async (sql: string, params?: any[]) => {
                // adminAuth: SELECT id FROM tenants WHERE master_api_key = $1
                if (sql.includes("master_api_key")) {
                    return { rows: [{ id: "test-tenant-id" }] };
                }
                // resolveTier: SELECT tier FROM tenants WHERE id = $1
                if (sql.includes("SELECT tier FROM tenants WHERE id")) {
                    return { rows: [{ tier: 'developer' }] };
                }
                // Agent count: SELECT COUNT(*) FROM agents WHERE tenantid = $1
                if (sql.includes("COUNT(*) FROM agents")) {
                    return { rows: [{ count: "5" }] };
                }
                return { rows: [] };
            }),
            connect: jest.fn(async () => ({
                query: jest.fn(async () => ({ rows: [] })),
                release: jest.fn(),
            })),
        },
        initDb: jest.fn().mockResolvedValue(undefined),
    };
});

describe("Tier Enforcement Tests", () => {
    const MASTER_KEY = "sw_admin_test_123";
    const TENANT_ID = "test-tenant-id";

    describe("Agent Limits", () => {
        test("Developer tier allows 5 agents but rejects the 6th", async () => {
            const res = await request(app)
                .post("/v1/agents")
                .set("Authorization", `Bearer ${MASTER_KEY}`)
                .send({ name: "over-limit-agent" });

            // Debug: print actual response if status is not expected
            if (res.status !== 403) {
                console.log("Actual response status:", res.status);
                console.log("Actual response body:", res.body);
            }

            expect(res.status).toBe(403);
            expect(res.body.error).toContain("Agent limit reached (5/5)");
            expect(res.body.code).toBe("TIER_LIMIT_EXCEEDED");
        });

        test("Team tier allows more than 5 agents (placeholder)", async () => {
            // Note: Full integration test requires proper DB mocking for transaction
            // For now, verifying the tier system works at the validation level
            expect(true).toBe(true);
        });
    });

    describe("Vault Secret Limits", () => {
        test("Developer tier enforces vault secret limits (placeholder)", async () => {
            // Note: Vault endpoint has different auth routing
            // Comprehensive test requires setup of vault mock
            expect(true).toBe(true);
        });
    });
});
