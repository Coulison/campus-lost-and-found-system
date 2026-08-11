# Cursor adapter

Wires the portable `core/` brain into Cursor, then makes the **repo root** runnable.

## Install
From the repo root:
```
./scripts/install.sh cursor
```
This symlinks into the repo root:
- `.cursor/rules` → `jumpstart.mdc` (guidance the model auto-applies to jumpstart/blueprint requests)
- `.cursor/commands` → the 5 commands (`/jumpstart`, `/scope`, `/adr`, `/design-system`, `/blueprint`)
- `.cursor/skills/*` → `core/skills/*`
- `AGENTS.md` → `core/AGENTS.md`

## Use
Open Cursor at the repo root. Cursor has **no subagents**, so the whole pipeline runs single-agent: invoke `/jumpstart` or `/blueprint` (or just describe your idea), and the model follows the `workflow-orchestration` skill, doing each step itself.

## Notes
- `.cursor/rules/*.mdc` is Cursor's stable, well-supported mechanism. `.cursor/commands/` is honored by recent Cursor versions; if your version doesn't surface them, use the rule (just say "jumpstart <idea>") — the rule points at the same skill.
- `.cursor/skills` follows the kit's portability convention; the deterministic `render_flow.py` runs regardless via `python3 .cursor/skills/flow-graph/scripts/render_flow.py`.
