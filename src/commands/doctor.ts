import simpleGit from "simple-git";
import { resolveRepos } from "../lib/resolveRepos.js";
import { loadGlobalOptions } from "../utils/config.js";
import { print } from "../lib/themePrint.js";
import { Command } from "commander";

async function runDoctorCommand(repoArg?: string) {
  const config = await loadGlobalOptions();
  const repos = await resolveRepos(repoArg, config.repos || []);
  const p = print(config.theme);

  if (!repos.length) {
    p.fail("No repositories found.");
    return;
  }

  for (const repo of repos) {
    const git = simpleGit(repo);
    const repoName = repo.split("/").pop() || repo;
    p.info(`\nDiagnosing ${p.repo(repoName)}`);

    try {
      const status = await git.status();
      const remotes = await git.getRemotes(true);

      if (status.detached) p.fail("Detached HEAD");
      if (status.conflicted.length)
        p.fail(`Merge conflicts: ${status.conflicted.join(", ")}`);
      if (status.ahead) p.info(`Unpushed commits: ${status.ahead}`);
      if (!remotes.length) p.fail("No remotes configured");
      else p.info(`Remote(s): ${remotes.map((r) => r.refs.fetch).join(", ")}`);
    } catch (err: any) {
      p.fail(`Failed to check ${repoName}: ${err.message}`);
    }
  }
}

export default function registerDoctorCommand(program: Command) {
  program
    .command("doctor [repo]")
    .description("Run Git diagnostics for all repos")
    .action(async (repoArg: string | undefined) => {
      await runDoctorCommand(repoArg);
    });
}
