// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { verifyMCPToken, MCPTokenData } from '@/lib/mcp-auth';

/**
 * MCP SSE Transport Endpoint
 * 
 * GET /api/mcp/sse - Establishes the SSE connection
 * POST /api/mcp/sse?sessionId=... - Receives MCP messages
 */

interface SSEConnection {
    controller: ReadableStreamDefaultController;
    tokenData: MCPTokenData;
}

const connections = new Map<string, SSEConnection>();

export async function GET(req: NextRequest) {
    // ── H5: Auth Guard ──
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
            { error: "Unauthorized: Missing MCP access token" }, 
            { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } }
        );
    }
    const tokenData = await verifyMCPToken(authHeader.split(' ')[1]);
    if (!tokenData) {
        return NextResponse.json(
            { error: "Invalid or expired MCP access token" }, 
            { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } }
        );
    }

    const sessionId = crypto.randomUUID();
    
    // Create actual SSE stream
    const stream = new ReadableStream({
        start(controller) {
            connections.set(sessionId, { controller, tokenData });
            
            // Send initial endpoint URL for POSTing messages
            const baseUrl = new URL(req.url).origin;
            const endpointUrl = `${baseUrl}/api/mcp/sse?sessionId=${sessionId}`;
            
            controller.enqueue(`event: endpoint\ndata: ${endpointUrl}\n\n`);
            
            // Keep-alive interval
            const keepAlive = setInterval(() => {
                try {
                    controller.enqueue(': keep-alive\n\n');
                } catch {
                    clearInterval(keepAlive);
                }
            }, 30000);

            req.signal.addEventListener('abort', () => {
                connections.delete(sessionId);
                clearInterval(keepAlive);
            });
        },
        cancel() {
            connections.delete(sessionId);
        }
    });

    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        },
    });
}

export async function POST(req: NextRequest) {
    const sessionId = req.nextUrl.searchParams.get('sessionId');
    const session = sessionId ? connections.get(sessionId) : null;
    
    if (!session) {
        return NextResponse.json({ error: "Invalid or expired session" }, { status: 400 });
    }

    const message = await req.json();
    const { controller, tokenData } = session;

    // Handle MCP JSON-RPC
    const response = await handleMcpMessage(message, req, tokenData);

    if (response && controller) {
        try {
            controller.enqueue(`event: message\ndata: ${JSON.stringify(response)}\n\n`);
        } catch {
            if (sessionId) connections.delete(sessionId);
        }
    }

    return NextResponse.json({ status: "ok" });
}

async function handleMcpMessage(message: any, req: NextRequest, tokenData: MCPTokenData) {
    const { method, params, id } = message;

    switch (method) {
        case 'initialize':
            return {
                jsonrpc: "2.0",
                id,
                result: {
                    protocolVersion: "2024-11-05",
                    capabilities: { tools: { listChanged: true } },
                    serverInfo: { name: "SupraWall Hosted MCP", version: "1.0.0" }
                }
            };

        case 'tools/list':
            return {
                jsonrpc: "2.0",
                id,
                result: {
                    tools: [
                        {
                            name: "check_policy",
                            description: "Evaluate security risk of an intended tool call.",
                            inputSchema: {
                                type: "object",
                                properties: {
                                    tool_name: { type: "string" },
                                    parameters: { type: "object" }
                                },
                                required: ["tool_name"]
                            }
                        }
                    ]
                }
            };

        case 'tools/call':
            const { name, arguments: args } = params;
            
            // ── H5: Backdoor Removal ──
            // Resolve actual API key for this user/agent to avoid bypass
            let apiKey: string | null = null;
            try {
                if (tokenData.agentId) {
                    const agentSnap = await db.collection("agents").doc(tokenData.agentId).get();
                    apiKey = agentSnap.data()?.apiKey || null;
                }
                
                if (!apiKey) {
                    const platformSnap = await db.collection("platforms").where("userId", "==", tokenData.userId).limit(1).get();
                    if (!platformSnap.empty) {
                        const keysSnap = await db.collection("platforms").doc(platformSnap.docs[0].id).collection("keys").limit(1).get();
                        apiKey = keysSnap.docs[0]?.id || null;
                    }
                }
            } catch (err) {
                console.error("[MCP SSE] Failed to resolve API key:", err);
            }

            if (!apiKey) {
                return {
                    jsonrpc: "2.0",
                    id,
                    error: { code: -32000, message: "No API key found for this MCP session. Verify your agent configuration." }
                };
            }

            const baseUrl = new URL(req.url).origin;
            const evalResponse = await fetch(`${baseUrl}/api/v1/evaluate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey,
                    toolName: name,
                    args,
                })
            });

            const data = await evalResponse.json();
            return {
                jsonrpc: "2.0",
                id,
                result: { content: [{ type: "text", text: JSON.stringify(data) }] }
            };

        default:
            return {
                jsonrpc: "2.0",
                id,
                error: { code: -32601, message: "Method not found" }
            };
    }
}
