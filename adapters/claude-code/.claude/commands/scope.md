---
description: Cut the latest PRD down to what your team can build in a fixed time budget.
argument-hint: <hours> <team_size> [skill_level]
---
Find the latest `output/<slug>/prd.md`. Use the scoper subagent (via the Task tool) to write `mvp-scope.md` beside it following the `mvp-scoping` skill, passing along hours, team_size, and optional skill_level from these arguments: $ARGUMENTS. If hours or team_size is missing, ask for it before invoking the subagent. Report the `mvp-scope.md` path plus its Build Now / Parked summary. Do not re-derive requirements from the raw idea — read the PRD.
