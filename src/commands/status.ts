import simpleGit from "simple-git";
import Table from "cli-table3";
import { resolveRepos } from "../lib/resolveRepos.js";
import { loadGlobalOptions } from "../utils/config.js";
import { print } from "../lib/themePrint.js";
import { Command } from "commander";

const runStatusCommand = async (repoArg?: string) => {
  const config = await loadGlobalOptions();
  const repos = await resolveRepos(repoArg, config.repos || []);
  const p = print(config.theme);

  if (!repos.length) {
    p.fail("No repositories found.");
    return;
  }

  const table = new Table({
    head: ["Repo", "Branch", "Status", "Changed Files"],
  });

  for (const repo of repos) {
    const git = simpleGit(repo);
    const repoName = repo.split("/").pop() || repo;

    try {
      const status = await git.status();
      const isDirty = status.files.length > 0;
      const currentBranch = status.current || "N/A";

      table.push([
        repoName,
        currentBranch,
        isDirty ? "Dirty" : "Clean",
        status.files.length,
      ]);
    } catch (err: any) {
      p.fail(`Failed to get status of ${repoName}: ${err.message}`);
    }
  }

  console.log(table.toString());
};

export default function registerStatusCommand(program: Command) {
  program
    .command("status [repo]")
    .description("Check git status across repositories")
    .action((repoArg?: string) => {
      runStatusCommand(repoArg);
    });
}
