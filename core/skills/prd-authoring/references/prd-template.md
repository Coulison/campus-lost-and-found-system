---
title: <Product Name> — PRD
version: 0.1
date: <YYYY-MM-DD>
status: draft
source: intent.json
---

## 1. Overview & Vision
<what it is, who it's for, the outcome it drives>

## 2. Problem & Opportunity
<the problem, evidence/assumptions, why now>

## 3. Target Users & Personas
<2–3 personas: context, goals, frustrations, key tasks>

## 4. Goals, Non-goals & Success Metrics
**Goals:** <bullets>  **Non-goals:** <bullets>
**Success metrics:** <measurable metric → target>

## 5. Feature Specifications
### FR-01 — <Feature name>
- **Purpose:** <one line>
- **User value:** <why it matters>
- **User stories:** As a <user>, I want <capability> so that <benefit>.
- **Behavior:** <detailed functional description>
- **Acceptance criteria:**
  - Given <context>, when <action>, then <result>.
- **States & edge cases:** <empty / loading / error / offline / denied>
- **Dependencies:** <other FRs or services>
<repeat FR-02, FR-03, … for every feature>

## 6. Data Model & Entities
- **<Entity>** — fields: `<name: type>`; relationships: <…>

## 7. System Interactions & Integrations
<external APIs, auth, notifications, background jobs>

## 8. Non-functional Requirements
<performance, reliability, security, privacy, scalability — with targets>

## 9. Accessibility (WCAG 2.2 AA)
| Criterion | Applies to | How it's satisfied |
|---|---|---|
| 1.4.3 Contrast | <surfaces> | <rule> |

## 10. Scope & Phasing
**MVP:** <FR ids>  **Later:** <FR ids + rationale>

## 11. Open Questions & Assumptions
- <honest unknown / inferred assumption>
