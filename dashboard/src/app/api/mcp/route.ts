import { NextRequest } from 'next/server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { createSupraWallMCPServer } from '../../../lib/mcp-server';

/**
 * MCP Remote Endpoint using Web Standard Streamable HTTP.
 * This works natively on Vercel/Next.js.
 */

export async function GET(req: NextRequest) {
    const server = createSupraWallMCPServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined // Stateless mode
    });
    await server.connect(transport);
    return transport.handleRequest(req);
}

export async function POST(req: NextRequest) {
    const server = createSupraWallMCPServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined // Stateless mode
    });
    await server.connect(transport);
    return transport.handleRequest(req);
}

export async function DELETE(req: NextRequest) {
    const server = createSupraWallMCPServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
        sessionIdGenerator: undefined // Stateless mode
    });
    await server.connect(transport);
    return transport.handleRequest(req);
}
