// Copyright 2026 SupraWall Contributors
// SPDX-License-Identifier: Apache-2.0

import { NextRequest } from 'next/server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createSupraWallMCPServer } from '../../../lib/mcp-server';

/**
 * MCP Remote Endpoint using Web Standard Streamable HTTP.
 * This works natively on Vercel/Next.js.
 */

function getApiKey(req: NextRequest) {
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    return req.headers.get('x-api-key') || req.nextUrl.searchParams.get('apiKey');
}

export async function GET(req: NextRequest) {
    const apiKey = getApiKey(req);
    const server = createSupraWallMCPServer(apiKey || undefined as any);
    const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined // Stateless mode
    });
    await server.connect(transport);
    return transport.handleRequest(req);
}

export async function POST(req: NextRequest) {
    const apiKey = getApiKey(req);
    const server = createSupraWallMCPServer(apiKey || undefined as any);
    const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined // Stateless mode
    });
    await server.connect(transport);
    return transport.handleRequest(req);
}

export async function DELETE(req: NextRequest) {
    const apiKey = getApiKey(req);
    const server = createSupraWallMCPServer(apiKey || undefined as any);
    const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined // Stateless mode
    });
    await server.connect(transport);
    return transport.handleRequest(req);
}
