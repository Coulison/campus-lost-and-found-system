---
name: adr-authoring
description: Produce a complete, development-ready Architecture Decision Record from a PRD — the recommended technology stack with rationale and alternatives, the system design, long-term engineering decisions, and a phased implementation blueprint that maps to the PRD's features. Use whenever asked for architecture, tech stack, system design, technical design, or an ADR for a product, or when planning how to build the features in a PRD. Read the PRD; do not re-derive requirements from the raw idea.
---

# ADR Authoring

Read `prd.md`. Recommend how to build it. Every major decision must show the choice, why, the realistic alternatives, and the tradeoff — reasoned recommendations, not dogma. Write a single Markdown file `adr.md` in this structure:

## 1. Metadata (YAML: title, version, date, status, source: prd.md)
## 2. Context & Requirements Summary
Distill from the PRD: what's being built, scale expectations, key constraints (budget, team size, timeline, compliance), and the non-functional targets that drive architecture.
## 3. Decision Drivers
The specific forces (scale, latency, offline, data sensitivity, team skills, cost) that constrain the choices.
## 4. Recommended Technology Stack
A table per layer — **Layer | Choice | Why | Alternatives considered | Tradeoff** — covering: frontend framework, styling/UI, state/data-fetching, backend/API, database, auth, file/storage, hosting/deploy, background jobs, and any critical third-party services. Choices must be internally consistent (they must work together).
## 5. System Design
Components and their responsibilities, the request/data flow between them, and 1–2 key sequences described step by step (e.g. the primary user action end to end). Keep it text-first and precise.
## 6. Data Architecture
Storage model, schema approach, migrations/versioning, and how the PRD's entities map to tables/collections.
## 7. Long-term Engineering Decisions
Testing strategy, CI/CD, observability/logging, security posture, scalability plan, and maintainability conventions — the choices that keep the codebase healthy past MVP.
## 8. Key Decisions (ADR entries)
For the 3–6 most consequential choices, an entry each: **ADR-00n — <title>**: Context / Decision / Alternatives / Consequences.
## 9. Implementation Blueprint
A phased plan that maps PRD features (FR ids) to build order and milestones, with dependencies. Phase 1 = thinnest end-to-end slice.
## 10. Risks & Mitigations

Be concrete: name actual technologies and versions where it matters, real numbers where the PRD gives them.
