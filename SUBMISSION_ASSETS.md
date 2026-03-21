# SupraWall Integration Submission Assets

This document contains the links and assets required for submitting SupraWall integrations to third-party directories (e.g., LangChain, Vercel AI, Anthropic).

## 1. Legal & Compliance
- **Privacy Policy URL**: [https://www.supra-wall.com/privacy-policy](https://www.supra-wall.com/privacy-policy) (Note: The raw file `PRIVACY.md` is also located in this repository).
- **Terms of Service**: [https://www.supra-wall.com/terms](https://www.supra-wall.com/terms)
- **Data Processing Agreement (DPA)**: SupraWall provides an EU AI Act & GDPR compliant DPA. The document is strictly provided to Enterprise customers upon request. Contact `privacy@supra-wall.com` for DPA inquiries.

## 2. Branding Assets
- **Logo (SVG)**: [https://www.supra-wall.com/assets/images/logo.svg](https://www.supra-wall.com/assets/images/logo.svg)
- **Logo (PNG, High-Res)**: [https://www.supra-wall.com/assets/images/logo-highres.png](https://www.supra-wall.com/assets/images/logo-highres.png)
- **Brand Colors**: 
  - Emerald Green (Safety): `#10b981`
  - Dark/Background: `#000000`
  - Text: `#ffffff`

## 3. Test Credentials for Directory Reviewers
When submitting integrations that require API access (like LangChain or MCP tools), reviewers must test the integration.
**For Security Reviewers ONLY:**
```text
TEST_SUPRAWALL_API_KEY=sw_test_review_8f92bd3a41c
TEST_SUPRAWALL_WORKSPACE=review_workspace_alpha
```
*Note: Test credentials are rate-limited to 100 evaluations/day and mock "ALLOW" responses for all `check_policy` calls unless testing the `deny_simulation` tool.*

## 4. MCP Tool Safety Annotations
SupraWall strictly adheres to the Model Context Protocol (MCP) safety annotations.
Any tools exported by SupraWall integrations will include:
- `readOnlyHint`: Indicates if the tool merely checks policy (e.g., `check_policy = true`).
- `destructiveHint`: Indicates if the tool modifies state or requests manual approvals (e.g., `request_approval = true`).
