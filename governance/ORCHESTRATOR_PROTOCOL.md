# SupraWall Orchestration Protocol (Level 2)

This document defines the operational workflow for the SupraWall AI Content & SEO System.

## 🧠 System Memory
The agents operate using a shared state stored in `/governance/memory/`:
1. [site_map_state.md](./memory/site_map_state.md): Status of every URL.
2. [keyword_map.md](./memory/keyword_map.md): Source of truth for keyword targeting.
3. [internal_link_map.md](./memory/internal_link_map.md): Map of all structural entity relationships.
4. [publishing_queue.md](./memory/publishing_queue.md): The active work-in-progress queue.
5. [brand_voice.md](./memory/brand_voice.md): Tone, style, and terminology constraints.

## 🔄 The Automation Loop
1. **Instruction**: User triggers a batch (e.g., "Run B1").
2. **Analysis**: Orchestrator reads **Memory** to verify no keyword conflicts or duplicate URLs.
3. **Execution Chain**:
   - **Content Writer**: Drafts page based on `brand_voice.md` and `keyword_map.md`.
   - **Schema Agent**: Generates JSON-LD tailored to the content type.
   - **Internal Linker**: Consults `internal_link_map.md` to find relevant "Pillar" or "Integration" targets for cross-linking.
4. **Finalization**: Orchestrator updates `site_map_state.md` to `✅ Live` and refreshes the indices.

## 🛡️ Governance Rules
- No agent may publish a page without an entry in `keyword_map.md`.
- No agent may use "Traditional Safety" language as per `brand_voice.md`.
- Every new page must link back to at least one `Pillar` path.
