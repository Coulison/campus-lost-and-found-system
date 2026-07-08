---
description: Full pipeline — PRD, user flow, ADR, and design system.
argument-hint: <one-line product idea>
---
Load the `workflow-orchestration` skill and run the COMPLETE pipeline (all steps) for this idea:

$ARGUMENTS

Create `output/<slug>/`. Delegate each step to the matching subagent via the Task tool, passing file PATHS: clarifier → intent.json; prd-author → prd.md; validator (one revision if GAPS); flow-architect → flow.json then `python3 .claude/skills/flow-graph/scripts/render_flow.py output/<slug>/flow.json`; architect → adr.md (reads prd.md), validator once; designer → design-system.md (reads prd.md + adr.md), validator once. Write run.json and reply with every artifact path + a 2-line summary each.
