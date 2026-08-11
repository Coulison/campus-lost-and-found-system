---
name: mvp-scoping
description: Cut a development-ready PRD down to what a specific team can realistically demo within a fixed time budget. Use whenever asked to scope a hackathon/code-camp sprint, size an MVP for a deadline, or answer "what can we actually build in N hours with M people." Requires two inputs: hours available and team size. Read prd.md; never invent features that aren't already in it.
---

# MVP Scoping (time-boxed)

Read `prd.md`. You are given two numbers: **hours** (total wall-clock build time before the demo) and **team_size** (number of people building, including non-coders). Optionally a **skill_level** (`beginner` | `mixed` | `experienced`) — assume `mixed` if not given.

If `hours` or `team_size` is missing, ask for them. Do not guess a number for either — a wrong budget makes every downstream estimate wrong.

Do NOT invent new features and do NOT re-derive requirements from the raw idea. Only triage what's already in the PRD's Feature Specifications (`FR-xx`).

## Method

1. **Effort-score every FR.** For each `FR-xx`, estimate build hours for ONE mid-level dev, based on its Behavior + Acceptance Criteria + States & edge cases + Dependencies. Round to the nearest 0.5h. Show the estimate and a one-line reason (e.g. "3h — CRUD + one external API call"). If `skill_level` is `beginner`, multiply estimates by 1.5; if `experienced`, by 0.75.
2. **Compute the real budget.** `budget_hours = hours × team_size × 0.6`. The 0.6 factor is always applied — it accounts for setup, merge conflicts, testing, and demo prep, and is never optional or tunable away. State the resulting number plainly.
3. **Find the critical path.** Using each FR's Dependencies, find the smallest connected chain of FRs that produces one complete, demoable user journey — a person can start it and see a result on screen. This chain is protected: never cut it for budget reasons. If the critical path alone exceeds `budget_hours`, say so explicitly under Risks instead of silently shrinking it.
4. **Fill the remaining budget greedily** with the highest user-value-to-effort FRs outside the critical path, using the estimates from step 1, until the budget is spent.
5. **Everything else is Parked**, not deleted — it stays valid input for a Phase 2 and must keep its original FR id.
6. **Split into tasks per teammate.** Divide the Build Now list into `team_size` roughly-even, low-dependency chunks (by FR or by a clear vertical slice) so people can start immediately without waiting on each other. Flag any chunk that blocks another and name the blocking FR.

## Output — `mvp-scope.md`

Use `references/mvp-scope-template.md`. Required sections: Inputs (hours, team_size, skill_level, computed budget), Critical Path, Build Now (FR ids + effort + assigned chunk, with a running total against budget), Parked for Phase 2 (FR ids + why cut), Task Split (per-person chunks with blockers named), Risks (anything that doesn't fit — including an over-budget critical path).

Be honest about the math. If the budget doesn't fit even the critical path, say so plainly rather than quietly trimming the critical path to make the numbers work — a code camp team needs to know that *before* they start, not after.

## Downstream effect (optional, non-breaking)

If `output/<slug>/mvp-scope.md` exists, the `adr-authoring` and `design-system-authoring` skills treat its Build Now list as the canonical MVP boundary instead of re-deriving one from the PRD's own Scope & Phasing section. If it doesn't exist, both skills behave exactly as before — this file is purely additive.
