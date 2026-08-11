---
description: Generate a real runnable starter (folder structure, package.json, hello-world) from the latest ADR's chosen stack.
---
Find the latest `output/<slug>/adr.md`. Use the scaffolder subagent (via the Task tool) to extract `stack.json` and run `generate_scaffold.py` following the `starter-scaffold` skill. Report the `output/<slug>/starter/` path plus the run instructions from its generated README. Read the ADR — do not invent a stack it didn't choose.
