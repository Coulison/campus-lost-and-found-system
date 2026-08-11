---
name: pitch-deck-authoring
description: Draft a 5-slide demo-day pitch outline from a PRD and its ADR — slide content plus speaker notes, sized for a 3-5 minute code-camp or hackathon demo. Use whenever asked for a pitch deck, demo script, demo-day slides, or "how do we present this" for a hackathon/code-camp project. Read the existing docs; never invent metrics, traction, or features that aren't in them.
---

# Pitch Deck Authoring (demo day)

Read `prd.md` and `adr.md`. If `output/<slug>/mvp-scope.md` exists, read it too — the deck must pitch what the team actually built (its Build Now list and critical path), not the PRD's full original vision. Unbuilt features belong on the closing slide as future work, never presented as done.

Write a single Markdown file `pitch-deck.md`, one section per slide. Each slide gets:
- **Slide content** — terse, what actually goes on screen (a headline + at most 3 bullets or one visual cue).
- **Speaker notes** — what to say out loud, roughly 20-30 seconds worth.

## Slide 1 — The Problem
Who has this problem and why it matters, grounded in the PRD's Problem & Opportunity and a persona. One concrete moment that makes it real, not an abstract statistic.

## Slide 2 — The Solution (live demo cue)
One-sentence pitch, then hand off to a live demo: name the single user journey to click through (the happy path from `user-flow.md`, or the protected critical path in `mvp-scope.md` if it exists). Speaker notes must say exactly where to stop clicking and start talking — a demo that keeps clicking loses the room.

## Slide 3 — How It Works
The stack in plain, non-jargon language, pulled from the ADR's Recommended Technology Stack. Name the single most interesting technical decision from the ADR's Key Decisions and why it was made — pick the one that's actually a good story, not just the first one listed.

## Slide 4 — What We Built (honestly)
If `mvp-scope.md` exists: present its Build Now vs Parked split as a deliberate scope decision made up front, not an apology for what's missing. If it doesn't exist, use the PRD's own Scope & Phasing (MVP vs Later).

## Slide 5 — What's Next
2-3 concrete next features, pulled from the Parked list (or the PRD's Later phase) — real FR ids, not vague ambition. One closing sentence on why this is worth continuing past the camp.

## Constraints
- Total speaker notes across all 5 slides should read aloud in under 3 minutes (roughly 450 words total).
- No filler slides (no generic "Thank You," no "Team" slide unless the PRD's personas make introductions relevant) — a judge's attention is the scarce resource.
- Every claim must trace to `prd.md`, `adr.md`, or `mvp-scope.md`. If something the pitch needs isn't in any of them, note it as an open question rather than inventing it.
