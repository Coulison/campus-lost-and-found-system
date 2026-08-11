# Jumpstart Kit — Operating Rules (portable)

## Pipeline
idea → intent.json → prd.md → flow.json → user-flow.md → adr.md → design-system.md
Each artifact reads the previous by PATH. All artifacts for a run live in `output/<slug>/`.

## Optional: MVP scoping
`/scope <hours> <team_size> [skill_level]` reads the latest `prd.md` and writes `mvp-scope.md` beside it (time-boxed Build Now / Parked triage — see `mvp-scoping` skill). This step is optional and never runs automatically. If `mvp-scope.md` exists when `adr.md` or `design-system.md` is (re)generated, those skills treat it as the canonical MVP boundary. If it doesn't exist, nothing changes.

## Hard rules
- Docs must follow the shared style in each skill (YAML header, numbered sections, stable IDs, concrete detail).
- The user flow is produced ONLY by `render_flow.py` from a schema-valid `flow.json`. Never hand-write the flow.
- Validation is read-only. A validator returns `PASS` or a `GAPS` list; it never edits files.
- Cap any validator retry at ONE iteration (free-tier rate limits).
- Keep temperature ≤0.3 everywhere; these are structured tasks.
- ADR reads prd.md. Design system reads prd.md AND adr.md (for the chosen frontend stack + WCAG criteria).

## Run manifest
Write `run.json` listing every artifact path produced.
