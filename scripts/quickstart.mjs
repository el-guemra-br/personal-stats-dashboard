import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const envExamplePath = resolve(process.cwd(), ".env.example");
const envLocalPath = resolve(process.cwd(), ".env.local");

if (!existsSync(envExamplePath)) {
  console.error("Could not find .env.example. Run this from the project root.");
  process.exit(1);
}

let envText = existsSync(envLocalPath)
  ? readFileSync(envLocalPath, "utf8")
  : readFileSync(envExamplePath, "utf8");

const rl = createInterface({ input, output });

const username = (await rl.question("GitHub username (required): ")).trim();
const name = (await rl.question("Dashboard name (optional): ")).trim();

rl.close();

if (!username) {
  console.error("GitHub username is required.");
  process.exit(1);
}

function upsertEnv(key, value) {
  const escapedValue = value.replace(/\\/g, "\\\\");
  const line = `${key}=${escapedValue}`;
  const pattern = new RegExp(`^${key}=.*$`, "m");

  if (pattern.test(envText)) {
    envText = envText.replace(pattern, line);
  } else {
    envText += `\n${line}`;
  }
}

upsertEnv("GITHUB_USERNAME", username);
if (name) {
  upsertEnv("DASHBOARD_NAME", name);
}

writeFileSync(envLocalPath, envText, "utf8");

console.log("\nSetup complete.");
console.log(`Created/updated: ${envLocalPath}`);
console.log("Next step: run npm run dev");
