import { loadGlobalOptions } from "../utils/config.js";
import { resolveRepos } from "../lib/resolveRepos.js";
import { runGitCommand } from "../lib/runGitCommand.js";
import { print } from "../lib/themePrint.js";
import { Command } from "commander";

const runStashApplyCommand = async (repoArg?: string) => {
  const config = await loadGlobalOptions();
  const repos = await resolveRepos(repoArg, config.repos || []);
  const p = print(config.theme);

  if (!repos.length) {
    p.fail("No Git repositories found.");
    return;
  }

  for (const repo of repos) {
    await runGitCommand(repo, ["stash", "apply"], config);
  }

  p.success("Applied stashed changes in all selected repositories.");
};

export default function registerStashApplyCommand(program: Command) {
  program
    .command("stash-apply [repo]")
    .description("Apply stashed changes in all repositories")
    .action((repoArg?: string) => {
      runStashApplyCommand(repoArg);
    });
}
