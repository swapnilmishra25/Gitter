import inquirer from "inquirer";
import simpleGit from "simple-git";
import { runGitCommand } from "../lib/runGitCommand.js";
import { resolveRepos } from "../lib/resolveRepos.js";
import { loadGlobalOptions } from "../utils/config.js";
import { print } from "../lib/themePrint.js";
import { Command } from "commander";

async function runCommitCommand(
  repoArg: string | undefined,
  messageArg: string | undefined,
  auto: boolean
) {
  const config = await loadGlobalOptions();
  const repos = await resolveRepos(repoArg, config.repos || []);
  const p = print(config.theme);

  if (!repos.length) {
    p.fail("No git repositories found.");
    return;
  }

  for (const repo of repos) {
    let commitMsg = messageArg;

    if (auto) {
      const git = simpleGit(repo);
      const changedFiles = (await git.diff(["--name-only"]))
        .split("\n")
        .filter(Boolean)
        .map((f) => f.split("/")[0])
        .filter((v, i, a) => a.indexOf(v) === i);

      if (!changedFiles.length) {
        p.info(`⚠️ No changes to commit in ${repo}`);
        continue;
      }

      const defaultMsg = `chore: update ${changedFiles.join(", ")}`;
      const { finalMsg } = await inquirer.prompt([
        {
          type: "input",
          name: "finalMsg",
          message: `Generated message for ${repo}:`,
          default: defaultMsg,
        },
      ]);

      commitMsg = finalMsg;
    }

    if (!commitMsg) {
      p.fail(`Commit message missing for ${repo}`);
      continue;
    }

    await runGitCommand(repo, ["commit", "-m", commitMsg], config);
  }
}

export default function registerCommitCommand(program: Command) {
  program
    .command("commit [repo] [message]")
    .description("Commit changes with a message")
    .option("--auto", "Auto-generate commit message from file changes")
    .action(
      async (
        repoArg: string | undefined,
        msgArg: string | undefined,
        options: { auto?: boolean }
      ) => {
        await runCommitCommand(repoArg, msgArg, options.auto ?? false);
      }
    );
}
