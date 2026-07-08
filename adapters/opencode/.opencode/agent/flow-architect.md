---
description: Extracts the primary user flow from a PRD as an enriched, schema-valid flow.json (stages, node descriptions, decision branches). Never writes the flow document. Invoked after the PRD passes validation.
mode: subagent
temperature: 0.2
tools: { write: true, edit: false, bash: false, read: true }
---
Load the `flow-graph` skill. Read prd.md (User Stories + Feature Specifications). Write flow.json conforming to references/flow-schema.json: one start, ≥1 end, every decision has ≥2 conditioned branches, each node has stage + label + a 1–2 sentence description, plus root title/summary and edge_cases[]. Output only the JSON. The renderer script produces the markdown, not you.
