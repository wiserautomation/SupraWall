// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import request from "supertest";
import app from "../src/index";
import { pool } from "../src/db";

// Mock pg pool
jest.mock("../src/db", () => ({
    pool: {
        query: jest.fn(),
        connect: jest.fn(),
    },
    initDb: jest.fn().mockResolvedValue(undefined),
}));

process.env.VAULT_ENCRYPTION_KEY = "test-key-123456789012345678901234";

describe("Tier Enforcement Tests", () => {
    const MASTER_KEY = "sw_admin_test_123";
    const TENANT_ID = "test-tenant-id";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Agent Limits", () => {
        test("Developer tier allows 3 agents but rejects the 4th", async () => {
            // 1. Mock Auth
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: TENANT_ID }] });
            
            // 2. Mock resolveTier (returns 'free')
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ tier: 'free' }] });

            // 3. Mock Agent Count check (returns 3)
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ count: "3" }] });

            const res = await request(app)
                .post("/v1/agents")
                .set("Authorization", `Bearer ${MASTER_KEY}`)
                .send({ name: "over-limit-agent" });

            expect(res.status).toBe(403);
            expect(res.body.error).toContain("Agent limit reached (3/3)");
            expect(res.body.code).toBe("TIER_LIMIT_EXCEEDED");
        });

        test("Starter tier allows more than 3 agents", async () => {
            // 1. Mock Auth
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: TENANT_ID }] });
            
            // 2. Mock resolveTier (returns 'starter')
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ tier: 'starter' }] });

            // 3. Mock Agent creation success
            const mockClient = {
                query: jest.fn()
                    .mockResolvedValueOnce({ rows: [] }) // BEGIN
                    .mockResolvedValueOnce({ rows: [{ id: "new-id", name: "ok-agent" }] }) // INSERT agents
                    .mockResolvedValueOnce({ rows: [] }), // COMMIT
                release: jest.fn(),
            };
            (pool.connect as jest.Mock).mockResolvedValue(mockClient);

            const res = await request(app)
                .post("/v1/agents")
                .set("Authorization", `Bearer ${MASTER_KEY}`)
                .send({ name: "ok-agent" });

            expect(res.status).toBe(201);
            expect(res.body.name).toBe("ok-agent");
        });
    });

    describe("Vault Secret Limits", () => {
        test("Developer tier allows 5 secrets but rejects the 6th", async () => {
             // 1. Mock resolveTier (returns 'free')
             (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ tier: 'free' }] });
 
             // 2. Mock Secret Count check (returns 5)
             (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ count: "5" }] });
 
             const res = await request(app)
                 .post("/v1/vault/secrets")
                 .set("Authorization", `Bearer ${MASTER_KEY}`)
                 .send({ tenantId: TENANT_ID, secretName: "OVER_LIMIT", secretValue: "secret" });
 
             expect(res.status).toBe(403);
             expect(res.body.error).toContain("Vault secrets limit reached (5/5)");
        });
    });
});
