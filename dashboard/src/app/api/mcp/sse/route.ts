import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

/**
 * MCP SSE Transport Endpoint
 * 
 * GET /api/mcp/sse - Establishes the SSE connection
 * POST /api/mcp/sse?sessionId=... - Receives MCP messages
 */

const connections = new Map<string, ReadableStreamDefaultController>();

export async function GET(req: NextRequest) {
    const sessionId = crypto.randomUUID();
    
    // Create actual SSE stream
    const stream = new ReadableStream({
        start(controller) {
            connections.set(sessionId, controller);
            
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
    if (!sessionId || !connections.has(sessionId)) {
        return NextResponse.json({ error: "Invalid or expired session" }, { status: 400 });
    }

    const message = await req.json();
    const controller = connections.get(sessionId);

    // Handle MCP JSON-RPC
    const response = await handleMcpMessage(message, req);

    if (response && controller) {
        controller.enqueue(`event: message\ndata: ${JSON.stringify(response)}\n\n`);
    }

    return NextResponse.json({ status: "ok" });
}

async function handleMcpMessage(message: any, req: NextRequest) {
    const { method, params, id } = message;

    switch (method) {
        case 'initialize':
            return {
                jsonrpc: "2.0",
                id,
                result: {
                    protocolVersion: "2024-11-05",
                    capabilities: {
                        tools: { listChanged: true }
                    },
                    serverInfo: {
                        name: "SupraWall Hosted MCP",
                        version: "1.0.0"
                    }
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
                                    agent_id: { type: "string" },
                                    tool_name: { type: "string" },
                                    parameters: { type: "object" }
                                },
                                required: ["agent_id", "tool_name"]
                            }
                        },
                        {
                            name: "request_approval",
                            description: "Trigger a human oversight workflow for high-risk actions.",
                            inputSchema: {
                                type: "object",
                                properties: {
                                    agent_id: { type: "string" },
                                    action_description: { type: "string" }
                                },
                                required: ["agent_id", "action_description"]
                            }
                        }
                    ]
                }
            };

        case 'tools/call':
            const { name, arguments: args } = params;
            // Internal call to evaluate logic
            // Note: In a real hosted scenario, we'd resolve the user from OAuth token here
            const baseUrl = new URL(req.url).origin;
            const evalResponse = await fetch(`${baseUrl}/api/v1/evaluate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    apiKey: "mcp_internal_bypass", // We'll need a way to trust the hosted server calls
                    toolName: name,
                    args,
                })
            });

            const data = await evalResponse.json();
            return {
                jsonrpc: "2.0",
                id,
                result: {
                    content: [{ type: "text", text: JSON.stringify(data) }]
                }
            };

        default:
            return {
                jsonrpc: "2.0",
                id,
                error: { code: -32601, message: "Method not found" }
            };
    }
}
