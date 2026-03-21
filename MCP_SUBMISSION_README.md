# SupraWall MCP Server - Submission Documentation

## Overview

SupraWall is an EU AI Act compliance middleware that provides human oversight routing, tamper-evident audit logging, and policy-based risk management for Claude agents and other AI systems.

**Official Website:** https://www.supra-wall.com
**Documentation:** https://www.supra-wall.com/docs
**Privacy Policy:** https://www.supra-wall.com/privacy
**Support:** support@wiserautomation.agency

---

## Available Implementations

SupraWall is available in three integration formats:

### 1. Local MCP Server (stdio)
- **Package:** `suprawall-mcp-plugin`
- **Command:** `suprawall-mcp`
- **Transport:** stdio (JSON-RPC)
- **SDK:** @modelcontextprotocol/sdk
- **Best for:** Single-machine Claude agents, development, testing

### 2. Remote MCP Cloud Endpoint (HTTP/SSE)
- **Endpoint:** `https://www.supra-wall.com/api/mcp`
- **Transport:** HTTP with Server-Sent Events (SSE)
- **Authentication:** API Key (ag_* or agc_* format)
- **Deployment:** Vercel serverless
- **Best for:** Enterprise deployments, multi-tenant systems, cloud integration

### 3. LangChain Middleware
- **Package:** `suprawall-langchain`
- **Integration:** Drop-in middleware for LangChain agent orchestration
- **Best for:** LangChain-based applications

---

## Core Tools

### check_policy
Validates whether a proposed AI action complies with configured compliance policies.

**Safety Annotation:** `readOnlyHint: true` (informational, non-destructive)

**Input Schema:**
```json
{
  "action": "string (required)",
  "context": "object (optional)",
  "severity": "string (optional): low|medium|high|critical"
}
```

**Example Usage:**
```
User: "I need to send an email to a healthcare provider with patient data"
Claude uses: check_policy(action: "send email with PII", context: {data_type: "healthcare", sensitivity: "high"})
SupraWall responds: Policy violation - action requires human approval
Claude then: requests_approval() to escalate
```

### request_approval
Routes sensitive actions to human reviewers with audit trail and escalation options.

**Safety Annotation:** `readOnlyHint: true` (triggers workflow, non-destructive)

**Input Schema:**
```json
{
  "action": "string (required)",
  "reason": "string (required)",
  "urgency": "string (optional): low|medium|high",
  "requesterEmail": "string (optional, remote only)"
}
```

**Example Usage:**
```
Claude: "This action requires human approval"
request_approval(
  action: "Execute financial transaction for $50,000",
  reason: "Potential fraud risk detected - amount exceeds daily limit",
  urgency: "high"
)
SupraWall: Creates approval task, notifies compliance officer, logs to audit trail
```

---

## Usage Examples

### Example 1: Healthcare AI Agent with Compliance
```
Scenario: Healthcare provider using Claude for patient intake
Tool sequence:
1. Claude proposes: "Schedule patient follow-up and send appointment reminder"
2. Calls: check_policy(action: "send patient communication", context: {data: "PHI", regulation: "HIPAA"})
3. SupraWall: "Policy compliant - proceed"
4. Result: Action executes with full compliance logging
```

### Example 2: Financial Services with Approval Workflow
```
Scenario: Bank using Claude for fraud detection
Tool sequence:
1. Claude detects: "Suspicious transaction pattern - recommend account freeze"
2. Calls: request_approval(
     action: "Freeze customer account",
     reason: "Transaction pattern matches known fraud signature",
     urgency: "high"
   )
3. SupraWall: Routes to compliance team
4. Human: Reviews audit trail, approves/denies
5. Result: Action logged with full decision audit trail
```

### Example 3: Government AI with Policy Enforcement
```
Scenario: Government agency using Claude for policy compliance
Tool sequence:
1. Claude processes: "FOIA request for sensitive documents"
2. Calls: check_policy(action: "release government documents", context: {classification: "sensitive"})
3. SupraWall: "Policy violation - requires Article 14 human review"
4. Claude escalates: request_approval() with full context
5. Result: Governance officer reviews, approves if compliant with regulations
```

---

## Installation & Configuration

### Local Installation (stdio)
```bash
npm install suprawall-mcp
suprawall-mcp
```

**Claude Desktop Configuration** (in `claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "suprawall": {
      "command": "suprawall-mcp"
    }
  }
}
```

### Remote Installation (HTTP/SSE)
**API Key Required:** Obtain from https://www.supra-wall.com/dashboard

**Configuration Steps:**
1. Generate API key (ag_* format for single-tenant, agc_* for multi-tenant)
2. Configure endpoint: `https://www.supra-wall.com/api/mcp`
3. Set environment variable: `SUPRAWALL_API_KEY=your_key_here`
4. Add to Claude configuration with endpoint URL

### LangChain Integration
```python
from suprawall import SupraWallMiddleware

middleware = SupraWallMiddleware(
    api_key="ag_your_key_here",
    policies_url="https://www.supra-wall.com/api/policies"
)

agent = initialize_agent(
    tools=[...],
    llm=llm,
    middleware=middleware
)
```

---

## Security & Privacy

### Data Protection
- **GDPR Compliant:** EU-resident infrastructure for remote deployment
- **Encryption:** All data in transit encrypted with TLS 1.3
- **Audit Logging:** Tamper-evident logs with cryptographic verification
- **No Data Retention:** SupraWall does not permanently store action data beyond compliance period

### Authentication
- **API Key Authentication:** Supports ag_* (standard) and agc_* (multi-tenant) formats
- **Key Rotation:** Managed through dashboard
- **Rate Limiting:** Protection against abuse
- **IP Whitelisting:** Optional for remote deployment

### Privacy Policy
Full privacy policy available at: https://www.supra-wall.com/privacy

Key points:
- No personal data is sold or shared
- Compliance officers have access only to necessary data
- Audit trails are confidential to organization
- Data deletion options available upon request

---

## Compliance Capabilities

### EU AI Act Compliance (Article 14)
✓ Human oversight routing for high-risk actions
✓ Escalation workflows for policy violations
✓ Tamper-evident audit logging
✓ Exception handling and documentation

### HIPAA (Healthcare)
✓ PHI protection controls
✓ Access logging and audit trails
✓ Encryption and data security
✓ Compliance policy enforcement

### GDPR (Data Privacy)
✓ Data processing controls
✓ Right-to-be-forgotten workflows
✓ Consent management
✓ Privacy impact assessment support

### SOC 2 (Governance)
✓ Change management controls
✓ Access control enforcement
✓ Incident logging and response
✓ Regular audit readiness

---

## Tool Annotations (Safety)

All tools are marked with `readOnlyHint: true` because:

1. **check_policy** - Performs policy evaluation without modifying system state
2. **request_approval** - Creates workflow tasks (informational) without destructive actions

**Important:** SupraWall serves as an evaluation and routing layer. Destructive actions are always handled by the underlying application with separate `destructiveHint` annotations.

---

## Supported Clients

- ✅ Claude (via claude.ai, Claude.com, Claude Desktop)
- ✅ Claude Code (CLI)
- ✅ LangChain applications
- ✅ Vercel AI SDK projects
- ✅ Custom MCP clients
- ✅ Enterprise AI platforms

---

## Performance & Limits

| Metric | Value |
|--------|-------|
| Policy Check Latency | < 100ms |
| Approval Request Creation | < 500ms |
| Concurrent Connections (Remote) | Unlimited |
| API Rate Limit | 1000 req/min (standard tier) |
| Audit Log Retention | 7 years |
| Maximum Policy Rules | 1000 per organization |

---

## Getting Started

### For Local Deployment
1. Install: `npm install suprawall-mcp`
2. Configure Claude Desktop with command
3. Test with: `check_policy(action: "test action")`

### For Cloud Deployment
1. Create account at https://www.supra-wall.com
2. Generate API key
3. Configure endpoint and credentials
4. Deploy via Vercel or Docker
5. Test connectivity to `https://www.supra-wall.com/api/mcp`

### For Development/Testing
1. Clone repository: https://github.com/wiserautomation/suprawall-mcp
2. Install dependencies: `npm install`
3. Configure test policies
4. Run: `npm test`
5. Start server: `npm run dev`

---

## Support & Documentation

- **Full Documentation:** https://www.supra-wall.com/docs
- **GitHub Repository:** https://github.com/wiserautomation/suprawall-mcp
- **Email Support:** support@wiserautomation.agency
- **Privacy Inquiries:** privacy@wiserautomation.agency
- **Security Issues:** security@wiserautomation.agency (responsible disclosure)

---

## About Wiser Automation

Wiser Automation builds compliance infrastructure for enterprise AI systems. SupraWall is our flagship product for EU AI Act compliance, bringing human-in-the-loop governance to production AI agents.

**Company:** Wiser Automation
**Website:** https://www.wiserautomation.agency
**Founded:** 2024
**Focus:** AI Compliance & Governance

---

## Version Information

- **Current Version:** 1.0.0
- **MCP Spec Version:** 2025-03-26
- **Last Updated:** March 2026
- **Maintenance:** Active

---

## Legal

**License:** MIT
**Terms of Service:** https://www.supra-wall.com/terms
**Privacy Policy:** https://www.supra-wall.com/privacy
**Copyright:** © 2024-2026 Wiser Automation

