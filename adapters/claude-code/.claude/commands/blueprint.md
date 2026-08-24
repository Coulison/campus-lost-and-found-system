---
description: Idea → development-ready PRD + user-flow markdown.
argument-hint: <one-line product idea>
---
Load the `workflow-orchestration` skill and run steps 1–5 (intent → PRD → validate → flow graph → render) for this idea:

$ARGUMENTS

Create `output/<slug>/` (kebab-case slug, max 6 words). Delegate with the Task tool, passing file PATHS not contents:
- clarifier → intent.json
- prd-author → prd.md (from intent.json)
- validator → check prd.md against prd-authoring; if GAPS, one revision via prd-author, then continue
- flow-architect → flow.json

Then run: `python3 .claude/skills/flow-graph/scripts/render_flow.py output/<slug>/flow.json`. Write run.json and reply with the prd.md path, a 3-line PRD summary, and the user-flow.md path. Never hand-write the flow.
