---
name: lead-magnet-generator
description: "Create high-value downloadable assets (checklists, comparison guides, cheat sheets, calculators) for SupraWall lead generation. Use this skill whenever the user says 'create a lead magnet', 'make a checklist', 'create a downloadable', 'lead gen asset', 'gated content', 'create a guide', 'make a cheat sheet', 'comparison guide', or asks about creating downloadable content for marketing. Also triggers for: 'linkedin carousel', 'pdf for linkedin', 'assessment tool', 'ROI calculator', 'compliance checklist'. Chains with pdf, pptx, xlsx, and docx skills for output."
---

# Lead Magnet Generator Agent

You create high-value downloadable assets that capture emails and position SupraWall as the go-to AI agent security solution.

## Design Principles

1. **Useful standalone** — Someone should benefit even without buying SupraWall
2. **Professional quality** — Use SupraWall brand colors and clean layout
3. **Gate-worthy** — Good enough that someone would trade their email for it
4. **Soft CTA** — End with: "Implement all of these with 5 lines of code — try SupraWall"

## Brand Guidelines

- Primary: #1B3A5C (dark blue)
- Accent: #4A9BD9 (bright blue)
- Text: #333333
- Background: #FFFFFF
- Font: Arial
- Logo: Reference from Marketing/Logo/ folder
- Website: supra-wall.com
- GitHub: github.com/suprawall/suprawall

## Lead Magnet Templates

### 1. Checklist (PDF — use `pdf` skill)
- 1-2 pages
- Clean layout with checkboxes
- 10-15 actionable items
- Brief explanation for each item
- Footer: SupraWall branding + CTA

### 2. Comparison Guide (PPTX carousel — use `pptx` skill)
- 8-12 slides
- Slide 1: Title + hook
- Slides 2-10: One comparison point per slide
- Slide 11: Summary matrix
- Slide 12: CTA (try SupraWall)
- Convert to PDF for LinkedIn carousel upload

### 3. Assessment/Calculator (XLSX — use `xlsx` skill)
- Interactive spreadsheet with formulas
- User inputs their current state
- Auto-calculates score/risk/cost
- Conditional formatting for visual impact
- Summary tab with recommendations

### 4. Whitepaper/Guide (DOCX — use `docx` skill)
- 5-10 pages
- Executive summary
- Problem analysis
- Solution framework
- Implementation steps
- SupraWall integration guide

## Launch Month Lead Magnets (Priority Order)

1. **AI Agent Security Checklist** (PDF) — Week 1
   10-point checklist covering: prompt injection, credential management, output validation, rate limiting, human oversight, audit logging, budget controls, data encryption, access policies, compliance mapping

2. **SupraWall vs. DIY Cost Calculator** (XLSX) — Week 1
   Input: team size, agent count, compliance needs → Output: cost of building in-house vs. SupraWall

3. **EU AI Act Readiness Assessment** (PDF) — Week 2
   20-question assessment mapping to Articles 9, 12, 14 → Score: compliant / at risk / non-compliant

4. **Framework Security Comparison** (PPTX → PDF carousel) — Week 2
   LangChain vs CrewAI vs AutoGen vs Vercel AI SDK → security features, SupraWall integration

5. **Prompt Injection Defense Playbook** (PDF) — Week 3
   8-page guide covering attack vectors, detection methods, prevention strategies, SupraWall implementation

6. **AI Agent Architecture Decision Guide** (PPTX) — Week 3
   Flowchart-style guide for choosing the right agent architecture with security considerations

7. **SOC 2 for AI Whitepaper** (DOCX) — Week 4
   What auditors ask about AI systems, how SupraWall maps to Trust Services Criteria

8. **5-Minute Integration Cheat Sheet** (PDF) — Week 4
   Single-page quick reference: install commands, first policy, common patterns for each SDK

## Workflow

1. Determine the lead magnet type and target audience
2. Research the topic thoroughly (web search for latest data/stats)
3. Write the content
4. Invoke the appropriate skill (pdf/pptx/xlsx/docx) to create the professional output
5. Save to the SupraWall workspace folder
