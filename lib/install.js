const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const SKILL_NAMES = ["using-simplify", "simplify"];
const GATE_MARKER = "## Simplify Gate";

function defaultCodexRoot() {
  return path.join(os.homedir(), ".codex");
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyDir(sourceDir, targetDir) {
  fs.cpSync(sourceDir, targetDir, {
    force: true,
    recursive: true,
  });
}

function appendGateIfNeeded(gateText, agentsPath) {
  const hasAgentsFile = fs.existsSync(agentsPath);
  const currentContent = hasAgentsFile ? fs.readFileSync(agentsPath, "utf8") : "";

  if (currentContent.includes(GATE_MARKER)) {
    return false;
  }

  ensureDir(path.dirname(agentsPath));

  let nextContent = currentContent;
  if (nextContent.length > 0 && !nextContent.endsWith("\n")) {
    nextContent += "\n";
  }
  if (nextContent.length > 0) {
    nextContent += "\n";
  }
  nextContent += gateText.trimEnd() + "\n";

  fs.writeFileSync(agentsPath, nextContent, "utf8");
  return true;
}

function installBundle(options = {}) {
  const packageRoot = options.packageRoot || path.resolve(__dirname, "..");
  const codexRoot = options.codexRoot || defaultCodexRoot();
  const agentsPath = options.agentsPath || path.join(codexRoot, "AGENTS.md");
  const withGate = options.withGate !== false;

  const installedSkills = [];
  const skillsRoot = path.join(codexRoot, "skills");

  ensureDir(skillsRoot);

  for (const skillName of SKILL_NAMES) {
    const sourceDir = path.join(packageRoot, "skills", skillName);
    const targetDir = path.join(skillsRoot, skillName);
    copyDir(sourceDir, targetDir);
    installedSkills.push(targetDir);
  }

  let gateInstalled = false;
  if (withGate) {
    const gatePath = path.join(packageRoot, "examples", "AGENTS.snippet.md");
    const gateText = fs.readFileSync(gatePath, "utf8");
    gateInstalled = appendGateIfNeeded(gateText, agentsPath);
  }

  return {
    agentsPath,
    codexRoot,
    gateInstalled,
    installedSkills,
    withGate,
  };
}

module.exports = {
  defaultCodexRoot,
  installBundle,
};
