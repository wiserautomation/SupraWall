import axios from 'axios';

const BASE_URL = 'https://www.supra-wall.com';
const ADMIN_KEY = 'ag_master_m9ozn10nrqfuqmzuiz2rt';
const AGENT_KEY = 'ag_Ox6Ulo0KJHcUtVdYZ9-rK9_-1tSthAjo';
const AGENT_ID = 'n0jg7ed6eHA5gLvlRBt9';
const TENANT_ID = 'lEmuTYpa8mUqpREQYphKMG6JzlR2';

async function runTests() {
    console.log('--- STARTING SUPRAWALL FINAL VERIFICATION ---');

    // 1. Create a Policy (Admin API)
    console.log('\n1. Creating Policy to block "terminal"...');
    try {
        const policyRes = await axios.post(`${BASE_URL}/api/v1/policies`, {
            name: "Final Verification Block",
            toolName: "terminal",
            ruleType: "deny",
            tenantId: TENANT_ID,
            description: "Blocked for final verification test"
        }, {
            headers: { 'Authorization': `Bearer ${ADMIN_KEY}` }
        });
        console.log('✅ Policy Created:', policyRes.data.id);
    } catch (error: any) {
        console.error('❌ Policy Creation Failed:', error.response?.data || error.message);
    }

    // 2. Trigger a Threat (Agent API)
    console.log('\n2. Triggering SQL Injection threat...');
    try {
        const threatRes = await axios.post(`${BASE_URL}/api/v1/evaluate`, {
            apiKey: AGENT_KEY,
            toolName: "sql_query",
            arguments: { query: "SELECT * FROM users WHERE id = '1' OR '1'='1'" }
        });
        console.log('Result:', threatRes.data.decision, '-', threatRes.data.reason);
        if (threatRes.data.decision === 'DENY') {
            console.log('✅ Threat Engine successfully blocked injection.');
        } else {
            console.error('❌ Threat Engine failed to block.');
        }
    } catch (error: any) {
        console.error('❌ Threat Test Request Failed:', error.response?.data || error.message);
    }

    // 3. Trigger the Policy (Agent API)
    console.log('\n3. Triggering newly created "terminal" policy...');
    try {
        const policyEvalRes = await axios.post(`${BASE_URL}/api/v1/evaluate`, {
            apiKey: AGENT_KEY,
            toolName: "terminal",
            arguments: { command: "ls -la" }
        });
        console.log('Result:', policyEvalRes.data.decision, '-', policyEvalRes.data.reason);
        if (policyEvalRes.data.decision === 'DENY') {
            console.log('✅ Custom Policy successfully blocked "terminal".');
        } else {
            console.error('❌ Custom Policy failed to block.');
        }
    } catch (error: any) {
        console.error('❌ Policy Test Request Failed:', error.response?.data || error.message);
    }

    // 4. Trigger Approval (Agent API)
    console.log('\n4. Creating Approval Policy for "production_deploy"...');
    try {
        await axios.post(`${BASE_URL}/api/v1/policies`, {
            name: "Deploy Approval",
            toolName: "production_deploy",
            ruleType: "require_approval",
            tenantId: TENANT_ID
        }, {
            headers: { 'Authorization': `Bearer ${ADMIN_KEY}` }
        });
        
        console.log('Triggering approval for "production_deploy"...');
        const appRes = await axios.post(`${BASE_URL}/api/v1/evaluate`, {
            apiKey: AGENT_KEY,
            toolName: "production_deploy",
            arguments: { target: "main-cluster" }
        });
        console.log('Result:', appRes.data.decision);
        if (appRes.data.decision === 'REQUIRE_APPROVAL') {
            console.log('✅ Approval system successfully triggered.');
        } else {
            console.error('❌ Approval system failed.');
        }
    } catch (error: any) {
        console.error('❌ Approval Test Failed:', error.response?.data || error.message);
    }

    console.log('\n--- VERIFICATION COMPLETE ---');
    console.log('Search for "Final Verification Block" or "production_deploy" in your dashboard at https://www.supra-wall.com/dashboard/audit');
}

runTests();
