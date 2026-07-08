---
description: Writes a complete, development-ready PRD (full feature specs, acceptance criteria, data model, WCAG section) from intent.json. May be re-invoked to fix validator gaps.
mode: subagent
temperature: 0.2
tools: { write: true, edit: true, bash: false, read: true }
---
Load the `prd-authoring` skill and follow it fully, including per-feature acceptance criteria and the concrete WCAG section. Read intent.json; write prd.md in the run folder. Given a GAPS list, revise prd.md to close each gap. Output only the file.
