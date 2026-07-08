---
name: prd-authoring
description: Write a complete, development-ready Product Requirements Document from a product idea or intent — full feature specifications with acceptance criteria, a data model, states, and a concrete WCAG 2.2 AA accessibility section. Use whenever authoring or revising a PRD, product spec, or requirements, even if the user just says "write the spec" or "document the requirements." Produce depth and precision an engineer can build from directly, not a summary.
---

# PRD Authoring (development-ready)

Write a PRD an engineering team can implement without a meeting. Be thorough and specific. Fill only from `intent.json`; unknowns go under Open Questions.

Use the skeleton in `references/prd-template.md`. Requirements:

- **Feature Specifications is the core section.** For EACH feature give: an ID (`FR-01`), name, one-line purpose, the user value, its user stories, detailed functional behavior, **acceptance criteria in Given/When/Then form**, states & edge cases (empty, loading, error, offline, permission-denied where relevant), and dependencies on other features.
- **Data Model & Entities**: list entities, their key fields with types, and relationships. Enough for a schema to be drafted.
- **System Interactions**: external services/APIs, auth touchpoints, notifications, background jobs implied by the features.
- **Non-functional Requirements**: concrete targets for performance, reliability, security, privacy, scalability.
- **Accessibility (WCAG 2.2 AA)**: name the specific criteria that apply to THIS product's surfaces (e.g. 1.4.3 contrast, 2.1.1 keyboard, 2.4.7 focus visible, 3.3.2 labels, 2.5.8 target size, 1.3.1 structure, 2.3.3 reduced motion) and state how each is satisfied. No generic filler.
- **Scope & Phasing**: MVP vs. later phases, with rationale.

Active voice, present tense. Concrete over vague. Output a single Markdown file.
