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

// ── MCP Server Factory ──

export function createSupraWallMCPServer() {
    const server = new Server(
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

    server.setRequestHandler(ListToolsRequestSchema, async () => {
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

    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const { name, arguments: args } = request.params;
        
        try {
            switch (name) {
                case 'check_policy': {
                    const result = await evaluateSupraWallAction(args as any);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'request_approval': {
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

    return server;
}
