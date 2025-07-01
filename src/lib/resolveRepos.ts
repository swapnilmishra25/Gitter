import fs from "fs";
import path from "path";

export const resolveRepos = async (
  cliRepoArg: string | undefined,
  configRepos: string[]
): Promise<string[]> => {
  if (configRepos.length) return configRepos.map(getFullPath);

  if (!cliRepoArg) return getAllRepos();

  const fullPath = getFullPath(cliRepoArg);
  const stat = await fs.promises.stat(fullPath);

  if (!stat.isDirectory()) {
    console.error(`${cliRepoArg} is not a directory`);
    process.exit(1);
  }

  if (fs.existsSync(path.join(fullPath, ".git"))) return [fullPath];

  return fs
    .readdirSync(fullPath)
    .map((name) => path.join(fullPath, name))
    .filter((dir) => fs.existsSync(path.join(dir, ".git")));
};

const getFullPath = (p: string) =>
  path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);

const getAllRepos = (): string[] => {
  return fs
    .readdirSync(process.cwd())
    .map((name) => path.join(process.cwd(), name))
    .filter((dir) => fs.existsSync(path.join(dir, ".git")));
};
