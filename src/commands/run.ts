import { loadGlobalOptions } from "../utils/config.js";
import { Command, program } from "commander";
import chalk from "chalk";

const runRunCommand = async (macroName: string) => {
  const config = await loadGlobalOptions();
  const macro = config.macros?.[macroName];

  if (!macro) {
    console.error(chalk.red(`Macro '${macroName}' not found in config.`));
    process.exit(1);
  }

  for (const command of macro) {
    const parts = command.trim().split(" ");
    const cmd = parts[0];
    const args = parts.slice(1);

    const childArgv = ["node", "gitter", cmd, ...args];
    console.log(
      chalk.blueBright(`\n🚀 Running: gitter ${cmd} ${args.join(" ")}`)
    );

    try {
      await program.parseAsync(childArgv, { from: "user" });
    } catch (err: any) {
      console.error(
        chalk.red(`Failed to run command '${cmd}': ${err.message}`)
      );
    }
  }
};

export default function registerRunCommand(program: Command) {
  program
    .command("run <macro>")
    .description("Run a sequence of Git commands defined as a macro in config")
    .action((macroName) => {
      runRunCommand(macroName);
    });
}
