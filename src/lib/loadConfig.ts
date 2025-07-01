import { cosmiconfig } from "cosmiconfig";
import chalk from "chalk";
import { defaultTheme } from "./themePrint.js";
import { GitterOptions } from "../types/index.js";
import { program } from "commander";

const explorer = cosmiconfig("gitter");

export const loadConfig = async (): Promise<GitterOptions> => {
  const opts = program.opts();
  let fileConfig = {};
  if (opts.config) {
    try {
      const result = await explorer.load(opts.config);
      fileConfig = result?.config || {};
    } catch (err: any) {
      console.error(chalk.red(`Failed to load config: ${err.message}`));
      process.exit(1);
    }
  }

  return {
    ...fileConfig,
    ...opts,
    theme: {
      ...defaultTheme,
      ...(fileConfig as any).theme,
    },
  };
};
