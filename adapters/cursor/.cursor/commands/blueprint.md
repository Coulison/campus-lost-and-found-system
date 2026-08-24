# Blueprint

Run the Jumpstart pipeline steps 1–5 for the product idea I give you, single-agent (Cursor has no subagents).

Load `.cursor/skills/workflow-orchestration/SKILL.md` and follow it, loading each named skill first:
1. Infer `intent.json` from the idea (record assumptions).
2. Load `prd-authoring`; write a development-ready `prd.md`.
3. Validate `prd.md` against the prd-authoring checklist; fix gaps once.
4. Load `flow-graph`; write an enriched `flow.json`.
5. Render: `python3 .cursor/skills/flow-graph/scripts/render_flow.py output/<slug>/flow.json`.

Create `output/<slug>/`, pass paths between steps, never hand-write the flow. Report the `prd.md` and `user-flow.md` paths.
