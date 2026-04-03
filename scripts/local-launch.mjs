import { existsSync, copyFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawn } from "node:child_process";

const projectRoot = process.cwd();
const nodeModulesPath = resolve(projectRoot, "node_modules");
const envExamplePath = resolve(projectRoot, ".env.example");
const envLocalPath = resolve(projectRoot, ".env.local");

function run(command, args, options = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
      shell: process.platform === "win32",
      stdio: "inherit",
      ...options,
    });

    child.on("error", rejectPromise);
    child.on("exit", (code) => {
      if (code === 0) {
        resolvePromise();
        return;
      }
      rejectPromise(new Error(`${command} ${args.join(" ")} failed with code ${code ?? "unknown"}`));
    });
  });
}

function openBrowser(url) {
  if (!url) return;

  if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref();
    return;
  }

  if (process.platform === "darwin") {
    spawn("open", [url], { detached: true, stdio: "ignore" }).unref();
    return;
  }

  spawn("xdg-open", [url], { detached: true, stdio: "ignore" }).unref();
}

async function ensureProjectReady() {
  if (!existsSync(nodeModulesPath)) {
    console.log("Installing dependencies for first run...");
    await run("npm", ["install"]);
  }

  if (!existsSync(envLocalPath) && existsSync(envExamplePath)) {
    copyFileSync(envExamplePath, envLocalPath);
    console.log("Created .env.local from .env.example.");
  }
}

async function startDevServer() {
  const child = spawn("npm", ["run", "dev"], {
    cwd: projectRoot,
    shell: process.platform === "win32",
    stdio: ["inherit", "pipe", "pipe"],
  });

  let opened = false;

  const readAndForward = (chunk) => {
    const text = chunk.toString();
    process.stdout.write(text);

    if (!opened) {
      const match = text.match(/- Local:\s*(http:\/\/[^\s]+)/);
      if (match?.[1]) {
        opened = true;
        openBrowser(match[1]);
      }
    }
  };

  child.stdout.on("data", readAndForward);
  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk.toString());
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      process.exit(code ?? 1);
    }
  });
}

async function main() {
  await ensureProjectReady();
  await startDevServer();
}

main().catch((error) => {
  console.error("Local launch failed:", error.message);
  process.exit(1);
});
