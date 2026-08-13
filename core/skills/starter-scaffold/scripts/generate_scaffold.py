#!/usr/bin/env python3
"""Assemble a runnable starter scaffold from a schema-valid stack.json.
Deterministic. No LLM, no network, no template guessing.
Usage: python3 generate_scaffold.py path/to/stack.json  ->  writes <slug>/starter/
"""
import sys, json, shutil
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
TEMPLATES = SCRIPT_DIR / "templates"

FRONTEND_KINDS = {"react-vite", "nextjs", "plain-html", "other"}
BACKEND_KINDS = {"node-express", "none", "other"}
DATABASE_KINDS = {"json-file", "supabase", "none", "other"}


def validate(stack):
    errs = []
    for k in ("project_name", "frontend", "backend", "database"):
        if k not in stack:
            errs.append(f"missing root field: {k}")
    if "project_name" in stack:
        import re
        if not re.match(r"^[a-z0-9-]+$", stack["project_name"]):
            errs.append("project_name must be kebab-case (lowercase letters, digits, hyphens)")
    for layer, allowed in (("frontend", FRONTEND_KINDS), ("backend", BACKEND_KINDS), ("database", DATABASE_KINDS)):
        v = stack.get(layer, {})
        if "kind" not in v:
            errs.append(f"{layer}: missing 'kind'")
        elif v["kind"] not in allowed:
            errs.append(f"{layer}.kind '{v['kind']}' not one of {sorted(allowed)}")
    return errs


def fill(text, project_name):
    return text.replace("__PROJECT_NAME__", project_name)


def copy_template(src_dir, dst_dir, project_name):
    """Copy every file in src_dir to dst_dir, filling the project-name placeholder
    in text files. Returns the list of files written (relative to dst root)."""
    written = []
    if not src_dir.exists():
        return written
    for f in sorted(src_dir.rglob("*")):
        if f.is_file():
            rel = f.relative_to(src_dir)
            dst = dst_dir / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            try:
                text = f.read_text(encoding="utf-8")
                dst.write_text(fill(text, project_name), encoding="utf-8")
            except UnicodeDecodeError:
                shutil.copyfile(f, dst)  # binary file, copy as-is
            written.append(str(dst))
    return written


def write_todo(dst_dir, layer, notes):
    dst_dir.mkdir(parents=True, exist_ok=True)
    path = dst_dir / "TODO.md"
    path.write_text(
        f"# {layer.capitalize()} — manual setup needed\n\n"
        f"The ADR chose something outside this kit's starter templates for {layer}.\n\n"
        f"**ADR notes:** {notes or '(none given — check adr.md directly)'}\n\n"
        f"Set this layer up by hand following your ADR's stack table, "
        f"then delete this file once it's replaced with real code.\n",
        encoding="utf-8",
    )
    return [str(path)]


def main():
    if len(sys.argv) != 2:
        sys.exit("usage: generate_scaffold.py <stack.json>")
    src = Path(sys.argv[1])
    stack = json.loads(src.read_text(encoding="utf-8"))

    errs = validate(stack)
    if errs:
        print("STACK SPEC INVALID:")
        for e in errs:
            print("  -", e)
        sys.exit(1)

    name = stack["project_name"]
    frontend = stack["frontend"]
    backend = stack["backend"]
    database = stack["database"]

    out_root = src.with_name("starter")
    out_root.mkdir(parents=True, exist_ok=True)

    written = []
    frontend_dir = None
    backend_dir = None

    # --- frontend ---
    if frontend["kind"] == "plain-html":
        frontend_dir = out_root  # no subfolder — zero build step, files sit at root
        written += copy_template(TEMPLATES / "frontend/plain-html", frontend_dir, name)
    elif frontend["kind"] in ("react-vite", "nextjs"):
        frontend_dir = out_root / "frontend"
        written += copy_template(TEMPLATES / f"frontend/{frontend['kind']}", frontend_dir, name)
    else:  # other
        written += write_todo(out_root / "frontend", "frontend", frontend.get("notes"))

    # --- backend ---
    if backend["kind"] == "node-express":
        backend_dir = out_root / "backend"
        written += copy_template(TEMPLATES / "backend/node-express", backend_dir, name)
    elif backend["kind"] == "other":
        written += write_todo(out_root / "backend", "backend", backend.get("notes"))
    # "none" -> nothing to generate

    # --- database ---
    env_lines = []
    if database["kind"] == "json-file":
        if backend_dir is not None:
            written += copy_template(TEMPLATES / "database/json-file", backend_dir, name)
        else:
            written += write_todo(
                out_root / "database",
                "database",
                "Chose json-file storage but there's no Node backend to host it — "
                "add a node-express backend, or pick a client-reachable database like supabase.",
            )
    elif database["kind"] == "supabase":
        target = backend_dir or (frontend_dir if frontend["kind"] in ("react-vite", "nextjs") else None)
        if target is not None:
            written += copy_template(TEMPLATES / "database/supabase", target, name)
        else:
            written += write_todo(
                out_root / "database",
                "database",
                "Chose supabase but the frontend is plain-html with no bundler — "
                "load @supabase/supabase-js from a CDN script tag instead, or add a build step.",
            )
        env_lines += ["SUPABASE_URL=", "SUPABASE_ANON_KEY="]
    elif database["kind"] == "other":
        written += write_todo(out_root / "database", "database", database.get("notes"))
    # "none" -> nothing to generate

    # --- shared files: .gitignore, .env.example, README.md ---
    gitignore = out_root / ".gitignore"
    gitignore.write_text("node_modules/\n.env\ndist/\n.next/\n", encoding="utf-8")
    written.append(str(gitignore))

    if backend["kind"] == "node-express":
        env_lines = ["PORT=3001"] + env_lines
    if env_lines:
        env_file = out_root / ".env.example"
        env_file.write_text("\n".join(env_lines) + "\n", encoding="utf-8")
        written.append(str(env_file))

    stack_summary = [
        f"- **Frontend:** {frontend['kind']}" + (f" — {frontend.get('notes')}" if frontend['kind'] == 'other' else ""),
        f"- **Backend:** {backend['kind']}" + (f" — {backend.get('notes')}" if backend['kind'] == 'other' else ""),
        f"- **Database:** {database['kind']}" + (f" — {database.get('notes')}" if database['kind'] == 'other' else ""),
    ]

    run_steps = []
    if frontend["kind"] == "plain-html":
        run_steps.append("Open `index.html` in a browser, or serve the root folder with any static server.")
    elif frontend_dir is not None:
        run_steps.append(f"`cd {frontend_dir.relative_to(out_root)} && npm install && npm run dev`")
    if backend_dir is not None:
        run_steps.append(f"`cd {backend_dir.relative_to(out_root)} && npm install && npm start` (then visit `/api/health`)")
    if not run_steps:
        run_steps.append("See the TODO.md file(s) in this folder for manual setup steps.")

    readme = out_root / "README.md"
    readme.write_text(
        f"# {name} — starter scaffold\n\n"
        "Generated by the DEVCON Jumpstart Agent Kit from your ADR's chosen stack. "
        "This is a working hello-world, not your finished product — replace it feature "
        "by feature starting from FR-01 in your PRD (or `mvp-scope.md`'s Build Now list "
        "if you ran `/scope`).\n\n"
        "## What's here\n" + "\n".join(stack_summary) + "\n\n"
        "## Run it\n" + "\n".join(f"{i+1}. {s}" for i, s in enumerate(run_steps)) + "\n\n"
        "## Next steps\n"
        "1. Open your PRD (or mvp-scope.md) and pick your first feature.\n"
        "2. Replace the hello-world page/route with that feature.\n"
        "3. Keep this README's run instructions accurate as you add real setup steps.\n",
        encoding="utf-8",
    )
    written.append(str(readme))

    print(f"WROTE {out_root}/ ({len(written)} files)")
    for w in written:
        print("  -", w)


if __name__ == "__main__":
    main()
