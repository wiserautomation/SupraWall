// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.SUPRAWALL_API_URL || "https://www.supra-wall.com";
const MASTER_KEY = "ag_master_m9ozn10nrqfuqmuiz2rt"; 
const AGENT_ID = "layer_verifier_agent";
const TENANT_ID = "peghin@gmail.com"; 

async function runLayerTests() {
    console.log("🚀 Starting Multi-Layer Security Verification via Direct API...");
    
    console.log("--------------------------------------------------");
    console.log("🔍 TEST 1: First Layer Enforcement (Policy-based DENY)");
    try {
        const res = await axios.post(`${API_URL}/api/v1/evaluate`, {
            apiKey: MASTER_KEY,
            agentId: AGENT_ID,
            toolName: "system_destroy",
            args: { reason: "Testing Layer 1" }
        });
        console.log("Layer 1 Result:", res.data.decision, "Reason:", res.data.reason); 
        // Expected: DENY (Policy blocks system_destroy)
    } catch (e: any) {
        console.log("Layer 1 check failed:", e.response?.data || e.message);
    }

    console.log("--------------------------------------------------");
    console.log("🧠 TEST 2: Second Layer Enforcement (AI Semantic Threat)");
    try {
        const res = await axios.post(`${API_URL}/api/v1/evaluate`, {
            apiKey: MASTER_KEY,
            agentId: AGENT_ID,
            toolName: "sql_query",
            args: { 
                query: "SELECT * FROM secrets; DROP TABLE orders; --", 
                intent: "Bypassing guardrails via SQL Injection" 
            }
        });
        console.log("Layer 2 Result:", res.data.decision, "Score:", res.data.riskScore);
        // Expected: DENY (AI detects the SQL injection attempt)
    } catch (e: any) {
        console.log("Layer 2 check failed:", e.response?.data || e.message);
    }

    console.log("--------------------------------------------------");
    console.log("👤 TEST 3: Human-in-the-Loop Workflow (REQUIRE_APPROVAL)");
    try {
        console.log("Requesting approval for 'vault_access'...");
        const res = await axios.post(`${API_URL}/api/v1/evaluate`, {
            apiKey: MASTER_KEY,
            agentId: AGENT_ID,
            toolName: "vault_access",
            args: { 
                secret_id: "prod_db_credentials",
                reason: "Verifying manual approval flow"
            }
        });

        console.log("Initial Decision:", res.data.decision); // Expected: REQUIRE_APPROVAL

        if (res.data.decision === "REQUIRE_APPROVAL") {
            const approvalId = res.data.approvalId;
            console.log("✅ Approval ID received:", approvalId);

            // 1. Double check visibility on the generic dashboard list
            const approvalsRes = await axios.get(`${API_URL}/api/v1/approvals?tenantId=${TENANT_ID}`);
            const pending = approvalsRes.data.find((a: any) => a.id === approvalId);
            
            if (pending) {
                console.log("✅ Dashboard visibility confirmed for pending request.");

                // 2. Simulate User APPROVAL
                console.log("Approving request...");
                await axios.post(`${API_URL}/api/approvals/${approvalId}/respond`, {
                    action: "approve",
                    comment: "Verified by Layer 3 automated test."
                });

                // 3. Check STATUS endpoint (What the SDK polls)
                console.log("Polling for status update...");
                const statusUpdateRes = await axios.get(`${API_URL}/api/v1/approvals/status/${approvalId}`);
                console.log("Final SDK-Poll status:", statusUpdateRes.data.status); // Expected: APPROVED
            } else {
                console.log("⚠️ Pending request not found in dashboard list.");
            }
        }
    } catch (e: any) {
        console.log("Layer 3 check failed:", e.response?.data || e.message);
    }

    console.log("--------------------------------------------------");
    console.log("🚀 Multi-Layer Tests Complete.");
}

runLayerTests().catch(console.error);
