import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { withSupraWall } from 'suprawall-vercel-ai';
import { z } from 'zod';

/**
 * SupraWall Compliant Agent Template
 *
 * Production-ready Next.js route handler demonstrating deterministic
 * policy enforcement on a Vercel AI SDK agent. Every tool call is
 * intercepted by SupraWall before the underlying tool runs.
 *
 * Designed to satisfy EU AI Act Articles 9 (risk management),
 * 12 (logging), and 14 (human oversight) when paired with the
 * right policy configuration in the SupraWall dashboard.
 */

const rawTools = {
  lookupOrder: tool({
    description: 'Lookup order details by ID',
    parameters: z.object({ orderId: z.string() }),
    execute: async ({ orderId }) => ({ id: orderId, status: 'shipped' }),
  }),
  issueRefund: tool({
    description: 'Issue a refund for an order',
    parameters: z.object({ orderId: z.string(), amount: z.number() }),
    execute: async ({ orderId, amount }) => ({ success: true, orderId, amount }),
  }),
  sendEmail: tool({
    description: 'Send an email to the customer',
    parameters: z.object({ to: z.string(), body: z.string() }),
    execute: async ({ to }) => ({ success: true, to }),
  }),
};

// One line — every tool call is now policy-checked.
// Configure approval requirements, risk levels, and retention in
// your SupraWall dashboard; the SDK stays thin on purpose.
const securedTools = withSupraWall(rawTools, {
  apiKey: process.env.SUPRAWALL_API_KEY!,
  agentId: 'customer-service-agent',
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a compliant customer service agent.
             Perform order lookups freely, but ask for
             confirmation before sending emails or issuing refunds.`,
    messages,
    tools: securedTools,
  });

  return result.toDataStreamResponse();
}
