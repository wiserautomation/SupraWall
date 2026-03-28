// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import request from "supertest";
import app from "../src/index";
import { pool } from "../src/db";
import { getFirestore } from "../src/firebase";

// Mock pg pool
jest.mock("../src/db", () => ({
    pool: {
        query: jest.fn(),
        connect: jest.fn(),
    },
    initDb: jest.fn().mockResolvedValue(undefined),
}));

// Mock firebase
jest.mock("../src/firebase", () => ({
    getFirestore: jest.fn(() => ({
        collection: jest.fn().mockReturnThis(),
        doc: jest.fn().mockReturnThis(),
        set: jest.fn().mockResolvedValue(undefined),
        get: jest.fn().mockResolvedValue({ exists: true, data: () => ({}) }),
        delete: jest.fn().mockResolvedValue(undefined),
        where: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
    })),
    logToFirestore: jest.fn().mockResolvedValue(undefined),
}));

describe("Programmatic Agent API (Mocked)", () => {
    const MASTER_KEY = "sw_admin_test_123";
    const TENANT_ID = "test-tenant-id";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("Authentication", () => {
        test("rejects request without Authorization header", async () => {
            const res = await request(app).get("/v1/agents");
            expect(res.status).toBe(401);
            expect(res.body.error).toContain("Missing or invalid Authorization header");
        });

        test("rejects request with invalid Master API Key", async () => {
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
            const res = await request(app)
                .get("/v1/agents")
                .set("Authorization", "Bearer invalid-key");
            
            expect(res.status).toBe(401);
            expect(res.body.error).toContain("Invalid Master API Key");
        });
    });

    describe("Agent Creation (POST /v1/agents)", () => {
        test("successfully creates an agent with guardrails", async () => {
            // Mock auth lookup
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: TENANT_ID }] });

            // Mock resolveTier middleware (returns 'developer' tier)
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ tier: 'developer' }] });

            // Mock DB client for transaction
            const mockClient = {
                query: jest.fn().mockResolvedValue({
                    rows: [{ id: "new-agent-id", name: "test-agent", createdat: new Date() }]
                }),
                release: jest.fn(),
            };
            (pool.connect as jest.Mock).mockResolvedValue(mockClient);

            const res = await request(app)
                .post("/v1/agents")
                .set("Authorization", `Bearer ${MASTER_KEY}`)
                .send({
                    name: "test-agent",
                    scopes: ["read:*"],
                    guardrails: {
                        budget: { limitUsd: 50 },
                        blockedTools: ["bash"],
                        policies: [
                            { name: "My Custom Policy", toolName: "custom:*", ruleType: "REQUIRE_APPROVAL" }
                        ],
                        vault: [
                            { secretName: "MY_SECRET", allowedTools: ["tool1"] }
                        ]
                    }
                });

            expect(res.status).toBe(201);
            expect(res.body.apiKey).toMatch(/^ag_/);
            expect(res.body.name).toBe("test-agent");
            
            // Verify Postgres inserts
            expect(mockClient.query).toHaveBeenCalledWith("BEGIN");
            // Check for agents insert
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining("INSERT INTO agents"),
                expect.any(Array)
            );
            // Check for blocked tools policy insert
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining("INSERT INTO policies"),
                expect.arrayContaining([expect.stringContaining("Blocked via API: bash")])
            );
            // Check for custom policy insert
            expect(mockClient.query).toHaveBeenCalledWith(
                expect.stringContaining("INSERT INTO policies"),
                expect.arrayContaining([expect.stringContaining("My Custom Policy")])
            );
            
            // Mock secret lookup for vault rule
            (mockClient.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: "secret-uuid" }] });
            
            // Note: Since I'm using async loops in the route, 
            // the actual calls might happen after the response if not awaited.
            // But I am using 'await client.query' in the loop in the route.

            expect(mockClient.query).toHaveBeenCalledWith("COMMIT");

            // Verify Firestore write
            const db = getFirestore();
            expect(db?.collection).toHaveBeenCalledWith("agents");
            expect(db?.doc).toHaveBeenCalled();
        });
    });

    describe("Agent Retrieval (GET /v1/agents)", () => {
        test("lists agents for the authenticated tenant", async () => {
            (pool.query as jest.Mock)
                .mockResolvedValueOnce({ rows: [{ id: TENANT_ID }] }) // Auth
                .mockResolvedValueOnce({ rows: [{ id: "a1", name: "agent1" }] }); // List

            const res = await request(app)
                .get("/v1/agents")
                .set("Authorization", `Bearer ${MASTER_KEY}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].name).toBe("agent1");
        });
    });

    describe("Agent Revenue (DELETE /v1/agents/:id)", () => {
        test("successfully revokes an agent", async () => {
            (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [{ id: TENANT_ID }] });
            
            const mockClient = {
                query: jest.fn()
                    .mockResolvedValueOnce({ rows: [] }) // BEGIN
                    .mockResolvedValueOnce({ rowCount: 1 }) // DELETE agents
                    .mockResolvedValueOnce({ rows: [] }) // DELETE policies
                    .mockResolvedValueOnce({ rows: [] }), // COMMIT
                release: jest.fn(),
            };
            (pool.connect as jest.Mock).mockResolvedValue(mockClient);

            const res = await request(app)
                .delete("/v1/agents/some-id")
                .set("Authorization", `Bearer ${MASTER_KEY}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            const db = getFirestore();
            expect(db?.doc).toHaveBeenCalledWith("some-id");
            expect(mockClient.query).toHaveBeenCalledWith("COMMIT");
        });
    });

    describe("Agent Guardrails Update (PATCH /v1/agents/:id/guardrails)", () => {
        test("successfully updates agent guardrails", async () => {
            (pool.query as jest.Mock)
                .mockResolvedValueOnce({ rows: [{ id: TENANT_ID }] }) // Auth
                .mockResolvedValueOnce({ rows: [{ id: "a1", max_cost_usd: 25 }] }); // Update

            const res = await request(app)
                .patch("/v1/agents/a1/guardrails")
                .set("Authorization", `Bearer ${MASTER_KEY}`)
                .send({
                    budget: { limitUsd: 25 },
                    max_iterations: 100
                });

            expect(res.status).toBe(200);
            expect(res.body.max_cost_usd).toBe(25);
            expect(pool.query).toHaveBeenCalledWith(
                expect.stringContaining("UPDATE agents"),
                expect.arrayContaining([25, 20, 100])
            );
        });
    });
});
