# SupraWall MCP Testing Checklist

Complete this checklist before submitting to any registry to ensure everything works correctly.

---

## Local MCP Server Testing

### Prerequisites
- [ ] Node.js installed (v18+)
- [ ] npm or yarn available
- [ ] Claude Desktop installed
- [ ] Terminal/Command line access

### Step 1: Install & Start Local Server

```bash
# Clone repository (or use local version)
cd suprawall-mcp-plugin

# Install dependencies
npm install

# Start the server
npm run dev
# Or: node src/server.ts
# Or: suprawall-mcp (if installed globally)

# Expected output:
# [SupraWall MCP] Server started
# [SupraWall MCP] Listening on stdin/stdout
```

### Step 2: Configure Claude Desktop

1. Open Claude Desktop settings
2. Navigate to Developer → Edit Config
3. Add SupraWall to mcpServers:

```json
{
  "mcpServers": {
    "suprawall": {
      "command": "node /path/to/suprawall-mcp/src/server.ts"
    }
  }
}
```

4. Save and restart Claude

### Step 3: Verify Tools Available

In Claude:
```
User: "What tools do you have available now?"

Claude should respond with:
- check_policy: Verify action compliance with policies
- request_approval: Request human approval for sensitive actions
```

**If tools don't appear:**
- [ ] Restart Claude
- [ ] Check stderr output from server
- [ ] Verify JSON syntax in tools array
- [ ] Check tool names don't have invalid characters

### Step 4: Test check_policy Tool

**Test Case 1: Simple policy check**
```
User: Check if this action is compliant: "send internal email"
Claude should call: check_policy(action: "send internal email")
SupraWall should respond: Compliant or needs review
```

**Test Case 2: Sensitive data**
```
User: Check healthcare data sharing compliance
Claude should call: check_policy(action: "share patient records", severity: "high")
SupraWall should respond: Policy violation requires approval
```

**Test Case 3: Error handling**
```
User: Check with missing required field
Claude should handle gracefully
SupraWall should return error message
```

### Step 5: Test request_approval Tool

**Test Case 1: Simple approval request**
```
User: "This needs approval before proceeding"
Claude should call: request_approval(action: "transfer funds", reason: "large amount")
SupraWall should respond: Approval request created
```

**Test Case 2: High urgency**
```
User: "Request urgent approval"
Claude should call: request_approval(action: "...", urgency: "high")
SupraWall should respond: Escalated to priority queue
```

**Test Case 3: Missing reason**
```
Claude should call with reason (required field)
SupraWall should accept and process
```

### Step 6: Performance Testing

```
Measure response time for each tool:

check_policy:
- Expected: < 100ms
- Test: Time 10 calls, calculate average
- Status: ✓ Pass / ✗ Fail

request_approval:
- Expected: < 500ms
- Test: Time 10 calls, calculate average
- Status: ✓ Pass / ✗ Fail
```

### Step 7: Error Scenarios

Test each error case:

```
[ ] Invalid action parameter (empty string)
[ ] Missing required fields
[ ] Invalid JSON in input
[ ] Timeout simulation
[ ] Network error handling
[ ] Large input payloads
[ ] Special characters in action names
[ ] Concurrent requests
```

### Step 8: Documentation Verification

```
[ ] README.md has clear installation instructions
[ ] Examples are working and realistic
[ ] Tool descriptions match actual behavior
[ ] Error messages are helpful
[ ] All links (docs, privacy, support) work
[ ] Configuration examples are copy-paste ready
```

---

## Remote MCP Server Testing

### Prerequisites
- [ ] API key obtained (agc_test_*)
- [ ] Endpoint: https://www.supra-wall.com/api/mcp
- [ ] curl or Postman installed
- [ ] Network access to endpoint

### Step 1: Test Endpoint Connectivity

```bash
# Test basic connectivity
curl -v https://www.supra-wall.com/api/mcp

# Should return:
# - HTTP 405 Method Not Allowed (GET without SSE header)
# - Server header showing Vercel/Cloudflare
# - CORS headers present

# Test with correct headers
curl -H "Accept: text/event-stream" \
     https://www.supra-wall.com/api/mcp

# Should initiate SSE stream (will wait for connection)
# Press Ctrl+C to exit
```

### Step 2: Test Authentication

```bash
# Test with API key
curl -H "Authorization: Bearer agc_test_demo_suprawall_2026" \
     -H "Accept: text/event-stream" \
     https://www.supra-wall.com/api/mcp

# Should:
# - Accept the key
# - Initiate SSE stream
# - Not return 401/403 errors
```

### Step 3: Configure for Claude

1. Add to Claude configuration:

```json
{
  "mcpServers": {
    "suprawall-cloud": {
      "command": "node",
      "args": ["suprawall-client.js"],
      "env": {
        "SUPRAWALL_API_KEY": "swc_test_demo_suprawall_2026",
        "SUPRAWALL_ENDPOINT": "https://www.supra-wall.com/api/mcp"
      }
    }
  }
}
```

2. Restart Claude
3. Verify tools appear

### Step 4: Test Tools via Claude

**Test check_policy:**
```
User: "Check if we can send customer data"
Claude should successfully call check_policy
SupraWall should respond with compliance status
```

**Test request_approval:**
```
User: "Request approval for large transaction"
Claude should successfully call request_approval
SupraWall should confirm task created
```

### Step 5: Performance Testing (Remote)

```
Measure latency including network:

check_policy:
- Expected: < 500ms (remote)
- Test: 10 calls, calculate average
- Status: ✓ Pass / ✗ Fail

request_approval:
- Expected: < 1000ms (remote)
- Test: 10 calls, calculate average
- Status: ✓ Pass / ✗ Fail
```

### Step 6: Reliability Testing

```
[ ] Test with invalid API key (should reject)
[ ] Test with missing API key (should reject)
[ ] Test with expired API key (if supported)
[ ] Test network timeout handling
[ ] Test concurrent requests (5+ simultaneous)
[ ] Test after 24 hours of operation
[ ] Test with various network conditions
```

### Step 7: SSE Stream Validation

```bash
# Test SSE stream properly formatted
curl -H "Authorization: Bearer agc_test_demo_suprawall_2026" \
     -H "Accept: text/event-stream" \
     https://www.supra-wall.com/api/mcp | head -20

# Should show:
# - event: type
# - data: {json payload}
# - Proper line endings
# - No validation errors
```

---

## Integration Testing

### Claude Desktop Integration

```
[ ] Tools appear in sidebar
[ ] Tool descriptions readable
[ ] Input suggestions work
[ ] Error messages helpful
[ ] Tools work in conversation flow
[ ] Can chain multiple tool calls
[ ] Tool results display properly
```

### Multi-Tool Workflows

**Test Workflow 1: Check then Approve**
```
User: "Is sending patient data compliant? If not, request approval."

Expected flow:
1. Claude calls check_policy(action: "send patient data")
2. SupraWall returns: "Policy violation"
3. Claude calls request_approval(action: "...", reason: "required by policy")
4. SupraWall returns: "Approval request created"
5. Conversation flows naturally
```

**Test Workflow 2: Conditional Logic**
```
User: "Check 3 different actions for compliance"

Expected flow:
1. check_policy(action: "action1")
2. check_policy(action: "action2")
3. check_policy(action: "action3")
4. Claude summarizes results
5. All respond correctly
```

---

## Security Testing

### Authentication Security
```
[ ] API key not logged in console
[ ] API key not visible in debug output
[ ] HTTPS enforced (no HTTP fallback)
[ ] TLS certificate valid
[ ] No certificate warnings
```

### Input Validation
```
[ ] SQL injection attempts rejected
[ ] Script injection in action field handled
[ ] Oversized payloads rejected gracefully
[ ] Null/undefined inputs handled
[ ] Special characters processed correctly
```

### Data Privacy
```
[ ] No data logged to disk
[ ] No data sent to third parties
[ ] No personal data in error messages
[ ] Audit logs secure
[ ] Encryption in transit verified
```

---

## Documentation Testing

### README Validation
```
[ ] Installation instructions work exactly as written
[ ] Code examples are copy-paste ready
[ ] All links are functional
[ ] Tool descriptions are accurate
[ ] Examples produce expected output
[ ] Configuration samples are correct
```

### Example Validation

Run each example from documentation:

```
[ ] Example 1: Basic policy check
    - Command: check_policy(action: "send email")
    - Expected: Compliance decision
    - Actual: ✓ Matches / ✗ Different

[ ] Example 2: Approval request
    - Command: request_approval(...)
    - Expected: Task created
    - Actual: ✓ Matches / ✗ Different

[ ] Example 3: Real-world healthcare scenario
    - Command: Full workflow
    - Expected: Proper compliance routing
    - Actual: ✓ Matches / ✗ Different
```

---

## Final Verification Checklist

Before submitting to any registry:

### Code Quality
- [ ] No console errors
- [ ] No unhandled exceptions
- [ ] Proper error messages
- [ ] Code follows best practices
- [ ] Dependencies are up to date
- [ ] No security vulnerabilities

### Functionality
- [ ] All tools work correctly
- [ ] Both local and remote versions tested
- [ ] Edge cases handled
- [ ] Performance acceptable
- [ ] No memory leaks
- [ ] Graceful degradation

### Documentation
- [ ] README complete and accurate
- [ ] Examples tested and working
- [ ] API documented
- [ ] Troubleshooting included
- [ ] Support contact provided
- [ ] Privacy policy linked

### Compliance
- [ ] Privacy policy accessible
- [ ] Terms of service available
- [ ] No hardcoded credentials
- [ ] No PII in logs
- [ ] GDPR compliant
- [ ] Responsible disclosure policy

### Package Quality
- [ ] server.json validates
- [ ] .mcpb file created successfully
- [ ] All required files included
- [ ] Repository public and clean
- [ ] LICENSE file present
- [ ] No sensitive files exposed

---

## Test Results Template

```markdown
# SupraWall MCP Testing Results
Date: [DATE]
Tester: [NAME]
Version: 1.0.0

## Local Server
- Installation: ✓ Pass / ✗ Fail
- Tool Discovery: ✓ Pass / ✗ Fail
- check_policy: ✓ Pass / ✗ Fail
- request_approval: ✓ Pass / ✗ Fail
- Performance: ✓ Pass / ✗ Fail
- Error Handling: ✓ Pass / ✗ Fail

## Remote Server
- Connectivity: ✓ Pass / ✗ Fail
- Authentication: ✓ Pass / ✗ Fail
- Tool Availability: ✓ Pass / ✗ Fail
- Performance: ✓ Pass / ✗ Fail
- Reliability: ✓ Pass / ✗ Fail

## Integration
- Claude Desktop: ✓ Pass / ✗ Fail
- Documentation: ✓ Pass / ✗ Fail
- Examples: ✓ Pass / ✗ Fail

## Overall Status: ✓ READY FOR SUBMISSION / ✗ ISSUES FOUND

Issues Found:
[List any failures]

Next Steps:
[What to do before submission]
```

---

## Need Help?

**Documentation:** https://www.supra-wall.com/docs
**Support Email:** support@wiserautomation.agency
**GitHub Issues:** https://github.com/wiserautomation/suprawall-mcp/issues

