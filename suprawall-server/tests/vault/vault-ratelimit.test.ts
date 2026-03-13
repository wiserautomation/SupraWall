/**
 * Vault rate limiting integration tests
 */

import request from "supertest";
import app from "../../src/index";
import { pool } from "../../src/db";

const TENANT = "test-tenant-ratelimit";
const AGENT = "ratelimit-agent";
const TOOL = "test_tool";
const SECRET_NAME = "RATE_TEST_KEY";

let secretId: string;

beforeAll(async () => {
    await pool.query("DELETE FROM vault_access_rules WHERE tenant_id = $1", [TENANT]);
    await pool.query("DELETE FROM vault_access_log WHERE tenant_id = $1", [TENANT]);
    await pool.query("DELETE FROM vault_rate_limits WHERE tenant_id = $1", [TENANT]);
    await pool.query("DELETE FROM vault_secrets WHERE tenant_id = $1", [TENANT]);

    const res = await request(app)
        .post("/v1/vault/secrets")
        .send({ tenantId: TENANT, secretName: SECRET_NAME, secretValue: "rate_test_value" });
    secretId = res.body.id;
});

afterAll(async () => {
    await pool.query("DELETE FROM vault_secrets WHERE tenant_id = $1", [TENANT]);
});

describe("Vault Rate Limiting", () => {
    test("allows calls within rate limit", async () => {
        await request(app)
            .post("/v1/vault/rules")
            .send({ tenantId: TENANT, agentId: AGENT, secretId, allowedTools: [], maxUsesPerHour: 3 });

        const res = await request(app)
            .post("/v1/evaluate")
            .send({
                agentId: AGENT,
                toolName: TOOL,
                arguments: { key: `$SUPRAWALL_VAULT_${SECRET_NAME}` },
                tenantId: TENANT,
            });

        expect(res.body.decision).toBe("ALLOW");
    });

    test("blocks calls exceeding rate limit", async () => {
        // Delete existing rule and create one with limit=1
        const rulesRes = await request(app).get(`/v1/vault/rules?tenantId=${TENANT}&agentId=${AGENT}`);
        for (const rule of rulesRes.body) {
            await request(app).delete(`/v1/vault/rules/${rule.id}?tenantId=${TENANT}`);
        }
        await pool.query("DELETE FROM vault_rate_limits WHERE tenant_id = $1", [TENANT]);

        await request(app)
            .post("/v1/vault/rules")
            .send({ tenantId: TENANT, agentId: AGENT, secretId, allowedTools: [], maxUsesPerHour: 1 });

        const payload = {
            agentId: AGENT,
            toolName: TOOL,
            arguments: { key: `$SUPRAWALL_VAULT_${SECRET_NAME}` },
            tenantId: TENANT,
        };

        // First call: should be ALLOW (uses up the 1 allowed)
        const first = await request(app).post("/v1/evaluate").send(payload);
        expect(first.body.decision).toBe("ALLOW");

        // Second call: should be DENY (rate limit exceeded)
        const second = await request(app).post("/v1/evaluate").send(payload);
        expect(second.body.decision).toBe("DENY");
        expect(second.body.reason).toContain("Vault access denied");
    });

    test("tracks rate limits per agent+secret combination", async () => {
        const AGENT_B = "other-agent";

        // Give AGENT_B its own rule and clean rate limit state
        const rulesRes = await request(app).get(`/v1/vault/rules?tenantId=${TENANT}&agentId=${AGENT_B}`);
        for (const rule of rulesRes.body) {
            await request(app).delete(`/v1/vault/rules/${rule.id}?tenantId=${TENANT}`);
        }
        await pool.query(
            "DELETE FROM vault_rate_limits WHERE tenant_id = $1 AND agent_id = $2",
            [TENANT, AGENT_B]
        );

        await request(app)
            .post("/v1/vault/rules")
            .send({ tenantId: TENANT, agentId: AGENT_B, secretId, allowedTools: [], maxUsesPerHour: 5 });

        const res = await request(app)
            .post("/v1/evaluate")
            .send({
                agentId: AGENT_B,
                toolName: TOOL,
                arguments: { key: `$SUPRAWALL_VAULT_${SECRET_NAME}` },
                tenantId: TENANT,
            });

        // AGENT_B should be allowed even though AGENT is rate-limited
        expect(res.body.decision).toBe("ALLOW");
    });
});
