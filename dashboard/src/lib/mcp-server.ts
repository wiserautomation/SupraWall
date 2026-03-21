import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { db } from './firebase-admin';
import * as admin from 'firebase-admin';
import { resolveVaultTokens } from './vault-server';

// ── MCP Tools Implementation ──

interface SupraWallToolArgs {
    toolName: string;
    args: any;
    agentRole?: string;
    sessionId?: string;
    apiKey: string;
}

async function evaluateSupraWallAction(params: SupraWallToolArgs) {
    const { apiKey, toolName, args, sessionId, agentRole } = params;
    
    // Call our internal evaluation endpoint or logic
    // We'll reuse the logic from v1/evaluate/route.ts by directly checking DB
    
    let tenantId: string;
    let agentId: string;
    let userId: string;
    
    if (apiKey.startsWith("agc_")) {
        const subKeySnap = await db.collection("connect_keys").doc(apiKey).get();
        if (!subKeySnap.exists || !subKeySnap.data()?.active) {
            throw new Error("Invalid or inactive Connect sub-key.");
        }
        const subKey = subKeySnap.data()!;
        tenantId = subKey.platformId;
        agentId = apiKey;
        const platformSnap = await db.collection("platforms").doc(subKey.platformId).get();
        userId = platformSnap.data()?.ownerId;
    } else {
        const agentsSnapshot = await db.collection("agents").where("apiKey", "==", apiKey).limit(1).get();
        if (agentsSnapshot.empty) {
            throw new Error("Invalid API Key");
        }
        const agentDoc = agentsSnapshot.docs[0];
        agentId = agentDoc.id;
        tenantId = agentDoc.data().userId;
        userId = agentDoc.data().userId;
    }

    // This is a simplified version of evaluateAction. 
    // In production, we'd call the /v1/evaluate endpoint directly to ensure all middleware/logging fires.
    // For now, let's call the internal API route via fetch or re-implement the call.
    // Using fetch to stay consistent with production logs.
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.supra-wall.com';
    const evaluateRes = await fetch(`${baseUrl}/api/v1/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            apiKey,
            toolName,
            args,
            sessionId,
            agentRole
        })
    });

    if (!evaluateRes.ok) {
        throw new Error(`SupraWall Evaluation Error: ${evaluateRes.statusText}`);
    }

    return await evaluateRes.json();
}

// ── MCP Server Instance ──

export const mcpServer = new Server(
    {
        name: 'suprawall-cloud',
        version: '1.2.0',
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

mcpServer.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'check_policy',
                description: 'Verify if an action is allowed by SupraWall security policies',
                inputSchema: {
                    type: 'object',
                    properties: {
                        apiKey: { type: 'string', description: 'Your SupraWall API Key (ag_ or agc_)' },
                        toolName: { type: 'string', description: 'The tool/action being performed' },
                        args: { type: 'object', description: 'Arguments passed to the tool' },
                        agentRole: { type: 'string', description: 'Optional agent persona' },
                        sessionId: { type: 'string', description: 'Optional session tracking identifier' },
                    },
                    required: ['apiKey', 'toolName', 'args']
                }
            },
            {
                name: 'request_approval',
                description: 'Force a human approval request for a tool call',
                inputSchema: {
                    type: 'object',
                    properties: {
                        apiKey: { type: 'string', description: 'Your SupraWall API Key' },
                        toolName: { type: 'string', description: 'The tool requiring approval' },
                        args: { type: 'object', description: 'Tool arguments' },
                        reason: { type: 'string', description: 'Reason for the manual approval request' },
                    },
                    required: ['apiKey', 'toolName', 'args', 'reason']
                }
            }
        ]
    };
});

mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
        switch (name) {
            case 'check_policy': {
                const result = await evaluateSupraWallAction(args as any);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            case 'request_approval': {
                // Wrapper for evaluate with forceApproval logic
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.supra-wall.com';
                const res = await fetch(`${baseUrl}/api/v1/evaluate`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...(args as any),
                        forceApproval: true
                    })
                });
                const result = await res.json();
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (e: any) {
        return {
            isError: true,
            content: [{ type: 'text', text: e.message }]
        };
    }
});
