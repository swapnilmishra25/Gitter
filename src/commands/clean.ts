import { Command } from "commander";
import { resolveRepos } from "../lib/resolveRepos.js";
import { runGitCommand } from "../lib/runGitCommand.js";
import { loadGlobalOptions } from "../utils/config.js";
import inquirer from "inquirer";
import { print } from "../lib/themePrint.js";

async function runCleanCommand(repoArg: string | undefined, force?: boolean) {
  const config = await loadGlobalOptions();
  const repos = await resolveRepos(repoArg, config.repos || []);
  const p = print(config.theme);

  if (!repos.length) {
    p.fail("No git repositories found.");
    return;
  }

  if (!force) {
    const { confirmed } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirmed",
        message: "This will delete untracked files and reset changes. Proceed?",
        default: false,
      },
    ]);

    if (!confirmed) {
      p.info("Aborted by user.");
      return;
    }
  }

  for (const repo of repos) {
    await runGitCommand(repo, ["clean", "-fd"], config);
    await runGitCommand(repo, ["reset", "--hard"], config);
  }

  p.success("Cleaned all selected repositories.");
}

export default function registerCleanCommand(program: Command) {
  program
    .command("clean [repo]")
    .description("Clean untracked files and reset working directory")
    .option("--force", "Skip confirmation prompt")
    .action(
      async (repoArg: string | undefined, options: { force?: boolean }) => {
        await runCleanCommand(repoArg, options.force);
      }
    );
}
