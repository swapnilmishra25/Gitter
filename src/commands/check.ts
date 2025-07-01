import simpleGit from "simple-git";
import Table from "cli-table3";
import { resolveRepos } from "../lib/resolveRepos.js";
import { loadGlobalOptions } from "../utils/config.js";
import { print } from "../lib/themePrint.js";
import { Command } from "commander";

async function runCheckCommand(repoArg?: string) {
  const config = await loadGlobalOptions();
  const repos = await resolveRepos(repoArg, config.repos || []);

  if (!repos.length) {
    print().fail("No repositories found.");
    return;
  }

  const table = new Table({
    head: [
      "Repo",
      "Branch",
      "Status",
      "Ahead",
      "Behind",
      "Detached",
      "Conflicts",
      "Remotes",
    ],
  });

  for (const r of repos) {
    const git = simpleGit(r);
    const repoName = r.split("/").pop() || r;

    try {
      const status = await git.status();
      const remotes = await git.getRemotes(true);

      const isDetached = status.detached ? "⚠️ Yes" : "No";
      const dirty = status.files.length > 0 ? "🔧 Dirty" : "Clean";
      const conflicts =
        status.conflicted.length > 0 ? `${status.conflicted.length}` : "None";
      const remoteNames =
        remotes.length > 0 ? remotes.map((r) => r.name).join(", ") : "None";

      table.push([
        repoName,
        status.current || "N/A",
        dirty,
        status.ahead || "-",
        status.behind || "-",
        isDetached,
        conflicts,
        remoteNames,
      ]);
    } catch (err: any) {
      print().fail(`Failed to check ${repoName}: ${err.message}`);
    }
  }

  console.log(table.toString());
}

export default function registerCheckCommand(program: Command) {
  program
    .command("check [repo]")
    .description("Show Git sync and health status across repos")
    .action(async (repoArg?: string) => {
      await runCheckCommand(repoArg);
    });
}
