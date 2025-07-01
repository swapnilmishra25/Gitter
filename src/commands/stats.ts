import simpleGit from "simple-git";
import { resolveRepos } from "../lib/resolveRepos.js";
import { loadGlobalOptions } from "../utils/config.js";
import { print } from "../lib/themePrint.js";
import Table from "cli-table3";
import prettyBytes from "pretty-bytes";
import { execSync } from "child_process";
import { Command } from "commander";

const runStatsCommand = async (repoArg?: string) => {
  const config = await loadGlobalOptions();
  const repos = await resolveRepos(repoArg, config.repos || []);
  const p = print(config.theme);

  if (!repos.length) {
    p.fail("No repositories found.");
    return;
  }

  const stats: {
    repo: string;
    commits: number;
    authors: number;
    size: number;
  }[] = [];

  const table = new Table({
    head: ["Repo", "Commits (7d)", "Authors", "Size"],
  });

  for (const repo of repos) {
    const git = simpleGit(repo);
    const repoName = repo.split("/").pop() || repo;

    try {
      const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0];
      const log = await git.log([`--since=${since}`]);
      const authors = new Set(log.all.map((c) => c.author_email));

      const sizeOutput = execSync(`du -sk "${repo}"`).toString();
      const sizeInBytes = parseInt(sizeOutput.split("\t")[0]) * 1024;

      stats.push({
        repo: repoName,
        commits: log.total,
        authors: authors.size,
        size: sizeInBytes,
      });

      table.push([repoName, log.total, authors.size, prettyBytes(sizeInBytes)]);
    } catch (err: any) {
      p.fail(`Failed to read stats for ${repoName}: ${err.message}`);
    }
  }

  console.log(table.toString());

  if (stats.length === 0) {
    p.info("No stats collected. Possibly all repos failed.");
    return;
  }

  console.log("\nTop 3 active repos (by commits this week):");
  stats
    .sort((a, b) => b.commits - a.commits)
    .slice(0, 3)
    .forEach((s, i) => {
      console.log(`${i + 1}. ${s.repo} - ${s.commits} commits`);
    });

  const largest = stats.reduce(
    (max, s) => (s.size > max.size ? s : max),
    stats[0]
  );
  console.log(`\nLargest repo: ${largest.repo} (${prettyBytes(largest.size)})`);
};

export default function registerStatsCommand(program: Command) {
  program
    .command("stats [repo]")
    .description("View Git commit analytics across repositories")
    .action((repoArg?: string) => {
      runStatsCommand(repoArg);
    });
}
