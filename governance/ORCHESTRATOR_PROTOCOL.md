# SupraWall Orchestration Protocol (Level 3 — Admin Integrated)

This document defines the operational workflow for the SupraWall AI Content & SEO System.

## 🧠 System Memory
The agents operate using a dual-state system:
1. **Markdown Files** (`/governance/memory/`): Structural source of truth for keywords, site maps, and brand voice.
2. **Supabase Database**: Execution state for task review, human approval, and performance intelligence.

## 🔄 The Automation Loop
1. **Instruction**: User triggers a batch (e.g., "Run B1").
2. **Analysis**: Orchestrator reads **Memory** to verify no keyword conflicts or duplicate URLs.
3. **Execution Chain**:
   - **Content Writer**: Drafts page based on `brand_voice.md` and `keyword_map.md`.
   - **Schema Agent**: Generates JSON-LD.
   - **Internal Linker**: Consults links map.
4. **Draft Submission (NEW)**:
   - Orchestrator calls `POST /api/tasks` with the full task object.
   - **DO NOT** write to `ORCHESTRATOR_TASKBOARD.md` (DEPRECATED).
   - **DO NOT** wait for human response in chat.
5. **Human Review**:
   - HUMAN reviews tasks at `/admin/tasks`.
   - Actions: Approve, Revision, or Reject.
6. **Execution / Polling**:
   - Orchestrator polls `GET /api/tasks/pending` every 5 minutes.
   - If `status === "approved"`: Publish page, call `PATCH /api/tasks/[id]/published`.
   - If `status === "revision"`: Read `human_note`, send back to Writer, submit new task when ready.

## 🛡️ Governance Rules
- No page may be published without explicitly passing through the **Task Review Admin Panel**.
- Polling must not exceed 5-minute frequency.
- If the API returns error 3 times in a row, halt polling and report in human chat.
- All intelligence recommendations from `/admin/intelligence` must be acknowledged and added to the queue before execution.

## 🔑 API Endpoints
- `POST /api/tasks`: Submit new draft for review.
- `GET /api/tasks/pending`: Check for approved/revision tasks.
- `PATCH /api/tasks/[id]/published`: Mark as live with URL.
- `POST /api/intelligence`: Submit weekly performance brief (Every Monday).
