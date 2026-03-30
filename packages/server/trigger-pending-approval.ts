// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

/**
 * This script triggers a PENDING approval request specifically for the user's dashboard.
 * It does NOT auto-approve, so it stays visible in the 'Approvals' tab.
 */

const API_URL = "https://www.supra-wall.com";
const MASTER_KEY = "ag_master_m9ozn10nrqfuqmzuiz2rt"; // Fixed typo (z inserted)
const AGENT_ID = "gtm_orch_v2";
const TENANT_ID = "lEmuTYpa8mUqpREQYphKMG6JzlR2"; // The user's confirmed UID

async function triggerPendingApproval() {
    console.log("🚀 Triggering PENDING approval request for dashboard audit...");
    
    try {
        const res = await axios.post(`${API_URL}/api/v1/evaluate`, {
            apiKey: MASTER_KEY,
            agentId: AGENT_ID,
            toolName: "vault_access",
            tenantId: TENANT_ID, // Force the real UID
            args: { 
                secret_id: "linkedin_engagement_token",
                reason: "GTM Campaign: High-stakes social broadcast."
            }
        });

        console.log("--------------------------------------------------");
        console.log("Result:", res.data.decision); 
        console.log("Approval ID:", res.data.approvalId);
        console.log("--------------------------------------------------");

        if (res.data.decision === "REQUIRE_APPROVAL") {
            console.log("✅ SUCCESS: Request is now PENDING in your 'Approvals' tab.");
            console.log("👉 Go to: https://www.supra-wall.com/dashboard/approvals");
        } else {
            console.log("⚠️ Unexpected decision:", res.data.decision);
            console.log("Check if you have a DENY policy that overridden the approval rule.");
        }

    } catch (e: any) {
        console.error("❌ Failed to trigger approval:", e.response?.data || e.message);
    }
}

triggerPendingApproval().catch(console.error);
