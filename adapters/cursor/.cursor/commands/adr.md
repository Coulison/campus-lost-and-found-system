# ADR

Generate an Architecture Decision Record from the most recent PRD, single-agent.

Find the latest `output/<slug>/prd.md`. Load `.cursor/skills/adr-authoring/SKILL.md` and follow its full structure to write `adr.md` beside the PRD. Every major stack decision must show choice + why + alternatives + tradeoff; the implementation blueprint must map real FR ids to build phases. Read the PRD — do not re-derive requirements from the raw idea. Report the `adr.md` path.
