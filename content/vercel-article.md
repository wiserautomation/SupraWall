# Your Vercel AI Agent Is Probably Violating the EU AI Act — Here's How to Fix It in One Line

*Published on DEV Community*

---

The Vercel AI SDK is genuinely great for building AI agents. `streamText`, `generateObject`, tool calling, multi-step agentic loops — it's all ergonomic and fast. You can go from zero to a working agent in an afternoon.

That's actually the problem.

The EU AI Act came into force in August 2024. For high-risk AI systems, compliance obligations start in August 2025. If you're shipping agents that interact with EU users — booking travel, handling customer support, sending communications, touching financial data — you are almost certainly missing three things the law requires.

This isn't legal advice. But it is a technical walkthrough of the gap, and how to close it with one line of Vercel AI SDK middleware.

---

## What the EU AI Act Cares About (From an Engineering Perspective)

Ignore the dense legal language. From a developer's perspective, the EU AI Act imposes three runtime requirements on high-risk AI agents:

**1. Human oversight that actually works (Article 14)**

You need a mechanism for a human to review, approve, or stop consequential agent actions before they execute. "Consequential" means things like: sending communications to external parties, modifying or deleting production data, making financial transactions, or taking actions that can't be undone.

The Vercel AI SDK has tool execution approval in AI SDK 6. This is a start. But "approval" that just logs to your console doesn't satisfy Article 14. The approver needs to be identifiable, the approval needs to be logged, and the log needs to survive an audit.

**2. Record keeping (Article 12)**

High-risk AI systems must maintain logs sufficient to reconstruct what happened. This means: what the agent was asked to do, what tools it called, what data it passed to those tools, what it returned, and — critically — whether a human reviewed and approved any of it.

The AI SDK doesn't log anything by default. Your `streamText` calls produce no audit trail. If a regulator asks you to show them everything your agent did between January and March 2025, you have no answer.

**3. Risk management controls (Article 9)**

You need a documented process for evaluating and mitigating risks from your AI system. At the code level, this means: before your agent executes a tool call, something should evaluate whether that action is allowed given the current context, risk level, and organizational policy.

A hardcoded `if tool === "delete_user" { requireApproval() }` in your route handler is not a risk management system. It's a check. Risk management means the rules are centralized, auditable, and updateable without deploying new code.

---

## The Vercel AI SDK Middleware Interface: What It's Inviting You to Build

Here's something worth reading carefully from the Vercel AI SDK docs:

> "A major advantage of the language model middleware interface is that it is shareable. You can package, distribute, and reuse middleware across projects."

The SDK ships with three built-in middleware packages: `extractReasoningMiddleware`, `simulateStreamingMiddleware`, and `defaultSettingsMiddleware`. None of them touch compliance. The interface is explicitly designed for third-party middleware, and nobody has published a compliance middleware yet.

That's the gap. Here's how to fill it.

---

## The Fix: One Line of Middleware

```typescript
import { openai } from '@ai-sdk/openai';
import { wrapLanguageModel } from 'ai';
import { suprawallMiddleware } from '@suprawall/vercel-ai';

// Before: unprotected model
// const model = openai('gpt-4o');

// After: EU AI Act compliant
const model = wrapLanguageModel({
  model: openai('gpt-4o'),
  middleware: suprawallMiddleware({
    apiKey: process.env.SUPRAWALL_API_KEY,
    riskLevel: 'high',
    requireHumanOversight: true,
    auditRetentionDays: 730,
  }),
});
```

That's it. Every `streamText`, `generateText`, and `generateObject` call that uses this model now runs through compliance middleware. The middleware intercepts tool calls, routes high-risk actions for human approval (to Slack or a web dashboard — not your terminal), and logs every decision to a tamper-evident audit trail.

---

## What Actually Happens Under the Hood

### Tool Call Interception

When your agent wants to call a tool, the middleware intercepts it before execution:

```typescript
import { suprawallMiddleware, ToolPolicy, RiskLevel } from '@suprawall/vercel-ai';

const middleware = suprawallMiddleware({
  apiKey: process.env.SUPRAWALL_API_KEY,
  toolPolicies: [
    {
      toolName: 'sendEmail',
      riskLevel: RiskLevel.HIGH,
      requiresApproval: true,
      approverRole: 'compliance_officer',
      euAiActArticle: 'Article 14',
    },
    {
      toolName: 'deleteUserData',
      riskLevel: RiskLevel.CRITICAL,
      requiresApproval: true,
      minApprovers: 2,               // Dual approval for critical actions
      approverRole: 'senior_manager',
    },
    {
      toolName: 'readProductCatalog',
      riskLevel: RiskLevel.LOW,
      requiresApproval: false,       // Read-only, low risk, auto-allow
    },
  ],
});
```

When the agent tries to call `sendEmail`, Suprawall:
1. Checks the policy for `sendEmail`
2. Sends a notification to your compliance officer (Slack, dashboard, or email)
3. Pauses the agent while waiting for approval (configurable timeout)
4. Logs the decision — approved or denied — with timestamp and approver identity
5. Proceeds or blocks accordingly

### Audit Logging That Satisfies Article 12

Every model call automatically produces a structured log entry:

```typescript
// This happens automatically — you don't write this code
{
  auditId: "sw_audit_01J8X...",
  timestamp: "2025-09-15T14:32:11Z",
  sessionId: "sess_abc123",
  userId: "user_xyz789",

  // What was requested
  input: { messages: [...], system: "You are a customer service agent..." },

  // What the model decided to do
  toolCallsAttempted: [
    { toolName: "sendEmail", args: { to: "customer@example.com", ... } }
  ],

  // Human oversight decisions (Article 14)
  humanDecisions: [
    {
      toolName: "sendEmail",
      decision: "APPROVED",
      approverId: "user_compliance_officer_001",
      approverName: "Maria Schmidt",
      timestamp: "2025-09-15T14:35:44Z",
      reasoning: "Reviewed email content, appropriate response to customer inquiry"
    }
  ],

  // Output
  output: { text: "...", toolResults: [...] },

  // Compliance metadata
  euAiActArticles: ["Article 12", "Article 14"],
  retainUntil: "2027-09-15T14:32:11Z"  // 730-day retention
}
```

---

## Full Working Example: Customer Service Agent

Here's a complete Next.js route handler showing a customer service agent with EU AI Act compliance:

```typescript
// app/api/agent/route.ts
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { wrapLanguageModel } from 'ai';
import { suprawallMiddleware, RiskLevel } from '@suprawall/vercel-ai';

const compliantModel = wrapLanguageModel({
  model: openai('gpt-4o'),
  middleware: suprawallMiddleware({
    apiKey: process.env.SUPRAWALL_API_KEY!,
    riskLevel: RiskLevel.HIGH,
    requireHumanOversight: true,
    auditRetentionDays: 730,
    toolPolicies: [
      { toolName: 'sendEmail', requiresApproval: true, riskLevel: RiskLevel.HIGH },
      { toolName: 'issueRefund', requiresApproval: true, riskLevel: RiskLevel.HIGH },
      { toolName: 'escalateToHuman', requiresApproval: false, riskLevel: RiskLevel.LOW },
      { toolName: 'lookupOrder', requiresApproval: false, riskLevel: RiskLevel.LOW },
    ],
  }),
});

export async function POST(req: Request) {
  const { messages, userId, sessionId } = await req.json();

  const result = streamText({
    model: compliantModel,
    system: 'You are a customer service agent. Help customers with orders and returns.',
    messages,
    tools: {
      lookupOrder: { /* ... */ },
      issueRefund: { /* ... */ },
      sendEmail: { /* ... */ },
      escalateToHuman: { /* ... */ },
    },
    // Pass compliance context
    experimental_headers: {
      'x-suprawall-user-id': userId,
      'x-suprawall-session-id': sessionId,
    },
  });

  return result.toDataStreamResponse();
}
```

The difference from your current code: `model` is now `compliantModel`. That's the one line. Everything else is existing pattern.

---

## What You Still Need to Do (That Middleware Can't Do For You)

Middleware handles the runtime compliance controls. The EU AI Act also requires:

- **Technical documentation (Article 11):** A written description of your system's intended purpose, architecture, training data, and known limitations. This is a document, not code.
- **Transparency obligations (Article 13):** Users must be informed they're interacting with an AI. A disclosure banner or message is the typical implementation.
- **Conformity assessment:** For certain high-risk applications, a formal conformity assessment before deployment.

These require organizational effort. But none of them are possible to demonstrate without the runtime audit trail. The middleware is the foundation.

---

## Getting Started

```bash
npm install @suprawall/vercel-ai
```

```typescript
import { suprawallMiddleware } from '@suprawall/vercel-ai';
```

Full documentation: [suprawall.ai/docs/vercel](https://suprawall.ai/docs/vercel)

Or clone the starter template — a Next.js app with the AI SDK, tool calling, and Suprawall compliance pre-configured — from the [Vercel Integration Marketplace](https://vercel.com/integrations/suprawall) (search "SupraWall").

---

The Vercel AI SDK makes it easy to build agents. `@suprawall/vercel-ai` makes it easy to build *compliant* agents. Closely integrated with the [Claude Desktop Extension](https://github.com/wiserautomation/supawall-mcp-plugin), SupraWall provides a complete security loop for modern agent swarms.

If you're shipping to EU users in 2025, that gap is worth closing.

---

*Building something with the Vercel AI SDK? Find us in the [Claude Connectors Directory](https://clau.de/mcp-directory/suprawall) or drop a comment on the Vercel Community forum.*
