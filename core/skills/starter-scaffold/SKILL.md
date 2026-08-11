---
name: starter-scaffold
description: Turn an ADR's chosen tech stack into an actual runnable boilerplate — real folder structure, package.json, and a hello-world page/route — instead of only documentation. Use whenever asked to scaffold, bootstrap, or generate starter code for a project from its architecture decision record. Read adr.md; never invent a stack the ADR didn't choose.
---

# Starter Scaffold (docs → runnable code)

Two steps, same reliability pattern as `flow-graph`: (1) the model extracts a small structured `stack.json` from `adr.md`; (2) a deterministic script assembles real files from a fixed template library. The model never hand-writes boilerplate files — that's what causes broken `package.json`s and mismatched imports.

## Step 1 — Extract `stack.json`

Read `adr.md`'s Recommended Technology Stack table. Conform to `references/stack-schema.json`:

- `project_name` — kebab-case, from the PRD/ADR title.
- `frontend.kind` — map the ADR's choice to the closest of: `react-vite`, `nextjs`, `plain-html`. If it doesn't map cleanly (e.g. Vue, Svelte, a native mobile framework), use `other` and put the ADR's actual choice in `notes` — do not force it into a wrong bucket.
- `backend.kind` — `node-express`, `none` (static/frontend-only), or `other` (with `notes`).
- `database.kind` — `json-file` (lightweight, zero native deps — the default when the ADR doesn't need a live multi-user database yet), `supabase` (if the ADR chose Supabase or a hosted Postgres+auth service), `none`, or `other` (with `notes`).

Prefer the lightest kind that's still honest to the ADR: a code-camp sprint rarely needs a locally-running database server, and `json-file` avoids native-module compile steps that fail on shared/older lab machines. Only pick `supabase` if the ADR specifically named a hosted backend-as-a-service. Only use `other` when no listed kind is a reasonable fit — it produces a TODO stub, not code, so it's a fallback, not a default.

Write `stack.json` to `output/<slug>/stack.json`.

## Step 2 — Generate (deterministic, no LLM)

```
python3 <this-skill>/scripts/generate_scaffold.py output/<slug>/stack.json
```

Writes real files under `output/<slug>/starter/`: the chosen frontend (with a working hello-world screen), the chosen backend (with a health-check route) if any, the chosen database wiring if any, plus a `README.md` with exact run commands, `.gitignore`, and `.env.example`. Any layer marked `other` gets a `TODO.md` stub explaining what the ADR chose and that it needs manual setup, instead of guessed code. Report exactly what the script printed — do not describe files it didn't actually create.
