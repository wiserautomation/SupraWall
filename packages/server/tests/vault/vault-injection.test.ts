// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Vault JIT injection integration tests
 */

import request from "supertest";
import app from "../../src/index";
import { pool } from "../../src/db";

const TENANT = "test-tenant-injection";
const AGENT = "test-agent";
const TOOL = "process_payment";
const SECRET_NAME = "INJECTION_TEST_KEY";
const SECRET_VALUE = "sk_test_injection_value_abc123";

let secretId: string;

beforeAll(async () => {
    await pool.query("DELETE FROM vault_access_rules WHERE tenant_id = $1", [TENANT]);
    await pool.query("DELETE FROM vault_access_log WHERE tenant_id = $1", [TENANT]);
    await pool.query("DELETE FROM vault_rate_limits WHERE tenant_id = $1", [TENANT]);
    await pool.query("DELETE FROM vault_secrets WHERE tenant_id = $1", [TENANT]);

    // Create test secret
    const res = await request(app)
        .post("/v1/vault/secrets")
        .set(AUTH)
        .send({ tenantId: TENANT, secretName: SECRET_NAME, secretValue: SECRET_VALUE });
    secretId = res.body.id;
});

afterAll(async () => {
    await pool.query("DELETE FROM vault_secrets WHERE tenant_id = $1", [TENANT]);
});

function vaultToken(name: string) {
    return `$SUPRAWALL_VAULT_${name}`;
}

const AUTH = { "Authorization": "Bearer sw_admin_test_injection" };

describe("Vault Injection — Policy Evaluation", () => {
    test("does not modify arguments with no vault tokens", async () => {
        const res = await request(app)
            .post("/v1/evaluate")
            .set(AUTH)
            .send({ agentId: AGENT, toolName: TOOL, arguments: { amount: 100 }, tenantId: TENANT });

        expect(res.body.decision).toBe("ALLOW");
        expect(res.body.vaultInjected).toBeFalsy();
        expect(res.body.resolvedArguments).toBeUndefined();
    });

    test("denies when agent lacks access rule (no rule created)", async () => {
        const res = await request(app)
            .post("/v1/evaluate")
            .set(AUTH)
            .send({
                agentId: AGENT,
                toolName: TOOL,
                arguments: { apiKey: vaultToken(SECRET_NAME), amount: 100 },
                tenantId: TENANT,
            });

        expect(res.body.decision).toBe("DENY");
        expect(res.body.reason).toContain("Vault access denied");
    });

    test("logs NOT_FOUND for missing secret", async () => {
        const res = await request(app)
            .post("/v1/evaluate")
            .set(AUTH)
            .send({
                agentId: AGENT,
                toolName: TOOL,
                arguments: { apiKey: vaultToken("NONEXISTENT_KEY") },
                tenantId: TENANT,
            });

        expect(res.body.decision).toBe("DENY");

        const logRes = await request(app)
            .get(`/v1/vault/log?tenantId=${TENANT}&limit=5`)
            .set(AUTH);
        const notFound = logRes.body.find((e: any) => e.action === "NOT_FOUND");
        expect(notFound).toBeDefined();
    });

    describe("with access rule", () => {
        beforeAll(async () => {
            await request(app)
                .post("/v1/vault/rules")
                .set(AUTH)
                .send({
                    tenantId: TENANT,
                    agentId: AGENT,
                    secretId,
                    allowedTools: [TOOL],
                    maxUsesPerHour: 100,
                });
        });

        test("resolves token when agent has access", async () => {
            const res = await request(app)
                .post("/v1/evaluate")
                .set(AUTH)
                .send({
                    agentId: AGENT,
                    toolName: TOOL,
                    arguments: { apiKey: vaultToken(SECRET_NAME), amount: 100 },
                    tenantId: TENANT,
                });

            expect(res.body.decision).toBe("ALLOW");
            expect(res.body.vaultInjected).toBe(true);
            expect(res.body.resolvedArguments.apiKey).toBe(SECRET_VALUE);
            expect(res.body.injectedSecrets).toContain(SECRET_NAME);
        });

        test("denies when tool is not in allowed_tools list", async () => {
            const res = await request(app)
                .post("/v1/evaluate")
                .set(AUTH)
                .send({
                    agentId: AGENT,
                    toolName: "bash",
                    arguments: { apiKey: vaultToken(SECRET_NAME) },
                    tenantId: TENANT,
                });

            expect(res.body.decision).toBe("DENY");
            expect(res.body.reason).toContain("Vault access denied");
        });

        test("logs every vault access with correct action", async () => {
            const logRes = await request(app)
                .get(`/v1/vault/log?tenantId=${TENANT}&limit=20`)
                .set(AUTH);

            const actions = logRes.body.map((e: any) => e.action);
            expect(actions).toContain("INJECTED");
            expect(actions).toContain("DENIED");
        });

        test("handles multiple vault tokens in a single call", async () => {
            // Create a second secret and rule
            const res2 = await request(app)
                .post("/v1/vault/secrets")
                .set(AUTH)
                .send({ tenantId: TENANT, secretName: "SECOND_TEST_KEY", secretValue: "second_value_xyz" });
            await request(app)
                .post("/v1/vault/rules")
                .set(AUTH)
                .send({ tenantId: TENANT, agentId: AGENT, secretId: res2.body.id, allowedTools: [TOOL] });

            const res = await request(app)
                .post("/v1/evaluate")
                .set(AUTH)
                .send({
                    agentId: AGENT,
                    toolName: TOOL,
                    arguments: {
                        apiKey: vaultToken(SECRET_NAME),
                        secondKey: vaultToken("SECOND_TEST_KEY"),
                    },
                    tenantId: TENANT,
                });

            expect(res.body.decision).toBe("ALLOW");
            expect(res.body.resolvedArguments.apiKey).toBe(SECRET_VALUE);
            expect(res.body.resolvedArguments.secondKey).toBe("second_value_xyz");
            expect(res.body.injectedSecrets).toHaveLength(2);
        });

        test("fails closed (DENY) if any token fails to resolve", async () => {
            const res = await request(app)
                .post("/v1/evaluate")
                .set(AUTH)
                .send({
                    agentId: AGENT,
                    toolName: TOOL,
                    arguments: {
                        goodKey: vaultToken(SECRET_NAME),
                        badKey: vaultToken("NONEXISTENT_KEY"),
                    },
                    tenantId: TENANT,
                });

            expect(res.body.decision).toBe("DENY");
        });
    });

    test("denies when secret has expired", async () => {
        // Create a secret with past expiry
        const expiredRes = await request(app)
            .post("/v1/vault/secrets")
            .set(AUTH)
            .send({
                tenantId: TENANT,
                secretName: "EXPIRED_KEY",
                secretValue: "expiredvalue",
                expiresAt: new Date(Date.now() - 1000).toISOString(),
            });
        await request(app)
            .post("/v1/vault/rules")
            .set(AUTH)
            .send({ tenantId: TENANT, agentId: AGENT, secretId: expiredRes.body.id, allowedTools: [] });

        const res = await request(app)
            .post("/v1/evaluate")
            .set(AUTH)
            .send({
                agentId: AGENT,
                toolName: TOOL,
                arguments: { key: vaultToken("EXPIRED_KEY") },
                tenantId: TENANT,
            });

        expect(res.body.decision).toBe("DENY");
        expect(res.body.reason).toContain("Vault access denied");
    });
});
