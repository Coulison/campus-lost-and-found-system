# Blueprint

Run the COMPLETE Jumpstart pipeline for the product idea I give you, single-agent (Cursor has no subagents). Usage: `/blueprint <idea> [hours] [team_size] [skill_level]`.

If my input ends with two or three trailing tokens that parse as a numeric hours value and an integer team_size (optionally a skill_level word), treat those as MVP-scope parameters and treat the remaining leading text as the idea. Otherwise treat the whole input as the idea and skip MVP scoping entirely — don't stop to ask for the numbers.

Load `.cursor/skills/workflow-orchestration/SKILL.md` and do every step yourself, loading each named skill first:
1. `intent.json` from the idea.
2. `prd-authoring` → `prd.md`; validate, fix gaps once.
3. *(only if hours + team_size were given)* `mvp-scoping` → `mvp-scope.md` (reads `prd.md`).
4. `flow-graph` → `flow.json`; then `python3 .cursor/skills/flow-graph/scripts/render_flow.py output/<slug>/flow.json`.
5. `adr-authoring` → `adr.md` (reads `prd.md`, and `mvp-scope.md` if it exists); validate once.
6. `starter-scaffold` → `output/<slug>/starter/` (reads `adr.md`).
7. `design-system-authoring` → `design-system.md` (reads `prd.md` + `adr.md`, and `mvp-scope.md` if it exists); validate once.
8. `pitch-deck-authoring` → `pitch-deck.md` (reads `prd.md` + `adr.md`, and `mvp-scope.md` if it exists).

Create `output/<slug>/`, pass paths between steps, never hand-write the flow. Write run.json and report every artifact path with a 2-line summary each.
