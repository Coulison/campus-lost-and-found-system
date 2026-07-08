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
