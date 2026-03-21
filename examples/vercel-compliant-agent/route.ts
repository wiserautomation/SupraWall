import { openai } from '@ai-sdk/openai';
import { streamText, wrapLanguageModel } from 'ai';
import { suprawallMiddleware, RiskLevel } from '@suprawall/vercel-ai';

/**
 * SupraWall Compliant Agent Template
 * 
 * This example demonstrates a production-ready Next.js route handler
 * that implements EU AI Act compliance (Articles 9, 12, 14) using
 * one line of SupraWall middleware.
 */

const compliantModel = wrapLanguageModel({
    model: openai('gpt-4o'),
    middleware: suprawallMiddleware({
        apiKey: process.env.SUPRAWALL_API_KEY!,
        riskLevel: RiskLevel.HIGH,
        requireHumanOversight: true,
        auditRetentionDays: 730, // Article 12 requirement
        toolPolicies: [
            { 
                toolName: 'sendEmail', 
                requiresApproval: true, 
                riskLevel: RiskLevel.HIGH,
                description: 'External communication requires human review'
            },
            { 
                toolName: 'issueRefund', 
                requiresApproval: true, 
                riskLevel: RiskLevel.HIGH,
                description: 'Financial transactions require senior oversight'
            },
            { 
                toolName: 'lookupOrder', 
                requiresApproval: false, 
                riskLevel: RiskLevel.LOW 
            },
        ],
    }),
});

export async function POST(req: Request) {
    const { messages, userId, sessionId } = await req.json();

    const result = streamText({
        model: compliantModel,
        system: `You are a compliant customer service agent. 
                Perform order lookups freely, but ask for 
                confirmation before sending emails or issuing refunds.`,
        messages,
        tools: {
            lookupOrder: {
                description: 'Lookup order details by ID',
                parameters: { orderId: { type: 'string' } },
                execute: async ({ orderId }) => ({ id: orderId, status: 'shipped' })
            },
            issueRefund: {
                description: 'Issue a refund for an order',
                parameters: { orderId: { type: 'string' }, amount: { type: 'number' } },
                execute: async ({ orderId, amount }) => ({ success: true, amount })
            },
            sendEmail: {
                description: 'Send an email to the customer',
                parameters: { to: { type: 'string' }, body: { type: 'string' } },
                execute: async ({ to }) => ({ success: true, to })
            },
        },
        // Contextual metadata for audit logging (Article 12)
        experimental_headers: {
            'x-suprawall-user-id': userId,
            'x-suprawall-session-id': sessionId,
        },
    });

    return result.toDataStreamResponse();
}
