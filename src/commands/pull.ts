import { runGitCommand } from "../lib/runGitCommand.js";
import { resolveRepos } from "../lib/resolveRepos.js";
import { loadGlobalOptions } from "../utils/config.js";
import { print } from "../lib/themePrint.js";
import { Command } from "commander";

const runPullCommand = async (
  repoArg: string | undefined,
  remote: string,
  branch: string
) => {
  const config = await loadGlobalOptions();
  const repos = await resolveRepos(repoArg, config.repos || []);
  const p = print(config.theme);

  if (!repos.length) {
    p.fail("No repositories found.");
    return;
  }

  for (const repo of repos) {
    await runGitCommand(repo, ["pull", remote, branch], config);
  }

  p.success(`Pulled from ${remote}/${branch} in ${repos.length} repos.`);
};

export default function registerPullCommand(program: Command) {
  program
    .command("pull [repo] <remote> <branch>")
    .description("Pull from a remote branch")
    .action((repoArg, remote, branch) => {
      runPullCommand(repoArg, remote, branch);
    });
}
