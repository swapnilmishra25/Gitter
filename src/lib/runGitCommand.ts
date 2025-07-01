import simpleGit from "simple-git";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import type { GitterOptions } from "../types/index.js";
import { themePrint } from "../utils/theme.js";
import { loadConfig } from "./loadConfig.js";

const config = await loadConfig();

export const runGitCommand = async (
  repoPath: string,
  commandArgs: string[],
  options: GitterOptions
) => {
  const git = simpleGit(repoPath);
  const cmdStr = `git ${commandArgs.join(" ")}`;
  const log = themePrint(config.theme);

  log.info(`\n[${repoPath}] ${log.cmd(cmdStr)}`);

  if (options.dryRun) {
    log.info("[DRY RUN] Command skipped");
    if (options.log) appendToLog(`[DRY RUN] ${repoPath} ${cmdStr}`);
    return;
  }

  try {
    if (options.pre) {
      await git.raw(options.pre.split(" "));
    }
    const result = await git.raw(commandArgs);
    log.success("Success");
    if (options.log) appendToLog(`[${repoPath}] ${cmdStr}\n${result}`);
  } catch (err: any) {
    log.fail(`Failed: ${err.message}`);
    if (options.log) appendToLog(`[${repoPath}] ${cmdStr}\n ${err.message}`);
  }
};

const appendToLog = (line: string) => {
  fs.appendFileSync(path.resolve(process.cwd(), "gitter.log"), line + "\n");
};
