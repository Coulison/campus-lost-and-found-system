# Jumpstart Kit — Operating Rules (portable)

## Pipeline
idea → intent.json → prd.md → flow.json → user-flow.md → adr.md → design-system.md
Each artifact reads the previous by PATH. All artifacts for a run live in `output/<slug>/`.

## Hard rules
- Docs must follow the shared style in each skill (YAML header, numbered sections, stable IDs, concrete detail).
- The user flow is produced ONLY by `render_flow.py` from a schema-valid `flow.json`. Never hand-write the flow.
- Validation is read-only. A validator returns `PASS` or a `GAPS` list; it never edits files.
- Cap any validator retry at ONE iteration (free-tier rate limits).
- Keep temperature ≤0.3 everywhere; these are structured tasks.
- ADR reads prd.md. Design system reads prd.md AND adr.md (for the chosen frontend stack + WCAG criteria).

## Run manifest
Write `run.json` listing every artifact path produced.
