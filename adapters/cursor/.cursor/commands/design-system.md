# Design System

Generate a design system from the most recent PRD + ADR, single-agent.

Read the latest `output/<slug>/prd.md` (esp. its accessibility section) and `adr.md` (the chosen frontend/styling stack). Load `.cursor/skills/design-system-authoring/SKILL.md`. First reason about which UI archetype fits this product and audience, then write `design-system.md` following the skill's structure. Every color pair must state its contrast ratio against the PRD's WCAG target; tokens must match the ADR's stack. Report the `design-system.md` path.
