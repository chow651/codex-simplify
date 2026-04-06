# Codex Simplify Plugin

[中文说明](./README.zh-CN.md)

`simplify` is a Codex plugin and skill for final code cleanup review.

It is designed for the end of a coding task, not the beginning. The goal is to review the current diff from three angles and tighten the result before you treat the work as finished:

- reuse
- quality
- efficiency

## What it includes

- `.codex-plugin/plugin.json`
- `skills/simplify/SKILL.md`

## Install

One-command install on Windows PowerShell:

```powershell
irm https://raw.githubusercontent.com/chow651/codex-simplify-plugin/master/scripts/install.ps1 | iex
```

One-command install on macOS/Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/chow651/codex-simplify-plugin/master/scripts/install.sh | bash
```

Install with the optional completion gate enabled:

Windows PowerShell:

```powershell
& ([scriptblock]::Create((irm https://raw.githubusercontent.com/chow651/codex-simplify-plugin/master/scripts/install.ps1))) -WithGate
```

macOS/Linux:

```bash
curl -fsSL https://raw.githubusercontent.com/chow651/codex-simplify-plugin/master/scripts/install.sh | SIMPLIFY_WITH_GATE=1 bash
```

What the installer does:

- installs or updates the plugin at `~/plugins/simplify`
- updates `~/.agents/plugins/marketplace.json`
- installs a visible skill mirror at `~/.codex/skills/simplify/SKILL.md`
- optionally appends the completion gate to `~/.codex/AGENTS.md`

## Optional completion gate

If you prefer to install the completion gate manually, use the snippet at [examples/AGENTS.snippet.md](./examples/AGENTS.snippet.md).

This keeps the trigger scoped to code-task completion instead of letting the skill fire on unrelated conversations.

## Usage

Manual use:

- invoke `simplify` from the skill picker or command surface

Recommended behavior:

- use it only after code changes exist
- keep the review focused on the current diff
- use it as a cleanup gate, not as a general-purpose code review tool
