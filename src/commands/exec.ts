import { Command } from "commander";
import pLimit from "p-limit";
import { getRepos } from "../lib/getRepos.js";
import { runGitCommand } from "../lib/runGitCommand.js";
import { loadGlobalOptions } from "../utils/config.js";
import { print } from "../lib/themePrint.js";

export default function registerExecCommand(program: Command) {
  program
    .command("exec <cmd>")
    .description("Run any custom Git command across all repos")
    .action(async (cmd: string) => {
      const config = await loadGlobalOptions();
      const p = print(config.theme);

      const repos = getRepos();
      if (!repos.length) {
        p.fail("No Git repositories found.");
        return;
      }

      const cmdParts = cmd.split(" ").filter(Boolean);
      const limit = pLimit(config.parallel ? 5 : 1);

      await Promise.all(
        repos.map((repo) => limit(() => runGitCommand(repo, cmdParts, config)))
      );
    });
}
