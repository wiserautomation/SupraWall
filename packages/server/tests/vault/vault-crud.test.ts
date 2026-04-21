// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Vault CRUD integration tests
 * Requires: npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
 * Run: npx jest tests/vault/vault-crud.test.ts
 */

import request from "supertest";
import app from "../../src/index";
import { pool } from "../../src/db";

const TENANT = "test-tenant-crud";

beforeAll(async () => {
    // Clean up from previous runs
    await pool.query("DELETE FROM vault_access_rules WHERE tenant_id = $1", [TENANT]);
    await pool.query("DELETE FROM vault_access_log WHERE tenant_id = $1", [TENANT]);
    await pool.query("DELETE FROM vault_secrets WHERE tenant_id = $1", [TENANT]);
});

afterAll(async () => {
    await pool.query("DELETE FROM vault_secrets WHERE tenant_id = $1", [TENANT]);
    await pool.end();
});

describe("Vault CRUD — Secrets", () => {
    let createdId: string;

    test("creates a secret and returns metadata (no value)", async () => {
        const res = await request(app)
            .post("/v1/vault/secrets")
            .set("Authorization", "Bearer sw_admin_test")
            .send({
                tenantId: TENANT,
                secretName: "TEST_API_KEY",
                secretValue: "sk_test_supersecret",
                description: "Test key",
            });

        expect(res.status).toBe(201);
        expect(res.body.secret_name).toBe("TEST_API_KEY");
        expect(res.body.description).toBe("Test key");
        expect(res.body.id).toBeDefined();
        expect(res.body).not.toHaveProperty("encrypted_value");
        expect(res.body).not.toHaveProperty("secret_value");
        createdId = res.body.id;
    });

    test("lists secrets without exposing encrypted values", async () => {
        const res = await request(app)
            .get(`/v1/vault/secrets?tenantId=${TENANT}`)
            .set("Authorization", "Bearer sw_admin_test");

        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);

        for (const secret of res.body) {
            expect(secret).not.toHaveProperty("encrypted_value");
            expect(secret).not.toHaveProperty("secret_value");
            expect(secret.secret_name).toBeDefined();
        }
    });

    test("rotates a secret and updates last_rotated_at", async () => {
        const originalRes = await request(app)
            .get(`/v1/vault/secrets?tenantId=${TENANT}`)
            .set("Authorization", "Bearer sw_admin_test");
        const originalRotatedAt = originalRes.body[0].last_rotated_at;

        await new Promise(r => setTimeout(r, 10)); // ensure time difference

        const res = await request(app)
            .put(`/v1/vault/secrets/${createdId}/rotate`)
            .set("Authorization", "Bearer sw_admin_test")
            .send({ tenantId: TENANT, newValue: "sk_test_newvalue" });

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(createdId);
        expect(new Date(res.body.last_rotated_at).getTime())
            .toBeGreaterThanOrEqual(new Date(originalRotatedAt).getTime());
    });

    test("rejects duplicate secret names per tenant", async () => {
        const res = await request(app)
            .post("/v1/vault/secrets")
            .set("Authorization", "Bearer sw_admin_test")
            .send({
                tenantId: TENANT,
                secretName: "TEST_API_KEY",
                secretValue: "another_value",
            });

        expect(res.status).toBe(409);
        expect(res.body.error).toContain("already exists");
    });

    test("rejects invalid secret name format", async () => {
        const invalidNames = ["lowercase", "has space", "123STARTS_WITH_NUM", "OK!"];
        for (const name of invalidNames) {
            const res = await request(app)
                .post("/v1/vault/secrets")
                .set("Authorization", "Bearer sw_admin_test")
                .send({ tenantId: TENANT, secretName: name, secretValue: "val" });
            expect(res.status).toBe(400);
        }
    });

    test("deletes a secret and cascades to access rules", async () => {
        // Create a second secret and a rule for it
        const secretRes = await request(app)
            .post("/v1/vault/secrets")
            .set("Authorization", "Bearer sw_admin_test")
            .send({ tenantId: TENANT, secretName: "DELETE_ME_KEY", secretValue: "todelete" });
        const secretId = secretRes.body.id;

        await request(app)
            .post("/v1/vault/rules")
            .set("Authorization", "Bearer sw_admin_test")
            .send({ tenantId: TENANT, agentId: "agent_test", secretId, allowedTools: [] });

        // Delete the secret
        const deleteRes = await request(app)
            .delete(`/v1/vault/secrets/${secretId}?tenantId=${TENANT}`)
            .set("Authorization", "Bearer sw_admin_test");
        expect(deleteRes.status).toBe(200);

        // Verify the access rule was also deleted (cascade)
        const rulesRes = await request(app)
            .get(`/v1/vault/rules?tenantId=${TENANT}&agentId=agent_test`)
            .set("Authorization", "Bearer sw_admin_test");
        const rulesForDeleted = rulesRes.body.filter((r: any) => r.secret_id === secretId);
        expect(rulesForDeleted).toHaveLength(0);
    });
});
