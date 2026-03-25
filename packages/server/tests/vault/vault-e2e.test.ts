// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Vault end-to-end integration tests
 */

import request from "supertest";
import app from "../../src/index";
import { pool } from "../../src/db";

const TENANT = "test-tenant-e2e";
const AGENT = "e2e-agent";

beforeAll(async () => {
    await pool.query("DELETE FROM vault_access_rules WHERE tenant_id = $1", [TENANT]);
    await pool.query("DELETE FROM vault_access_log WHERE tenant_id = $1", [TENANT]);
    await pool.query("DELETE FROM vault_rate_limits WHERE tenant_id = $1", [TENANT]);
    await pool.query("DELETE FROM vault_secrets WHERE tenant_id = $1", [TENANT]);
});

afterAll(async () => {
    await pool.query("DELETE FROM vault_secrets WHERE tenant_id = $1", [TENANT]);
});

describe("Vault E2E", () => {
    test("Full flow: create secret → create rule → evaluate with token → get resolved args", async () => {
        // 1. Create secret
        const secretRes = await request(app)
            .post("/v1/vault/secrets")
            .send({ tenantId: TENANT, secretName: "E2E_STRIPE_KEY", secretValue: "sk_live_e2e_test_abc" });
        expect(secretRes.status).toBe(201);
        const secretId = secretRes.body.id;

        // 2. Create access rule
        const ruleRes = await request(app)
            .post("/v1/vault/rules")
            .send({ tenantId: TENANT, agentId: AGENT, secretId, allowedTools: ["charge_card"], maxUsesPerHour: 10 });
        expect(ruleRes.status).toBe(201);

        // 3. Evaluate with vault token
        const evalRes = await request(app)
            .post("/v1/evaluate")
            .send({
                agentId: AGENT,
                toolName: "charge_card",
                arguments: { apiKey: "$SUPRAWALL_VAULT_E2E_STRIPE_KEY", amount: 4999 },
                tenantId: TENANT,
            });

        expect(evalRes.body.decision).toBe("ALLOW");
        expect(evalRes.body.vaultInjected).toBe(true);
        expect(evalRes.body.resolvedArguments.apiKey).toBe("sk_live_e2e_test_abc");
        expect(evalRes.body.resolvedArguments.amount).toBe(4999);
        expect(evalRes.body.injectedSecrets).toEqual(["E2E_STRIPE_KEY"]);

        // 4. Verify audit log
        const logRes = await request(app)
            .get(`/v1/vault/log?tenantId=${TENANT}&agentId=${AGENT}`);
        const injected = logRes.body.find((e: any) => e.action === "INJECTED" && e.secret_name === "E2E_STRIPE_KEY");
        expect(injected).toBeDefined();
    });

    test("Full flow: agent without access → DENY", async () => {
        const secretRes = await request(app)
            .post("/v1/vault/secrets")
            .send({ tenantId: TENANT, secretName: "RESTRICTED_KEY", secretValue: "restricted_value" });
        // No access rule created for AGENT

        const res = await request(app)
            .post("/v1/evaluate")
            .send({
                agentId: AGENT,
                toolName: "any_tool",
                arguments: { key: "$SUPRAWALL_VAULT_RESTRICTED_KEY" },
                tenantId: TENANT,
            });

        expect(res.body.decision).toBe("DENY");
    });

    test("Full flow: correct tool → INJECT, wrong tool → DENY", async () => {
        const secretRes = await request(app)
            .post("/v1/vault/secrets")
            .send({ tenantId: TENANT, secretName: "TOOL_SCOPED_KEY", secretValue: "scoped_value_xyz" });
        const secretId = secretRes.body.id;

        await request(app)
            .post("/v1/vault/rules")
            .send({ tenantId: TENANT, agentId: AGENT, secretId, allowedTools: ["allowed_tool"] });

        const allowed = await request(app)
            .post("/v1/evaluate")
            .send({
                agentId: AGENT,
                toolName: "allowed_tool",
                arguments: { key: "$SUPRAWALL_VAULT_TOOL_SCOPED_KEY" },
                tenantId: TENANT,
            });
        expect(allowed.body.decision).toBe("ALLOW");
        expect(allowed.body.resolvedArguments.key).toBe("scoped_value_xyz");

        const denied = await request(app)
            .post("/v1/evaluate")
            .send({
                agentId: AGENT,
                toolName: "wrong_tool",
                arguments: { key: "$SUPRAWALL_VAULT_TOOL_SCOPED_KEY" },
                tenantId: TENANT,
            });
        expect(denied.body.decision).toBe("DENY");
    });

    test("Full flow: secret rotation → next call gets new value", async () => {
        const secretRes = await request(app)
            .post("/v1/vault/secrets")
            .send({ tenantId: TENANT, secretName: "ROTATABLE_KEY", secretValue: "old_value" });
        const secretId = secretRes.body.id;

        await request(app)
            .post("/v1/vault/rules")
            .send({ tenantId: TENANT, agentId: AGENT, secretId, allowedTools: [] });

        // Call before rotation
        const before = await request(app)
            .post("/v1/evaluate")
            .send({
                agentId: AGENT,
                toolName: "some_tool",
                arguments: { key: "$SUPRAWALL_VAULT_ROTATABLE_KEY" },
                tenantId: TENANT,
            });
        expect(before.body.resolvedArguments.key).toBe("old_value");

        // Rotate
        await request(app)
            .put(`/v1/vault/secrets/${secretId}/rotate`)
            .send({ tenantId: TENANT, newValue: "new_rotated_value" });

        // Call after rotation
        const after = await request(app)
            .post("/v1/evaluate")
            .send({
                agentId: AGENT,
                toolName: "some_tool",
                arguments: { key: "$SUPRAWALL_VAULT_ROTATABLE_KEY" },
                tenantId: TENANT,
            });
        expect(after.body.resolvedArguments.key).toBe("new_rotated_value");
    });

    test("Full flow: response scrubbing removes all traces", async () => {
        const SECRET_VALUE = "sk_live_scrub_test_abc123";
        const secretRes = await request(app)
            .post("/v1/vault/secrets")
            .send({ tenantId: TENANT, secretName: "SCRUB_TEST_KEY", secretValue: SECRET_VALUE });

        const scrubRes = await request(app)
            .post("/v1/scrub")
            .send({
                tenantId: TENANT,
                secretNames: ["SCRUB_TEST_KEY"],
                toolResponse: { status: "ok", message: `API returned error for key ${SECRET_VALUE}` },
            });

        expect(scrubRes.status).toBe(200);
        const responseStr = JSON.stringify(scrubRes.body.scrubbedResponse);
        expect(responseStr).not.toContain(SECRET_VALUE);
        expect(responseStr).toContain("[REDACTED]");
    });
});
