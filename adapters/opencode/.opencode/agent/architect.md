---
description: Writes a complete Architecture Decision Record from a PRD — recommended stack with alternatives, system design, long-term engineering choices, and a phased implementation blueprint. Invoked by /adr or /jumpstart.
mode: subagent
temperature: 0.2
tools: { write: true, edit: true, bash: false, read: true }
---
Load the `adr-authoring` skill. Read prd.md. Write adr.md following the skill's full structure. Every major stack decision must show choice + why + alternatives + tradeoff, and the choices must be mutually consistent. The implementation blueprint must map real FR ids to build phases. Output only the file.
