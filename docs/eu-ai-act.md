# SupraWall EU AI Act Compliance Guide

The EU AI Act enforcement deadline is **August 2, 2026**. Systems classified as high-risk under Annex III must have:

- A documented risk management system (Art. 9)
- Technical robustness and accuracy controls (Art. 15)
- A tamper-proof activity log (Art. 12 / Art. 13)
- Human oversight mechanisms (Art. 14)

SupraWall addresses all four with a single `pip install`.

## Which systems are in scope?

Your AI agent is in scope if it makes consequential decisions in one of these sectors:

| Annex III Category | Examples |
|---|---|
| 1 — Biometrics | Identity verification, emotion recognition |
| 2 — Critical infrastructure | Power grid, water, traffic management agents |
| 3 — Education | Automated grading, admissions filtering |
| 4 — Employment | CV screening, performance evaluation, hire/fire |
| 5 — Essential services | Credit scoring, health triage |
| 6 — Law enforcement | Risk scoring, evidence review |
| 7 — Migration & border | Visa processing, asylum case review |
| 8 — Justice & democracy | Case outcome prediction, election-related tools |

**If your agent writes to any of these systems, you are in scope.**

## One-line compliance for Annex III agents

```python
from suprawall import secure_agent
agent = secure_agent(build_agent(), template="hr-employment")
```

Each template ships pre-configured for its Annex III category. See [sector templates](../packages/core/templates/sector-templates.ts).

## What SupraWall provides per article

### Art. 9 — Risk management

Every policy rule is a documented risk control:

```json
{
  "name": "no-autonomous-hire-fire",
  "description": "Hiring or termination decisions require human sign-off under Art. 9.",
  "tool_pattern": "(?i)\\b(update_employee|terminate_contract|create_offer)\\b",
  "args_pattern": ".*",
  "action": "REQUIRE_APPROVAL"
}
```

- Policy files are version-controlled — your auditor can see exactly what controls were in force at any point in time.
- `dry_run=True` lets you test new controls without enforcement, then promote with one flag change.

### Art. 12 / Art. 13 — Logging and transparency

Every tool call decision is:

1. **Logged** to Postgres or Firestore with `tool_name`, `decision`, `agent_id`, `timestamp`
2. **RSA-signed** (audit hash) so log entries cannot be altered retroactively
3. **Exportable** as a compliance report from the dashboard

The audit log maps directly to the evidence your conformity assessment body will ask for.

### Art. 14 — Human oversight

`REQUIRE_APPROVAL` rules pause the agent and notify a human before the action executes:

```python
from suprawall import secure_agent
agent = secure_agent(
    build_agent(),
    on_approval_required=notify_compliance_team  # your callable
)
```

The agent does not resume until the approval is granted or rejected. Both outcomes are logged.

## Conformity assessment paths

| Risk level | Path | SupraWall role |
|---|---|---|
| **Critical** (Cat. 1, 2, 5, 6) | Third-party assessment | Provides signed audit log as technical evidence |
| **High** (Cat. 3, 4, 7, 8) | Self-assessment | Policy + log bundle is the documentation artifact |

## Sector templates

Apply in one line:

```python
agent = secure_agent(agent, template="<sector>")
```

| Template key | Sector |
|---|---|
| `hr-employment` | Category 4 — HR & Employment |
| `healthcare` | Category 5 — Healthcare |
| `education` | Category 3 — Education |
| `critical-infrastructure` | Category 2 — Critical Infrastructure |
| `biometrics` | Category 1 — Biometrics |
| `law-enforcement` | Category 6 — Law Enforcement |
| `migration-border` | Category 7 — Migration & Border |
| `justice-democracy` | Category 8 — Justice & Democracy |
| `banking-dora` | Banking & Finance (DORA) |

Each template includes: DENY rules for autonomous high-risk actions, REQUIRE_APPROVAL gates, mandatory logging, data-quality gate, and a post-market monitoring hook.

## Penalties

Non-compliance with Annex III requirements: **up to €35M or 7% of global annual turnover**, whichever is higher (Art. 99).

The enforcement deadline is **August 2, 2026**. There is no grace period after that date.

## Further reading

- [EU AI Act full text](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689)
- [Sector templates source](../packages/core/templates/sector-templates.ts)
- [Policy reference](policies.md)
- [Audit log schema](../packages/dashboard/src/lib/db_sql.ts)
