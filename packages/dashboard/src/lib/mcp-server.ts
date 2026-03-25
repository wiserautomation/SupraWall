// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// ── MCP Tools Implementation ──

interface SupraWallToolArgs {
    action: string;
    context?: any;
    severity?: string;
    reason?: string;
    urgency?: string;
    requesterEmail?: string;
    apiKey?: string;
}

async function evaluateSupraWallAction(params: SupraWallToolArgs, defaultApiKey?: string) {
    const { apiKey, action, context, severity } = params;
    const finalApiKey = apiKey || defaultApiKey;
    
    if (!finalApiKey) {
        throw new Error("Missing SupraWall API Key. Provide it in tool arguments or via Bearer token.");
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.supra-wall.com';
    const evaluateRes = await fetch(`${baseUrl}/api/v1/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            apiKey: finalApiKey,
            toolName: action,
            args: context || {},
            severity
        })
    });

    if (!evaluateRes.ok) {
        throw new Error(`SupraWall Evaluation Error: ${evaluateRes.statusText}`);
    }

    return await evaluateRes.json();
}

// ── MCP Server Factory ──

export function createSupraWallMCPServer(defaultApiKey?: string) {
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
                    description: 'Check if an AI action complies with configured compliance policies (cloud-hosted)',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            action: { type: 'string', description: 'The action to evaluate for compliance' },
                            context: { type: 'object', description: 'Additional context about the action' },
                            severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'], description: 'Severity level' },
                            apiKey: { type: 'string', description: 'Optional API Key (if not provided via header)' }
                        },
                        required: ['action']
                    }
                },
                {
                    name: 'request_approval',
                    description: 'Request human approval for a sensitive action with cloud-hosted audit trail',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            action: { type: 'string', description: 'The action requesting approval' },
                            reason: { type: 'string', description: 'Why human approval is needed' },
                            urgency: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Urgency level' },
                            requesterEmail: { type: 'string', description: 'Email of the person requesting approval' },
                            apiKey: { type: 'string', description: 'Optional API Key' }
                        },
                        required: ['action', 'reason']
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
                    const result = await evaluateSupraWallAction(args as any, defaultApiKey);
                    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
                }
                case 'request_approval': {
                    const finalArgs = args as any;
                    const finalApiKey = finalArgs.apiKey || defaultApiKey;
                    
                    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.supra-wall.com';
                    const res = await fetch(`${baseUrl}/api/v1/evaluate`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            apiKey: finalApiKey,
                            toolName: finalArgs.action,
                            args: {
                                ...(finalArgs.context || {}),
                                urgency: finalArgs.urgency,
                                requesterEmail: finalArgs.requesterEmail
                            },
                            forceApproval: true,
                            reason: finalArgs.reason
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
