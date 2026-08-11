---
description: Generate a real runnable starter (folder structure, package.json, hello-world) from the latest ADR's chosen stack.
agent: jumpstart
---
Run only the scaffolding step: find the latest output/<slug>/adr.md, invoke @scaffolder to extract stack.json and run the deterministic generator, then report the output/<slug>/starter/ path plus the run instructions from its generated README.
