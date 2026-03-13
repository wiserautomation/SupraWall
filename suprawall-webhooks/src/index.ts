import express from 'express';
import dotenv from 'dotenv';
import { dispatchWebhook } from './queue';
import { WebhookPayload, WebhookEndpoint } from './types';

dotenv.config();

const app = express();
app.use(express.json());

// For testing purposes
const mockEndpoint: WebhookEndpoint = {
    id: "ep_test",
    userId: "user_test",
    url: process.env.TEST_WEBHOOK_URL || "https://httpbin.org/post",
    secret: "whsec_test_secret_key_change_me",
    enabled: true,
    events: ["policy.denied", "tool.require_approval", "audit_log.created"]
};

app.post('/test-dispatch', async (req, res) => {
    const payload: WebhookPayload = {
        id: \`evt_\${Date.now()}\`,
        event: "policy.denied",
        created_at: new Date().toISOString(),
        data: {
            agent_id: "agent_123",
            tool_name: "bash",
            arguments: { "command": "rm -rf /" },
            decision: "DENY"
        }
    };
    
    await dispatchWebhook(mockEndpoint, payload);
    return res.json({ status: "queued", event: payload.id });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(\`suprawall Webhook test API listening on port \${port}\`);
});
