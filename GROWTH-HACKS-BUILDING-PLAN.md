# Supra-wall Growth Hacks — Technical Building Plan

**Three viral attribution mechanisms that turn every agent interaction into a distribution channel.**

Each hack exploits an existing interception point in the Supra-wall architecture — no new infrastructure required. The free tier gets branding; paid tiers can remove it (creating upgrade pressure).

---

## Overview: The Three Mechanisms

| # | Hack | Injection Point | Visibility | Effort |
|---|------|----------------|------------|--------|
| 1 | **SDK Output Branding** | `withSupraWall()` / `protect()` tool result wrapper | Every end-user of every agent | ~2 days |
| 2 | **Approval Notification Footers** | Slack Block Kit + Email templates | Decision-makers & team channels | ~1 day |
| 3 | **Embed Widget Badge** | `embed.ts` iframe + CSS overlay | Anyone viewing the embedded audit widget | ~0.5 day |

**Total estimated effort: 3-4 days**
**Revenue unlock: Free → Pro upgrade trigger ("Remove Supra-wall branding")**

---

## Codebase Verification Notes

All file paths and function names verified against the live repo on March 12, 2026:

| Planned Reference | Verified Location | Status |
|---|---|---|
| `evaluateAction.ts` Slack blocks | Lines 473-529, Block Kit payload with header/section/actions | Confirmed — context block goes after actions block |
| `evaluateAction.ts` ALLOW response | Line 378, `res.status(200).json({...})` | Confirmed — add `branding` field here |
| `evaluateAction.ts` org plan | `orgData` from Firestore `organizations` collection | Confirmed — plan stored as field (starter/growth/enterprise) |
| SDK `withSupraWall()` | `suprawall-sdk/src/index.ts` line 376 | Confirmed — wraps `executeTool` |
| SDK `wrapVercelTools()` | `suprawall-sdk/src/index.ts` line 523 | Confirmed — wraps each tool's `execute` |
| SDK `createSupraWallMiddleware()` | `suprawall-sdk/src/index.ts` line 414 | Confirmed — MCP middleware |
| SDK `wrapOpenClaw()` | `suprawall-sdk/src/index.ts` line 487 | Confirmed — browser agent wrapper |
| Python SDK | `suprawall-python/suprawall/gate.py` | Confirmed — `_secured_method()` wraps all frameworks |
| Embed widget | `packages/embed/src/embed.ts` | Confirmed — 47 lines, creates iframe from `app.suprawall.io` |
| Pricing page | `dashboard/src/app/pricing/page.tsx` | Confirmed — Stripe checkout integration |
| Approval UI | `dashboard/src/app/approvals/page.tsx` | Confirmed — Firestore real-time listeners |
| Plan tiers | `"starter" \| "growth" \| "enterprise"` | Confirmed in `types/connect.ts` — branding shows on `starter` |
| Vault scrub flow | Already wired in SDK lines 343-374 | Confirmed — branding appends AFTER vault scrub |
| Email notification | Line 531, placeholder function | Confirmed — needs SendGrid/Resend implementation first |

---

## Hack 1: SDK Output Branding (Highest Impact)

### Concept
On the free tier, every tool call that Supra-wall intercepts gets a small attribution string appended to the response the agent sees. The LLM naturally passes this through to the end-user in its response, creating organic visibility.

### How It Works

```
User → Agent → Tool Call → Supra-wall evaluates → Tool executes → Response + branding → Agent → User sees branding
```

The branding is **not** injected into the tool's actual execution — it's appended to the response *after* execution, before returning to the LLM. This means:
- The tool works exactly the same
- The LLM sees the attribution as part of the tool response
- The LLM naturally includes or acknowledges it in its output to the user

### Architecture

**Decision: Server-side vs SDK-side branding**

→ **Server-side** (recommended). The server already knows the tenant's plan tier from the API key lookup. Adding a `branding` field to the evaluation response is cleaner than hardcoding plan logic in every SDK.

### Files to Modify

#### 1. Server: Add branding to evaluation response

**File: `firebase/functions/src/evaluateAction.ts`**

After the policy evaluation returns `ALLOW`, and before sending the response, check the organization's plan tier:

```typescript
// After line ~260 (the ALLOW response construction)

// Determine branding based on plan tier
const showBranding = org.plan === "free" || org.plan === "hobby" || !org.plan;

// Add to response payload
const response = {
  decision: "ALLOW",
  reason: matchedRule?.description || "Allowed by policy",
  estimated_cost_usd: costEstimate,
  // NEW: branding fields
  branding: showBranding ? {
    enabled: true,
    text: "🛡️ Secured by Supra-wall — AI agent security & EU AI Act compliance",
    url: "https://suprawall.ai?ref=agent-output",
    format: "text", // "text" | "markdown" | "html"
  } : { enabled: false },
  // ... vault fields
};
```

**Schema addition to SupraWallResponse:**
```typescript
branding?: {
  enabled: boolean;
  text?: string;
  url?: string;
  format?: "text" | "markdown" | "html";
};
```

#### 2. TypeScript SDK: Append branding to tool results

**File: `suprawall-sdk/src/index.ts`**

Modify both `withSupraWall()` and `wrapVercelTools()` to append branding after tool execution:

```typescript
// New helper function
function appendBranding(toolResult: any, branding: any): any {
  if (!branding?.enabled || !branding.text) return toolResult;

  // For string responses — most common from tool calls
  if (typeof toolResult === "string") {
    return `${toolResult}\n\n---\n${branding.text}`;
  }

  // For object responses — add as metadata field
  if (typeof toolResult === "object" && toolResult !== null) {
    return {
      ...toolResult,
      _attribution: branding.text,
      _attribution_url: branding.url,
    };
  }

  return toolResult;
}
```

**In `withSupraWall()` (around line 392-408):**
```typescript
agentInstance.executeTool = async (toolName: string, args: any) => {
  const result = await internalEvaluate(toolName, args, options);

  if (result.decision === "ALLOW") {
    const executionArgs = result.vaultInjected ? result.resolvedArguments : args;
    let toolResult = await originalExecuteTool(toolName, executionArgs);

    // Vault scrubbing (existing)
    if (result.vaultInjected && result.injectedSecrets?.length) {
      toolResult = await scrubAfterExecution(toolResult, result.injectedSecrets, options);
    }

    // NEW: Append branding for free-tier users
    toolResult = appendBranding(toolResult, result.branding);

    return toolResult;
  }

  logger.warn(`[SupraWall] ${result.decision}: ${result.reason ?? ""}`);
  return `ERROR: ${result.reason ?? "Action blocked by SupraWall."}`;
};
```

**Same pattern in `wrapVercelTools()`, `createSupraWallMiddleware()`, and `wrapOpenClaw()`.**

#### 3. Python SDK: Mirror the branding logic

**File: `suprawall-python/suprawall/gate.py`**

Add Python equivalent:

```python
def _append_branding(self, tool_result, branding):
    """Append attribution to tool results for free-tier users."""
    if not branding or not branding.get("enabled"):
        return tool_result

    text = branding.get("text", "")
    if not text:
        return tool_result

    if isinstance(tool_result, str):
        return f"{tool_result}\n\n---\n{text}"

    if isinstance(tool_result, dict):
        return {**tool_result, "_attribution": text, "_attribution_url": branding.get("url")}

    return tool_result
```

Call this in the `_secured_method()` wrapper, after vault scrubbing and before returning.

#### 4. Update response interface

**File: `suprawall-sdk/src/index.ts` — `internalEvaluate` return type:**

```typescript
// Add to the return type
branding?: { enabled: boolean; text?: string; url?: string; format?: string };
```

Parse it from the server response in `internalEvaluate()`:
```typescript
return {
  decision: data.decision,
  reason: data.reason,
  branding: data.branding,  // NEW
  resolvedArguments: data.resolvedArguments,
  // ...
};
```

### Testing
1. Create a free-tier test organization
2. Run an agent with `protect()` wrapping
3. Verify tool responses include the attribution string
4. Verify a paid-tier org does NOT see branding
5. Test with LangChain, Vercel AI, and raw MCP to ensure branding flows through to end-users

### Opt-out upgrade path
In the dashboard pricing page, add:
> **Pro Plan** — Remove "Secured by Supra-wall" branding from all agent outputs. $49/mo.

---

## Hack 2: Approval Notification Footers (Decision-Maker Reach)

### Concept
Every REQUIRE_APPROVAL notification sent to Slack or email includes a branded footer. When an approval request lands in a shared Slack channel, the entire team sees the Supra-wall brand. This targets the people who approve software budgets.

### Architecture

The injection points already exist:
- **Slack**: Block Kit message in `evaluateAction.ts` (lines ~317-329)
- **Email**: Placeholder in `evaluateAction.ts` (lines ~331-344)
- **Webhook**: Event payload in `suprawall-webhooks`

### Files to Modify

#### 1. Slack: Add branded footer block

**File: `firebase/functions/src/evaluateAction.ts`**

Find the Slack Block Kit payload construction (around line 483+). Add a context block at the bottom:

```typescript
// Existing blocks for the approval notification...
const blocks = [
  // ... existing header, section, actions blocks ...

  // NEW: Branded footer (free tier only)
  ...(showBranding ? [{
    type: "context",
    elements: [
      {
        type: "image",
        image_url: "https://suprawall.ai/icon-small.png",
        alt_text: "Supra-wall"
      },
      {
        type: "mrkdwn",
        text: "🛡️ Protected by <https://suprawall.ai?ref=slack-approval|*Supra-wall*> — AI agent security & EU AI Act compliance"
      }
    ]
  }] : [])
];
```

This uses Slack's native `context` block — small, unobtrusive, but always visible.

#### 2. Email: Branded HTML footer

**File: `firebase/functions/src/evaluateAction.ts`**

When the email notification system is activated (currently placeholder), add a footer to the HTML template:

```html
<!-- Approval notification email footer -->
<tr>
  <td style="padding: 20px 0; border-top: 1px solid #e5e7eb;">
    <table cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td style="padding-right: 8px; vertical-align: middle;">
          <img src="https://suprawall.ai/icon-small.png"
               width="16" height="16" alt="Supra-wall" />
        </td>
        <td style="font-size: 12px; color: #6b7280; font-family: Arial, sans-serif;">
          Protected by
          <a href="https://suprawall.ai?ref=email-approval"
             style="color: #10b981; text-decoration: none; font-weight: 600;">
            Supra-wall
          </a>
          — AI agent security & EU AI Act compliance
        </td>
      </tr>
    </table>
  </td>
</tr>
```

#### 3. Webhook: Add branding metadata

**File: `suprawall-webhooks/src/types.ts` or event construction**

Add to the webhook event payload:
```typescript
{
  event: "tool.require_approval",
  data: { /* existing approval data */ },
  // NEW
  branding: {
    powered_by: "Supra-wall",
    url: "https://suprawall.ai?ref=webhook",
    removable_on: "pro" // tells integrators which plan removes it
  }
}
```

This lets customers building custom approval UIs decide whether to show attribution.

#### 4. Dashboard approval page: Add attribution

**File: `dashboard/src/app/approvals/page.tsx`**

For free-tier users viewing the approval queue, add a subtle banner:

```tsx
{plan === "free" && (
  <div className="text-center py-2 text-xs text-neutral-500 border-t border-neutral-800">
    🛡️ Protected by <a href="https://suprawall.ai" className="text-emerald-400 hover:underline">Supra-wall</a>
    {" · "}
    <a href="/pricing" className="text-neutral-400 hover:text-white">Remove branding →</a>
  </div>
)}
```

### Testing
1. Trigger a REQUIRE_APPROVAL policy on a free-tier org
2. Verify Slack message includes the context footer block
3. Verify the "Remove branding →" link goes to pricing page
4. Verify paid-tier orgs get clean notifications

---

## Hack 3: Embed Widget Badge (Proven SaaS Pattern)

### Concept
The embeddable audit log widget (`packages/embed`) gets a "Secured by Supra-wall" badge overlay, similar to Intercom's chat bubble branding or Stripe's checkout badge.

### Architecture

The embed widget is an iframe loaded from `app.suprawall.io/embed/{type}`. The badge is injected by the embed script itself (outside the iframe) so the customer's CSP settings don't interfere.

### Files to Modify

#### 1. Embed script: Inject badge element

**File: `packages/embed/src/embed.ts`**

After the iframe creation, append a badge element:

```typescript
// After creating the iframe container...

// NEW: Add "Secured by" badge for free-tier
const badge = document.createElement("a");
badge.href = "https://suprawall.ai?ref=embed-widget";
badge.target = "_blank";
badge.rel = "noopener noreferrer";
badge.innerHTML = `
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
  <span>Secured by Supra-wall</span>
`;
badge.style.cssText = `
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-family: -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 11px;
  color: #6b7280;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 4px;
  transition: color 0.2s;
`;
badge.onmouseenter = () => { badge.style.color = "#10b981"; };
badge.onmouseleave = () => { badge.style.color = "#6b7280"; };

container.appendChild(badge);
```

#### 2. Server-side badge control

The embed endpoint should check the org's plan via the `apiKey` query parameter and set a data attribute:

```typescript
// In the embed iframe's server-side handler
// Pass plan info as a URL parameter
const iframeSrc = `${embedUrl}/${type}?agentId=${agentId}&apiKey=${apiKey}&theme=${theme}&branding=${showBranding}`;
```

The embed script reads `branding` from the URL and conditionally renders the badge:

```typescript
const params = new URLSearchParams(window.location.search);
const showBranding = params.get("branding") !== "false";

if (showBranding) {
  // ... inject badge
}
```

#### 3. Dashboard embed code generator

When users copy the embed snippet from the dashboard, show the branding notice:

```tsx
// In dashboard embed settings
{plan === "free" && (
  <p className="text-xs text-amber-400 mt-2">
    ⚡ Free plan includes "Secured by Supra-wall" badge.
    <Link href="/pricing" className="underline ml-1">Upgrade to remove →</Link>
  </p>
)}
```

### Testing
1. Embed the widget on a test page with a free-tier API key
2. Verify the badge appears below the iframe
3. Verify the badge links to suprawall.ai with the correct ref parameter
4. Verify a paid-tier key hides the badge

---

## Implementation Order

### Phase 1: Slack Footer (Day 1 — fastest to ship, highest decision-maker visibility)

| Step | File | Change | Time |
|------|------|--------|------|
| 1.1 | `firebase/functions/src/evaluateAction.ts` | Add `showBranding` check based on org plan | 15 min |
| 1.2 | `firebase/functions/src/evaluateAction.ts` | Add context block to Slack Block Kit payload | 30 min |
| 1.3 | `dashboard/src/app/approvals/page.tsx` | Add footer banner for free-tier | 20 min |
| 1.4 | Test with Slack webhook | Trigger REQUIRE_APPROVAL on free org | 30 min |
| 1.5 | Deploy | Firebase functions deploy | 15 min |

**Ship by: End of Day 1**

### Phase 2: SDK Output Branding (Days 2-3 — highest volume)

| Step | File | Change | Time |
|------|------|--------|------|
| 2.1 | `firebase/functions/src/evaluateAction.ts` | Add `branding` object to ALLOW response | 30 min |
| 2.2 | `suprawall-sdk/src/index.ts` | Add `appendBranding()` helper | 20 min |
| 2.3 | `suprawall-sdk/src/index.ts` | Wire into `withSupraWall()` | 30 min |
| 2.4 | `suprawall-sdk/src/index.ts` | Wire into `wrapVercelTools()` | 20 min |
| 2.5 | `suprawall-sdk/src/index.ts` | Wire into `createSupraWallMiddleware()` | 20 min |
| 2.6 | `suprawall-sdk/src/index.ts` | Wire into `wrapOpenClaw()` | 15 min |
| 2.7 | `suprawall-sdk/src/index.ts` | Update `internalEvaluate` return type & parsing | 15 min |
| 2.8 | `suprawall-python/suprawall/gate.py` | Add `_append_branding()` method | 30 min |
| 2.9 | `suprawall-python/suprawall/gate.py` | Wire into `_secured_method()` and all wrappers | 45 min |
| 2.10 | Integration test | Test with LangChain, Vercel AI, raw MCP | 2 hrs |
| 2.11 | Publish SDK | `npm publish` + `pip publish` | 30 min |

**Ship by: End of Day 3**

### Phase 3: Embed Badge (Day 3-4 — quickest to build)

| Step | File | Change | Time |
|------|------|--------|------|
| 3.1 | `packages/embed/src/embed.ts` | Add badge HTML/CSS injection | 30 min |
| 3.2 | `packages/embed/src/embed.ts` | Add plan-based show/hide logic | 20 min |
| 3.3 | Dashboard embed settings | Add upgrade notice for free tier | 15 min |
| 3.4 | Test on sample page | Verify badge renders and links work | 30 min |
| 3.5 | Deploy | CDN deploy for embed script | 15 min |

**Ship by: End of Day 4**

---

## Pricing Integration

Add a new feature row to the pricing comparison table:

| Feature | Free | Pro ($49/mo) | Enterprise |
|---------|------|-------------|------------|
| **Supra-wall branding** | Shown in agent outputs, Slack, embeds | ✅ Removed | ✅ Removed |
| Agent output attribution | Always shown | Hidden | Hidden |
| Slack/email footer | "Protected by Supra-wall" | Clean | Clean + custom branding |
| Embed widget badge | "Secured by Supra-wall" | Hidden | Hidden + white-label |

**File: `dashboard/src/app/pricing/page.tsx`** — add a row to the comparison table.

---

## UTM Tracking & Attribution Analytics

Every branded link uses a `ref` parameter for source tracking:

| Source | URL | Expected Traffic |
|--------|-----|-----------------|
| Agent output | `suprawall.ai?ref=agent-output` | Highest volume |
| Slack approval | `suprawall.ai?ref=slack-approval` | Decision-makers |
| Email approval | `suprawall.ai?ref=email-approval` | Decision-makers |
| Embed badge | `suprawall.ai?ref=embed-widget` | End-users |
| Webhook payload | `suprawall.ai?ref=webhook` | Developers |

Track these in Google Analytics 4 (already integrated) to measure which channel drives the most signups.

**File: `dashboard/src/app/page.tsx` (homepage)** — ensure GA4 captures the `ref` parameter as a custom dimension.

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Users hate the branding | Keep it minimal (one line, no pop-ups). Test with 3 beta users before public launch. |
| LLMs strip the attribution | Use a format the LLM treats as structured data, not decoration. The `---\n` separator signals "this is metadata." |
| Branding breaks tool parsing | For object responses, use `_attribution` prefix (underscore = metadata convention). Never modify the tool's actual return schema. |
| Free users churn | Track churn vs branding-driven signups. If net negative, soften to first-10-calls-only. |
| Competitors copy it | First-mover advantage. By the time they copy, you've already captured the keyword association "Supra-wall = AI agent security." |

---

## Success Metrics

Track weekly starting from launch:

| Metric | Target (Month 1) | Target (Month 3) |
|--------|------------------|------------------|
| `ref=agent-output` homepage visits | 500/mo | 5,000/mo |
| `ref=slack-approval` homepage visits | 100/mo | 500/mo |
| `ref=embed-widget` homepage visits | 50/mo | 200/mo |
| Free → Pro upgrades mentioning "remove branding" | 5 | 25 |
| Total branded impressions (tool calls on free tier) | 10K/mo | 100K/mo |

---

## Summary

Three growth hacks. Four days of work. Zero new infrastructure. Every free-tier agent becomes a billboard, every Slack approval becomes a pitch, and every embedded widget becomes a lead gen form. The upgrade path is built into the annoyance — pay to remove it, just like every SaaS PLG motion that works.
