# Claude Code adapter

Wires the portable `core/` brain into Claude Code, then makes the **repo root** runnable.

## Install
From the repo root:
```
./scripts/install.sh claude
```
This symlinks into the repo root:
- `.claude/agents` → the 9 subagents here (clarifier, prd-author, flow-architect, scoper, architect, scaffolder, designer, pitch-writer, validator)
- `.claude/commands` → the 7 slash commands (`/jumpstart`, `/scope`, `/adr`, `/starter-code`, `/design-system`, `/pitch-deck`, `/blueprint`)
- `.claude/skills/*` → `core/skills/*`
- `CLAUDE.md` and `AGENTS.md` → `core/AGENTS.md`

## Use
Open Claude Code at the repo root and run `/jumpstart <idea>` or `/blueprint <idea>`. The main agent orchestrates and delegates to the subagents via the Task tool.

## Notes
- Frontmatter uses Claude Code's schema (`name`, `description`, `tools`); models are omitted so agents inherit your selected model.
- There is no `jumpstart` *subagent* — in Claude Code the main agent is the orchestrator; the pipeline logic lives in the `/jumpstart` + `/blueprint` commands and the `workflow-orchestration` skill.
