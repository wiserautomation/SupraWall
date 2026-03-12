# Supra-wall: EU AI Act Compliance Features — Development Prompt

Use this prompt with your AI coding assistant (Claude Code, Cursor, Copilot, etc.) to build both features.

---

## Context: Existing Codebase

**Stack:**
- Backend: Express.js + TypeScript (`/agentgate-server/src/`)
- Frontend: Next.js App Router (`/dashboard/src/app/`)
- Database: PostgreSQL via `pg` Pool
- Existing pages: `/dashboard`, `/dashboard/audit`, `/dashboard/policies`, `/dashboard/approvals`, `/dashboard/monitoring`, `/dashboard/settings`, `/dashboard/team`

**Existing DB Schema (already live):**
```sql
-- Policies table
CREATE TABLE policies (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(255) NOT NULL,
    tool_name VARCHAR(255) NOT NULL,
    condition TEXT NOT NULL,
    rule_type VARCHAR(50) NOT NULL,  -- 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit logs table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    agent_id VARCHAR(255) NOT NULL,
    tool_name VARCHAR(255) NOT NULL,
    arguments JSONB NOT NULL,
    decision VARCHAR(50) NOT NULL,   -- 'ALLOW' | 'DENY' | 'REQUIRE_APPROVAL'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Policy engine** (`/agentgate-server/src/policy.ts`): evaluates tool calls against policies. On every evaluation it writes a row to `audit_logs` with agentId, toolName, arguments, and decision. Fails closed (defaults to DENY on error).

---

## Feature 1: Compliance Report Export (PDF)

### What it is
A downloadable PDF report titled **"Human Oversight Evidence Report"** that an enterprise can give directly to an EU AI Act auditor. It proves the organization has human oversight, audit trails, and policy controls on their AI agents.

### Backend — New API endpoint

**File:** `/agentgate-server/src/routes/compliance.ts`

Create a new Express route:
```
GET /v1/compliance/report?agentId=<id>&from=<ISO date>&to=<ISO date>
```

**What it does:**
1. Accepts query params: `agentId` (optional, if omitted report covers all agents), `from` and `to` (ISO date strings for the reporting period, default last 30 days)
2. Queries the DB for:
   - All `audit_logs` rows in the time range (filtered by agentId if provided)
   - All `policies` rows for the agent(s)
   - Summary stats: total tool calls, count by decision type (ALLOW/DENY/REQUIRE_APPROVAL), unique tools called, unique agents
3. Generates a PDF using the `pdfkit` npm package
4. Returns the PDF as a binary response with headers:
   ```
   Content-Type: application/pdf
   Content-Disposition: attachment; filename="supra-wall-compliance-report-<YYYY-MM-DD>.pdf"
   ```

**PDF structure — build exactly this layout:**

```
Page 1: Cover Page
─────────────────────────────────────────
[Supra-wall Logo placeholder]

HUMAN OVERSIGHT EVIDENCE REPORT
EU AI Act Compliance Documentation

Organization: [org name from env or "Your Organization"]
Report Period: [from date] to [to date]
Generated: [current timestamp]
Report ID: [UUID]

This report documents human oversight mechanisms,
policy controls, and audit trails maintained for AI
agent operations, as required under EU AI Act
Article 14 (Human Oversight) and Article 12
(Record-keeping).
─────────────────────────────────────────

Page 2: Compliance Summary
─────────────────────────────────────────
SECTION 1: COMPLIANCE CONTROLS ACTIVE

[Checklist format — ✓ mark each item]

✓ Audit Logging (Art. 12)
  All AI agent tool calls are recorded with timestamps,
  agent identity, tool name, arguments, and decision.

✓ Human Oversight Mechanisms (Art. 14)
  REQUIRE_APPROVAL policies enforce human review before
  sensitive tool executions. Humans can intervene at any
  point in agent operation.

✓ Risk Management Controls (Art. 9)
  DENY policies block dangerous or unauthorized tool
  calls before execution. Policy rules are version-
  controlled and auditable.

✓ Data Governance (Art. 10)
  Tool call arguments are logged with full fidelity.
  Self-hosting option ensures data residency compliance.

SECTION 2: ACTIVITY SUMMARY

Reporting Period:    [from] → [to]
Total Tool Calls:    [count]
Allowed:             [count] ([%])
Blocked (DENY):      [count] ([%])
Pending Approval:    [count] ([%])
Agents Monitored:    [count]
Unique Tools Called: [count]
─────────────────────────────────────────

Page 3: Policy Register
─────────────────────────────────────────
SECTION 3: ACTIVE POLICY REGISTER

[Table with columns:]
Policy ID | Agent | Tool Pattern | Rule Type | Created Date

[One row per policy from DB]

Note: DENY rules prevent execution. REQUIRE_APPROVAL
rules pause execution until a human approves.
─────────────────────────────────────────

Page 4+: Audit Log (paginated, 30 rows per page)
─────────────────────────────────────────
SECTION 4: DETAILED AUDIT LOG

[Table with columns:]
Timestamp | Agent ID | Tool Called | Decision | Arguments (truncated to 80 chars)

[Paginate — "Page X of Y" footer]

Signed: This report was generated automatically by
Supra-wall. Records are stored in tamper-evident
append-only logs.
─────────────────────────────────────────
```

**Install dependency:**
```bash
cd agentgate-server && npm install pdfkit @types/pdfkit
```

**Register the route in** `/agentgate-server/src/index.ts`:
```typescript
import complianceRouter from "./routes/compliance";
app.use("/v1/compliance", complianceRouter);
```

---

### Frontend — Export Button in Audit Page

**File:** `/dashboard/src/app/dashboard/audit/page.tsx` (modify existing)

Add a button at the top right of the audit log page:

```
[Export Compliance Report  ↓]
```

On click, open a modal with:
- Date range picker: "From" and "To" (default: last 30 days)
- Agent selector: dropdown of agent IDs (or "All Agents")
- A "Download PDF" button that calls `GET /v1/compliance/report` with the selected params and triggers browser download

Use the existing UI component patterns already in the dashboard for consistency.

---

## Feature 2: EU AI Act Compliance Checklist Page

### What it is
A new dashboard page at `/dashboard/compliance` that shows enterprise buyers — at a glance — that Supra-wall is actively meeting EU AI Act requirements. This is the page a CTO shows their compliance team or a CISO uses to confirm readiness before a vendor review.

### Frontend — New Page

**File:** `/dashboard/src/app/dashboard/compliance/page.tsx` (create new)

**Page title:** "EU AI Act Compliance Status"

**Layout:** Three sections.

---

**Section 1: Compliance Status Header**

```
EU AI Act Compliance Status
Last checked: [live timestamp]

Overall Status: [COMPLIANT] — green badge if all checks pass
                [ATTENTION NEEDED] — yellow badge if any check is partial
                [NOT CONFIGURED] — red badge if critical checks fail
```

---

**Section 2: Requirement Checklist**

A card for each EU AI Act requirement. Each card has:
- Article reference (e.g., "Article 14")
- Requirement name
- Status badge: ✅ Active / ⚠️ Partial / ❌ Not Configured
- A one-line description of what Supra-wall does to meet it
- A link to the relevant dashboard page to configure it

Determine status dynamically by querying the DB:

| Card | Article | Status Logic |
|------|---------|-------------|
| Human Oversight | Art. 14 | ✅ if at least 1 REQUIRE_APPROVAL policy exists |
| Audit Logging | Art. 12 | ✅ if audit_logs table has rows |
| Risk Controls | Art. 9 | ✅ if at least 1 DENY policy exists |
| Record Keeping | Art. 11 | ✅ if audit_logs exist + timestamp range >30 days |
| Data Governance | Art. 10 | ✅ always (self-hosting note displayed) |
| Incident Logging | Art. 73 | ⚠️ Partial — show "DENY decisions logged. Dedicated incident workflow coming soon." |

---

**Section 3: Quick Actions**

Three action cards at the bottom:

```
[📄 Download Compliance Report]     → triggers the PDF export (Feature 1)
[⚙️ Configure Policies]             → links to /dashboard/policies
[📋 View Full Audit Log]            → links to /dashboard/audit
```

---

### Backend — New API Endpoint for Checklist Status

**File:** `/agentgate-server/src/routes/compliance.ts` (add to same file as Feature 1)

```
GET /v1/compliance/status
```

Returns:
```json
{
  "overall": "COMPLIANT" | "ATTENTION_NEEDED" | "NOT_CONFIGURED",
  "checks": {
    "humanOversight": { "status": "pass" | "partial" | "fail", "detail": "3 REQUIRE_APPROVAL policies active" },
    "auditLogging":   { "status": "pass" | "partial" | "fail", "detail": "1,432 events logged" },
    "riskControls":   { "status": "pass" | "partial" | "fail", "detail": "5 DENY policies active" },
    "recordKeeping":  { "status": "pass" | "partial" | "fail", "detail": "Logs retained since 2025-01-01" },
    "dataGovernance": { "status": "pass", "detail": "Self-hosted deployment" },
    "incidentLogging":{ "status": "partial", "detail": "DENY events logged. Dedicated incident workflow coming soon." }
  },
  "lastChecked": "2026-03-11T10:00:00Z"
}
```

---

### Navigation — Add Compliance to Sidebar

**File:** `/dashboard/src/app/dashboard/layout.tsx` (modify existing)

Add a new sidebar link:
```
🛡️ Compliance          → /dashboard/compliance
```

Place it between "Policies" and "Settings" in the sidebar order.

---

## Acceptance Criteria

Before marking either feature done, verify:

**Feature 1 (PDF Export):**
- [ ] PDF downloads when clicking the button in the audit page
- [ ] PDF contains correct data from the DB (not hardcoded)
- [ ] Date range filter works correctly
- [ ] Agent filter works (single agent and all agents)
- [ ] PDF is readable and professional (not broken layout)
- [ ] Works with 0 audit log entries (empty state handled gracefully)

**Feature 2 (Compliance Page):**
- [ ] Page loads at `/dashboard/compliance`
- [ ] Status badges reflect actual DB state (not hardcoded)
- [ ] All 6 checklist cards render with correct status
- [ ] Links to other dashboard pages work
- [ ] "Download Compliance Report" button triggers PDF download
- [ ] Appears in sidebar navigation

---

## Implementation Order

1. Create `/agentgate-server/src/routes/compliance.ts` with both endpoints
2. Register compliance router in `index.ts`
3. Install `pdfkit`
4. Test both API endpoints with curl/Postman
5. Build the compliance checklist page (`/dashboard/compliance`)
6. Add the export modal/button to the audit page
7. Add compliance to the sidebar

**Estimated dev time:** 2–3 days solo.
