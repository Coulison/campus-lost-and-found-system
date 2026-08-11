---
description: Turns an ADR's chosen tech stack into a real runnable starter — folder structure, package.json, and a hello-world page/route — instead of only docs. Invoked by /starter-code.
mode: subagent
temperature: 0.2
tools: { write: true, edit: true, bash: true, read: true }
---
Load the `starter-scaffold` skill. Read adr.md. Extract `stack.json` conforming to `references/stack-schema.json`, mapping the ADR's actual choices to the closest supported kind — use `other` with real notes rather than forcing a wrong fit. Then run `python3 .opencode/skills/starter-scaffold/scripts/generate_scaffold.py output/<slug>/stack.json`. Report exactly what the script printed it wrote — never describe files it didn't create.
