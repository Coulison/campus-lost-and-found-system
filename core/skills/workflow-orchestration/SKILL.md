---
name: workflow-orchestration
description: The end-to-end Jumpstart pipeline that turns a product idea into a development-ready PRD, a user-flow markdown, an architecture decision record, and a design system. Use this whenever asked to "jumpstart", "blueprint", or scaffold planning docs for a product idea, or when running the full idea-to-plan flow in a tool without subagents. This skill lets a single agent execute the whole pipeline.
---

# Jumpstart Orchestration

Run these steps in order for a product idea. Create `output/<slug>/` (kebab-case slug of the idea). Pass file paths between steps, not contents.

1. **Intent** — infer structured intent from the idea; record assumptions. Write `intent.json`.
2. **PRD** — load `prd-authoring`; write a development-ready `prd.md` from `intent.json`.
3. **Validate PRD** — check against the prd-authoring checklist; fix gaps once.
4. **Flow graph** — load `flow-graph`; write `flow.json` (enriched schema) from `prd.md`.
5. **Render flow** — run `scripts/render_flow.py output/<slug>/flow.json` → `user-flow.md`.
6. **ADR** — load `adr-authoring`; read `prd.md`; write `adr.md`. Validate; fix gaps once.
7. **Design system** — load `design-system-authoring`; read `prd.md` + `adr.md`; write `design-system.md`. Validate; fix gaps once.
8. **Manifest** — write `run.json` with all artifact paths.

If the tool has subagents, delegate each step to a specialist. If not, do each step yourself, loading the named skill first. Individual entry points: PRD+flow only (steps 1–5), ADR only (step 6, requires prd.md), design system only (step 7, requires prd.md + adr.md).

**Optional step — MVP scope:** between steps 3 and 4, a team on a deadline can run `/scope <hours> <team_size>` (loads `mvp-scoping`; requires `prd.md`) to write `mvp-scope.md`. This never runs automatically as part of `/jumpstart` or `/blueprint` — it's a deliberate, separate call. If it exists by the time steps 6–7 run, the ADR and design system treat it as the MVP boundary instead of re-deriving one from the PRD.

**Optional step — starter scaffold:** after step 6, `/starter-code` (loads `starter-scaffold`; requires `adr.md`) generates a real runnable boilerplate under `output/<slug>/starter/`. Deterministic — a script assembles it from a small model-extracted `stack.json`, never hand-written. Never runs automatically.

**Optional step — pitch deck:** after step 6 (and step 7 if run), `/pitch-deck` (loads `pitch-deck-authoring`; requires `prd.md` + `adr.md`) writes a 5-slide demo outline. Uses `mvp-scope.md` if present so the pitch matches what was actually built. Never runs automatically.
