// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0


import request from "supertest";
import app from "../../src/index";
import { pool } from "../../src/db";

const TENANT = "test-tenant-bulk";

beforeAll(async () => {
    await pool.query("DELETE FROM vault_secrets WHERE tenant_id = $1", [TENANT]);
});

const AUTH = { "Authorization": "Bearer sw_admin_test_bulk" };

describe("Vault Bulk Import", () => {
    test("imports multiple secrets in one request", async () => {
        const secrets = [
            { secretName: "BULK_1", secretValue: "val1", description: "First" },
            { secretName: "BULK_2", secretValue: "val2" },
            { secretName: "BULK_3", secretValue: "val3" },
        ];

        const res = await request(app)
            .post("/v1/vault/secrets/bulk")
            .set(AUTH)
            .send({ tenantId: TENANT, secrets });

        expect(res.status).toBe(207);
        expect(res.body.created).toHaveLength(3);
        expect(res.body.skipped).toHaveLength(0);
        expect(res.body.errors).toHaveLength(0);

        // Verify they exist in DB
        const dbRes = await pool.query("SELECT secret_name FROM vault_secrets WHERE tenant_id = $1", [TENANT]);
        expect(dbRes.rows).toHaveLength(3);
    });

    test("skips duplicate secret names", async () => {
        const secrets = [
            { secretName: "BULK_1", secretValue: "new_val" }, // Duplicate from previous test
            { secretName: "BULK_4", secretValue: "val4" },
        ];

        const res = await request(app)
            .post("/v1/vault/secrets/bulk")
            .set(AUTH)
            .send({ tenantId: TENANT, secrets });

        expect(res.status).toBe(207);
        expect(res.body.created).toHaveLength(1);
        expect(res.body.skipped).toHaveLength(1);
        expect(res.body.skipped[0].secretName).toBe("BULK_1");
    });

    test("handles errors for invalid key formats", async () => {
        const secrets = [
            { secretName: "invalid-name", secretValue: "val" },
            { secretName: "VALID_NAME", secretValue: "val" },
        ];

        const res = await request(app)
            .post("/v1/vault/secrets/bulk")
            .set(AUTH)
            .send({ tenantId: TENANT, secrets });

        expect(res.status).toBe(207);
        expect(res.body.created).toHaveLength(1);
        expect(res.body.errors).toHaveLength(1);
        expect(res.body.errors[0].secretName).toBe("invalid-name");
    });

    test("enforces the 100 secrets limit", async () => {
        const secrets = Array.from({ length: 101 }, (_, i) => ({
            secretName: `KEY_${i}`,
            secretValue: `VAL_${i}`
        }));

        const res = await request(app)
            .post("/v1/vault/secrets/bulk")
            .set(AUTH)
            .send({ tenantId: TENANT, secrets });

        expect(res.status).toBe(400);
        expect(res.body.error).toContain("limit is 100");
    });
});
