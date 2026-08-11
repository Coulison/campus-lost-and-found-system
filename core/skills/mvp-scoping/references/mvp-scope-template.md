---
title: <Product Name> — MVP Scope
version: 0.1
date: <YYYY-MM-DD>
status: draft
source: prd.md
---

## 1. Inputs
- **Time budget:** `<hours>`h wall-clock, `<team_size>` people, skill level: `<skill_level>`
- **Computed build budget:** `<hours × team_size × 0.6>` person-hours (setup/merge/testing/demo overhead already applied)

## 2. Critical Path (never cut)
The smallest connected chain of features that produces one complete, demoable journey.

| Order | FR | Name | Effort (h) | Running total |
|---|---|---|---|---|
| 1 | FR-01 | <name> | <h> | <h> |

## 3. Build Now
Everything the team commits to building for the demo.

| FR | Name | Effort (h) | Reason for estimate | Assigned to |
|---|---|---|---|---|
| FR-01 | <name> | <h> | <one line> | Person A |

**Total committed:** `<sum>`h against a `<budget>`h budget.

## 4. Parked for Phase 2
Not deleted — valid scope for after the camp.

| FR | Name | Why parked |
|---|---|---|

## 5. Task Split
- **Person A:** <FR ids>, unblocked from the start.
- **Person B:** <FR ids>, blocked on <FR-xx> until <milestone>.

## 6. Risks
<e.g. "Critical path alone is 14h against a 12h budget — cut a step from FR-03 or extend the demo deadline.">
