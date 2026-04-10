const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const { installBundle } = require("../lib/install");

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "codex-simplify-"));
}

test("installBundle copies both skills and appends the simplify gate", () => {
  const tempRoot = makeTempDir();
  const codexRoot = path.join(tempRoot, ".codex");
  const agentsPath = path.join(codexRoot, "AGENTS.md");

  installBundle({
    packageRoot: path.resolve(__dirname, ".."),
    codexRoot,
    agentsPath,
    withGate: true,
  });

  assert.equal(
    fs.existsSync(path.join(codexRoot, "skills", "using-simplify", "SKILL.md")),
    true,
  );
  assert.equal(
    fs.existsSync(path.join(codexRoot, "skills", "simplify", "SKILL.md")),
    true,
  );

  const agentsContent = fs.readFileSync(agentsPath, "utf8");
  assert.match(agentsContent, /## Simplify Gate/);
});

test("installBundle appends the simplify gate only once", () => {
  const tempRoot = makeTempDir();
  const codexRoot = path.join(tempRoot, ".codex");
  const agentsPath = path.join(codexRoot, "AGENTS.md");

  installBundle({
    packageRoot: path.resolve(__dirname, ".."),
    codexRoot,
    agentsPath,
    withGate: true,
  });

  installBundle({
    packageRoot: path.resolve(__dirname, ".."),
    codexRoot,
    agentsPath,
    withGate: true,
  });

  const agentsContent = fs.readFileSync(agentsPath, "utf8");
  const gateMatches = agentsContent.match(/## Simplify Gate/g) || [];
  assert.equal(gateMatches.length, 1);
});

test("installBundle skips AGENTS.md updates when --no-gate behavior is requested", () => {
  const tempRoot = makeTempDir();
  const codexRoot = path.join(tempRoot, ".codex");
  const agentsPath = path.join(codexRoot, "AGENTS.md");

  installBundle({
    packageRoot: path.resolve(__dirname, ".."),
    codexRoot,
    agentsPath,
    withGate: false,
  });

  assert.equal(
    fs.existsSync(path.join(codexRoot, "skills", "using-simplify", "SKILL.md")),
    true,
  );
  assert.equal(fs.existsSync(agentsPath), false);
});
