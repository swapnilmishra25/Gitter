import { resolveRepos } from "../lib/resolveRepos.js";
import { runGitCommand } from "../lib/runGitCommand.js";
import { loadGlobalOptions } from "../utils/config.js";
import { print } from "../lib/themePrint.js";
import { Command } from "commander";

interface PushArgs {
  repoArg?: string;
  remote: string;
  branch: string;
}

const runPushCommand = async ({ repoArg, remote, branch }: PushArgs) => {
  const config = await loadGlobalOptions();
  const p = print(config.theme);
  const repos = await resolveRepos(repoArg, config.repos || []);

  if (!repos.length) {
    p.fail("No repositories found.");
    return;
  }

  for (const repo of repos) {
    await runGitCommand(repo, ["push", remote, branch], config);
  }

  p.success(`Pushed to ${remote}/${branch} in ${repos.length} repos.`);
};

export default function registerPushCommand(program: Command) {
  program
    .command("push [repo] <remote> <branch>")
    .description("Push to a remote branch in selected or all repos")
    .action((repoArg, remote, branch) => {
      runPushCommand({ repoArg, remote, branch });
    });
}
