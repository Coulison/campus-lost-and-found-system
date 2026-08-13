---
description: Full pipeline — PRD, user flow, ADR, design system, starter code, and pitch deck (plus MVP scope if hours + team_size are given).
argument-hint: <one-line product idea> [hours] [team_size] [skill_level]
---
Load the `workflow-orchestration` skill and run the COMPLETE pipeline (every step, including starter code and the pitch deck) for this idea:

$ARGUMENTS

If the input above ends with two or three trailing tokens that parse as a numeric hours value and an integer team_size (optionally followed by a skill_level word), extract them as scope parameters and treat the remaining leading text as the idea. Otherwise treat the whole input as the idea and skip MVP scoping entirely — don't stop to ask for the numbers.

Create `output/<slug>/`. Delegate each step to the matching subagent via the Task tool, passing file PATHS: clarifier → intent.json; prd-author → prd.md; validator (one revision if GAPS); if hours+team_size were extracted, scoper → mvp-scope.md (reads prd.md, using the extracted hours/team_size/skill_level); flow-architect → flow.json then `python3 .claude/skills/flow-graph/scripts/render_flow.py output/<slug>/flow.json`; architect → adr.md (reads prd.md, and mvp-scope.md if it exists), validator once; scaffolder → output/<slug>/starter/ (reads adr.md); designer → design-system.md (reads prd.md + adr.md, and mvp-scope.md if it exists), validator once; pitch-writer → pitch-deck.md (reads prd.md + adr.md, and mvp-scope.md if it exists). Write run.json and reply with every artifact path + a 2-line summary each.
