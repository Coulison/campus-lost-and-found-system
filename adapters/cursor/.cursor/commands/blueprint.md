# Blueprint

Run the COMPLETE Jumpstart pipeline for the product idea I give you, single-agent (Cursor has no subagents).

Load `.cursor/skills/workflow-orchestration/SKILL.md` and do every step yourself, loading each named skill first:
1. `intent.json` from the idea.
2. `prd-authoring` → `prd.md`; validate, fix gaps once.
3. `flow-graph` → `flow.json`; then `python3 .cursor/skills/flow-graph/scripts/render_flow.py output/<slug>/flow.json`.
4. `adr-authoring` → `adr.md` (reads prd.md); validate once.
5. `design-system-authoring` → `design-system.md` (reads prd.md + adr.md); validate once.

Create `output/<slug>/`, pass paths between steps, never hand-write the flow. Write run.json and report every artifact path with a 2-line summary each.
