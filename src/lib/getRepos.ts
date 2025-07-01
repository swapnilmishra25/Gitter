import { readdirSync, existsSync } from "fs";
import { join } from "path";

export const getRepos = (): string[] => {
  const cwd = process.cwd();
  return readdirSync(cwd)
    .map((dir) => join(cwd, dir))
    .filter((dirPath) => existsSync(join(dirPath, ".git")));
};
