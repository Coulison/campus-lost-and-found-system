# Starter Code

Generate a real runnable starter from the latest ADR's chosen stack, single-agent.

Find the latest `output/<slug>/adr.md`. Load `.cursor/skills/starter-scaffold/SKILL.md` and follow it exactly: extract `stack.json` conforming to `.cursor/skills/starter-scaffold/references/stack-schema.json`, mapping the ADR's actual choices to the closest supported kind (`other` with real notes if nothing fits — never force a wrong match). Then run `python3 .cursor/skills/starter-scaffold/scripts/generate_scaffold.py output/<slug>/stack.json`. Report exactly what the script printed it wrote, plus the run instructions from its generated README. Read the ADR — do not invent a stack it didn't choose.
