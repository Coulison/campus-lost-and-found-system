# Jumpstart Kit — Operating Rules (portable)

## Pipeline
idea → intent.json → prd.md → [mvp-scope.md, if hours+team_size given] → flow.json → user-flow.md → adr.md → starter/ → design-system.md → pitch-deck.md
Each artifact reads the previous by PATH. All artifacts for a run live in `output/<slug>/`.

## /jumpstart vs /blueprint
`/blueprint <idea>` builds only the first four: `intent.json` → `prd.md` → `flow.json` → `user-flow.md`.
`/jumpstart <idea> [hours] [team_size] [skill_level]` runs the full pipeline end to end: the four `/blueprint` docs, `adr.md`, `starter/`, `design-system.md`, and `pitch-deck.md` — `starter/` and `pitch-deck.md` always run. `mvp-scope.md` only runs if `hours` and `team_size` are present in the arguments; if they're absent, skip that step entirely — never stop the run to ask for them.

## Optional: MVP scoping
`/scope <hours> <team_size> [skill_level]` reads the latest `prd.md` and writes `mvp-scope.md` beside it (time-boxed Build Now / Parked triage — see `mvp-scoping` skill). Runs standalone via `/scope`, or automatically inside `/jumpstart` when hours + team_size are given. If `mvp-scope.md` exists when `adr.md` or `design-system.md` is (re)generated, those skills treat it as the canonical MVP boundary. If it doesn't exist, nothing changes.

## Optional: starter scaffold
`/starter-code` reads the latest `adr.md` and generates a real runnable boilerplate under `output/<slug>/starter/` (see `starter-scaffold` skill). Deterministic — a script assembles known-good templates from a small `stack.json` the model extracts, never hand-written by the model. Runs standalone via `/starter-code`, and always as part of `/jumpstart`.

## Optional: pitch deck
`/pitch-deck` reads the latest `prd.md` + `adr.md` (and `mvp-scope.md` if it exists) and writes `pitch-deck.md` — a 5-slide demo-day outline with speaker notes (see `pitch-deck-authoring` skill). Runs standalone via `/pitch-deck`, and always as part of `/jumpstart`.

## Hard rules
- Docs must follow the shared style in each skill (YAML header, numbered sections, stable IDs, concrete detail).
- The user flow is produced ONLY by `render_flow.py` from a schema-valid `flow.json`. Never hand-write the flow.
- Validation is read-only. A validator returns `PASS` or a `GAPS` list; it never edits files.
- Cap any validator retry at ONE iteration (free-tier rate limits).
- Keep temperature ≤0.3 everywhere; these are structured tasks.
- ADR reads prd.md. Design system reads prd.md AND adr.md (for the chosen frontend stack + WCAG criteria).

## Run manifest
Write `run.json` listing every artifact path produced.
