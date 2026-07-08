#!/usr/bin/env bash
# Make the REPO ROOT runnable for an AI CLI, so you open the tool at the repo
# root and the commands/agents/skills are already there — no cd into adapters.
# It symlinks the portable core/ + the chosen tool's adapter into the root.
# Usage: ./scripts/install.sh [opencode|claude|cursor|all]   (default: opencode)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"

link() {  # link <target> <linkname> — replace any existing symlink/dir cleanly
  rm -rf "$2"
  ln -sfn "$1" "$2"
}

link_skills() {  # link_skills <destination skills dir>
  mkdir -p "$1"
  for s in "$ROOT"/core/skills/*/; do
    link "$s" "$1/$(basename "$s")"
  done
}

install_opencode() {
  local d="$ROOT/.opencode"; mkdir -p "$d"
  link "$ROOT/adapters/opencode/.opencode/agent"   "$d/agent"
  link "$ROOT/adapters/opencode/.opencode/command" "$d/command"
  link_skills "$d/skills"
  link "$ROOT/adapters/opencode/opencode.json" "$ROOT/opencode.json"
  link "$ROOT/core/AGENTS.md" "$ROOT/AGENTS.md"
  echo "opencode: root ready — .opencode/{agent,command,skills}, opencode.json, AGENTS.md"
}

install_claude() {
  local d="$ROOT/.claude"; mkdir -p "$d"
  link "$ROOT/adapters/claude-code/.claude/agents"   "$d/agents"
  link "$ROOT/adapters/claude-code/.claude/commands" "$d/commands"
  link_skills "$d/skills"
  link "$ROOT/core/AGENTS.md" "$ROOT/CLAUDE.md"
  link "$ROOT/core/AGENTS.md" "$ROOT/AGENTS.md"
  echo "claude: root ready — .claude/{agents,commands,skills}, CLAUDE.md, AGENTS.md"
}

install_cursor() {
  local d="$ROOT/.cursor"; mkdir -p "$d"
  link "$ROOT/adapters/cursor/.cursor/rules"    "$d/rules"
  link "$ROOT/adapters/cursor/.cursor/commands" "$d/commands"
  link_skills "$d/skills"
  link "$ROOT/core/AGENTS.md" "$ROOT/AGENTS.md"
  echo "cursor: root ready — .cursor/{rules,commands,skills}, AGENTS.md"
}

TOOL="${1:-opencode}"
case "$TOOL" in
  opencode) install_opencode ;;
  claude)   install_claude ;;
  cursor)   install_cursor ;;
  all)      install_opencode; install_claude; install_cursor ;;
  *) echo "unknown tool: $TOOL (use opencode|claude|cursor|all)"; exit 1 ;;
esac
echo "Done. Open your tool at the repo root: $ROOT"
