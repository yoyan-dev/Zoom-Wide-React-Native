const { spawn } = require("child_process");
const path = require("path");

const expoBin = path.join(
  __dirname,
  "..",
  "node_modules",
  "expo",
  "bin",
  "cli"
);

const child = spawn(process.execPath, [expoBin, "start", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: {
    ...process.env,
    EXPO_NO_CACHE: "1",
    EXPO_NO_DEPENDENCY_VALIDATION: "1",
    EXPO_NO_TELEMETRY: "1",
    EXPO_OFFLINE: "1",
  },
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
