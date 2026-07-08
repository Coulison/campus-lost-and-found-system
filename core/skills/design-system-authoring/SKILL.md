---
name: design-system-authoring
description: Produce a development-ready design system from a PRD and its ADR — choosing a UI approach that fits the product and audience, and turning the PRD's WCAG accessibility requirements into concrete, testable design rules. Use whenever asked for a design system, UI guidelines, component library spec, visual language, or style guide for a product. Read the PRD (esp. its accessibility section) and the ADR (for the chosen frontend stack); tailor the UI to the actual product, not a generic template.
---

# Design System Authoring

Read `prd.md` (features, personas, and the WCAG section) and `adr.md` (the chosen frontend/styling stack). First reason explicitly about what KIND of UI the product needs — a data-dense operations tool, a calm consumer app, a form-heavy workflow, etc. — and let that drive the system. Then write a single Markdown file `design-system.md`:

## 1. Metadata (YAML: title, version, date, status, source: prd.md, adr.md)
## 2. UX Character & Rationale
From the product type + personas: the interaction tone, density, and patterns that fit, and why. Name the reference archetype (dashboard / marketplace / editor / etc.).
## 3. Design Principles (3–5, product-specific)
## 4. Foundations
- **Color** — palette with semantic roles (primary, surface, text, success/warn/error). For every text/background pair used, state the **contrast ratio** and confirm it meets the WCAG level the PRD requires (≥4.5:1 body, ≥3:1 large/UI). 
- **Typography** — families, type scale, weights, line-height.
- **Spacing & layout** — base unit, spacing scale, grid/breakpoints.
- **Radius, elevation, iconography.**
## 5. Components (inventory)
Each component (`CMP-<name>`): purpose, variants, and ALL states (default, hover, focus, active, disabled, loading, error, empty). Cover at least: buttons, inputs, select, checkbox/radio, card, nav, modal/dialog, table/list, toast, and empty/loading/error states.
## 6. Accessibility Specifications
Map each WCAG criterion from the PRD to a concrete, testable design rule: visible focus style, minimum target size (≥24×24 CSS px, 44px for primary touch), keyboard operability per component, form labels/errors, reduced-motion behavior, and non-color status indicators.
## 7. Patterns
Forms, navigation, and feedback patterns for this product.
## 8. Implementation Notes
Express foundations as **design tokens** and align them to the ADR's frontend stack (e.g. a Tailwind theme / shadcn tokens if that's the chosen stack). Give token names.
## 9. Content & Voice (brief)
