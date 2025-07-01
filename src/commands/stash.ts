import { loadGlobalOptions } from "../utils/config.js";
import { resolveRepos } from "../lib/resolveRepos.js";
import { runGitCommand } from "../lib/runGitCommand.js";
import { print } from "../lib/themePrint.js";
import { Command } from "commander";

const runStashCommand = async (repoArg?: string) => {
  const config = await loadGlobalOptions();
  const repos = await resolveRepos(repoArg, config.repos || []);
  const p = print(config.theme);

  if (!repos.length) {
    p.fail("No Git repositories found.");
    return;
  }

  for (const repo of repos) {
    await runGitCommand(repo, ["stash"], config);
  }

  p.success("Stashed changes in all selected repositories.");
};

export default function registerStashCommand(program: Command) {
  program
    .command("stash [repo]")
    .description("Stash changes in all repositories")
    .action((repoArg?: string) => {
      runStashCommand(repoArg);
    });
}
