# DEVCON Jumpstart Agent Kit — Build Brief v2
### Idea → Detailed PRD → User-Flow (MD) → Architecture Decision Record → Design System
### Restructured to be tool-agnostic (OpenCode, Claude Code, Cursor, Codex, …)

> **How to run this:** Open your agent tool in the existing kit folder (or an empty one), switch to its build/agent mode, and paste this whole document with: *"Apply this v2 spec exactly. Create/replace every file with the contents given. Do not improvise structure, model IDs, or section lists. Run the §9 self-check when done."* The file contents are fully specified so the build is deterministic even on a free model.

---

## 1. What changes in v2 (summary)

1. **PRD is now development-ready**: complete feature specs with acceptance criteria, data model, and states — no more word budgets.
2. **User flow is a Markdown file** (`user-flow.md`), numbered steps with `→` and `⤷` branch arrows, rendered deterministically from an enriched flow graph. Mermaid is retired from the primary path.
3. **New capability: Architecture Decision Record** (`/adr`) — reads the PRD, recommends the stack, system design, long-term engineering choices, and a phased implementation blueprint.
4. **New capability: Design System** (`/design-system`) — reads the PRD + its WCAG section + the ADR's chosen frontend stack, and produces an accessible, product-appropriate design system.
5. **Very agnostic structure**: all intelligence lives in portable `SKILL.md` files + scripts + `AGENTS.md` (the open standards). Each tool gets a thin adapter. One `install.sh` symlinks the portable core into whichever tool's skills directory.

---

## 2. The agnostic principle (build to this)

The **brain is portable, the wiring is an adapter.** Concretely:

- **Portable core** — `SKILL.md` skills (a real cross-tool standard read by OpenCode, Claude Code, Cursor, Codex), the deterministic scripts, the JSON schema, and `AGENTS.md` (the vendor-neutral steering standard). Written once, identical everywhere.
- **Per-tool adapter** — agent/subagent definitions, slash commands, and model/provider config. These formats differ per tool, so each tool gets its own small folder.
- **Single-agent capable**: the `workflow-orchestration` skill describes the entire pipeline, so in a tool without subagents (e.g. Cursor) **one** agent can still run the whole thing by reading the skills. The multi-subagent split in the OpenCode adapter is an optimization (isolation, least-privilege, parallelism), not a dependency.

**Rule:** never put workflow logic that another tool would need to reproduce inside a tool-specific agent file. It goes in a skill.

---

## 3. New directory structure to create

```
devcon-jumpstart-kit/
├── README.md
├── scripts/install.sh                       # symlinks core into a tool's skills dir
├── core/                                     # ---- PORTABLE BRAIN (tool-agnostic) ----
│   ├── AGENTS.md                             # house rules (open standard, repo root usage)
│   └── skills/
│       ├── workflow-orchestration/SKILL.md   # runs the full pipeline single-agent if needed
│       ├── prd-authoring/
│       │   ├── SKILL.md
│       │   └── references/prd-template.md
│       ├── flow-graph/
│       │   ├── SKILL.md
│       │   ├── references/flow-schema.json
│       │   └── scripts/render_flow.py        # enriched JSON -> user-flow.md
│       ├── adr-authoring/SKILL.md
│       └── design-system-authoring/SKILL.md
└── adapters/
    ├── opencode/                             # ---- THIN ADAPTER (build + test this one) ----
    │   ├── opencode.json
    │   ├── .opencode/agent/
    │   │   ├── jumpstart.md   (primary orchestrator)
    │   │   ├── clarifier.md
    │   │   ├── prd-author.md
    │   │   ├── flow-architect.md
    │   │   ├── architect.md   (ADR)
    │   │   ├── designer.md    (design system)
    │   │   └── validator.md   (generic, read-only)
    │   └── .opencode/command/
    │       ├── jumpstart.md        /jumpstart <idea>   → PRD + user-flow
    │       ├── adr.md              /adr                → ADR from latest PRD
    │       ├── design-system.md    /design-system      → design system from PRD + ADR
    │       └── blueprint.md        /blueprint <idea>   → full pipeline end-to-end
    ├── claude-code/  (stub: see §8 — add later)
    └── cursor/       (stub: see §8 — add later)
```

`install.sh` symlinks `core/skills/*` into the chosen tool's dir (`.opencode/skills`, `.claude/skills`, or `.cursor/skills`) and `core/AGENTS.md` to the repo root. Each tool reads its own skills directory, so symlinking is the reliable portability mechanism (cross-directory auto-discovery is not dependable).

---

## 4. Shared document style (applies to PRD, ADR, design system)

Every generated document must be **development-usable**: 
- Start with a YAML metadata block (title, version, date, status, source).
- Numbered top-level sections, descriptive `###` subsections.
- Stable IDs where things are referenced later (`FR-01`, `ADR-001`, `CMP-btn`).
- Concrete and specific over generic. No marketing tone, no filler. If unknown, list under Open Questions — never invent.
- Everything downstream reads upstream docs by **file path**, not by re-deriving from the idea.

---

## 5. PORTABLE CORE — file contents

### 5.1 `core/AGENTS.md`
```markdown
# Jumpstart Kit — Operating Rules (portable)

## Pipeline
idea → intent.json → prd.md → flow.json → user-flow.md → adr.md → design-system.md
Each artifact reads the previous by PATH. All artifacts for a run live in `output/<slug>/`.

## Hard rules
- Docs must follow the shared style in each skill (YAML header, numbered sections, stable IDs, concrete detail).
- The user flow is produced ONLY by `render_flow.py` from a schema-valid `flow.json`. Never hand-write the flow.
- Validation is read-only. A validator returns `PASS` or a `GAPS` list; it never edits files.
- Cap any validator retry at ONE iteration (free-tier rate limits).
- Keep temperature ≤0.3 everywhere; these are structured tasks.
- ADR reads prd.md. Design system reads prd.md AND adr.md (for the chosen frontend stack + WCAG criteria).

## Run manifest
Write `run.json` listing every artifact path produced.
```

### 5.2 `core/skills/workflow-orchestration/SKILL.md`
```markdown
---
name: workflow-orchestration
description: The end-to-end Jumpstart pipeline that turns a product idea into a development-ready PRD, a user-flow markdown, an architecture decision record, and a design system. Use this whenever asked to "jumpstart", "blueprint", or scaffold planning docs for a product idea, or when running the full idea-to-plan flow in a tool without subagents. This skill lets a single agent execute the whole pipeline.
---

# Jumpstart Orchestration

Run these steps in order for a product idea. Create `output/<slug>/` (kebab-case slug of the idea). Pass file paths between steps, not contents.

1. **Intent** — infer structured intent from the idea; record assumptions. Write `intent.json`.
2. **PRD** — load `prd-authoring`; write a development-ready `prd.md` from `intent.json`.
3. **Validate PRD** — check against the prd-authoring checklist; fix gaps once.
4. **Flow graph** — load `flow-graph`; write `flow.json` (enriched schema) from `prd.md`.
5. **Render flow** — run `scripts/render_flow.py output/<slug>/flow.json` → `user-flow.md`.
6. **ADR** — load `adr-authoring`; read `prd.md`; write `adr.md`. Validate; fix gaps once.
7. **Design system** — load `design-system-authoring`; read `prd.md` + `adr.md`; write `design-system.md`. Validate; fix gaps once.
8. **Manifest** — write `run.json` with all artifact paths.

If the tool has subagents, delegate each step to a specialist. If not, do each step yourself, loading the named skill first. Individual entry points: PRD+flow only (steps 1–5), ADR only (step 6, requires prd.md), design system only (step 7, requires prd.md + adr.md).
```

### 5.3 `core/skills/prd-authoring/SKILL.md` (now detailed / dev-ready)
```markdown
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
```

### 5.4 `core/skills/prd-authoring/references/prd-template.md`
```markdown
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
```

### 5.5 `core/skills/flow-graph/SKILL.md` (now renders MD, not Mermaid)
```markdown
---
name: flow-graph
description: Extract a product's primary user flow from a PRD as an enriched, schema-valid JSON graph, then render it into a detailed, readable user-flow Markdown file with numbered steps and arrows. Use whenever building a user flow, journey, or process flow from requirements, even if the user just says "make the flow." Never hand-write the flow document; always go through the graph + renderer.
---

# Flow Graph → User-Flow Markdown

Two steps: (1) extract the flow as enriched JSON; (2) a script renders `user-flow.md`. The model never writes the flow document, which removes structural hallucination and keeps output consistent.

## Step 1 — Extract the enriched graph
Conform to `references/flow-schema.json`. Model the PRIMARY end-to-end journey: main happy path plus critical decision branches and their error/exit paths. Requirements:
- Root fields: `title`, `summary` (one sentence), optional `edge_cases` (array of strings).
- Each node: `id` (kebab-case), `type` (`start`|`action`|`decision`|`end`), `stage` (grouping label, e.g. "Onboarding"), `label` (≤7 words), `description` (1–2 clear sentences on what happens here).
- One `start`, ≥1 `end`. Every `decision` has ≥2 outgoing edges, each with a `condition`. Edges may add a `note`.
- Order nodes in the logical sequence a user experiences them (the renderer numbers them in array order, grouped by stage).

## Step 2 — Render (deterministic, no LLM)
```
python3 <this-skill>/scripts/render_flow.py output/<slug>/flow.json
```
Writes `user-flow.md` beside the JSON: numbered steps grouped by stage, `→` for sequential transitions, `⤷ *condition* →` for decision branches, plus Decision-points, Exit-points, and Edge-cases sections. If it prints validation errors, fix `flow.json` and re-run — never edit the .md by hand.
```

### 5.6 `core/skills/flow-graph/references/flow-schema.json`
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["title", "summary", "nodes", "edges"],
  "properties": {
    "title": { "type": "string" },
    "summary": { "type": "string" },
    "edge_cases": { "type": "array", "items": { "type": "string" } },
    "nodes": {
      "type": "array", "minItems": 2,
      "items": {
        "type": "object",
        "required": ["id", "type", "stage", "label", "description"],
        "properties": {
          "id": { "type": "string", "pattern": "^[a-z0-9-]+$" },
          "type": { "enum": ["start", "action", "decision", "end"] },
          "stage": { "type": "string" },
          "label": { "type": "string", "maxLength": 60 },
          "description": { "type": "string" }
        }
      }
    },
    "edges": {
      "type": "array", "minItems": 1,
      "items": {
        "type": "object",
        "required": ["from", "to"],
        "properties": {
          "from": { "type": "string" },
          "to": { "type": "string" },
          "condition": { "type": "string" },
          "note": { "type": "string" }
        }
      }
    }
  }
}
```

### 5.7 `core/skills/flow-graph/scripts/render_flow.py`
```python
#!/usr/bin/env python3
"""Render an enriched flow-graph JSON into a detailed, readable user-flow Markdown
(numbered steps + arrows + decision branches). Deterministic. No LLM, no network.
Usage: python3 render_flow.py path/to/flow.json   ->  writes user-flow.md beside it.
"""
import sys, json
from pathlib import Path

def validate(g):
    errs = []
    for k in ("title", "summary", "nodes", "edges"):
        if k not in g: errs.append(f"missing root field: {k}")
    nodes = g.get("nodes", [])
    ids = [n.get("id") for n in nodes]
    if len(ids) != len(set(ids)): errs.append("duplicate node ids")
    for n in nodes:
        for f in ("id", "type", "stage", "label", "description"):
            if f not in n: errs.append(f"node {n.get('id','?')} missing '{f}'")
    types = [n.get("type") for n in nodes]
    if types.count("start") != 1: errs.append("need exactly one start node")
    if types.count("end") < 1: errs.append("need at least one end node")
    idset = set(ids)
    for e in g.get("edges", []):
        if e["from"] not in idset or e["to"] not in idset:
            errs.append(f"edge references unknown node: {e}")
    for n in nodes:
        if n.get("type") == "decision":
            outs = [e for e in g["edges"] if e["from"] == n["id"]]
            if len(outs) < 2: errs.append(f"decision '{n['id']}' needs >=2 branches")
            if any(not e.get("condition") for e in outs):
                errs.append(f"decision '{n['id']}' has an unlabeled branch")
    return errs

def label_of(nodes, nid):
    return next((n["label"] for n in nodes if n["id"] == nid), nid)

def render(g):
    nodes, edges = g["nodes"], g["edges"]
    out = [f"# User Flow — {g['title']}\n", f"> {g['summary']}\n",
           "**Legend:** `1.` step in sequence · `→` leads to · `⤷` decision branch\n"]
    stages = []
    for n in nodes:
        if n["stage"] not in stages: stages.append(n["stage"])
    step = 0
    for stage in stages:
        out.append(f"\n## Stage: {stage}\n")
        for n in [x for x in nodes if x["stage"] == stage]:
            step += 1
            tag = {"start": " _(entry)_", "end": " _(exit)_"}.get(n["type"], "")
            out.append(f"{step}. **{n['label']}**{tag} — {n['description']}")
            outs = [e for e in edges if e["from"] == n["id"]]
            if n["type"] == "decision" or len(outs) > 1:
                for e in outs:
                    note = f" — {e['note']}" if e.get("note") else ""
                    out.append(f"   - ⤷ *{e.get('condition','(unconditional)')}* "
                               f"→ **{label_of(nodes, e['to'])}**{note}")
            elif len(outs) == 1:
                e = outs[0]
                note = f" — {e['note']}" if e.get("note") else ""
                out.append(f"   → **{label_of(nodes, e['to'])}**{note}")
    dec = [n for n in nodes if n["type"] == "decision"]
    if dec:
        out.append("\n## Decision points\n")
        for d in dec:
            conds = [e.get("condition", "?") for e in edges if e["from"] == d["id"]]
            out.append(f"- **{d['label']}** — {' / '.join(conds)}")
    out.append("\n## Exit points\n")
    for e in [n for n in nodes if n["type"] == "end"]:
        out.append(f"- **{e['label']}** — {e['description']}")
    if g.get("edge_cases"):
        out.append("\n## Edge cases & error paths\n")
        for c in g["edge_cases"]:
            out.append(f"- {c}")
    return "\n".join(out) + "\n"

def main():
    if len(sys.argv) != 2: sys.exit("usage: render_flow.py <flow.json>")
    src = Path(sys.argv[1])
    g = json.loads(src.read_text())
    errs = validate(g)
    if errs:
        print("FLOW GRAPH INVALID:")
        for e in errs: print("  -", e)
        sys.exit(1)
    dst = src.with_name("user-flow.md")
    dst.write_text(render(g))
    print(f"WROTE {dst}")

if __name__ == "__main__":
    main()
```

### 5.8 `core/skills/adr-authoring/SKILL.md`
```markdown
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
```

### 5.9 `core/skills/design-system-authoring/SKILL.md`
```markdown
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
```

---

## 6. OPENCODE ADAPTER — file contents

### 6.1 `adapters/opencode/opencode.json`
```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "openrouter/deepseek/deepseek-v4-flash:free",
  "instructions": ["AGENTS.md"],
  "permission": {
    "edit": "allow",
    "bash": { "*": "ask", "python3 *": "allow", "node *": "allow", "npx *": "allow" }
  }
}
```
> Fallback non-reasoning model: `openrouter/openai/gpt-oss-120b:free`. Escape hatch: `openrouter/free`. Groq: `groq/llama-3.3-70b-versatile`. Model IDs live only here + in agent frontmatter.

### 6.2 `adapters/opencode/.opencode/agent/jumpstart.md` (primary)
```markdown
---
description: Primary orchestrator. Turns a product idea into a development-ready PRD, a user-flow markdown, an ADR, and a design system by delegating to specialists. Use for any idea-to-plan, blueprint, PRD, ADR, or design-system request.
mode: primary
model: openrouter/deepseek/deepseek-v4-flash:free
temperature: 0.2
tools: { write: true, edit: true, bash: true, read: true }
---
You coordinate specialists; you do not author documents yourself. Load the `workflow-orchestration` skill and follow its pipeline. Create `output/<slug>/`. Delegate with the Task tool, passing file PATHS:

- @clarifier → intent.json
- @prd-author → prd.md (from intent.json)
- @validator → validate prd.md against prd-authoring; if GAPS, one revision via @prd-author
- @flow-architect → flow.json ; then run: python3 .opencode/skills/flow-graph/scripts/render_flow.py output/<slug>/flow.json
- @architect → adr.md (reads prd.md) ; @validator once
- @designer → design-system.md (reads prd.md + adr.md) ; @validator once

For `/jumpstart` do steps through the flow only. For `/blueprint` do all steps. For `/adr` and `/design-system` run only that specialist against existing artifacts. Finish by writing run.json and replying with each artifact path + a 2-line summary each. No other preamble.
```

### 6.3 `adapters/opencode/.opencode/agent/clarifier.md`
```markdown
---
description: Converts a terse product idea into a structured intent JSON, filling gaps with explicit, recorded assumptions. Invoked before PRD authoring.
mode: subagent
model: openrouter/openai/gpt-oss-120b:free
temperature: 0.2
tools: { write: true, edit: false, bash: false, read: true }
---
Turn the idea into `intent.json` in the run folder: { product_name, one_liner, problem, target_users[], primary_jobs_to_be_done[], core_features[], constraints[], assumptions[], out_of_scope[] }. Do not ask the user — infer and record every assumption. JSON only, no prose.
```

### 6.4 `adapters/opencode/.opencode/agent/prd-author.md`
```markdown
---
description: Writes a complete, development-ready PRD (full feature specs, acceptance criteria, data model, WCAG section) from intent.json. May be re-invoked to fix validator gaps.
mode: subagent
model: openrouter/deepseek/deepseek-v4-flash:free
temperature: 0.2
tools: { write: true, edit: true, bash: false, read: true }
---
Load the `prd-authoring` skill and follow it fully, including per-feature acceptance criteria and the concrete WCAG section. Read intent.json; write prd.md in the run folder. Given a GAPS list, revise prd.md to close each gap. Output only the file.
```

### 6.5 `adapters/opencode/.opencode/agent/flow-architect.md`
```markdown
---
description: Extracts the primary user flow from a PRD as an enriched, schema-valid flow.json (stages, node descriptions, decision branches). Never writes the flow document. Invoked after the PRD passes validation.
mode: subagent
model: openrouter/deepseek/deepseek-v4-flash:free
temperature: 0.2
tools: { write: true, edit: false, bash: false, read: true }
---
Load the `flow-graph` skill. Read prd.md (User Stories + Feature Specifications). Write flow.json conforming to references/flow-schema.json: one start, ≥1 end, every decision has ≥2 conditioned branches, each node has stage + label + a 1–2 sentence description, plus root title/summary and edge_cases[]. Output only the JSON. The renderer script produces the markdown, not you.
```

### 6.6 `adapters/opencode/.opencode/agent/architect.md`
```markdown
---
description: Writes a complete Architecture Decision Record from a PRD — recommended stack with alternatives, system design, long-term engineering choices, and a phased implementation blueprint. Invoked by /adr or /blueprint.
mode: subagent
model: openrouter/deepseek/deepseek-v4-flash:free
temperature: 0.2
tools: { write: true, edit: true, bash: false, read: true }
---
Load the `adr-authoring` skill. Read prd.md. Write adr.md following the skill's full structure. Every major stack decision must show choice + why + alternatives + tradeoff, and the choices must be mutually consistent. The implementation blueprint must map real FR ids to build phases. Output only the file.
```

### 6.7 `adapters/opencode/.opencode/agent/designer.md`
```markdown
---
description: Writes a development-ready, accessible design system from a PRD and its ADR — a UI approach fitted to the product, foundations with real WCAG contrast ratios, a component inventory with states, and tokens aligned to the chosen frontend stack. Invoked by /design-system or /blueprint.
mode: subagent
model: openrouter/deepseek/deepseek-v4-flash:free
temperature: 0.2
tools: { write: true, edit: true, bash: false, read: true }
---
Load the `design-system-authoring` skill. Read prd.md (esp. accessibility) and adr.md (chosen frontend/styling stack). First reason about what UI archetype fits this product and audience, then write design-system.md following the skill's structure. Every color pair must state its contrast ratio against the PRD's WCAG target. Tokens must match the ADR's stack. Output only the file.
```

### 6.8 `adapters/opencode/.opencode/agent/validator.md` (generic, read-only)
```markdown
---
description: Read-only document reviewer. Validates any generated doc (PRD, ADR, design system) against the checklist in its authoring skill and returns PASS or a concrete GAPS list. Never edits files.
mode: subagent
model: openrouter/openai/gpt-oss-120b:free
temperature: 0.1
tools: { write: false, edit: false, bash: false, read: true }
permission: { edit: "deny", bash: "deny" }
---
You are told which file to check and which authoring skill it should satisfy. Load that skill's requirements and verify the doc: all required sections present; the shared dev-ready style (YAML header, numbered sections, stable IDs, concrete detail) followed; no invented facts contradicting upstream artifacts; for PRDs, every feature has Given/When/Then acceptance criteria and the WCAG section names concrete criteria; for ADRs, each major decision lists alternatives + tradeoffs and the blueprint maps FR ids; for design systems, every color pair states a contrast ratio meeting the WCAG target. Reply with `PASS` or `GAPS:` + a short actionable bullet list. Nothing else.
```

### 6.9 Commands
`adapters/opencode/.opencode/command/jumpstart.md`
```markdown
---
description: Idea → development-ready PRD + user-flow markdown.
agent: jumpstart
---
Run the pipeline through the user flow (steps 1–5) for this idea:

$ARGUMENTS
```
`adapters/opencode/.opencode/command/adr.md`
```markdown
---
description: Generate an Architecture Decision Record from the most recent PRD.
agent: jumpstart
---
Run only the ADR step: find the latest output/<slug>/prd.md, invoke @architect to write adr.md, validate once, and report the path.
```
`adapters/opencode/.opencode/command/design-system.md`
```markdown
---
description: Generate a design system from the most recent PRD + ADR.
agent: jumpstart
---
Run only the design-system step: read the latest output/<slug>/prd.md and adr.md, invoke @designer to write design-system.md, validate once, and report the path.
```
`adapters/opencode/.opencode/command/blueprint.md`
```markdown
---
description: Full pipeline — PRD, user flow, ADR, and design system.
agent: jumpstart
---
Run the COMPLETE workflow-orchestration pipeline (all steps) for this idea:

$ARGUMENTS
```

---

## 7. `scripts/install.sh`
```bash
#!/usr/bin/env bash
# Symlink the portable core into a tool's skills directory.
# Usage: ./scripts/install.sh [opencode|claude|cursor]
set -euo pipefail
TOOL="${1:-opencode}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
case "$TOOL" in
  opencode) DEST=".opencode/skills" ;;
  claude)   DEST=".claude/skills" ;;
  cursor)   DEST=".cursor/skills" ;;
  *) echo "unknown tool: $TOOL (use opencode|claude|cursor)"; exit 1 ;;
esac
mkdir -p "$DEST"
for skill in "$ROOT"/core/skills/*/; do
  name="$(basename "$skill")"
  ln -sfn "$skill" "$DEST/$name"
done
ln -sfn "$ROOT/core/AGENTS.md" "AGENTS.md"
echo "Linked $(ls "$ROOT"/core/skills | wc -l) skills into $DEST and AGENTS.md into repo root."
```

---

## 8. Adding other tools later (stubs)

- **Claude Code** (`adapters/claude-code/`): run `./scripts/install.sh claude` for the skills; copy the OpenCode agents into `.claude/agents/` changing frontmatter to Claude Code's schema (`name`, `description`, `tools`, `model`); copy commands into `.claude/commands/`; `AGENTS.md`/`CLAUDE.md` at root. Near copy-paste.
- **Cursor** (`adapters/cursor/`): run `./scripts/install.sh cursor`. Cursor has no subagents, so drive it single-agent via the `workflow-orchestration` skill — invoke in chat with the idea. Keep `AGENTS.md` at root for project context.

---

## 9. Self-check (run after building)
1. `find core -type f` and `find adapters/opencode -type f` list every spec file.
2. `./scripts/install.sh opencode` creates symlinks in `.opencode/skills` and an `AGENTS.md` at root.
3. `render_flow.py` on a tiny hand-made enriched `flow.json` writes a `user-flow.md` with numbered steps, `→`, and at least one `⤷` branch.
4. `/blueprint a mobile app for booking barangay health center appointments` produces `output/<slug>/` with: `intent.json`, `prd.md` (full FR specs + Given/When/Then + WCAG table), `flow.json`, `user-flow.md`, `adr.md` (stack table + blueprint mapping FR ids), `design-system.md` (contrast ratios stated), `run.json`.
5. `/adr` and `/design-system` run standalone against existing artifacts.
6. Confirm no agent hand-wrote the user flow, and the validator ran on each doc.

---

## 10. Usage (after build)
1. **Install skills for your tool:** `./scripts/install.sh opencode` (or `claude` / `cursor`).
2. **Auth once:** `opencode auth login` → OpenRouter/Groq → free key.
3. **Run one step or the whole thing:**
   - `/jumpstart <idea>` → PRD + user-flow.
   - `/adr` → architecture record from the latest PRD.
   - `/design-system` → design system from the latest PRD + ADR.
   - `/blueprint <idea>` → all four documents end to end.
4. **Collect:** everything lands in `output/<slug>/` as clean, development-ready Markdown.
5. **Workshop tip:** each attendee uses their own free key; run the full `/blueprint` a couple of times, not in a tight loop (rate limits).
```