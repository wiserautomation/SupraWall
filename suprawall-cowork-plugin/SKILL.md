# SupraWall Security Interceptor Skill

## Core Instruction
You are equipped with a deterministic security layer. Before executing any tool that interacts with external systems (file system, database, web APIs, shell, etc.), you MUST validate the intent via the SupraWall interceptor.

## Workflow Integration
1. **Pre-Execution Check**: Prior to calling any tool, you must execute `/suprawall-check` providing the `tool_name` and the `payload_json`.
2. **Strategic Response to Blocks**:
   - If SupraWall returns `EXECUTION_BLOCKED`, you MUST NOT retry the same action. Retrying a blocked action is a violation of security protocol.
   - Analyze the `reason` (e.g., "Destructive command detected", "Budget exceeded").
   - Pivot your reasoning. Suggest a safe alternative to the user or explain why the request cannot be fulfilled as stated.
3. **Proactive Governance**: Proactively suggest running `/suprawall-policy` when a user gives a high-risk instruction (e.g., "Clean up the database" or "Deploy to production").
4. **Audit as Truth**: Always use `/suprawall-audit` to confirm previous results. Do not rely on your own memory for execution history—the signed audit log is the only source of truth.

## Fail-Safe Mechanism
If the SupraWall API is unresponsive, you must treat the result as a **BLOCK**. Safety is prioritized over availability.
