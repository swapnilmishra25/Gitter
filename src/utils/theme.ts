import chalk from "chalk";
import type { Theme } from "../types";

export const themePrint = (theme: Theme = {}) => {
  return {
    success: (msg: string) =>
      console.log(chalk[theme.success ?? "greenBright"](msg)),
    fail: (msg: string) => console.log(chalk[theme.fail ?? "red"](msg)),
    info: (msg: string) => console.log(chalk[theme.info ?? "cyan"](msg)),
    repo: (msg: string) => chalk[theme.repo ?? "blue"](msg),
    cmd: (msg: string) => chalk[theme.cmd ?? "gray"](msg),
  };
};
