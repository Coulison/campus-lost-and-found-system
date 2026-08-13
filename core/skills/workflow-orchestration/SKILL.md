---
name: workflow-orchestration
description: The end-to-end Jumpstart pipeline that turns a product idea into a development-ready PRD, a user-flow markdown, an architecture decision record, a design system, a runnable starter, and a demo-day pitch deck (plus an MVP scope when hours/team_size are given). Use this whenever asked to "jumpstart", "blueprint", or scaffold planning docs for a product idea, or when running the full idea-to-plan flow in a tool without subagents. This skill lets a single agent execute the whole pipeline.
---

# Jumpstart Orchestration

Run these steps in order for a product idea. Create `output/<slug>/` (kebab-case slug of the idea). Pass file paths between steps, not contents.

1. **Intent** — infer structured intent from the idea; record assumptions. Write `intent.json`.
2. **PRD** — load `prd-authoring`; write a development-ready `prd.md` from `intent.json`.
3. **Validate PRD** — check against the prd-authoring checklist; fix gaps once.
4. **MVP scope (conditional)** — only if hours and team_size were given alongside the idea: load `mvp-scoping`; write `mvp-scope.md` from `prd.md`. Skip this step entirely (don't stop to ask) if hours/team_size weren't given.
5. **Flow graph** — load `flow-graph`; write `flow.json` (enriched schema) from `prd.md`.
6. **Render flow** — run `scripts/render_flow.py output/<slug>/flow.json` → `user-flow.md`.
7. **ADR** — load `adr-authoring`; read `prd.md` (and `mvp-scope.md` if it exists); write `adr.md`. Validate; fix gaps once.
8. **Starter scaffold** — load `starter-scaffold`; read `adr.md`; generate `output/<slug>/starter/` (extract `stack.json`, then run `generate_scaffold.py`).
9. **Design system** — load `design-system-authoring`; read `prd.md` + `adr.md` (and `mvp-scope.md` if it exists); write `design-system.md`. Validate; fix gaps once.
10. **Pitch deck** — load `pitch-deck-authoring`; read `prd.md` + `adr.md` (and `mvp-scope.md` if it exists); write `pitch-deck.md`.
11. **Manifest** — write `run.json` with all artifact paths.

If the tool has subagents, delegate each step to a specialist. If not, do each step yourself, loading the named skill first.

**Entry points:**
- `/jumpstart <idea>` — steps 1–3, 5–6 only (PRD + flow; no scope, ADR, starter, design system, or pitch deck).
- `/blueprint <idea> [hours] [team_size] [skill_level]` — every step above, end to end. Step 4 (MVP scope) only runs if `hours` and `team_size` are present in the arguments; steps 8 and 10 (starter scaffold, pitch deck) always run regardless.
- `/scope <hours> <team_size> [skill_level]` — step 4 alone; requires an existing `prd.md`.
- `/adr` — step 7 alone; requires `prd.md`.
- `/starter-code` — step 8 alone; requires `adr.md`.
- `/design-system` — step 9 alone; requires `prd.md` + `adr.md`.
- `/pitch-deck` — step 10 alone; requires `prd.md` + `adr.md`.

Re-running `/scope`, `/starter-code`, or `/pitch-deck` standalone after a `/blueprint` run (e.g. to rescope after hand-editing the PRD, or regenerate the starter after tweaking the ADR) is always safe — each reads the latest artifacts fresh.
