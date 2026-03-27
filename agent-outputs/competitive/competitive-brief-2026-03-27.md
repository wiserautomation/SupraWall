# Competitive Brief — 2026-03-27

## Changes Detected

### Pangea — Acquired by CrowdStrike for $260M (COMPLETED)

CrowdStrike has officially completed its acquisition of Pangea for approximately $260 million. Pangea's technology is being integrated into CrowdStrike's Falcon platform as AI Detection and Response (AIDR) — the industry's first complete AIDR offering securing data, models, agents, identities, infrastructure, and interactions.

**So what for SupraWall:** This is the biggest competitive shift in the landscape right now. Pangea is no longer an independent startup — it's now part of a $70B+ enterprise security juggernaut. This means:

1. **Pangea's standalone product will likely be absorbed** into CrowdStrike Falcon. Enterprises already on Falcon get AI security "for free" as a platform add-on, reducing the addressable market for independent AI security tools.
2. **SupraWall's open-source, self-hostable positioning becomes more valuable** — CrowdStrike is the opposite of open-source. Teams that want transparency, customizability, and vendor independence now have fewer options, making SupraWall a stronger alternative.
3. **Recommended action:** Update competitive positioning materials to explicitly contrast SupraWall's open-source, self-hostable model against CrowdStrike/Pangea's locked-in enterprise approach. Highlight that SupraWall doesn't require buying into a $300K+/yr security platform.

---

### Lakera Guard — Now Fully Under Check Point ($300M acquisition)

Check Point's acquisition of Lakera (announced September 2025, ~$300M) is now complete. Lakera is forming Check Point's Global Center of Excellence for AI Security in Zurich. First integrations are appearing in Check Point CloudGuard WAF and Check Point GenAI Protect.

Additionally, Lakera released **Canica** in March 2026 — an interactive text dataset viewer with t-SNE/UMAP visualization tools, released under MIT license.

**So what for SupraWall:** Similar dynamic to Pangea/CrowdStrike. Two of SupraWall's biggest competitors have been absorbed by legacy security giants in the past 6 months. This is a clear market signal:

1. **The independent AI security market is consolidating fast.** SupraWall's independence and open-source model is increasingly rare and valuable.
2. **Lakera Guard's API will likely become Check Point-exclusive** over time, creating lock-in for current Lakera users.
3. **Recommended action:** Consider a migration guide ("Switching from Lakera Guard to SupraWall") targeting teams who don't want Check Point lock-in. The Canica release under MIT shows Lakera still has community goodwill — SupraWall could explore integrating or referencing it.

---

### Guardrails AI — Pre-release v0.10.0 Activity

Guardrails AI released v0.9.3 on March 24, 2026, and has published pre-release versions 0.10.0a0 through 0.10.0a3 in the same period. This signals active development heading toward a significant 0.10 release.

**So what for SupraWall:** Guardrails AI remains the most direct open-source competitor. Their 0.10 release cycle suggests new capabilities incoming. Key differences remain: Guardrails AI focuses on input/output validation and structured output, while SupraWall provides multi-layer security (policy engine, vault, approvals, audit, threat detection, budget enforcement). Monitor the 0.10 release notes closely when it goes stable — new features could overlap with SupraWall's roadmap.

**Recommended action:** Track the 0.10.0 stable release. If it adds security-focused features (prompt injection, DLP), prepare a comparison document showing SupraWall's broader coverage.

---

### Industry Context — OpenAI Acquires Promptfoo (March 9, 2026)

OpenAI acquired Promptfoo, an AI security testing startup used by 25%+ of Fortune 500 companies. Promptfoo's red-teaming and security evaluation tools will be integrated into OpenAI Frontier (their enterprise agent platform). OpenAI says it will continue Promptfoo's open-source offering.

**So what for SupraWall:** This is not a direct competitor acquisition, but it signals that AI security is becoming a platform-level feature. OpenAI building security into its agent platform means enterprises using OpenAI may feel "covered" without needing a separate security layer.

**Recommended action:** Position SupraWall as model/platform-agnostic security — it works regardless of whether you're on OpenAI, Anthropic, Google, or open-source models. Enterprises using multi-model strategies need SupraWall precisely because they can't rely on any single provider's built-in security.

---

### Microsoft Prompt Shields — Defender Integration in Azure AI Foundry

Microsoft Defender now integrates directly into Azure AI Foundry, surfacing AI security posture recommendations and runtime threat protection alerts within the development environment. Prompt Shields continues to be a core component of Azure AI Content Safety.

**So what for SupraWall:** Microsoft continues deepening Prompt Shields into the Azure stack. This makes it the default choice for Azure-native shops. SupraWall's advantage: framework-agnostic (7 framework plugins) vs. Azure-only, self-hostable vs. cloud-only, and broader security coverage (vault, approvals, audit) vs. prompt injection only.

**Recommended action:** No immediate action needed. Continue emphasizing multi-cloud and self-hosting advantages in positioning materials.

---

## Recommended Actions (Summary)

1. **Create migration guides** for Lakera Guard and Pangea users who don't want enterprise lock-in (Check Point / CrowdStrike). This is a time-sensitive opportunity — migration happens in the months after acquisition completion.
2. **Update competitive positioning** to emphasize SupraWall as one of the last independent, open-source AI security platforms. The consolidation wave (Pangea→CrowdStrike, Lakera→Check Point, Promptfoo→OpenAI) makes this a genuine differentiator.
3. **Monitor Guardrails AI 0.10.0 stable release** for feature overlap. Prepare comparison content if needed.
4. **Strengthen multi-model/multi-cloud messaging** — as OpenAI and Microsoft build security into their platforms, SupraWall's value is for teams that don't want to be locked into a single provider's security stack.
5. **Consider EU AI Act compliance push** — with competitors being absorbed into US enterprise giants, none are likely to prioritize EU AI Act compliance. This remains a unique SupraWall advantage worth marketing harder in EU markets.

---

## No Changes

- **Rebuff** — No new releases detected beyond v0.4.0. Remains a prototype-stage open-source tool under Protect AI. Low competitive threat but worth monitoring if Protect AI invests more heavily.
- **PromptArmor** — Active in vulnerability research and disclosure (Google Antigravity data exfiltration) but no product updates detected. Focused on third-party AI risk assessment rather than runtime security, making it less of a direct competitor.
- **CalypsoAI** — No new announcements detected in March 2026. Continues to operate its AI Model Security Leaderboard and Moderator product. Their FRAME and Trolley attack research is notable but no product changes observed.

---

## Market Trend

The AI security market is experiencing rapid consolidation. Three significant acquisitions in the past 6 months (Lakera→Check Point, Pangea→CrowdStrike, Promptfoo→OpenAI) are reshaping the competitive landscape. Independent, open-source AI security tools are becoming increasingly rare. **This is SupraWall's strongest strategic window** — teams that want vendor-neutral, transparent, self-hostable AI security have fewer options than ever.
