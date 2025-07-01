import { program } from "commander";
import pLimit from "p-limit";
import { runGitCommand } from "../lib/runGitCommand.js";
import { loadConfig } from "../lib/loadConfig.js";
import { resolveRepos } from "../lib/resolveRepos.js";
import { buildArgs } from "./buildArgs.js";

type Options = {
  dryRun?: boolean;
  log?: boolean;
  parallel?: boolean;
  pre?: string;
  config?: string;
  repos?: string[];
};

export function createGitCommandHandler<T extends any[]>(
  argNames: string[],
  argsBuilder: (...args: T) => string[]
) {
  return async (...args: [...T, any]) => {
    const cliRepoArg = args[0];
    const actualArgs = args.slice(1, argNames.length - 1) as T;

    const cliOptions = program.opts<Options>();
    const config = await loadConfig();
    const options = { ...cliOptions, ...config };

    const repos = await resolveRepos(cliRepoArg, options.repos || []);

    if (!repos.length) {
      console.log(`No Git repositories found`);
      return;
    }

    const limit = pLimit(options.parallel ? 5 : 1);

    await Promise.all(
      repos.map((repo) =>
        limit(() =>
          runGitCommand(repo, buildArgs(...actualArgs), {
            dryRun: options.dryRun,
            log: options.log,
            pre: options.pre,
          })
        )
      )
    );
  };
}
