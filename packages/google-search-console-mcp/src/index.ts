import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { GSCClient } from './lib/gsc.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

// Try to load credentials from file or env
let authData: any = null;

const serviceAccountPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH || path.join(process.cwd(), 'service-account.json');
if (fs.existsSync(serviceAccountPath)) {
    authData = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));
} else if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN) {
    authData = {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    };
}

if (!authData) {
    console.error('Error: No authentication data found. Please provide service-account.json or set environment variables.');
    process.exit(1);
}

const gsc = new GSCClient(authData);

const server = new Server(
    {
        name: 'google-search-console',
        version: '1.0.0',
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
                name: 'list_sites',
                description: 'Lists all sites available in Google Search Console',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'get_search_analytics',
                description: 'Fetches search analytics data (clicks, impressions, CTR, position) for a site',
                inputSchema: {
                    type: 'object',
                    properties: {
                        siteUrl: { type: 'string', description: 'The site URL as it appears in Search Console' },
                        startDate: { type: 'string', description: 'Start date in YYYY-MM-DD format (e.g. 2024-01-01)' },
                        endDate: { type: 'string', description: 'End date in YYYY-MM-DD format (e.g. 2024-01-31)' },
                        dimensions: {
                            type: 'array',
                            items: { type: 'string' },
                            description: 'Dimensions to group by (e.g. query, page, country, device, date)',
                            default: ['query']
                        },
                    },
                    required: ['siteUrl', 'startDate', 'endDate'],
                },
            },
            {
                name: 'url_inspection',
                description: 'Inspects a specific URL to see its status in the Google index',
                inputSchema: {
                    type: 'object',
                    properties: {
                        siteUrl: { type: 'string', description: 'The site URL as it appears in Search Console' },
                        inspectionUrl: { type: 'string', description: 'The specific URL to inspect' },
                    },
                    required: ['siteUrl', 'inspectionUrl'],
                },
            },
        ],
    };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
        switch (name) {
            case 'list_sites':
                return { content: [{ type: 'text', text: JSON.stringify(await gsc.listSites(), null, 2) }] };

            case 'get_search_analytics': {
                const { siteUrl, startDate, endDate, dimensions } = args as any;
                const data = await gsc.queryAnalytics(siteUrl, startDate, endDate, dimensions);
                return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
            }

            case 'url_inspection': {
                const { siteUrl, inspectionUrl } = args as any;
                const result = await gsc.inspectUrl(siteUrl, inspectionUrl);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }

            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    } catch (error: any) {
        return {
            isError: true,
            content: [{ type: 'text', text: error.message || 'Unknown error' }],
        };
    }
});

async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('Google Search Console MCP server running on stdio');
}

main().catch((error) => {
    console.error('Fatal error in main():', error);
    process.exit(1);
});
