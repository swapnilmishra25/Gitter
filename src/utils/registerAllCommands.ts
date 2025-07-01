import { Command } from "commander";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export async function registerAllCommands(program: Command) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const commandsDir = path.join(__dirname, "../commands");

  const files = fs
    .readdirSync(commandsDir)
    .filter(
      (file) =>
        (file.endsWith(".ts") || file.endsWith(".js")) &&
        !file.endsWith(".d.ts")
    );

  for (const file of files) {
    const filePath = path.join(commandsDir, file);
    const module = await import(filePath);
    const register = module.default;

    if (typeof register === "function") {
      register(program);
    } else {
      console.warn(`Command file ${file} doesn't export a default function`);
    }
  }
}
