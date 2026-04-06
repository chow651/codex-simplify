#!/usr/bin/env bash
set -euo pipefail

INSTALL_HOME="${SIMPLIFY_INSTALL_HOME:-$HOME}"
REPO_URL="${SIMPLIFY_REPO_URL:-https://github.com/chow651/codex-simplify-plugin.git}"
REPO_SOURCE="${SIMPLIFY_REPO_SOURCE:-}"
WITH_GATE="${SIMPLIFY_WITH_GATE:-0}"

plugin_root="$INSTALL_HOME/plugins/simplify"
marketplace_path="$INSTALL_HOME/.agents/plugins/marketplace.json"
skill_mirror_path="$INSTALL_HOME/.codex/skills/simplify/SKILL.md"
agents_path="$INSTALL_HOME/.codex/AGENTS.md"

mkdir -p "$INSTALL_HOME/plugins"

if [[ -n "$REPO_SOURCE" ]]; then
  rm -rf "$plugin_root"
  mkdir -p "$plugin_root"
  cp -R "$REPO_SOURCE"/. "$plugin_root"/
  rm -rf "$plugin_root/.git"
else
  if [[ -d "$plugin_root/.git" ]]; then
    git -C "$plugin_root" pull --ff-only >/dev/null
  else
    rm -rf "$plugin_root"
    git clone "$REPO_URL" "$plugin_root" >/dev/null
  fi
fi

mkdir -p "$(dirname "$marketplace_path")"
python3 - <<'PY' "$marketplace_path"
import json, pathlib, sys
path = pathlib.Path(sys.argv[1])
entry = {
    "name": "simplify",
    "source": {"source": "local", "path": "./plugins/simplify"},
    "policy": {"installation": "INSTALLED_BY_DEFAULT", "authentication": "ON_INSTALL"},
    "category": "Coding",
}
if path.exists():
    data = json.loads(path.read_text(encoding="utf-8"))
else:
    data = {"name": "neo-local", "interface": {"displayName": "Neo Local"}, "plugins": []}
data.setdefault("plugins", [])
data["plugins"] = [plugin for plugin in data["plugins"] if plugin.get("name") != "simplify"]
data["plugins"].append(entry)
path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
PY

mkdir -p "$(dirname "$skill_mirror_path")"
cp "$plugin_root/skills/simplify/SKILL.md" "$skill_mirror_path"

if [[ "$WITH_GATE" == "1" ]]; then
  mkdir -p "$(dirname "$agents_path")"
  marker="## Simplify Gate"
  snippet_path="$plugin_root/examples/AGENTS.snippet.md"
  if [[ ! -f "$agents_path" ]]; then
    cp "$snippet_path" "$agents_path"
  elif ! grep -Fq "$marker" "$agents_path"; then
    printf '\n\n' >> "$agents_path"
    cat "$snippet_path" >> "$agents_path"
    printf '\n' >> "$agents_path"
  fi
fi

echo "Installed simplify plugin to $plugin_root"
echo "Updated marketplace: $marketplace_path"
echo "Installed visible skill mirror: $skill_mirror_path"
if [[ "$WITH_GATE" == "1" ]]; then
  echo "Installed Simplify Gate into $agents_path"
fi
echo "Restart Codex to load the plugin."
