# SupraWall MCP Registry Submission Guide

This document provides step-by-step instructions for submitting SupraWall to various MCP registries and Anthropic's Claude Directory.

---

## Phase 1: Pre-Submission Checklist

### Documentation
- [x] Comprehensive README with overview and installation instructions
- [x] 3+ usage examples covering different use cases
- [x] Tool documentation with clear input/output schemas
- [x] Privacy policy documented and linked
- [x] Security considerations documented
- [x] Compliance capabilities listed

### Code & Configuration
- [x] server.json file for local MCP server (stdio)
- [x] server-remote.json for remote HTTP/SSE endpoint
- [x] Tool safety annotations (readOnlyHint for both tools)
- [x] Environment variables documented
- [x] Authentication methods clearly specified
- [x] All dependencies listed in package.json

### Testing
- [ ] Test local MCP server with Claude Desktop
- [ ] Test remote endpoint with valid API key
- [ ] Verify all tools work with Claude
- [ ] Test with various input scenarios
- [ ] Validate error handling
- [ ] Check performance/latency

### Compliance
- [x] Privacy policy at https://www.supra-wall.com/privacy
- [x] Terms of service available
- [x] Support email configured
- [x] Responsible disclosure policy established
- [ ] GDPR/Data handling documented
- [ ] No hardcoded credentials in code

---

## Phase 2: Official MCP Registry Submission

**Registry:** https://registry.modelcontextprotocol.io/
**Timeline:** 1-2 weeks for review
**Requirements:** GitHub account, domain ownership

### Step 1: Prepare GitHub Repository

```bash
# Create public GitHub repository
# Repository name: suprawall-mcp
# URL: https://github.com/wiserautomation/suprawall-mcp

# Required files in repository:
# - server.json (in root)
# - README.md (with full documentation)
# - LICENSE (MIT)
# - package.json (with dependencies)
# - src/ (source code)
```

### Step 2: Validate server.json

```bash
# Install MCP registry CLI
npm install -g @modelcontextprotocol/registry-cli

# Validate your server.json
mcp-publisher validate --config server.json

# Expected output: ✓ server.json is valid
```

### Step 3: Authenticate with GitHub

```bash
# Login to MCP Registry
mcp-publisher login github

# This will prompt you with:
# Device code flow authorization
# Visit: https://github.com/login/device
# Paste code when prompted
```

### Step 4: Test Dry Run

```bash
# Test publication without submitting
mcp-publisher publish --dry-run --config server.json

# Check output for any warnings or errors
# If successful: "Dry run completed successfully"
```

### Step 5: Publish to Official Registry

```bash
# Submit to official registry
mcp-publisher publish --config server.json

# Expected output:
# ✓ Published: io.github.wiserautomation/suprawall-mcp@1.0.0
# URL: https://registry.modelcontextprotocol.io/server/io.github.wiserautomation/suprawall-mcp

# Note: Versions are immutable - test thoroughly before publishing!
```

### Step 6: Verify Publication

```bash
# Check that your server appears in registry
curl https://registry.modelcontextprotocol.io/api/servers/io.github.wiserautomation/suprawall-mcp

# Should return your server.json with metadata
```

---

## Phase 3: Claude Directory Submission (Local Server)

**URL:** https://forms.gle/tyiAZvch1kDADKoP9
**Timeline:** 2-4 weeks for review
**Contact:** partnerships@anthropic.com

### Step 1: Package for Claude Desktop

```bash
# Install mcpb packaging tool
npm install -g @modelcontextprotocol/mcpb

# Create manifest.json
cat > manifest.json << 'EOF'
{
  "manifest_version": "1",
  "name": "suprawall-mcp",
  "display_name": "SupraWall - EU AI Act Compliance",
  "version": "1.0.0",
  "description": "EU AI Act compliance middleware for Claude with human oversight routing",
  "author": "Wiser Automation",
  "author_email": "support@wiserautomation.agency",
  "repository": "https://github.com/wiserautomation/suprawall-mcp",
  "documentation_url": "https://www.supra-wall.com/docs",
  "icon_url": "https://www.supra-wall.com/icon.png",
  "privacy_policy_url": "https://www.supra-wall.com/privacy",
  "license": "MIT"
}
EOF

# Package into .mcpb bundle
mcpb pack --manifest manifest.json --output suprawall-mcp.mcpb

# Verify bundle
unzip -l suprawall-mcp.mcpb
```

### Step 2: Prepare Submission Materials

Create a submission document with:

```markdown
# SupraWall Local MCP Server - Claude Directory Submission

## Overview
[Copy from MCP_SUBMISSION_README.md]

## Installation
npm install suprawall-mcp
suprawall-mcp

## Configuration
Claude Desktop: Copy suprawall-mcp command into claude_desktop_config.json

## Tools
- check_policy: Evaluate AI action compliance
- request_approval: Route sensitive actions to humans

## Security Annotations
- check_policy: readOnlyHint: true
- request_approval: readOnlyHint: true

## Test Credentials
N/A - No external service required for local testing

## Support
support@wiserautomation.agency
https://www.supra-wall.com/docs

## Privacy & Compliance
Privacy Policy: https://www.supra-wall.com/privacy
GDPR, HIPAA, SOC 2 compliant
All data processing logged to local system only
```

### Step 3: Submit Form

Visit: https://forms.gle/tyiAZvch1kDADKoP9

**Form Fields:**
- Server Name: SupraWall - EU AI Act Compliance
- Display Name: SupraWall MCP (Local)
- Description: [From MCP_SUBMISSION_README.md]
- Repository URL: https://github.com/wiserautomation/suprawall-mcp
- Documentation URL: https://www.supra-wall.com/docs
- .mcpb file: Upload suprawall-mcp.mcpb
- Supporting Materials: [Your submission document]

### Step 4: Anthropic Review
- Review period: 2-4 weeks
- You'll receive email updates on status
- May ask clarifying questions
- Once approved: Listed in Claude Directory

---

## Phase 4: Claude Directory Submission (Remote Server)

**URL:** https://docs.google.com/forms/d/e/1FAIpQLSeafJF2NDI7oYx1r8o0ycivCSVLNq92Mpc1FPxMKSw1CzDkqA/viewform
**Timeline:** 2-4 weeks for review
**Special Requirements:** OAuth 2.0 or verified API key support

### Important Note: OAuth 2.0 vs API Keys

SupraWall currently uses API key authentication (ag_* format). For remote server submission, you have options:

**Option A: API Key Approach (Current)**
- Document that API keys must be configured by users
- Users set SUPRAWALL_API_KEY environment variable
- This is acceptable for Claude Directory

**Option B: OAuth 2.0 Wrapper (Recommended)**
- Build OAuth 2.0 wrapper around API key system
- Users authenticate via Claude's OAuth flow
- More seamless user experience
- Requires additional implementation

### For API Key Approach:

### Step 1: Prepare Test Access

```
Create test account with:
- Test API key: agc_test_demo_suprawall_2026
- Sample policies configured
- Test approval workflow enabled
- At least 24 hours of test data available
```

### Step 2: Create Submission Materials

```markdown
# SupraWall Remote MCP - Claude Directory Submission

## Endpoint
https://www.supra-wall.com/api/mcp

## Transport
HTTP with Server-Sent Events (SSE)

## Authentication
API Key (ag_* for single-tenant, agc_* for multi-tenant)
Users configure via: SUPRAWALL_API_KEY environment variable

## Tools
- check_policy: Compliance evaluation (readOnlyHint: true)
- request_approval: Approval routing (readOnlyHint: true)

## Safety Annotations
Both tools marked readOnlyHint: true
No destructive operations - informational and workflow only

## Test Credentials
API Key: agc_test_demo_suprawall_2026
Endpoint: https://www.supra-wall.com/api/mcp
Test scenarios available in documentation

## Privacy & Data Handling
- No data permanently stored beyond compliance period
- GDPR compliant with EU data residency
- Audit logs encrypted and tamper-evident
- User organization has data ownership
- HIPAA compliant for healthcare data

## Support & Documentation
Email: support@wiserautomation.agency
Docs: https://www.supra-wall.com/docs
Privacy: https://www.supra-wall.com/privacy

## Uptime & Reliability
- 99.9% SLA
- Global CDN via Vercel
- Automatic failover
- Real-time monitoring
```

### Step 3: Submit Remote Server Form

Visit: https://docs.google.com/forms/d/e/1FAIpQLSeafJF2NDI7oYx1r8o0ycivCSVLNq92Mpc1FPxMKSw1CzDkqA/viewform

**Form Fields:**
- Server Name: SupraWall Cloud - Compliance
- Type: Remote MCP (HTTP/SSE)
- Endpoint URL: https://www.supra-wall.com/api/mcp
- Authentication Method: API Key
- Test Endpoint: https://www.supra-wall.com/api/mcp
- Test API Key: agc_test_demo_suprawall_2026
- Description: [From materials above]
- Documentation: https://www.supra-wall.com/docs
- Privacy Policy: https://www.supra-wall.com/privacy
- Support Email: support@wiserautomation.agency

---

## Phase 5: Smithery Registry Submission (Optional)

**URL:** https://smithery.ai/
**Timeline:** Immediate to 24 hours
**Friction:** Low, but community-driven

### Step 1: Get Smithery API Key

1. Visit https://smithery.ai
2. Sign up for account
3. Go to Account → API Keys
4. Generate new API key
5. Copy key value

### Step 2: Submit via CLI

```bash
# Install Smithery CLI
npm install -g @smithery/cli

# Authenticate
smithery auth login --api-key YOUR_API_KEY

# Submit local server
smithery mcp publish suprawall-mcp \
  --name "io.smithery/suprawall-mcp" \
  --description "EU AI Act compliance middleware for Claude" \
  --repository https://github.com/wiserautomation/suprawall-mcp \
  --documentation https://www.supra-wall.com/docs

# Submit remote server
smithery mcp publish suprawall-cloud \
  --name "io.smithery/suprawall-cloud" \
  --type remote \
  --endpoint https://www.supra-wall.com/api/mcp \
  --description "Cloud-hosted EU AI Act compliance" \
  --documentation https://www.supra-wall.com/docs
```

### Step 3: Verify

Visit https://smithery.ai and search for "suprawall"
Both servers should be discoverable immediately

---

## Phase 6: Post-Submission Follow-Up

### Timing
1. **Day 1:** Official Registry - Verify publication
2. **Day 7:** Claude Directory - Check form submission status
3. **Week 2:** Follow up with Anthropic if no response
4. **Week 4:** Expect approval/feedback

### After Approval
- [ ] Update README with "Listed on Claude Directory" badge
- [ ] Add to company website
- [ ] Update GitHub releases
- [ ] Announce to users
- [ ] Monitor feedback and ratings

### Ongoing Maintenance
- Monitor for issues reported on GitHub
- Respond to support emails within 24 hours
- Keep documentation updated
- Publish security updates immediately
- Maintain >99.5% API uptime

---

## Troubleshooting

### Issue: server.json validation fails

**Solution:**
```bash
# Check syntax
jq . server.json

# Validate against schema
mcp-publisher validate --config server.json

# Check for required fields:
# - name, version, description
# - packages array with transport details
# - publisher-provided metadata
```

### Issue: OAuth callback URLs rejected

**Solution:**
```
Add these exact OAuth callback URLs:
- http://localhost:6274/oauth/callback
- https://claude.ai/api/mcp/auth_callback
- https://claude.com/api/mcp/auth_callback

Note: Currently using API key auth (no OAuth needed)
```

### Issue: Tools not appearing in Claude

**Solution:**
1. Restart Claude Desktop
2. Check tools array in server.json
3. Verify tool names don't have special characters
4. Check inputSchema is valid JSON Schema
5. Test with: check_policy(action: "test")

### Issue: Remote endpoint returns 401

**Solution:**
```bash
# Check API key format
echo "Key should start with: ag_ or agc_"

# Verify environment variable
echo $SUPRAWALL_API_KEY

# Test endpoint directly
curl -H "Authorization: Bearer ag_your_key_here" \
  https://www.supra-wall.com/api/mcp
```

---

## Summary Checklist

### Before Submission
- [ ] All documentation complete and tested
- [ ] server.json files validated
- [ ] Tools work with Claude Desktop
- [ ] Test credentials ready
- [ ] Privacy policy published
- [ ] GitHub repository public

### Official Registry (mcp.so)
- [ ] GitHub account ready
- [ ] mcp-publisher CLI installed
- [ ] Authenticate with GitHub
- [ ] Dry run successful
- [ ] Publish command executed
- [ ] Verified in registry

### Claude Directory (Local)
- [ ] .mcpb file created with mcpb
- [ ] Submission form filled out
- [ ] Support email configured
- [ ] Awaiting approval notification

### Claude Directory (Remote)
- [ ] Test endpoint configured
- [ ] Test API key created
- [ ] Submission form filled out
- [ ] OAuth URLs added (if applicable)
- [ ] Awaiting approval notification

### Smithery (Optional)
- [ ] Smithery account created
- [ ] API key obtained
- [ ] CLI submissions executed
- [ ] Verified on smithery.ai

---

## Support Contacts

**Anthropic Partnerships:** partnerships@anthropic.com
**SupraWall Support:** support@wiserautomation.agency
**Security Issues:** security@wiserautomation.agency
**MCP Registry Docs:** https://modelcontextprotocol.io/

