---
name: flow-graph
description: Extract a product's primary user flow from a PRD as an enriched, schema-valid JSON graph, then render it into a detailed, readable user-flow Markdown file with numbered steps and arrows. Use whenever building a user flow, journey, or process flow from requirements, even if the user just says "make the flow." Never hand-write the flow document; always go through the graph + renderer.
---

# Flow Graph → User-Flow Markdown

Two steps: (1) extract the flow as enriched JSON; (2) a script renders `user-flow.md`. The model never writes the flow document, which removes structural hallucination and keeps output consistent.

## Step 1 — Extract the enriched graph
Conform to `references/flow-schema.json`. Model the PRIMARY end-to-end journey: main happy path plus critical decision branches and their error/exit paths. Requirements:
- Root fields: `title`, `summary` (one sentence), optional `edge_cases` (array of strings).
- Each node: `id` (kebab-case), `type` (`start`|`action`|`decision`|`end`), `stage` (grouping label, e.g. "Onboarding"), `label` (≤7 words), `description` (1–2 clear sentences on what happens here).
- One `start`, ≥1 `end`. Every `decision` has ≥2 outgoing edges, each with a `condition`. Edges may add a `note`.
- Order nodes in the logical sequence a user experiences them (the renderer numbers them in array order, grouped by stage).

## Step 2 — Render (deterministic, no LLM)
```
python3 <this-skill>/scripts/render_flow.py output/<slug>/flow.json
```
Writes `user-flow.md` beside the JSON: numbered steps grouped by stage, `→` for sequential transitions, `⤷ *condition* →` for decision branches, plus Decision-points, Exit-points, and Edge-cases sections. If it prints validation errors, fix `flow.json` and re-run — never edit the .md by hand.
