# PR Comment Draft — warpdotdev/warp #9957

**Word count target:** under 200
**Posting checklist (Alejandro must verify before posting):**
- [ ] PR #9957 is not in Draft and not closed
- [ ] Issue #10029 has a meaningful response from a Warp maintainer (not just bot)
- [ ] SupraWall PR has been merged to `main` — update the link below to point to `main`, not the branch
- [ ] Post from wiserautomation org account, not personal

---

## Draft comment text

---

@etherman-os — I implemented a reference adapter for this spec on the SupraWall side while the PR was in review: **[wiserautomation/SupraWall — packages/warp-adapter/](https://github.com/wiserautomation/SupraWall/tree/main/packages/warp-adapter)**

It covers all six action surfaces (`execute_command`, `write_to_long_running_shell_command`, `read_files`, `write_files`, `call_mcp_tool`, `read_mcp_resource`) and all three decisions (`allow`, `deny`, `ask`). Transport is stdio/newline-delimited JSON per your spec. Tested against the v1 contract as specified in commit `97c11d3`; live integration testing is pending the PR moving out of Draft.

One thing worth verifying in your implementation: the product spec (§ Testable Behavior Invariants, point 4) says an `ask` decision's reason should appear in the confirmation UI "even if the user clicked while the hook was still pending." That path requires threading the hook result back into the UI while a prompt is already visible — I didn't see it covered in the test fixtures. Might be worth a targeted test.

Happy to be a sanity check on schema changes as the spec evolves.

---

## Notes for Alejandro

- **The "one thing worth verifying" paragraph is the highest-value line.** It signals we actually read the spec. Don't soften it or remove it.
- **Under 200 words.** If you're tempted to add context, don't — a long comment reads as vendor pitch.
- **No urgency language** ("we'd love to," "exciting," "reach out") — all cut.
- **No SupraWall description** in the comment body. The link does that work. Let the code speak.
