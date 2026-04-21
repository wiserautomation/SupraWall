// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { fetch } from "undici";
import { logger } from "./logger";

export const sendSlackNotification = async (
    webhookUrl: string, 
    agentName: string, 
    toolName: string, 
    parameters: any, 
    approvalId: string
) => {
    const blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "🚨 Security Approval Required",
                "emoji": true
            }
        },
        {
            "type": "section",
            "fields": [
                {
                    "type": "mrkdwn",
                    "text": `*Agent:*\n${agentName}`
                },
                {
                    "type": "mrkdwn",
                    "text": `*Tool:*\n\`${toolName}\``
                }
            ]
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `*Parameters:*\n\`\`\`${JSON.stringify(parameters, null, 2)}\`\`\``
            }
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "✅ Approve",
                        "emoji": true
                    },
                    "style": "primary",
                    "value": approvalId,
                    "action_id": "approve_action",
                    "url": `https://www.supra-wall.com/dashboard/approvals?id=${approvalId}`
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "❌ Deny",
                        "emoji": true
                    },
                    "style": "danger",
                    "value": approvalId,
                    "action_id": "deny_action",
                    "url": `https://www.supra-wall.com/dashboard/approvals?id=${approvalId}`
                }
            ]
        }
    ];

    try {
        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ blocks })
        });
    } catch (e) {
        logger.error("Failed to send Slack notification", { error: e });
    }
};
