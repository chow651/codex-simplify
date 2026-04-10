#!/usr/bin/env node

const path = require("node:path");
const { installBundle } = require("../lib/install");

function printHelp() {
  console.log("Usage: codex-simplify install [--no-gate] [--target <codex-dir>] [--agents <agents-file>]");
}

function parseInstallArgs(args) {
  const options = {
    withGate: true,
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--no-gate") {
      options.withGate = false;
      continue;
    }

    if (arg === "--target") {
      index += 1;
      if (!args[index]) {
        throw new Error("Missing value for --target");
      }
      options.codexRoot = path.resolve(args[index]);
      continue;
    }

    if (arg === "--agents") {
      index += 1;
      if (!args[index]) {
        throw new Error("Missing value for --agents");
      }
      options.agentsPath = path.resolve(args[index]);
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return options;
}

function main(argv = process.argv.slice(2)) {
  const [command, ...rest] = argv;

  if (!command || command === "--help" || command === "-h" || command === "help") {
    printHelp();
    return 0;
  }

  if (command !== "install") {
    throw new Error(`Unknown command: ${command}`);
  }

  const packageRoot = path.resolve(__dirname, "..");
  const result = installBundle({
    packageRoot,
    ...parseInstallArgs(rest),
  });

  console.log(`Installed skills to ${path.join(result.codexRoot, "skills")}`);
  if (result.withGate) {
    if (result.gateInstalled) {
      console.log(`Appended Simplify Gate to ${result.agentsPath}`);
    } else {
      console.log(`Simplify Gate already present in ${result.agentsPath}`);
    }
  } else {
    console.log("Skipped AGENTS.md gate update");
  }

  return 0;
}

try {
  process.exitCode = main();
} catch (error) {
  console.error(`codex-simplify: ${error.message}`);
  printHelp();
  process.exitCode = 1;
}
