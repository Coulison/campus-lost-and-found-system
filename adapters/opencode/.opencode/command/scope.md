---
description: Cut the latest PRD down to what your team can build in a fixed time budget. Usage: /scope <hours> <team_size> [skill_level]
agent: jumpstart
---
Run only the MVP-scoping step: find the latest output/<slug>/prd.md, invoke @scoper with hours, team_size, and optional skill_level parsed from the arguments below to write mvp-scope.md, then report the path plus its Build Now / Parked summary. If hours or team_size is missing from the arguments, ask for it before invoking @scoper.

$ARGUMENTS
