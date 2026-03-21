# SupraWall MCP Registry Submission Roadmap

## Overview

This document outlines the complete roadmap for submitting SupraWall to MCP registries and Anthropic's Claude Directory. Follow the timeline and steps below to maximize discoverability and adoption.

---

## Phase Timeline

```
├─ WEEK 1: Preparation & Testing
├─ WEEK 2: Official Registry Submission
├─ WEEK 3: Claude Directory Submission
└─ WEEK 4+: Follow-up & Optimization
```

---

## Detailed Timeline

### Week 1: Preparation & Testing (Days 1-7)

#### Day 1-2: Final Testing
```
[ ] Complete TESTING_CHECKLIST.md
[ ] Test local MCP server with Claude Desktop
[ ] Test remote endpoint with API key
[ ] Verify all examples work
[ ] Check performance metrics
[ ] Document any issues found
```

**Deliverable:** Test results document

#### Day 3-4: Documentation Review
```
[ ] Review MCP_SUBMISSION_README.md
[ ] Verify all links work (website, docs, privacy)
[ ] Check code examples syntax
[ ] Proofread for grammar/typos
[ ] Verify tool descriptions accuracy
[ ] Ensure compliance with Anthropic guidelines
```

**Deliverable:** Final README ready for submission

#### Day 5-6: Configuration Finalization
```
[ ] Verify server.json is valid JSON
[ ] Check all required fields present
[ ] Validate tool schemas
[ ] Test environment variables
[ ] Prepare test credentials
[ ] Document any API key constraints
```

**Deliverable:** server.json and server-remote.json validated

#### Day 7: Pre-Submission Review
```
[ ] Run through submission checklist
[ ] Verify GitHub repository is public
[ ] Check documentation accessibility
[ ] Confirm privacy policy published
[ ] Set up support email monitoring
[ ] Prepare submission materials
```

**Deliverable:** Ready for Phase 2

---

### Week 2: Official Registry Submission (Days 8-14)

#### Day 8-9: Official MCP Registry (mcp.so)
```
Monday/Tuesday Morning:
[ ] Create public GitHub repository
  - Name: suprawall-mcp
  - URL: https://github.com/wiserautomation/suprawall-mcp
  - README: Copy from MCP_SUBMISSION_README.md
  - Files: server.json, package.json, LICENSE (MIT)

[ ] Install MCP registry CLI
  npm install -g @modelcontextprotocol/registry-cli

[ ] Validate server.json
  mcp-publisher validate --config server.json

[ ] Authenticate with GitHub
  mcp-publisher login github
  (Follow device code flow)

[ ] Test dry run
  mcp-publisher publish --dry-run --config server.json

[ ] Publish to registry
  mcp-publisher publish --config server.json

[ ] Verify in registry
  Visit: https://registry.modelcontextprotocol.io/
  Search for: io.github.wiserautomation/suprawall-mcp
```

**Expected outcome:** Server listed in official registry within 1-24 hours

#### Day 10: Remote Endpoint Registration (Optional)
```
[ ] Publish server-remote.json to official registry
  mcp-publisher publish --config server-remote.json

[ ] Verify both versions appear in registry
```

**Expected outcome:** Both local and remote versions available

#### Day 11-12: Smithery Registry (Optional)
```
[ ] Create Smithery account at https://smithery.ai
[ ] Generate API key in account settings
[ ] Install Smithery CLI
  npm install -g @smithery/cli

[ ] Submit local server
  smithery mcp publish suprawall-mcp \
    --name "io.smithery/suprawall-mcp" \
    --repository https://github.com/wiserautomation/suprawall-mcp

[ ] Submit remote server
  smithery mcp publish suprawall-cloud \
    --type remote \
    --endpoint https://www.supra-wall.com/api/mcp

[ ] Verify on https://smithery.ai
```

**Expected outcome:** Immediate availability on Smithery

#### Day 13-14: Registry Verification
```
[ ] Verify official registry: https://registry.modelcontextprotocol.io/
[ ] Verify Smithery: https://smithery.ai/
[ ] Test installation from each registry
[ ] Document any issues
[ ] Update social media/website
```

**Deliverable:** SupraWall available on multiple registries

---

### Week 3: Claude Directory Submission (Days 15-21)

#### Day 15: Local Server Submission
```
[ ] Create .mcpb bundle
  mcpb pack --manifest manifest.json --output suprawall-mcp.mcpb

[ ] Prepare submission document
  - Overview (from README)
  - Installation instructions
  - Tool documentation
  - Security annotations
  - Privacy policy details
  - Support contact

[ ] Access submission form
  https://forms.gle/tyiAZvch1kDADKoP9

[ ] Fill out all form fields
  - Server name: SupraWall - EU AI Act Compliance
  - Display name: SupraWall MCP (Local)
  - Description: [From README]
  - Repository: https://github.com/wiserautomation/suprawall-mcp
  - Documentation: https://www.supra-wall.com/docs
  - .mcpb file: Upload suprawall-mcp.mcpb
  - Supporting materials: [Submission document]

[ ] Submit form
[ ] Note submission ID/timestamp
```

**Expected outcome:** Submission received by Anthropic

#### Day 16: Remote Server Submission
```
[ ] Prepare remote submission materials
  - Same as local but with endpoint info
  - Add test API key: agc_test_demo_suprawall_2026
  - Test endpoint: https://www.supra-wall.com/api/mcp
  - Authentication documentation

[ ] Access remote submission form
  https://docs.google.com/forms/d/e/1FAIpQLSeafJF2NDI7oYx1r8o0ycivCSVLNq92Mpc1FPxMKSw1CzDkqA/viewform

[ ] Fill out all form fields
[ ] Submit form
[ ] Note submission ID/timestamp
```

**Expected outcome:** Both local and remote submitted

#### Day 17-21: Await Review
```
Timeline:
- Day 17-18: Monitor email for acknowledgment
- Day 18-21: Available for follow-up questions

Actions:
[ ] Check email daily for Anthropic contact
[ ] Respond to any clarification requests immediately
[ ] Have additional materials ready if needed
[ ] Monitor GitHub for related discussions
[ ] Keep documentation updated
```

**Expected outcome:** Feedback from Anthropic review team

---

### Week 4+: Follow-up & Optimization (Days 22+)

#### Days 22-28: Review Period
```
Expected timeline:
- 1-2 weeks: Initial review
- If approved: Notification + listing
- If questions: You'll receive clarification requests
- If denied: Feedback on why + improvement suggestions

Actions:
[ ] Monitor email for review status
[ ] Prepare responses to potential questions
[ ] Have fixes ready if needed
[ ] Keep documentation current
```

#### Upon Approval
```
[ ] Update GitHub with approval badge
[ ] Update website with "Listed on Claude Directory"
[ ] Announce on social media
[ ] Monitor for user issues
[ ] Respond to support inquiries
[ ] Track adoption metrics
```

#### Ongoing (Post-Approval)
```
Monthly:
[ ] Monitor uptime and performance
[ ] Review user feedback
[ ] Track GitHub stars/forks
[ ] Update documentation if needed
[ ] Respond to issues within 24 hours

Quarterly:
[ ] Release updates with improvements
[ ] Publish case studies
[ ] Gather user testimonials
[ ] Plan feature enhancements

Annually:
[ ] Major version updates
[ ] Security audits
[ ] Compliance certifications
[ ] User survey
```

---

## Parallel Activities (Can Be Done Simultaneously)

While waiting for registry approvals, you can:

```
Week 1-2:
[ ] Prepare marketing materials
[ ] Create product demo videos
[ ] Write blog post about submission
[ ] Set up tracking/analytics
[ ] Monitor GitHub stars

Week 2-3:
[ ] Reach out to early users
[ ] Build case studies
[ ] Create usage examples
[ ] Prepare FAQ documentation

Week 3-4:
[ ] Plan feature roadmap
[ ] Gather user feedback
[ ] Optimize documentation
[ ] Plan next version
```

---

## Success Metrics

Track these metrics to measure success:

### Registry Metrics
```
Week 1:
[ ] Listed on official MCP registry
[ ] Listed on Smithery registry
[ ] Server appears in registry search
[ ] Installation works from registry

Week 2-4:
[ ] Submitted to Claude Directory (local & remote)
[ ] GitHub repository public with stars
[ ] Documentation accessible and complete

Week 4+:
[ ] Approved on Claude Directory
[ ] Users can install directly from Claude
[ ] Positive reviews/feedback
[ ] Growing adoption
```

### Adoption Metrics (Post-Approval)
```
- Number of installations
- GitHub stars/forks
- GitHub issues/discussions
- Support email inquiries
- User feedback/testimonials
- Integration blog posts
```

### Quality Metrics
```
- Uptime: >99.5%
- Response time: <100ms (local), <500ms (remote)
- Error rate: <0.1%
- Support response time: <24 hours
- Documentation quality: High
```

---

## Submission Checklist Summary

### Pre-Submission (Week 1)
- [ ] Complete testing checklist
- [ ] Validate server.json files
- [ ] Review and finalize documentation
- [ ] Prepare test credentials
- [ ] Set up support infrastructure

### Official Registry (Week 2, Days 8-12)
- [ ] Publish to official MCP registry
- [ ] Publish to Smithery (optional)
- [ ] Verify both locations
- [ ] Document submission details

### Claude Directory (Week 3, Days 15-16)
- [ ] Submit local server form
- [ ] Submit remote server form
- [ ] Save confirmation receipts
- [ ] Note submission timestamps

### Follow-up (Week 4+)
- [ ] Monitor for review status
- [ ] Respond to questions
- [ ] Prepare for approval
- [ ] Plan next steps

---

## Contact Information

### Anthropic
- **Partnerships:** partnerships@anthropic.com
- **Support:** support.anthropic.com
- **Claude Directory Forms:** See SUBMISSION_GUIDE.md

### SupraWall
- **Support:** support@wiserautomation.agency
- **Website:** https://www.supra-wall.com
- **Documentation:** https://www.supra-wall.com/docs
- **Privacy:** privacy@wiserautomation.agency
- **Security:** security@wiserautomation.agency

### MCP Registry
- **Official Registry:** https://registry.modelcontextprotocol.io/
- **Smithery:** https://smithery.ai/
- **MCP Docs:** https://modelcontextprotocol.io/

---

## Risk Mitigation

### Potential Issues & Solutions

**Issue: server.json validation fails**
```
Solution:
1. Check JSON syntax (use jq command)
2. Verify all required fields
3. Run mcp-publisher validate
4. Fix any errors
5. Retry submission
```

**Issue: Tools don't appear in Claude**
```
Solution:
1. Restart Claude Desktop
2. Check tool names in server.json
3. Verify inputSchema is valid
4. Check for console errors
5. Test with different input
```

**Issue: API key authentication rejected**
```
Solution:
1. Verify key format (ag_* or agc_*)
2. Check environment variable set
3. Test with curl first
4. Check Anthropic docs for any issues
5. Contact support if persists
```

**Issue: Approval delayed beyond 4 weeks**
```
Solution:
1. Send polite follow-up email
2. Include submission ID
3. Ask for estimated timeline
4. Offer to provide more info
5. Consider escalation to partnerships@anthropic.com
```

---

## Documentation Links

These files provide detailed guidance:

1. **MCP_SUBMISSION_README.md** - Complete SupraWall documentation
2. **SUBMISSION_GUIDE.md** - Step-by-step submission instructions
3. **TESTING_CHECKLIST.md** - Comprehensive testing procedures
4. **server.json** - Local MCP server configuration
5. **server-remote.json** - Remote MCP server configuration

---

## Next Steps

1. **Now (Today):** Review this roadmap
2. **Tomorrow:** Begin Week 1 testing from TESTING_CHECKLIST.md
3. **End of Week 1:** Complete all testing and documentation
4. **Week 2:** Execute official registry submissions
5. **Week 3:** Execute Claude Directory submissions
6. **Week 4+:** Monitor review status and approve

---

**Good luck with your SupraWall submissions! 🚀**

For questions: support@wiserautomation.agency

