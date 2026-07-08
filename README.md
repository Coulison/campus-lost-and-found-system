# DEVCON Jumpstart Agent Kit

Turn a one-line product idea into a full set of **development-ready planning documents** — a PRD, a user-flow, an architecture decision record, and a design system — using **free-tier AI models**, inside whichever agent CLI you already use (**OpenCode**, **Claude Code**, or **Cursor**).

It's built for hackathons, workshops, and jumpstarting real projects: describe what you want to build in one sentence, run one command, and get clean Markdown docs an engineering team can execute from directly.

---

## Table of contents

- [What it is](#what-it-is)
- [What it produces](#what-it-produces-expected-output)
- [Features](#features)
- [How it works](#how-it-works)
- [Prerequisites](#prerequisites)
- [Install](#install)
- [Usage](#usage)
- [Expected output in detail](#expected-output-in-detail)
- [Models — fully agnostic](#models--fully-agnostic)
- [Directory structure](#directory-structure)
- [Extending the kit](#extending-the-kit)
- [Troubleshooting](#troubleshooting)

---

## What it is

The Jumpstart Kit is a **model-agnostic, tool-agnostic agent kit**. Its guiding principle:

> **The brain is portable; the wiring is an adapter.**

- **`core/` — the portable brain.** All the intelligence lives in vendor-neutral `SKILL.md` skills (a cross-tool open standard), a JSON schema, a deterministic Python renderer, and a shared `AGENTS.md` rulebook. Written once, identical everywhere.
- **`adapters/<tool>/` — thin per-tool wiring.** Only the agent/command definitions and provider config differ per tool. Swapping tools never touches the brain.

Because the whole pipeline is also described in one `workflow-orchestration` skill, a tool **without** subagents (like Cursor) can run the entire thing single-agent. The multi-subagent split used by OpenCode and Claude Code is an optimization (isolation, least-privilege, parallelism), not a requirement.

---

## What it produces (expected output)

Every run creates a self-contained folder `output/<slug>/` (where `<slug>` is a kebab-case of your idea, so runs never overwrite each other):

| File | What it is |
|---|---|
| `intent.json` | Structured intent inferred from your idea, with every assumption recorded explicitly. |
| `prd.md` | **Development-ready PRD** — feature specs with `Given/When/Then` acceptance criteria, a data model, system interactions, non-functional targets, and a concrete WCAG 2.2 AA accessibility section. |
| `flow.json` | The primary user flow as a schema-validated graph (stages, nodes, decision branches). |
| `user-flow.md` | The flow rendered as readable Markdown — numbered steps grouped by stage, `→` transitions and `⤷` decision branches, plus decision-points / exit-points / edge-cases sections. |
| `adr.md` | **Architecture Decision Record** — recommended stack (with alternatives + tradeoffs), system design, long-term engineering choices, and a phased implementation blueprint that maps to the PRD's features. |
| `design-system.md` | **Design system** — a UI approach fitted to the product, foundations with real contrast ratios, a component inventory with states, and design tokens aligned to the ADR's chosen frontend stack. |
| `run.json` | A manifest listing every artifact path produced. |

`/jumpstart` produces the first four (`intent` → `prd` → `flow` → `user-flow`). `/blueprint` produces all of them.

---

## Features

- **Idea → four docs in one command.** PRD, user-flow, ADR, and design system, all cross-referenced by file path.
- **Development-ready depth, not summaries.** Per-feature acceptance criteria, a draftable data model, states & edge cases, and accessibility baked in as a first-class section.
- **Deterministic diagrams.** The user flow is never hand-written by the model — it's rendered by a Python script from a schema-checked JSON graph, which removes structural/syntax hallucination entirely and keeps the flow format consistent.
- **Read-only validator with a 1-retry loop.** A least-privilege reviewer checks each doc against its authoring checklist and returns `PASS` or a concrete `GAPS` list; the author fixes gaps exactly once (respecting free-tier rate limits).
- **Free-tier friendly.** Low temperature everywhere, minimal tool surfaces, capped retries — designed to run reliably on free models.
- **Works in three tools today.** OpenCode, Claude Code, and Cursor — same commands, same output.
- **Runnable from the repo root.** One install command symlinks everything into the root, so you open your tool at the root and the commands are already there — no `cd`-ing into subfolders.
- **Model-agnostic.** No model IDs are hardcoded; every agent inherits whatever model you select in your tool.
- **Scalable by addition.** A new capability = one skill + one agent + one command, with zero rewrites to what exists.

---

## How it works

### The pipeline

```
idea
  └─▶ intent.json      (clarifier — infers intent, records assumptions)
        └─▶ prd.md      (prd-author — loads the prd-authoring skill)
              └─▶ PASS | GAPS   (validator — read-only; author fixes gaps once)
                    └─▶ flow.json        (flow-architect — enriched graph)
                          └─▶ user-flow.md   (render_flow.py — deterministic, no LLM)
                                └─▶ adr.md         (architect — reads prd.md)
                                      └─▶ design-system.md   (designer — reads prd.md + adr.md)
                                            └─▶ run.json      (manifest)
```

Each step reads the previous artifact **by file path**, not by re-deriving from the idea — so downstream docs stay consistent with upstream ones.

### The three building blocks

- **Skills** (`core/skills/*/SKILL.md`) — the reusable know-how: how to author a PRD, how to model a flow, how to write an ADR, how to design a system, and how to orchestrate the whole pipeline. These are the portable brain.
- **Agents** (`adapters/<tool>/…`) — narrow specialists (`clarifier`, `prd-author`, `flow-architect`, `architect`, `designer`, `validator`) plus, in OpenCode, a primary `jumpstart` orchestrator. Each has a single responsibility and a minimal tool surface (the validator is read-only).
- **Commands** — the slash commands (`/jumpstart`, `/adr`, `/design-system`, `/blueprint`) that kick off a whole run or a single step.

### Why the flow is JSON-then-rendered

The fragile LLM step produces *checkable data* (nodes, edges, conditions, stages). Turning that data into a readable `user-flow.md` is pure Python (`render_flow.py`). This is the single most important reliability decision in the kit: it removes diagram hallucination and makes the flow layer swappable later without touching any agent.

---

## Prerequisites

- **An agent CLI:** [OpenCode](https://opencode.ai/docs), [Claude Code](https://docs.claude.com/en/docs/claude-code), or [Cursor](https://cursor.com).
- **Python 3** on your PATH (`python3`) — runs the deterministic flow renderer.
- **A model API key.** For OpenCode, a free **OpenRouter** or **Groq** key works; authenticate with `opencode auth login`. (Claude Code / Cursor use their own model access.)
- **git** + optionally the **GitHub CLI** (`gh`) if you plan to clone/fork.

---

## Install

Clone the repo, then run the installer for your tool from the repo root. It symlinks the portable `core/` and your tool's adapter **into the repo root**, so the tool is runnable there directly.

```bash
git clone https://github.com/kienserapio/devcon.agent-kit.git
cd devcon.agent-kit

./scripts/install.sh opencode      # or: claude | cursor | all
```

What lands at the repo root:

| Command | Creates at root |
|---|---|
| `./scripts/install.sh opencode` | `.opencode/{agent,command,skills}`, `opencode.json`, `AGENTS.md` |
| `./scripts/install.sh claude` | `.claude/{agents,commands,skills}`, `CLAUDE.md`, `AGENTS.md` |
| `./scripts/install.sh cursor` | `.cursor/{rules,commands,skills}`, `AGENTS.md` |
| `./scripts/install.sh all` | all of the above (they coexist) |

The installer is **idempotent** — re-run it any time. Everything is symlinked back to `core/` and the adapters, so editing a skill once updates every tool.

> **Why symlinks?** Cross-directory skill discovery isn't dependable across tools, so the installer links each tool's config next to its skills at the root. The adapters remain the source of truth; the root just points at them. (These root symlinks are regenerated by the installer, so they're git-ignored — always run `install.sh` after cloning.)

Then authenticate and pick a model:

```bash
opencode auth login       # OpenRouter/Groq → free key (once), for OpenCode
opencode                  # open at the repo root; choose a model with /models
```

---

## Usage

Open your tool **at the repo root** and run one step or the whole pipeline:

| Command | Does | Reads |
|---|---|---|
| `/jumpstart <idea>` | Builds the PRD + user-flow | your idea |
| `/adr` | Builds the ADR | the latest `output/<slug>/prd.md` |
| `/design-system` | Builds the design system | the latest `prd.md` + `adr.md` |
| `/blueprint <idea>` | Builds all four documents end-to-end | your idea |

**Examples**

```
/jumpstart a mobile app for booking barangay health center appointments
/blueprint a simple event RSVP tool for a campus org
```

- Use **`/blueprint`** for a complete one-shot run — it reads each artifact directly, so there's no "find the latest PRD" guessing.
- Use the **`/jumpstart` → `/adr` → `/design-system`** chain when you want to review or edit the PRD before generating the downstream docs. (These standalone steps locate the most recent `output/<slug>/` run, so run `/jumpstart` first.)
- In **Cursor** (no subagents) the same commands run single-agent via the `workflow-orchestration` skill; if your Cursor version doesn't surface `.cursor/commands`, just type "jumpstart &lt;idea&gt;" and the `.cursor/rules` guidance kicks in.

### Render a user flow standalone (no LLM)

The renderer is a plain, deterministic script you can run on any schema-valid `flow.json`:

```bash
python3 core/skills/flow-graph/scripts/render_flow.py output/<slug>/flow.json
```

It validates the graph and writes `user-flow.md` beside it. If validation fails it prints the exact problem — fix the JSON and re-run; never edit the `.md` by hand.

---

## Expected output in detail

A finished `/blueprint` run looks like:

```
output/
└── barangay-health-appointment-app/
    ├── intent.json
    ├── prd.md
    ├── flow.json
    ├── user-flow.md
    ├── adr.md
    ├── design-system.md
    └── run.json
```

A slice of a generated `user-flow.md`:

```markdown
# User Flow — Barangay Health Appointment

> A resident books a health-center appointment and receives confirmation.

**Legend:** `1.` step in sequence · `→` leads to · `⤷` decision branch

## Stage: Booking

3. **Pick service** — Resident chooses the type of consultation needed.
   → **Slot available?**
4. **Slot available?** — System checks the schedule for open slots that day.
   - ⤷ *Yes* → **Confirm booking** — slots open today
   - ⤷ *No* → **Join waitlist** — fully booked
```

The PRD's feature specs use `Given/When/Then` acceptance criteria and a WCAG 2.2 AA table; the ADR includes a per-layer stack table with alternatives and a phased blueprint mapping `FR-xx` ids; the design system states real contrast ratios for each color pair and lists design tokens matching the ADR's frontend stack.

---

## Models — fully agnostic

**No model is hardcoded anywhere.** `opencode.json` has no `model` field and no agent frontmatter has a `model:` line, so every agent inherits **whatever model you select in your tool**. This is deliberate — it prevents "model not found" errors from stale or region-locked free-tier model IDs.

- **OpenCode:** pick a model with `/models`, or set a default in `~/.config/opencode/opencode.json`.
- **Pin specific models (optional):** add a `model:` line back to individual agent frontmatter and/or a project `"model"` in `opencode.json`, using IDs your account can actually reach.

---

## Directory structure

```
devcon.agent-kit/
├── README.md
├── scripts/install.sh                       # symlinks core + a tool's adapter INTO the repo root
├── core/                                     # ---- PORTABLE BRAIN (tool-agnostic) ----
│   ├── AGENTS.md                             # shared house rules
│   └── skills/
│       ├── workflow-orchestration/SKILL.md   # runs the full pipeline single-agent if needed
│       ├── prd-authoring/                    # SKILL.md + references/prd-template.md
│       ├── flow-graph/                       # SKILL.md + references/flow-schema.json + scripts/render_flow.py
│       ├── adr-authoring/SKILL.md
│       └── design-system-authoring/SKILL.md
├── adapters/                                 # ---- THIN PER-TOOL WIRING ----
│   ├── opencode/    opencode.json + .opencode/{agent,command}/
│   ├── claude-code/ .claude/{agents,commands}/
│   └── cursor/      .cursor/{rules,commands}/
└── output/                                   # generated runs land here as output/<slug>/
```

---

## Extending the kit

**Add a capability** (e.g. a test-plan generator):
1. Add `core/skills/<name>/SKILL.md` (the reusable know-how + any scripts/schemas).
2. Add an agent to each adapter (`adapters/<tool>/…`).
3. Add a command (`<name>.md`) to each adapter.
4. Add one step to the `workflow-orchestration` skill.

Nothing existing changes.

**Add a tool** (e.g. Codex):
1. Create `adapters/<tool>/` with that tool's agent/command schema.
2. Add an `install_<tool>` case to `scripts/install.sh`.
3. Run it. The `core/` brain never changes.

---

## Troubleshooting

- **Commands (`/jumpstart`, `/adr`, …) don't appear.** You opened the tool in a folder without its config. Run `./scripts/install.sh <tool>` from the repo root, then open the tool **at the repo root**. Tools read their config at launch and don't hot-reload — fully quit and relaunch after installing.
- **"Model not found."** The kit ships model-agnostic, so this comes from a stale selection or a hardcoded model you added. Pick a model your account can reach (`/models` in OpenCode). Fully quit and relaunch — running servers cache old config.
- **Broken symlinks after cloning.** The root `.opencode/.claude/.cursor` links are generated. Run `./scripts/install.sh <tool>` (or `all`) once after cloning to (re)create them.
- **Flow renderer prints `FLOW GRAPH INVALID`.** The `flow.json` violates the schema (e.g. a decision with fewer than two labeled branches). Fix the JSON per the printed message and re-run the renderer.

---

Built for DEVCON. Idea in, blueprint out.
