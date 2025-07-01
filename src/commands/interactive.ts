import ora from "ora";
import simpleGit from "simple-git";
import { getRepos } from "../lib/getRepos.js";
import { loadGlobalOptions } from "../utils/config.js";
import { print } from "../lib/themePrint.js";
import { runGitCommand } from "../lib/runGitCommand.js";
import { saveHistory, loadHistory } from "../lib/history.js";
import inquirer from "inquirer";
import { Command } from "commander";

async function runInteractive() {
  const config = await loadGlobalOptions();
  const p = print(config.theme);

  const allRepos = getRepos();
  if (allRepos.length === 0) {
    p.fail("No repositories found.");
    return;
  }

  const saved = loadHistory();
  const { selectedRepos } = await inquirer.prompt({
    type: "checkbox",
    name: "selectedRepos",
    message: "Select repositories",
    choices: allRepos.map((r) => ({
      name: r,
      value: r,
      checked: saved.includes(r),
    })),
  });

  if (selectedRepos.length === 0) {
    p.fail("No repositories selected.");
    return;
  }

  saveHistory(selectedRepos);

  const { action } = await inquirer.prompt({
    type: "list",
    name: "action",
    message: "Choose Git action to perform",
    choices: ["status", "pull", "push", "commit", "checkout", "exec"],
  });

  let extraArgs: string[] = [];

  if (action === "commit") {
    const { commitMsg } = await inquirer.prompt({
      type: "input",
      name: "commitMsg",
      message: "Enter commit message:",
      validate: (input: string) => {
        if (!input.trim()) {
          return "Commit message cannot be empty";
        }
        return true;
      },
    });
    extraArgs = ["-m", commitMsg];
  } else if (action === "checkout") {
    const { branch } = await inquirer.prompt({
      type: "input",
      name: "branch",
      message: "Enter branch name:",
      validate: (input: string) => {
        if (!input.trim()) {
          return "Branch name cannot be empty";
        }
        return true;
      },
    });
    extraArgs = [branch];
  } else if (action === "exec") {
    const { cmd } = await inquirer.prompt({
      type: "input",
      name: "cmd",
      message: "Enter custom git command:",
      validate: (input: string) => {
        if (!input.trim()) {
          return "Command cannot be empty";
        }
        return true;
      },
    });
    extraArgs = cmd.trim().split(/\s+/);
  }

  for (const repo of selectedRepos) {
    const spinner = ora(`${repo}: Running ${action}...`).start();
    const git = simpleGit(repo);

    try {
      if (action === "status") {
        const status = await git.status();
        spinner.succeed(
          `${repo}: ${status.current} — ${
            status.files.length > 0 ? "Dirty" : "Clean"
          }`
        );
      } else if (action === "commit") {
        // Check if there are staged changes before committing
        const status = await git.status();
        if (status.staged.length === 0) {
          spinner.warn(`${repo}: No staged changes to commit`);
          continue;
        }
        await git.commit(extraArgs[1]);
        spinner.succeed(`${repo}: Commit successful`);
      } else if (action === "exec") {
        await git.raw(extraArgs);
        spinner.succeed(`${repo}: Executed custom command`);
      } else {
        await git.raw([action, ...extraArgs]);
        spinner.succeed(`${repo}: ${action} done`);
      }
    } catch (err: any) {
      spinner.fail(`${repo}: Failed — ${err.message || "Unknown error"}`);
    }
  }
}

export default function registerInteractiveCommand(program: Command) {
  program
    .command("interactive")
    .description("Interactive mode to run Git actions on selected repos")
    .action(runInteractive);
}
