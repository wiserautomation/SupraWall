import { NextRequest } from 'next/server';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { mcpServer } from '../../../lib/mcp-server';

/**
 * MCP Remote Endpoint using Web Standard Streamable HTTP.
 * This works natively on Vercel/Next.js.
 */

const transport = new WebStandardStreamableHTTPServerTransport({
    // Stateless mode for serverless reliability
    sessionIdGenerator: undefined 
});

// Since each Request in Next.js is a fresh invocation, we must connect
// the transport to the server for every call.
const connected = mcpServer.connect(transport);

export async function GET(req: NextRequest) {
    await connected;
    return transport.handleRequest(req);
}

export async function POST(req: NextRequest) {
    await connected;
    return transport.handleRequest(req);
}

// Optional: Support DELETE for session teardown if needed
export async function DELETE(req: NextRequest) {
    await connected;
    return transport.handleRequest(req);
}
